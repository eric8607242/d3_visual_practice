var margin = { top: 20, right: 80, bottom: 30, left: 50 },
    japan_line_width = 600 - margin.left - margin.right,
    japan_line_height = 300 - margin.top - margin.bottom;



var japan_line_svg = d3.select("#cate")
    .append("svg")
    .attr("class", "linesvg")
    .attr("width", japan_line_width + margin.left + margin.right)
    .attr("height", japan_line_height + margin.top + margin.bottom)
    .attr("transform", "translate(0,-100)");

var japan_line_g = japan_line_svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime().range([0, japan_line_width]),
    y = d3.scaleLinear().range([japan_line_height, 0]);

var fire_line = d3.line()
    //.curve(d3.curveBasis)
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.fire); });

var nuclear_line = d3.line()
    //.curve(d3.curveBasis)
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.nuclear); });

var scale_water_line = d3.line()
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.water); });

var renewable_line = d3.line()
    //.curve(d3.curveBasis)
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.renewable); });



var bisectDate = d3.bisector(function (d) { return d.year; }).left;

var cir_move = japan_line_g.append("circle")
    .attr("cx", 100)
    .attr("cy", 0)
    .attr("r", 0)
    .attr("fill", "steelblue")


var japan_line_move = japan_line_g.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", japan_line_height)
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2);


var circle;
var temp;
d3.csv("./data/日本各項電力.csv", function (d) {
    d.year = +d.year;
    d.fire = +d.fire;
    d.nuclear = +d.nuclear;
    d.water = +d.water;
    d.renewable = +d.renewable;
    return d;
}, function (error, data) {
    console.log(data)

    x.domain(d3.extent(data, function (d) { return d.year; }));
    y.domain([0, d3.max(data, function (d) {
        return Math.max(d.fire, d.nuclear, d.water, d.renewable);
    })]);


    var japan_line_bottom = japan_line_g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + japan_line_height + ")")
        .call(d3.axisBottom(x))
        .select(".domain");


    japan_line_g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .select(".domain")
        .remove();

    japan_line_g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "nuclear_line")
        .attr("stroke", "#354872")
        .attr("stroke-width", 2.5)
        .attr("d", nuclear_line);

    var fire = japan_line_g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "fire_line")
        .attr("stroke", "#A51C1E")
        .attr("stroke-width", 2.5)
        .attr("d", fire_line);

    japan_line_g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "water_line")
        .attr("stroke", "#EBAD30")
        .attr("stroke-width", 2.5)
        .attr("d", scale_water_line);

    japan_line_g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "renewable_line")
        .attr("stroke", "#568D4B")
        .attr("stroke-width", 2.5)
        .attr("d", renewable_line);


    circle = japan_line_g.selectAll("line-circle")
        .attr("class", "circle_line")
        .data(data)
        .enter();

    temp = circle.append("circle")
        .attr("class", "water_cir")
        .attr("r", 4)
        .attr("cx", function (d) { return x(d.year); })
        .attr("cy", function (d) { return y(d.water); });

    circle.append("circle")
        .attr("r", 4)
        .attr("cx", function (d) { return x(d.year); })
        .attr("cy", function (d) { return y(d.fire); });

    circle.append("circle")
        .attr("r", 4)
        .attr("cx", function (d) { return x(d.year); })
        .attr("cy", function (d) { return y(d.nuclear); });

    circle.append("circle")
        .attr("r", 4)
        .attr("cx", function (d) { return x(d.year); })
        .attr("cy", function (d) { return y(d.renewable); });

    cir_move
        .call(d3.drag()
            .on("start", function (d) { japan_line_move.attr("opacity", 1); })
            .on("drag", dragged)
            .on("end", dragged_end))



    var touch_rect = japan_line_g.append('rect')
        .attr('width', japan_line_width) // can't catch mouse events on a g element
        .attr('height', japan_line_height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on("mouseover", function (d) {
            date_x = bisectDate(data, x.invert(d3.mouse(this)[0]), 0);
            for (i = 0; i < scale_stack_data.length; i++) {
                if (d3.mouse(this)[0] < x(97 + i) + 20 && d3.mouse(this)[0] > x(97 + i) - 20) {
                    scale_japan_change(i)
                }
            }
            japan_line_move
                .attr("x1", d3.mouse(this)[0])
                .attr("x2", d3.mouse(this)[0])
        })
        .on("mousemove", function (d) {
            date_x = bisectDate(data, x.invert(d3.mouse(this)[0]), 0);
            console.log(data[date_x].year);
            for (i = 0; i < scale_stack_data.length; i++) {
                if (d3.mouse(this)[0] < x(97 + i) + 20 && d3.mouse(this)[0] > x(97 + i) - 20) {
                    scale_japan_change(i)
                }
            }
            japan_line_move
                .attr("x1", d3.mouse(this)[0])
                .attr("x2", d3.mouse(this)[0])
        })
    console.log(info_rect._groups["0"]["0"].attributes[5].value);

    function dragged() {
        var date_x;
        if (d3.mouse(this)[0] >= 0 && d3.mouse(this)[0] <= japan_line_width + 2) {
            // date_x = bisectDate(data, x.invert(d3.mouse(this)[0]), 0);
            // d3.select(this)
            //     .attr("cx", d3.mouse(this)[0])
            japan_line_move
                .attr("x1", d3.mouse(this)[0])
                .attr("x2", d3.mouse(this)[0])

            //console.log(data[date_x].year)
            //chart_change(data[date_x].year);
        }
    }

    function dragged_end(d) {
        d3.select(this)
            .attr("opacity", 1)
        japan_line_move
            .attr("opacity", 0.5)
    }

})

