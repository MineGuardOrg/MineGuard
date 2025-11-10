import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { ViewportScroller } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AppDialogOverviewComponent } from '../../template/ui-components/dialog/dialog.component';
import { AppFooterComponent } from 'src/app/components/footer/footer.component';

interface systemComponents {
  id: number;
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  features: string[];
}

interface technicalSpecs {
  id: number;
  value: string;
  label: string;
}

@Component({
  selector: 'app-employment',
  standalone: true,
  imports: [
    AppFooterComponent,
    MaterialModule,
    TablerIconsModule,
    RouterLink,
  ],
  templateUrl: './employment.component.html',
})
export class AppEmploymentComponent {
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

  // Componentes del sistema basados en el SRS
  systemComponents: systemComponents[] = [
    {
      id: 1,
      color: 'primary',
      icon: 'mdi:hard-hat',
      title: 'Casco Inteligente',
      subtitle: 'Dispositivo wearable con sensores especializados',
      features: [
        'Sensores biométricos: ritmo cardíaco y temperatura',
        'Detección de caídas e impactos bruscos',
        'Sensor de gases tóxicos en tiempo real',
        'Transmisión Bluetooth 5.0',
        'Batería de 12 horas de autonomía'
      ]
    },
    {
      id: 2,
      color: 'accent',
      icon: 'mdi:cellphone',
      title: 'Aplicación Móvil',
      subtitle: 'Interfaz para capataces y jefes de cuadrilla',
      features: [
        'Recepción de datos en tiempo real',
        'Almacenamiento local en modo offline',
        'Alertas inmediatas ante emergencias',
        'Sincronización automática con plataforma web',
        'Interfaz intuitiva para personal técnico'
      ]
    },
    {
      id: 3,
      color: 'warn',
      icon: 'mdi:monitor-dashboard',
      title: 'Plataforma Web',
      subtitle: 'Sistema centralizado de monitoreo',
      features: [
        'Dashboard en tiempo real múltiple',
        'Algoritmos de Machine Learning',
        'Reportes históricos y análisis predictivo',
        'Gestión de usuarios y permisos',
        'Cumplimiento normativo NOM-023-STPS-2012'
      ]
    }
  ];

  // Especificaciones técnicas basadas en los RNF del SRS
  technicalSpecs: technicalSpecs[] = [
    {
      id: 1,
      value: '99%',
      label: 'Disponibilidad del Sistema'
    },
    {
      id: 2,
      value: '< 3s',
      label: 'Tiempo de Respuesta'
    },
    {
      id: 3,
      value: '50+',
      label: 'Miners Monitored Simultaneously'
    },
    {
      id: 4,
      value: 'AES-256',
      label: 'Cifrado de Datos'
    }
  ];
}