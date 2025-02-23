import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GlobeComponent } from './components/globe/globe.component';

export const routes: Routes = [
  { path: '', component: GlobeComponent },
  { path: 'renewable-energy', component: GlobeComponent },
  { path: 'gdp-losses-benefits', redirectTo: 'https://climatedata.imf.org/pages/ngfs/#ngfs7', pathMatch: 'full' },
  { path: 'greenhouse-emissions', redirectTo: 'https://climatedata.imf.org/pages/greenhouse-gas-emissions#gg4', pathMatch: 'full' },
  { path: 'adaptation', redirectTo: 'https://climatedata.imf.org/pages/adaptation#ad1', pathMatch: 'full' },
  { path: 'climate-weather/surface-temperature', redirectTo: 'https://climatedata.imf.org/pages/climate-and-weather#cc1', pathMatch: 'full' },
  { path: 'climate-weather/mean-sea-levels', redirectTo: 'https://climatedata.imf.org/pages/climate-and-weather#cc3', pathMatch: 'full' },
  { path: 'mitigation/forest-carbon', redirectTo: 'https://climatedata.imf.org/pages/mitigation#mi6', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }