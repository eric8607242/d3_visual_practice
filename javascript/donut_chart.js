
var margin = { top: 20, right: 50, bottom: 30, left: 50 },
    donut_width = screen.availWidth * 0.3 - margin.left - margin.right,
    donut_height = screen.availWidth * 0.2 - margin.top - margin.bottom,
    radius = Math.min(donut_width, donut_height) / 2;

var arc = d3.arc()
    .outerRadius(radius - 30)
    .innerRadius(radius - 80);

var water_color = d3.scaleOrdinal()
    .range(["#87CEFA", "#4169E1"]);
var wind_color = d3.scaleOrdinal()
    .range(["#32CD32", "#3CB371"]);
var sun_color = d3.scaleOrdinal()
    .range(["#FFDD55", "#FFBB00"]);
var pie = d3.pie()
    .sort(null)
    .value(function (d) { return d.percent });

var sun_svg = d3.select("#sun_donut").append("svg")
    .attr("width", donut_width)
    .attr("height", donut_height)
    //.attr("transform", "translate(" + donut_width / 2 + ",0)")
    //.style("background-color","#FFFACD")
    .append("g")
    .attr("transform", "translate(" + donut_width / 2 + "," + donut_height / 2 + ")");

var water_svg = d3.select("#sun_donut").append("svg")
    .attr("width", donut_width)
    .attr("height", donut_height)
    //.attr("transform", "translate(" + donut_width / 2 + ",0)")
    //.style("background-color","#F0F8FF")
    .append("g")
    .attr("transform", "translate(" + donut_width / 2 + "," + donut_height / 2 + ")");

var wind_svg = d3.select("#sun_donut").append("svg")
    .attr("width", donut_width)
    .attr("height", donut_height)
    //.attr("transform", "translate(" + donut_width / 2 + ",0)")
    //.style("background-color","	#F0FFF0")
    .append("g")
    .attr("transform", "translate(" + donut_width / 2 + "," + donut_height / 2 + ")");

var sun;
var water;
var wind;
var sun_data;
var water_data;
var wind_data;


