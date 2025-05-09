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
import { INDICATOR_UNITS } from '../shared/constants';

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
  unit: string = ''; 
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
    this.unit = INDICATOR_UNITS[this.data.indicatorType]; 

  }


  loadChartConfig(): void {
    const config = chartConfigMap[this.data.apiType]?.[this.data.indicatorType];
    if (config) {
      // Prepare data for the chart
      const indicator: Indicator | undefined = this.data.fullData.find((item: any) => item.name === this.data.indicatorType);
      console.log('Chart Data:', this.chartData);
console.log('Chart Type:', this.chartType);

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
                label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} ${this.unit}` // Use the unit for the tooltip
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
    const trimmedPrompt = this.userPrompt?.trim();
  
    if (!trimmedPrompt || trimmedPrompt.length < 3) {
      alert('Please enter a more specific question.');
      return;
    }
  
    this.isLoading = true;
    this.llmResponse = null;
  
    // Find the selected indicator's full data for context
    const indicator: Indicator | undefined = this.data.fullData.find(
      (item: any) => item.name === this.data.indicatorType
    );
  
    const indicatorContext = indicator ? indicator.yearlyData : {};

    console.log('Data being sent to LLM API:', {
      country: this.data.name,
      question: trimmedPrompt,
      indicatorType: this.data.indicatorType,
      indicatorData: this.data.fullData,
      selectedYear: this.data.selectedYear,
      rateChange: this.data.rateChange
    });
  
    fetch('/api/llm/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        country: this.data.name,
        indicatorType: this.data.indicatorType,
        selectedYear: this.data.selectedYear,
        rateChange: this.data.rateChange,
        indicatorData: indicatorContext,
        question: trimmedPrompt
      })
    })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
  
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        console.log('[LLM Response]', data);
  
        this.llmResponse = {
          currentYearSummary: data.response?.replace(/\* (.+?):/g, '<b>$1:</b>') || '',
          historicalComparison: '',
          newsHeadlines: []
        };
      } catch (jsonError) {
        console.error('Failed to parse JSON:', jsonError);
        this.llmResponse = {
          currentYearSummary: '⚠️ Invalid response from server.',
          historicalComparison: '',
          newsHeadlines: []
        };
      }
  
      this.isLoading = false;
    })
    .catch((err) => {
      console.error('[LLM Error]', err);
      this.llmResponse = {
        currentYearSummary: '⚠️ Something went wrong. Please try again.',
        historicalComparison: '',
        newsHeadlines: []
      };
      this.isLoading = false;
    });
  }
  

  
}