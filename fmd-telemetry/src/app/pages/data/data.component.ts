import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { UserSession } from '../../model/userSession.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Endpoints } from '../../model/endpoints.model';
import { DatabasePruning } from '../../model/databasePruning.model';
import { FollowUp } from '../../model/followUp.model';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  userSessionDisplayedColumns: string[] = ['objectId', 'createdAt', 'fmd_id', 'session', 'endpoints', 'blueprints', 'monitoring_0', 'monitoring_1', 'monitoring_2', 'monitoring_3', 'dashboard_version', 'python_version', 'time_initialized'];
  databasePruningDisplayedColumns: string[] = ['objectId', 'createdAt', 'fmd_id', 'session', 'age_threshold_weeks', 'delete_custom_graphs'];
  endpointsDisplayedColumns: string[] = ['objectId', 'createdAt', 'name', 'fmd_id', 'session'];
  followUpDisplayedColumns: string[] = ['objectId', 'createdAt', 'feedback'];

  userSessionDataSource = new MatTableDataSource<UserSession>();
  endpointsDataSource = new MatTableDataSource<Endpoints>();
  databasePruningDataSource = new MatTableDataSource<DatabasePruning>();
  followUpDataSource = new MatTableDataSource<FollowUp>();
  
  @ViewChild('sortUserSession') sortUserSession?: MatSort;
  @ViewChild('sortEndpoints') sortEndpoints?: MatSort;
  @ViewChild('sortDatabasePruning') sortDatabasePruning?: MatSort;
  @ViewChild('sortFollowUp') sortFollowUp?: MatSort;

  activeUserSessionFilters: { [key: string]: string } = {};
  activeEndpointsFilters: { [key: string]: string } = {};
  activeDatabasePruningFilters: { [key: string]: string } = {};
  activeFollowUpFilters: { [key: string]: string } = {};


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
          if (!searchValue.includes(this.activeEndpointsFilters[key])) {
            return false;
          }
        }
      }
      return true;
    };

    this.databasePruningDataSource.filterPredicate = (data: DatabasePruning, filter: string) => {
      for (const key in this.activeDatabasePruningFilters) {
        if (this.activeDatabasePruningFilters[key]) {
          let searchValue = data[key as keyof DatabasePruning]?.toString().toLowerCase() || '';
          if (!searchValue.includes(this.activeDatabasePruningFilters[key])) {
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

    if (this.sortDatabasePruning) {
      this.databasePruningDataSource.sort = this.sortDatabasePruning;
    }

    if (this.sortFollowUp) {
      this.followUpDataSource.sort = this.sortFollowUp;
    }
  }

  loadData() {
    this.dataService.getUserSession().subscribe(data => {
      this.userSessionDataSource.data = data;
    });

    this.dataService.getEndpoints().subscribe(data => {
      this.endpointsDataSource.data = data;
    });

    this.dataService.getDatabasePruning().subscribe(data => {
      this.databasePruningDataSource.data = data;
    });

    this.dataService.getFollowUp().subscribe(data => {
      this.followUpDataSource.data = data;
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

  applyDatabasePruningFilter(event: Event, column: string) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.activeDatabasePruningFilters[column] = filterValue;
    this.triggerFilterUpdate(this.databasePruningDataSource, this.activeDatabasePruningFilters);
  }

  applyFollowUpFilter(event: Event, column: string) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.activeFollowUpFilters[column] = filterValue;
    this.triggerFilterUpdate(this.followUpDataSource, this.activeFollowUpFilters);
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

  

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
  



}
