var margin = { top: 20, right: 50, bottom: 30, left: 50 },
    donut_width =screen.availWidth * 0.3- margin.left - margin.right,
    donut_height = screen.availWidth * 0.2 - margin.top - margin.bottom,
    radius = Math.min(donut_width, donut_height) / 2;

var arc = d3.arc()
    .outerRadius(radius - 30)
    .innerRadius(radius - 70);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var pie = d3.pie()
    .sort(null)
    .value(function (d) { return d.percent });

var sun_svg = d3.select("#sun_donut").append("svg")
    .attr("width", donut_width)
    .attr("height", donut_height)
    .append("g")
    .attr("transform", "translate(" + donut_width / 2 + "," + donut_height/ 2 + ")");

var water_svg = d3.select("#sun_donut").append("svg")
    .attr("width", donut_width)
    .attr("height", donut_height)
    .append("g")
    .attr("transform", "translate(" + donut_width / 2 + "," +donut_height / 2 + ")");

var wind_svg = d3.select("#sun_donut").append("svg")
    .attr("width", donut_width)
    .attr("height", donut_height)
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

    color.domain(data.columns.slice(1));
    console.log(data);

    sun = sun_svg.selectAll(".arc")
        .data(function (d) { console.log(pie(data[1].pers));return pie(data[1].pers); })
        .enter().append("g")
    sun_circle = sun.append("circle")
        .attr("cx", "0")
        .attr("cy", "0")
        .attr("r", radius - 75)
        .attr("fill", "white")
    sun.append("path")
        .attr("d", arc)
        .style("fill", function (d) { console.log(d);return color(d.data.name) })
        .on("mouseenter", function (data) {
            var select_value = d3.select(this).data()[0].data.name;
            sun_circle
                .attr("opacity", 0.2)
                .style("fill", function (d) {
                    return color(select_value)
                })
            console.log(select_value);
        })
        .on("mouseout", function (d) {
            sun_circle.attr("opacity", 0)
        });
        /*console.log("sun")
        console.log(sun.data());*/


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

    color.domain(data.columns.slice(1));

    console.log(data[1].pers);
    console.log(pie(data[1].pers));
    water = water_svg.selectAll(".arc")
        .attr("class", "arc")
        .data(function (d) { return pie(data[1].pers); })
        .enter().append("g")
    water_circle = water.append("circle")
        .attr("cx", "0")
        .attr("cy", "0")
        .attr("r", radius - 75)
        .attr("fill", "white")
    water.append("path")
        .attr("d", arc)
        .style("fill", function (d) { return color(d.data.name) })
        .on("mouseenter", function (data) {
            var select_value = d3.select(this).data()[0].data.name;
            water_circle
                .attr("opacity", 0.2)
                .style("fill", function (d) {
                    return color(select_value)
                })
            console.log(select_value);
        })
        .on("mouseout", function (d) {
            water_circle.attr("opacity", 0)
        });



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

    color.domain(data.columns.slice(1));


    wind = wind_svg.selectAll(".arc")
        .data(function (d) { return pie(data[1].pers); })
        .enter().append("g")
    wind_circle = wind.append("circle")
        .attr("cx", "0")
        .attr("cy", "0")
        .attr("r", radius - 75)
        .attr("fill", "white")
    wind.append("path")
        .attr("d", arc)
        .style("fill", function (d) { return color(d.data.name) })
        .on("mouseenter", function (data) {
            var select_value = d3.select(this).data()[0].data.name;
            wind_circle
                .attr("opacity", 0.2)
                .style("fill", function (d) {
                    return color(select_value)
                })
            console.log(select_value);
        })
        .on("mouseout", function (d) {
            wind_circle.attr("opacity", 0)
        });
    console.log("wind")
    console.log(wind.data())

})

function update_donut() {
    console.log("enter function")
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
        console.log(pie(data[2].pers));
        sun.data(function (d) { return pie(data[2].pers); })
            .transition().duration(750).attrTween("d", arcTween);

        function arcTween(d) {
            var i = d3.interpolate(this._current, d);
            this._current = i(0);
            return function (t) {
                return arc(i(t))
            }
        }
    })

}
