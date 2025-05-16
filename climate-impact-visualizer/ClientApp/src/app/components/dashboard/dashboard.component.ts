import { Component } from '@angular/core';
import { RenewableMultilineChartComponent } from './renewable-multiline-chart/renewable-multiline-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RenewableMultilineChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})
export class DashboardComponent {
  selectedCountryCode = 'US'; 

  onCountryChange(event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  this.selectedCountryCode = selectElement.value;
}

}
