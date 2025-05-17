import { Component } from '@angular/core';
import { RenewableMultilineChartComponent } from './renewable-multiline-chart/renewable-multiline-chart.component';
import { RenewableBarRaceComponent } from './renewable-bar-race/renewable-bar-race.component';
import { EmissionsSankeyComponent } from './emissions-sankey/emissions-sankey.component';
import { ForestCarbonTreemapComponent } from './forest-carbon-treemap/forest-carbon-treemap.component';
import { IncomeLossRadarComponent } from './income-loss-radar/income-loss-radar.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RenewableMultilineChartComponent, RenewableBarRaceComponent, EmissionsSankeyComponent, ForestCarbonTreemapComponent, IncomeLossRadarComponent],
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
