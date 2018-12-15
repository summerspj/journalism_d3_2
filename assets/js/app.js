// Initialize axis and label position
// var svgWidth = 960;
var svgWidth = parseInt(d3.select("#scatter").style("width"));
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(journalData) {

  // Parse Data/Cast as numbers
   // ==============================
  journalData.forEach(function(data) {
    data.id = +data.id;
    // data.state = +data.state;
    // data.abbr = +data.abbr;
    data.poverty = +data.poverty;
    data.povertyMoe = +data.povertyMoe;
    data.age = +data.age;
    data.ageMo = +data.ageMoe;
    data.income = +data.income;
    data.incomeMoe = +data.incomeMoe;
    data.healthcare = +data.healthcare;
    data.healthcareLow = +data.healthcareLow;
    data.healthcareHigh = +data.healthcareHigh;
    data.obesity = +data.obesity;
    data.obesityLow = +data.obesityLow;
    data.obesityHigh = +data.obesityHigh;
    data.smokes = +data.smokes;
    data.smokesLow = +data.smokesLow;
    data.smokesHigh = +data.smokesHigh;
  });
  console.log(journalData)
  xmin = (d3.min(journalData, d => parseFloat(d.poverty)) -1)
  xmax = (d3.max(journalData, d => parseFloat(d.poverty)) +1)
  ymin = (d3.min(journalData, d => parseFloat(d.smokes)) - 1)
  ymax = (d3.max(journalData, d => parseFloat(d.smokes)) +1)

  // Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([xmin, xmax])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([ymin, ymax])
    .range([height, 0]);

  // Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

   // Create Circles
  // ==============================
var tool_tip = d3.tip()
  .attr("class", "d3-tip")
  .offset([80, -60])
  .html(function(d) {
    return (`${d.state}<br>Poverty: ${d.poverty}<br>Smokes: ${d.smokes}`);
  });
svg.call(tool_tip);

var circlesGroup = chartGroup.selectAll("circle")
  .data(journalData)
  .enter()
  .append("circle")
  .attr("cx", d => {return xLinearScale(d.poverty)})
  .attr("cy", d => yLinearScale(d.smokes))
  .attr("r", "15")
  .attr("fill", "lightblue")
  .attr("opacity", ".5")
  .on('mouseover', tool_tip.show)
  .on('mouseout', tool_tip.hide);

chartGroup.append("text")
  .style("text-anchor", "middle")
  .style("font-size", "12px")
  .selectAll("tspan")
  .data(journalData)
  .enter()
  .append("tspan")
      .attr("x", function(data) {
          return xLinearScale(data.poverty - 0);
      })
      .attr("y", function(data) {
          return yLinearScale(data.smokes - 0.2);
      })
      .text(function(data) {
          return data.abbr
      });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .style("font-weight", "bold")
    .text("Smokes (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .style("font-weight", "bold")
    .text("In Poverty (%)");

//closing of csv read
});