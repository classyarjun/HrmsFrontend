import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HelpdeskService {
  private apiUrl = 'http://localhost:8080/api/helpdesk';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  createTicket(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, {
      headers: this.getHeaders(),
    });
  }

  getAllTickets(): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getTicketsByStatus(status: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/helpdesk/status/${status}`, {
      headers: this.getHeaders(),
    });
  }

  getTicketById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  downloadFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/file`, {
      headers: this.getHeaders(),
      responseType: 'blob',
    });
  }

  deleteTicket(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

 updateTicketStatus(id: number, status: string): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/helpdesk/${id}/status?helpDeskStatus=${status}`,
    {},
    { headers: this.getHeaders() }
  );
}

}