d3.csv("./data/sun.csv", function (d, i, columns) {
    return {
        year: +d.year,
        pers: columns.slice(1).map(function (key) {
            return {
                name: key,
                percent: +d[key]
            };
        })
    };
}, function (error, data) {
    sun_data = data;
    if (error) throw error;
    sun_color.domain(data[1].pers.map(function (d) { return d.name; }));

    sun = sun_svg.selectAll(".arc")
        .data(function (d) { return pie(data[1].pers); })
        .enter().append("g")
    sun_circle = sun.append("circle")
        .attr("cx", "0")
        .attr("cy", "0")
        .attr("r", radius - 85)
        .attr("fill", "white")
    var sun_text = sun.append("text")
        .attr("transform", "translate(" + radius / 2 + donut_width / 2 + ",0)")
        .attr("dy", "0.8em")
        .attr("font-size", "1.3em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("")
    var sun_text_type = sun.append("text")
        .attr("transform", "translate(" + radius / 2 + donut_width / 2 + ",0)")
        .attr("dy", "-0.8em")
        .attr("font-size", "0.9em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("")
    var sun_text_year = sun.append("text")
        .attr("transform", "translate(" + radius / 2 + donut_width / 2 + ",0)")
        .attr("dy", "-1.8em")
        .attr("font-size", "1em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("")
    sun.append("path")
        .attr("d", arc)
        .style("fill", function (d) { return sun_color(d.data.name) })
        .on("mouseenter", function (data) {
            var select_name = d3.select(this).data()[0].data.name;
            sun_circle
                .attr("opacity", 0.2)
                .style("fill", function (d) {
                    if (select_name === "台電") { return sun_color.range()[0]; }
                    else { return sun_color.range()[1] }
                })
            var select_value = d3.select(this).data()[0].value;
            sun_text_year.text("民國" + select_cir_year + "年")
            sun_text_type.text(select_name + "發電量達")
            sun_text.text( select_value + "百萬度")
        })
        .on("mouseout", function (d) {
        });
    sun.append("text")
        .attr("class", "text_remove_sun")
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d) { console.log(d); return d.data.name; });


})

d3.csv("./data/water.csv", function (d, i, columns) {
    return {
        year: +d.year,
        pers: columns.slice(1).map(function (key) {
            return {
                name: key,
                percent: +d[key]
            };
        })
    };
}, function (error, data) {
    water_data = data;
    if (error) throw error;

    water_color.domain(data[1].pers.map(function (d) { return d.name; }));

    water = water_svg.selectAll(".arc")
        .data(function (d) { return pie(data[1].pers); })
        .enter().append("g")
    var water_text = water.append("text")
        .attr("transform", "translate(" + radius / 2 + donut_width / 2 + ",0)")
        .attr("dy", "0.8em")
        .attr("font-size", "1.3em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("")
    var water_text_type = water.append("text")
        .attr("transform", "translate(" + radius / 2 + donut_width / 2 + ",0)")
        .attr("dy", "-0.8em")
        .attr("font-size", "0.9em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("")
    var water_text_year = water.append("text")
        .attr("transform", "translate(" + radius / 2 + donut_width / 2 + ",0)")
        .attr("dy", "-1.8em")
        .attr("font-size", "1em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("")
    water_circle = water.append("circle")
        .attr("cx", "0")
        .attr("cy", "0")
        .attr("r", radius - 85)
        .attr("fill", "white")
    water.append("path")
        .attr("d", arc)
        .style("fill", function (d) { return water_color(d.data.name) })
        .on("mouseenter", function (data) {
            var select_name = d3.select(this).data()[0].data.name;
            water_circle
                .attr("opacity", 0.2)
                .style("fill", function (d) {
                    if (select_name === "台電") { return water_color.range()[0]; }
                    else { return water_color.range()[1] }
                })
            var select_value = d3.select(this).data()[0].value;
            water_text_year.text("民國" + select_cir_year + "年")
            water_text_type.text(select_name + "發電量達")
            water_text.text(Math.round(select_value) + "百萬度")
        })
        .on("mouseout", function (d) {
        });
    water.append("text")
        .attr("class", "text_remove_water")
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d) { console.log(d); return d.data.name; });



})
d3.csv("./data/wind.csv", function (d, i, columns) {
    return {
        year: +d.year,
        pers: columns.slice(1).map(function (key) {
            return {
                name: key,
                percent: +d[key]
            };
        })
    };
}, function (error, data) {
    wind_data = data;
    if (error) throw error;

    wind_color.domain(data[1].pers.map(function (d) { return d.name; }));


    wind = wind_svg.selectAll(".arc")
        .data(function (d) { return pie(data[6].pers); })
        .enter().append("g")
    var wind_text = wind.append("text")
        .attr("transform", "translate(" + radius / 2 + donut_width / 2 + ",0)")
        .attr("dy", "0.8em")
        .attr("font-size", "1.3em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("")
    var wind_text_type = wind.append("text")
        .attr("transform", "translate(" + radius / 2 + donut_width / 2 + ",0)")
        .attr("dy", "-0.8em")
        .attr("font-size", "0.9em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("")
    var wind_text_year = wind.append("text")
        .attr("transform", "translate(" + radius / 2 + donut_width / 2 + ",0)")
        .attr("dy", "-1.8em")
        .attr("font-size", "1em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("")

    wind_circle = wind.append("circle")
        .attr("cx", "0")
        .attr("cy", "0")
        .attr("r", radius - 85)
        .attr("fill", "white")
    wind.append("path")
        .attr("d", arc)
        .style("fill", function (d) { return wind_color(d.data.name) })
        .on("mouseenter", function (data) {
            var select_name = d3.select(this).data()[0].data.name;
            wind_circle
                .attr("opacity", 0.2)
                .style("fill", function (d) {
                    if (select_name == "台電") { return wind_color.range()[0]; }
                    else { return wind_color.range()[1] }
                })
            var select_value = d3.select(this).data()[0].value;
            wind_text_year.text("民國" + select_cir_year + "年")
            wind_text_type.text(select_name + "發電量達")
            wind_text.text(Math.round(select_value) + "百萬度")
        })
        .on("mouseout", function (d) {
        });
    wind.append("text")
        .attr("class", "text_remove_wind")
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d) { console.log(d); return d.data.name; });
})
