import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { ViewportScroller } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AppDialogOverviewComponent } from '../../template/ui-components/dialog/dialog.component';
import { AppFooterComponent } from 'src/app/components/footer/footer.component';

interface securityPolicies {
  id: number;
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  description: string;
}

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [
    AppFooterComponent,
    MaterialModule,
    TablerIconsModule,
    RouterLink,
  ],
  templateUrl: './privacy.component.html',
})
export class AppPrivacyComponent {
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

  // Políticas de seguridad para el sistema minero
  securityPolicies: securityPolicies[] = [
    {
      id: 1,
      color: 'primary',
      icon: 'mdi:lock-outline',
      title: 'Cifrado de Datos',
      subtitle: 'Protección AES-256',
      description: 'Todos los datos se cifran en reposo y durante la transmisión'
    },
    {
      id: 2,
      color: 'accent',
      icon: 'mdi:shield-check',
      title: 'Acceso Controlado',
      subtitle: 'Autenticación multi-factor',
      description: 'Sistemas de autenticación robustos para proteger el acceso'
    },
    {
      id: 3,
      color: 'warn',
      icon: 'mdi:eye-off',
      title: 'Privacidad Garantizada',
      subtitle: 'Cumplimiento LFPDPPP',
      description: 'Respetamos y protegemos los datos personales de los usuarios'
    }
  ];
}