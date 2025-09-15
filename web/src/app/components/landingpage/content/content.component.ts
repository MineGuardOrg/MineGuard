import { Component, Output, EventEmitter, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CoreService } from 'src/app/services/core.service';
import { ViewportScroller } from '@angular/common';
import { AppDialogOverviewComponent } from '../../../pages/template/ui-components/dialog/dialog.component';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

interface courses {
  id: number;
  name: string;
  url: string;
  imgSrc: string;
}

interface topcards {
  id: number;
  icon: string;
  color: string;
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
  selector: 'app-content',
  standalone: true,
  imports: [MaterialModule, FormsModule, TablerIconsModule, CommonModule, TranslateModule],
  templateUrl: './content.component.html',
})
export class AppContentComponent {
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  options = this.settings.getOptions();

  constructor(
    private settings: CoreService,
    private scroller: ViewportScroller,
    public dialog: MatDialog,
    private translate: TranslateService
  ) {}

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
      imgSrc: '/assets/images/landingpage/demos/PT-1.svg',
      name: 'landing.courses.crypto',
      url: '#',
    },
    {
      id: 2,
      imgSrc: '/assets/images/landingpage/demos/PT-2.svg',
      name: 'landing.courses.languages',
      url: '#',
    },
    {
      id: 3,
      imgSrc: '/assets/images/landingpage/demos/PT-3.svg',
      name: 'landing.courses.paint',
      url: '#',
    },
    {
      id: 4,
      imgSrc: '/assets/images/landingpage/demos/PT-4.svg',
      name: 'landing.courses.ml',
      url: '#',
    },
    {
      id: 5,
      imgSrc: '/assets/images/landingpage/demos/PT-5.svg',
      name: 'landing.courses.psychology',
      url: '#',
    },
    {
      id: 6,
      imgSrc: '/assets/images/landingpage/demos/PT-6.svg',
      name: 'landing.courses.coaching',
      url: '#',
    },
  ];

  topcards: topcards[] = [
    {
      id: 1,
      color: 'primary',
      icon: 'solar:book-linear',
      subtitle: 'landing.topcards.learn',
    },
    {
      id: 2,
      color: 'primary',
      icon: 'solar:share-linear',
      subtitle: 'landing.topcards.share',
    },
    {
      id: 3,
      color: 'primary',
      icon: 'solar:magic-stick-3-linear',
      subtitle: 'landing.topcards.transform',
    },
  ];

  facts: facts[] = [
    {
      id: 1,
      color: 'primary',
      icon: 'solar:user-hand-up-linear',
      // title: '1,245,341',
      title: '200',
      // subtext: 'Alumnos registrados',
      subtext: 'landing.courses.users',
    },
    {
      id: 2,
      color: 'primary',
      icon: 'mdi:account-tie-outline',
      title: '50',
      subtext: 'landing.courses.instructors',
    },
  ];

  facts2: facts2[] = [
    {
      id: 3,
      color: 'primary',
      icon: 'mdi:account-group-outline',
      title: '20',
      subtext: 'landing.courses.teams',
    },
    {
      id: 4,
      color: 'primary',
      icon: 'solar:card-transfer-linear',
      title: '20',
      subtext: 'landing.courses.usercertificates',
    },
  ];
}
