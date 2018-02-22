var margin = { top: 20, right: 80, bottom: 30, left: 50 },
    line_width = 600 - margin.left - margin.right,
    line_height = 300 - margin.top - margin.bottom;



var line_svg = d3.select("#cate")
    .append("svg")
    .attr("class", "linesvg")
    .attr("width", line_width + margin.left + margin.right)
    .attr("height", line_height + margin.top + margin.bottom)
    .attr("transform", "translate(0,-100)");

var line_g = line_svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime().range([0, line_width]),
    y = d3.scaleLinear().range([line_height, 0]);

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

var cir_move = line_g.append("circle")
    .attr("cx", 100)
    .attr("cy", 0)
    .attr("r", 0)
    .attr("fill", "steelblue")


var line_move = line_g.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", line_height)
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2);


var circle;
var temp;
d3.csv("./data/his_ele_cate.csv", function (d) {
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


    var line_bottom = line_g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + line_height + ")")
        .call(d3.axisBottom(x))
        .select(".domain").text("Price ($)");

    line_g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", "0.7em")
        .attr("font-size", "90%")
        .attr("text-anchor", "end")
        .text("單位(億度)");

        line_g.append("text")
        .attr("transform", "translate(-10,2)")
        .attr("dy", "27.5em")
        .attr("font-size", "60%")
        .attr("text-anchor", "end")
        .text("年");

    line_g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .select(".domain")
        .remove().text("Price ($)");;

    line_g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "nuclear_line")
        .attr("stroke", "#354872")
        .attr("stroke-width", 2.5)
        .attr("d", nuclear_line);

    var fire = line_g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "fire_line")
        .attr("stroke", "#A51C1E")
        .attr("stroke-width", 2.5)
        .attr("d", fire_line);

    line_g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "water_line")
        .attr("stroke", "#EBAD30")
        .attr("stroke-width", 2.5)
        .attr("d", scale_water_line);

    line_g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "renewable_line")
        .attr("stroke", "#568D4B")
        .attr("stroke-width", 2.5)
        .attr("d", renewable_line);


    circle = line_g.selectAll("line-circle")
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
            .on("start", function (d) { line_move.attr("opacity", 1); })
            .on("drag", dragged)
            .on("end", dragged_end))



    var touch_rect = line_g.append('rect')
        .attr('width', line_width) // can't catch mouse events on a g element
        .attr('height', line_height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on("mouseover", function (d) {
            date_x = bisectDate(data, x.invert(d3.mouse(this)[0]), 0);
            for (i = 0; i < scale_stack_data.length; i++) {
                if (d3.mouse(this)[0] < x(97 + i) + 20 && d3.mouse(this)[0] > x(97 + i) - 20) {
                    scale_stack_change(i)
                }
            }
            line_move
                .attr("x1", d3.mouse(this)[0])
                .attr("x2", d3.mouse(this)[0])
        })
        .on("mousemove", function (d) {
            date_x = bisectDate(data, x.invert(d3.mouse(this)[0]), 0);
            console.log(data[date_x].year);
            for (i = 0; i < scale_stack_data.length; i++) {
                if (d3.mouse(this)[0] < x(97 + i) + 20 && d3.mouse(this)[0] > x(97 + i) - 20) {
                    scale_stack_change(i)
                }
            }
            line_move
                .attr("x1", d3.mouse(this)[0])
                .attr("x2", d3.mouse(this)[0])
        })
    console.log(info_rect._groups["0"]["0"].attributes[5].value);

    function dragged() {
        var date_x;
        if (d3.mouse(this)[0] >= 0 && d3.mouse(this)[0] <= line_width + 2) {
            // date_x = bisectDate(data, x.invert(d3.mouse(this)[0]), 0);
            // d3.select(this)
            //     .attr("cx", d3.mouse(this)[0])
            line_move
                .attr("x1", d3.mouse(this)[0])
                .attr("x2", d3.mouse(this)[0])

            //console.log(data[date_x].year)
            //chart_change(data[date_x].year);
        }
    }

    function dragged_end(d) {
        d3.select(this)
            .attr("opacity", 1)
        line_move
            .attr("opacity", 0.5)
    }

})
function change_to_japan() {

    d3.csv("./data/日本各項電力.csv", function (d) {
        d.year = +d.year;
        d.fire = +d.fire;
        d.nuclear = +d.nuclear;
        d.water = +d.water;
        d.renewable = +d.renewable;
        return d;
    }, function (error, data) {
        console.log(data);
        x.domain(d3.extent(data, function (d) { return d.year; }));
        y.domain([0, d3.max(data, function (d) {
            return Math.max(d.fire, d.nuclear, d.water, d.renewable);
        })]);
        console.log("-----------------------------")
        var select_svg = d3.select(".linesvg").transition();
        select_svg.select(".x.axis") // change the x axis
            .duration(750)
            .call(d3.axisBottom(x));
        select_svg.select(".y.axis") // change the y axis
            .duration(750)
            .call(d3.axisLeft(y));
        select_svg.select(".nuclear_line").duration(750).attr("d", nuclear_line(data));
        select_svg.select(".fire_line").duration(750).attr("d", fire_line(data));
        select_svg.select(".water_line").duration(750).attr("d", scale_water_line(data));
        select_svg.select(".renewable_line").duration(750).attr("d", renewable_line(data));

        line_g.selectAll("circle").remove()
        circle = line_g.selectAll("line-circle")
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
            .attr("cy", function (d) { return y(d.renewable); })


    })
}

