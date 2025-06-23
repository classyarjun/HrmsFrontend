import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id: number;
}

export interface PerformanceReview {
  reviewId?: number;
  taskName: string;
  managerReview: string;
  reviewDate: string;
  employee: { id: number }; // ✅ required field
  employeeId?: number; // optional for table display
}

@Injectable({ providedIn: 'root' })
export class PerformanceReviewService {
  private apiUrl = 'http://localhost:8080/api/reviews';

  constructor(private http: HttpClient) {}

  private getHeaders(contentType: string = ''): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    const headersConfig: any = { Authorization: `Bearer ${token}` };
    if (contentType) {
      headersConfig['Content-Type'] = contentType;
    }
    return new HttpHeaders(headersConfig);
  }

  createReview(review: PerformanceReview): Observable<any> {
    return this.http.post(`${this.apiUrl}/createReview`, review, {
      headers: this.getHeaders(),
    });
  }

  getAllReviews(): Observable<PerformanceReview[]> {
    return this.http.get<PerformanceReview[]>(`${this.apiUrl}/getAllReviews`, {
      headers: this.getHeaders(),
    });
  }

  updateReview(id: number, review: PerformanceReview): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateReview/${id}`, review, {
      headers: this.getHeaders(),
    });
  }

  deleteReview(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteById/${id}`, {
      headers: this.getHeaders(),
      // responseType: 'text'  // ✅ prevent JSON parsing error
    });
  }
}
