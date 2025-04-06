import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Router, ActivatedRoute } from '@angular/router';

import { EnergyGlobeComponent } from './components/globe/renewable-energy/energy-globe.component';
import { DisasterGlobeComponent } from './components/globe/climate-disasters/disaster-globe.component';
import { ForestGlobeComponent } from './components/globe/forest-carbon/forest-globe.component';
import { IncomeGlobeComponent } from './components/globe/income-loss/income-globe.component';
import { EmissionsGlobeComponent } from './components/globe/emissions/emission-globe.component';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [
    CommonModule, 
    EnergyGlobeComponent, 
    DisasterGlobeComponent, 
    ForestGlobeComponent, 
    IncomeGlobeComponent, 
    EmissionsGlobeComponent, 
    SidebarComponent, 
    NavbarComponent, 
    HttpClientModule, 
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client-app';
  indicatorType: string = 'Drought';
  startYear: number = 2000;
  endYear: number = 2025;
  apiType: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.url.subscribe(() => {
      const url = this.router.url;
      if (url.includes('renewable-energy')) this.apiType = 'renewable-energy';
      else if (url.includes('income-loss')) this.apiType = 'income-loss';
      else if (url.includes('greenhouse-emissions')) this.apiType = 'greenhouse-emissions';
      else if (url.includes('forest-carbon')) this.apiType = 'forest-carbon';
      else if (url.includes('climate-disasters')) this.apiType = 'climate-disasters';
      else this.apiType = '';
    });
  }
  onIndicatorTypeChange(newIndicator: string) {
    console.log('Indicator Type Changed:', newIndicator);
    this.indicatorType = newIndicator;
  }

  onYearRangeChange(yearRange: { startYear: number; endYear: number }) {
    this.startYear = yearRange.startYear;
    this.endYear = yearRange.endYear;
  }

  onApiTypeChange(type: string) {
    this.apiType = type;
  }
}