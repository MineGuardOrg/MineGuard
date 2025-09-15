import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { ViewportScroller } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AppDialogOverviewComponent } from '../../template/ui-components/dialog/dialog.component';
import { AppFooterComponent } from 'src/app/components/footer/footer.component';

interface courses {
  id: number;
  name: string;
  url: string;
  imgSrc: string;
}

interface reasons {
  id: number;
  icon: string;
  color: string;
  title: string;
  subtitle: string;
}

interface facts {
  id: number;
  icon: string;
  color: string;
  title: string;
  subtext: string;
}

interface facts2 {
  id: number;
  icon: string;
  color: string;
  title: string;
  subtext: string;
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

  courses: courses[] = [
    {
      id: 1,
      imgSrc: '/assets/images/landingpage/demos/PT-1.png',
      name: 'Sistema de información estudiantil',
      url: '#',
    },
    {
      id: 2,
      imgSrc: '/assets/images/landingpage/demos/PT-2.png',
      name: 'Gestión multiescolar para distritos',
      url: '#',
    },
    {
      id: 3,
      imgSrc: '/assets/images/landingpage/demos/PT-3.png',
      name: 'Solución de facturación en línea',
      url: '#',
    },
    {
      id: 4,
      imgSrc: '/assets/images/landingpage/demos/PT-4.png',
      name: 'Sitios web compatibles con dispositivos móviles',
      url: '#',
    },
    {
      id: 5,
      imgSrc: '/assets/images/landingpage/demos/PT-5.png',
      name: 'Libro de calificaciones del docente',
      url: '#',
    },
    {
      id: 6,
      imgSrc: '/assets/images/landingpage/demos/PT-6.png',
      name: 'Generación de informes para toda la red escolar',
      url: '#',
    },
  ];

  reasons: reasons[] = [
    {
      id: 1,
      color: 'primary',
      icon: 'solar:book-linear',
      title: 'Enseña a tu manera',
      subtitle:
        'Crea e imparte los cursos que desees, con total libertad sobre el contenido, el formato y el horario.',
    },
    {
      id: 2,
      color: 'primary',
      icon: 'solar:share-linear',
      title: 'Inspira a tu comunidad',
      subtitle:
        'Comparte tus conocimientos, guía a tus seguidores a descubrir nuevas pasiones, adquirir habilidades y avanzar profesionalmente.',
    },
    {
      id: 3,
      color: 'primary',
      icon: 'solar:magic-stick-3-linear',
      title: 'Conecta y crece',
      subtitle:
        'Expande tu red profesional o académica mientras desarrollas y fortaleces tus conocimientos.',
    },
  ];

  facts: facts[] = [
    {
      id: 1,
      color: 'primary',
      icon: 'solar:user-hand-up-linear',
      title: '1,245,341',
      subtext: 'Alumnos registrados',
    },
    {
      id: 2,
      color: 'primary',
      icon: 'mdi:account-tie-outline',
      title: '828,867',
      subtext: 'Docentes y administrativos',
    },
  ];

  facts2: facts2[] = [
    {
      id: 3,
      color: 'primary',
      icon: 'mdi:account-group-outline',
      title: '46,328',
      subtext: 'Comunidades',
    },
    {
      id: 4,
      color: 'primary',
      icon: 'solar:card-transfer-linear',
      title: '1,926,436',
      subtext: 'Transacciones realizadas',
    },
  ];
}
