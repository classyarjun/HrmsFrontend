import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

const NAV_URL = environment.apiUrl;

export interface Leave {
  id: number;
  employeeId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
  reason: string;
}

export interface LeaveBalance {
  annual: number;
  casual: number;
  sick: number;
}

@Injectable({ providedIn: 'root' })
export class LeavestatusService {
  CancelLeaveById(leaveId: number) {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) {}

  /** 🆕 Get Leave Balance by Employee ID */
  getLeaveBalance(employeeId: number): Observable<LeaveBalance> {
    return this.http.get<LeaveBalance>(`${NAV_URL}/leaves/leaveBalance/${employeeId}`);
  }

  /** 🆕 Get All Leaves */
  getAllLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(`${NAV_URL}/leaves/getAllLeaves`);
  }

  /** 🆕 Create Leave Request */
  createLeave(formData: FormData): Observable<any> {
    return this.http.post<any>(`${NAV_URL}/leaves/createLeave`, formData);
  }

  /** 🆕 Delete Leave by ID */
  deleteLeave(id: number): Observable<string> {
    return this.http.delete(`${NAV_URL}/leaves/DeleteLeaveById/${id}`, {
      responseType: 'text',
    });
  }

  /** 🆕 Update Leave Status */
  updateLeaveStatus(id: number, status: string): Observable<any> {
    return this.http.put(
      `${NAV_URL}/leaves/updateStatusById/${id}/status?status=${status}`,
      null
    );
  }

  /** 🆕 Get Applying To Email List */
  getApplyingToEmail(): Observable<string[]> {
    return this.http.get<string[]>(`${NAV_URL}/leaves/applyingTo`);
  }

  /** 🆕 Get CC To Email List */
  getCcToEmails(): Observable<string[]> {
    return this.http.get<string[]>(`${NAV_URL}/leaves/ccToEmployees`);
  }

  /** 🆕 Withdraw (Cancel) Leave Request */
  cancelLeaveById(leaveId: number): Observable<any> {
  return this.http.put(`${NAV_URL}/leaves/CancelLeaveById/${leaveId}`, {});
}
}
