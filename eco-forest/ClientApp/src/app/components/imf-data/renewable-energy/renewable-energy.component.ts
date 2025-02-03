import { Component, OnInit } from '@angular/core';
import { RenewableEnergyDataService } from '../../../services/renewable-energy-data.service';

@Component({
  selector: 'renewable-energy',
  templateUrl: './renewable-energy.component.html',
  styleUrls: ['./renewable-energy.component.css']
})
export class RenewableEnergyComponent implements OnInit {
  data: any[] = [];

  constructor(private dataService: RenewableEnergyDataService) {}

  ngOnInit(): void {
    this.dataService.getAggregatedData().subscribe(
      (response) => {
        this.data = response;
        console.log('Aggregated Data:', this.data);
      },
      (error) => {
        console.error('Error fetching aggregated data:', error);
      }
    );
  }
}
