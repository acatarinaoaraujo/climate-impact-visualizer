import { Component, Input, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
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
  @Input() apiType: string = 'renewable-energy';
  isCollapsed = false;
  selectedEnergyType: string = 'Fossil fuels';
  selectedIndicatorType: string = 'Climate related disasters frequency, Number of Disasters: Landslide';
  startYear: number = 2000;
  endYear: number = 2025;

  energyTypes: string[] = [];
  indicatorTypes: string[] = []; // ✅ Add this line to fix the error
  yearRange: { min: number, max: number } = { min: 2000, max: 2025 };

  @Output() energyTypeChange = new EventEmitter<string>();
  @Output() yearRangeChange = new EventEmitter<{ startYear: number; endYear: number }>();
  @Output() indicatorTypeChange = new EventEmitter<string>();

  @ViewChild(SidebarListComponent) sidebarList!: SidebarListComponent;

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['apiType']) {
      console.log('Selected API Type:', this.apiType);
      this.updateOptions();  // ✅ Call the correct function name
      this.updateYearRange();
      this.fetchData();
    }
  }

  // ✅ Correct function name
  updateOptions() {
    if (this.apiType === 'income-loss') {
      this.energyTypes = [
        'Acute climate damages',
        'Business confidence losses',
        'Chronic climate damages',
        'Mitigation policy costs',
        'Total GDP risk'
      ];
      this.selectedEnergyType = this.energyTypes[0] || '';
    } else if (this.apiType === 'renewable-energy') {
      this.energyTypes = [
        'Fossil fuels', 'Solar energy', 'Wind energy', 'Hydropower (excl. Pumped Storage)', 'Bioenergy'
      ];
      this.selectedEnergyType = this.energyTypes[0] || '';
    } else if (this.apiType === 'climate-disasters') {
      this.indicatorTypes = [ // ✅ Uses `indicatorTypes` instead of `energyTypes`
        'Climate related disasters frequency, Number of Disasters: Drought',
        'Climate related disasters frequency, Number of Disasters: Earthquake',
        'Climate related disasters frequency, Number of Disasters: Extreme temperature',
        'Climate related disasters frequency, Number of Disasters: Flood',
        'Climate related disasters frequency, Number of Disasters: Landslide',
        'Climate related disasters frequency, Number of Disasters: Storm',
        'Climate related disasters frequency, Number of Disasters: Wildfire'
      ];
      this.selectedIndicatorType = this.indicatorTypes[0] || '';
    }
  }

  // Dynamically update year range based on apiType
  updateYearRange() {
    if (this.apiType === 'income-loss') {
      this.yearRange = { min: 2025, max: 2040 }; // Set the range for income-loss
      this.startYear = 2025;  // Set start year to 2024 for income-loss
      this.endYear = 2040;    // Set end year to 2025 for income-loss
    }  else if (this.apiType === 'renewable-energy') {
      this.yearRange = { min: 2000, max: 2025 }; // Set the range for renewable-energy
      this.startYear = 2000;  // Default for renewable energy
      this.endYear = 2025;    // Default for renewable energy
    } else if (this.apiType === 'climate-disasters') {
      this.yearRange = { min: 1980, max: 2024 }; // Set the range for climate-disasters
      this.startYear = 1980;  // Default for climate disasters
      this.endYear = 2024;    // Default for climate disasters
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

  onSelectionChange(selectedValue: string) {
    console.log('Selection Changed:', selectedValue); // Debug log
    if (this.apiType === 'renewable-energy') {
      this.selectedEnergyType = selectedValue;
      this.energyTypeChange.emit(selectedValue);
    } else if (this.apiType === 'climate-disasters') {
      this.selectedIndicatorType = selectedValue;
      this.indicatorTypeChange.emit(selectedValue);
    }
    this.fetchData(); // Ensure data updates
  }
  
  

  onEnergyTypeChange(energyType: string) {
    this.selectedEnergyType = energyType; // Update local value
    console.log('Selected Energy Type:', this.selectedEnergyType);
    this.energyTypeChange.emit(energyType); // Emit to parent if needed
  }
  
  onIndicatorTypeChange(indicatorType: string) {
    this.selectedIndicatorType = indicatorType;
    console.log('Selected Indicator Type:', this.selectedIndicatorType);
    this.indicatorTypeChange.emit(indicatorType); // Emits selected indicator type
  }
  

  // onEnergyTypeChange() {
  //   console.log('Selected Energy Type:', this.selectedEnergyType);
  //   this.energyTypeChange.emit(this.selectedEnergyType); // Emits selected energy type
  // }
  
  onYearRangeChange() {
    this.yearRangeChange.emit({ startYear: this.startYear, endYear: this.endYear }); // Emits year range object
  }
}
