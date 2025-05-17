import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import * as echarts from 'echarts';
import { HttpClient } from '@angular/common/http';
import { INCOME_TYPES, API_LINKS } from '../../../shared/constants';

@Component({
  selector: 'app-income-loss-radar',
  templateUrl: './income-loss-radar.component.html',
  styleUrls: ['./income-loss-radar.component.css']
})
export class IncomeLossRadarComponent implements OnChanges, AfterViewInit {
  @Input() selectedCountryCode!: string;
  @ViewChild('radarChart', { static: true }) radarChartRef!: ElementRef;
  private chart!: echarts.ECharts;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.chart = echarts.init(this.radarChartRef.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCountryCode'] && this.selectedCountryCode) {
      this.fetchAndRenderChart(this.selectedCountryCode);
    }
  }

  fetchAndRenderChart(countryCode: string): void {
    this.http.get<any[]>(API_LINKS['income-loss']).subscribe(data => {
      const countryData = data.find(d => d.isO2 === countryCode);
      if (!countryData) {
        this.chart.clear();
        return;
      }

      // Filter out "Total GDP Risk"
      const filteredIncomeTypes = INCOME_TYPES.filter(name => name !== 'Total GDP Risk');

      const indicators = filteredIncomeTypes.map(name => ({ text: name }));

      const series = filteredIncomeTypes.map(type => {
        const yearData = countryData.variables.find((v: any) => v.name === type)?.yearlyData || {};
        const value = yearData['F2024'] ?? 0;
        return {
          value: indicators.map(ind => ind.text === type ? value : 0),
          name: type,
          areaStyle: {
            opacity: 0.1
          },
          lineStyle: {
            width: 2
          }
        };
      });

      const option: echarts.EChartsOption = {
        title: {
          text: 'Income Loss & Economic Risks',
          left: 'center'
        },
        tooltip: {},
        legend: {
          top: 30,
          data: filteredIncomeTypes
        },
        radar: {
          indicator: indicators,
          shape: 'circle',
          radius: '65%',
          splitNumber: 4,
          axisName: {
            color: '#428BD4',
            formatter: '{value}'
          },
          splitLine: {
            lineStyle: { color: 'rgba(211, 253, 250, 0.8)' }
          },
          splitArea: {
            areaStyle: {
              color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowBlur: 10
            }
          }
        },
        series: [
          {
            type: 'radar',
            data: series
          }
        ]
      };

      this.chart.setOption(option);
    });
  }
}
