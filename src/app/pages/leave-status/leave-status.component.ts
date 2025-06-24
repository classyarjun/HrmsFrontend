import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeavestatusService } from '../../../services/leavestatus.service';

@Component({
  selector: 'app-leave-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-status.component.html',
  styleUrl: './leave-status.component.css',
})
export class LeaveStatusComponent implements OnInit {
  employeeId =
    JSON.parse(localStorage.getItem('userData') || '{}').EmployeeId || 0;
  leaveBalance: any = {};
  totalApprovedLeaves = 0;
  latestLeaveStatus: string = '';
  latestLeaveDate: string = '';

  constructor(private LeavestatusService: LeavestatusService) {}

  ngOnInit(): void {
    this.fetchLeaveBalance();
    this.fetchLatestLeaveStatus();
  }

  fetchLeaveBalance(): void {
    this.LeavestatusService.getLeaveBalance(this.employeeId).subscribe({
      next: (data: any) => {
        this.leaveBalance = data;
        this.calculateTotalApproved();
      },
      error: (err) => {
        console.error('Error fetching leave balance:', err);
      },
    });
  }

  fetchLatestLeaveStatus(): void {
    this.LeavestatusService.getAllLeaves().subscribe({
      next: (data: any[]) => {
        const userLeaves = data
          .filter((l) => l.employeeId === this.employeeId)
          .sort(
            (a, b) =>
              new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime()
          );

        if (userLeaves.length > 0) {
          this.latestLeaveStatus = userLeaves[0].status;
          this.latestLeaveDate = userLeaves[0].fromDate;
        }
      },
      error: (err) => {
        console.error('Error fetching leaves:', err);
      },
    });
  }

  calculateTotalApproved(): void {
    const sickUsed = this.leaveBalance.sickLeaveUsed || 0;
    const casualUsed = this.leaveBalance.casualLeaveUsed || 0;
    const sampleUsed = this.leaveBalance.sampleLeaveUsed || 0;
    this.totalApprovedLeaves = sickUsed + casualUsed + sampleUsed;
  }
}
