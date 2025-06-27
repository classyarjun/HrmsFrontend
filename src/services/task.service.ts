import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:8080/api/tasks';

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

    return this.http.post(`${this.baseUrl}`, formData, {
      headers: this.getHeaders()
    });
  }

  // ✅ Get all tasks (for manager)
  getAllTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      headers: this.getHeaders()
    });
  }

  // ✅ Get tasks for a specific employee
  getTasksByEmployeeId(employeeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/employee/${employeeId}`, {
      headers: this.getHeaders()
    });
  }

  // ✅ Get single task by ID
  getTaskById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

 
// updateAllTaskStatusByEmployeeId(employeeId: number, status: string): Observable<any> {
//   return this.http.put(
//     `${this.baseUrl}/employee/${employeeId}/status?status=${status}`,
//     {}, 
//     {
//       headers: this.getJsonHeaders(),
//       responseType: 'text' as 'json'
//     }
//   );
// }

// ✅ Update Task Status By Task ID
updateTaskStatus(taskId: number, status: string): Observable<any> {
  return this.http.put(
    `${this.baseUrl}/${taskId}/status?status=${status}`,
    {},
    {
      headers: this.getJsonHeaders(),
      responseType: 'text' as 'json',
    }
  );
}


  // ✅ Delete a task
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
