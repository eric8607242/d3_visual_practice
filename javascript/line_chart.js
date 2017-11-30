var margin = { top: 20, right: 80, bottom: 30, left: 50 },
    line_width = screen.availWidth * 0.5 - margin.left - margin.right,
    line_height = screen.availWidth * 0.15 - margin.top - margin.bottom;

var line_svg = d3.select("#line")
    .append("svg")
    .attr("width", line_width + margin.left + margin.right)
    .attr("height", line_height + margin.top + margin.bottom)
    .attr("transform", "translate(" + line_width / 2 + ",0)");

var line_g = line_svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime().range([0, line_width]),
    y = d3.scaleLinear().range([line_height, 0]);

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

var bisectDate = d3.bisector(function (d) { return d.year; }).left;

var renewable_line = d3.line()
    .curve(d3.curveBasis)
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.renewable); });


var cir_move = line_g.append("circle")
    .attr("cx", 100)
    .attr("cy", 0)
    .attr("r", 7)
    .attr("fill", "steelblue")


var line_move = line_g.append("line")
    .attr("x1", 100)
    .attr("y1", 0)
    .attr("x2", 100)
    .attr("y2", line_height)
    .attr("stroke", "steelblue")
    .attr("stroke-width", 3);

d3.csv("./data/his_ele_cate.csv", function (d) {
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

    line_g.append("g")
        .attr("transform", "translate(0," + line_height + ")")
        .call(d3.axisBottom(x))
        .select(".domain");


    line_g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .select(".domain")
        .remove();

    line_g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", "red")
        .attr("stroke-width", 2.5)
        .attr("d", nuclear_line);

    line_g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", "orange")
        .attr("stroke-width", 2.5)
        .attr("d", water_line);

    line_g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", "green")
        .attr("stroke-width", 2.5)
        .attr("d", renewable_line);
    cir_move
        .call(d3.drag()
            .on("start", function (d) { line_move.attr("opacity", 1); })
            .on("drag", dragged)
            .on("end", dragged_end))


    function dragged() {
        var date_x;
        if (d3.mouse(this)[0] >= 0 && d3.mouse(this)[0] <= line_width + 2) {
            date_x = bisectDate(data, x.invert(d3.mouse(this)[0]), 0);
            d3.select(this)
                .attr("cx", d3.mouse(this)[0])
            line_move
                .attr("x1", d3.mouse(this)[0])
                .attr("x2", d3.mouse(this)[0])
            //console.log(data[date_x].year)
            chart_change(data[date_x].year);
        }
    }

    function dragged_end(d) {
        d3.select(this)
            .attr("opacity", 1)
        line_move
            .attr("opacity", 0.5)
    }
})

function chart_change(index) {
    console.log(wind_data)
    for (i = 0; i < wind_data.length; i++) {
        if (wind_data[i].year) {
            if (index === wind_data[i].year) {
                wind.data(function (d) { return pie(wind_data[i].pers); })
                    .enter()
                wind.select("path")
                    .attr("d", arc)
                //console.log(wind.data())
            }
        }
    }
    for (i = 0; i < water_data.length; i++) {
        if (water_data[i].year) {
            if (index === water_data[i].year) {
                water.data(function (d) { return pie(water_data[i].pers); })
                    .enter()
                water.select("path")
                    .attr("d", arc)
                //console.log(water.data())
            }
        }
    }
    for (i = 0; i < sun_data.length; i++) {
        if (sun_data[i].year) {
            if (index === sun_data[i].year) {
                //console.log(pie(sun_data[i].pers))
                sun.data(function (d) { return pie(sun_data[i].pers); })
                    .enter()
                sun.select("path")
                    .attr("d", arc)
                /*console.log("sunchange")
                console.log(sun.data())*/
            }
        }
    }
    for (i = 0; i < bar_data.length; i++) {
        //console.log(bar_data[i].year)
        if (index === bar_data[i].year) {
            bar.selectAll("rect").data(bar_data[i].energy)
                .enter()
            bar.selectAll("rect")
                .transition().duration(500)
                .attr("y", function (d) { return bar_y(d.percent); })
                .attr("height", function (d) { return height - bar_y(d.percent); })
            //console.log(bar.data())
        }
    }
}
