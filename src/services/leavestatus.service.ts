import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

const NAV_URL = environment.apiUrl;


@Injectable({ providedIn: 'root' })
export class LeavestatusService {

  // private apiUrl = 'http://localhost:8080/api/leaves';

  constructor(private http: HttpClient) {}

  getLeaveBalance(employeeId: number) {
    return this.http.get(`${NAV_URL}/leaves/leaveBalance/${employeeId}`);
  }


  getAllLeaves(): Observable<any[]> {
  return this.http.get<any[]>(`${NAV_URL}/leaves/getAllLeaves`);
}

  createLeave(formData: FormData) {
    return this.http.post(`${NAV_URL}/leaves/createLeave`, formData);
  }

  deleteLeave(id: number) {
    return this.http.delete(`${NAV_URL}/leaves/DeleteLeaveById/${id}`, {
      responseType: 'text',
    });
  }

  updateLeaveStatus(id: number, status: string) {
    return this.http.put(
      `${NAV_URL}/leaves/updateStatusById/${id}/status?status=${status}`,
      null
    );
  }

  getApplyingToEmail() {
    return this.http.get(`${NAV_URL}/leaves/applyingTo`);
  }

  getCcToEmails() {
    return this.http.get(`${NAV_URL}/leaves/ccToEmployees`);
  }
}
