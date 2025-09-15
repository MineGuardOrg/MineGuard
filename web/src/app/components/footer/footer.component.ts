import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    MaterialModule,
    RouterLink,
    FormsModule,
    TablerIconsModule,
    CommonModule,
    TranslateModule // 👈 
  ],
  templateUrl: './footer.component.html',
})
export class AppFooterComponent {
  constructor(public translate: TranslateService) {}
}
