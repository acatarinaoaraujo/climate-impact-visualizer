import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RenewableMultilineChartComponent } from './charts/renewable-multiline-chart/renewable-multiline-chart.component';
import { RenewableBarRaceComponent } from './charts/renewable-bar-race/renewable-bar-race.component';
import { EmissionsSankeyComponent } from './charts/emissions-sankey/emissions-sankey.component';
import { ForestCarbonTreemapComponent } from './charts/forest-carbon-treemap/forest-carbon-treemap.component';
import { IncomeLossRadarComponent } from './charts/income-loss-radar/income-loss-radar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    RenewableMultilineChartComponent,
    RenewableBarRaceComponent,
    EmissionsSankeyComponent,
    ForestCarbonTreemapComponent,
    IncomeLossRadarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  selectedCountryCode = 'US';
  selectedYear = 2020;

  countries = [
    { code: 'US', name: 'United States' },
    { code: 'BR', name: 'Brazil' },
    { code: 'AF', name: 'Afghanistan' },
    // add more if needed
  ];

  years = Array.from({ length: 24 }, (_, i) => 2000 + i); // 2000–2023

  onCountryChange(code: string): void {
    this.selectedCountryCode = code;
  }

  onYearChange(year: number): void {
    this.selectedYear = year;
  }
}
