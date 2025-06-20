import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplyLeavesService } from '../../../services/apply-leaves.service';


// Inline type definitions
type LeaveType = 'SICK' | 'CASUAL' | 'PAID' | 'UNPAID';
type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface LeaveRequest {
  leaveId?: number;
  employeeId: number;
  fromDate: string;
  toDate: string;
  reason: string;
  applyingTo: string;
  ccTo: string[];
  contactDetails: string;
  leaveType: LeaveType;
  status?: LeaveStatus;
}

@Component({
  selector: 'app-all-leave-request',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-leave-request.component.html',
  styleUrl: './all-leave-request.component.css'
})
export class AllLeaveRequestComponent {
  leaveRequests: LeaveRequest[] = [];
  leaveStatuses: LeaveStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];

  constructor(private applyLeavesService: ApplyLeavesService) {}

  ngOnInit() {
    this.fetchLeaves();
  }

  fetchLeaves() {
    this.applyLeavesService.getAllLeaves().subscribe({
      next: (data: LeaveRequest[]) => this.leaveRequests = data,
      error: (err: any) => console.error('Error fetching leaves', err)
    });
  }

  updateLeaveStatus(leaveId: number, newStatus: string) {
  this.applyLeavesService.updateLeaveStatus(leaveId, newStatus as LeaveStatus).subscribe({
    next: () => this.fetchLeaves(),
    error: (err: any) => console.error('Failed to update leave status', err)
  });
}

}
