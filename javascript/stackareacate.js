var tsvData = null;

var stackarea_margin = { top: 20, right: 80, bottom: 30, left: 50 },
    stackarea_width = stackarea_line_get_screen_width() - stackarea_margin.left - stackarea_margin.right,
    stackarea_height = 300 - stackarea_margin.top - stackarea_margin.bottom;

function stackarea_line_get_screen_width() {
    console.log(innerWidth)
    if (innerWidth < 800) {
        return innerWidth;
    }
    return 800;
}


var formatNumber = d3.format(".1f"),
    formatBillion = function (x) { return formatNumber(x / 1e9); };

var stackarea_x = d3.scaleTime()
    .range([0, stackarea_width]);

var stackarea_y = d3.scaleLinear()
    .range([stackarea_height, 0]);

var color = d3.scaleOrdinal()
    .range(["#1D65A6", "#72A2C0", "#00743F", "#192E5B", "#F2A104"]);

var xAxis = d3.axisBottom()
    .scale(stackarea_x);

var yAxis = d3.axisLeft()
    .scale(stackarea_y)
    .tickFormat(formatBillion);

var area = d3.area()
    .x(function (d) {
        return stackarea_x(d.data.year);
    })
    .y0(function (d) { return stackarea_y(d[0]); })
    .y1(function (d) { return stackarea_y(d[1]); });

var stack = d3.stack()

var stackarea_svg = d3.select('#stackareacate').append('svg')
    .attr('width', stackarea_width + stackarea_margin.left + stackarea_margin.right)
    .attr('height', stackarea_height + stackarea_margin.top + stackarea_margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + stackarea_margin.left + ',' + stackarea_margin.top + ')');
var stackarea_line_move;
d3.csv('./data/energy_type.csv', function (error, data) {
    color.domain(d3.keys(data[0]).filter(function (key) { return key !== 'year'; }));
    var keys = data.columns.filter(function (key) { return key !== 'year'; })
    data.forEach(function (d) {
        d.year = +d.year
    });
    tsvData = (function () { return data; })();
    console.log(tsvData)

    var maxDateVal = d3.max(data, function (d) {
        var vals = d3.keys(d).map(function (key) { return key !== 'year' ? d[key] : 0 });
        return d3.sum(vals);
    });
    stackarea_svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", "0.7em")
        .attr("font-size", "90%")
        .attr("text-anchor", "end")
        .text("單位(億度)");
    stackarea_svg.append("text")
        .attr("transform", "translate(-10,265)")
        .attr("dy", "0")
        .attr("font-size", "60%")
        .attr("text-anchor", "end")
        .text("年");

    // Set domains for axes
    stackarea_x.domain(d3.extent(data, function (d) { return d.year; }));
    stackarea_y.domain([0, maxDateVal])

    stack.keys(keys);

    stack.order(d3.stackOrderNone);
    stack.offset(d3.stackOffsetNone);

    console.log(stack(data));

    var browser = stackarea_svg.selectAll('.browser')
        .data(stack(data))
        .enter().append('g')
        .attr('class', function (d) { return 'browser ' + d.key; })
        .attr('fill-opacity', 0.9);

    browser.append('path')
        .attr('class', 'area')
        .attr('d', area)
        .style('fill', function (d) { return color(d.key); })

    stackarea_line_move = stackarea_svg.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", stackarea_height)
        .attr("stroke", "black")
        .attr("stroke-width", 1);

    var stackarea_touch_rect = stackarea_svg.append('rect')
        .attr('width', stackarea_width) // can't catch mouse events on a g element
        .attr('height', stackarea_height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all').on("mouseover", function (d) {
            for (i = 0; i < stack_data.length; i++) {
                if (d3.mouse(this)[0] < stackarea_x(97 + i) + 10 && d3.mouse(this)[0] > stackarea_x(97 + i) - 10) {
                    stack_bar_change(i)
                }
            }
            for (i = 0; i < stack_data.length; i++) {
                if (d3.mouse(this)[0] < co_line_x(97 + i) + 10 && d3.mouse(this)[0] > co_line_x(97 + i) - 10) {
                    var year = 97 + i
                    park = co_data[i].co * 100000 / 25.894;
                    co_text_year.text("民國" + year + "年")
                    co_text_save.text(co_data[i].co.toFixed(2) + "十萬公噸")
                    co_text_tree_1.text(park.toFixed(2) + "座")
                }
            }
            line_move(stackarea_line_move, d3.mouse(this)[0]);
            line_move(co_line_move, d3.mouse(this)[0]);
        })
        .on("mousemove", function (d) {
            for (i = 0; i < stack_data.length; i++) {
                if (d3.mouse(this)[0] < x(97 + i) + 10 && d3.mouse(this)[0] > x(97 + i) - 10) {
                    stack_bar_change(i)
                }
            }
            for (i = 0; i < stack_data.length; i++) {
                if (d3.mouse(this)[0] < co_line_x(97 + i) + 10 && d3.mouse(this)[0] > co_line_x(97 + i) - 10) {
                    var year = 97 + i
                    park = co_data[i].co * 100000 / 25.894;
                    co_text_year.text("民國" + year + "年")
                    co_text_save.text(co_data[i].co.toFixed(2) + "十萬公噸")
                    co_text_tree_1.text(park.toFixed(2) + "座")
                }
            }
            line_move(stackarea_line_move, d3.mouse(this)[0]);
            line_move(co_line_move, d3.mouse(this)[0]);
        });
    // browser.append('text')
    //     .datum(function (d) { return d; })
    //     .attr('transform', function (d) { return 'translate(' + stackarea_x(data[8].year) + ',' + stackarea_y(d[8][1]) + ')'; })
    //     .attr('x', -6)
    //     .attr('dy', '.35em')
    //     .style("text-anchor", "start")
    //     .text(function (d) {
    //         if (d.key != "bio") {
    //             return d.key;
    //         }
    //     })
    //     .attr('fill-opacity', 1);

    stackarea_svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + stackarea_height + ')')
        .call(xAxis);

    stackarea_svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);


});
