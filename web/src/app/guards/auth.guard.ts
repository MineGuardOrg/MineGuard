import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {}

  private checkLogin(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      tap((loggedIn) => {
        if (!loggedIn) {
          this.router.navigate(['/auth/boxed-login']);
        }
      }),
      map((loggedIn) => loggedIn)
    );
  }

  canActivate(): Observable<boolean> {
    return this.checkLogin();
  }

  canActivateChild(): Observable<boolean> {
    return this.checkLogin();
  }
}
