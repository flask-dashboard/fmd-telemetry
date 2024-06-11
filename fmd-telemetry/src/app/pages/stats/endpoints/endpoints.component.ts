import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { D3Service } from '../../../services/d3.service';
import { DataService } from '../../../services/data.service';
import { Endpoints } from '../../../model/endpoints.model';
import { MatTableDataSource } from '@angular/material/table';
import { EndpointCounts } from '../../../model/endpointCounts.model';

@Component({
  selector: 'app-endpoints',
  templateUrl: './endpoints.component.html',
  styleUrl: './endpoints.component.scss'
})
export class EndpointsComponent implements OnInit {
  @ViewChild('chartContainer1') private chartContainer1!: ElementRef;
  @ViewChild('chartContainer2') private chartContainer2!: ElementRef;
  @ViewChild('chartContainer3') private chartContainer3!: ElementRef;
  @ViewChild('chartContainer4') private chartContainer4!: ElementRef;
  @ViewChild('chartContainer5') private chartContainer5!: ElementRef;
  @ViewChild('chartContainer6') private chartContainer6!: ElementRef;
  @ViewChild('chartContainer7') private chartContainer7!: ElementRef;
  @ViewChild('chartContainer8') private chartContainer8!: ElementRef;
  @ViewChild('chartContainer9') private chartContainer9!: ElementRef;

  private endpointsLoaded = false;
  private endpointData: Endpoints[] = [];
  private isDataLoaded = false;
  private endpointVisitCounts: Array<{ category: string; value: number }> = [];
  endpointsDataSource = new MatTableDataSource<Endpoints>();



  constructor(private dataService: DataService, private d3Service: D3Service) { }

  ngOnInit() {
    this.fetchEndpoints();
  }

  ngAfterViewInit() {
    this.setupCharts();
  }

  private fetchEndpoints() {
    this.dataService.getEndpoints().subscribe({
      next: (data: Endpoints[]) => {
        this.endpointsDataSource.data = data;
        this.endpointData = data;
        this.endpointsLoaded = true;
        this.checkDataLoaded();
      },
      error: (error: any) => {
        console.error('Error fetching endpoints data', error);
      }
    });
  }

  private checkDataLoaded() {
    if (this.endpointsLoaded) {
      this.isDataLoaded = true;
      this.setupCharts();
    }
  }

  private setupCharts() {
    if (this.isDataLoaded) {
      this.createChart(this.chartContainer1, this.processEndpointVisitsData(this.endpointData), {
        title: 'Route Visits',
        xLabel: 'Routes',
        yLabel: 'Visit Count'
      });
      this.createChart(this.chartContainer2, this.processEndpointStarVisitsData(this.endpointData), {
        title: 'Route Visits for endpoint/*/ ',
        xLabel: 'Routes',
        yLabel: 'Visit Count'
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

  private processEndpointVisitsData(data: Endpoints[]): Array<{ category: string; value: number }> {

    const excludedEndpoints = ['users', 'deploy_details', 'deploy_config', 'endpoint_info', 'endpoints_hits', 'profiled_table'];
  
    const visitCounts = data
      .filter(endpoint => {
        // Exclude specific endpoints and those that match the pattern 'endpoint_info/*' or 'profiled_table/*' where '*' is a number
        return !excludedEndpoints.includes(endpoint.name) &&
               !/^endpoint_info\/\d+$/.test(endpoint.name) &&
               !/^profiled_table\/\d+$/.test(endpoint.name);
      })
      .reduce((acc: EndpointCounts, endpoint) => {
        // Replace digits and the word "None" with '*'
        const normalizedEndpoint = endpoint.name.replace(/\d+|None/g, '*');
        acc[normalizedEndpoint] = (acc[normalizedEndpoint] || 0) + 1;
        return acc;
      }, {} as EndpointCounts);
  
    // Convert to array, sort by value in descending order, and take the top 10
    return Object.keys(visitCounts)
      .map(key => ({ category: key, value: visitCounts[key] }))
      .sort((a, b) => b.value - a.value) // Sort in descending order of value
      .slice(0, 10);
  }
  


  private processEndpointStarVisitsData(data: Endpoints[]): Array<{ category: string; value: number }> {
    const endpointPatterns = ['hourly_load', 'version_user', 'version_ip', 'endpoint_versions', 'endpoint_users', 'num_profiled', 'grouped_profiler', 'num_outliers', 'endpoint_status_code_summary'];
    let visitCounts: EndpointCounts = {};
  
    // Define displayNameMapping with an index signature
    const displayNameMapping: { [key: string]: string } = {
      'hourly_load': 'hourly_load',
      'version_user': 'version_user',
      'version_ip': 'version_ip',
      'endpoint_versions': 'versions',
      'endpoint_users': 'users',
      'num_profiled': 'profiler',
      'grouped_profiler': 'grouped-profiler',
      'num_outliers': 'outliers',
      'endpoint_status_code_summary': 'status_code_distribution'
    };
  
    data.forEach(endpoint => {
      const matchedPattern = endpointPatterns.find(pattern =>
        endpoint.name.startsWith(pattern) || endpoint.name.startsWith(pattern + "/")
      );
      if (matchedPattern) {
        visitCounts[matchedPattern] = (visitCounts[matchedPattern] || 0) + 1; 
      }
    });
  
    // Convert to array, replace category names, sort by value, and take the top 10
    return Object.keys(visitCounts)
      .map(key => ({
        category: displayNameMapping[key] || key, // Replace with display name or use key as is
        value: visitCounts[key]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }
}
