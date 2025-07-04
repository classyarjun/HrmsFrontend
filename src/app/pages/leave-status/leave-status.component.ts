
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
  employeeId = JSON.parse(localStorage.getItem('userData') || '{}').EmployeeId || 0;
  totalApprovedLeaves = 0;
  latestLeaveStatus: string = '';
  latestLeaveDate: string = '';

  // ✅ Individual counts
  sickLeaveUsed = 0;
  casualLeaveUsed = 0;
  sampleLeaveUsed = 0;

  constructor(private LeavestatusService: LeavestatusService) {}

  ngOnInit(): void {
    this.fetchLatestLeaveStatus();
  }

  fetchLatestLeaveStatus(): void {
    this.LeavestatusService.getAllLeaves().subscribe({
      next: (data: any[]) => {
        const userLeaves = data
          .filter((l) => l.employeeId === this.employeeId)
          .sort((a, b) => new Date(b.fromDate).getTime() - new Date(a.fromDate).getTime());

        console.log('userLeaves:', userLeaves);

        if (userLeaves.length > 0) {
          this.latestLeaveStatus = userLeaves[0].status;
          this.latestLeaveDate = userLeaves[0].fromDate;
        }

        this.calculateApprovedLeaves(userLeaves);
      },
      error: (err) => {
        console.error('Error fetching leaves:', err);
      },
    });
  }

  calculateApprovedLeaves(leaves: any[]): void {

    const approvedLeaves = leaves.filter((l) => l.status === 'APPROVED');
    this.sickLeaveUsed = approvedLeaves.filter((l) => l.leaveType === 'SICK').length;
    this.casualLeaveUsed = approvedLeaves.filter((l) => l.leaveType === 'CASUAL').length;
    this.sampleLeaveUsed = approvedLeaves.filter((l) => l.leaveType === 'SAMPLE').length;
    this.totalApprovedLeaves = this.sickLeaveUsed + this.casualLeaveUsed + this.sampleLeaveUsed;
    
  }
}
