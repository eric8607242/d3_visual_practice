var margin = { top: 20, right: 80, bottom: 30, left: 50 },
    width = 700 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom;
    
var svg = d3.select("body")
    .append("svg")
    .attr("width",width + margin.left + margin.right)
    .attr("height",height + margin.top + margin.bottom)
    
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]);

var fire_line = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.fire); });

var nuclear_line = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.nuclear); });

var water_line = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.water); });

var renewable_line = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.renewable); });



d3.csv("../data/his_ele_cate.csv", function (d) {
    d.year = +d.year;
    d.fire = +d.fire;
    d.nuclear = +d.nuclear;
    d.water = +d.water;
    d.renewable = +d.renewable;
    return d;
}, function (error, data) {

    x.domain(d3.extent(data, function (d) { return d.year; }));
    console.log(x.domain());
    y.domain([0, d3.max(data, function (d) {
        return Math.max(/*d.fire,*/ d.nuclear, d.water, d.renewable);
    })]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .select(".domain");


    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .select(".domain")
        .remove();


    /*g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.5)
        .attr("d", fire_line);*/

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", "red")
        .attr("stroke-width", 2.5)
        .attr("d", nuclear_line);

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", "orange")
        .attr("stroke-width", 2.5)
        .attr("d", water_line);

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", "green")
        .attr("stroke-width", 2.5)
        .attr("d", renewable_line);


})
