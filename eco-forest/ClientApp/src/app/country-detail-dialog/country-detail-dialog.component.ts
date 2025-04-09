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

  renewableBreakdown = {
    labels: ['Solar', 'Wind', 'Hydro', 'Biomass', 'Geothermal'],
    datasets: [{
      data: [30, 25, 20, 15, 10], // sample % values
      backgroundColor: ['#fdd835', '#64b5f6', '#81c784', '#a1887f', '#ff8a65']
    }]
  };

  chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  chartType: 'doughnut' = 'doughnut'; // ✅ explicitly typed


  constructor(
    public dialogRef: MatDialogRef<CountryDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string; value: number; rateChange: number }
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitPrompt(): void {
    if (this.userPrompt.trim()) {
      this.isLoading = true;
      this.llmResponse = null;

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
