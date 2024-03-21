import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserSession } from '../model/userSession.model'; 
import { Endpoints } from '../model/endpoints.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private userSessions: UserSession[] = []; // Initial empty array
  private endpoints: Endpoints[] = []; // Initial empty array
  
  constructor() { }

  updateUserSessions(data: UserSession[]) {
    this.userSessions = data;
  }

  updateEndpoints(data: Endpoints[]) {
    this.endpoints = data;
  }

  getUserSession(): Observable<UserSession[]> {
    return of(this.userSessions);
  }

  getEndpoints(): Observable<Endpoints[]> {
    return of(this.endpoints);
  }
}
