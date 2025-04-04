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

export interface CountryData {
  id: number;
  name: string;
  value: number;
  rateChange: number;
}

@Component({
  selector: 'app-sidebar-list',
  standalone: true,
  imports: [MatFormFieldModule, CommonModule, MatInputModule, MatTableModule, MatSortModule, MatPaginator, MatIconModule],
  templateUrl: './sidebar-list.component.html',
  styleUrls: ['./sidebar-list.component.css']
})
export class SidebarListComponent implements AfterViewInit, OnChanges {
  @Input() apiType: string = 'default';  // Added apiType input
  @Input() indicatorType: string = 'Fossil fuels';
  @Input() startYear: number = 2000;
  @Input() endYear: number = 2025;

  displayedColumns: string[] = ['id', 'name', 'value', 'rateChange'];
  dataSource = new MatTableDataSource<CountryData>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['indicatorType'] || changes['startYear'] || changes['endYear'] || changes['apiType']) {
      this.fetchData();
    }
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

    // Set the URL based on the apiType and fetch data
    console.log('Selected API Type:', this.apiType);
    console.log('Fetching data from URL:', url);

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.dataSource.data = this.transformData(data);
        console.log('Data fetched:', this.dataSource.data);
      },
      error: (err) => console.error(`Error fetching ${this.apiType} data:`, err),
    });
  }

  private transformData(aggregatedData: any[]): CountryData[] {
    return aggregatedData.map((item, index) => ({
      id: index + 1,
      name: item.country,
      value: this.getValue(item),
      rateChange: parseFloat((Math.random() * 10 - 5).toFixed(2)),
    }));
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

    console.log('Data Key:', dataKey);


    const techOrVarData = item[dataKey].find((techOrVar: any) =>
      techOrVar.name.trim().toLowerCase() === this.indicatorType.trim().toLowerCase()
    );
    if (!techOrVarData) return 0;

    // Calculate the sum for the selected range of years
    const total = Object.keys(techOrVarData.yearlyData)
      .filter(year => +year.replace('F', '') >= this.startYear && +year.replace('F', '') <= this.endYear)
      .reduce((sum, year) => sum + (techOrVarData.yearlyData[year] || 0), 0);

    return parseFloat(total.toFixed(1));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  // Method to update data based on new inputs from the sidebar
  updateData(data: any[], settings: any) {
    this.indicatorType = settings.indicatorType;
    this.startYear = settings.startYear;
    this.endYear = settings.endYear;
    this.dataSource.data = this.transformData(data);
  }
}