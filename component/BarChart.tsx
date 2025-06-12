'use client'
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

// Define the type for a record
interface Record {
  date: string; // ISO date string
  amount: number; // Hours slept
}

const BarChart = ({ records }: { records: Record[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || records.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Set dimensions and margins
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // Create main group
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse dates and prepare data
    const parseDate = d3.timeParse("%Y-%m-%d");
    const formatDate = d3.timeFormat("%m/%d");

    const data = records.map(d => ({
      ...d,
      parsedDate: parseDate(d.date.split('T')[0]) || new Date(),
      formattedDate: formatDate(parseDate(d.date.split('T')[0]) || new Date())
    }));

    // Set scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.formattedDate))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([4, 10]) // Match original chart's y-axis range
        .range([height, 0]);

    // Create color scale
    const colorScale = (amount: number) => {
      return amount < 7 ? '#ff6384' : '#4bc0c0';
    };

    // Add grid lines
    const yAxis = d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat(() => '');

    g.append("g")
        .attr("class", "grid")
        .call(yAxis)
        .selectAll("line")
        .style("stroke", "#e0e0e0")
        .style("stroke-width", 1);

    // Remove grid domain line
    g.select(".grid .domain").remove();

    // Create tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "d3-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("padding", "8px 12px")
        .style("border-radius", "4px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "1000");

    // Create bars
    const bars = g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.formattedDate) || 0)
        .attr("width", xScale.bandwidth())
        .attr("y", height) // Start from bottom for animation
        .attr("height", 0) // Start with 0 height for animation
        .attr("fill", d => colorScale(d.amount))
        .attr("rx", 2) // Rounded corners
        .attr("ry", 2)
        .style("cursor", "pointer");

    // Animate bars
    bars.transition()
        .duration(800)
        .delay((d, i) => i * 100)
        .attr("y", d => yScale(d.amount))
        .attr("height", d => height - yScale(d.amount));

    // Add hover effects
    bars
        .on("mouseover", function(event, d) {
          // Highlight bar
          d3.select(this)
              .transition()
              .duration(200)
              .attr("fill", d3.color(colorScale(d.amount))?.brighter(0.2)?.toString() || colorScale(d.amount))
              .attr("stroke", "#333")
              .attr("stroke-width", 2);

          // Show tooltip
          tooltip
              .style("visibility", "visible")
              .html(`
            <div><strong>Date:</strong> ${new Date(d.date).toLocaleDateString()}</div>
            <div><strong>Hours Slept:</strong> ${d.amount}</div>
          `);
        })
        .on("mousemove", function(event) {
          tooltip
              .style("top", (event.pageY - 10) + "px")
              .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function(event, d) {
          // Reset bar
          d3.select(this)
              .transition()
              .duration(200)
              .attr("fill", colorScale(d.amount))
              .attr("stroke", "none");

          // Hide tooltip
          tooltip.style("visibility", "hidden");
        });

    // Add X axis
    const xAxis = d3.axisBottom(xScale);

    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text")
        .style("font-size", "12px")
        .style("fill", "#7f8c8d");

    // Add Y axis
    const yAxisLeft = d3.axisLeft(yScale)
        .tickFormat(d => d + "h");

    g.append("g")
        .call(yAxisLeft)
        .selectAll("text")
        .style("font-size", "12px")
        .style("fill", "#7f8c8d");

    // Add axis labels
    // X-axis label
    g.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "#2c3e50")
        .text("Date");

    // Y-axis label
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("fill", "#2c3e50")
        .text("Hours Slept");

    // Remove domain lines
    g.selectAll(".domain").remove();

    // Cleanup function
    return () => {
      tooltip.remove();
    };
  }, [records]);

  if (records.length === 0) {
    return (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <p className="text-gray-500">No data to display</p>
        </div>
    );
  }

  return (
      <div className="w-full">
        <svg
            ref={svgRef}
            className="w-full h-auto bg-white rounded-lg shadow-sm"
            style={{ maxWidth: '100%', height: 'auto' }}
        />
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Hover over bars for details</p>
          <p className="mt-1">
            <span className="inline-block w-3 h-3 bg-red-400 mr-2 rounded"></span>
            Less than 7 hours
            <span className="inline-block w-3 h-3 bg-teal-400 ml-4 mr-2 rounded"></span>
            7+ hours
          </p>
        </div>
      </div>
  );
};

// Demo component with sample data
const Demo = () => {
  const sampleRecords: Record[] = [
    { date: '2024-01-01', amount: 7.5 },
    { date: '2024-01-02', amount: 6.2 },
    { date: '2024-01-03', amount: 8.1 },
    { date: '2024-01-04', amount: 5.8 },
    { date: '2024-01-05', amount: 7.9 },
    { date: '2024-01-06', amount: 6.7 },
    { date: '2024-01-07', amount: 8.3 },
    { date: '2024-01-08', amount: 5.2 },
    { date: '2024-01-09', amount: 7.8 },
    { date: '2024-01-10', amount: 6.9 },
  ];

  return (
      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Sleep Hours Chart (D3.js)</h2>
        <BarChart records={sampleRecords} />
      </div>
  );
};

export default Demo;