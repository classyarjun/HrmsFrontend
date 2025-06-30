import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // LocalStorage se token uthao
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
    });
  }

  createTask(task: any, attachment?: File, employeeId?: number) {
    const formData = new FormData();
    formData.append('task', JSON.stringify(task)); // JSON string
    if (attachment) {
      formData.append('attachment', attachment);
    }
    formData.append('employeeId', employeeId?.toString() || '');

    return this.http.post(`${this.apiUrl}`, formData, {
      headers: this.getHeaders()
    });
  }

  getTaskById(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getAllTasks() {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  updateTask(id: number, task: any) {
    return this.http.put(`${this.apiUrl}/${id}`, task, { headers: this.getHeaders() });
  }

  deleteTask(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}


