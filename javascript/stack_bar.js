var stack_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    stack_width = 1200 - stack_margin.left - stack_margin.right,
    stack_height = 200 - stack_margin.top - stack_margin.bottom;

var stack_svg = d3.select("#cate")
    .append("svg")
    .attr("width", stack_width + stack_margin.left + stack_margin.right)
    .attr("height", stack_height + stack_margin.top + stack_margin.bottom)
    //.attr("transform", "translate（1000,0)")
    .append("g")

var stack_x = d3.scaleLinear()
    .rangeRound([0, stack_width - 150]);

var stack_y = d3.scaleLinear()
    .rangeRound([0, stack_height]);

var stack_z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
var pre_percent = 0;
var pre_total = 0;
var stack_data;
var stack_rect;
var stack_now_index = 0;
var stack_text_water;
var stack_text_wind;
var stack_text_solar;
var stack_text_gar;
var stack_text_bio;
var stack_title;
d3.csv("./data/energy_type.csv", function (d, i, columns) {
    pre_percent = 0;
    pre_total = 0;
    return {
        year: +d.year,
        energy: columns.slice(1).map(function (key) {
            var temp = pre_percent;
            pre_total = pre_total + pre_percent;
            pre_percent = +d[key];
            return {
                name: key,
                percent: +d[key],
                pre_per: pre_total
            }
        })
    };
}, function (error, data) {
    stack_data = data;
    var max_percent = 0;
    var year_total_percent = 0;
    for (i = 0; i < data.length; i++) {

        for (j = 0; j < data[i].energy.length; j++) {
            year_total_percent = year_total_percent + data[i].energy[j].percent;
        }
        if (year_total_percent > max_percent) {
            max_percent = year_total_percent;
        }
        year_total_percent = 0;
    }

    stack_x.domain([0, max_percent])
    stack_y.domain([0, max_percent])

    stack_title = stack_svg.append("text")
        .attr("transform", "translate(60,0)")
        .attr("dy", "2.0em")
        .attr("font-size", "1.5em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("民國97年")
    var stack_info = stack_svg.append("rect")
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("x", stack_width - 130)
        .attr("y", 10)
        .attr("width", 150)
        .attr("height", 180)
        .attr("opacity", 0.3)
        .attr("fill", "lightgray")
        .style("stroke", "black")
        .style("stroke-width", "5px")

    stack_text_water = stack_svg.append("text")
        .attr("transform", "translate(1015,0)")
        .attr("dy", "2.0em")
        .attr("font-size", "0.9em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(function (d) {

            return "水力：" + Math.round(data[0].energy[2].percent / 1000000) + "百萬度"
        })
    stack_text_wind = stack_svg.append("text")
        .attr("transform", "translate(1015,0)")
        .attr("dy", "4.0em")
        .attr("font-size", "0.9em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(function (d) {

            return "風力：" + Math.round(data[0].energy[0].percent / 1000000) + "百萬度"
        })
    stack_text_solar = stack_svg.append("text")
        .attr("transform", "translate(1015,0)")
        .attr("dy", "6.0em")
        .attr("font-size", "0.9em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(function (d) {

            return "太陽能：" + Math.round(data[0].energy[1].percent / 1000000) + "百萬度"
        })
    stack_text_gar = stack_svg.append("text")
        .attr("transform", "translate(1015,0)")
        .attr("dy", "8.0em")
        .attr("font-size", "0.9em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(function (d) {

            return "垃圾沼氣：" + Math.round(data[0].energy[4].percent / 1000000) + "百萬度"
        })
    stack_text_bio = stack_svg.append("text")
        .attr("transform", "translate(1015,0)")
        .attr("dy", "10.0em")
        .attr("font-size", "0.9em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(function (d) {

            return "生質能：" + Math.round(data[0].energy[3].percent / 1000000) + "百萬度"
        })
    stack_rect = stack_svg.append("g")
        .selectAll("g")
        .attr("class", "stack")
        .data(data[0].energy)
        .enter().append("g")
        .style("fill", function (d) { return stack_z(d.name); })

    var stack_bar = stack_rect.append("rect")
        .style("opacity", 0.7)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("x", function (d) { return stack_x(d.pre_per); })
        .attr("y", 100)
        .attr("height", 50)
        .attr("width", function (d) { return stack_x(d.percent) - 2; })
        .on("mouseenter", function (data) {
            stack_bar.style("opacity", 0.7)
            d3.select(this)
                .style("opacity", 1)
        });
    ;

    var stack_intro = stack_svg.append("g")
        .selectAll("g")
        .attr("class", "stack")
        .data(data[0].energy)
        .enter().append("g")
        .style("fill", function (d) { return stack_z(d.name); })

    stack_intro.append("rect")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("x", 800)
        .attr("y", function (d, i) { return i * 16; })
        .attr("height", 15)
        .attr("width", 15)
        ;
    stack_intro.append("text")
        .attr("x", 820)
        .attr("y", function (d, i) { return i * 16; })
        .attr("dy", ".85em")
        .attr("fill", "black")
        .attr("font-size", "0.8em")
        .style("text-anchor", "start")
        .text(function (d, i) {
            switch (i) {
                case 0: return "風力";
                case 1: return "太陽能";
                case 2: return "水力";
                case 3: return "生質能";
                case 4: return "垃圾沼氣";
            }
        });
})