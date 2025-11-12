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
  imports: [MaterialModule, TablerIconsModule, NgApexchartsModule],
  templateUrl: './alerts-by-type.component.html',
})

export class AppAlertsByTypeComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public alertsByTypeChart!: Partial<alertsByTypeChart> | any;

  constructor() {
    this.alertsByTypeChart = {
      series: [
        {
          name: 'Gases tóxicos',
          data: [8, 12, 6, 10],
        },
        {
          name: 'Ritmo cardíaco anormal',
          data: [6, 8, 14, 7],
        },
        {
          name: 'Temperatura corporal alta',
          data: [4, 9, 7, 11],
        },
        {
          name: 'Caídas/Impactos',
          data: [9, 5, 8, 6],
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
          text: 'Número de alertas',
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
        categories: [
          'Semana 1',
          'Semana 2',
          'Semana 3',
          'Semana 4',
        ],
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
