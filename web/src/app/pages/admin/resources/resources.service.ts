import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'any',
})
export class ResourceService {
  private apiUrl = `${environment.apiUrl}/Resource`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${id}`, { headers: this.getHeaders() });
  }

  create(resource: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, resource, { headers: this.getHeaders() });
  }

  update(resource: any): Observable<any> {
    const payload = {
      fileName: resource.fileName,
      fileUrl: resource.fileUrl,
      lessonId: resource.lessonId
    };

    return this.http.put(`${this.apiUrl}/update/${resource.id}`, payload, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() });
  }
}