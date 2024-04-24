import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserSession } from '../../../model/userSession.model';
import { D3Service } from '../../../services/d3.service';
import { DataService } from '../../../services/data.service';
import { MatTableDataSource } from '@angular/material/table';
import { MonitoringSums } from '../../../model/monitoringSums.model';

@Component({
  selector: 'app-user-session',
  templateUrl: './user-session.component.html',
  styleUrl: './user-session.component.scss'
})

export class UserSessionComponent implements OnInit {
  private userSessionsLoaded = false;
  private userData: UserSession[] = [];
  private isDataLoaded = false;

  @ViewChild('chartContainer1') private chartContainer1!: ElementRef;
  @ViewChild('chartContainer2') private chartContainer2!: ElementRef;
  @ViewChild('chartContainer3') private chartContainer3!: ElementRef;
  @ViewChild('chartContainer4') private chartContainer4!: ElementRef;
  @ViewChild('chartContainer5') private chartContainer5!: ElementRef;
  @ViewChild('chartContainer6') private chartContainer6!: ElementRef;
  @ViewChild('chartContainer7') private chartContainer7!: ElementRef;
  @ViewChild('chartContainer8') private chartContainer8!: ElementRef;
  @ViewChild('chartContainer9') private chartContainer9!: ElementRef;

  uniqueUserCount = 0;
  userSessionDataSource = new MatTableDataSource<UserSession>();
  

  constructor(private dataService: DataService, private d3Service: D3Service) { }


  ngOnInit() {
    this.fetchUserSessions();
  }

  ngAfterViewInit() {
    this.setupCharts();
  }


  private fetchUserSessions() {
    this.dataService.getUserSession().subscribe({
      next: (data: UserSession[]) => {
        this.userSessionDataSource.data = data;
        this.userData = data;
        this.calculateUniqueUsers();
        this.userSessionsLoaded = true;
        this.checkDataLoaded();
      },
      error: (error: any) => {
        console.error('Error fetching user session data', error);
      }
    });
  }

  private checkDataLoaded() {
    if (this.userSessionsLoaded) {
      this.isDataLoaded = true;
      this.setupCharts();
    }
  }

  private setupCharts() {
    if (this.isDataLoaded) {
      this.createChart(this.chartContainer1, this.aggregateEndpointsAndBlueprints(this.userData), {
        title: 'Total Endpoints and Blueprints',
        xLabel: 'Category',
        yLabel: 'Total Count'
      });

      this.createChart(this.chartContainer2, this.aggregateMonitoringLevels(this.userData), {
        title: 'Monitoring Level Distribution',
        xLabel: 'Monitoring Level',
        yLabel: 'Count'
      });

      this.createChart(this.chartContainer5, this.calculateAverageMonitoringLevels(), {
        title: 'Average Monitoring Levels',
        xLabel: 'Monitoring Level',
        yLabel: 'Average Count'
      });

      this.createChart(this.chartContainer4, this.calculateAverageEndpointsAndBlueprints(), {
        title: 'Average Endpoints and Blueprints',
        xLabel: 'Category',
        yLabel: 'Average Count'
      });

      this.createChart(this.chartContainer7, this.aggregateUsageByWeekday(), {
        title: 'Weekly Usage',
        xLabel: 'Day of the Week',
        yLabel: 'Sessions Count',
        xField: 'day',
        yField: 'count'
      });

      this.createLineChart(this.chartContainer6, this.groupSessionsByDate(), {
        title: 'App Initializations Over Time',
        xLabel: 'Date',
        yLabel: 'Number of Sessions'
      });
      
    }
  }

  private createChart(container: ElementRef, data: any[], config: any) {
    this.d3Service.createBarChart(container.nativeElement, data, {
      width: config.width || 600,
      height: config.height || 400,
      title: config.title,
      xLabel: config.xLabel,
      yLabel: config.yLabel,
      xField: config.xField || 'category',
      yField: config.yField || 'value'
    });
  }

  private createLineChart(container: ElementRef, data: any[], config: any) {
    this.d3Service.createLineChart(container.nativeElement, data, {
      width: config.width || 600,
      height: config.height || 400,
      title: config.title,
      xLabel: config.xLabel,
      yLabel: config.yLabel
    });
  }



  private calculateUniqueUsers() {
    const uniqueFmdIds = new Set(this.userData.map(session => session.fmd_id));
    this.uniqueUserCount = uniqueFmdIds.size;
  }

