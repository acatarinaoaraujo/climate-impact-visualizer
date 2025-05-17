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
import { API_LINKS } from '../../../shared/constants';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import * as echarts from 'echarts';
import { ECharts, EChartsOption } from 'echarts';

@Component({
  standalone: true,
  selector: 'app-emissions-sankey',
  templateUrl: './emissions-sankey.component.html',
  styleUrls: ['./emissions-sankey.component.css'],
  imports: [CommonModule, NgxEchartsModule],
  providers: [
    {
      provide: NGX_ECHARTS_CONFIG,
      useValue: { echarts },
    },
  ],
})
export class EmissionsSankeyComponent implements OnChanges, AfterViewInit {
  @Input() selectedCountryCode: string = '';
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  chartOptions: EChartsOption = {};
  chartInstance!: ECharts;
  loading = true;
  initialized = false;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.initialized = true;
      if (this.selectedCountryCode) {
        this.fetchData();
      }
    }, 0);
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
    const url = API_LINKS['greenhouse-emissions'];
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

        const indicators = countryData.indicators.reduce((acc: any, curr: any) => {
          acc[curr.name] = Object.values(curr.yearlyData || {}).reduce(
            (sum: number, val: any) => sum + (parseFloat(val) || 0),
            0
          );
          return acc;
        }, {});

        const nodes = [
          { name: 'Production' },
          { name: 'Gross Exports' },
          { name: 'Gross Imports' },
          { name: 'Final Domestic Demand' },
        ];

        const links = [
          {
            source: 'Production',
            target: 'Gross Exports',
            value: indicators['Gross Exports'] || 0,
          },
          {
            source: 'Production',
            target: 'Final Domestic Demand',
            value:
              (indicators['Production'] || 0) -
              (indicators['Gross Exports'] || 0),
          },
          {
            source: 'Gross Imports',
            target: 'Final Domestic Demand',
            value: indicators['Gross Imports'] || 0,
          },
        ];

        this.chartOptions = {
          tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
          },
          series: [
            {
              type: 'sankey',
              data: nodes,
              links: links,
              emphasis: { focus: 'adjacency' },
              lineStyle: {
                color: 'gradient',
                curveness: 0.5,
              },
            },
          ],
        };

        this.loading = false;
        this.initOrUpdateChart();
      },
      error: (err) => {
        console.error('Failed to fetch emissions data', err);
        this.loading = false;
      },
    });
  }

  initOrUpdateChart() {
    const container = this.chartContainer.nativeElement;

    if (container.clientWidth === 0 || container.clientHeight === 0) {
      setTimeout(() => this.initOrUpdateChart(), 100);
      return;
    }

    if (!this.chartInstance) {
      this.chartInstance = echarts.init(container);
    } else {
      this.chartInstance.clear();
    }

    this.chartInstance.setOption(this.chartOptions);
    setTimeout(() => {
      this.chartInstance.resize();
    });
  }
}
