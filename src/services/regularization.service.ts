import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/regularization-and-permission';

export type RequestType = 'REGULARIZATION' | 'PERMISSION';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface RequestPayload {
  requestType: RequestType;
  reason: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  email: string; // ✅ Ensure email is part of payload
}

export interface RegularizationResponse {
  message?: string;
  status: ApprovalStatus;
  reason: string;
}

export interface RegularizationAndPermission {
email: any;
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

  getAllRequests(): Observable<RegularizationAndPermission[]> {
    return this.http.get<RegularizationAndPermission[]>(`${API_URL}`);
  }

  getAllPendingRequests(): Observable<RegularizationAndPermission[]> {
    return this.http.get<RegularizationAndPermission[]>(`${API_URL}/pending-requests`);
  }

  // ✅ Updated: Send email as query param
  requestRegularization(empId: number, data: RequestPayload): Observable<RegularizationResponse> {
    const params = new HttpParams().set('email', data.email);
    return this.http.post<RegularizationResponse>(
      `${API_URL}/request-regularization/${empId}`,
      data,
      { params }
    );
  }

  // ✅ Updated: Send email as query param
  requestPermission(empId: number, data: RequestPayload): Observable<RegularizationResponse> {
    const params = new HttpParams().set('email', data.email);
    return this.http.post<RegularizationResponse>(
      `${API_URL}/request-permission/${empId}`,
      data,
      { params }
    );
  }

  approveRequest(id: number): Observable<RegularizationAndPermission> {
    return this.http.put<RegularizationAndPermission>(`${API_URL}/approve/${id}`, {});
  }

  rejectRequest(id: number): Observable<RegularizationAndPermission> {
    return this.http.put<RegularizationAndPermission>(`${API_URL}/reject/${id}`, {});
  }

  deleteRequest(id: number): Observable<string> {
    return this.http.delete(`${API_URL}/delete/${id}`, { responseType: 'text' });
  }

  getPermissionsByEmployeeId(empId: number): Observable<RegularizationAndPermission[]> {
    return this.http.get<RegularizationAndPermission[]>(`${API_URL}/permissions/${empId}`);
  }

  getRegularizationsByEmployeeId(empId: number): Observable<RegularizationAndPermission[]> {
    return this.http.get<RegularizationAndPermission[]>(`${API_URL}/regularizations/${empId}`);
  }

  getAllRequestByEmployeeId(empId: number): Observable<RegularizationAndPermission[]> {
    return this.http.get<RegularizationAndPermission[]>(`${API_URL}/request/${empId}`);
  }
  
}
