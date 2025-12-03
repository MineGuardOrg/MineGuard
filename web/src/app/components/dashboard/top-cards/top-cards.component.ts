import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { DashboardService } from '../../../services/dashboard.service';
import { CommonModule } from '@angular/common';

interface topcards {
  id: number;
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  minititle: string;
}

@Component({
  selector: 'app-top-cards',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, CommonModule],
  templateUrl: './top-cards.component.html',
})
export class AppTopCardsComponent implements OnInit {
  topcards: topcards[] = [
    {
      id: 1,
      color: 'primary',
      icon: 'solar:users-group-rounded-line-duotone',
      title: 'Trabajadores activos',
      subtitle: 'Cargando...',
      minititle: 'Cargando datos...',
    },
    {
      id: 2,
      color: 'warning',
      icon: 'solar:danger-triangle-outline',
      title: 'Alertas criticas',
      subtitle: 'Cargando...',
      minititle: 'Cargando datos...',
    },
    {
      id: 3,
      color: 'accent',
      icon: 'solar:home-wifi-outline',
      title: 'Cascos conectados',
      subtitle: 'Cargando...',
      minititle: 'Cargando datos...',
    },
    {
      id: 4,
      color: 'error',
      icon: 'solar:shield-warning-outline',
      title: 'Nivel de riesgo',
      subtitle: 'Cargando...',
      minititle: 'Cargando datos...',
    },
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadActiveWorkers();
    this.loadCriticalAlerts();
    this.loadDeviceStats();
    this.loadRiskLevel();
  }

  /**
   * Carga los trabajadores activos desde el backend
   */
  loadActiveWorkers(): void {
    this.dashboardService.getActiveWorkers().subscribe({
      next: (workers) => {
        const activeCount = workers.length;
        // Actualizar el primer card con los datos reales
        this.topcards[0].subtitle = activeCount.toString();
        this.topcards[0].minititle = `${activeCount} trabajadores en línea`;
      },
      error: (error) => {
        console.error('Error loading active workers:', error);
        this.topcards[0].subtitle = 'Error';
        this.topcards[0].minititle = 'No se pudieron cargar los datos';
      },
    });
  }

  /**
   * Carga las estadísticas de alertas críticas
   */
  loadCriticalAlerts(): void {
    this.dashboardService.getCriticalAlertsStats().subscribe({
      next: (stats) => {
        this.topcards[1].subtitle = stats.critical_count.toString();
        this.topcards[1].minititle = `${stats.total_last_24h} alertas en las últimas 24h`;
      },
      error: (error) => {
        console.error('Error loading critical alerts:', error);
        this.topcards[1].subtitle = 'Error';
        this.topcards[1].minititle = 'No se pudieron cargar los datos';
      },
    });
  }

  /**
   * Carga las estadísticas de dispositivos
   */
  loadDeviceStats(): void {
    this.dashboardService.getDeviceStats().subscribe({
      next: (stats) => {
        this.topcards[2].subtitle = `${stats.active_devices}/${stats.total_devices}`;
        this.topcards[2].minititle = `${stats.connection_rate}% tasa de conexión`;
      },
      error: (error) => {
        console.error('Error loading device stats:', error);
        this.topcards[2].subtitle = 'Error';
        this.topcards[2].minititle = 'No se pudieron cargar los datos';
      },
    });
  }

  /**
   * Carga el nivel de riesgo
   */
  loadRiskLevel(): void {
    this.dashboardService.getRiskLevel().subscribe({
      next: (risk) => {
        // Mapear nivel de riesgo a español
        const riskLevelMap: { [key: string]: string } = {
          low: 'Bajo',
          medium: 'Medio',
          high: 'Alto',
          critical: 'Crítico',
        };
        this.topcards[3].subtitle = riskLevelMap[risk.risk_level] || risk.risk_level;
        this.topcards[3].minititle = risk.recommendation;
      },
      error: (error) => {
        console.error('Error loading risk level:', error);
        this.topcards[3].subtitle = 'Error';
        this.topcards[3].minititle = 'No se pudieron cargar los datos';
      },
    });
  }
}
