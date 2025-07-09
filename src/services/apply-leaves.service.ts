import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export type LeaveType = 'SICK' | 'CASUAL' | 'PAID' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface LeaveRequest {
  leaveId?: number;
  employeeId: number;
  employeeName?: string; // ✅ Add this
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

  private apiUrl = 'http://localhost:8080/api/leaves';

  constructor(private http: HttpClient) {}


  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }


 applyLeave(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/createLeave`, formData, {
      headers: this.getAuthHeaders()
    });
  }


  getAllLeaves(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/getAllLeaves`, {
      headers: this.getAuthHeaders()
    });
  }

  getLeaveById(id: number): Observable<LeaveRequest> {
    return this.http.get<LeaveRequest>(`${this.apiUrl}/getLeaveById/${id}`, {
      headers: this.getAuthHeaders()
    });
  }


  updateLeaveStatus(id: number, status: LeaveStatus): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateStatusById/${id}/status?status=${status}`, null, {
      headers: this.getAuthHeaders()
    });
  }


  deleteLeave(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteLeaveById/${id}`, {
      headers: this.getAuthHeaders()
    });
  }


  getLeavesByEmployeeId(empId: number): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/employee/${empId}`, {
      headers: this.getAuthHeaders()
    });
  }


  getMyLeaves(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/myLeaves`, {
      headers: this.getAuthHeaders()
    });
  }
   getLeaveStatusByEmployeeId(employeeId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/leaveStatuses/${employeeId}`);
  }


 getCcToEmployees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ccToEmployees`, {
      headers: this.getAuthHeaders()
    });
  }

}
