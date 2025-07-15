import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';


const NAV_URL = environment.apiUrl;


@Injectable({
  providedIn: 'root',
})
export class HelpdeskService {

  //baseUrl = "http://localhost:8080/api"
  // private apiUrl = 'http://localhost:8080/api/helpdesk';

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
    return this.http.post(`${NAV_URL}/helpdesk`, formData, {
      headers: this.getHeaders(),
    });
  }

  getAllTickets(): Observable<any> {
    return this.http.get(`${NAV_URL}/helpdesk`, {
      headers: this.getHeaders(),
    });
  }

  getTicketsByStatus(status: string): Observable<any> {
    return this.http.get(`${NAV_URL}/helpdesk/helpdesk/status/${status}`, {
      headers: this.getHeaders(),
    });
  }

  getTicketById(id: number): Observable<any> {
    return this.http.get(`${NAV_URL}/helpdesk/${id}`, {
      headers: this.getHeaders(),
    });
  }

  downloadFile(id: number): Observable<Blob> {
    return this.http.get(`${NAV_URL}/helpdesk/${id}/file`, {
      headers: this.getHeaders(),
      responseType: 'blob',
    });
  }

  deleteTicket(id: number): Observable<any> {
    return this.http.delete(`${NAV_URL}/helpdesk/${id}`, {
      headers: this.getHeaders(),
    });
  }

 updateTicketStatus(id: number, status: string): Observable<any> {
  return this.http.put(
    `${NAV_URL}/helpdesk/helpdesk/${id}/status?helpDeskStatus=${status}`,
    {},
    { headers: this.getHeaders() }
  );
}

}