function scale_japan_change(index) {
    if (scale_stack_now_index != index) {
        var year_now = index + 97   
        scale_stack_now_index = index;
        console.log(japan_scale_data)
        for (i = 0; i < japan_scale_data.length; i++) {
            if (index + 97 === japan_scale_data[i].year) {
                japan_scale_total = 0;
                for (j = 0; j < japan_scale_data[i].energy.length; j++) {
                    japan_scale_total = japan_scale_data[i].energy[j].percent + japan_scale_total;

                }
                console.log(japan_scale_total);
                console.log(japan_scale_pie(japan_scale_data[i].energy));
                japan_scale.data(function (d) { return japan_scale_pie(japan_scale_data[i].energy); })
                    .enter();
                japan_scale.select("path")
                    .attr("d", japan_scale_arc);
                japan_scale_text_year.text("民國" + year_now + "年")
                var select_value = japan_scale_data[index].energy[choose_ener].percent;
                console.log(select_value)
                var select_value_per = +((select_value / japan_scale_total) * 100);
                japan_scale_text.text(Math.round(select_value_per) + "％")
                japan_pol_text.remove();
                japan_scale.selectAll("polyline").remove();
                japan_polyline = japan_scale.append('polyline')
                    .attr('points', japan_calculatePoints)
                    .attr("fill", "none")
                    .attr("stroke", "black")
                    .attr("stroke-width", "2px");
                japan_pol_text = japan_scale.append("text")
                    //.attr("transform", function (d) { return "translate(" + japan_scale_text_arc.centroid(d) + ")"; })
                    .attr("font-size", "15px")
                    //.attr("text-anchor", "middle")
                    .attr('transform', japan_labelTransform)
                    .style('text-anchor', function (d) {
                        // if slice centre is on the left, anchor text to start, otherwise anchor to end
                        return (japan_midAngle(d)) < Math.PI ? 'start' : 'end';
                    })
                    .text(function (d) {
                        if (d.data.name == "renewable") {
                            return "再生能源"
                        } else if (d.data.name == "nuclear") {
                            return "核能"
                        } else if (d.data.name == "fire") {
                            return "火力"
                        } else {
                            return "抽蓄水力"
                        }
                    });
            }
        }
    }
}
