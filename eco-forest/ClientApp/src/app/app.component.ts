import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { GlobeComponent } from './components/globe/globe.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobeComponent, SidebarComponent, NavbarComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client-app';
  selectedEnergyType: string = 'Fossil fuels';
  startYear: number = 2000;
  endYear: number = 2025;
  selectedApiType: string = 'renewable-energy';

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
