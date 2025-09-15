import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AuthService } from 'src/app/services/auth.service';

const passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { mismatch: true };
};

@Component({
  selector: 'app-boxed-register',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule,
    TablerIconsModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './boxed-register.component.html',
})
export class AppBoxedRegisterComponent {
  options = this.settings.getOptions();

  form = new FormGroup(
    {
      uname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      //birthdate: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator }
  );

  constructor(
    private settings: CoreService,
    private router: Router,
    private authService: AuthService
  ) {}

  get f() {
    return this.form.controls;
  }

  submit() {
    console.log('Form valid:', this.form.valid);
    console.log('Form errors:', this.form.errors);
    console.log('Form value:', this.form.value);

    if (this.form.invalid) {
      alert('Formulario inválido, verifica los campos');
      return;
    }

    const user = {
      name: this.form.value.uname!,
      //lastname: this.form.value.lastname!,
      email: this.form.value.email!,
      password: this.form.value.password!,
      //birthdate: this.form.value.birthdate!,
    };

    this.authService.register(user).subscribe({
      next: (res) => {
        alert('Registro exitoso');
        this.router.navigate(['/auth/boxed-login']);
      },
      error: (err) => {
        console.error('Error en registro', err);
        alert('Error al registrar usuario');
      },
    });
  }
}
