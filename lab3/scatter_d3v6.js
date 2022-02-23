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
}

dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#scatter_words")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.width)
    .append("g")
    .attr("transform", `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);

//Read the data
d3.json("word_counts.json").then(function (data) {

    // Add X axis
    console.log(data);

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.frequency))
        .range([0, dimensions.boundedWidth]);
    svg.append("g")
        .attr("transform", `translate(0, ${dimensions.boundedHeight})`)
        .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.freqPercent))
        .range([dimensions.boundedHeight, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("cx", d => x(d.frequency))
        .attr("cy", d => y(d.freqPercent))
        .attr("r", 4)
        .style("fill", "#69b3a2")

    svg.append("text")
        .attr("x", (dimensions.width / 2))
        .attr("y", 0 - (dimensions.margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Scatter plot. Word Frequency");

})