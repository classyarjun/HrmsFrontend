import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PerformanceReview, PerformanceReviewService } from '../../../services/performance-review.service';
 
@Component({
  selector: 'app-manager-review',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './manager-review.component.html',
  styleUrls: ['./manager-review.component.css']
})
export class ManagerReviewComponent implements OnInit {
  private reviewService = inject(PerformanceReviewService);
 
  review: PerformanceReview = {
    taskName: '',
    managerReview: '',
    reviewDate: '',
    employee: { id: 0 },
    employeeId: 0
  };
 
  reviews: PerformanceReview[] = [];
  message = '';
  editing = false;
  currentReviewId: number | null = null;
 
  ngOnInit() {
    this.fetchAllReviews();
  }
 
  submitReview() {
    if (!this.review.employee?.id) {
      this.message = 'Employee ID is required!';
      return;
    }
 
    this.review.employeeId = this.review.employee.id;
 
    if (this.editing && this.currentReviewId !== null) {
      this.reviewService.updateReview(this.currentReviewId, this.review).subscribe({
        next: () => {
          this.message = 'Review updated successfully!';
          this.resetForm();
          this.fetchAllReviews();
        },
        error: () => this.message = 'Error updating review.'
      });
    } else {
      this.reviewService.createReview(this.review).subscribe({
        next: () => {
          this.message = 'Review submitted successfully!';
          this.resetForm();
          this.fetchAllReviews();
        },
        error: () => this.message = 'Error submitting review.'
      });
    }
  }
  fetchAllReviews() {
    this.reviewService.getAllReviews().subscribe({
      next: (res: any) => {
        this.reviews = res.map((r: any) => ({
          id: r.id,  // Must be present!
          taskName: r.taskName,
          managerReview: r.managerReview,
          reviewDate: r.reviewDate,
          employeeId: r.employeeId,
          employee: { id: r.employeeId }
        }));
      },
      error: () => this.message = 'Error fetching all reviews.'
    });
  }
 
 
 
  editReview(review: PerformanceReview) {
    this.review = {
      id: review.id,
      taskName: review.taskName,
      managerReview: review.managerReview,
      reviewDate: review.reviewDate,
      employee: { id: review.employeeId },
      employeeId: review.employeeId
    };
    this.currentReviewId = review.id ?? null;
    this.editing = true;
  }
 
  confirmDelete(id: number | undefined) {
    if (!id || id === 0) {
      this.message = 'Invalid review ID.';  // ID must be non-zero
      return;
    }
 
    if (confirm('Are you sure you want to delete this review?')) {
      this.deleteReview(id);
    }
  }
 
  deleteReview(id: number) {
    if (!id || id === 0) {
      this.message = 'Invalid ID, cannot delete.';
      return;
    }
 
    this.reviewService.deleteReview(id).subscribe({
      next: () => {
        this.message = 'Review deleted successfully!';
        this.fetchAllReviews();
      },
      error: (err) => {
        console.error('Error deleting review:', err);
        this.message = 'Error deleting review.';
      }
    });
  }
 
 
  resetForm() {
    this.review = {
      taskName: '',
      managerReview: '',
      reviewDate: '',
      employee: { id: 0 },
      employeeId: 0
    };
    this.editing = false;
    this.currentReviewId = null;
  }
}
 