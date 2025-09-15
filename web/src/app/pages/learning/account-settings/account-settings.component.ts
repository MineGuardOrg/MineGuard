import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { TablerIconsModule } from 'angular-tabler-icons';
import { OnInit } from '@angular/core';
import { AccountSettingsService } from './account-settings.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

export interface User {
  id: number;
  name: string;
  email: string;
  rol: string;
  created: string;
  address: string;
  phone: string;
}

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    TablerIconsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './account-settings.component.html',
})
export class AppAccountSettingsComponent implements OnInit {
  profile: User = {
    id: 0,
    name: '',
    email: '',
    rol: '',
    created: '',
    address: '',
    phone: '',
  };

  constructor(
    private accountSettingsService: AccountSettingsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.accountSettingsService.getProfile().subscribe({
      next: (data: User) => {
        this.profile = data;
        console.log('Usuario cargado:', data);
      },
      error: (err) => {
        console.error('Error al obtener usuario', err);
      },
    });
  }
}
