import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PerformanceReview, PerformanceReviewService } from '../../../services/performance-review.service';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any;

@Component({
  selector: 'app-manager-review',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './manager-review.component.html',
  styleUrls: ['./manager-review.component.css']
})
export class ManagerReviewComponent implements OnInit {
  reviews: PerformanceReview[] = [];
  review: PerformanceReview = {
    reviewId: 0,
    taskName: '',
    managerReview: '',
    reviewDate: '',
    employee: { id: 0 } // ✅ ensures employee is defined
  };

  isEdit = false;
  constructor(
    private reviewService: PerformanceReviewService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.reviewService.getAllReviews().subscribe(data => {
      this.reviews = data;
    });
  }

  submitReview() {
    const payload: PerformanceReview = {
      ...this.review,
      employee: { id: this.review.employee?.id ?? this.review.employeeId ?? 0 }
    };

    if (this.isEdit && this.review.reviewId) {
      this.reviewService.updateReview(this.review.reviewId, payload).subscribe(() => {
        this.loadReviews();
        this.toastr.success('Update Review successfully!', 'Success');

        this.resetForm();
        this.closeModal();
      });
    } else {
      this.reviewService.createReview(payload).subscribe(() => {
        this.loadReviews();
        this.toastr.success('Review Add successfully!', 'Success');

        this.resetForm();
        this.closeModal();
      });
    }
  }

  editReview(r: PerformanceReview) {
    this.review = {
      reviewId: r.reviewId,
      taskName: r.taskName,
      managerReview: r.managerReview,
      reviewDate: r.reviewDate,
      employee: { id: r.employeeId ?? 0 }  // ✅ safely set employee object
    };
    this.isEdit = true;
    const modal = new bootstrap.Modal(document.getElementById('reviewModal'));
    modal.show();
  }

  deleteReview(id: number) {
    if (confirm('Are you sure to delete this review?')) {
      this.reviewService.deleteReview(id).subscribe({
        next: () => this.loadReviews(),
        complete: () => this.toastr.success('Review deleted successfully!', 'Success'),
        error: (err) => console.error("Delete failed", err)
      });
    }
  }


  resetForm() {
    this.review = {
      reviewId: 0,
      taskName: '',
      managerReview: '',
      reviewDate: '',
      employee: { id: 0 }  // ✅ ensure employee is not undefined
    };
    this.isEdit = false;
  }




  closeModal() {
    const modalEl = document.getElementById('reviewModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal?.hide();
    }
  }
}