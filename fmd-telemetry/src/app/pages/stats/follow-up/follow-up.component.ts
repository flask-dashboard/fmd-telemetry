import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { D3Service } from '../../../services/d3.service';
import { FollowUp } from '../../../model/followUp.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-follow-up',
  templateUrl: './follow-up.component.html',
  styleUrl: './follow-up.component.scss'
})
export class FollowUpComponent implements OnInit {

  private FollowUpLoaded = false;
  private userData: FollowUp[] = [];
  private isDataLoaded = false;

  followUpDataSource = new MatTableDataSource<FollowUp>();

  @ViewChild('chartContainer1') private chartContainer1!: ElementRef;

  
  constructor(private dataService: DataService, private d3Service: D3Service) { }


  ngOnInit() {
    this.fetchFollowUp();
  }

  ngAfterViewInit() {
    this.setupCharts();
  }

  private fetchFollowUp() {
    this.dataService.getFollowUp().subscribe({
      next: (data: FollowUp[]) => {
        this.followUpDataSource.data = data;
        this.userData = data;
        this.FollowUpLoaded = true;
        this.checkDataLoaded();
      },
      error: (error: any) => {
        console.error('Error fetching user session data', error);
      }
    });
  }

  private checkDataLoaded() {
    if (this.FollowUpLoaded) {
      this.isDataLoaded = true;
      this.setupCharts();
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

  private setupCharts() {
    if (this.isDataLoaded) {
      const aggregatedData = this.aggregateFeedbackKeys(this.userData);
      this.createChart(this.chartContainer1, aggregatedData, {
        title: 'Feedback Key Distribution',
        xLabel: 'Feedback Key',
        yLabel: 'Count',
        xField: 'key',
        yField: 'value'
      });
    }
  }
  
  private aggregateFeedbackKeys(followUps: FollowUp[]): any[] {
    const feedbackCounts = new Map<string, number>();
    followUps.forEach(followUp => {
      followUp.feedback.forEach(item => {
        feedbackCounts.set(item.key, (feedbackCounts.get(item.key) || 0) + 1);
      });
    });
    const result = Array.from(feedbackCounts, ([key, value]) => ({ key, value }));
    return result;
  }
  


}
