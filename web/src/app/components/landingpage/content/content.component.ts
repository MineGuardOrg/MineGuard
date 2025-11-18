import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // ✅ Añade RouterModule aquí
import { MaterialModule } from '../../../material.module';
import { CommonModule, ViewportScroller } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CoreService } from 'src/app/services/core.service';
import { AppDialogOverviewComponent } from '../../../pages/template/ui-components/dialog/dialog.component';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

interface SystemComponent {
  id: number;
  name: string;
  description: string;
  icon: string;
  features: string[];
}

interface KeyFeature {
  id: number;
  icon: string;
  color: string;
  title: string;
  description: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

interface Metric {
  id: number;
  icon: string;
  color: string;
  value: string;
  label: string;
}

interface BenefitsSection {
  TITLE: string;
  TITLE_HIGHLIGHT: string;
  ITEMS: KeyFeature[];
}

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    MaterialModule, 
    FormsModule, 
    TablerIconsModule, 
    CommonModule, 
    TranslateModule,
    RouterModule  // ✅ Añade RouterModule aquí
  ],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class AppContentComponent implements OnInit {
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  options = this.settings.getOptions();

  systemComponents: SystemComponent[] = [];
  keyFeatures: KeyFeature[] = [];
  teamMembers: TeamMember[] = [];
  metrics: Metric[] = [];
  technologies: string[] = [];
  benefits: BenefitsSection = { TITLE: '', TITLE_HIGHLIGHT: '', ITEMS: [] };

  currentLang: string = 'es'; // idioma por defecto

  constructor(
    private settings: CoreService,
    private scroller: ViewportScroller,
    public dialog: MatDialog,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('es');

    // Cargar idioma guardado en localStorage (si existe)
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      this.currentLang = savedLang;
      this.translate.use(this.currentLang);
    }
  }

  ngOnInit(): void {
    this.loadTranslations(this.currentLang);

    // Escucha cambios de idioma
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
      localStorage.setItem('lang', this.currentLang); // Guardar idioma
      this.loadTranslations(this.currentLang);
    });
  }

  switchLanguage(): void {
    this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
    this.translate.use(this.currentLang);
    localStorage.setItem('lang', this.currentLang); // Guardar idioma
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
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

  /**
   * Carga los datos del idioma actual desde assets/i18n/[lang].json
   */
  loadTranslations(lang: string): void {
    this.translate.get([
      'SYSTEM_COMPONENTS',
      'KEY_FEATURES',
      'TEAM_MEMBERS',
      'METRICS',
      'BENEFITS',
      'TECHNOLOGIES'
    ]).subscribe(translations => {
      this.systemComponents = translations['SYSTEM_COMPONENTS'];
      this.keyFeatures = translations['KEY_FEATURES'];
      this.teamMembers = translations['TEAM_MEMBERS'];
      this.metrics = translations['METRICS'];
      this.benefits = translations['BENEFITS'];
      this.technologies = translations['TECHNOLOGIES'];
    });
  }

  trackByValue(index: number, item: any): any {
    return item.id || index;
  }

  trackByName(index: number, item: any): any {
    return item.name;
  }

  trackByFeature(index: number, item: any): any {
    return item;
  }
}