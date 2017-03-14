/**
 * Created by Marty on 3/12/2017.
 */
function hyetograph(id) {
    console.log("hyetograph");
    var myScreen = {
        width : viewModel.width(),
        height : viewModel.height()
    };
    var margin = {//margin is for the larger stream hydrograph.
        top : 10,
        right : 10,
        bottom : 100, //needs enough space for the bottom graph.
        left : 60
    };
    var margin2 = {//margin2 is for the smaller hyetograph.
        top : myScreen.height - 70, //TODO: change this to a variable; get rid of magic number.
        right : margin.right,
        bottom : 20,
        left : margin.left
    };
    var width = myScreen.width - margin.left - margin.right;
    var height = myScreen.height - margin.top - margin.bottom;
    var height2 = myScreen.height - margin2.top - margin2.bottom;

    var xScale = d3.time.scale().range([0, width]);
    var yScale = d3.scale.linear().range([height, 0]);
    var y2Scale = d3.scale.linear().range([height2, 0]);

    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0);
    //I may not need a second x axis. Just redraw first?
    var x2Axis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0);
    var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(6, 0).ticks(5);
    //yAxis.tickFormat(function (d) { return yScale.tickFormat(10, d3.format(",d"))(d);});
    var y2Axis = d3.svg.axis().scale(y2Scale).orient("left").tickSize(6, 0).ticks(5);
    //y2Axis.tickFormat(function (d) { return y2Scale.tickFormat(10, d3.format(",d"))(d);});

    var area = d3.svg.area()
        .x(function(d) {
            return xScale(d[0]);
        })
        .y0(height) //only if you want to fill the graph.
        .y1(function(d) {
            return yScale(d[1]);
        })
        .defined(function (d) { return d[1] !== null; });
    var area2 = d3.svg.area().interpolate("step-before")
        .x(function(d) {
            return xScale(d.date);
        })
        .y0(height2)
        .y1(function(d) {
            return y2Scale(d.value);
        })
        .defined(function (d) { return d[1] !== null; });

    var stream = chooseData(id);
    //If there is no data for a site, keep the previous graph alive & do nothing.
    if(!stream) return;

    var rain = null;
    if (!rain) {
        rain = [{date: null, value: null}];
        console.log("!rain");
    }
    //console.log("stream & rain");
    //console.log(stream);
    //console.log(rain);
    var xMax = d3.max([d3.max(stream.map(function(d) { return d[0];})), d3.max(rain.map(function(d) { return d.date;}))]);
    var xMin = d3.min([d3.min(stream.map(function(d) { return d[0];})), d3.min(rain.map(function(d) { return d.date;}))]);
    xScale.domain([xMin, xMax]);
    //If yScale.domain has a min value of 0, then you can't plot in a log scale.
    yScale.domain([0, d3.max(stream.map(function(d) { return d[1];}))]);
    y2Scale.domain([0, d3.max(rain.map(function(d) { return d.value;}))]);

    d3.select("#graph_div svg").remove();
    var svg = d3.select("#graph_div").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
    //svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);
    var top = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var bottom = svg.append("g").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    top.append("path").attr("class", "filled").datum(stream).attr("clip-path", "url(#clip)").attr("d", area);
    top.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
    top.append("g").attr("class", "y axis").call(yAxis);
    bottom.append("path").attr("class", "filled").datum(rain).attr("clip-path", "url(#clip)").attr("d", area2);
    bottom.append("g").attr("class", "x2 axis").attr("transform", "translate(0," + height2 + ")").call(xAxis);
    bottom.append("g").attr("class", "y2 axis").call(y2Axis);

    //data processing notices
    //console.log(rain);
    //console.log(viewModel.tuNexrad());
    //this only changes the message on a redraw of the graph. and it will write "success" if it gets data.
    if (viewModel.tuNexrad().status !== "success") {
        bottom.append("text").attr("class", "dataNotice").text(viewModel.tuNexrad().status).attr("x", width / 2).attr("y", 30).style("text-anchor", "middle");
    }


    //title block
    var title = top.append("g").attr("transform", "translate(5,20)");//This won't wrap at edge of screen.
    //title.append("svg:text").attr("class", "Title").text(sitename);
    title.append("svg:text").attr("class", "Title").text(viewModel.siteName());
    title.append("svg:text").attr("class", "subTitle").attr("dy", "1em").text(stream.length + " measurements");

    //axis labels
    top.append("text").attr("class", "axisTitle").attr("transform", "rotate(-90)").attr("x", -height/2).attr("y", -margin.left).attr("dy", "1em").style("text-anchor", "middle").text("Stream discharge (cfs)");
    //Do we really need to lable the time axis? Won't the date labels be enough of a clue?
    //  top.append("text").attr("class", "axisTitle").attr("x", width/2).attr("y", height+30 ).style("text-anchor", "middle").text("time");
    bottom.append("text").attr("class", "axisTitle").attr("transform", "rotate(-90)").attr("x", -height2/2).attr("y", -margin2.left).attr("dy", "1em").style("text-anchor", "middle").text("mm");

}