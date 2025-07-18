import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';


const NAV_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class SalaryService {


  constructor(private http: HttpClient) {}

  private getHeaders(contentType: string = ''): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    const headersConfig: any = { Authorization: `Bearer ${token}` };
console.log(token)
    if (contentType) {
      headersConfig['Content-Type'] = contentType;
    }

    return new HttpHeaders(headersConfig);
  }


  uploadSalary(formData: FormData): Observable<any> {
    return this.http.post(`${NAV_URL}/salary/upload`, formData, {
      headers: this.getHeaders(),
    });
  }
}
