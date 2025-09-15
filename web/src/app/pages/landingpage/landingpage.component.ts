import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { ViewportScroller } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AppDialogOverviewComponent } from '../template/ui-components/dialog/dialog.component';
import { AppFooterComponent } from 'src/app/components/footer/footer.component';
import { AppContentComponent } from 'src/app/components/landingpage/content/content.component';

interface apps {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  link: string;
}

interface testimonials {
  id: number;
  name: string;
  subtext: string;
  imgSrc: string;
}

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [
    AppContentComponent,
    AppFooterComponent,
    MaterialModule,
    TablerIconsModule,
    RouterLink,
    TranslateModule
  ],
  templateUrl: './landingpage.component.html',
})
export class AppLandingpageComponent {
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

  options = this.settings.getOptions();

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

  apps: apps[] = [
    {
      id: 1,
      icon: 'solar:chat-line-line-duotone',

      title: 'Chat Application',
      subtitle: 'Messages & Emails',
      link: '/apps/chat',
    },
    {
      id: 2,
      icon: 'solar:checklist-minimalistic-line-duotone',
      title: 'Todo App',
      subtitle: 'Completed task',
      link: '/apps/todo',
    },
    {
      id: 3,
      icon: 'solar:bill-list-line-duotone',
      title: 'Invoice App',
      subtitle: 'Get latest invoice',
      link: '/apps/invoice',
    },
    {
      id: 4,
      icon: 'solar:calendar-line-duotone',
      title: 'Calendar App',
      subtitle: 'Get Dates',
      link: '/apps/calendar',
    },
    {
      id: 5,
      icon: 'solar:smartphone-2-line-duotone',
      title: 'Contact Application',
      subtitle: '2 Unsaved Contacts',
      link: '/apps/contacts',
    },
    {
      id: 6,
      icon: 'solar:ticket-line-duotone',
      title: 'Tickets App',
      subtitle: 'Create new ticket',
      link: '/apps/tickets',
    },
    {
      id: 7,
      icon: 'solar:letter-line-duotone',
      title: 'Email App',
      subtitle: 'Get new emails',
      link: '/apps/email/inbox',
    },
    {
      id: 8,
      icon: 'solar:book-2-line-duotone',
      title: 'Courses',
      subtitle: 'Create new course',
      link: '/apps/courses',
    },
  ];
  testimonials: testimonials[] = [
    {
      id: 1,
      imgSrc: '/assets/images/landingpage/profile/testimonial1.png',
      name: 'Jenny Wilson',
      subtext: 'Features avaibility',
    },
  ];
}
