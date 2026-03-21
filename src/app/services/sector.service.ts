import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sector } from '../models/sector.model';

@Injectable({ providedIn: 'root' })
export class SectorService {
  private base = environment.baseUrl + '/Sector';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sector[]> {
    console.log('Fetching sectors from', this.base);
    return this.http.get<Sector[]>(this.base);
  }

  getById(id: number): Observable<Sector> {
    return this.http.get<Sector>(`${this.base}/${id}`);
  }

}
