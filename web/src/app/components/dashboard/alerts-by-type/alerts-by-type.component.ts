import { Component, ViewChild, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { DashboardService } from '../../../services/dashboard.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexPlotOptions,
  NgApexchartsModule,
  ApexFill,
} from 'ng-apexcharts';

export interface alertsByTypeChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  fill: ApexFill;
}

@Component({
  selector: 'app-alerts-by-type',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, NgApexchartsModule, TranslateModule],
  templateUrl: './alerts-by-type.component.html',
})

export class AppAlertsByTypeComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public alertsByTypeChart!: Partial<alertsByTypeChart> | any;

  constructor(
    private dashboardService: DashboardService,
    private translate: TranslateService
  ) {
    this.initializeChart();
  }

  ngOnInit(): void {
    this.loadAlertsByTypeWeekly();
    
    // Suscribirse a cambios de idioma
    this.translate.onLangChange.subscribe(() => {
      this.updateChartTranslations();
    });
  }

  /**
   * Inicializa la configuración de la gráfica
   */
  initializeChart(): void {
    this.alertsByTypeChart = {
      series: [
        {
          name: this.translate.instant('CHARTS.ALERTS_BY_TYPE.TOXIC_GASES'),
          data: [],
        },
        {
          name: this.translate.instant('CHARTS.ALERTS_BY_TYPE.ABNORMAL_HEART_RATE'),
          data: [],
        },
        {
          name: this.translate.instant('CHARTS.ALERTS_BY_TYPE.HIGH_BODY_TEMPERATURE'),
          data: [],
        },
        {
          name: this.translate.instant('CHARTS.ALERTS_BY_TYPE.FALLS_IMPACTS'),
          data: [],
        },
      ],

      chart: {
        type: 'bar',
        fontFamily: 'inherit',
        foreColor: '#adb0bb',
        height: 350,
        width: 800,
        stacked: true,
        offsetX: 0,
        offsetY: 0,
        toolbar: {
          show: false,
        },
      },
      colors: [
        'rgba(220, 53, 69, 1)',    // Rojo más serio para gases tóxicos
        'rgba(255, 159, 64, 1)',   // Naranja profesional para ritmo cardíaco
        'rgba(54, 162, 235, 1)',   // Azul para temperatura corporal
        'rgba(153, 102, 255, 1)'   // Púrpura para caídas/impactos
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          barHeight: '60%',
          columnWidth: '25%',
          borderRadius: 0,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        fontSize: '13px',
        fontFamily: 'inherit',
        fontWeight: 400,
        labels: {
          colors: '#adb0bb',
        },
        markers: {
          width: 12,
          height: 12,
          radius: 2,
        },
        itemMargin: {
          horizontal: 15,
          vertical: 5,
        },
      },
      grid: {
        show: true,
        padding: {
          top: 0,
          bottom: 0,
          right: 20,
          left: 10,
        },
        borderColor: 'rgba(0,0,0,0.05)',
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },

      yaxis: {
        min: 0,
        max: 35,
        tickAmount: 7,
        title: {
          text: this.translate.instant('CHARTS.ALERTS_BY_TYPE.ALERTS_COUNT'),
          style: {
            color: '#adb0bb',
            fontSize: '12px',
            fontWeight: 400,
          },
        },
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        categories: [],
        labels: {
          show: true,
          rotate: 0,
          style: { 
            fontSize: '13px', 
            colors: '#adb0bb', 
            fontWeight: '400' 
          },
        },
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
      },
    };
  }

  /**
   * Carga los datos de alertas por tipo agrupadas por semana
   */
  loadAlertsByTypeWeekly(): void {
    this.dashboardService.getAlertsByTypeWeekly().subscribe({
      next: (data) => {
        // Actualizar los datos de las series
        this.alertsByTypeChart.series = [
          {
            name: this.translate.instant('CHARTS.ALERTS_BY_TYPE.TOXIC_GASES'),
            data: data.gasesToxicos,
          },
          {
            name: this.translate.instant('CHARTS.ALERTS_BY_TYPE.ABNORMAL_HEART_RATE'),
            data: data.ritmoCardiacoAnormal,
          },
          {
            name: this.translate.instant('CHARTS.ALERTS_BY_TYPE.HIGH_BODY_TEMPERATURE'),
            data: data.temperaturaCorporalAlta,
          },
          {
            name: this.translate.instant('CHARTS.ALERTS_BY_TYPE.FALLS_IMPACTS'),
            data: data.caidasImpactos,
          },
        ];
        
        // Formatear las categorías para mostrar "Semana #"
        const weekLabel = this.translate.instant('CHARTS.ALERTS_BY_TYPE.WEEK');
        const formattedLabels = data.labels.map((label, index) => `${weekLabel} ${index + 1}`);
        this.alertsByTypeChart.xaxis.categories = formattedLabels;
      },
      error: (error) => {
        console.error('Error loading alerts by type weekly:', error);
      },
    });
  }

  /**
   * Actualiza las traducciones de la gráfica cuando cambia el idioma
   */
  updateChartTranslations(): void {
    this.alertsByTypeChart.yaxis.title.text = this.translate.instant('CHARTS.ALERTS_BY_TYPE.ALERTS_COUNT');
    this.loadAlertsByTypeWeekly();
  }
}
