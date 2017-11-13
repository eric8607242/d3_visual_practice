var margin = { top: 20, right: 80, bottom: 30, left: 50 },
    width = 500 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom,
    radius = Math.min(width, height) / 2;

var arc = d3.arc()
    .outerRadius(radius - 30)
    .innerRadius(radius - 70);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var pie = d3.pie()
    .sort(null)
    .value(function (d) { return d.percent });

var sun_svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var water_svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var wind_svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

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
    if (error) throw error;

    color.domain(data.columns.slice(1));

    console.log(data[1].pers);
    console.log(pie(data[1].pers));
    sun_svg.selectAll(".arc")
        .attr("class", "arc")
        .data(function (d) { return pie(data[1].pers); })
        .enter().append("path")
        .attr("class", "sun_path")
        .attr("d", arc)
        .style("fill", function (d) { return color(d.data.name) })
        .on("mouseenter", function (data) {
            sun_svg.append('circle')
                .attr("class", 'toolCircle')
                .attr('r', radius - 75)
                .attr("opacity", "0.35")
                .style("fill", "blue");
            sun_svg.append("text")
                .attr("class", 'toolCircle')
                .attr("transform", "translate(" + -(radius - 70) / 2 + ",0)")
                .attr("text_anchor", "middle")
                .attr("font-size", "2em")
                .attr("y", 0)
                .text(function (d) {
                    console.log(data.value);
                    return data.value
                });
        })
        .on("mouseout", function (d) {
            d3.selectAll(".toolCircle").remove();
        });
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
    if (error) throw error;

    color.domain(data.columns.slice(1));

    console.log(data[1].pers);
    console.log(pie(data[1].pers));
    water_svg.selectAll(".arc")
        .attr("class", "arc")
        .data(function (d) { return pie(data[1].pers); })
        .enter().append("path")
        .attr("d", arc)
        .style("fill", function (d) { return color(d.data.name) })
        .on("mouseenter", function (data) {
            console.log("111")
            water_svg.append('circle')
                .attr("class", 'toolCircle')
                .attr('r', radius - 75)
                .attr("opacity", "0.35")
                .style("fill", "blue")
            water_svg.append("text")
                .attr("class", 'toolCircle')
                .attr("transform", "translate(" + -(radius - 70) / 2 + ",0)")
                .attr("text_anchor", "middle")
                .attr("font-size", "2em")
                .attr("y", 0)
                .text(function (d) {
                    console.log(data.value);
                    return data.value
                });
        })
        .on("mouseout", function (d) {
            d3.selectAll(".toolCircle").remove();
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
    if (error) throw error;

    color.domain(data.columns.slice(1));


    console.log(pie(data[1].pers));
    wind_svg.selectAll(".arc")
        .attr("class", "test")
        .data(function (d) { return pie(data[1].pers); })
        .enter().append("path")
        .attr("d", arc)
        .style("fill", function (d) { return color(d.data.name) })
        .on("mouseenter", function (data) {
            console.log("111")
            wind_svg.append('circle')
                .attr("class", 'toolCircle')
                .attr('r', radius - 75)
                .attr("opacity", "0.35")
                .style("fill", "blue")
            wind_svg.append("text")
                .attr("class", 'toolCircle')
                .attr("transform", "translate(" + -(radius - 70) / 2 + ",0)")
                .attr("text_anchor", "middle")
                .attr("font-size", "2em")
                .attr("y", 0)
                .text(function (d) {
                    console.log(data.value);
                    return data.value
                });
        })
        .on("mouseout", function (d) {
            d3.selectAll(".toolCircle").remove();
        });

})