function change_to_tai() {

    d3.csv("./data/his_ele_cate.csv", function (d) {
        d.year = +d.year;
        d.fire = +d.fire;
        d.nuclear = +d.nuclear;
        d.water = +d.water;
        d.renewable = +d.renewable;
        return d;
    }, function (error, data) {
        console.log(data);
        x.domain(d3.extent(data, function (d) { return d.year; }));
        y.domain([0, d3.max(data, function (d) {
            return Math.max(d.fire, d.nuclear, d.water, d.renewable);
        })]);
        console.log("-----------------------------")
        var select_svg = d3.select(".linesvg").transition();
        select_svg.select(".x.axis") // change the x axis
            .duration(750)
            .call(d3.axisBottom(x));
        select_svg.select(".y.axis") // change the y axis
            .duration(750)
            .call(d3.axisLeft(y));
        select_svg.select(".nuclear_line").duration(750).attr("d", nuclear_line(data));
        select_svg.select(".fire_line").duration(750).attr("d", fire_line(data));
        select_svg.select(".water_line").duration(750).attr("d", scale_water_line(data));
        select_svg.select(".renewable_line").duration(750).attr("d", renewable_line(data));

        line_g.selectAll("circle").remove()
        circle = line_g.selectAll("line-circle")
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
            .attr("cy", function (d) { return y(d.renewable); })


    })
}
function scale_stack_change(index) {
    if (scale_stack_now_index != index) {
        scale_stack_rect.data(scale_stack_data[index].energy).enter()

        scale_stack_rect.select("rect")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("x", function (d) { return scale_stack_x(d.pre_per); })
            .attr("y", 100)
            .attr("height", 50)
            .attr("width", function (d) { return scale_stack_x(d.percent); })
        scale_stack_text_fire.text(function (d) {

            return "火力：" + Math.round(scale_stack_data[index].energy[0].percent) + "億度"
        })
        scale_stack_text_water.text(function (d) {

            return "抽蓄水力：" + Math.round(scale_stack_data[index].energy[2].percent) + "億度"
        })
        scale_stack_text_nuclear.text(function (d) {

            return "核能：" + Math.round(scale_stack_data[index].energy[1].percent) + "億度"
        })
        scale_stack_text_renewable.text(function (d) {

            return "再生能源：" + Math.round(scale_stack_data[index].energy[3].percent) + "億度"
        })
        var year_now = index + 97
        scale_stack_title.text("民國" + year_now + "年")
        scale_stack_now_index = index;

        for (i = 0; i < scale_data.length; i++) {
            if (index + 97 === scale_data[i].year) {
                scale_total = 0;
                for (j = 0; j < scale_data[i].energy.length; j++) {
                    scale_total = scale_data[i].energy[j].percent + scale_total;

                }
                console.log(scale_total);
                console.log(scale_pie(scale_data[i].energy));
                scale.data(function (d) { return scale_pie(scale_data[i].energy); })
                    .enter();
                scale.select("path")
                    .attr("d", scale_arc);
                scale_text_year.text("民國" + year_now + "年")
                var select_value = scale_data[index].energy[choose_ener].percent;
                console.log(select_value)
                var select_value_per = +((select_value / scale_total) * 100);
                scale_text.text(Math.round(select_value_per) + "％")
            }
        }

    }
}
