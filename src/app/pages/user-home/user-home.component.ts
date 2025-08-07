import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AttendanceService } from './../../../services/attendance.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HolidayService } from './../../../services/holidays.service';
import { ApplyLeavesService } from '../../../services/apply-leaves.service';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css',
})
export class UserHomeComponent implements OnInit, OnDestroy {
  timeString: string = '';
  currentDate: string = '';
  isSignedIn: boolean = false;
  signInTime: string = '';
  leaveInfo: any = {};
  holidays: any[] = [];
  userTasks: any[] = [];
  private intervalId: any;

  attendanceData = {
    employeeId:
      JSON.parse(localStorage.getItem('userData') || '{}').EmployeeId || '',
    location: '',
    remarks: '',
    time: '',
  };

  employeeId = JSON.parse(localStorage.getItem('userData') || '{}').EmployeeId || '';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private AttendanceService: AttendanceService,
    private holidayService: HolidayService,
    private applyLeaveService: ApplyLeavesService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.updateTime();
    this.updateDate();
    this.intervalId = setInterval(() => this.updateTime(), 1000);
    this.getHolidays();
    this.getStatus();
    this.signInTime = localStorage.getItem('signInTime') || '-'; // ✅ Load saved time

    this.applyLeaveService
      .getLeaveStatusDetailsByEmployeeId(this.employeeId)
      .subscribe({
        next: (data) => {
          this.leaveInfo = data;
        },
        error: (err) => console.error('Leave status error:', err),
      });

     this.taskService.getTasksByEmployeeId(this.employeeId).subscribe(tasks => {
    this.userTasks = tasks;

    this.taskService.setTasks(tasks);  // optional, if syncing across app
  });




  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  updateTime(): void {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    this.timeString = `${hours}:${minutes}:${seconds}`;
  }

  updateDate(): void {
    const now = new Date();
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    } as const;
    this.currentDate = now.toLocaleDateString('en-GB', options);
  }

  signIn() {
    if (!this.attendanceData.location) {
      this.toastr.warning('Please enter location');
      return;
    }

    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-GB', { hour12: false });

    this.attendanceData.time = formattedTime;

    this.AttendanceService.signIn(this.attendanceData).subscribe({
      next: () => {
        this.isSignedIn = true;
        this.signInTime = formattedTime; // ✅ Update and store time
        localStorage.setItem('signInTime', formattedTime);
        this.toastr.success('Sign-in successful!', 'Success');
        // close bootrsp model
        // const modalElement = document.getElementById('workLocationModal');
        // if (modalElement) {
        //   const modal = new (window as any).bootstrap.Modal(modalElement);
        //   modal.hide();
        // }
      },
      error: (err) => {
        let errorMessage = 'An error occurred';
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          }
        }
        this.toastr.error(errorMessage, 'Error');
      },
    });
  }

  signOut() {
    this.AttendanceService.signOut(this.attendanceData.employeeId).subscribe({
      next: () => {
        this.toastr.success('Sign-out successful!', 'Success');
        this.isSignedIn = false;
        // ✅ Optional: don't remove signInTime to persist in modal
        // localStorage.removeItem('signInTime');
      },
      error: (err) => {
        this.toastr.error(err.error || 'Error during sign-out');
      },
    });
  }

  getStatus() {
    this.AttendanceService.getStatus(this.attendanceData.employeeId).subscribe({
      next: (res: any[]) => {
        const signedInRecord = res.find((a) => a.issingin === 'TRUE');
        this.isSignedIn = !!signedInRecord;
      },
      error: () => {
        this.isSignedIn = false;
      },
    });
  }

 getHolidays() {
  this.holidayService.getHolidays().subscribe({
    next: (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Remove time

      // Filter and sort upcoming holidays
      this.holidays = data
        .filter((holiday: any) => new Date(holiday.date) >= today)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },
    error: (err) => {
      console.error('Failed to fetch holidays:', err);
    }
  });
}

  openSwipeModal() {
    const modalElement = document.getElementById('swipeModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }
}
