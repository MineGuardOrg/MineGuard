import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { ViewportScroller } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AppDialogOverviewComponent } from '../../template/ui-components/dialog/dialog.component';
import { AppFooterComponent } from 'src/app/components/footer/footer.component';

interface supportChannels {
  id: number;
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  contact: string;
  hours: string;
}

interface faqs {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [
    AppFooterComponent,
    MaterialModule,
    TablerIconsModule,
    RouterLink,
  ],
  templateUrl: './help.component.html',
})
export class AppHelpComponent {
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

  // Canales de soporte técnico
  supportChannels: supportChannels[] = [
    {
      id: 1,
      color: 'primary',
      icon: 'mdi:email-outline',
      title: 'Soporte por Email',
      subtitle: 'Respuesta en 24 horas',
      contact: 'MineGuard@gmail.com',
      hours: 'Lunes a Viernes 8:00 - 18:00 hrs'
    },
    {
      id: 2,
      color: 'accent',
      icon: 'mdi:phone-outline',
      title: 'Soporte Telefónico',
      subtitle: 'Atención inmediata',
      contact: '+52 55 1234 5678',
      hours: 'Lunes a Viernes 9:00 - 17:00 hrs'
    },
    {
      id: 3,
      color: 'warn',
      icon: 'mdi:chat-outline',
      title: 'Soporte Técnico Remoto',
      subtitle: 'Asistencia en tiempo real',
      contact: 'Solicitar cita previa',
      hours: 'Disponible según agenda'
    }
  ];

  // Preguntas frecuentes específicas del sistema minero
  faqs: faqs[] = [
    {
      question: '¿Qué requisitos técnicos necesita mi mina para implementar el sistema?',
      answer: 'El sistema requiere conectividad Bluetooth para la comunicación entre cascos y dispositivos móviles, y acceso a internet para la sincronización con la plataforma web. No se necesita infraestructura compleja.'
    },
    {
      question: '¿Cuál es la autonomía de batería del casco inteligente?',
      answer: 'El casco tiene una autonomía de 12 horas continuas de operación. Incluye sistema de carga rápida y alertas de batería baja.'
    },
    {
      question: '¿Cómo maneja el sistema las zonas sin conectividad?',
      answer: 'La aplicación móvil almacena localmente los datos y los sincroniza automáticamente cuando recupera la conexión, garantizando que no se pierda información.'
    },
    {
      question: '¿El sistema cumple con las normativas de seguridad minera?',
      answer: 'Sí, nuestro sistema está diseñado para cumplir con la NOM-023-STPS-2012 y otras regulaciones de seguridad minera aplicables.'
    },
    {
      question: '¿Qué tipo de mantenimiento requiere el equipo?',
      answer: 'El casco requiere calibración mensual de sensores y mantenimiento preventivo trimestral. La plataforma software incluye actualizaciones automáticas.'
    },
    {
      question: '¿Puedo integrar el sistema con otros softwares de la empresa?',
      answer: 'Sí, ofrecemos APIs para integración con sistemas ERP, de gestión de seguridad y plataformas de reportes existentes.'
    }
  ];
}