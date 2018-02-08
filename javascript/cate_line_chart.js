var cate_line_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    cate_line_width = 800 - cate_line_margin.left - cate_line_margin.right,
    cate_line_height = 300 - cate_line_margin.top - cate_line_margin.bottom;

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
    .y(function (d) { return cate_line_y(d.wind / 1000000); });

var solar_line = d3.line()
    //.curve(d3.curveBasis)
    .x(function (d) { return cate_line_x(d.year); })
    .y(function (d) { return cate_line_y(d.solar / 1000000); });

var water_line = d3.line()
    //.curve(d3.curveBasis)
    .x(function (d) { return cate_line_x(d.year); })
    .y(function (d) { return cate_line_y(d.water / 1000000); });

var bio_line = d3.line()
    //.curve(d3.curveBasis)
    .x(function (d) { return cate_line_x(d.year); })
    .y(function (d) { return cate_line_y(d.bio / 1000000 + 30); });

var gar_line = d3.line()
    //.curve(d3.curveBasis)
    .x(function (d) { return cate_line_x(d.year); })
    .y(function (d) { return cate_line_y(d.gar / 1000000); });
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
        return Math.max(d.water, d.solar, d.wind, d.bio, d.gar) / 1000000;
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

    cate_circle = cate_line_g.selectAll("cate-line-circle")
        .data(data)
        .enter();
    cate_circle.append("circle")
        .attr("r", 4)
        .attr("cx", function (d) { return cate_line_x(d.year); })
        .attr("cy", function (d) { return cate_line_y(d.solar / 1000000); });

    cate_circle.append("circle")
        .attr("r", 4)
        .attr("cx", function (d) { return cate_line_x(d.year); })
        .attr("cy", function (d) { return cate_line_y(d.water / 1000000); });
    cate_circle.append("circle")
        .attr("r", 4)
        .attr("cx", function (d) { return cate_line_x(d.year); })
        .attr("cy", function (d) { return cate_line_y(d.wind / 1000000); });
    cate_circle.append("circle")
        .attr("r", 4)
        .attr("cx", function (d) { return cate_line_x(d.year); })
        .attr("cy", function (d) { return cate_line_y(d.bio / 1000000); });
    cate_circle.append("circle")
        .attr("r", 4)
        .attr("cx", function (d) { return cate_line_x(d.year); })
        .attr("cy", function (d) { return cate_line_y(d.gar / 1000000); });

    var cate_line_move = cate_line_g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", cate_line_height)
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);

    var cate_touch_rect = cate_line_g.append('rect')
        .attr('width', cate_line_width) // can't catch mouse events on a g element
        .attr('height', cate_line_height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on("mouseover", function (d) {
            for(i = 0 ; i < stack_data.length;i++){
                if(d3.mouse(this)[0] <cate_line_x(97+i)+10&&d3.mouse(this)[0] >cate_line_x(97+i)-10){
                    stack_bar_change(i)
                }
            }
            date_x = bisectDate(data, x.invert(d3.mouse(this)[0]), 0);
            cate_line_move
                .attr("x1", d3.mouse(this)[0])
                .attr("x2", d3.mouse(this)[0])
        })
        .on("mousemove", function (d) {
            for(i = 0 ; i < stack_data.length;i++){
                if(d3.mouse(this)[0] <cate_line_x(97+i)+10&&d3.mouse(this)[0] >cate_line_x(97+i)-10){
                    stack_bar_change(i)
                }
            }
            date_x = bisectDate(data, x.invert(d3.mouse(this)[0]), 0);
            if (date_x > 3) {
            } else {
            }
            
            cate_line_move
                .attr("x1", d3.mouse(this)[0])
                .attr("x2", d3.mouse(this)[0])
        })
})

function stack_bar_change(index) {
    if (index != stack_now_index) {
        stack_rect.data(stack_data[index].energy).enter()

        stack_rect.select("rect")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("x", function (d) { return stack_x(d.pre_per); })
            .attr("y", 100)
            .attr("height", 50)
            .attr("width", function (d) { return stack_x(d.percent); })
            ;
        stack_text_water.text(function (d) {

            return "水力：" + Math.round(stack_data[index].energy[2].percent / 1000000) + "百萬度"
        })
        stack_text_wind.text(function (d) {

            return "風力：" + Math.round(stack_data[index].energy[0].percent / 1000000) + "百萬度"
        })
        stack_text_solar.text(function (d) {

            return "太陽能：" + Math.round(stack_data[index].energy[1].percent / 1000000) + "百萬度"
        })
        stack_text_gar.text(function (d) {

            return "垃圾沼氣：" + Math.round(stack_data[index].energy[4].percent / 1000000) + "百萬度"
        })
        stack_text_bio.text(function (d) {

            return "生質能：" + Math.round(stack_data[index].energy[3].percent / 1000000) + "百萬度"
        })
        var year_stack =index +97 
        stack_title.text("民國"+year_stack+"年")
        stack_now_index = index;
    }
}