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
  AbstractControl,
  ValidationErrors,
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
  form: FormGroup;

  private employeeNumberValidator = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const val = control.value;
    if (val === null || val === undefined || val === '') return null;
    const num = Number(val);
    if (isNaN(num) || num < 10) return { employeeNumberInvalid: true };
    return null;
  };

  constructor(
    private settings: CoreService,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = new FormGroup({
      employeeNumber: new FormControl('', [Validators.required, this.employeeNumberValidator]),
      password: new FormControl('', [Validators.required]),
    });
  }
  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) return;

    const credentials = {
      employee_number: this.form.value.employeeNumber!,
      password: this.form.value.password!,
    };

    this.authService.login(credentials).subscribe({
      next: (res) => {
        //console.log('Login exitoso', res);
        
        const role = localStorage.getItem('role') || this.authService.getUserRole();
        //console.log('Rol del usuario:', role);

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
