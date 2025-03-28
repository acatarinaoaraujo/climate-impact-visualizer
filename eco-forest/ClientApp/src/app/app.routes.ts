import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobeComponent } from './components/globe/globe.component';
import { DisasterGlobeComponent } from './components/globe/climate-disasters/disaster-globe.component';

export const routes: Routes = [
  { path: 'renewable-energy', component: GlobeComponent },
  { path: 'gdp-losses-benefits', redirectTo: 'https://climatedata.imf.org/pages/ngfs/#ngfs7', pathMatch: 'full' },
  { path: 'greenhouse-emissions', redirectTo: 'https://climatedata.imf.org/pages/greenhouse-gas-emissions#gg4', pathMatch: 'full' },
  { path: 'climate-weather/surface-temperature', redirectTo: 'https://climatedata.imf.org/pages/climate-and-weather#cc1', pathMatch: 'full' },
  { path: 'climate-weather/mean-sea-levels', redirectTo: 'https://climatedata.imf.org/pages/climate-and-weather#cc3', pathMatch: 'full' },
  { path: 'mitigation/forest-carbon', redirectTo: 'https://climatedata.imf.org/pages/mitigation#mi6', pathMatch: 'full' },
  { path: 'adaptation/climate-disasters', component: DisasterGlobeComponent },
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }