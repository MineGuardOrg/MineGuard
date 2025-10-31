import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';

  // Estado observable para saber si el usuario está logueado
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  // Login compatible con diferentes backends (ASP.NET o FastAPI/OAuth2).
  // Intenta usar la ruta actual `/auth/login` y acepta respuestas con `token` o `access_token`.
  login(credentials: { employee_number: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        // soportar ambos formatos: { token } o { access_token }
        const token = response?.token ?? response?.access_token;
        const role = response?.role; // Extraer el rol de la respuesta
        if (token) {
          this.setToken(token);
          this.loggedIn.next(true);
        }
        if (role) {
          localStorage.setItem('role', role); // Almacenar el rol en localStorage
        }
      })
    );
  }

  /*
  Si tu FastAPI usa el flujo OAuth2 (endpoint `/token` que espera
  `application/x-www-form-urlencoded` y devuelve `access_token`),
  puedes usar este método en su lugar:

  loginOAuth2(credentials: { username: string; password: string }): Observable<any> {
    const body = new URLSearchParams();
    body.set('username', credentials.username);
    body.set('password', credentials.password);
    body.set('grant_type', 'password');

    return this.http.post<any>(`${this.apiUrl}/token`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).pipe(
      tap((response) => {
        const token = response?.access_token;
        if (token) {
          this.setToken(token);
          this.loggedIn.next(true);
        }
      })
    );
  }
  */

  register(user: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/Auth/register`, user);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
  }

  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      //console.log('Payload:', payload);
      return payload.rol || null; // Aquí accede a la propiedad 'rol'
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  getUserId(): number | null {
  const token = this.getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Payload:', payload);
    return payload.id ? Number(payload.id) : null;
  } catch (e) {
    console.error('Error decoding token', e);
    return null;
  }
}

}
