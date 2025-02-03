import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RenewableEnergyDataModel {
  country: string;
  technology: string;
  unit: string;
  yearlyData: { [year: string]: number };
}

@Injectable({
  providedIn: 'root',
})
export class RenewableEnergyDataService {
  private apiUrl = '/api/renewableenergy';

  constructor(private http: HttpClient) {}

  getData(): Observable<RenewableEnergyDataModel[]> {
    return this.http.get<RenewableEnergyDataModel[]>(this.apiUrl);
  }
}
