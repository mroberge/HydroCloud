/**
 * Created by Marty on 3/24/2017.
 */
console.log("We read hydroChart");


function scatterChart2() {
    var margin = {
        top : 20,
        right : 20,
        bottom : 30,
        left : 50
    };
    var width = 760;
    var height = 120;
    fillColor = 'blue';
    var data = [];
    //data structure is an array of sites, with each site having
    // an array of measurements, and each measurement consisting
    // of an array of a datetime and a value.
    //    [
    //         [
    //             [date, value]
    //         ]
    //    ]

    //Some useful functions to be used by chart().
    var updateWidth;
    var updateHeight;
    var updateFillColor;
    var updateData;

    function setFullDomain(bigArray, accessor) {
        //Use it like this: xDomain = setFullDomain(data, xValue);
        var min = d3.min(bigArray, function (array) {
            return d3.min(array, accessor);
        });
        var max = d3.max(bigArray, function (array) {
            return d3.max(array, accessor);
        });
        return [min, max];
    }

    // The x-accessor for the path generator; xScale âˆ˜ xValue.
    function X(d) {return xScale(d[0]);}
    // The x-accessor for the path generator; yScale âˆ˜ yValue.
    function Y(d) {return yScale(d[1]);}
    var xValue = function(d) {return +d[0];};
    var yValue = function(d) {return +d[1];};
    //var xScale = d3.scale.linear();
    var xScale = d3.time.scale();
    //var yScale = d3.scale.linear();
    var yScale = d3.scale.log();
    var xAxis = d3.svg.axis()
        .scale(xScale).orient("bottom").tickSize(6, 0);
    var yAxis = d3.svg.axis()
        .scale(yScale).orient("left").tickSize(6, 0).ticks(5)
        .tickFormat(function (d) {return yScale.tickFormat(10, d3.format(",d"))(d);});

    //the color generator.
    var color = d3.scale.category10();
    //the line function, which creates the svg code for our line from our data.
    var Qline = d3.svg.line()
        .interpolate("step-before")
        .x(X)
        .y(Y)
        .defined(function (d) { return d[1] !== null; });//This allows the line to break at null values.


    function chart(selection){
        selection.each(function () {
            var fullxDomain = setFullDomain(data, xValue);
            var fullyDomain = setFullDomain(data, yValue);


            var dom = d3.select(this);
            var svg = dom.append('svg')
                .attr('class', 'bar-chart')
                .attr('height', height)
                .attr('width', width)
                .style('fill', fillColor);

            var bodyGroup = svg.append('g')
                .attr('class', 'graph-body')
                .attr('height', height-(margin.top + margin.bottom))
                .attr('width', width-(margin.left + margin.right))
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                //.style('fill', fillColor);
            var xGroup = svg.append('g').attr('class', 'x-axis');
            var yGroup = svg.append('g').attr('class', 'y-axis');
            var titleGroup = svg.append('g').attr('class', 'title');


            var siteLines = bodyGroup.selectAll('path.site-line')
                .data(data)
                .enter()
                .append('path')//append a new line here.
                .attr('class', 'site-line')
                .attr("d", Qline)//uses the Qline function for plotting discharge data.
                .attr("stroke", function(d, i) {return color(i);});

        });
    }

    chart.plot = function() {
        console.log("Called Plot.");
        return chart;
    };


    return chart;
}