var cate_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    cate_width = screen.availWidth * 0.5 - cate_margin.left - cate_margin.right,
    cate_height = 400 - cate_margin.top - cate_margin.bottom,
    cate_radius = Math.min(cate_width, cate_height) / 2;

var cate_svg = d3.select("#cate")
    .append("svg")
    .attr("width", cate_width + cate_margin.left + cate_margin.right)
    .attr("height", cate_height + cate_margin.top + cate_margin.bottom)
    //.attr("transform", "translate（1000,0)")
    .append("g").attr("transform", "translate(" + cate_width * 1.2/ 2 + "," + cate_height / 2 + ")");

var cate_arc = d3.arc()
    .outerRadius(cate_radius - 30)
    .innerRadius(cate_radius - 80);

var cate_color = d3.scaleOrdinal()
    .range(["#FF5511", "#FFFF33", "#5599FF", "	#00AA00","#AAFFEE"]);

var cate_pie = d3.pie()
    .sort(null)
    .value(function (d) {
            return d.percent
    });
var temp = 0;
var cate;
var sun_temp = 0;
var wind_temp = 0;
d3.csv("./data/energy_type.csv", function (d, i, columns) {
    return {
        year: +d.year,
        energy: columns.slice(1).map(function (key) {
            return {
                name: key,
                percent: +d[key]
            }

        })
    };
}, function (error, data) {
    console.log(data)
    cate = cate_svg.selectAll(".arc")
        .data(function (d) {
            console.log(cate_pie(data[1].energy))
            return cate_pie(data[1].energy);
        })
        .enter().append("g")
        .attr("class", "arc");
    var cate_donut = cate.append("path")
        .attr("d", cate_arc)
        .style("fill", function (d) {
                console.log(cate_color(d.data.name))
                return cate_color(d.data.name)
        })
        .on("mouseenter",function(d){
            console.log(d3.select(this).data()[0])
        })


})