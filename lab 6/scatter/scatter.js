async function drawScatter() {
  let dimensions = {
    width: 700,
    height: 400,
    // height: window.innerHeight * 0.4,
    margin: {
      top: 50,
      right: 40,
      bottom: 20,
      left: 40,
    },
  };
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // append the svg object to the body of the page
  const svg = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  // 1. Access data

  const data = await d3.json("my_weather_data.json");

  //Read the data

  // Add X axis
  const x = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.humidity))
    .range([0, dimensions.boundedWidth]);
  svg
    .append("g")
    .attr("transform", `translate(0, ${dimensions.boundedHeight})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.temperatureMax))
    .range([dimensions.boundedHeight, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
  // Its opacity is set to 0: we don't see it by default.
  const tooltip = d3
    .select("#wrapper")
    .append("div")
    .style("opacity", 0.5)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  const mouseover = function (event, d) {
    tooltip.style("opacity", 1);
  };

  const mousemove = function (event, d) {
    tooltip
      .html(`Humidity: ${d.humidity}\nMax temperature: ${d.temperatureMax}`)
      .style("left", event.x / 2 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", event.y / 2 + "px")
      .transition()
      .select("dot")
      .duration(200)
      .style("opacity", 1)

    console.log("selected");
  };

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  const mouseleave = function (event, d) {
    tooltip.transition().duration(200).style("opacity", 0);
  };

  // Add dots
  svg
    .append("g")
    .selectAll("dot")
    .data(
      data.filter(function (d, i) {
        return i < 50;
      })
    ) // the .filter part is just to keep a few dots on the chart, not all of them
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.humidity);
    })
    .attr("cy", function (d) {
      return y(d.temperatureMax);
    })
    .attr("r", 7)
    .style("fill", "blue")
    .style("opacity", 0.7)
    .style("stroke", "white")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  svg
    .append("text")
    .attr("x", dimensions.width / 2)
    .attr("y", 0 - dimensions.margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Updating of Scatter plot. Humidity & Max temperature");
}

drawScatter();
