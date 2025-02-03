import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenewableEnergyDataService, RenewableEnergyDataModel } from '../../../services/renewable-energy-data.service';

@Component({
  selector: 'renewable-energy',
  templateUrl: './renewable-energy.component.html',
  styleUrls: ['./renewable-energy.component.css'],
  standalone: true,
  // imports: [CommonModule]  // Ensure CommonModule is imported
})
export class RenewableEnergyComponent implements OnInit {
  data: RenewableEnergyDataModel[] = [];

  constructor(private renewableEnergyDataService: RenewableEnergyDataService) {}

  ngOnInit(): void {
    this.renewableEnergyDataService.getData().subscribe((response) => {
      this.data = response;
    });
  }
}


