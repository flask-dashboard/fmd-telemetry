import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { D3Service } from '../../../services/d3.service';
import { DatabasePruning } from '../../../model/databasePruning.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-database-pruning',
  templateUrl: './database-pruning.component.html',
  styleUrl: './database-pruning.component.scss'
})
export class DatabasePruningComponent implements OnInit {
  @ViewChild('chartContainer1') private chartContainer1!: ElementRef;
  @ViewChild('chartContainer2') private chartContainer2!: ElementRef;
  @ViewChild('chartContainer3') private chartContainer3!: ElementRef;
  @ViewChild('chartContainer4') private chartContainer4!: ElementRef;
  @ViewChild('chartContainer5') private chartContainer5!: ElementRef;
  @ViewChild('chartContainer6') private chartContainer6!: ElementRef;
  @ViewChild('chartContainer7') private chartContainer7!: ElementRef;
  @ViewChild('chartContainer8') private chartContainer8!: ElementRef;
  @ViewChild('chartContainer9') private chartContainer9!: ElementRef;

  private databasePruningLoaded = false;
  private pruningData: DatabasePruning[] = [];
  private isDataLoaded = false;
  databasePruningDataSource = new MatTableDataSource<DatabasePruning>();



  constructor(private dataService: DataService, private d3Service: D3Service) { }
  
  ngOnInit() {
    this.fetchDatabasePruning();
  }

  ngAfterViewInit() {
    this.setupCharts();
  }

  private fetchDatabasePruning() {
    this.dataService.getDatabasePruning().subscribe({
      next: (data: DatabasePruning[]) => {
        this.databasePruningDataSource.data = data;
        this.pruningData = data;
        this.databasePruningLoaded = true;
        this.checkDataLoaded();
      },
      error: (error: any) => {
        console.error('Error fetching endpoints data', error);
      }
    });
  }

  private checkDataLoaded() {
    if (this.databasePruningLoaded) {
      this.isDataLoaded = true;
      this.setupCharts();
    }
  }

  private setupCharts() {
    if (this.isDataLoaded) {
      this.createChart(this.chartContainer1, this.calculateDeletedGraphUsersData(), {
        title: 'Delete Custom Graphs',
        xLabel: 'Category',
        yLabel: 'Count',
        xField: 'category',
        yField: 'count'
      });

      this.createChart(this.chartContainer2, this.aggregateAgeThresholds(), {
        title: 'Week Threshold Distribution',
        xLabel: 'Weeks',
        yLabel: 'Count',
        xField: 'week',
        yField: 'count'
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

  private calculateDeletedGraphUsersData() {
    const usersWithGraphDeletion = new Set();
    const usersWithoutGraphDeletion = new Set();
  
    this.pruningData.forEach(session => {
      if (session.delete_custom_graphs) {
        usersWithGraphDeletion.add(session.fmd_id);
      } else {
        usersWithoutGraphDeletion.add(session.fmd_id);
      }
    });
  
    return [
      { category: 'True', count: usersWithGraphDeletion.size },
      { category: 'False', count: usersWithoutGraphDeletion.size }
    ];
  }
  
  
  
  private aggregateAgeThresholds() {
    interface AgeThresholdCounts {
      [key: string]: number;
    }
  
    const ageThresholdCounts: AgeThresholdCounts = {};
    this.pruningData.forEach(session => {
      const weeks = session.age_threshold_weeks.toString();
      ageThresholdCounts[weeks] = (ageThresholdCounts[weeks] || 0) + 1;
    });
  
    const sortedAgeThresholds = Object.keys(ageThresholdCounts)
      .map(week => ({
        week: `Week ${week}`,
        count: ageThresholdCounts[week]
      }))
      .sort((a, b) => b.count - a.count) // Sort by count in descending order
      .slice(0, 10); // Take the top 10
  
    return sortedAgeThresholds;
  }
  

}
