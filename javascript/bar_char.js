var margin = { top: 20, right: 80, bottom: 30, left: 50 },
    width = 400 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom;

var bar_svg = d3.select("#bar")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var bar_color = d3.scaleOrdinal()
    .range(["#FF5511", "#FFFF33", "#5599FF", "	#00AA00"]);

var bar_g = bar_svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var bar_x = d3.scaleBand().range([0, width]),
    bar_y = d3.scaleLinear().range([height, 0]);
var bar;
var bar_data;
d3.csv("./data/his_ele_cate.csv", function (d, i, columns) {
    return {
        year: +d.year,
        energy: columns.slice(1).map(function (key) {
            return {
                name: key,
                percent: +d[key]
            };
        })
    };

}, function (error, data) {
    bar_data = data;
    console.log("bar")
    console.log(bar_data)
    //console.log(data[30]);
    bar_x.domain(data[30].energy.map(function (d) { return d.name; }));
    bar_y.domain([0, d3.max(data[30].energy, function (d) { return d.percent; })]);
    color.domain(data[30].energy.map(function (d) { return d.name; }));

    bar_g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(bar_x));

    bar_g.append("g")
        .call(d3.axisLeft(bar_y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", "0.71em");


    bar = bar_g.selectAll("rect")
        .data(data[30].energy)
        .enter()
    bar.append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return bar_x(d.name) + 15; })
        .attr("y", function (d) { return bar_y(d.percent); })
        .attr("width", "30")
        .attr("height", function (d) { return height - bar_y(d.percent); })
        .attr("fill", function (d) { return bar_color(d.name) });
});