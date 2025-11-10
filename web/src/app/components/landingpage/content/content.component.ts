import { Component, Output, EventEmitter, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CoreService } from 'src/app/services/core.service';
import { ViewportScroller } from '@angular/common';
import { AppDialogOverviewComponent } from '../../../pages/template/ui-components/dialog/dialog.component';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

interface systemComponents {
  id: number;
  name: string;
  description: string;
  icon: string;
  features: string[];
}

interface keyFeatures {
  id: number;
  icon: string;
  color: string;
  title: string;
  description: string;
}

interface teamMembers {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

interface metrics {
  id: number;
  icon: string;
  color: string;
  value: string;
  label: string;
}

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [MaterialModule, FormsModule, TablerIconsModule, CommonModule, TranslateModule],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class AppContentComponent {
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  options = this.settings.getOptions();

  constructor(
    private settings: CoreService,
    private scroller: ViewportScroller,
    public dialog: MatDialog,
    private translate: TranslateService
  ) {}

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

  // Componentes del Sistema Minero Seguro
  systemComponents: systemComponents[] = [
    {
      id: 1,
      name: 'Casco Inteligente',
      description: 'Dispositivo wearable con sensores biométricos y ambientales integrados para monitoreo continuo',
      icon: 'mdi:hard-hat',
      features: [
        'Monitoreo de ritmo cardíaco en tiempo real',
        'Detección de temperatura corporal',
        'Sensor de caídas e impactos',
        'Detección de gases tóxicos (CO, CH4, H2S)',
        'Transmisión Bluetooth 5.0'
      ]
    },
    {
      id: 2,
      name: 'Aplicación Móvil',
      description: 'Interfaz intuitiva para capataces y jefes de cuadrilla con control total del equipo',
      icon: 'mdi:cellphone',
      features: [
        'Visualización de datos en tiempo real',
        'Sistema de alertas inmediatas',
        'Almacenamiento local de registros',
        'Sincronización automática con plataforma web',
        'Modo offline para zonas sin cobertura'
      ]
    },
    {
      id: 3,
      name: 'Plataforma Web',
      description: 'Sistema centralizado de monitoreo y análisis para supervisores y gerencia',
      icon: 'mdi:monitor-dashboard',
      features: [
        'Dashboard interactivo en tiempo real',
        'Análisis predictivo con Machine Learning',
        'Reportes históricos personalizables',
        'Gestión de múltiples usuarios y permisos',
        'Exportación de datos y métricas'
      ]
    }
  ];

  // Características Clave del Sistema
  keyFeatures: keyFeatures[] = [
    {
      id: 1,
      color: 'primary',
      icon: 'mdi:heart-pulse',
      title: 'Monitoreo Biométrico',
      description: 'Seguimiento continuo y preciso de signos vitales de los mineros en tiempo real'
    },
    {
      id: 2,
      color: 'accent',
      icon: 'mdi:gas-cylinder',
      title: 'Detección de Gases',
      description: 'Alerta inmediata ante presencia de gases tóxicos con precisión certificada'
    },
    {
      id: 3,
      color: 'warn',
      icon: 'mdi:alert-octagon',
      title: 'Alertas Instantáneas',
      description: 'Notificaciones en tiempo real ante cualquier emergencia detectada'
    },
    {
      id: 4,
      color: 'primary',
      icon: 'mdi:chart-box',
      title: 'Análisis Predictivo',
      description: 'Machine Learning para identificación temprana de patrones de riesgo'
    }
  ];

  // Miembros del Equipo
  teamMembers: teamMembers[] = [
    {
      id: 1,
      name: 'Vanessa Balderas Martínez',
      role: 'Líder de Proyecto',
      avatar: '/assets/images/team/vanessa.jpg'
    },
    {
      id: 2,
      name: 'Juan Antonio Avalos García',
      role: 'Desarrollador Hardware',
      avatar: '/assets/images/team/juan.jpg'
    },
    {
      id: 3,
      name: 'Angel Alejandro Chávez Castillón',
      role: 'Desarrollador Software',
      avatar: '/assets/images/team/angel.jpg'
    },
    {
      id: 4,
      name: 'Isaac De Guerreroosio Arenas',
      role: 'Especialista en Sensores',
      avatar: '/assets/images/team/isaac.jpg'
    },
    {
      id: 5,
      name: 'Alexander Parra Espinosa',
      role: 'Arquitecto de Sistema',
      avatar: '/assets/images/team/alexander.jpg'
    }
  ];

  // Métricas del Sistema
  metrics: metrics[] = [
    {
      id: 1,
      color: 'primary',
      icon: 'mdi:speedometer',
      value: '< 3s',
      label: 'Tiempo de Respuesta'
    },
    {
      id: 2,
      color: 'accent',
      icon: 'mdi:shield-check',
      value: '99%',
      label: 'Disponibilidad del Sistema'
    },
    {
      id: 3,
      color: 'success',
      icon: 'mdi:account-group',
      value: '50+',
      label: 'Usuarios Simultáneos'
    },
    {
      id: 4,
      color: 'warning',
      icon: 'mdi:battery-high',
      value: '12h',
      label: 'Autonomía del Casco'
    }
  ];

  // Tecnologías Utilizadas
  technologies: string[] = [
    'Sensores Biométricos',
    'Bluetooth 5.0',
    'Machine Learning',
    'Angular Framework',
    'Android SDK',
    'Cloud Computing',
    'Cifrado AES-256',
    'APIs RESTful',
    'WebSockets',
    'PostgreSQL',
    'Redis Cache',
    'Docker'
  ];

  // Beneficios del Sistema
  benefits: keyFeatures[] = [
    {
      id: 1,
      color: 'primary',
      icon: 'mdi:shield-account',
      title: 'Reducción de Accidentes',
      description: 'Prevención proactiva de riesgos laborales con alertas tempranas y monitoreo continuo'
    },
    {
      id: 2,
      color: 'accent',
      icon: 'mdi:hospital-box',
      title: 'Respuesta Rápida',
      description: 'Actuación inmediata ante emergencias con geolocalización precisa del personal'
    },
    {
      id: 3,
      color: 'warn',
      icon: 'mdi:chart-line',
      title: 'Análisis de Datos',
      description: 'Toma de decisiones inteligentes basada en información histórica y en tiempo real'
    },
    {
      id: 4,
      color: 'primary',
      icon: 'mdi:file-document-multiple',
      title: 'Cumplimiento Normativo',
      description: 'Adecuación total a NOM-032-STPS y regulaciones internacionales de seguridad minera'
    }
  ];
}