  private aggregateMonitoringLevels(data: UserSession[]): any[] {
    let monitoringSums: MonitoringSums = {
      'Monitoring 0': 0,
      'Monitoring 1': 0,
      'Monitoring 2': 0,
      'Monitoring 3': 0
    };

    data.forEach(session => {
      monitoringSums['Monitoring 0'] += session.monitoring_0;
      monitoringSums['Monitoring 1'] += session.monitoring_1;
      monitoringSums['Monitoring 2'] += session.monitoring_2;
      monitoringSums['Monitoring 3'] += session.monitoring_3;
    });

    return Object.keys(monitoringSums).map(key => ({ category: key, value: monitoringSums[key] }));
  }

  private calculateAverageMonitoringLevels() {
    let monitoringSums: MonitoringSums = {
      'Monitoring 0': 0,
      'Monitoring 1': 0,
      'Monitoring 2': 0,
      'Monitoring 3': 0
    };
    let count = this.userData.length;

    if (count > 0) {
      this.userData.forEach(session => {
        monitoringSums['Monitoring 0'] += session.monitoring_0;
        monitoringSums['Monitoring 1'] += session.monitoring_1;
        monitoringSums['Monitoring 2'] += session.monitoring_2;
        monitoringSums['Monitoring 3'] += session.monitoring_3;
      });

      for (let level in monitoringSums) {
        monitoringSums[level] = parseFloat((monitoringSums[level] / count).toFixed(2));
      }
    }

    return Object.keys(monitoringSums).map(key => ({ category: key, value: monitoringSums[key] }));
  }


  private aggregateEndpointsAndBlueprints(data: UserSession[]): any[] {
    let totalEndpoints = 0;
    let totalBlueprints = 0;

    data.forEach(session => {
      totalEndpoints += session.endpoints;
      totalBlueprints += session.blueprints;
    });

    return [
      { category: 'Endpoints', value: totalEndpoints },
      { category: 'Blueprints', value: totalBlueprints }
    ];
  }

  private calculateAverageEndpointsAndBlueprints() {
    let averageEndpoints = 0;
    let averageBlueprints = 0;
    let count = this.userData.length;

    if (count > 0) {
      let totalEndpoints = 0;
      let totalBlueprints = 0;

      this.userData.forEach(session => {
        totalEndpoints += session.endpoints;
        totalBlueprints += session.blueprints;
      });

      averageEndpoints = parseFloat((totalEndpoints / count).toFixed(2));
      averageBlueprints = parseFloat((totalBlueprints / count).toFixed(2));
    }

    return [
      { category: 'Average Endpoints', value: averageEndpoints },
      { category: 'Average Blueprints', value: averageBlueprints }
    ];
  }

  private aggregateUsageByWeekday() {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let weekdayCounts: { [key: string]: number } = {};

    weekdays.forEach(day => { weekdayCounts[day] = 0; });

    this.userData.forEach(session => {
      // Extract the date string
      const dateString = this.extractDateString(session._created_at);

      if (dateString) {
        // Create the Date object using the extracted date string
        let dayOfWeek = new Date(dateString).getDay();
        let weekday = weekdays[dayOfWeek];
        weekdayCounts[weekday] += 1;
      }
    });

    return Object.keys(weekdayCounts).map(day => ({ day, count: weekdayCounts[day] }));
  }
  

  private groupSessionsByDate() {
    const sessionCountsByDate: { [key: string]: Set<string> } = {};

    this.userData.forEach(session => {
      const dateString = this.extractDateString(session._created_at);
      if (dateString) {
        const formattedDate = this.formatDate(dateString);
        sessionCountsByDate[formattedDate] = sessionCountsByDate[formattedDate] || new Set();
        sessionCountsByDate[formattedDate].add(session.fmd_id);
      }
    });

    return this.transformData(sessionCountsByDate);
  }

  private extractDateString(created_at: any): string | null {
    if (created_at && created_at.$date) {
      return created_at.$date;
    } else if (typeof created_at === 'string') {
      return created_at;
    }
    return null;
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : '';
  }

  private transformData(sessionCountsByDate: { [key: string]: Set<string> }): any[] {
    return Object.keys(sessionCountsByDate)
      .sort()
      .map(date => ({
        date,
        count: sessionCountsByDate[date].size
      }));
  }

  

}


