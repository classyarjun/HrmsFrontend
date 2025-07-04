import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplyLeavesService } from '../../../services/apply-leaves.service';

// Inline type definitions
type LeaveType = 'SICK' | 'CASUAL' | 'PAID' | 'UNPAID' | 'MATERNITY';
type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface LeaveRequest {
  leaveId?: number;
  employeeId: number;
  employeeName?: string;
  fromDate: string;
  toDate: string;
  reason: string;
  applyingTo: string;
  ccTo: string[] | string;  // <-- Allow both
  contactDetails: string;
  leaveType: LeaveType;
  status?: LeaveStatus;
  fileName?: string;
  documentUrl?: string;
}

@Component({
  selector: 'app-all-leave-request',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-all-leave-request.component.html',
  styleUrl: './manager-all-leave-request.component.css'
})
export class ManagerAllLeaveRequestComponent {
  leaveRequests: LeaveRequest[] = [];
  leaveStatuses: LeaveStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];

  constructor(private applyLeavesService: ApplyLeavesService) {}

  ngOnInit() {
    this.fetchLeaves();
  }

 fetchLeaves() {
  this.applyLeavesService.getAllLeaves().subscribe(
    (data: any[]) => {
      this.leaveRequests = data.map((leave: any) => ({
        ...leave,
        ccTo: typeof leave.ccTo === 'string' 
          ? leave.ccTo.split(',').map((s: string) => s.trim()) 
          : leave.ccTo || [],
        documentUrl: leave.leaveId 
          ? `http://localhost:8080/api/leaves/download/${leave.leaveId}` 
          : null
      }));
    },
    (error) => {
      console.error('Error fetching leaves', error);
    }
  );
}


  updateLeaveStatus(leaveId: number, newStatus: string) {
    this.applyLeavesService.updateLeaveStatus(leaveId, newStatus as LeaveStatus).subscribe({
      next: () => this.fetchLeaves(),
      error: (err: any) => console.error('Failed to update leave status', err)
    });
  }
}
