var scale_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    scale_width = 1600 - scale_margin.left - scale_margin.right,
    scale_height = 400 - scale_margin.top - scale_margin.bottom,
    scale_radius = Math.min(scale_width, scale_height) / 2;

var scale_svg = d3.select("#scale")
    .append("svg")
    .attr("width", scale_width + scale_margin.left + scale_margin.right)
    .attr("height", scale_height + scale_margin.top + scale_margin.bottom)
    //.attr("transform", "translate(" + scale_width/8 + ",0)")
    .append("g").attr("transform", "translate(" + scale_width / 2 + "," + scale_height / 2 + ")");

var scale_color = d3.scaleOrdinal()
    .range(["#FF5511", "#FFFF33", "#5599FF", "	#00AA00"]);


var scale_arc = d3.arc()
    .outerRadius(scale_radius - 30)
    .innerRadius(scale_radius - 80);

var scale_pie = d3.pie()
    .sort(null)
    .value(function (d) { return d.percent });

var scale;
var scale_data;

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
    console.log(data[1].energy);
    scale_color.domain(data[1].energy.map(function (d) { return d.name; }));

    scale = scale_svg.selectAll(".arc")
        .data(function (d) { return pie(data[1].energy); })
        .enter().append("g")
        .attr("class", "arc");
    console.log(scale);
    console.log(pie(data[1].energy));
    scale.append("path")
        .attr("d", scale_arc)
        .style("fill", function (d) { return scale_color(d.data.name) })
})