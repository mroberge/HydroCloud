/**
 * Created by Marty on 3/12/2017.
 */

function loghistogram(id) {
    console.log("loghistogram");
    var myScreen = {
        width : viewModel.width(),
        height : viewModel.height()
    };

    var sitename = id;
    var margin = {
        top : 10,
        right : 10,
        bottom : 100,
        left : 70
    };
    var width = myScreen.width - margin.left - margin.right;
    var height = myScreen.height - margin.top - margin.bottom;

    var values = [];
    //this will be a simplified array of just the data.value to keep the code clean.
    data.forEach(function(element, index, array) {
        values[index] = element.value;
    });
    //console.log(values);

    // A formatter for counts.
    var formatCount = d3.format(",.0f");
    //A formatter for frequencies.
    var formatFreq = d3.format("%");
    //var formatFreq = (true ? d3.format("%"):function(d){return null;});
    //var formatFreq = function(d) {
    //  (true ? d3.format("%") : null);
    //};

    //var x = d3.scale.linear()//linear
    //  .domain([0, d3.max(values)])
    var min = d3.min(values);
    var max = d3.max(values);
    var x = d3.scale.log()
    //.domain(d3.extent(values)).nice()//This is a little too "nice".  Pads the min and max too much.
        .domain([min, max])//No padding here. the result will spill over the end.
        .range([0, width]);
    //.tickFormat(20,d3.format(",.0r")); //didn't work.
    //.ticks() //didn't work.'

    var low = x.domain()[0];

    var high = x.domain()[1];
    console.log("low, min, max, high: " + low, min, max, high);

    var myBins = [];
    var i = 0;
    do {
        myBins[i] = low * Math.pow(1.2, i);
        //vary the first number to determine the number of bins. Must be above 1.0
        //console.log(i, myBins[i], high)
        i++;
    } while (myBins[i-1]<high);
    console.log(myBins);

    var counts = d3.layout.histogram()
    //.bins(x.ticks(80))
    //.bins(80)
    //.bins([1000,3000,8000,16000,32000,64000,128000,256000,1024000])//seems to work. But I have to generate my own thresholds!
        .bins(myBins) //This works well- I created a logarithmic sequence of bins called myBins.
        .frequency(false) //false:show frequencies; true: show counts
        (values);

    //console.log(counts);

    var y = d3.scale.linear().domain([0, d3.max(counts, function(d) {
        return d.y;
    })]).range([height, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left");

    d3.select("#graph_div svg").remove();
    //var svg = d3.select("#graph_div").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
    var svg = d3.select("#graph_div").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar").data(counts).enter().append("g").attr("class", "bar").attr("transform", function(d) {
        return "translate(" + x(d.x) + "," + y(d.y) + ")";
    });

    //bar.append("rect").attr("x", 1).attr("width", x(counts[0].dx) - 1).attr("height", function(d) {
    bar.append("rect").attr("x", 1).attr("width", width / myBins.length - 1).attr("height", function(d) {
        //bar.append("rect").attr("x", 1).attr("width", 10).attr("height", function(d) {
        return height - y(d.y);
    });

    //bar.append("text").attr("dy", ".75em").attr("y", -10)//add labels to each bar.
    //  //.attr("x", x(counts[0].dx) / 2)
    //  .attr("x", x(counts[0].dx))
    //  .attr("text-anchor", "middle")
    //  //.text(function(d) {return formatCount(d.y);});
    //  .text(function(d) {return (d.y > 0.01 ? formatFreq(d.y) : null);});//format as a % if number is above 1%.

    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
    svg.append("g").attr("class", "y axis").call(yAxis);
    svg.append("svg:text").attr("class", "axisTitle").attr("x", ((width / 2) - 48)).attr("y", height + 30).text("Discharge (cfs)");
}
