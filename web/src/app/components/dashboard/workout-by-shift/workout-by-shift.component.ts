import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexXAxis,
  ApexTooltip,
  ApexTheme,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from '../../../material.module';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: any;
  theme: ApexTheme;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  markers: any;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  labels: string[];
};

@Component({
  selector: 'app-workout-by-shift',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule, TranslateModule],
  templateUrl: './workout-by-shift.component.html',
})
export class AppWorkoutByShiftComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public areaChartOptions: Partial<ChartOptions> | any;
  
  constructor(private translate: TranslateService) {
    this.initializeChart();
  }

  ngOnInit(): void {
    // Suscribirse a cambios de idioma
    this.translate.onLangChange.subscribe(() => {
      this.updateChartTranslations();
    });
  }

  initializeChart(): void {
    this.areaChartOptions = {
      series: [
        {
          name: this.translate.instant('CHARTS.WORKOUT_BY_SHIFT.MORNING_SHIFT'),
          data: [20, 45, 65, 85, 95, 90, 75, 60, 40, 25, 15, 10],
        },
        {
          name: this.translate.instant('CHARTS.WORKOUT_BY_SHIFT.AFTERNOON_SHIFT'),
          data: [15, 25, 40, 70, 85, 90, 95, 80, 65, 45, 30, 20],
        },
        {
          name: this.translate.instant('CHARTS.WORKOUT_BY_SHIFT.NIGHT_SHIFT'),
          data: [35, 50, 45, 40, 35, 30, 25, 20, 25, 30, 40, 45],
        },
      ],
      chart: {
        fontFamily: 'inherit',
        foreColor: '#a1aab2',
        height: 350,
        width: 800,
        type: 'area',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 3,
      },
      stroke: {
        curve: 'smooth',
        width: '2',
      },
      colors: ['#635bff', '#16cdc7', '#ff9f43'],
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        fontSize: '13px',
        fontFamily: 'inherit',
        fontWeight: 400,
        labels: {
          colors: '#a1aab2',
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
        strokeDashArray: 0,
        borderColor: 'rgba(0,0,0,0.1)',
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
      xaxis: {
        type: 'category',
        categories: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
      },
      tooltip: {
        theme: 'dark',
      },
    };
  }

  /**
   * Actualiza las traducciones de la gráfica cuando cambia el idioma
   */
  updateChartTranslations(): void {
    this.areaChartOptions.series = [
      {
        name: this.translate.instant('CHARTS.WORKOUT_BY_SHIFT.MORNING_SHIFT'),
        data: this.areaChartOptions.series[0].data,
      },
      {
        name: this.translate.instant('CHARTS.WORKOUT_BY_SHIFT.AFTERNOON_SHIFT'),
        data: this.areaChartOptions.series[1].data,
      },
      {
        name: this.translate.instant('CHARTS.WORKOUT_BY_SHIFT.NIGHT_SHIFT'),
        data: this.areaChartOptions.series[2].data,
      },
    ];
  }
}
