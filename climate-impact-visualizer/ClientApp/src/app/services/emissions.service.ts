import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class EmissionsDataService implements DataService {
  private apiUrl = `${environment.apiBaseUrl}/emissions/aggregated`;

  constructor(private http: HttpClient) {}

  getAggregatedData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
