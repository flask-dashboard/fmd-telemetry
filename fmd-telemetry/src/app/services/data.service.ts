import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSession } from '../model/userSession.model';
import { Endpoints } from '../model/endpoints.model';
import { DatabasePruning } from '../model/DatabasePruning.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }

  getUserSession(): Observable<UserSession[]> {
    return this.http.get<UserSession[]>('assets/UserSession.json');
  }

  getEndpoints(): Observable<Endpoints[]> {
    return this.http.get<Endpoints[]>('assets/Endpoints.json');
  }

  getDatabasePruning(): Observable<DatabasePruning[]> {
    return this.http.get<DatabasePruning[]>('assets/DatabasePruning.json');
  }
}
