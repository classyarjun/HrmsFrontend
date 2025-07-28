import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Base API endpoint
const API_URL = 'http://localhost:8080/api/regularization-and-permission';

// Allowed values
export type RequestType = 'REGULARIZATION' | 'PERMISSION';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// Request format sent by employee
export interface RequestPayload {
  requestType: RequestType;
  reason: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
}

// Response for submit request
export interface RegularizationResponse {
  message?: string;
  status: ApprovalStatus;
  reason: string;
}

// Complete structure of any request
export interface RegularizationAndPermission {
  id: number;
  requestType: RequestType;
  approvalStatus: ApprovalStatus;
  reason: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  employee: {
    id: number;
    name: string;
    email?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class RegularizationService {
  constructor(private http: HttpClient) {}

  /**
   * ✅ Get all requests (regularization + permission) for HR/Manager
   */
  getAllRequests(): Observable<RegularizationAndPermission[]> {
    return this.http.get<RegularizationAndPermission[]>(`${API_URL}`);
  }

  /**
   * Submit a regularization request
   */
  requestRegularization(empId: number, data: RequestPayload): Observable<RegularizationResponse> {
    return this.http.post<RegularizationResponse>(`${API_URL}/request-regularization/${empId}`, data);
  }

  /**
   * Submit a permission request
   */
  requestPermission(empId: number, data: RequestPayload): Observable<RegularizationResponse> {
    return this.http.post<RegularizationResponse>(`${API_URL}/request-permission/${empId}`, data);
  }

  /**
   * Get all pending requests (for HR/Manager)
   */
  getAllPendingRequests(): Observable<RegularizationAndPermission[]> {
    return this.http.get<RegularizationAndPermission[]>(`${API_URL}/pending-requests`);
  }

  /**
   * Approve a request by ID
   */
  approveRequest(id: number): Observable<RegularizationAndPermission> {
    return this.http.put<RegularizationAndPermission>(`${API_URL}/approve/${id}`, {});
  }

  /**
   * Reject a request by ID
   */
  rejectRequest(id: number): Observable<RegularizationAndPermission> {
    return this.http.put<RegularizationAndPermission>(`${API_URL}/reject/${id}`, {});
  }

  /**
   * Delete a request by ID
   */
  deleteRequest(id: number): Observable<string> {
    return this.http.delete(`${API_URL}/delete/${id}`, { responseType: 'text' });
  }

  /**
   * Get all permission requests by employee ID
   */
  getPermissionsByEmployeeId(empId: number): Observable<RegularizationAndPermission[]> {
    return this.http.get<RegularizationAndPermission[]>(`${API_URL}/permissions/${empId}`);
  }

  /**
   * Get all regularization requests by employee ID
   */
  getRegularizationsByEmployeeId(empId: number): Observable<RegularizationAndPermission[]> {
    return this.http.get<RegularizationAndPermission[]>(`${API_URL}/regularizations/${empId}`);
  }
}
