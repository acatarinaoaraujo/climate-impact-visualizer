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
  rateChange: number; // Rate change should be a number
}

@Component({
  selector: 'app-sidebar-list',
  standalone: true,
  imports: [MatFormFieldModule, CommonModule, MatInputModule, MatTableModule, MatSortModule, MatPaginator, MatIconModule],
  templateUrl: './sidebar-list.component.html',
  styleUrls: ['./sidebar-list.component.css']
})
export class SidebarListComponent implements AfterViewInit, OnChanges {
  @Input() energyType: string = 'Fossil fuels';
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
    if (changes['energyType'] || changes['startYear'] || changes['endYear']) {
      this.fetchData();
    }
  }

  private fetchData(): void {
    this.http.get<any[]>('http://localhost:5085/api/renewableenergy/aggregated').subscribe((data) => {
      this.dataSource.data = this.transformData(data);
    });
  }

  private transformData(aggregatedData: any[]): CountryData[] {
    return aggregatedData.map((item, index) => ({
      id: index + 1,
      name: item.country,
      value: this.getEnergyValue(item),
      rateChange: parseFloat((Math.random() * 10 - 5).toFixed(2)), // Ensure rateChange is a number
    }));
  }

  private getEnergyValue(item: any): number {
    const techData = item.technologies.find((tech: any) =>
      tech.technology.trim().toLowerCase() === this.energyType.trim().toLowerCase()
    );
    if (!techData) return 0;

    const total = Object.keys(techData.yearlyData)
      .filter(year => +year.replace('F', '') >= this.startYear && +year.replace('F', '') <= this.endYear)
      .reduce((sum, year) => sum + (techData.yearlyData[year] || 0), 0);

    return parseFloat(total.toFixed(1));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }
}
