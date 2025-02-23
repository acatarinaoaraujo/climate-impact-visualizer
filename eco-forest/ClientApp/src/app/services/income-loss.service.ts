import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IncomeLossDataService {
  private apiUrl = '/api/incomeloss/aggregated';

  constructor(private http: HttpClient) {}

  getAggregatedData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
