import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_LINKS, ENERGY_TYPES } from '../../../../shared/constants';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import * as echarts from 'echarts';
import { ECharts, EChartsOption, SeriesOption } from 'echarts';

@Component({
  standalone: true,
  selector: 'app-renewable-multiline-chart',
  templateUrl: './renewable-multiline-chart.component.html',
  styleUrls: ['./renewable-multiline-chart.component.css'],
  imports: [CommonModule, NgxEchartsModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: { echarts },
    },
  ],
})
export class RenewableMultilineChartComponent
  implements OnChanges, AfterViewInit
{
  @Input() selectedCountryCode: string = '';
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  chartOptions: EChartsOption = {};
  chartInstance!: ECharts;
  loading = true;
  initialized = false;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.initialized = true;
    if (this.selectedCountryCode) {
      this.fetchData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['selectedCountryCode'] &&
      this.selectedCountryCode &&
      this.initialized
    ) {
      this.fetchData();
    }
  }

  fetchData() {
    const url = API_LINKS['renewable-energy'];
    this.loading = true;

    this.http.get<any[]>(url).subscribe({
      next: (response: any[]) => {
        const countryData = response.find(
          (c: any) => c.isO2 === this.selectedCountryCode
        );

        if (!countryData) {
          this.chartOptions = {};
          this.loading = false;
          return;
        }

        const colorMap: { [key: string]: string } = {
          'Fossil Fuels': '#d73027', // red
          'Solar Energy': '#fdae61', // orange
          'Wind Energy': '#91bfdb', // light blue
          'Hydropower (excl. Pumped Storage)': '#4575b4', // dark blue
          Bioenergy: '#1a9850', // green
        };

        const series: SeriesOption[] = ENERGY_TYPES.map(
          (type: string): SeriesOption => {
            const tech = countryData.technologies.find(
              (t: any) => t.name === type
            );
            const sortedYears = tech ? Object.keys(tech.yearlyData).sort() : [];
            const data = tech
              ? sortedYears.map((year) => tech.yearlyData[year])
              : [];

            return {
              name: type,
              type: 'line',
              stack: 'Total',
              data: data as number[],
              smooth: true,
              lineStyle: { color: colorMap[type] },
              itemStyle: { color: colorMap[type] },
            };
          }
        );

        const years = Object.keys(countryData.technologies[0]?.yearlyData || {})
          .sort()
          .map((y) => y.replace('F', ''));

        this.chartOptions = {
          title: { text: '' },
          tooltip: { trigger: 'axis' },
          color: ENERGY_TYPES.map((type) => colorMap[type]), // set global color palette
          legend: {
            data: ENERGY_TYPES,
            textStyle: {
              overflow: 'truncate',
              width: 100,
            },
            tooltip: {
              show: true,
            },
            formatter: (name: string) => {
              const abbreviations: { [key: string]: string } = {
                'Fossil Fuels': 'Fossil',
                'Solar Energy': 'Solar',
                'Wind Energy': 'Wind',
                'Hydropower (excl. Pumped Storage)': 'Hydro (no Pump)',
                Bioenergy: 'Bio',
              };
              return abbreviations[name] || name;
            },
          },
          grid: {
              top: '15%',
  bottom: '5%',
  left: '5%',
  right: '5%',
            containLabel: true,
            show: true,
            borderColor: '#ccc',
            borderWidth: 1,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
          },
          toolbox: {
            feature: { saveAsImage: {} },
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: years,
          },
          yAxis: {
            type: 'value',
            name: 'GWh',
          },
          series,
        };

        setTimeout(() => {
          this.initOrUpdateChart();
          this.loading = false;
        });
      },
      error: (err) => {
        console.error('Failed to fetch renewable energy data', err);
        this.loading = false;
      },
    });
  }

  initOrUpdateChart() {
    const container = this.chartContainer.nativeElement;

    if (!this.chartInstance) {
      this.chartInstance = echarts.init(container);
    } else {
      this.chartInstance.clear();
    }

    this.chartInstance.setOption(this.chartOptions);

    setTimeout(() => {
      this.chartInstance.resize();
    }, 0);
  }
}
