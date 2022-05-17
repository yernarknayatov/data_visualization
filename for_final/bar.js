function bar() {
  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 30, bottom: 20, left: 50 },
    width = 1600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3
    .select("#bar_canada_kaz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Parse the Data
  d3.csv("data/total_canada_kz.csv").then(function (data) {
    // List of subgroups = header of the csv files = soil condition here
    const subgroups = data.columns.slice(1);

    console.log(subgroups);
    // List of groups = species here = value of the first column called group -> I show them on the X axis
    const groups = data.map((d) => d.year);

    console.log(groups);

    // Add X axis
    const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSize(0));

    // Add Y axis
    const y = d3.scaleLinear().domain([0, 40]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Another scale for subgroup position?
    const xSubgroup = d3
      .scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding([0.05]);

    //stack the data? --> stack per subgroup
    const stackedData = d3.stack().keys(subgroups)(data);

    // ----------------
    // Create a tooltip_
    // ----------------
    const tooltip_ = d3
      .select("#bar_canada_kaz")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip_")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");
    // .style("top", d.y + "px")
    // .style("left", d.x + 10 + "px");

    // Three function that change the tooltip_ when user hover / move / leave a cell
    const mouseover = function (event, d) {
      // const subgroupName = d3.select(this.parentNode).datum().key;
      const subgroupName = d.key;
      console.log(subgroupName);
      console.log(d);"wef".toUpperCase()
      const subgroupValue = d.value;
      tooltip_
        .html("country: " + subgroupName[0].toUpperCase()+ subgroupName.slice(1)  + "<br>" + "Value: " + subgroupValue)
        .style("opacity", 1);
    };
    const mousemove = function (event, d) {
      tooltip_
        // .style("transform", "translateY(-55%)")
        .style("left", event.x + 2 + "px")
        .style("top", event.y - 65 + "px");
    };1
    const mouseleave = function (event, d) {
      tooltip_.style("opacity", 0);
    };

    // color palette = one color per subgroup
    const color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(["#e41a1c", "#377eb8"]);

    // Show the bars
    svg
      .append("g")
      .selectAll("g")
      // Enter in data = loop group per group
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(${x(d.year)}, 0)`)
      .selectAll("rect")
      .data(function (d) {
        // console.log(d);
        return subgroups.map(function (key) {
          return { key: key, value: Math.round(d[key]) };
        });
      })
      .join("rect")
      .attr("x", (d) => xSubgroup(d.key))
      .attr("y", (d) => y(d.value))
      .attr("width", xSubgroup.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d) => color(d.key))
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  });
  var g = svg
    .append("g")
    // .attr("class", "legendThreshold")
    .attr("transform", "translate(20,20)");
  g.append("text")
    // .attr("class", "caption")
    .attr("x", dimensions.width / 2 )
    .attr("y", dimensions.margin.top )
    .attr("text-anchor", "middle")
    .style("font-size", "30px")
    .text("Wheat Harvest per hectare from 2004 to 2022");
}

bar();
