
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-calender',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-calender.component.html',
  styleUrl: './user-calender.component.css'
})
export class UserCalenderComponent {
  
  currentMonth: number;
  currentYear: number;
  currentMonthName: string = '';
  monthDays: string[] = [];

  attendanceData = [
    { date: '2025-06-01', status: 'P', shift: 'GEN' },
    { date: '2025-06-02', status: 'P', shift: 'GEN' },
    { date: '2025-06-03', status: 'P', shift: 'GEN' },
    { date: '2025-06-04', status: 'P', shift: 'GEN' },
    { date: '2025-06-05', status: 'P', shift: 'GEN' },
    { date: '2025-06-06', status: 'A', shift: 'GEN' },
    { date: '2025-06-07', status: 'P', shift: 'GEN' },
    { date: '2025-06-08', status: 'P', shift: 'GEN' },
    { date: '2025-06-09', status: 'P', shift: 'GEN' },
    { date: '2025-06-10', status: 'A', shift: 'GEN' },
    { date: '2025-06-11', status: 'A', shift: 'GEN' },
    { date: '2025-06-12', status: 'P', shift: 'GEN' },
    { date: '2025-06-13', status: 'P', shift: 'GEN' },
    { date: '2025-06-14', status: 'P', shift: 'GEN' },
    { date: '2025-06-15', status: 'P', shift: 'GEN' },
    { date: '2025-06-16', status: 'A', shift: 'GEN' },
    { date: '2025-06-17', status: 'A', shift: 'GEN' },
    { date: '2025-06-18', status: 'P', shift: 'GEN' },
    { date: '2025-06-19', status: 'P', shift: 'GEN' },
    { date: '2025-06-20', status: 'A', shift: 'GEN' },
    { date: '2025-06-21', status: 'P', shift: 'GEN' },
    { date: '2025-06-22', status: 'P', shift: 'GEN' },
    { date: '2025-06-23', status: 'P', shift: 'GEN' },
    { date: '2025-06-24', status: 'A', shift: 'GEN' },
    { date: '2025-06-25', status: 'P', shift: 'GEN' },
    { date: '2025-06-26', status: 'P', shift: 'GEN' },
    { date: '2025-06-27', status: 'P', shift: 'GEN' },
    { date: '2025-06-28', status: 'P', shift: 'GEN' },
    { date: '2025-06-29', status: 'P', shift: 'GEN' },
    { date: '2025-06-30', status: 'P', shift: 'GEN' }
  ];

  constructor() {
    const today = new Date();
    this.currentMonth = today.getMonth(); // 0-11 for Jan-Dec
    this.currentYear = today.getFullYear(); // e.g., 2025
    this.updateCalendar();
  }

  updateCalendar() {
    const date = new Date(this.currentYear, this.currentMonth);
    this.currentMonthName = date.toLocaleString('default', { month: 'long' });
    this.monthDays = this.generateMonthDays(this.currentYear, this.currentMonth);
  }

  generateMonthDays(year: number, month: number): string[] {
    const days: string[] = [];
    const totalDays = new Date(year, month + 1, 0).getDate(); // ✅ gives exact last date of month

    for (let i = 1; i <= totalDays; i++) {
      const dayStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${i
        .toString()
        .padStart(2, '0')}`;
      days.push(dayStr);
    }

    return days;
  }

  goToNextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.updateCalendar();
  }

  goToPreviousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.updateCalendar();
  }

  getAttendanceForDate(date: string) {
    return this.attendanceData.find(item => item.date === date);
  }
}