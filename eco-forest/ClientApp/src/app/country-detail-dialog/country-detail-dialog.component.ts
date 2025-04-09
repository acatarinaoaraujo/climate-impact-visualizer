import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';

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
    MatListModule
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
    newsHeadlines: string[];
  } | null = null;

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

      // Simulate API call to LLM
      setTimeout(() => {
        this.llmResponse = {
          currentYearSummary: `In 2025, ${this.data.name} has made significant strides in renewable energy adoption, increasing solar and wind capacity by 15%.`,
          historicalComparison: `Since 2020, ${this.data.name} has improved its renewable energy output by 40%, indicating a positive trend towards sustainable energy.`,
          newsHeadlines: [
            `${this.data.name} Launches New Solar Power Initiative`,
            `Wind Farms in ${this.data.name} Set New Production Records`,
            `${this.data.name} Receives International Praise for Renewable Energy Policies`
          ]
        };
        this.isLoading = false;
      }, 2000);
    }
  }
}
