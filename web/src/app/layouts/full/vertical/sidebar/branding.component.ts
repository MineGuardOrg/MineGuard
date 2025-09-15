import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <div class="branding">
      <a [routerLink]="['/']">
        <img
          [src]="
            options.sidenavCollapsed
              ? './assets/images/logos/TeachU_SVG/4-cropped.svg'
              : './assets/images/logos/TeachU_SVG/3-cropped.svg'
          "
          [ngStyle]="{
            width: options.sidenavCollapsed ? '40px' : '120px'
          }"
          class="align-middle m-2"
          alt="logo"
        />
      </a>
    </div>
  `,
})
export class BrandingComponent {
  constructor(private settings: CoreService) {}

  get options() {
    return this.settings.getOptions();
  }
}
