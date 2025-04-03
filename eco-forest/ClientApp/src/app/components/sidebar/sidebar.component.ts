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
  @Input() apiType: string = ''; // Receive API type from parent
  isCollapsed = false;
  selectedEnergyType: string = ''; // Default for renewable energy
  startYear: number = 2000;
  endYear: number = 2025;
  
  energyTypes: string[] = [];
  yearRange: { min: number, max: number } = { min: 2000, max: 2025 };  // Default year range for renewable energy
  
  @Output() energyTypeChange = new EventEmitter<string>();
  @Output() yearRangeChange = new EventEmitter<{ startYear: number; endYear: number }>();
  
  @ViewChild(SidebarListComponent) sidebarList!: SidebarListComponent;

  private currentApiType: string = ''; // To track the current API type

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
    if (currentUrl.includes('climate-disasters') && this.currentApiType !== 'climate-disasters') {
      this.currentApiType = 'climate-disasters';
      this.apiType = this.currentApiType;  // Update the input API type
      this.updateSidebarData();
    } else if (currentUrl.includes('renewable-energy') && this.currentApiType !== 'renewable-energy') {
      this.currentApiType = 'renewable-energy';
      this.apiType = this.currentApiType;  // Update the input API type
      this.updateSidebarData();
    }
    console.log('API Type from URL:', this.apiType); // Debugging line to check API type
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
        'Acute climate damages',
        'Business confidence losses',
        'Chronic climate damages',
        'Mitigation policy costs',
        'Total GDP risk'
      ];
    } else if (this.apiType === 'renewable-energy') {
      this.energyTypes = [
        'Fossil fuels', 'Solar energy', 'Wind energy', 'Hydropower (excl. Pumped Storage)', 'Bioenergy'
      ];
    } else if (this.apiType === 'climate-disasters') {
      this.energyTypes = [
        'Climate related disasters frequency, Number of Disasters: Drought',
        'Climate related disasters frequency, Number of Disasters: Earthquake',
        'Climate related disasters frequency, Number of Disasters: Extreme temperature',
        'Climate related disasters frequency, Number of Disasters: Flood',
        'Climate related disasters frequency, Number of Disasters: Landslide',
        'Climate related disasters frequency, Number of Disasters: Storm',
        'Climate related disasters frequency, Number of Disasters: Wildfire'
      ];
    }

    this.selectedEnergyType = this.energyTypes[0] || '';
  }

  updateYearRange() {
    if (this.apiType === 'income-loss') {
      this.yearRange = { min: 2025, max: 2040 }; 
      this.startYear = 2025;  
      this.endYear = 2040;
    }  else if (this.apiType === 'renewable-energy') {
      this.yearRange = { min: 2000, max: 2025 };
      this.startYear = 2000;  
      this.endYear = 2025;
    } else if (this.apiType === 'climate-disasters') {
      this.yearRange = { min: 1980, max: 2024 };
      this.startYear = 1980;  
      this.endYear = 2024;
    }
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
