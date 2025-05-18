import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { API_LINKS } from '../../../../shared/constants';
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
        const children = response
          .map((country) => {
            if (country.country === 'Euro Area') return null;

            const indicator = country.indicators.find(
              (ind: any) => ind.name === 'Carbon Stocks In Forests'
            );
            if (!indicator) return null;

            const value2018 = indicator.yearlyData['F2018'];
            const value2008 = indicator.yearlyData['F2008'];
            if (value2018 == null || value2008 == null) return null;

            const rateOfChange = ((value2018 - value2008) / value2008) * 100;

            return {
              name: country.country,
              value: parseFloat(value2018.toFixed(2)),
              rateOfChange: parseFloat(rateOfChange.toFixed(2)),
              density: value2018,
            };
          })
          .filter((item) => item !== null)
          .sort((a, b) => b!.value - a!.value)
          .slice(0, 10);

        const max = Math.max(...children.map((d) => d!.value));
        const min = Math.min(...children.map((d) => d!.value));

        const treeData = children.map((item) => ({
          name: item!.name,
          value: item!.value,
          rateOfChange: item!.rateOfChange,
          density: item!.density,
          label: {
            show: true,
            formatter: `{b}\n${item!.value} Mt`,
          },
        }));

        this.chartOptions = {
          tooltip: {
            formatter: (info: any) => {
              const { name, value, data } = info;
              if (data && data.rateOfChange !== undefined) {
                return `
                  <div style="padding: 5px">
                    <strong>${name}</strong><br/>
                    Carbon Stock: ${value.toFixed(2)} Mt<br/>
                    10-Year Change: ${data.rateOfChange.toFixed(2)}%
                  </div>
                `;
              }
              return `<strong>${name}</strong>`;
            },
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
          visualMap: {
            type: 'continuous',
            min,
            max,
            inRange: {
              color: ['#abc9a3', '#66ad78', '#43a2ca', '#006d2c'],
            },
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: -8,

            text: ['High', 'Low'],
          },
          series: [
            {
              type: 'treemap',
              name: 'Forest Carbon Stock',
              roam: false,
              breadcrumb: {
                show: true,
                top: 0,
              },
              label: {
                show: true,
                formatter: '{b}',
              },
              upperLabel: {
                show: true,
                height: 30,
                color: '#fff',
                fontWeight: 'bold',
              },
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 1,
                gapWidth: 1,
              },
              levels: [
                {
                  itemStyle: {
                    borderColor: '#777',
                    borderWidth: 0,
                    gapWidth: 1,
                  },
                  upperLabel: {
                    show: false,
                  },
                },
                {
                  colorSaturation: [0.35, 0.6],
                  itemStyle: {
                    gapWidth: 1,
                    borderColorSaturation: 0.7,
                  },
                },
              ],
              data: treeData,
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
