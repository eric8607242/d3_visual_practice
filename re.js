function re() {
    d3.json("data2.json", function (dataArray) {
        var update = bars.data(dataArray);
        var enter = update.enter();
        console.log(bars.data(dataArray));


    })
}
function retest() {
    d3.json("data2.json", function (dataArray) {

        bar_scale = d3.scaleLinear()
            .domain([0, 200])
            .range([0, 300]);

        var colorScale = d3.scaleLinear()
            .domain([50, 200])
            .range(["gray", "black"]);

        g.selectAll("rect.bars")
            .data(dataArray)
            .transition().duration(750)
            .attr("height", function (d) { return bar_scale(d.age); })
            .attr("fill", function (d) { return colorScale(d.age); })
            .attr("x", function (d, i) { return i * 50; })
            .attr("y", function (d) { return 500 - bar_scale(d.age) });

    });


    d3.tsv("hon1.tsv", function (d) {//折線圖的資料輸入

        d.date = parseTime(d.date);
        d.price = +d.price;
        return d;
    }, function (error, data) {
        if (error) { throw error; }

        g.selectAll(".domain.path").remove();

        x.domain(d3.extent(data, function (d) { return d.date; }));
        y.domain(d3.extent(data, function (d) { return d.price; }));

        console.log("testtest");

        var date_data = d3.map(data, function (d) { return d.date; })//可以將數據做轉換

        console.log("testtest");

        svg//隨著滑鼠照著折線圖移動
            .on("mousemove", function (d) {

                var date_x = bisectDate(data, x.invert(d3.event.x - 50), 1);//將座標轉換成x軸的資料的index，invert將座標轉換成x軸資料
                var date_obj = data[date_x];//利用index拿到x軸座標的資料物件 

                g.select(".check_circle_mouse")
                    .attr("cx", d3.event.x - 50)
                    .attr("cy", function (d, i) {
                        return y(date_obj.price)
                    });//從data陣列中取出該座標對應的price的值
                g.select(".check_check_line")
                    .attr("y1", y(date_obj.price))
                    .attr("y2", y(date_obj.price));
                g.select(".check_check_line_1")
                    .attr("x1", d3.event.x - 52)
                    .attr("x2", d3.event.x - 52);
                g.select(".check_rect_info")
                    .attr("x", d3.event.x - 58)
                    .attr("y", y(date_obj.price))
                    .attr("width", 100)
                    .attr("height", 60);
                g.select(".check_rect_info_text")
                    .attr("y", y(date_obj.price) + 15)
                    .attr("font-size", "13px")
                    .attr("x", d3.event.x)
                    .text(function (d) { return date_obj.date.toLocaleString().substr(0, 10) + " " + date_obj.price; });

            })

        console.log("testtest");


        g.select(".line")
            .transition().duration(1000)
            .attr("d", line(data));
    });

}