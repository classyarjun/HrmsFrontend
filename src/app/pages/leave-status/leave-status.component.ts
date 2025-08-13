import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeavestatusService } from '../../../services/leavestatus.service';

@Component({
  selector: 'app-leave-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-status.component.html',
  styleUrls: ['./leave-status.component.css'],
})
export class LeaveStatusComponent implements OnInit {
  
  employeeId = JSON.parse(localStorage.getItem('userData') || '{}').EmployeeId || 0;
  totalApprovedLeaves = 0;

  latestLeaveStatus: string = '';
  latestLeaveFromDate: string = '';
  latestLeaveToDate: string = '';
  latestLeaveId: number | null = null;

  leaves: any[] = [];

  // ✅ Individual counts
  sickLeaveUsed = 0;
  casualLeaveUsed = 0;
  sampleLeaveUsed = 0;
  paidleaveUsed = 0;
  unpaidLeaveUsed = 0;
  maternityLeaveUsed = 0;

  constructor(private leavestatusService: LeavestatusService) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.leavestatusService.getAllLeaves().subscribe({
      next: (data: any[]) => {
        const userLeaves = data
          .filter((l) => l.employeeId === this.employeeId)
          .sort((a, b) => new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime());

        this.leaves = userLeaves;

        // ✅ Find latest non-cancelled leave
        const latestActiveLeave = userLeaves.find(l => l.status !== 'CANCELLED');

        if (latestActiveLeave) {
          this.latestLeaveId = latestActiveLeave.id || latestActiveLeave.leaveId || null;
          this.latestLeaveStatus = latestActiveLeave.status || '';
          this.latestLeaveFromDate = latestActiveLeave.fromDate || latestActiveLeave.startDate || '';
          this.latestLeaveToDate = latestActiveLeave.toDate || latestActiveLeave.endDate || '';
        } else {
          // No active leave
          this.latestLeaveId = null;
          this.latestLeaveStatus = '';
          this.latestLeaveFromDate = '';
          this.latestLeaveToDate = '';
        }

        this.calculateApprovedLeaves(userLeaves);
      },
      error: (err) => {
        console.error('Error fetching leaves:', err);
      },
    });
  }

  calculateApprovedLeaves(userLeaves: any[]) {
    // Approved leaves count
    this.totalApprovedLeaves = userLeaves.filter(l => l.status === 'APPROVED').length;

    // Reset all leave type counts
    this.sickLeaveUsed = 0;
    this.casualLeaveUsed = 0;
    this.sampleLeaveUsed = 0;
    this.paidleaveUsed = 0;
    this.unpaidLeaveUsed = 0;
    this.maternityLeaveUsed = 0;

    userLeaves.forEach(leave => {
      if (leave.status !== 'APPROVED') return; // consider only approved leaves

      // Calculate days of leave
      const days = leave.numberOfDays ?? this.getLeaveDays(leave.fromDate, leave.toDate);

      const leaveType = (leave.leaveType || '').toLowerCase();

      switch (leaveType) {
        case 'sick leave':
        case 'sick':
          this.sickLeaveUsed += days;
          break;
        case 'casual leave':
        case 'casual':
          this.casualLeaveUsed += days;
          break;
        case 'sample leave':
        case 'sample':
          this.sampleLeaveUsed += days;
          break;
        case 'paid leave':
        case 'paid':
          this.paidleaveUsed += days;
          break;
        case 'unpaid leave':
        case 'unpaid':
          this.unpaidLeaveUsed += days;
          break;
        case 'maternity leave':
        case 'maternity':
          this.maternityLeaveUsed += days;
          break;
        default:
          // If other types present, can handle here
          break;
      }
    });
  }

  getLeaveDays(from: string, to: string): number {
    if (!from || !to) return 0;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = toDate.getTime() - fromDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive days count
  }

  withdrawLeave(leaveId: number | null): void {
  if (!leaveId) return;

  if (confirm('Are you sure you want to cancel this leave?')) {
    this.leavestatusService.cancelLeaveById(leaveId).subscribe({
      next: (res) => {
        alert(res.message);
        this.loadLeaves();  // refresh UI
      },
      error: (err) => {
        console.error('Error cancelling leave:', err);
        alert(err.error?.error || 'Failed to cancel leave.');
      }
    });
  }
}

}


