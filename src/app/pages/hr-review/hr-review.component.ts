import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PerformanceReview, PerformanceReviewService } from '../../../services/performance-review.service';
 
@Component({
  selector: 'app-hr-review',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './hr-review.component.html',
  styleUrl: './hr-review.component.css'
})
export class HrReviewComponent implements OnInit {
  private reviewService = inject(PerformanceReviewService);
 
  reviews: PerformanceReview[] = [];
  message = '';
 
  ngOnInit() {
    this.fetchAllReviews();
  }
 
  fetchAllReviews() {
    this.reviewService.getAllReviews().subscribe({
      next: (res) => {
        this.reviews = res.map(r => ({
          ...r,
          employee: { id: r.employeeId }
        }));
      },
      error: () => this.message = 'Error fetching reviews.'
    });
  }
}