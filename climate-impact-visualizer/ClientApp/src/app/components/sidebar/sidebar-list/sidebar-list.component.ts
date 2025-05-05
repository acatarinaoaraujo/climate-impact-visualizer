import { AfterViewInit, Component, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CountryDetailDialogComponent } from '../../../country-detail-dialog/country-detail-dialog.component';
import { INDICATOR_UNITS } from '../../../shared/constants';
import { FormsModule } from '@angular/forms';

export interface CountryData {
  id: number;
  name: string;
  value: number;
  rateChange: number;
  previousValue: number;  // Store the previous value for rate calculation
}

@Component({
  selector: 'app-sidebar-list',
  standalone: true,
  imports: [MatFormFieldModule, CommonModule, MatInputModule, MatTableModule, MatSortModule, MatPaginator, MatIconModule, FormsModule],
  templateUrl: './sidebar-list.component.html',
  styleUrls: ['./sidebar-list.component.css']
})
export class SidebarListComponent implements AfterViewInit, OnChanges {
  @Input() apiType: string = 'default';  
  @Input() indicatorType: string = 'Fossil Fuels';
  @Input() startYear: number = 2000;
  @Input() endYear: number = 2025;
  @Input() selectedYear: number = 2000;

  unit: string = '';
  displayedColumns: string[] = ['name', 'value', 'rateChange'];
  dataSource = new MatTableDataSource<CountryData>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['indicatorType'] || changes['selectedYear'] || changes['apiType']) {
      this.unit = INDICATOR_UNITS[this.indicatorType] || '';
      this.fetchData();
    }
  }

  getUnit(): string {
    return INDICATOR_UNITS[this.indicatorType] || '';
  }

  private fetchData(): void {
    let url = '';

    if (this.apiType === 'income-loss') {
      url = 'http://localhost:5085/api/incomeloss/aggregated';
    } else if (this.apiType === 'renewable-energy') {
      url = 'http://localhost:5085/api/renewableenergy/aggregated';
    } else if (this.apiType === 'climate-disasters') {
      url = 'http://localhost:5085/api/climatedisasters/aggregated';
    } else if (this.apiType === 'forest-carbon') {
      url = 'http://localhost:5085/api/forestcarbon/aggregated';
    } else {
      url = 'http://localhost:5085/api/emissions/aggregated'; 
    }

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.dataSource.data = this.transformData(data);
      },
      error: (err) => console.error(`Error fetching ${this.apiType} data:`, err),
    });
  }

  private transformData(aggregatedData: any[]): CountryData[] {
    const transformedData = aggregatedData.map((item, index) => {
      const currentValue = this.getValue(item);
      const previousValue = this.getPreviousValue(item);

      const rateChange = this.calculateRateChange(currentValue, previousValue);

      return {
        id: index + 1,
        name: item.country,
        value: currentValue,
        rateChange,
        previousValue,  // Store previous value for debugging or further use
        apiType: this.apiType,
        indicatorType: this.indicatorType,
        startYear: this.startYear,
        endYear: this.endYear,
        selectedYear: this.selectedYear,
        fullData: item,  // Store the full data for the dialog
      };
    });
    
    return transformedData;
  }

  private calculateRateChange(currentValue: number, previousValue: number): number {
    if (previousValue === 0 || currentValue === 0) return 0;  // Avoid division by zero
    return ((currentValue - previousValue) / previousValue) * 100;
  }

  private getValue(item: any): number {
    let dataKey = '';

    if (this.apiType === 'income-loss') {
      dataKey = 'variables';
    } else if (this.apiType === 'renewable-energy') {
      dataKey = 'technologies';
    } else if ((this.apiType === 'climate-disasters') || (this.apiType === 'greenhouse-emissions') || (this.apiType === 'forest-carbon')) {
      dataKey = 'indicators';
    }

    const techOrVarData = item[dataKey].find((techOrVar: any) =>
      techOrVar.name.trim().toLowerCase() === this.indicatorType.trim().toLowerCase()
    );

    if (!techOrVarData) return 0;

    const yearValue = techOrVarData.yearlyData[`F${this.selectedYear}`];
    return yearValue !== undefined ? parseFloat(yearValue.toFixed(1)) : 0;
  }

  private getPreviousValue(item: any): number {
    const previousYear = this.selectedYear - 1;
    let dataKey = '';

    if (this.apiType === 'income-loss') {
      dataKey = 'variables';
    } else if (this.apiType === 'renewable-energy') {
      dataKey = 'technologies';
    } else if ((this.apiType === 'climate-disasters') || (this.apiType === 'greenhouse-emissions') || (this.apiType === 'forest-carbon')) {
      dataKey = 'indicators';
    }

    const techOrVarData = item[dataKey].find((techOrVar: any) =>
      techOrVar.name.trim().toLowerCase() === this.indicatorType.trim().toLowerCase()
    );

    if (!techOrVarData) return 0;

    const previousYearValue = techOrVarData.yearlyData[`F${previousYear}`];
    return previousYearValue !== undefined ? parseFloat(previousYearValue.toFixed(1)) : 0;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  updateData(data: any[], settings: any) {
    this.indicatorType = settings.indicatorType;
    this.selectedYear = settings.selectedYear;
    this.dataSource.data = this.transformData(data);
  }

  openCountryDetailDialog(row: any): void {
    let relevantData: any;

    if (row.fullData) {
      if (this.apiType === 'income-loss') {
        relevantData = row.fullData.variables;  // Send 'variables' for income-loss
      } else if (this.apiType === 'renewable-energy') {
        relevantData = row.fullData.technologies;  // Send 'technologies' for renewable-energy
      } else if (this.apiType === 'climate-disasters' || this.apiType === 'greenhouse-emissions' || this.apiType === 'forest-carbon') {
        relevantData = row.fullData.indicators;  // Send 'indicators' for climate-disasters, greenhouse-emissions, forest-carbon
      }
    }

    if (!relevantData) {
      console.error('No relevant data found for the selected API type');
      return;  // Exit if no relevant data is found
    }

    this.dialog.open(CountryDetailDialogComponent, {
      width: '60vw',          // Makes it very wide relative to the screen
  maxWidth: '100vw',      // Remove Angular Material's default cap
  height: '90vh',         // Optional: also make it taller

     
      data: {
        name: row.name,
        value: row.value,
        rateChange: row.rateChange.toFixed(2),
        apiType: row.apiType,
        indicatorType: row.indicatorType,
        startYear: row.startYear,
        endYear: row.endYear,
        selectedYear: row.selectedYear,
        fullData: relevantData  // Send only the relevant field data
      }
    });
  }
}
