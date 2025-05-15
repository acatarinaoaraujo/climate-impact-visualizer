import {
  AfterViewInit,
  Component,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
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
import { API_LINKS } from '../../../shared/constants';

export interface CountryData {
  id: number;
  name: string;
  value: number;
  rateChange: number;
  previousValue: number;
}

@Component({
  selector: 'app-sidebar-list',
  standalone: true,
  imports: [
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginator,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './sidebar-list.component.html',
  styleUrls: ['./sidebar-list.component.css'],
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
    if (
      changes['indicatorType'] ||
      changes['selectedYear'] ||
      changes['apiType']
    ) {
      this.unit = INDICATOR_UNITS[this.indicatorType] || '';
      this.fetchData();
    }
  }

  getUnit(): string {
    return INDICATOR_UNITS[this.indicatorType] || '';
  }

private fetchData(): void {
  const url = API_LINKS[this.apiType] || API_LINKS['greenhouse-emissions']; // fallback if key missing

  this.http.get<any[]>(url).subscribe({
    next: (data) => {
      this.dataSource.data = this.transformData(data);
    },
    error: (err) =>
      console.error(`Error fetching ${this.apiType} data:`, err),
  });
}

  private transformData(aggregatedData: any[]): CountryData[] {
    const transformedData = aggregatedData.map((item, index) => {
      const currentValue = this.getValue(item);
      const previousValue = this.getPreviousValue(item);
      const hasData = currentValue !== null; 

      const rateChange = hasData
        ? this.calculateRateChange(currentValue, previousValue)
        : 0;

      return {
        id: index + 1,
        name: item.country,
        value: hasData ? currentValue : null,
        rateChange,
        previousValue,
        apiType: this.apiType,
        indicatorType: this.indicatorType,
        startYear: this.startYear,
        endYear: this.endYear,
        selectedYear: this.selectedYear,
        fullData: item,
        hasData,
      } as any;
    });

    return transformedData;
  }

  private calculateRateChange(
    currentValue: number,
    previousValue: number
  ): number {
    if (previousValue === 0 || currentValue === 0) return 0; 
    return ((currentValue - previousValue) / previousValue) * 100;
  }

  private getValue(item: any): number | null {
    const dataKey = this.getDataKey();
    const techOrVarData = item[dataKey]?.find(
      (entry: any) =>
        entry.name.trim().toLowerCase() ===
        this.indicatorType.trim().toLowerCase()
    );

    if (!techOrVarData) return null;

    const yearValue = techOrVarData.yearlyData[`F${this.selectedYear}`];
    return yearValue !== undefined ? parseFloat(yearValue.toFixed(1)) : null;
  }

  private getPreviousValue(item: any): number {
    const dataKey = this.getDataKey();
    const previousYear = this.selectedYear - 1;
    const techOrVarData = item[dataKey]?.find(
      (entry: any) =>
        entry.name.trim().toLowerCase() ===
        this.indicatorType.trim().toLowerCase()
    );

    if (!techOrVarData) return 0;

    const previousYearValue = techOrVarData.yearlyData[`F${previousYear}`];
    return previousYearValue !== undefined
      ? parseFloat(previousYearValue.toFixed(1))
      : 0;
  }

  private getDataKey(): string {
    if (this.apiType === 'income-loss') return 'variables';
    if (this.apiType === 'renewable-energy') return 'technologies';
    return 'indicators';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  updateData(data: any[], settings: any) {
    this.indicatorType = settings.indicatorType;
    this.selectedYear = settings.selectedYear;
    this.dataSource.data = this.transformData(data);
  }

  openCountryDetailDialog(row: any): void {
    if (!row.hasData) {
      console.warn(
        `No data available for ${row.name} and ${row.indicatorType}`
      );
      return;
    }

    let relevantData;
    const dataKey = this.getDataKey();
    relevantData = row.fullData[dataKey];

    this.dialog.open(CountryDetailDialogComponent, {
      width: '60vw',
      maxWidth: '100vw',
      height: '90vh',
      data: {
        name: row.name,
        value: row.value,
        rateChange: row.rateChange.toFixed(2),
        apiType: row.apiType,
        indicatorType: row.indicatorType,
        startYear: row.startYear,
        endYear: row.endYear,
        selectedYear: row.selectedYear,
        fullData: relevantData,
      },
    });
  }
}
