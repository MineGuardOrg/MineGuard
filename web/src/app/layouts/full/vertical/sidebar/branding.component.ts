import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <div class="branding p-x-0">
      <a class="header-brand-link d-flex align-items-center text-decoration-none" 
         [routerLink]="['/landingpage']"
         [class.collapsed]="options.sidenavCollapsed">
        
        <!-- Contenedor del casco con efectos -->
        <div class="helmet-header-container">
          <svg viewBox="0 0 500 500" class="helmet-header-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <!-- Gradiente mejorado -->
              <linearGradient id="helmetGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#FFD54F;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#FDB71A;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#E69F00;stop-opacity:1" />
              </linearGradient>

              <!-- Filtro de brillo -->
              <filter id="glowHeader">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <!-- Gradiente para las líneas -->
              <linearGradient id="linesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#FFD54F;stop-opacity:0.9" />
                <stop offset="100%" style="stop-color:#FDB71A;stop-opacity:0.7" />
              </linearGradient>
            </defs>

            <style type="text/css">
              .st6-header{
                fill:none;
                stroke:url(#helmetGradient);
                stroke-width:35;
                stroke-linecap:round;
                stroke-linejoin:round;
                filter:url(#glowHeader);
              }
              .st7-header{
                fill:none;
                stroke:url(#linesGradient);
                stroke-width:25;
                opacity:0.9;
                stroke-linecap:round;
              }
              .st8-header{
                fill:none;
                stroke:#E69F00;
                stroke-width:25;
                opacity:0.7;
                stroke-linecap:round;
              }
            </style>

            <g id="helmet-header">
              <path class="st6-header helmet-main" d="M65.76,338.47v-74.52c0,0,5.4-69.9,58.27-105.24l5.78-19.27c0,0,8.81-8.35,26.18-14.46l10.03,4.82l11.85-4.82 l6.42-13.81c0,0,17.03-7.71,38.87-7.71l5.46,7.71c0,0,20.88-2.25,40.8-0.64l6.75-7.07c0,0,17.67,0,36.94,7.71 c0,0,3.21,8.35,4.5,11.24l17.35,8.03l8.03-4.82c0,0,15.74,5.78,25.7,16.38l8.35,16.7c0,0,47.54,29.55,53.97,106.65l3.21,73.24l0,0 c9.7,0,17.56,7.86,17.56,17.56v33.95c0,3.85-3.36,6.84-7.18,6.39C407.7,392.11,234.2,374,55.45,396.45 c-3.84,0.48-7.23-2.51-7.23-6.38v-34.13C48.19,346.27,56.07,338.43,65.76,338.47L65.76,338.47z"></path>

              <g class="helmet-lines-header">
                <path class="st7-header line-1" d="M317.6,122.41l7.34,3.4c0,0,10.71,84.94-3.67,210.86C321.27,336.67,329.16,242.23,317.6,122.41z"></path>
                <path class="st8-header line-2" d="M177.87,124.98l-7.12,2.89c0,0,1.03,104.29,15.97,208.8C186.71,336.67,174.76,216.53,177.87,124.98z"></path>
                <path class="st7-header line-3" d="M377.03,158.71l5.59,4.17c0,0,6.51,87.11-11.05,173.79C371.57,336.67,383.77,247.59,377.03,158.71z"></path>
                <path class="st8-header line-4" d="M123.97,158.71l-5.59,4.17c0,0-6.51,87.11,11.05,173.79C129.43,336.67,117.22,247.59,123.97,158.71z"></path>
              </g>
            </g>
          </svg>

          <!-- Anillo de resplandor -->
          <div class="helmet-glow-ring"></div>
        </div>

        <!-- Nombre de la marca -->
        <span class="brand-name-header" *ngIf="!options.sidenavCollapsed">MineGuard</span>
      </a>
    </div>
  `,
  styles: [`
    .branding {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .header-brand-link {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 1rem;
      text-decoration: none;
      transition: transform 0.3s ease;
    }

    .header-brand-link.collapsed {
      justify-content: center;
      width: 100%;
    }

    .header-brand-link:hover {
      transform: translateY(-2px);
    }

    .helmet-header-container {
      position: relative;
      width: 50px;
      height: 50px;
      margin-left: 10px;
      transition: all 0.3s ease;
    }

    .header-brand-link.collapsed .helmet-header-container {
      width: 50px;
      height: 50px;
    }

    .helmet-header-svg {
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 2;
    }

    .helmet-main {
      animation: helmetPulse 2s ease-in-out infinite;
    }

    .helmet-lines-header .line-1,
    .helmet-lines-header .line-2,
    .helmet-lines-header .line-3,
    .helmet-lines-header .line-4 {
      animation: lineGlow 3s ease-in-out infinite;
    }

    .helmet-lines-header .line-2 { animation-delay: 0.3s; }
    .helmet-lines-header .line-3 { animation-delay: 0.6s; }
    .helmet-lines-header .line-4 { animation-delay: 0.9s; }

    @keyframes helmetPulse {
      0%, 100% {
        opacity: 1;
        filter: drop-shadow(0 0 5px rgba(255, 213, 79, 0.5));
      }
      50% {
        opacity: 0.9;
        filter: drop-shadow(0 0 10px rgba(255, 213, 79, 0.8));
      }
    }

    @keyframes lineGlow {
      0%, 100% {
        opacity: 0.7;
      }
      50% {
        opacity: 1;
      }
    }

    .helmet-glow-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 213, 79, 0.2), transparent 70%);
      animation: ringPulse 2s ease-in-out infinite;
      z-index: 0;
    }

    @keyframes ringPulse {
      0%, 100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.3;
      }
      50% {
        transform: translate(-50%, -50%) scale(1.2);
        opacity: 0.6;
      }
    }

.brand-name-header {
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: 1px;
  white-space: nowrap;
  color: #FFC107; /* Amarillo sólido, limpio y visible */

  /* Borde suave para contraste */
  text-shadow:
      1px 1px 2px rgba(0,0,0,0.35),
      0 0 4px rgba(0,0,0,0.25);

  transition: all 0.3s ease;
}

/* HOVER */
.header-brand-link:hover .brand-name-header {
  letter-spacing: 2px;
  text-shadow:
      2px 2px 3px rgba(0,0,0,0.4),
      0 0 6px rgba(255,193,7,0.6);
}


  `]
})
export class BrandingComponent {
  constructor(private settings: CoreService) {}

  get options() {
    return this.settings.getOptions();
  }
}
