import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { UserSession } from '../../model/userSession.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Endpoints } from '../../model/endpoints.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  userSessionDisplayedColumns: string[] = ['_id', '_created_at', '_updated_at', 'fmd_id', 'session', 'endpoints', 'blueprints', 'monitoring_0', 'monitoring_1', 'monitoring_2', 'monitoring_3', 'time_initialized'];
  userSessionDataSource = new MatTableDataSource<UserSession>();

  endpointsDisplayedColumns: string[] = ['_id', '_created_at', '_updated_at', 'name', 'fmd_id', 'session'];
  endpointsDataSource = new MatTableDataSource<Endpoints>();
  @ViewChild('sortUserSession') sortUserSession?: MatSort;
  @ViewChild('sortEndpoints') sortEndpoints?: MatSort;

  activeUserSessionFilters: { [key: string]: string } = {};
  activeEndpointsFilters: { [key: string]: string } = {};

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadData();

    this.userSessionDataSource.filterPredicate = (data: UserSession, filter: string) => {
      for (const key in this.activeUserSessionFilters) {
        if (this.activeUserSessionFilters[key]) {
          const searchValue = data[key as keyof UserSession]?.toString().toLowerCase() || '';
          if (!searchValue.includes(this.activeUserSessionFilters[key])) {
            return false;
          }
        }
      }
      return true;
    };

    this.endpointsDataSource.filterPredicate = (data: Endpoints, filter: string) => {
      for (const key in this.activeEndpointsFilters) {
        if (this.activeEndpointsFilters[key]) {
          let searchValue = data[key as keyof Endpoints]?.toString().toLowerCase() || '';
          
          if (key === '_created_at' || key === '_updated_at') {
            searchValue = this.convertDateToDisplayFormat(searchValue);
          }
    
          if (!searchValue.includes(this.activeEndpointsFilters[key])) {
            return false;
          }
        }
      }
      return true;
    };
  }


  ngAfterViewInit() {
    if (this.sortUserSession) {
      this.userSessionDataSource.sort = this.sortUserSession;
    }
    if (this.sortEndpoints) {
      this.endpointsDataSource.sort = this.sortEndpoints;
    }
  }

  loadData() {
    this.dataService.getUserSession().subscribe(data => {
      this.userSessionDataSource.data = data;
    });

    this.dataService.getEndpoints().subscribe(data => {
      this.endpointsDataSource.data = data;
    });
  }

  applyUserSessionFilter(event: Event, column: string) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.activeUserSessionFilters[column] = filterValue;
    this.triggerFilterUpdate(this.userSessionDataSource, this.activeUserSessionFilters);
  }

  applyEndpointsFilter(event: Event, column: string) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.activeEndpointsFilters[column] = filterValue;
    this.triggerFilterUpdate(this.endpointsDataSource, this.activeEndpointsFilters);
  }

  triggerFilterUpdate<T>(dataSource: MatTableDataSource<T>, activeFilters: { [key: string]: string }) {
    dataSource.filterPredicate = (data: T, filter: string) => {
      for (const key in activeFilters) {
        if (activeFilters[key]) {
          const searchValue = data[key as keyof T]?.toString().toLowerCase() || '';
          if (!searchValue.includes(activeFilters[key])) {
            return false;
          }
        }
      }
      return true;
    };
    dataSource.filter = '';
    dataSource.filter = 'update';
  }


  convertDateToDisplayFormat(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr;
  }
  

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
  



}
