import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegularizationService, RegularizationAndPermission } from '../../../services/regularization.service';

@Component({
  selector: 'app-hr-regularization',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hr-regularization.component.html',
})
export class HrRegularizationComponent implements OnInit {
  pendingRequests: RegularizationAndPermission[] = [];

  constructor(private regularizationService: RegularizationService) {}

  ngOnInit(): void {
    this.loadPendingRequests();
  }

  loadPendingRequests(): void {
    this.regularizationService.getAllPendingRequests().subscribe({
      next: (data) => {
        this.pendingRequests = [...data]; // Ensure UI update
        console.log('Loaded pending requests:', data);
      },
      error: (error) => {
        console.error('Failed to load pending requests:', error);
      }
    });
  }

  approve(id: number): void {
    this.regularizationService.approveRequest(id).subscribe({
      next: () => {
        console.log(`Approved request with id ${id}`);
        const req = this.pendingRequests.find(r => r.id === id);
        if (req) req.approvalStatus = 'APPROVED';
      },
      error: (err) => console.error('Error approving request:', err)
    });
  }

  reject(id: number): void {
    this.regularizationService.rejectRequest(id).subscribe({
      next: () => {
        console.log(`Rejected request with id ${id}`);
        const req = this.pendingRequests.find(r => r.id === id);
        if (req) req.approvalStatus = 'REJECTED';
      },
      error: (err) => console.error('Error rejecting request:', err)
    });
  }

  deleteRequest(id: number): void {
    this.regularizationService.deleteRequest(id).subscribe({
      next: () => {
        console.log(`Deleted request with id ${id}`);
        this.pendingRequests = this.pendingRequests.filter(r => r.id !== id);
      },
      error: (err) => console.error('Error deleting request:', err)
    });
  }
}
