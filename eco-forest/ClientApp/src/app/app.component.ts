import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { EnergyGlobeComponent } from './components/globe/renewable-energy/energy-globe.component';
import { DisasterGlobeComponent } from './components/globe/climate-disasters/disaster-globe.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [CommonModule, EnergyGlobeComponent, DisasterGlobeComponent, SidebarComponent, NavbarComponent, HttpClientModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client-app';
  selectedType: string = '';
  startYear: number = 2000;
  endYear: number = 2025;
  selectedApiType: string = '';

  // selectedIndicatorType = 'Climate related disasters frequency, Number of Disasters: Landslide';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.url.subscribe(() => {
      const url = this.router.url;
      this.selectedApiType = url.includes('climate-disasters') ? 'climate-disasters' : 'renewable-energy';
    });
  }
  
  // onIndicatorTypeChange(indicatorType: string) {
  //   this.selectedIndicatorType = indicatorType;
  // }


  onTypeChange(type: string) {
    this.selectedType = type;
  }

  onYearRangeChange(yearRange: { startYear: number; endYear: number }) {
    this.startYear = yearRange.startYear;
    this.endYear = yearRange.endYear;
  }

  onApiTypeChange(apiType: string) {
    this.selectedApiType = apiType;
  }
}
