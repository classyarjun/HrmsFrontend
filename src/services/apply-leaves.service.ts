import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// ✅ Inline types instead of importing from modal
export type LeaveType = 'SICK' | 'CASUAL' | 'PAID' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequest {
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

@Injectable({
  providedIn: 'root'
})
export class ApplyLeavesService {
  [x: string]: any;
  private baseUrl = 'http://localhost:8080/api/leaves';

  constructor(private http: HttpClient) {}

  // 🔐 Helper to attach JWT token from localStorage
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // 📤 Apply for leave (with optional file attachment)
 applyLeave(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/createLeave`, formData, {
      headers: this.getAuthHeaders()
    });
  }

  // 📥 Get all leaves (for HR/admin)
  getAllLeaves(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.baseUrl}/getAllLeaves`, {
      headers: this.getAuthHeaders()
    });
  }

  // 📄 Get leave by ID
  getLeaveById(id: number): Observable<LeaveRequest> {
    return this.http.get<LeaveRequest>(`${this.baseUrl}/getLeaveById/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Approve or reject a leave
  updateLeaveStatus(id: number, status: LeaveStatus): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateStatusById/${id}/status?status=${status}`, null, {
      headers: this.getAuthHeaders()
    });
  }

  // ❌ Delete leave
  deleteLeave(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/DeleteLeaveById/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // 👤 Get leaves for a specific employee
  getLeavesByEmployeeId(empId: number): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.baseUrl}/employee/${empId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // 👤 Get leaves for currently logged-in user (if supported by backend)
  getMyLeaves(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.baseUrl}/myLeaves`, {
      headers: this.getAuthHeaders()
    });
  }
}

 