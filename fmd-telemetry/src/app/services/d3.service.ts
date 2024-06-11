import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { color } from 'd3';

interface SessionData {
  date: Date;
  count: number;
}


@Injectable({
  providedIn: 'root'
})


export class D3Service {



  constructor() { }



  createBarChart(element: any, data: any[], config: any): void {
    // Define dimensions and margins for the chart
    const margin = { top: 60, right: 10, bottom: 100, left: 70 };
    const width = (config.width || 500) - margin.left - margin.right;
    const height = (config.height || 300) - margin.top - margin.bottom;
    const maxBarWidth = config.maxBarWidth || 40; // Maximum bar width
  
    // Clear any existing SVG to avoid overlapping charts
    d3.select(element).select('svg').remove();
  
    // Create an SVG container
    const svg = d3.select(element).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    // Set up the X scale
    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);
    x.domain(data.map(d => d[config.xField]));
  
    // Set up the Y scale using config.yField
    const y = d3.scaleLinear()
      .range([height, 0]);
    y.domain([0, d3.max(data, d => d[config.yField])]);
  
    const xAxisGroup = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));
  
    // Rotate X-axis labels
    xAxisGroup.selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)')
      .style('font-size', '12px'); // Increase font size
  
    // X-axis label (if provided)
    if (config.xLabel) {
      xAxisGroup.append('text')
        .attr('y', margin.bottom - 10)
        .attr('x', width / 2)
        .attr('text-anchor', 'middle')
        .style('fill', 'black')
        .style('font-size', '12px') // Increase font size
        .text(config.xLabel);
    }
  
    // Add the Y Axis
    const yAxisGroup = svg.append('g')
      .call(d3.axisLeft(y));
  
    // Y-axis label (if provided)
    if (config.yLabel) {
      yAxisGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 15 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .attr('text-anchor', 'middle')
        .style('fill', 'black')
        .style('font-size', '12px') // Increase font size
        .text(config.yLabel);
    }
  
    // Create the bars with color
    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => {
        const xPos = x(d[config.xField]) ?? 0;
        const barWidth = Math.min(x.bandwidth(), maxBarWidth);
        return xPos + (x.bandwidth() - barWidth) / 2; // Center the bars
      })
      .attr('width', d => Math.min(x.bandwidth(), maxBarWidth)) // Set max width for bars
      .attr('y', d => y(d[config.yField]) ?? 0)
      .attr('height', d => height - (y(d[config.yField]) ?? 0))
      .attr('fill', (d, i) => color(i.toString())?.toString() ?? 'green');
  
    // Update text labels to use config.xField and config.yField
    svg.selectAll('.bar-text')
      .data(data)
      .enter().append('text')
      .attr('class', 'bar-text')
      .attr('text-anchor', 'middle')
      .attr('x', d => {
        const xPos = x(d[config.xField]) ?? 0;
        const barWidth = Math.min(x.bandwidth(), maxBarWidth);
        return xPos + (x.bandwidth() - barWidth) / 2 + barWidth / 2; // Center the text on the bars
      })
      .attr('y', d => y(d[config.yField]) - 5)
      .text(d => d[config.yField])
      .style('fill', 'black')
      .style('font-size', '12px'); // Increase font size
  
    // Append a title (if provided)
    if (config.title) {
      svg.append('text')
        .attr('x', (width / 2))
        .attr('y', 0 - (margin.top / 2))
        .attr('text-anchor', 'middle')
        .style('font-size', '20px') // Increase font size
        .style('text-decoration', 'underline')
        .text(config.title);
    }
  }
  


  createLineChart(element: any, data: any[], config: any): void {
    // Define dimensions and margins for the chart
    const margin = { top: 60, right: 20, bottom: 80, left: 60 };
    const width = (config.width || 500) - margin.left - margin.right;
    const height = (config.height || 300) - margin.top - margin.bottom;
  
    // Clear any existing SVG to avoid overlapping charts
    d3.select(element).select('svg').remove();
  
    // Create an SVG container
    const svg = d3.select(element).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  
    // Parse dates and sort data
    const parseDate = d3.timeParse('%Y-%m-%d');
    data.forEach(d => d.date = parseDate(d.date));
    data.sort((a, b) => a.date - b.date);
  
    // Set up the X scale
    const x = d3.scaleTime()
      .range([0, width])
      .domain(d3.extent(data, (d: SessionData) => d.date) as [Date, Date]);
  
    // Set up the Y scale
    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, d => d.count)]);
  
    // Add the X Axis with rotated labels and reduced number of ticks
    const xAxisGroup = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(d3.timeMonth.every(1))); // Adjust ticks as needed
  
    // Rotate X-axis labels
    xAxisGroup.selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)'); // Rotate labels by -45 degrees
  
    // X-axis label (if provided)
    if (config.xLabel) {
      xAxisGroup.append('text')
        .attr('y', margin.bottom - 10)
        .attr('x', width / 2)
        .attr('text-anchor', 'middle')
        .style('fill', 'black')
        .text(config.xLabel);
    }
  
    // Add the Y Axis
    const yAxisGroup = svg.append('g')
      .call(d3.axisLeft(y));
  
    // Y-axis label (if provided)
    if (config.yLabel) {
      yAxisGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 15 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .attr('text-anchor', 'middle')
        .style('fill', 'black')
        .text(config.yLabel);
    }
  
    // Define the line
    const valueline = d3.line<SessionData>()
      .x(d => x(d.date))
      .y(d => y(d.count));
  
    // Add the valueline path
    svg.append('path')
      .data([data])
      .attr('class', 'line')
      .attr('d', valueline)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2);
  
    // Append a title (if provided)
    if (config.title) {
      svg.append('text')
        .attr('x', (width / 2))
        .attr('y', 0 - (margin.top / 2))
        .attr('text-anchor', 'middle')
        .style('font-size', '20px')
        .style('text-decoration', 'underline')
        .text(config.title);
    }
  }
  
}
