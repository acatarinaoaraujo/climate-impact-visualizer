import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { chartConfigMap } from '../chart-configs'; // Import the chart config map

// Define the structure of yearly data
interface YearlyData {
  [key: string]: number; // Key is a year string (e.g., "F2000"), value is a number
}

// Define the structure of the indicator data
interface Indicator {
  name: string;
  yearlyData: YearlyData;
}

@Component({
  selector: 'app-country-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatListModule,
    NgChartsModule
  ],
  templateUrl: './country-detail-dialog.component.html',
  styleUrls: ['./country-detail-dialog.component.css']
})
export class CountryDetailDialogComponent {
  userPrompt: string = '';
  isLoading: boolean = false;
  llmResponse: {
    currentYearSummary: string;
    historicalComparison: string;
    newsHeadlines: { title: string; url: string }[];
  } | null = null;

  chartData: any;
  chartOptions: ChartConfiguration['options'] = {};
  chartType: ChartType = 'doughnut'; // Default chart type

  constructor(
    public dialogRef: MatDialogRef<CountryDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      name: string; 
      value: number; 
      rateChange: number;
      apiType: string; 
      indicatorType: string; 
      startYear: number; 
      endYear: number; 
      selectedYear: number; 
      fullData: any;
    }
  ) {
    this.loadChartConfig();
  }

  loadChartConfig(): void {
    const config = chartConfigMap[this.data.apiType]?.[this.data.indicatorType];
    if (config) {
      // Prepare data for the chart
      const indicator: Indicator | undefined = this.data.fullData.find((item: any) => item.name === this.data.indicatorType);
      if (indicator) {
        const years = Object.keys(indicator.yearlyData); // Years in "F2000", "F2023" format
        const values = years.map(year => indicator.yearlyData[year]);

        this.chartData = {
          labels: years.map(year => year.substring(1)), // Extract year part (e.g., "2000" from "F2000")
          datasets: [{
            data: values,
            label: this.data.indicatorType,
            fill: false,
            borderColor: '#4caf50',  // Adjust the color as needed
            backgroundColor: 'rgba(76, 175, 80, 0.2)',  // Adjust the background color as needed
            borderWidth: 2
          }]
        };

        this.chartType = 'line'; // Default type for time series
        this.chartOptions = {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} GWh`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 5000  // Adjust step size as needed
              }
            }
          }
        };
      }
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitPrompt(): void {
    if (this.userPrompt.trim()) {
      this.isLoading = true;
      this.llmResponse = null;

      console.log(this.data);

      setTimeout(() => {
        this.llmResponse = {
          currentYearSummary: `In 2025, ${this.data.name} has made significant strides in renewable energy adoption, increasing solar and wind capacity by 15%.`,
          historicalComparison: `Since 2020, ${this.data.name} has improved its renewable energy output by 40%, indicating a positive trend towards sustainable energy.`,
          newsHeadlines: [
            {
              title: `${this.data.name} Launches New Solar Power Initiative`,
              url: 'https://example.com/solar-initiative'
            },
            {
              title: `Wind Farms in ${this.data.name} Set New Production Records`,
              url: 'https://example.com/wind-farms'
            },
            {
              title: `${this.data.name} Receives International Praise for Renewable Energy Policies`,
              url: 'https://example.com/praise-renewables'
            }
          ]
        };
        this.isLoading = false;
      }, 2000);
    }
  }
}