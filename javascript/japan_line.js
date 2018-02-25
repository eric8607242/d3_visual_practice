
var japan_line_svg = d3.select("#cate")
    .append("svg")
    .attr("width", line_width + margin.left + margin.right)
    .attr("height", line_height + margin.top + margin.bottom)
    .attr("transform", "translate(0,-100)");

var japan_line_g = japan_line_svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var cir_move = japan_line_g.append("circle")
    .attr("cx", 100)
    .attr("cy", 0)
    .attr("r", 0)
    .attr("fill", "steelblue")


var japan_line_move = japan_line_g.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", line_height)
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2);


var circle;
var temp;

function japan_line_defaultsetting() {
    return {
        nuclear_color: "#354872",
        fire_color: "#A51C1E",
        scale_water_color: "#EBAD30",
        renewable_color: "#568D4B",
        circle_r: 4,
        axis_y_unit: "單位(千億度)",
        axis_x_unit: "年",
        check_range: 20,
        init_year: 97

    };
}


d3.csv("./data/日本各項電力.csv", function (d) {
    d.year = +d.year;
    d.fire = +d.fire;
    d.nuclear = +d.nuclear;
    d.water = +d.water;
    d.renewable = +d.renewable;
    return d;
}, function (error, data) {
    var config = japan_line_defaultsetting();
    line_chart_create(japan_line_g, data,config);

    var touch_rect = japan_line_g.append('rect')
        .attr('width', line_width) // can't catch mouse events on a g element
        .attr('height', line_height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on("mouseover", function (d) {
            japan_mouse_enent(data, d3.mouse(this)[0])

        })
        .on("mousemove", function (d) {
            japan_mouse_enent(data, d3.mouse(this)[0])

        })

})

function japan_mouse_enent(data, mouse) {
    date_x = bisectDate(data, x.invert(mouse), 0);
    for (i = 0; i < scale_stack_data.length; i++) {
        if (mouse < x(97 + i) + 20 && mouse > x(97 + i) - 20) {
            scale_japan_change(i)
        }
    }
    line_move(japan_line_move, mouse)
}

function line_chart_create(create_g, data,config) {
    
    x.domain(d3.extent(data, function (d) { return d.year; }));
    y.domain([0, d3.max(data, function (d) {
        return Math.max(d.fire, d.nuclear, d.water, d.renewable);
    })]);

    create_x_axis(create_g, x, line_height);
    create_y_axis(create_g, y);


    create_g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", "0.7em")
        .attr("font-size", "90%")
        .attr("text-anchor", "end")
        .text(config.axis_y_unit);
    create_g.append("text")
        .attr("transform", "translate(-10,2)")
        .attr("dy", "27.5em")
        .attr("font-size", "60%")
        .attr("text-anchor", "end")
        .text(config.axis_x_unit);

    create_chart_line(create_g, nuclear_line, config.nuclear_color, data);
    create_chart_line(create_g, fire_line, config.fire_color, data);
    create_chart_line(create_g, scale_water_line, config.scale_water_color, data);
    create_chart_line(create_g, renewable_line, config.renewable_color, data);



    circle = create_g.selectAll("line-circle")
        .attr("class", "circle_line")
        .data(data)
        .enter();

    create_circle(circle, scale_water_line.x(), scale_water_line.y(), config.circle_r);
    create_circle(circle, fire_line.x(), fire_line.y(), config.circle_r);
    create_circle(circle, nuclear_line.x(), nuclear_line.y(), config.circle_r);
    create_circle(circle, renewable_line.x(), renewable_line.y(), config.circle_r);



}


function scale_japan_change(index) {
    if (scale_stack_now_index != index) {
        var year_now = index + 97
        scale_stack_now_index = index;
        for (i = 0; i < japan_scale_data.length; i++) {
            if (index + 97 === japan_scale_data[i].year) {
                japan_scale_total = 0;
                for (j = 0; j < japan_scale_data[i].energy.length; j++) {
                    japan_scale_total = japan_scale_data[i].energy[j].percent + japan_scale_total;

                }
                japan_scale.data(function (d) { return japan_scale_pie(japan_scale_data[i].energy); })
                    .enter();
                japan_scale.select("path")
                    .attr("d", japan_scale_arc);
                japan_scale_text_year.text("民國" + year_now + "年")
                var select_value = japan_scale_data[index].energy[japan_choose].percent;
                var select_value_per = calculate_percent(select_value, japan_scale_total)
                text_update(japan_scale_text, Math.round(select_value_per) + "%")
                text_update(japan_scale_text_year, "民國" + year_now + "年")
                japan_pol_text.remove();
                japan_scale.selectAll("polyline").remove();
                japan_polyline = japan_scale.append('polyline')
                    .attr('points', calculatePoints)
                    .attr("fill", "none")
                    .attr("stroke", "black")
                    .attr("stroke-width", "2px");
                japan_pol_text = japan_scale.append("text")
                    .attr("font-size", "15px")
                    .attr('transform', labelTransform)
                    .style('text-anchor', function (d) {
                        // if slice centre is on the left, anchor text to start, otherwise anchor to end
                        return (midAngle(d)) < Math.PI ? 'start' : 'end';
                    })
                    .text(function (d) {
                        return select_scale_name(d.data.name);
                    });
            }
        }
    }
}
