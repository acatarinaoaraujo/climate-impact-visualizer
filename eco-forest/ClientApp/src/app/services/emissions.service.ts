import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class EmissionsDataService implements DataService {
  private apiUrl = 'api/emissions/aggregated';

  constructor(private http: HttpClient) {}

  getAggregatedData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
