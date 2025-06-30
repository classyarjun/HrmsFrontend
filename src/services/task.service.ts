import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
    });
  }

  private getJsonHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ Create Task with optional file and employeeId
  createTask(task: any, attachment?: File, employeeId?: number): Observable<any> {
    const formData = new FormData();
    formData.append('task', JSON.stringify(task));
    if (attachment) {
      formData.append('attachment', attachment);
    }
    formData.append('employeeId', employeeId?.toString() || '');

    return this.http.post(`${this.apiUrl}`, formData, {
      headers: this.getHeaders()
    });
  }

  

  updateTask(id: number, task: any) {
    return this.http.put(`${this.apiUrl}/${id}`, task, { headers: this.getHeaders() });
  }


  // ✅ Get all tasks (for manager)
  getAllTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // ✅ Get tasks for a specific employee
  getTasksByEmployeeId(employeeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/employee/${employeeId}`, {
      headers: this.getHeaders()
    });
  }

  // ✅ Get single task by ID
  getTaskById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }




// ✅ Update Task Status By Task ID
updateTaskStatus(taskId: number, status: string): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/${taskId}/status?status=${status}`,
    {},
    {
      headers: this.getJsonHeaders(),
      responseType: 'text' as 'json',
    }
  );
}


  // ✅ Delete a task
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}

