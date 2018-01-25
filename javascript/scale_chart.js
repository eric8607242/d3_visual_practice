var scale_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    scale_width = screen.availWidth - scale_margin.left - scale_margin.right,
    scale_height = 400 - scale_margin.top - scale_margin.bottom,
    scale_radius = Math.min(scale_width, scale_height) / 2;

var scale_svg = d3.select("#scale")
    .append("svg")
    .attr("width", scale_width + scale_margin.left + scale_margin.right)
    .attr("height", scale_height + scale_margin.top + scale_margin.bottom)
    //.attr("transform", "translate（1000,0)")
    .append("g").attr("transform", "translate(" + scale_width *1.1/ 2 + "," + scale_height / 2 + ")");

var scale_color = d3.scaleOrdinal()
    .range(["#FF5511", "#FFFF33", "#5599FF", "	#00AA00"]);


var scale_arc = d3.arc()
    .outerRadius(scale_radius - 30)
    .innerRadius(scale_radius - 80);

var scale_text_arc = d3.arc()
    .outerRadius(scale_radius * 0.9)
    .innerRadius(scale_radius * 0.9);

var scale_pie = d3.pie()
    .sort(null)
    .value(function (d) { return d.percent });

var scale;
var scale_data;
var scale_total = 0;

d3.csv("./data/his_ele_cate.csv", function (d, i, columns) {
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
    scale_data = data;
    if (error) throw error;
    // console.log(data[1].energy.length);
    for (i = 0; i < data[1].energy.length; i++) {
        scale_total = scale_total + data[1].energy[i].percent;
    }
    scale_color.domain(data[1].energy.map(function (d) { return d.name; }));
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

    scale = scale_svg.selectAll(".arc")
        .data(function (d) { return scale_pie(data[1].energy); })
        .enter().append("g")
        .attr("class", "arc");

    scale_circle = scale.append("circle")
        .attr("cx", "0")
        .attr("cy", "0")
        .attr("r", scale_radius - 85)
        .attr("fill", "white");

    var scale_text = scale.append("text")
        .attr("transform", "translate(0,0)")
        .attr("dy", "0.7em")
        .attr("font-size", "3.5em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("")
    var scale_text_year = scale.append("text")
        .attr("transform", "translate(0,0)")
        .attr("dy", "-2.0em")
        .attr("font-size", "1.5em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("")
    var scale_text_name = scale.append("text")
        .attr("transform", "translate(0,0)")
        .attr("dy", "-1.0em")
        .attr("font-size", "1.0em")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .text("")

    var polyline = scale.append('polyline')
        .attr('points', calculatePoints)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", "2px");

    scale.append("path")
        .attr("d", scale_arc)
        .style("fill", function (d) { return scale_color(d.data.name) })
        .on("mouseenter", function (data) {
            var select_name = d3.select(this).data()[0].data.name;
            scale_circle
                .attr("opacity", 0.2)
                .style("fill", function (d) {
                    console.log("------------------")
                    if (select_name == "fire") { return scale_color.range()[0]; }
                    else if (select_name == "nuclear") { return scale_color.range()[1] }
                    else if (select_name == "water") { return scale_color.range()[2] }
                    else if (select_name == "renewable") { return scale_color.range()[3] }
                })
            var select_value = d3.select(this).data()[0].value;
            var select_value_per = +((select_value / scale_total) * 100);
            if (select_name == "fire") {scale_text_name.text("火力發電比例達")}
            else if (select_name == "nuclear") {scale_text_name.text("核能發電比例達")}
            else if (select_name == "water") {scale_text_name.text("水力發電比例達")}
            else if (select_name == "renewable") {scale_text_name.text("再生能源發電比例達")}
            scale_text_year.text("民國"+select_cir_year+"年");
            scale_text.text(Math.round(select_value_per) + "%")
        })
        .on("mouseout", function (d) {
            //scale_circle.attr("opacity", 0)
        });
    scale.append("text")
        //.attr("transform", function (d) { return "translate(" + scale_text_arc.centroid(d) + ")"; })
        .attr("font-size", "15px")
        //.attr("text-anchor", "middle")
        .attr('transform', labelTransform)
        .style('text-anchor', function (d) {
            // if slice centre is on the left, anchor text to start, otherwise anchor to end
            return (midAngle(d)) < Math.PI ? 'start' : 'end';
        })
        .text(function (d) {
            if (d.data.name == "renewable") {
                return "再生能源"
            } else if (d.data.name == "nuclear") {
                return "核能"
            } else if (d.data.name == "fire") {
                return "火力"
            } else {
                return "水力"
            }
        });
})

function calculatePoints(d) {
    // see label transform function for explanations of these three lines.
    // console.log("pos:---");
    // console.log(d.data.name);
    var pos = scale_text_arc.centroid(d);
    // console.log(pos);
    // console.log(midAngle(d));
    // console.log(Math.PI);
    pos[0] = scale_radius * 0.9 * (midAngle(d) < Math.PI ? 1 : -1);
    return [scale_arc.centroid(d), scale_text_arc.centroid(d), pos]
}

function labelTransform(d) {
    // effectively computes the centre of the slice.
    // see https://github.com/d3/d3-shape/blob/master/README.md#arc_centroid
    var pos = scale_text_arc.centroid(d);

    // changes the point to be on left or right depending on where label is.
    pos[0] = radius * 0.9 * (midAngle(d) < Math.PI ? 1 : -1);
    return 'translate(' + pos + ')';
}

function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; } 