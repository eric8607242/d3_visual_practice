function re(){
    d3.json("data2.json",function(dataArray){
        var update = bars.data(dataArray);
        var enter = update.enter();
        console.log(bars.data(dataArray));
        
        
    })
}