var japan_scale_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    japan_scale_width = 500 - japan_scale_margin.left - japan_scale_margin.right,
    japan_scale_height = 500 - japan_scale_margin.top - japan_scale_margin.bottom,
    japan_scale_radius = Math.min(japan_scale_width, japan_scale_height) / 2;

var japan_scale_svg = d3.select("#cate")
    .append("svg")
    .attr("width", japan_scale_width + japan_scale_margin.left + japan_scale_margin.right)
    .attr("height", japan_scale_height + japan_scale_margin.top + japan_scale_margin.bottom)
    //.attr("transform", "translate（1000,0)")
    .append("g").attr("transform", "translate(" + japan_scale_width * 1.1 / 2 + "," + japan_scale_height / 2 + ")");

var japan_scale_color = d3.scaleOrdinal()
    .range(["#354872", "#A51C1E", "#EBAD30", "	#568D4B"]);


var japan_scale_arc = d3.arc()
    .outerRadius(function (d) {

        if (d.data.name == "renewable") {
            return japan_scale_radius * 0.8;
        } else {
            return japan_scale_radius * 0.75;
        }

    })
    .innerRadius(japan_scale_radius * 0.5);

var japan_scale_text_arc = d3.arc()
    .outerRadius(japan_scale_radius * 0.85)
    .innerRadius(japan_scale_radius * 0.85);

var japan_scale_pie = d3.pie()
    .sort(null)
    .value(function (d) { return d.percent });

var japan_scale;
var japan_scale_data;
var japan_scale_total = 0;
var japan_scale_text_year;
var japan_scale_text;
var japan_scale_donut;
var japan_scale_text_name;
var select_cir_year = 97;
var japan_polyline;
var japan_pol_text;
var japan_choose = 3;
d3.csv("./data/日本各項電力.csv", function (d, i, columns) {
    return {
        year: +d.year,
        energy: columns.slice(1).map(function (key) {
            return {
                name: key,
                percent: +d[key]
            };
        })
    };

}, function (error, data) {
    console.log(data);
    japan_scale_data = data;
    if (error) throw error;
    // console.log(data[1].energy.length);
    for (i = 0; i < data[1].energy.length; i++) {
        japan_scale_total = japan_scale_total + data[1].energy[i].percent;
    }
    japan_scale_color.domain(data[1].energy.map(function (d) { return d.name; }));
    // console.log(data);
    var temp;
    for (i = 0; i < data.length; i++) {

        temp = data[i].energy[0].name;
        data[i].energy[0].name = data[i].energy[2].name;
        data[i].energy[2].name = temp;
        temp = data[i].energy[0].percent;
        data[i].energy[0].percent = data[i].energy[2].percent;
        data[i].energy[2].percent = temp
    }

    japan_scale = japan_scale_svg.selectAll(".japan_scalearc")
        .data(function (d) { console.log(japan_scale_pie(data[0].energy)); return japan_scale_pie(data[0].energy); })
        .enter().append("g")
        .attr("class", "japan_scalearc");

    japan_scale_circle = japan_scale.append("circle")
        .attr("cx", "0")
        .attr("cy", "0")
        .attr("opacity", 0.2)
        .attr("r", japan_scale_radius * 0.49)
        .attr("fill", "#568D4B");

    japan_scale_text = japan_scale.append("text")
        .attr("transform", "translate(0,0)")
        .attr("dy", "0.7em")
        .attr("font-size", "3.3em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("8%")
    japan_scale_text_year = japan_scale.append("text")
        .attr("transform", "translate(0,0)")
        .attr("dy", "-2.0em")
        .attr("font-size", "1.3em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("民國97年")
    japan_scale_text_name = japan_scale.append("text")
        .attr("transform", "translate(0,0)")
        .attr("dy", "-1.0em")
        .attr("font-size", "0.8em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("再生能源發電比例達")

    japan_polyline = japan_scale.append('polyline')
        .attr('points', japan_calculatePoints)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", "2px");

    japan_scale_donut = japan_scale.append("path")
        .attr("d", japan_scale_arc)
        .style("fill", function (d) { return japan_scale_color(d.data.name) })
        .style("opacity", function (d) {
            if (d.data.name == "renewable") {
                return 1;
            } else {
                return 0.6;
            }
        })
        .on("mouseenter", function (data) {
            var select_name = d3.select(this).data()[0].data.name;

            japan_scale_circle
                .attr("opacity", 0.2)
                .style("fill", function (d) {
                    // console.log("------------------")
                    if (select_name == "fire") { japan_choose = 1; return japan_scale_color.range()[1]; }
                    else if (select_name == "nuclear") { japan_choose = 2; return japan_scale_color.range()[0] }
                    else if (select_name == "water") { japan_choose = 0; return japan_scale_color.range()[2] }
                    else if (select_name == "renewable") { japan_choose = 3; return japan_scale_color.range()[3] }
                })

            var temp_japan_scale_arc = d3.arc()
                .outerRadius(japan_scale_radius * 0.8)
                .innerRadius(japan_scale_radius * 0.5);

            japan_scale_donut
                .attr("d", japan_scale_arc)
                .style("opacity", function (d) {
                    if (d.data.name == "renewable" || d.data.name == "water") {
                        return 1;
                    } else {
                        return 0.6;
                    }
                })
            d3.select(this)
                .attr("d", temp_japan_scale_arc)
                .style("opacity", 1)


            var select_value = d3.select(this).data()[0].value;
            var select_value_per = +((select_value / japan_scale_total) * 100);
            japan_scale_text_name.attr("dy", "-1.0em");
            japan_scale_text_year.attr("dy", "-2.0em");
            if (select_name == "fire") {
                japan_scale_text_name.text("火力發電比例達")
            }
            else if (select_name == "nuclear") { japan_scale_text_name.text("核能發電比例達") }
            else if (select_name == "water") { japan_scale_text_name.text("抽蓄水力發電比例達") }
            else if (select_name == "renewable") { japan_scale_text_name.text("再生能源發電比例達") }
            japan_scale_text_year.text("民國" + select_cir_year + "年");
            japan_scale_text.text(Math.round(select_value_per) + "%")


        })
        .on("mouseout", function (d) {
            //japan_scale_circle.attr("opacity", 0)
        });
    japan_pol_text = japan_scale.append("text")
        .attr("class","poly")
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
})

function japan_calculatePoints(d) {
    // see label transform function for explanations of these three lines.
    // console.log("pos:---");
    //
    var pos = japan_scale_text_arc.centroid(d);
    // console.log(pos);
    // console.log(japan_midAngle(d));
    // console.log(Math.PI);
    pos[0] = japan_scale_radius * 0.7 * (japan_midAngle(d) < (Math.PI) ? 1 : -1);
    console.log(pos)
    return [japan_scale_arc.centroid(d), japan_scale_text_arc.centroid(d), pos]
}

function japan_labelTransform(d) {
    // effectively computes the centre of the slice.
    // see https://github.com/d3/d3-shape/blob/master/README.md#arc_centroid
    var pos = japan_scale_text_arc.centroid(d);

    // changes the point to be on left or right depending on where label is.
    pos[0] = japan_scale_radius * 0.75 * (japan_midAngle(d) < Math.PI ? 1 : -1);
    return 'translate(' + pos + ')';
}

function japan_midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; } 