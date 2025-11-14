import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface FooterLink {
  route: string;
  label: string;
}

interface SocialLink {
  url: string;
  icon: string;
  label: string;
}

interface FooterData {
  SYSTEM: {
    TITLE: string;
    LINKS: FooterLink[];
  };
  DOCUMENTATION: {
    TITLE: string;
    LINKS: FooterLink[];
  };
  SOCIAL: {
    TITLE: string;
    LINKS: SocialLink[];
  };
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    MaterialModule,
    RouterLink,
    FormsModule,
    TablerIconsModule,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class AppFooterComponent implements OnInit {
  
  footerData: FooterData | null = null;

  constructor(public translate: TranslateService) {
    // Cargar idioma guardado o usar español por defecto
    const savedLang = localStorage.getItem('selectedLanguage') || 'es';
    this.translate.setDefaultLang('es');
    this.translate.use(savedLang);
  }

  ngOnInit(): void {
    this.loadFooterData();
    
    // Escucha cambios de idioma y guarda la preferencia
    this.translate.onLangChange.subscribe((event) => {
      localStorage.setItem('selectedLanguage', event.lang);
      this.loadFooterData();
    });
  }

  loadFooterData(): void {
    this.translate.get('FOOTER').subscribe(data => {
      this.footerData = data;
    });
  }

  // Método para obtener el año actual
  getCurrentYear(): number {
    return new Date().getFullYear();
  }
}