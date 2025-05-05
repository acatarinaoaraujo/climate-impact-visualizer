import { Observable } from 'rxjs';

export interface DataService {
  getAggregatedData(): Observable<any>;
}
