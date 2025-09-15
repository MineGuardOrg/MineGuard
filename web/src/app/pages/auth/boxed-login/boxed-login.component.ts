import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreService } from 'src/app/services/core.service';
import { AuthService } from 'src/app/services/auth.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-boxed-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './boxed-login.component.html',
})
export class AppBoxedLoginComponent {
  options = this.settings.getOptions();

  constructor(
    private settings: CoreService,
    private router: Router,
    private authService: AuthService
  ) {}
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) return;

    const credentials = {
      email: this.form.value.email!,
      password: this.form.value.password!,
    };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        // console.log('Login exitoso', res);
        localStorage.setItem('token', res.token);

        const role = this.authService.getUserRole();
        console.log('Rol del usuario:', role);

        // Redirigir según rol
        if (role === 'Admin') {
          this.router.navigate(['/admin/maintenance']);
        } else {
          this.router.navigate(['/learning/courses']);
        }
      },
      error: (err) => {
        console.error('Error al iniciar sesión', err);
        alert('Login inválido');
      },
    });
  }
}
