// app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { EnergyGlobeComponent } from './components/globe/renewable-energy/energy-globe.component';
import { DisasterGlobeComponent } from './components/globe/climate-disasters/disaster-globe.component';
import { ForestGlobeComponent } from './components/globe/forest-carbon/forest-globe.component';
import { IncomeGlobeComponent } from './components/globe/income-loss/income-globe.component';
import { EmissionsGlobeComponent } from './components/globe/emissions/emission-globe.component';

import {
  API_YEAR_RANGE,
  ENERGY_TYPES,
  INCOME_TYPES,
  EMISSIONS_TYPES,
  FOREST_TYPES,
  DISASTER_TYPES
} from './shared/constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterOutlet,
    MatDialogModule,
    SidebarComponent,
    NavbarComponent,
    EnergyGlobeComponent,
    DisasterGlobeComponent,
    ForestGlobeComponent,
    EmissionsGlobeComponent,
    IncomeGlobeComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  apiType!: string;
  indicatorType!: string;
  startYear!: number;
  endYear!: number;
  selectedYear!: number;

  constructor(private router: Router) {
    // Initial setup before first CD
    this.updateParams(this.router.url);

    // Re-apply on every NavigationEnd
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe((evt: NavigationEnd) => {
        this.updateParams(evt.urlAfterRedirects);
      });
  }

  private updateParams(url: string) {
    if (url.includes('renewable-energy')) {
      this.apiType       = 'renewable-energy';
      this.indicatorType = ENERGY_TYPES[0];
    } else if (url.includes('income-loss')) {
      this.apiType       = 'income-loss';
      this.indicatorType = INCOME_TYPES[0];
    } else if (url.includes('greenhouse-emissions')) {
      this.apiType       = 'greenhouse-emissions';
      this.indicatorType = EMISSIONS_TYPES[0];
    } else if (url.includes('forest-carbon')) {
      this.apiType       = 'forest-carbon';
      this.indicatorType = FOREST_TYPES[0];
    } else if (url.includes('climate-disasters')) {
      this.apiType       = 'climate-disasters';
      this.indicatorType = DISASTER_TYPES[0];
    } else {
      this.apiType       = '';
      this.indicatorType = '';
    }

    if (this.apiType && this.apiType in API_YEAR_RANGE) {
      const r = API_YEAR_RANGE[this.apiType as keyof typeof API_YEAR_RANGE];
      this.startYear    = r.min;
      this.endYear      = r.max;
      this.selectedYear = r.max;
    } else {
      this.startYear    = 2000;
      this.endYear      = 2025;
      this.selectedYear = 2025;
    }
  }


  onApiTypeChange(type: string) {
    this.router.navigate([type]);
  }

  onIndicatorTypeChange(newInd: string) {
    this.indicatorType = newInd;
  }
  onYearRangeChange(range: { startYear: number; endYear: number }) {
    this.startYear = range.startYear;
    this.endYear   = range.endYear;
    if (this.selectedYear < this.startYear) this.selectedYear = this.startYear;
    if (this.selectedYear > this.endYear)   this.selectedYear = this.endYear;
  }
  onSelectedYearChange(year: number) {
    this.selectedYear = year;
  }
}
