import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnergyGlobeComponent } from './components/globe/renewable-energy/energy-globe.component';
import { DisasterGlobeComponent } from './components/globe/climate-disasters/disaster-globe.component';
import { ForestGlobeComponent } from './components/globe/forest-carbon/forest-globe.component';
import { IncomeGlobeComponent } from './components/globe/income-loss/income-globe.component';
import { EmissionsGlobeComponent } from './components/globe/emissions/emission-globe.component';

export const routes: Routes = [
  { path: 'renewable-energy', component: EnergyGlobeComponent, data: { apiType: 'renewable-energy' } },
  { path: 'income-loss', component: IncomeGlobeComponent, data: { apiType: 'income-loss' } },
  { path: 'greenhouse-emissions', component: EmissionsGlobeComponent, data: { apiType: 'greenhouse-emissions' } },
  { path: 'forest-carbon', component: ForestGlobeComponent, data: { apiType: 'forest-carbon' } },
  { path: 'climate-disasters', component: DisasterGlobeComponent, data: { apiType: 'climate-disasters' } },
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }