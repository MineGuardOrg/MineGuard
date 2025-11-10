import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    MaterialModule,
    RouterLink,
    FormsModule,
    TablerIconsModule,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './footer.component.html',
})
export class AppFooterComponent {
  
  // Información del equipo basada en el SRS
  teamMembers = [
    'Balderas Martinez Vanessa',
    'Avalos Garcia Juan Antonio', 
    'Chávez Castillón Angel Alejandro',
    'De Guerreroosio Arenas Isaac',
    'Parra Espinosa Alexander'
  ];

  constructor(public translate: TranslateService) {}

  // Método para obtener el año actual
  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}