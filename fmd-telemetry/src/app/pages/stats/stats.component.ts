import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { D3Service } from '../../services/d3.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss',
})
export class StatsComponent {
  constructor(private dataService: DataService, private d3Service: D3Service) { }

}