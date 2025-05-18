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
          'Fossil Fuels': '#d73027',
          'Solar Energy': '#fdae61',
          'Wind Energy': '#91bfdb',
          'Hydropower (excl. Pumped Storage)': '#4575b4',
          Bioenergy: '#1a9850',
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
          color: ENERGY_TYPES.map((type) => colorMap[type]),
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
                'Hydropower (excl. Pumped Storage)': 'Hydro',
                Bioenergy: 'Bio',
              };
              return abbreviations[name] || name;
            },
          },
          grid: {
            top: '20%',
            bottom: '5%',
            right: '25%',
            containLabel: true,
            show: true,
            borderColor: '#ccc',
            borderWidth: 1,
            shadowColor: 'rgba(158, 157, 157, 0.1)',
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
          },
          toolbox: {
            feature: { saveAsImage: { show: true } },
            iconStyle: {
              borderColor: '#fff',
              borderWidth: 1,
              borderType: 'solid',
              shadowColor: '#000',
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
            },
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
