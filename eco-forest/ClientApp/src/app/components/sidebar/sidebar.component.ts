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
  @Input() apiType: string = 'renewable-energy'; // Receive API type from parent
  isCollapsed = false;
  selectedEnergyType: string = 'Fossil fuels';
  startYear: number = 2000;
  endYear: number = 2025;

  energyTypes: string[] = this.apiType === 'income-loss'
  ? ['Acute climate damages', 'Business confidence losses', 'Chronic climate damages', 'Mitigation policy costs', 'Total GDP risk']
  : ['Fossil fuels', 'Solar energy', 'Wind energy', 'Hydropower (excl. Pumped Storage)', 'Bioenergy'];
  @Output() energyTypeChange = new EventEmitter<string>();
  @Output() yearRangeChange = new EventEmitter<{ startYear: number; endYear: number }>();

  @ViewChild(SidebarListComponent) sidebarList!: SidebarListComponent;  // Corrected ViewChild import

  constructor(private http: HttpClient) {}  // Inject HttpClient

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['apiType']) {
      console.log('Selected API Type:', this.apiType);
      this.fetchData(); // Fetch data when API type changes
    }
  }

  fetchData() {
    let url = '';
    let data = { energyType: this.selectedEnergyType, startYear: this.startYear, endYear: this.endYear };

    // Set the URL based on the API type and fetch data
    if (this.apiType === 'income-loss') {
      url = 'http://localhost:5085/api/incomeloss/aggregated';
    } else {
      url = 'http://localhost:5085/api/renewableenergy/aggregated';
    }

    this.http.get<any[]>(url).subscribe({
      next: (response: any[]) => {  // Explicitly define the type of response
        if (this.sidebarList) {
          this.sidebarList.updateData(response, data); // Pass data to SidebarListComponent
        }
      },
      error: (err: any) => {  // Explicitly define the type of error
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
    this.energyTypeChange.emit(this.selectedEnergyType);
  }

  onYearRangeChange() {
    this.yearRangeChange.emit({ startYear: this.startYear, endYear: this.endYear });
  }
}
