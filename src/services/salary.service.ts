import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalaryService {
  private apiUrl3 = 'http://localhost:8080/api/salary/upload';

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
    return this.http.post(this.apiUrl3, formData, {
      headers: this.getHeaders(),
    });
  }
}
