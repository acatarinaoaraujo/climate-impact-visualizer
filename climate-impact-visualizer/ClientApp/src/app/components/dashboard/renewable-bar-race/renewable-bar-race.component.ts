import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { API_LINKS, ENERGY_TYPES } from '../../../shared/constants';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-renewable-bar-race',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './renewable-bar-race.component.html',
  styleUrls: ['./renewable-bar-race.component.css'],
})
export class RenewableBarRaceComponent implements OnInit, AfterViewInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  chartInstance!: echarts.ECharts;
  chartOptions: EChartsOption = {};
  loading = true;
  selectedEnergyType = 'Solar Energy';
  energyTypes = ENERGY_TYPES;
  flags: Record<string, string> = {};
  countryColors: Record<string, string> = {};
  updateFrequency = 2000;
  years: string[] = [];
  data: any[] = [];
  currentIndex = 0;
  timer: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  this.fetchFlags();

  window.addEventListener('resize', () => {
    if (this.chartInstance) {
      this.chartInstance.resize();
    }
  });
}

ngOnDestroy(): void {
  clearInterval(this.timer);
  window.removeEventListener('resize', () => {});
}


  ngAfterViewInit(): void {
  setTimeout(() => {
    this.initChart();
    this.fetchData();  // Start fetching after chart init
  }, 0);
}


  fetchFlags(): void {
    this.http.get<any[]>('assets/datasets/data.json').subscribe((flagsData) => {
      flagsData.forEach((item) => {
        this.flags[item.name] = item.emoji;
      });
      this.fetchData();
    });
  }

 fetchData(): void {
  const url = API_LINKS['renewable-energy'];
  this.loading = true;

  this.http.get<any[]>(url).subscribe({
    next: (response: any[]) => {
      const energyType = this.selectedEnergyType;
      const countryDataMap: Record<string, Record<string, number>> = {};

      response.forEach((country) => {
        const countryName = country?.country || country?.name; // Use correct field
        if (!countryName) return; // Skip invalid country

        const tech = country.technologies.find(
          (t: any) => t.name === energyType
        );

        if (tech) {
          Object.entries(tech.yearlyData).forEach(([year, value]) => {
            const cleanYear = year.startsWith('F') ? year.slice(1) : year;
            if (!countryDataMap[cleanYear]) {
              countryDataMap[cleanYear] = {};
            }
            countryDataMap[cleanYear][countryName] = value as number;
          });
        }
      });

      this.years = Object.keys(countryDataMap).sort();
      this.data = this.years.map((year) => {
        const entries = Object.entries(countryDataMap[year] || {});
        const top10 = entries
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([country, value]) => [value, year, country]);
        return top10;
      });

      this.currentIndex = 0;
      this.updateChart();
      this.startAnimation();
      this.loading = false;
    },
    error: (err) => {
      console.error('Failed to fetch renewable energy data', err);
      this.loading = false;
    },
  });
}


  initChart(): void {
    const container = this.chartContainer.nativeElement;
    this.chartInstance = echarts.init(container);
  }

  updateChart(): void {
    if (this.currentIndex >= this.years.length) {
      clearInterval(this.timer);
      return;
    }

    const year = this.years[this.currentIndex];
    const data = this.data[this.currentIndex];

    console.log('Data for year:', year, data);

    const option: EChartsOption = {
      grid: {
        top: 10,
        bottom: 30,
        left: 150,
        right: 80,
      },
      xAxis: {
        max: 'dataMax',
        axisLabel: {
          formatter: (n: number) => Math.round(n).toString(),
        },
      },
      yAxis: {
        type: 'category',
        inverse: true,
        max: 10,
        data: data.map((item: [number, string, string]) => item[2]),

        axisLabel: {
          show: true,
          fontSize: 14,
          formatter: (value: any) => {
            const flag = this.flags[value] || '';
            return `${value} {flag|${flag}}`;
          },
          rich: {
            flag: {
              fontSize: 25,
              padding: 5,
            },
          },
        },
        animationDuration: 300,
        animationDurationUpdate: 300,
      },
      series: [
        {
          realtimeSort: true,
          seriesLayoutBy: 'column',
          type: 'bar',
          itemStyle: {
            color: (param: any) => {
              const value = param.value;
              if (Array.isArray(value) && value.length > 2) {
                const country = value[2];
                if (!this.countryColors[country]) {
                  this.countryColors[country] = this.getRandomColor();
                }
                return this.countryColors[country];
              }
              return '#ccc';
            },
          },
          encode: {
            x: 0,
            y: 2,
          },
          label: {
            show: true,
            precision: 1,
            position: 'right',
            valueAnimation: true,
            fontFamily: 'monospace',
          },
          data: data,
        },
      ],
      animationDuration: 0,
      animationDurationUpdate: this.updateFrequency,
      animationEasing: 'linear',
      animationEasingUpdate: 'linear',
      graphic: {
        elements: [
          {
            type: 'text',
            right: 160,
            bottom: 60,
            style: {
              text: year,
              font: 'bolder 80px monospace',
              fill: 'rgba(100, 100, 100, 0.25)',
            },
            z: 100,
          },
        ],
      },
    };

    this.chartInstance.setOption(option);
  }

  startAnimation(): void {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.currentIndex++;
      if (this.currentIndex < this.years.length) {
        this.updateChart();
      } else {
        clearInterval(this.timer);
      }
    }, this.updateFrequency);
  }

  onEnergyTypeChange(): void {
    clearInterval(this.timer);
    this.fetchData();
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
