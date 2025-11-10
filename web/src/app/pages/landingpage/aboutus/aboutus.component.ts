import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { ViewportScroller } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AppDialogOverviewComponent } from '../../template/ui-components/dialog/dialog.component';
import { AppFooterComponent } from 'src/app/components/footer/footer.component';

interface teamMembers {
  id: number;
  name: string;
  role: string;
  avatar: string;
  description: string;
  icon: string;
}

interface projectMetrics {
  id: number;
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [
    AppFooterComponent,
    MaterialModule,
    TablerIconsModule,
    RouterLink,
  ],
  templateUrl: './aboutus.component.html',
})
export class AppAboutusComponent {
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  options = this.settings.getOptions();

  constructor(
    private settings: CoreService,
    private scroller: ViewportScroller,
    public dialog: MatDialog
  ) {}

  gotoDemos() {
    this.scroller.scrollToAnchor('demos');
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    const dialogRef = this.dialog.open(AppDialogOverviewComponent, {
      width: '400px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    document.body.style.overflow = 'hidden';

    dialogRef.afterClosed().subscribe(() => {
      document.body.style.overflow = '';
    });
  }

  // Miembros del equipo basados en el SRS
  teamMembers: teamMembers[] = [
    {
      id: 1,
      name: 'Vanessa Balderas Martínez',
      role: 'Líder de Proyecto',
      avatar: '',
      icon: 'user-check',
      description: 'Responsable de la coordinación general del proyecto y gestión de requerimientos.'
    },
    {
      id: 2,
      name: 'Juan Antonio Avalos García',
      role: 'Desarrollador Hardware',
      avatar: '',
      icon: 'cpu',
      description: 'Especialista en integración de sensores y diseño electrónico del casco inteligente.'
    },
    {
      id: 3,
      name: 'Angel Alejandro Chávez Castillón',
      role: 'Desarrollador Software',
      avatar: '',
      icon: 'code',
      description: 'Encargado del desarrollo de la aplicación móvil y plataforma web.'
    },
    {
      id: 4,
      name: 'Isaac De Guerreroosio Arenas',
      role: 'Especialista en Sensores',
      avatar: '',
      icon: 'settings',
      description: 'Experto en calibración y validación de sensores biométricos y ambientales.'
    },
    {
      id: 5,
      name: 'Alexander Parra Espinosa',
      role: 'Arquitecto de Sistema',
      avatar: '',
      icon: 'layout',
      description: 'Diseñador de la arquitectura integral del sistema y coordinación técnica.'
    }
  ];

  // Métricas del proyecto basadas en los RNF del SRS
  projectMetrics: projectMetrics[] = [
    {
      id: 1,
      value: '99%',
      label: 'Disponibilidad del Sistema',
      icon: 'shield-check'
    },
    {
      id: 2,
      value: '< 3s',
      label: 'Tiempo de Respuesta',
      icon: 'clock'
    },
    {
      id: 3,
      value: '50+',
      label: 'Miners Monitored Simultaneously',
      icon: 'users'
    },
    {
      id: 4,
      value: '12h',
      label: 'Autonomía del Casco',
      icon: 'battery'
    }
  ];

  // Función para obtener color basado en el rol
  getRoleColor(role: string): string {
    const colorMap: { [key: string]: string } = {
      'Líder de Proyecto': 'primary',
      'Desarrollador Hardware': 'accent',
      'Desarrollador Software': 'warn',
      'Especialista en Sensores': 'success',
      'Arquitecto de Sistema': 'info'
    };
    return colorMap[role] || 'primary';
  }

  // Función para obtener icono de fondo basado en el ID
  getMemberBackground(id: number): string {
    const backgrounds = [
      'bg-light-primary',
      'bg-light-accent',
      'bg-light-warn',
      'bg-light-success',
      'bg-light-info'
    ];
    return backgrounds[(id - 1) % backgrounds.length];
  }
}