import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { ViewportScroller } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
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
  selector: 'app-teaching',
  standalone: true,
  imports: [
    AppFooterComponent,
    MaterialModule,
    TablerIconsModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './teaching.component.html',
})
export class AppTeachingComponent {
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: '/assets/images/flag/icon-flag-english.png',
  };

  public languages: any[] = [
    {
      language: 'English',
      code: 'en',
      type: 'US',
      icon: '/assets/images/flag/icon-flag-english.png',
    },
    {
      language: 'Español',
      code: 'es',
      type: 'ES',
      icon: '/assets/images/flag/icon-flag-spanish.png',
    },
  ];

  options = this.settings.getOptions();

  constructor(
    private settings: CoreService,
    private scroller: ViewportScroller,
    public dialog: MatDialog,
    private translate: TranslateService
  ) {
    this.settings.loadLanguageFromStorage();

    const lang = this.settings.getLanguage();
    this.translate.setDefaultLang('en');
    this.translate.use(lang);

    this.selectedLanguage =
    this.languages.find((l) => l.code === lang) || this.languages[0];
  }

  changeLanguage(lang: any): void {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
    this.settings.setLanguage(lang.code);
  }

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
      title: 'teaching.reasons.share.title',
      subtitle:
        'teaching.reasons.share.description',
    },
    {
      id: 2,
      color: 'primary',
      icon: 'solar:share-linear',
      title: 'teaching.reasons.inspire.title',
      subtitle:
        'teaching.reasons.inspire.description',
    },
    {
      id: 3,
      color: 'primary',
      icon: 'solar:magic-stick-3-linear',
      title: 'teaching.reasons.teach.title',
      subtitle:
        'teaching.reasons.teach.description',
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
