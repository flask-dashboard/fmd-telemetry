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

  dashboardVersions: string[] = [];

  @ViewChild('chartContainer1') private chartContainer1!: ElementRef;
  @ViewChild('chartContainer2') private chartContainer2!: ElementRef;
  @ViewChild('chartContainer3') private chartContainer3!: ElementRef;
  @ViewChild('chartContainer4') private chartContainer4!: ElementRef;
  @ViewChild('chartContainer5') private chartContainer5!: ElementRef;
  @ViewChild('chartContainer6') private chartContainer6!: ElementRef;
  @ViewChild('chartContainer7') private chartContainer7!: ElementRef;
  @ViewChild('chartContainer8') private chartContainer8!: ElementRef;
  @ViewChild('chartContainer9') private chartContainer9!: ElementRef;
  @ViewChild('chartContainer10') private chartContainer10!: ElementRef;
  @ViewChild('chartContainer11') private chartContainer11!: ElementRef;

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
        this.dashboardVersions = this.extractUniqueVersions(data);
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

  private extractUniqueVersions(data: UserSession[]): string[] {
    const versions = new Set<string>();
    data.forEach(session => {
      if (session.dashboard_version) {
        versions.add(session.dashboard_version);
      }
    });

    const versionList = Array.from(versions).sort();
    versionList.unshift("All Versions");

    return versionList;
  }

  onVersionChange(event: any) {
    const selectedVersion = event.target.value;

    if (selectedVersion === "All Versions") {
      this.userSessionDataSource.data = this.userData; // Show all data
      this.setupCharts(this.userData); // Update charts with all data
    } else {
      const filteredData = this.filterDataByDashboardVersion(this.userData, selectedVersion);
      this.userSessionDataSource.data = filteredData;
      this.setupCharts(filteredData);
    }
  }

  private filterDataByDashboardVersion(data: UserSession[], version: string): UserSession[] {
    return data.filter(session => session.dashboard_version === version);
  }

  private setupCharts(data: UserSession[] = this.userData) {
    if (this.isDataLoaded) {
      this.createChart(this.chartContainer1, this.aggregateEndpointsAndBlueprints(data), {
        title: 'Total Endpoints and Blueprints',
        xLabel: 'Category',
        yLabel: 'Total Count'
      });

      this.createChart(this.chartContainer2, this.aggregateMonitoringLevels(data), {
        title: 'Monitoring Level Distribution',
        xLabel: 'Monitoring Level',
        yLabel: 'Count'
      });

      this.createChart(this.chartContainer5, this.calculateAverageMonitoringLevels(data), {
        title: 'Average Monitoring Levels',
        xLabel: 'Monitoring Level',
        yLabel: 'Average Count'
      });

      this.createChart(this.chartContainer4, this.aggregateEndpointsAndBlueprints(data), {
        title: 'Average Endpoints and Blueprints',
        xLabel: 'Category',
        yLabel: 'Average Count'
      });

      this.createChart(this.chartContainer7, this.aggregateUsageByWeekday(data), {
        title: 'Weekly Usage',
        xLabel: 'Day of the Week',
        yLabel: 'Sessions Count',
        xField: 'day',
        yField: 'count'
      });

      this.createLineChart(this.chartContainer6, this.groupSessionsByDate(data), {
        title: 'App Initializations Over Time',
        xLabel: 'Date',
        yLabel: 'Number of Sessions'
      });

      this.createChart(this.chartContainer10, this.getTop10Versions(data), {
        title: 'Top 10 Dashboard Versions',
        xLabel: 'Version',
        yLabel: 'Count'
      });

      this.createChart(this.chartContainer11, this.getTop10PythonVersions(data), {
        title: 'Top 10 Python Versions',
        xLabel: 'Python Version',
        yField: 'value'
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

  private calculateAverageMonitoringLevels(data: UserSession[]): any[] {
    let monitoringSums: MonitoringSums = {
      'Monitoring 0': 0,
      'Monitoring 1': 0,
      'Monitoring 2': 0,
      'Monitoring 3': 0
    };
    const count = data.length;

    if (count > 0) {
      data.forEach(session => {
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

  private aggregateUsageByWeekday(data: UserSession[]): any[] {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekdayCounts: { [key: string]: number } = {};

    weekdays.forEach(day => { weekdayCounts[day] = 0; });

    data.forEach(session => {
      const dateString = this.extractDateString(session.createdAt);

      if (dateString) {
        const dayOfWeek = new Date(dateString).getDay();
        const weekday = weekdays[dayOfWeek];
        weekdayCounts[weekday] += 1;
      }
    });

    return Object.keys(weekdayCounts).map(day => ({ day, count: weekdayCounts[day] }));
  }

  private groupSessionsByDate(data: UserSession[]): any[] {
    const sessionCountsByDate: { [key: string]: Set<string> } = {};

    data.forEach(session => {
      const dateString = this.extractDateString(session.createdAt);
      if (dateString) {
        const formattedDate = this.formatDate(dateString);
        sessionCountsByDate[formattedDate] = sessionCountsByDate[formattedDate] || new Set();
        sessionCountsByDate[formattedDate].add(session.fmd_id);
      }
    });

    return this.transformData(sessionCountsByDate);
  }

  private getTop10Versions(data: UserSession[]): any[] {
    // Map to store the latest session for each fmd_id
    const latestSessions: { [key: string]: UserSession } = {};

    data.forEach(session => {
      const fmdId = session.fmd_id;

      const createdAtDateObj = session.createdAt?.$date;
      const createdAt = new Date(createdAtDateObj);

      // Check if this session is the latest for this fmd_id
      if (!latestSessions[fmdId] || createdAt > new Date(latestSessions[fmdId].createdAt.$date)) {
        latestSessions[fmdId] = session;
      }
    });

    // Count the occurrences of each version
    const versionCounts: { [key: string]: number } = {};

    Object.values(latestSessions).forEach(session => {
      const version = session.dashboard_version || "<3.3.2";
      versionCounts[version] = versionCounts[version] || 0;
      versionCounts[version] += 1;
    });

    // Convert to an array and sort by count
    const sortedVersions = Object.entries(versionCounts)
      .map(([version, count]) => ({ version, count }))
      .sort((a, b) => b.count - a.count);

    // Limit to top 10
    return sortedVersions.slice(0, 10).map(item => ({ category: item.version, value: item.count }));
}

private getTop10PythonVersions(data: UserSession[]): any[] {
  // Create a map to store the latest session for each fmd_id
  const latestSessions: { [key: string]: UserSession } = {};

  // Iterate over the sessions to find the latest session for each fmd_id
  data.forEach(session => {
    const fmdId = session.fmd_id;

    // Check if the current session is the latest for this fmd_id
    if (!latestSessions[fmdId] || new Date(session.createdAt.$date) > new Date(latestSessions[fmdId].createdAt.$date)) {
      latestSessions[fmdId] = session;
    }
  });

  // Count the occurrences of each Python version in the latest sessions
  const pythonVersionCounts: { [key: string]: number } = {};
  Object.values(latestSessions).forEach(session => {
    const fullVersion = session.python_version || "Version unavailable";
    const shortVersion = fullVersion.match(/\d+\.\d+\.\d+/)?.[0] || "Version unavailable"; // Extracts version number
    pythonVersionCounts[shortVersion] = (pythonVersionCounts[shortVersion] || 0) + 1;
  });

  // Sort the Python versions by count and limit to top 10
  const sortedPythonVersions = Object.entries(pythonVersionCounts)
    .map(([pythonVersion, count]) => ({ pythonVersion, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Return the top 10 Python versions
  return sortedPythonVersions.map(item => ({ category: item.pythonVersion, value: item.count }));
}


  private transformData(sessionCountsByDate: { [key: string]: Set<string> }): any[] {
    return Object.keys(sessionCountsByDate)
      .sort()
      .map(date => ({
        date,
        count: sessionCountsByDate[date].size
      }));
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


}


