import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_LINKS } from '../../../shared/constants';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';

@Component({
  standalone: true,
  selector: 'app-forest-carbon-treemap',
  templateUrl: 'forest-carbon-treemap.component.html',
  styleUrls: ['forest-carbon-treemap.component.css'],
  imports: [CommonModule, NgxEchartsModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: { echarts },
    },
  ],
})
export class ForestCarbonTreemapComponent implements AfterViewInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  chartInstance!: echarts.ECharts;
  chartOptions: EChartsOption = {};
  dataLoaded = false;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.fetchData();
  }

  fetchData() {
    const url = API_LINKS['forest-carbon'];

    this.http.get<any[]>(url).subscribe({
      next: (response: any[]) => {
        const data = response
          .map((country) => {
            const indicator = country.indicators.find(
              (ind: any) => ind.name === 'Carbon Stocks In Forests'
            );
            if (!indicator) return null;

            const value2018 = indicator.yearlyData['F2018'];
            const value2008 = indicator.yearlyData['F2008'];
            if (value2018 == null || value2008 == null) return null;

            const rateOfChange =
              ((value2018 - value2008) / value2008) * 100;

            return {
              name: country.country,
              value: value2018,
              rateOfChange: rateOfChange,
            };
          })
          .filter((item) => item !== null)
          .sort((a, b) => b!.value - a!.value)
          .slice(0, 10);

        const maxValue = Math.max(...data.map((d) => d!.value));
        const minValue = Math.min(...data.map((d) => d!.value));

        this.chartOptions = {
          tooltip: {
            formatter: (info: any) => {
              const { name, value, data } = info;
              return `
                <div>
                  <strong>${name}</strong><br/>
                  Carbon Stock: ${value.toFixed(2)} Mt<br/>
                  10-Year Change: ${data.rateOfChange.toFixed(2)}%
                </div>
              `;
            },
          },
          visualMap: {
            type: 'continuous',
            min: minValue,
            max: maxValue,
            inRange: {
              color: ['#a8e6cf', '#006400'],
            },
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: 10,
            text: ['High', 'Low'],
          },
          series: [
            {
              type: 'treemap',
              data: data.map((item) => ({
                name: item!.name,
                value: item!.value,
                rateOfChange: item!.rateOfChange,
              })),
              label: {
                show: true,
                formatter: '{b}',
              },
              upperLabel: {
                show: true,
                height: 30,
              },
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 1,
              },
            },
          ],
        };

        this.initChart();
      },
      error: (err) => {
        console.error('Failed to fetch forest carbon data', err);
      },
    });
  }

  initChart() {
    const container = this.chartContainer.nativeElement;
    this.chartInstance = echarts.init(container);
    this.chartInstance.setOption(this.chartOptions);
    window.addEventListener('resize', () => {
      this.chartInstance.resize();
    });
  }
}
