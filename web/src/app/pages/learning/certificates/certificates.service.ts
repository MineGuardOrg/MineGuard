import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any',
})
export class CertificatesService {
  private apiUrl = `${environment.apiUrl}/Certificate/list/by-user`;

  constructor(private http: HttpClient) {}

  getCertificatesByUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(this.apiUrl, { headers });
  }
}