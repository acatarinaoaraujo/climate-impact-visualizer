import { Component, Input, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { SidebarListComponent } from './sidebar-list/sidebar-list.component';

@Component({
  selector: 'sidebar',
  standalone: true,
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.css'],
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatSliderModule,
    MatDividerModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    SidebarListComponent,
  ],
})

export class SidebarComponent {
  isCollapsed = false;

  @Input() apiType: string = ''; // Receive API type from parent
  selectedEnergyType: string = ''; // Default for renewable energy

  startYear: number = 2000;
  endYear: number = 2025;
  
  energyTypes: string[] = [];
  yearRange: { min: number, max: number } = { min: 2000, max: 2025 };  // Default year range for renewable energy
  
  @Output() energyTypeChange = new EventEmitter<string>();
  @Output() yearRangeChange = new EventEmitter<{ startYear: number; endYear: number }>();
  
  @ViewChild(SidebarListComponent) sidebarList!: SidebarListComponent;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.setApiTypeFromUrl();
    // Listen for router navigation end event, only update if URL changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setApiTypeFromUrl();
      }
    });
  }

  private setApiTypeFromUrl(): void {
    const currentUrl = this.router.url;
    console.log('Current URL:', currentUrl); // Debugging line to check the URL
    
    // Check if API type needs to be updated based on the URL
    if (currentUrl.includes('climate-disasters')) {
      this.apiType = 'climate-disasters';
    } else if (currentUrl.includes('renewable-energy')) {
      this.apiType = 'renewable-energy';
    } else if (currentUrl.includes('income-loss')) {
      this.apiType = 'income-loss';
    } else if (currentUrl.includes('greenhouse-emissions')) {
      this.apiType = 'greenhouse-emissions';
    } else if (currentUrl.includes('forest-carbon')) {
      this.apiType = 'forest-carbon';
    }
    
    this.updateSidebarData();
  }

  private updateSidebarData(): void {
    console.log('Updating sidebar with API Type:', this.apiType);
    this.updateEnergyTypes();
    this.updateYearRange();
    this.fetchData();
  }

  updateEnergyTypes() {
    if (this.apiType === 'income-loss') {
      this.energyTypes = [
        'Acute Climate Damages',
        'Business Confidence Losses',
        'Chronic Climate Damages',
        'Mitigation Policy Costs',
        'Total GDP Risk'
      ];
    } else if (this.apiType === 'renewable-energy') {
      this.energyTypes = [
        'Fossil Fuels', 'Solar Energy', 'Wind Energy', 'Hydropower (excl. Pumped Storage)', 'Bioenergy'
      ];
    } else if (this.apiType === 'climate-disasters') {
      this.energyTypes = [
        'Drought',
        'Earthquake',
        'Extreme temperature',
        'Flood',
        'Landslide',
        'Storm',
        'Wildfire'
      ];
    } else if (this.apiType === 'greenhouse-emissions') {
      this.energyTypes = [
        'Production',
        'Gross Imports',
        'Gross Exports',
        'Final Domestic Demand'
      ];
    } else if (this.apiType === 'forest-carbon') {
      this.energyTypes = [
        'Forest Area',
        'Index Of Forest Extent',
        'Land Area',
        'Share Of Forest Area'
      ];
    }
    
    this.selectedEnergyType = this.energyTypes[0] || '';
  }

  updateYearRange() {
    if (this.apiType === 'income-loss') {
      this.yearRange = { min: 2025, max: 2040 }; 
    } else if (this.apiType === 'renewable-energy') {
      this.yearRange = { min: 2000, max: 2025 };
    } else if (this.apiType === 'climate-disasters') {
      this.yearRange = { min: 1980, max: 2024 };
    } else if (this.apiType === 'greenhouse-emissions') {
      this.yearRange = { min: 1990, max: 2025 };
    } else if (this.apiType === 'forest-carbon') {
      this.yearRange = { min: 1990, max: 2025 };
    }
    
    this.startYear = this.yearRange.min;
    this.endYear = this.yearRange.max;
  }

  fetchData() {
    let url = '';
    let data = { energyType: this.selectedEnergyType, startYear: this.startYear, endYear: this.endYear };

    if (this.apiType === 'income-loss') {
      url = 'http://localhost:5085/api/incomeloss/aggregated';
    } else if (this.apiType === 'renewable-energy') {
      url = 'http://localhost:5085/api/renewableenergy/aggregated';
    } else if (this.apiType === 'climate-disasters') {
      url = 'http://localhost:5085/api/climatedisasters/aggregated';
    } else if (this.apiType === 'greenhouse-emissions') {
      url = 'http://localhost:5085/api/greenhouseemissions/aggregated';
    } else if (this.apiType === 'forest-carbon') {
      url = 'http://localhost:5085/api/forestcarbon/aggregated';
    }

    this.http.get<any[]>(url).subscribe({
      next: (response: any[]) => {
        if (this.sidebarList) {
          this.sidebarList.updateData(response, data);
        }
      },
      error: (err: any) => {
        console.error(`Error fetching ${this.apiType} data:`, err);
      }
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  formatLabel(value: number): string {
    return `${value}`;
  }

  onEnergyTypeChange() {
    console.log('Selected Energy Type:', this.selectedEnergyType);
    this.energyTypeChange.emit(this.selectedEnergyType);
  }

  onYearRangeChange() {
    this.yearRangeChange.emit({ startYear: this.startYear, endYear: this.endYear });
  }
}
