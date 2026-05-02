import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GetProjectsDTO } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private base = environment.baseUrl + '/Projects';

  constructor(private http: HttpClient) {}

  getAll(): Observable<GetProjectsDTO[]> {
    return this.http.get<GetProjectsDTO[]>(this.base);
  }

  getById(id: number): Observable<GetProjectsDTO> {
    return this.http.get<GetProjectsDTO>(`${this.base}/${id}`);
  }

}
