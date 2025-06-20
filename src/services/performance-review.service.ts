import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
 
export interface Employee {
  id: number;
}
 
export interface PerformanceReview {
  id?: number;  // ID is optional when creating
  taskName: string;
  managerReview: string;
  reviewDate: string;
  employee: { id: number };
  employeeId: number;
}
 
@Injectable({ providedIn: 'root' })
export class PerformanceReviewService {
  private baseUrl = 'http://localhost:8080/api/reviews';
 
  constructor(private http: HttpClient) {}
 
  private getHeaders(contentType = 'application/json'): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    const headersConfig: any = {
      Authorization: `Bearer ${token}`
    };
    if (contentType) headersConfig['Content-Type'] = contentType;
    return new HttpHeaders(headersConfig);
  }
 
  createReview(review: PerformanceReview): Observable<any> {
    return this.http.post(`${this.baseUrl}/createReview`, review, {
      headers: this.getHeaders()
    });
  }
 
  getAllReviews(): Observable<PerformanceReview[]> {
    return this.http.get<PerformanceReview[]>(`${this.baseUrl}/getAllReviews`, {
      headers: this.getHeaders()
    });
  }
 
  updateReview(id: number, review: PerformanceReview): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateReview/${id}`, review, {
      headers: this.getHeaders()
    });
  }
 
  deleteReview(id: number): Observable<any> {
    if (!id || id === 0) {
      throw new Error('Invalid review ID for deletion.');
    }
 
    return this.http.delete(`${this.baseUrl}/DeleteById/${id}`, {
      headers: this.getHeaders()
    });
  }
}
 