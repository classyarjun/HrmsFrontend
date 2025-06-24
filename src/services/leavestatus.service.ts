import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LeavestatusService {


  private apiUrl = 'http://localhost:8080/api/leaves';

  constructor(private http: HttpClient) {}

  getLeaveBalance(employeeId: number) {
    return this.http.get(`${this.apiUrl}/leaveBalance/${employeeId}`);
  }

  // getAllLeaves() {
  //   return this.http.get(`${this.apiUrl}/getAllLeaves`);
  // }

  getAllLeaves(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/getAllLeaves`);
}

  createLeave(formData: FormData) {
    return this.http.post(`${this.apiUrl}/createLeave`, formData);
  }

  deleteLeave(id: number) {
    return this.http.delete(`${this.apiUrl}/DeleteLeaveById/${id}`, {
      responseType: 'text',
    });
  }

  updateLeaveStatus(id: number, status: string) {
    return this.http.put(
      `${this.apiUrl}/updateStatusById/${id}/status?status=${status}`,
      null
    );
  }

  getApplyingToEmail() {
    return this.http.get(`${this.apiUrl}/applyingTo`);
  }

  getCcToEmails() {
    return this.http.get(`${this.apiUrl}/ccToEmployees`);
  }
}
