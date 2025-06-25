import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  getTasksByEmployeeId(arg0: number) {
    throw new Error('Method not implemented.');
  }
  private baseUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // LocalStorage se token uthao
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
    });
  }

  
createTask(task: any, file: File, employeeId: number): Observable<any> {
  const formData = new FormData();
  formData.append('task', new Blob([JSON.stringify(task)], { type: 'application/json' }));
  if (file) {
    formData.append('attachment', file);
  }
  formData.append('employeeId', employeeId.toString());

  return this.http.post('http://localhost:8080/api/tasks', formData);
}

  getTaskById(id: number) {
    return this.http.get(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  getAllTasks() {
    return this.http.get(this.baseUrl, { headers: this.getHeaders() });
  }

  updateTask(id: number, task: any) {
    return this.http.put(`${this.baseUrl}/${id}`, task, { headers: this.getHeaders() });
  }

  deleteTask(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }
}


