async function mapAnimation() {
  let dimensions = {
    width: document.getElementById("map_place").offsetWidth,
    height: document.getElementById("map_place").offsetHeight,
    // height: window.innerHeight * 0.4,
    margin: {
      top: 50,
      right: 40,
      left: 40,
    },
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // append the svg object to the body of the page

  const svg = d3
    .select("#map_place")
    .append("svg")
    // .attr("width", dimensions.width)
    // .attr("height", dimensions.height)
    .attr("class", "map")
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.right}px, ${dimensions.margin.bottom}px)`
    );

  // Map and projection
  const path = d3.geoPath();
  const projection = d3
    .geoMercator()
    .scale(950)
    .center([80, 47])
    .translate([dimensions.width / 2, dimensions.height / 2]);

  // Data and color scale
  const data = new Map();
  const colorScale = d3
    .scaleThreshold()
    .domain([0, 200, 500, 1500, 3000, 5000, 8000])
    .range(d3.schemeGreens[7]);

  const regions_name = [
    "Aqmola",
    "Aqtöbe",
    "Almaty",
    "Atyrau",
    "West Kazakhstan",
    "Zhambyl",
    "Qaraghandy",
    "Qostanay",
    "Mangghystau",
    "Qyzylorda",
    "Türkistan",
    "Pavlodar",
    "North Kazakhstan",
    "East Kazakhstan",
  ];

  Promise.all([
    d3.json("map/kz.geojson"),
    d3.csv("data/real_gross_wheat_thou_tonn.csv", function (d) {
      data.set(`${d.region} ${d.year}`, d.thous_hect);
    }),
  ]).then(function (loadData) {
    // tooltip

    var tooltip = d3.select("div.tooltip");
    let map_kz = loadData[0];
    let data_kz = loadData[1];

    // Draw the map
    var regionShapes = svg
      .append("g")
      .selectAll("path")
      .data(map_kz.features)
      .enter()
      .append("path")
      // draw each countryyear
      .attr("class", function (d) {
        return "region";
      })
      .attr("d", d3.geoPath().projection(projection))
      // set the color of each country
      .attr("fill", function (d) {
        region_ = d.properties.NAME_1;
        k_v = `${region_} ${document.getElementById("slider").value}`;
        d.total = data.get(k_v) || 0;

        // console.log(d.total);
        if (d.total) {
          return colorScale(d.total);
        }
        return colorScale(0);
      })
      .style("stroke", "black");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", dimensions.height)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Abstract Lenghts Histogram");

    regionShapes
      .on("mouseover", function (d, i) {
        let text =
          (i.properties.NAME_1,
          Math.round(
            data.get(
              `${i.properties.NAME_1} ${
                document.getElementById("slider").value
              }`
            )
          ));
        // console.log("%s\n%s", i.properties.NAME_1, data.get(`${i.properties.NAME_1} ${document.getElementById('slider').value}`));
        console.log(i.properties.NAME_1);
        console.log("", text);
        // console.log("mouseover: ", i.properties.ID);
        d3.selectAll("path").style("opacity", 0.7);
        d3.select(this)
          .style("opacity", 1)
          .attr("fill", function (d) {
            region_ = d.properties.NAME_1;

            k_v = `${region_} ${document.getElementById("slider").value}`;
            d.total = data.get(k_v) || 0;
            // console.log(k_v);
            // console.log(d.total);
            // console.log("%s\n%s", i.properties.NAME_1, data.get(`${i.properties.NAME_1} ${document.getElementById('slider').value}`));
            if (d.total) {
              return colorScale(d.total);
            }
            return colorScale(0);
          })
          .attr("stroke-width", 2);
        // return tooltip.style("hidden", false).html(`${i.properties.NAME_1} ${data.get(`${region_} ${document.getElementById("slider").value}`)}`);
        return tooltip
          .style("hidden", false)
          .html(
            i.properties.NAME_1 +
              "<br>" +
              Math.round(
                data.get(
                  `${i.properties.NAME_1} ${
                    document.getElementById("slider").value
                  }`
                )
              )
          );
      })
      .on("mousemove", function (d, i) {
        let text =
          (i.properties.NAME_1,
          Math.round(
            data.get(
              `${i.properties.NAME_1} ${
                document.getElementById("slider").value
              }`
            )
          ));
        // console.log("%s\n%s", i.properties.NAME_1, data.get(`${i.properties.NAME_1} ${document.getElementById('slider').value}`));
        console.log(i.properties.NAME_1);
        console.log("", text);
        tooltip
          .classed("hidden", false)
          .style("top", d.y + "px")
          .style("left", d.x + 10 + "px")
          // .html("%s\n%s", i.properties.NAME_1, data.get(`${i.properties.NAME_1} ${document.getElementById('slider').value}`));
          .html(
            i.properties.NAME_1 +
              "<br>" +
              Math.round(
                data.get(
                  `${i.properties.NAME_1} ${
                    document.getElementById("slider").value
                  }`
                )
              )
          );
        event;
      })
      .on("mouseout", function (d, i) {
        d3.selectAll("path").style("opacity", 1);
        d3.select(this)
          .attr("fill", function (d) {
            region_ = d.properties.NAME_1;

            k_v = `${region_} ${document.getElementById("slider").value}`;
            d.total = data.get(k_v) || 0;
            if (d.total) {
              return colorScale(d.total);
            }
            return colorScale(0);
          })
          .attr("stroke-width", 1);
        tooltip.classed("hidden", true);
      });

    var slider = d3
      .select(".slider")
      .attr(
        "transform",
        `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
        // "translate(50%,-50%)"
      )

      .on("input", function () {
        var year = this.value;
        // update(year);
      });
    // Title
    var g = svg
      .append("g")
      .attr("class", "legendThreshold")
      .attr("transform", "translate(20,20)");
    g.append("text")
      // .attr("class", "caption")
      .attr("x", dimensions.width / 2 - 280)
      .attr("y", dimensions.margin.top / 2 - 20)
      .attr("text-anchor", "middle")
      .style("font-size", "30px")
      .text("Wheat Harvest from 2004 to 2021");
    // Legend
    var g = svg
      .append("g")
      .attr("class", "legendThreshold")
      .attr("transform", "translate(20,20)");
    g.append("text")
      .attr("class", "caption")
      .attr("x", 0)
      .attr("y", -6)
      .text("Wheat 1000 kg")
      .style("style", "label");

    // var labels = ["0", "1-5", "6-10", "11-25", "26-100", "101-1000", "> 1000"];
    var labels = ["0", "≤200", "≤500", "≤1500", "≤3000", "≤5000", "≤8000"];
    var legend = d3
      .legendColor()
      .labels(function (d) {
        return labels[d.i];
      })
      .shapePadding(4)
      .scale(colorScale);
    svg.select(".legendThreshold").call(legend);

    // function update(year) {
    //   console.log(data_kz);
    //   console.log(regions_name);

    //   function checkYear(data) {
    //     console.log(value);
    //     console.log("yes");
    //     return document.getElementById("slider").value == data.year;
    //     // return true;
    //   }
    //   // ((ai) => regions_name.includes(`${ai} ${year}`));
    //   // map1.has('bar')
    //   let result = data_kz.filter(checkYear);

    //   console.log(result);
    // }

    // Listen to the slider?
    d3.select("#slider").on("change", function (d) {
      selectedValue = this.value;
      d3.select(".year").text(this.value);
      d3.selectAll("path")
        .style("opacity", 1)
        .attr("fill", function (d) {
          region_ = d.properties.NAME_1;
          // console.log(data);
          k_v = `${region_} ${document.getElementById("slider").value}`;
          d.total = data.get(k_v) || 0;
          // console.log(k_v);
          // console.log(d.total);
          if (d.total) {
            return colorScale(d.total);
          }
          return colorScale(0);
        })
        .attr("stroke-width", 2);
      // return tooltip.style("hidden", false).html("%s\n%s", i.properties.NAME_1, data.get(`${i.properties.NAME_1} ${document.getElementById('slider').value}`));
    });
  });
}

mapAnimation();
