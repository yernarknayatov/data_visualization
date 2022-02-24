console.log("Hello world!");

async function drawLineChart() {
  console.log("drawLineChart");
  const data = await d3.json("my_weather_data.json");
  console.log(data);
  const yAccessorMax = d => d.temperatureMax;
  const yAccessorMin = d => d.temperatureMin;
  const dateParser = d3.timeParse("%Y-%m-%d");

  function xAccesor(d) {
    return dateParser(d.date);
  }

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: window.innerHeight * 0.9,
    margin: {
      top: 20,
      right: 40,
      bottom: 20,
      left: 40,
    },
  }

  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  const wrapper = d3.select("#wrapper");
  const svg = wrapper.append("svg");
  svg.attr("width", dimensions.width);
  svg.attr("height", dimensions.height);

  const bounds = svg.append("g").style("transform", `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`);

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yAccessorMax))
    .range([dimensions.boundedHeight, 0]);

  console.log(yScale);

  const xScale = d3.scaleTime()
    .domain(d3.extent(data, xAccesor))
    .range([0, dimensions.boundedWidth])

  const lineGeneratorMax = d3.line()
    .x(d => xScale(xAccesor(d)))
    .y(d => yScale(yAccessorMax(d)))

  const lineGeneratorMin = d3.line()
    .x(d => xScale(xAccesor(d)))
    .y(d => yScale(yAccessorMin(d)))

  const lineGeneratorMedian = d3.line()
    .x(d => xScale(xAccesor(d)))
    .y(d => yScale((yAccessorMax(d) + yAccessorMin(d)) / 2))

  const lineMax = bounds.append("path")
    .attr("d", lineGeneratorMax(data))
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 2)

  const lineMin = bounds.append("path")
    .attr("d", lineGeneratorMin(data))
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 2)

  const lineMedian = bounds.append("path")
    .attr("d", lineGeneratorMedian(data))
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 2)

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale);

  const xAxisGenertor = d3.axisBottom()
    .scale(xScale);

  const yAxis = bounds.append("g").call(yAxisGenerator)
    // .style("transform", `translateX(${dimensions.boundedWidth}px)`)

  const xAxis = bounds.append("g").call(xAxisGenertor)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)
}


drawLineChart();
