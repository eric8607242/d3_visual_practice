var time_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    time_width = screen.availWidth * 0.8 - time_margin.left - time_margin.right,
    time_height = screen.availWidth * 0.05 - time_margin.top - time_margin.bottom;

var time_svg = d3.select("#time")
    .append("svg")
    .attr("width", time_width + time_margin.left + time_margin.right)
    .attr("height", time_height + time_margin.top + time_margin.bottom)
    .attr("transform", "translate(0,0)")

var time_g = time_svg.append("g").attr("transform", "translate(" + time_margin.left + "," + time_margin.top + ")");
var time_x = d3.scaleTime().range([0, time_width]);

var time_line = time_g.append("line")
    .attr("x1", 0)
    .attr("y1", time_height / 1.5)
    .attr("x2", time_width)
    .attr("y2", time_height / 1.5)
    .attr("stroke", "steelblue")
    .attr("stroke-width", 3);

var choose_circle = 0;
var time_circle_append;
var select_cir_year = 98;
d3.csv("./data/his_ele_cate.csv", function (d) {
    d.year = +d.year;
    return d;
}, function (error, data) {

    time_x.domain(d3.extent(data, function (d) { return d.year; }))//extent 可以獲得最小值和最大值

    var time_circle = time_g.selectAll("time-circle")
        .data(data)
        .enter();

    var time_text = time_g.selectAll("time-text")
        .data(data)
        .enter();

    time_text.append("text")
        .attr("x", function (d) { return time_x(d.year) - 11; })
        .attr("y", time_height / 1.5 + 30)
        .text(function (d) { return d.year; })

    time_circle_append = time_circle.append("circle")
        .attr("r", 10)
        .attr("cy", time_height / 1.5)
        .attr("cx", function (d) { return time_x(d.year); })
        .on("mouseenter", function (d) {
            var select_cir = d3.select(this)
            select_cir_year = d3.select(this).data()[0].year;
            check_circle_choose(select_cir)
            chart_change(select_cir_year);

        });
})
function check_circle_choose(select_cir) {
    if (choose_circle == 0) {
        choose_circle = select_cir.data()[0].year;
        select_cir
            .attr("r", 20)
    } else if (choose_circle != 0 && choose_circle != select_cir) {
        choose_circle = select_cir.data()[0].year;
        time_circle_append.attr("r", 10)
        select_cir
            .attr("r", 20)
    }
}

function chart_change(index) {

    for (i = 0; i < wind_data.length; i++) {
        if (wind_data[i].year) {
            if (index === wind_data[i].year) {
                wind.select(".text_remove_wind").remove();
                wind.data(function (d) { return pie(wind_data[i].pers); })
                    .enter()
                wind.select("path")
                    .attr("d", arc)

                wind.append("text")
                    .attr("class", "text_remove_wind")
                    .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
                    .attr("dy", ".35em")
                    .attr("text-anchor", "middle")
                    .text(function (d) { return d.data.name; });
                //console.log(wind.data())
            }
        }
    }
    for (i = 0; i < water_data.length; i++) {
        if (water_data[i].year) {
            if (index === water_data[i].year) {
                water.select(".text_remove_water").remove();
                water.data(function (d) { return pie(water_data[i].pers); })
                    .enter()
                water.select("path")
                    .attr("d", arc)
                water.append("text")
                    .attr("class", "text_remove_water")
                    .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
                    .attr("dy", ".35em")
                    .attr("text-anchor", "middle")
                    .text(function (d) { return d.data.name; });
                //console.log(water.data())
            }
        }
    }
    for (i = 0; i < sun_data.length; i++) {
        if (sun_data[i].year) {
            if (index === sun_data[i].year) {
                //console.log(pie(sun_data[i].pers))
                sun.select(".text_remove_sun").remove();
                sun.data(function (d) { return pie(sun_data[i].pers); })
                    .enter()
                sun.select("path")
                    .attr("d", arc)
                sun.append("text")
                    .attr("class", "text_remove_sun")
                    .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
                    .attr("dy", ".35em")
                    .attr("text-anchor", "middle")
                    .text(function (d) { return d.data.name; });
                /*console.log("sunchange")
                console.log(sun.data())*/
            }
        }
    }

    for (i = 0; i < scale_data.length; i++) {
        if (index === scale_data[i].year) {
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
        }
    }

    for (i = 0; i < cate_data.length; i++) {
        if (index == cate_data[i].year) {
            cate.data(function (d) { return cate_pie(cate_data[i].energy); })
                .enter();
            cate.select("path")
                .attr("d", cate_arc);
        }
    }

}