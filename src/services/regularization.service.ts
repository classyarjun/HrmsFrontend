import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Base API endpoint
const API_URL = 'http://localhost:8080/api/regularization-and-permission';

// Allowed types
export type RequestType = 'REGULARIZATION' | 'PERMISSION';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// Payload from employee
export interface RequestPayload {
  requestType: RequestType;
  reason: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
}

// Server response for request submission
export interface RegularizationResponse {
  message?: string;
  status: ApprovalStatus;
  reason: string;
}

// Full structure of a saved request
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

  // ✅ Fetch all requests for HR
  getAllRequests(): Observable<RegularizationAndPermission[]> {
    return this.http.get<RegularizationAndPermission[]>(`${API_URL}`);
  }

  // ✅ Fetch only pending requests
  getAllPendingRequests(): Observable<RegularizationAndPermission[]> {
    return this.http.get<RegularizationAndPermission[]>(`${API_URL}/pending-requests`);
  }

  // ✅ Submit regularization request
  requestRegularization(empId: number, data: RequestPayload): Observable<RegularizationResponse> {
    return this.http.post<RegularizationResponse>(`${API_URL}/request-regularization/${empId}`, data);
  }

  // ✅ Submit permission request
  requestPermission(empId: number, data: RequestPayload): Observable<RegularizationResponse> {
    return this.http.post<RegularizationResponse>(`${API_URL}/request-permission/${empId}`, data);
  }

  // ✅ Approve a request
  approveRequest(id: number): Observable<RegularizationAndPermission> {
    return this.http.put<RegularizationAndPermission>(`${API_URL}/approve/${id}`, {});
  }

  // ✅ Reject a request
  rejectRequest(id: number): Observable<RegularizationAndPermission> {
    return this.http.put<RegularizationAndPermission>(`${API_URL}/reject/${id}`, {});
  }

  // ✅ Delete a request
  deleteRequest(id: number): Observable<string> {
    return this.http.delete(`${API_URL}/delete/${id}`, { responseType: 'text' });
  }

  // ✅ Get permissions by employee
  getPermissionsByEmployeeId(empId: number): Observable<RegularizationAndPermission[]> {
    return this.http.get<RegularizationAndPermission[]>(`${API_URL}/permissions/${empId}`);
  }

  // ✅ Get regularizations by employee
  getRegularizationsByEmployeeId(empId: number): Observable<RegularizationAndPermission[]> {
    return this.http.get<RegularizationAndPermission[]>(`${API_URL}/regularizations/${empId}`);
  }
}
