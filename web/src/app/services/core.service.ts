import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettings, defaults } from '../config';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  get notify(): Observable<Record<string, any>> {
    return this.notify$.asObservable();
  }

  private htmlElement!: HTMLHtmlElement;

  private notify$ = new BehaviorSubject<Record<string, any>>({});

  constructor() {
    this.htmlElement = document.querySelector('html')!;
  }

  getOptions() {
    return this.options;
  }

  setOptions(options: AppSettings) {
    this.options = Object.assign(defaults, options);
    this.notify$.next(this.options);
  }

  toggleTheme(): void {
    this.options.theme = this.options.theme === 'dark' ? 'light' : 'dark';

    // Guardar en localStorage
    localStorage.setItem('theme', this.options.theme);

    if (this.options.theme === 'dark') {
      this.htmlElement.classList.add('dark-theme');
      this.htmlElement.classList.remove('light-theme');
    } else {
      this.htmlElement.classList.remove('dark-theme');
      this.htmlElement.classList.add('light-theme');
    }

    this.notify$.next(this.options);
  }

  loadThemeFromStorage(): void {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.options.theme = savedTheme;

    if (savedTheme === 'dark') {
      this.htmlElement.classList.add('dark-theme');
      this.htmlElement.classList.remove('light-theme');
    } else {
      this.htmlElement.classList.remove('dark-theme');
      this.htmlElement.classList.add('light-theme');
    }

    this.notify$.next(this.options);
  }

  private options = defaults;

  getLanguage() {
    return this.options.language;
  }

  setLanguage(lang: string) {
    this.options.language = lang;
    localStorage.setItem('language', lang); //  Guardar en localStorage
    this.notify$.next({ lang });
  }

  loadLanguageFromStorage(): void {
    const savedLanguage = localStorage.getItem('language') || 'en';
    this.options.language = savedLanguage;
    this.notify$.next({ lang: savedLanguage });
  }
}
