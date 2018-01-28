var cate_line_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    cate_line_width = screen.availWidth * 0.48 - cate_line_margin.left - cate_line_margin.right,
    cate_line_height = screen.availWidth * 0.15 - cate_line_margin.top - cate_line_margin.bottom;

var cate_line_svg = d3.select("#cate")
    .append("svg")
    .attr("width", cate_line_width + cate_line_margin.left + cate_line_margin.right)
    .attr("height", cate_line_height + cate_line_margin.top + cate_line_margin.bottom)
    .attr("transform", "translate(0,-100)");

var cate_line_g = cate_line_svg.append("g").attr("transform", "translate(" + cate_line_margin.left + "," + cate_line_margin.top + ")");

var cate_line_x = d3.scaleTime().range([0, cate_line_width]),
    cate_line_y = d3.scaleLinear().range([cate_line_height, 0]);

var wind_line = d3.line()
    //.curve(d3.curveBasis)
    .x(function (d) { return cate_line_x(d.year); })
    .y(function (d) { return cate_line_y(d.wind/1000000); });

var solar_line = d3.line()
    //.curve(d3.curveBasis)
    .x(function (d) { return cate_line_x(d.year); })
    .y(function (d) { return cate_line_y(d.solar/1000000); });

var water_line = d3.line()
    //.curve(d3.curveBasis)
    .x(function (d) { return cate_line_x(d.year); })
    .y(function (d) { return cate_line_y(d.water/1000000); });

var bio_line = d3.line()
    //.curve(d3.curveBasis)
    .x(function (d) { return cate_line_x(d.year); })
    .y(function (d) { return cate_line_y(d.bio/1000000+30); });

var gar_line = d3.line()
    //.curve(d3.curveBasis)
    .x(function (d) { return cate_line_x(d.year); })
    .y(function (d) { return cate_line_y(d.gar/1000000); });
d3.csv("./data/energy_type.csv", function (d) {
    d.year = +d.year;
    d.wind = +d.wind;
    d.solar = +d.solar;
    d.water = +d.water;
    d.bio = +d.bio;
    d.gar = +d.gar;
    return d;
}, function (error, data) {
    cate_line_x.domain(d3.extent(data, function (d) { return d.year; }));
    cate_line_y.domain([0, d3.max(data, function (d) {
        return Math.max(d.water, d.solar, d.wind, d.bio, d.gar)/1000000;
    })])

    cate_line_g.append("g")
        .attr("transform", "translate(0," + cate_line_height + ")")
        .call(d3.axisBottom(cate_line_x))
        .select(".domain");


    cate_line_g.append("g")
        .call(d3.axisLeft(cate_line_y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .select(".domain")
        .remove();

    cate_line_g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "cate_line")
        .attr("stroke", "#FF5511")
        .attr("stroke-width", 2.5)
        .attr("d", wind_line);
    cate_line_g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "cate_line")
        .attr("stroke", "#5599FF")
        .attr("stroke-width", 2.5)
        .attr("d", water_line);
    cate_line_g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "cate_line")
        .attr("stroke", "#FFFF33")
        .attr("stroke-width", 2.5)
        .attr("d", solar_line);
    cate_line_g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "cate_line")
        .attr("stroke", "#00AA00")
        .attr("stroke-width", 2.5)
        .attr("d", bio_line);
    cate_line_g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "cate_line")
        .attr("stroke", "#AAFFEE")
        .attr("stroke-width", 2.5)
        .attr("d", gar_line);
})