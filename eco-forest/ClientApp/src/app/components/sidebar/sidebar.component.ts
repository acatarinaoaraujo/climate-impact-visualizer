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
import { API_YEAR_RANGE, DISASTER_TYPES, EMISSIONS_TYPES, ENERGY_TYPES, FOREST_TYPES, INCOME_TYPES } from '../../shared/constants';

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

  @Input() apiType: string = ''; 
  @Input() indicatorType: string = ''; 
  @Input() startYear: number = 2000; 
  @Input() endYear: number = 2025; 

  @Output() apiTypeChange = new EventEmitter<string>();
  @Output() indicatorTypeChange = new EventEmitter<string>();
  @Output() yearRangeChange = new EventEmitter<{ startYear: number; endYear: number }>();

  selectedYear: number = 2000;
  
  indicatorTypes: string[] = [];
  yearRange: { min: number, max: number } = { min: 2000, max: 2025 };  // Default year range for renewable indicator
  
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['apiType']) {
      // Update the start and end years based on the new apiType if it's changed
      const yearRange = this.apiType in API_YEAR_RANGE
  ? API_YEAR_RANGE[this.apiType as keyof typeof API_YEAR_RANGE]
  : { min: 2000, max: 2025 };

      this.startYear = yearRange.min;
      this.endYear = yearRange.max;

      this.yearRangeChange.emit({ startYear: this.startYear, endYear: this.endYear });
    }
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
    this.apiTypeChange.emit(this.apiType);
    this.updateSidebarData();
  }

  private updateSidebarData(): void {
    console.log('Updating sidebar with API Type:', this.apiType);
    this.updateIndicatorTypes();
    this.updateYearRange();
    this.fetchData();
  }

  updateIndicatorTypes() {
    if (this.apiType === 'income-loss') {
      this.indicatorTypes = INCOME_TYPES;
    } else if (this.apiType === 'renewable-energy') {
      this.indicatorTypes = ENERGY_TYPES
    } else if (this.apiType === 'climate-disasters') {
      this.indicatorTypes = DISASTER_TYPES
    } else if (this.apiType === 'greenhouse-emissions') {
      this.indicatorTypes = EMISSIONS_TYPES
    } else if (this.apiType === 'forest-carbon') {
      this.indicatorTypes = FOREST_TYPES;
    }
    
    this.indicatorType = this.indicatorTypes[0] || '';
  }

  updateYearRange() {
    if (this.apiType === 'income-loss') {
      this.yearRange = { min: API_YEAR_RANGE['income-loss'].min, max: API_YEAR_RANGE['income-loss'].max }; 
    } else if (this.apiType === 'renewable-energy') {
      this.yearRange = { min: API_YEAR_RANGE['renewable-energy'].min, max: API_YEAR_RANGE['renewable-energy'].max };
    } else if (this.apiType === 'climate-disasters') {
      this.yearRange = { min: API_YEAR_RANGE['climate-disasters'].min, max: API_YEAR_RANGE['climate-disasters'].max };
    } else if (this.apiType === 'greenhouse-emissions') {
      this.yearRange = { min: API_YEAR_RANGE['greenhouse-emissions'].min, max: API_YEAR_RANGE['greenhouse-emissions'].max };
    } else if (this.apiType === 'forest-carbon') {
      this.yearRange = { min: API_YEAR_RANGE['forest-carbon'].min, max: API_YEAR_RANGE['forest-carbon'].max };
    }
  
    this.selectedYear = this.yearRange.min;
    this.onYearChange();
  }
  fetchData() {
    let url = '';
    let data = { indicatorType: this.indicatorType, startYear: this.startYear, endYear: this.endYear };
    console.log("data", data);

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
          console.log("response", response);
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

  onIndicatorChange(newIndicator: string): void {
    console.log('Selected Indicator Type:', this.indicatorType);
    this.indicatorType = newIndicator;
    this.indicatorTypeChange.emit(newIndicator); // Emit the change to parent
  }
  
  onYearChange() {
    this.yearRangeChange.emit({ startYear: this.selectedYear, endYear: this.selectedYear });
  }
}
