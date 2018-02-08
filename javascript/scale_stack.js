var scale_stack_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    scale_stack_width = 1200 - scale_stack_margin.left - scale_stack_margin.right,
    scale_stack_height = 200 - scale_stack_margin.top - scale_stack_margin.bottom;

var scale_stack_svg = d3.select("#scale")
    .append("svg")
    .attr("width", scale_stack_width + scale_stack_margin.left + scale_stack_margin.right)
    .attr("height", scale_stack_height + scale_stack_margin.top + scale_stack_margin.bottom)
    //.attr("transform", "translate（1000,0)")
    .append("g")

var scale_stack_x = d3.scaleLinear()
    .rangeRound([0, scale_stack_width - 150]);

var scale_stack_y = d3.scaleLinear()
    .rangeRound([0, scale_stack_height]);

var scale_stack_z = d3.scaleOrdinal()
    .range(["#A51C1E", "#354872", "#EBAD30", "	#568D4B"]);
var pre_percent = 0;
var pre_total = 0;
var scale_stack_data;
var scale_stack_rect;
var scale_stack_now_index = 0;
var scale_stack_text_fire;
var scale_stack_text_nuclear;
var scale_stack_text_water;
var scale_stack_text_renewable;
var scale_stack_text_bio;
var scale_stack_title;
var choose_ener = 5;

d3.csv("./data/his_ele_cate.csv", function (d, i, columns) {
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
    scale_stack_data = data;
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

    //console.log(data.map(function (d) { return d.energy.name }))
    console.log(data[8])
    scale_stack_x.domain([0, max_percent])
    scale_stack_y.domain([0, max_percent])

    scale_stack_title = scale_stack_svg.append("text")
        .attr("transform", "translate(60,0)")
        .attr("dy", "2.0em")
        .attr("font-size", "1.5em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("民國97年")
    var scale_stack_info = scale_stack_svg.append("rect")
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("x", scale_stack_width - 130)
        .attr("y", 10)
        .attr("width", 150)
        .attr("height", 180)
        .attr("opacity", 0.3)
        .attr("fill", "lightgray")
        .style("stroke", "black")
        .style("stroke-width", "5px")

    scale_stack_text_fire = scale_stack_svg.append("text")
        .attr("transform", "translate(1015,0)")
        .attr("dy", "2.0em")
        .attr("font-size", "0.9em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(function (d) {

            return "火力：" + Math.round(data[0].energy[0].percent) + "億度"
        })
    scale_stack_text_nuclear = scale_stack_svg.append("text")
        .attr("transform", "translate(1015,0)")
        .attr("dy", "4.0em")
        .attr("font-size", "0.9em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(function (d) {

            return "核能：" + Math.round(data[0].energy[1].percent) + "億度"
        })
    scale_stack_text_water = scale_stack_svg.append("text")
        .attr("transform", "translate(1015,0)")
        .attr("dy", "6.0em")
        .attr("font-size", "0.9em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(function (d) {

            return "抽蓄水力：" + Math.round(data[0].energy[2].percent) + "億度"
        })
    scale_stack_text_renewable = scale_stack_svg.append("text")
        .attr("transform", "translate(1015,0)")
        .attr("dy", "8.0em")
        .attr("font-size", "0.9em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text(function (d) {

            return "再生能源：" + Math.round(data[0].energy[3].percent) + "億度"
        })
    scale_stack_rect = scale_stack_svg.append("g")
        .selectAll("g")
        .attr("class", "scale_stack")
        .data(data[0].energy)
        .enter().append("g")
        .style("fill", function (d) { return scale_stack_z(d.name); })

    scale_stack_rect.append("rect")
        .style("opacity", function (d) {
            if (d.name == "renewable") {
                return 1;
            } else {
                return 0.6;
            }
        })
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("x", function (d) { return scale_stack_x(d.pre_per); })
        .attr("y", 100)
        .attr("height", 50)
        .attr("width", function (d) { return scale_stack_x(d.percent) - 2; })
        .on("mouseenter", function (data) {
            var select_name = d3.select(this).data()[0].name;
            console.log(select_name)
            scale_circle
                .attr("opacity", 0.2)
                .style("fill", function (d) {
                    // console.log("------------------")
                    if (select_name == "fire") { choose_ener = 2; return scale_color.range()[0]; }
                    else if (select_name == "nuclear") { choose_ener = 1; return scale_color.range()[1] }
                    else if (select_name == "water") { choose_ener = 0; return scale_color.range()[2] }
                    else if (select_name == "renewable") { choose_ener = 3; return scale_color.range()[3] }
                })

            var temp_scale_arc = d3.arc()
                .outerRadius(scale_radius * 0.85)
                .innerRadius(scale_radius * 0.55);

            scale_donut
                .attr("d", scale_arc)
                .style("opacity", function (d) {
                    if (d.data.name == "renewable" || d.data.name == select_name) {
                        return 1;
                    } else {
                        return 0.6;
                    }
                })
            d3.select(this)
                .style("opacity", 1)

            console.log(d3.select(this).data()[0].percent)
            var select_value = d3.select(this).data()[0].percent;
            var select_value_per = +((select_value / scale_total) * 100);
            scale_text_name.attr("dy", "-1.0em");
            scale_text_year.attr("dy", "-2.0em");
            if (select_name == "fire") {
                scale_text_name.text("火力發電比例達")
            }
            else if (select_name == "nuclear") { scale_text_name.text("核能發電比例達") }
            else if (select_name == "water") { scale_text_name.text("抽蓄水力發電比例達") }
            else if (select_name == "renewable") { scale_text_name.text("再生能源發電比例達") }
            var year_now = scale_stack_now_index + 97
            scale_text_year.text("民國" + year_now + "年");
            scale_text.text(Math.round(select_value_per) + "%")
            scale_stack_rect.select("rect")
                .style("opacity", function (d) {
                    if (d.name == select_name || d.name == "renewable") {
                        return 1;
                    } else {
                        return 0.6;
                    }
                })

        });

    var scale_stack_intro = scale_stack_svg.append("g")
        .selectAll("g")
        .attr("class", "scale_stack")
        .data(data[0].energy)
        .enter().append("g")
        .style("fill", function (d) { return scale_stack_z(d.name); })

    scale_stack_intro.append("rect")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("x", 800)
        .attr("y", function (d, i) { return i * 16; })
        .attr("height", 15)
        .attr("width", 15)
        ;
    scale_stack_intro.append("text")
        .attr("x", 820)
        .attr("y", function (d, i) { return i * 16; })
        .attr("dy", ".85em")
        .attr("fill", "black")
        .attr("font-size", "0.8em")
        .style("text-anchor", "start")
        .text(function (d, i) {
            switch (i) {
                case 0: return "火力";
                case 1: return "核能";
                case 2: return "抽蓄水力";
                case 3: return "再生能源";
            }
        });
})