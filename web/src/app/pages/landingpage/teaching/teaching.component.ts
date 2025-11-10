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

interface trainingPrograms {
  id: number;
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  duration: string;
  level: string;
}

interface systemStats {
  id: number;
  icon: string;
  color: string;
  title: string;
  subtext: string;
}

interface systemStats2 {
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

  // Programas de capacitación para el sistema minero
  trainingPrograms: trainingPrograms[] = [
    {
      id: 1,
      color: 'primary',
      icon: 'mdi:hard-hat',
      title: 'teaching.programs.basic.title',
      subtitle: 'teaching.programs.basic.description',
      duration: 'teaching.programs.basic.duration',
      level: 'teaching.programs.basic.level'
    },
    {
      id: 2,
      color: 'accent',
      icon: 'mdi:cellphone',
      title: 'teaching.programs.advanced.title',
      subtitle: 'teaching.programs.advanced.description',
      duration: 'teaching.programs.advanced.duration',
      level: 'teaching.programs.advanced.level'
    },
    {
      id: 3,
      color: 'warn',
      icon: 'mdi:chart-box',
      title: 'teaching.programs.analysis.title',
      subtitle: 'teaching.programs.analysis.description',
      duration: 'teaching.programs.analysis.duration',
      level: 'teaching.programs.analysis.level'
    }
  ];

  // Estadísticas del sistema minero
  systemStats: systemStats[] = [
    {
      id: 1,
      color: 'primary',
      icon: 'mdi:account-group',
      title: '500+',
      subtext: 'teaching.stats.trained',
    },
    {
      id: 2,
      color: 'primary',
      icon: 'mdi:factory',
      title: '25+',
      subtext: 'teaching.stats.companies',
    },
  ];

  systemStats2: systemStats2[] = [
    {
      id: 3,
      color: 'primary',
      icon: 'mdi:chart-line',
      title: '98%',
      subtext: 'teaching.stats.satisfaction',
    },
    {
      id: 4,
      color: 'primary',
      icon: 'mdi:book-education',
      title: '15+',
      subtext: 'teaching.stats.programs',
    },
  ];
}