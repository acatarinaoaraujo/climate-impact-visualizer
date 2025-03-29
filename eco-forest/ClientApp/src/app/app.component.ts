import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { GlobeComponent } from './components/globe/globe.component';
import { DisasterGlobeComponent } from './components/globe/climate-disasters/disaster-globe.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, GlobeComponent, DisasterGlobeComponent, SidebarComponent, NavbarComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client-app';
  selectedEnergyType: string = 'Fossil fuels';
  startYear: number = 2000;
  endYear: number = 2025;
  selectedApiType: string = 'renewable-energy';

  selectedIndicatorType = 'Climate related disasters frequency, Number of Disasters: Landslide';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      // Check the current route and update selectedApiType accordingly
      const url = this.router.url;
      if (url.includes('climate-disasters')) {
        this.selectedApiType = 'climate-disasters';
      } else if (url.includes('renewable-energy')) {
        this.selectedApiType = 'renewable-energy';
      }
    });
  }

  onIndicatorTypeChange(indicatorType: string) {
    if (this.selectedApiType === 'climate-disasters') {
      this.selectedIndicatorType = indicatorType;
    }
  }

  onEnergyTypeChange(energyType: string) {
    this.selectedEnergyType = energyType;
  }

  onYearRangeChange(yearRange: { startYear: number; endYear: number }) {
    this.startYear = yearRange.startYear;
    this.endYear = yearRange.endYear;
  }

  onApiTypeChange(apiType: string) {
    this.selectedApiType = apiType;
  }
}
