import React, { useEffect, useRef } from 'react';
import type { HistoricalDataPoint } from '../../types';

interface TeamPerformanceGraphProps {
  historicalData: HistoricalDataPoint[];
}


function TeamPerformanceGraph({ historicalData }: TeamPerformanceGraphProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const initialTeamStack = 3000

  
  useEffect(() => {
    if (!chartRef.current) {
      console.error("Chart container ref is null");
      return;
    }
    
    if (!historicalData || historicalData.length === 0) {
      console.error("Historical data is empty or invalid");
      
      // Create placeholder text if no data
      const placeholder = document.createElement('div');
      placeholder.textContent = 'No historical data available yet';
      placeholder.style.textAlign = 'center';
      placeholder.style.padding = '20px';
      placeholder.style.color = '#6b7280';
      
      // Clear any existing content
      while (chartRef.current.firstChild) {
        chartRef.current.removeChild(chartRef.current.firstChild);
      }
      
      chartRef.current.appendChild(placeholder);
      return;
    }
    
    try {
      // Find min and max values for scaling
      const stackValues = historicalData.map(d => d.team_stack);
      const maxStack = Math.max(...stackValues) * 1.1; // Add 10% margin
      const minStack = Math.min(0, Math.min(...stackValues) * 1.1);
      
      // Chart dimensions
      const width = 500; // Fallback width
      const height = 200;
      const padding = { top: 20, right: 20, bottom: 30, left: 50 };
      
      // Clear any existing chart
      while (chartRef.current.firstChild) {
        chartRef.current.removeChild(chartRef.current.firstChild);
      }
      
      // Create SVG
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', width.toString());
      svg.setAttribute('height', height.toString());
      chartRef.current.appendChild(svg);
      
      // Scale functions
      const xScale = (index: number): number => {
        return padding.left + (index / (historicalData.length - 1)) * (width - padding.left - padding.right);
      };
      
      const yScale = (value: number): number => {
        return height - padding.bottom - ((value - minStack) / (maxStack - minStack)) * (height - padding.top - padding.bottom);
      };
      
      // Draw axes
      const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      xAxis.setAttribute('x1', padding.left.toString());
      xAxis.setAttribute('y1', (height - padding.bottom).toString());
      xAxis.setAttribute('x2', (width - padding.right).toString());
      xAxis.setAttribute('y2', (height - padding.bottom).toString());
      xAxis.setAttribute('stroke', '#e2e8f0');
      xAxis.setAttribute('stroke-width', '1');
      svg.appendChild(xAxis);
      
      const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      yAxis.setAttribute('x1', padding.left.toString());
      yAxis.setAttribute('y1', padding.top.toString());
      yAxis.setAttribute('x2', padding.left.toString());
      yAxis.setAttribute('y2', (height - padding.bottom).toString());
      yAxis.setAttribute('stroke', '#e2e8f0');
      yAxis.setAttribute('stroke-width', '1');
      svg.appendChild(yAxis);
      
      // X-axis labels (rounds)
      historicalData.forEach((data, index) => {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', xScale(index).toString());
        label.setAttribute('y', (height - padding.bottom + 15).toString());
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '10');
        label.setAttribute('fill', '#6b7280');
        label.textContent = data.round_number.toString();
        svg.appendChild(label);
      });
      
      // Y-axis labels
      const yTicks = 5;
      for (let i = 0; i <= yTicks; i++) {
        const value = minStack + (i / yTicks) * (maxStack - minStack);
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', (padding.left - 10).toString());
        label.setAttribute('y', (yScale(value) + 4).toString());
        label.setAttribute('text-anchor', 'end');
        label.setAttribute('font-size', '10');
        label.setAttribute('fill', '#6b7280');
        label.textContent = Math.round(value).toLocaleString();
        svg.appendChild(label);
        
        // Grid line
        const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        gridLine.setAttribute('x1', padding.left.toString());
        gridLine.setAttribute('y1', yScale(value).toString());
        gridLine.setAttribute('x2', (width - padding.right).toString());
        gridLine.setAttribute('y2', yScale(value).toString());
        gridLine.setAttribute('stroke', '#e2e8f0');
        gridLine.setAttribute('stroke-width', '1');
        gridLine.setAttribute('stroke-dasharray', '3,3');
        svg.appendChild(gridLine);
      }
      
      // Create the line path
      let pathData = '';
      historicalData.forEach((data, index) => {
        const x = xScale(index);
        const y = yScale(data.team_stack);
        if (index === 0) {
          pathData += `M ${x} ${y}`;
        } else {
          pathData += ` L ${x} ${y}`;
        }
      });
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#3772ff');
      path.setAttribute('stroke-width', '2');
      svg.appendChild(path);
      
      // Add data points
      historicalData.forEach((data, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', xScale(index).toString());
        circle.setAttribute('cy', yScale(data.team_stack).toString());
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', '#3772ff');
        svg.appendChild(circle);
        
        // Add a tooltip on hover
        circle.addEventListener('mouseover', () => {
          const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', (xScale(index) - 50).toString());
          rect.setAttribute('y', (yScale(data.team_stack) - 40).toString());
          rect.setAttribute('width', '100');
          rect.setAttribute('height', '30');
          rect.setAttribute('fill', 'white');
          rect.setAttribute('stroke', '#e2e8f0');
          rect.setAttribute('rx', '4');
          tooltip.appendChild(rect);
          
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', xScale(index).toString());
          text.setAttribute('y', (yScale(data.team_stack) - 20).toString());
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('fill', '#2d3748');
          text.textContent = `$${data.team_stack.toLocaleString()}`;
          tooltip.appendChild(text);
          
          svg.appendChild(tooltip);
          
          circle.addEventListener('mouseout', () => {
            svg.removeChild(tooltip);
          });
        });
      });
      
    } catch (error) {
      console.error("Error rendering graph:", error);
      
      if (chartRef.current) {
        // Display error message
        const errorMsg = document.createElement('div');
        errorMsg.textContent = 'Error rendering chart';
        errorMsg.style.color = 'red';
        errorMsg.style.textAlign = 'center';
        errorMsg.style.padding = '20px';
        
        // Clear existing content
        while (chartRef.current.firstChild) {
          chartRef.current.removeChild(chartRef.current.firstChild);
        }
        
        chartRef.current.appendChild(errorMsg);
      }
    }
  }, [historicalData]);
  
  // Use inline styles to ensure visibility
  const containerStyle = {
    width: '100%',
    minHeight: '250px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '20px',
    backgroundColor: 'white'
  };
  
  return (
    <div className="team-performance-graph" style={{ width: '100%' }}>
      <h3>Team Performance</h3>
      <div className="graph-container" ref={chartRef} style={containerStyle}></div>
    </div>
  );
}

export default TeamPerformanceGraph;
