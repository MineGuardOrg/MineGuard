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
  ApexYAxis,
  ApexXAxis,
} from 'ng-apexcharts';

export interface biometricAvgChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  fill: ApexFill;
  yaxis: ApexYAxis | ApexYAxis[];
  xaxis: ApexXAxis;
}

@Component({
  selector: 'app-biometric-avg',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, NgApexchartsModule, TranslateModule],
  templateUrl: './biometric-avg.component.html',
})
export class AppBiometricAvgComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public biometricAvgChart!: Partial<biometricAvgChart> | any;

  constructor(
    private dashboardService: DashboardService,
    private translate: TranslateService
  ) {
    this.initializeChart();
  }

  ngOnInit(): void {
    this.loadBiometricsByArea();
    
    // Suscribirse a cambios de idioma
    this.translate.onLangChange.subscribe(() => {
      this.updateChartTranslations();
    });
  }

  /**
   * Inicializa la configuración de la gráfica
   */
  initializeChart(): void {
    this.biometricAvgChart = {
      series: [
        {
          name: this.translate.instant('CHARTS.BIOMETRIC_AVG.HEART_RATE'),
          data: [],
        },
        {
          name: this.translate.instant('CHARTS.BIOMETRIC_AVG.BODY_TEMPERATURE'),
          data: [],
        },
      ],

      chart: {
        type: 'bar',
        fontFamily: 'inherit',
        foreColor: '#adb0bb',
        height: 350,
        width: 800,
        stacked: false,
        offsetX: 0,
        offsetY: 0,
        toolbar: {
          show: false,
        },
      },
      colors: [
        'rgba(220, 53, 69, 1)', // Rojo más serio para gases tóxicos
        'rgba(255, 159, 64, 1)', // Naranja profesional para ritmo cardíaco
        'rgba(54, 162, 235, 1)', // Azul para temperatura corporal
        'rgba(153, 102, 255, 1)', // Púrpura para caídas/impactos
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          barHeight: '60%',
          columnWidth: '50%',
          borderRadius: [0],
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'all',
          distributed: false,
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

      yaxis: [
        {
          seriesName: this.translate.instant('CHARTS.BIOMETRIC_AVG.HEART_RATE'),
          min: 0,
          max: 120,
          tickAmount: 6,
          title: {
            text: this.translate.instant('CHARTS.BIOMETRIC_AVG.HEART_RATE_AXIS'),
            style: {
            color: '#adb0bb',
              fontSize: '12px',
              fontWeight: 500,
            },
          },
          labels: {
            style: {
            color: '#adb0bb',
              fontSize: '11px',
            },
            formatter: function (value: number) {
              return Math.round(value) + ' bpm';
            },
          },
        },
        {
          seriesName: this.translate.instant('CHARTS.BIOMETRIC_AVG.BODY_TEMPERATURE'),
          opposite: true,
          min: 0,
          max: 45,
          tickAmount: 6,
          title: {
            text: this.translate.instant('CHARTS.BIOMETRIC_AVG.TEMPERATURE_AXIS'),
            style: {
            color: '#adb0bb',
              fontSize: '12px',
              fontWeight: 500,
            },
          },
          labels: {
            style: {
            color: '#adb0bb',
              fontSize: '11px',
            },
            formatter: function (value: number) {
              return value.toFixed(1) + '°C';
            },
          },
        },
      ],
      xaxis: {
        type: 'category',
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        categories: [],
        labels: {
          rotate: 0,
          style: { fontSize: '13px', colors: '#adb0bb', fontWeight: '400' },
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
   * Carga los datos de biométricos por área
   */
  loadBiometricsByArea(): void {
    this.dashboardService.getBiometricsByArea(30).subscribe({
      next: (data) => {
        // Actualizar toda la configuración de la gráfica con los nuevos datos
        this.biometricAvgChart = {
          ...this.biometricAvgChart,
          series: [
            {
              name: this.translate.instant('CHARTS.BIOMETRIC_AVG.HEART_RATE'),
              data: data.ritmoCardiaco,
            },
            {
              name: this.translate.instant('CHARTS.BIOMETRIC_AVG.BODY_TEMPERATURE'),
              data: data.temperaturaCorporal,
            },
          ],
          xaxis: {
            ...this.biometricAvgChart.xaxis,
            categories: data.areas,
          },
        };
      },
      error: (error) => {
        console.error('Error loading biometrics by area:', error);
      },
    });
  }

  /**
   * Actualiza las traducciones de la gráfica cuando cambia el idioma
   */
  updateChartTranslations(): void {
    this.biometricAvgChart.yaxis[0].title.text = this.translate.instant('CHARTS.BIOMETRIC_AVG.HEART_RATE_AXIS');
    this.biometricAvgChart.yaxis[1].title.text = this.translate.instant('CHARTS.BIOMETRIC_AVG.TEMPERATURE_AXIS');
    this.loadBiometricsByArea();
  }
}
