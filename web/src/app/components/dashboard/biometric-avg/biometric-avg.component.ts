import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
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
  imports: [MaterialModule, TablerIconsModule, NgApexchartsModule],
  templateUrl: './biometric-avg.component.html',
})
export class AppBiometricAvgComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public biometricAvgChart!: Partial<biometricAvgChart> | any;

  constructor() {
    this.biometricAvgChart = {
      series: [
        {
          name: 'Ritmo cardíaco (bpm)',
          data: [80, 72, 65, 100],
        },
        {
          name: 'Temperatura corporal (°C)',
          data: [36.5, 37.2, 36.8, 37.1],
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
          borderRadius: [6],
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
          seriesName: 'Ritmo cardíaco (bpm)',
          min: 0,
          max: 120,
          tickAmount: 6,
          title: {
            text: 'Ritmo Cardíaco (BPM)',
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
          seriesName: 'Temperatura corporal (°C)',
          opposite: true,
          min: 0,
          max: 45,
          tickAmount: 6,
          title: {
            text: 'Temperatura Corporal (°C)',
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
        categories: ['Tunel 1', 'Tunel 2', 'Tunel 3', 'Tunel 4'],
        labels: {
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
}
