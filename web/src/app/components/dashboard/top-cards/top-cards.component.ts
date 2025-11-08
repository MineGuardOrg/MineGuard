import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

interface topcards {
  id: number;
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  minititle: string;
}

@Component({
  selector: 'app-top-cards',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './top-cards.component.html',
})
export class AppTopCardsComponent {
  topcards: topcards[] = [
    {
      id: 1,
      color: 'primary',
      icon: 'solar:users-group-rounded-line-duotone',
      title: 'Trabajadores activos',
      subtitle: '142',
      minititle: '150 Total en el sistema',
    },
    {
      id: 2,
      color: 'warning',
      icon: 'solar:danger-triangle-outline',
      title: 'Alertas criticas',
      subtitle: '3',
      minititle: '8 alertas en las ultimas 24h',
    },
    {
      id: 3,
      color: 'accent',
      icon: 'solar:home-wifi-outline',
      title: 'Cascos conectados',
      subtitle: '138/150',
      minititle: '92% tasa de conexion',
    },
    {
      id: 4,
      color: 'error',
      icon: 'solar:shield-warning-outline',
      title: 'Nivel de riesgo',
      subtitle: 'Medio',
      minititle: '2 areas requieren atencion',
    },
  ];
}
