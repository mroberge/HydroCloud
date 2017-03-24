/**
 * Created by Marty on 3/12/2017.
 */
function flowduration(id) {
    console.log("flowduration");
    var data = chooseData(id);
    //If there is no data for a site, keep the previous graph alive & do nothing.
    if(!data) return;

    var myScreen = {
        width : viewModel.width(),
        height : viewModel.height()
    };

    var sitename = id;

    data.sort(function(a, b) {
        return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0;
    });
    //console.log(data);

    var margin = {
        top : 10,
        right : 10,
        bottom : 50,
        left : 70
    }, width = myScreen.width - margin.left - margin.right, height = myScreen.height - margin.top - margin.bottom;

    var xScale = d3.scale.linear().range([0, width]);
    //This will plot from high values to low.
    //var x = d3.scale.linear().range([width, 0]); //This will plot from low values to high.
    //var y = d3.scale.linear().range([height, 0]); //Use this for a linear scale on the Y axis.
    var yScale = d3.scale.log().range([height, 0]);
    //Dealt with trouble switching to log by changing y.domain to have a min of 1, not zero.

    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    var yAxis = d3.svg.axis().scale(yScale).orient("left");

    var rank = 0;
    //console.log(sorted.length)
    //var testarray = [];

    var area = d3.svg.line().interpolate("step-before").x(function(d) {
        rank = rank + 1;
        return xScale(rank);
    }).y(function(d) {
        return yScale(d[1]);
    });

    d3.select("#graph_div svg").remove();
    var svg = d3.select("#graph_div").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
    svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);
    var focus = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    xScale.domain(d3.extent([0, data.length]));
    yScale.domain([1, d3.max(data.map(function(d) {
        return d[1];
    }))]);
    //If y.domain has a min value of 0, then you can't plot in a log scale.'

    focus.append("path").datum(data).attr("clip-path", "url(#clip)").attr("d", area).attr("stroke", "blue");
    //append the path to the graph, but clip it with the rectangle we defined above.
    //focus.append("path").datum(data).attr("d", area);//This still seems to get clipped even though it doesn't have the clipping path. ???
    focus.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
    focus.append("g").attr("class", "y axis").call(yAxis);

    //title block
    var title = focus.append("g").attr("transform", "translate(125,20)");
    title.append("svg:text").attr("class", "Title").text(viewModel.siteName());
    title.append("svg:text").attr("class", "subTitle").attr("dy", "1em").text(data.length + " measurements");

    //axis labels
    focus.append("text").attr("class", "axisTitle").attr("transform", "rotate(-90)").attr("x", 0).attr("y", 0).attr("dy", "1em").style("text-anchor", "end").text("instantaneous stream discharge (cfs)");
    focus.append("text").attr("class", "axisTitle").attr("x", width).attr("y", height - 2).style("text-anchor", "end").text("Number of measurements that exceed this discharge");
}
