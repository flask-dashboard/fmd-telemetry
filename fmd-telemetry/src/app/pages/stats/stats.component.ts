import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { D3Service } from '../../services/d3.service';
import { MatTableDataSource } from '@angular/material/table';
import { Endpoints } from '../../model/endpoints.model';
import { UserSession } from '../../model/userSession.model';


interface MonitoringSums {
  'Monitoring 0': number;
  'Monitoring 1': number;
  'Monitoring 2': number;
  'Monitoring 3': number;
  [key: string]: number;
}

interface EndpointCounts {
  [key: string]: number;
}


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent implements OnInit {
  // stats.component.ts
  @ViewChild('chartContainer1') private chartContainer1!: ElementRef;
  @ViewChild('chartContainer2') private chartContainer2!: ElementRef;
  @ViewChild('chartContainer3') private chartContainer3!: ElementRef;
  @ViewChild('chartContainer4') private chartContainer4!: ElementRef;
  @ViewChild('chartContainer5') private chartContainer5!: ElementRef;
  @ViewChild('chartContainer6') private chartContainer6!: ElementRef;
  // Define more if needed

  private isDataLoaded = false;
  private userData: UserSession[] = [];
  private endpointData: Endpoints[] = [];
  private endpointVisitCounts: { category: string; value: number; }[] = [];

  uniqueUserCount: number = 0;



  constructor(private dataService: DataService, private d3Service: D3Service) { }
  userSessionDataSource = new MatTableDataSource<UserSession>();
  endpointsDataSource = new MatTableDataSource<Endpoints>();

  ngOnInit() {
    this.fetchUserSessions();
    this.fetchEndpoints();
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
        this.isDataLoaded = true;
      },
      error: (error: any) => {
        console.error('Error fetching user session data', error);
      }
    });
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
  
      this.createChart(this.chartContainer3, this.endpointVisitCounts, {
        title: 'Route Visits',
        xLabel: 'Routes',
        yLabel: 'Visit Count'
      });
  
      this.createChart(this.chartContainer4, this.calculateAverageEndpointsAndBlueprints(), {
        title: 'Average Endpoints and Blueprints',
        xLabel: 'Category',
        yLabel: 'Average Count'
      });
  
      this.createLineChart(this.chartContainer6, this.groupSessionsByDate(), {
        title: 'Session Frequency Over Time',
        xLabel: 'Date',
        yLabel: 'Number of Sessions'
      });
    }
  }
  

  private fetchEndpoints() {
    this.dataService.getEndpoints().subscribe({
      next: (data: Endpoints[]) => {
        this.processEndpointVisitsData(data);
        if (this.isDataLoaded) {
          this.createChart(this.chartContainer3, this.endpointData, {
            width: 600,
            height: 400,
            title: 'Endpoint Visits',
            yLabel: 'Visits Count'
          });
        }
      },
      error: (error: any) => {
        console.error('Error fetching endpoints data', error);
      }
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



  private createChart(container: ElementRef, data: any[], config: any) {
    this.d3Service.createBarChart(container.nativeElement, data, {
      width: config.width || 600,
      height: config.height || 400,
      title: config.title,
      xLabel: config.xLabel,
      yLabel: config.yLabel
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




  private processEndpointVisitsData(data: Endpoints[]) {
    const visitCounts = data.reduce((acc: EndpointCounts, endpoint) => {
      // Replace digits and the word "None" with '*'w
      const normalizedEndpoint = endpoint.name.replace(/\d+|None/g, '*');
      acc[normalizedEndpoint] = (acc[normalizedEndpoint] || 0) + 1;
      return acc;
    }, {} as EndpointCounts);

    // Convert to array, sort by value in descending order, and take the top 10
    this.endpointVisitCounts = Object.keys(visitCounts)
      .map(key => ({ category: key, value: visitCounts[key] }))
      .sort((a, b) => b.value - a.value) // Sort in descending order of value
      .slice(0, 10);
  }


  private groupSessionsByDate() {
    const sessionCountsByDate: { [key: string]: number } = {};
    const processedFmdIds = new Set<string>();
  
    this.userData.forEach(session => {
      if (session.createdAt && !processedFmdIds.has(session.fmd_id)) {
        processedFmdIds.add(session.fmd_id);
        const date = new Date(session.createdAt);
        if (!isNaN(date.getTime())) {
          const formattedDate = date.toLocaleDateString('en-CA');
          if (sessionCountsByDate[formattedDate]) {
            sessionCountsByDate[formattedDate] += session.session;
          } else {
            sessionCountsByDate[formattedDate] = session.session;
          }
        }
      }
    });
  
    // Convert to array and sort by date
    const transformedData = Object.keys(sessionCountsByDate)
      .sort()
      .map(date => ({
        date: date, // Use the formatted date string directly
        count: sessionCountsByDate[date]
      }));
    return transformedData;
  }
  
  



}