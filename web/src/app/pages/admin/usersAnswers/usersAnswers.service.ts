import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface UsersAnswer {
  user_id: number;
  question_id: number;
  answer: string;
  is_correct: boolean;
  date?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersAnswersService {
  private apiUrl = `${environment.apiUrl}/UserAnswer`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UsersAnswer[]> {
    return this.http.get<UsersAnswer[]>(`${this.apiUrl}/list`);
  }

  getByUserAndQuestion(user_id: number, question_id: number): Observable<UsersAnswer> {
    return this.http.post<UsersAnswer>(`${this.apiUrl}/get`, { user_id, question_id });
  }

  create(answer: UsersAnswer): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, answer);
  }

  update(answer: UsersAnswer): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, answer);
  }

  delete(user_id: number, question_id: number): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}/delete`, { body: { user_id, question_id } });
  }
}
