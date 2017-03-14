function scatterChart() {
  /*
   * Based on Mike Bostock's system for creating reusable charts, described
   * here: http://bost.ocks.org/mike/chart/
   *
   * My particular instance is based on the example used in that page
   * located here: http://bost.ocks.org/mike/chart/time-series-chart.js
   *
   * I added a Y axis, multiple lines.
   */
  var margin = {
    top : 20,
    right : 60,
    bottom : 20,
    left : 40
  };
  var width = 760;
  var height = 120;
  var xValue = function(d) {
    return +d[0];
  };
  var yValue = function(d) {
    return +d[1];
  };
  //var xScale = d3.scale.linear();
  var xScale = d3.time.scale();
  var yScale = d3.scale.linear();
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0);
  var yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(6, 0).ticks(5);
  //NEW
  var area = d3.svg.area().x(X).y1(Y);
  var line = d3.svg.line().x(X).y(Y);
  var xDomain = [];
  //leave empty. First time data are loaded, it will calculate the full x domain.
  var fullxDomain = [];
  var fullyDomain = [];

  function chart(selection) {
    selection.each(function(dataArray) {
      // Convert data to standard representation greedily;
      // this is needed for nondeterministic accessors.

      //console.log("unconditioned array");
      //console.log(dataArray);

      for ( var i = 0; i < dataArray.length; i++) {
        dataArray[i] = dataArray[i].map(function(d, i) {
          return [xValue.call(dataArray[i], d, i), yValue.call(dataArray[i], d, i)];
        });

      }
      //console.log("line 42");
      //console.log(dataArray);

      /*   This is the old function that the new function is based upon.
       data = data.map(function(d, i) {
       return [xValue.call(data, d, i), yValue.call(data, d, i)];
       });
       */

      if (!xDomain.length) {//if xDomain hasn't been set yet, set it to the full domain.
        //xDomain = d3.extent(dataArray[0], function(d) { return d[0]; });
        xDomain = setFullxDomain();
      }

      // Update the full x & y domain.
      fullxDomain = setFullxDomain();
      fullyDomain = setFullyDomain();

      // Update the x-scale.
      xScale.domain(xDomain)//don't change the xDomain. Why not fullxDomain????
      .range([0, width - margin.left - margin.right]);

      // Update the y-scale.
      yScale
      //.domain([0, d3.max(dataArray[0], function(d) { return d[1]; })])//need to set extent in a new way, since some lines will have a different max.
      .domain(fullyDomain).range([height - margin.top - margin.bottom, 0]);

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([dataArray]);
      //bind data to svg if it exists. IF it doesn't, then a new one will be made in the next line with the .enter(); WE only want one graph, so we should only have one element in the array.
      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter().append("svg").append("g");
      //took out when I took out .data() above.

//special viewbox attributes
svg.attr("viewBox", "0 0 " + width + " " + height).attr("preserveAspectRatio", "none");
//svg.attr("viewBox", "0 0 1 1");//won't work. D3 scales everything to the height and width of the svg element. This will make all sizes too big.


      var lineGroup = gEnter.append("g").attr("class", "lineGroup");
      var lineEnter = lineGroup.selectAll("path").data(dataArray).enter().append("path").attr("class", "line");
      //.attr("d", line);//don't draw the line yet. update the size of the svg first.

      gEnter.append("g").attr("class", "x axis");//is this name okay? It has a space!
      gEnter.append("g").attr("class", "y axis");
      
      var titleGroup = gEnter.append("g").attr("class", "titleGroup");
      titleGroup.append("svg:text").attr("class", "title").text("My New Title");
      titleGroup.append("svg:text").attr("class", "subtitle").attr("dy", "1em");

      // Update the outer dimensions.
      svg.attr("width", width).attr("height", height);

      // Update the inner dimensions.
      var g = svg.select("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Update the lines.
      g.selectAll(".line").attr("d", line);

      // Update the x-axis.
      g.select(".x.axis").attr("transform", "translate(0," + yScale.range()[0] + ")").call(xAxis).on("click", myClickFunction);

      // Update the y-axis.
      g.select(".y.axis").attr("transform", "translate(0," + xScale.range()[0] + ")").call(yAxis).on("click", myRClickFunction);

      //title block
      // Update the title.
      g.select(".titleGroup").attr("transform", "translate(10,-10)");
      g.select(".subtitle").text(dataArray.length + " lines");
      //title.on("click", myRClickFunction);

      //NEW click function for handling mouseclicks on an object.
      function myClickFunction() {//just a silly function taken from http://bl.ocks.org/mbostock/1166403
        //Problem: when you resize the window, it loses the new domain when it redraws the graph.
        //solution 1: when you change domain, set the new domain just like you set width.
        //solution 2: when you redraw the graph, it recalculates the domain. Maybe don't do that anymore.
        console.log("click");

        var n = dataArray[0].length - 1, i = Math.floor(Math.random() * n / 2), j = i + Math.floor(Math.random() * n / 2) + 1;
        xDomain = [xValue(dataArray[0][i]), xValue(dataArray[0][j])];
        xScale.domain(xDomain);
        //It would be nice if you could set this and then call a redraw function.
        var t = g.transition().duration(750);
        t.select(".x.axis").call(xAxis);
        t.selectAll(".line").attr("d", line);
      }

      function myRClickFunction() {
        xDomain = setFullxDomain();
        console.log("myRClickFunction");
        xScale.domain(xDomain);
        var t = g.transition().duration(750);
        t.select(".x.axis").call(xAxis);
        t.selectAll(".line").attr("d", line);
      }

      function setFullxDomain() {
        //console.log("setFullxDomain");
        //set xmax and xmin to x value in first element in first array.
        var xmax = dataArray[0][0][0];
        var xmin = xmax;
        //console.log("xmax: " + xmax + " xmin: " + xmin);
        //d3.min(dataArray[0], xValue);
        var localxMax = xmax;
        var localxMin = xmax;

        //console.log("domain: " + domain);
        //console.log(domain);
        //domain = d3.extent(dataArray[0].map(function(d) {return d.date;}));
        //console.log("new domain: " );
        //console.log(domain);
        //x.domain(d3.extent(data.map(function(d) {return d.date;})));
        for ( i = 0; i < dataArray.length; i++) {
          //loop through each of the arrays.
          //console.log("localxMax before search: " + localxMax);
          localxMax = d3.max(dataArray[i], function(d) {
            return d[0];
          });
          //console.log("localxMax of dataArray[" + i + "] is: " + localxMax);
          if (localxMax > xmax) {
            xmax = localxMax;
          }
          localxMin = d3.min(dataArray[i], function(d) {
            return d[0];
          });
          if (localxMin < xmin) {
            xmin = localxMin;
          }//it will never be smaller than zero.

        }
        return [xmin, xmax];
      }

      function setFullyDomain() {
        //console.log("setFullyDomain");
        //set xmax and xmin to x value in first element in first array.
        var max = dataArray[0][0][1];
        var min = 0;
        //console.log("max: " + max + " min: " + min);
        //d3.min(dataArray[0], xValue);
        var localMax = max;
        var localMin = max;

        //console.log("y domain: " + domain);
        //console.log(domain);
        //domain = d3.extent(dataArray[0].map(function(d) {return d.date;}));
        //console.log("new domain: " );
        //console.log(domain);
        //x.domain(d3.extent(data.map(function(d) {return d.date;})));
        for ( var i = 0; i < dataArray.length; i++) {
          //loop through each of the arrays.
          //console.log("localyMax before search: " + localMax);
          localMax = d3.max(dataArray[i], function(d) {
            return d[1];
          });
          //console.log("localyMax of dataArray[" + i + "] is: " + localMax);
          if (localMax > max) {
            max = localMax;
          }
          localMin = d3.min(dataArray[i], function(d) {
            return d[1];
          });
          if (localMin < min) {
            min = localMin;
          }//it will never be smaller than zero unless it finds a negative value..

        }
        return [min, max];
      }

    });
  }

  // The x-accessor for the path generator; xScale âˆ˜ xValue.
  function X(d) {
    return xScale(d[0]);
  }

  // The x-accessor for the path generator; yScale âˆ˜ yValue.
  function Y(d) {
    return yScale(d[1]);
  }


  chart.margin = function(a) {
    if (!arguments.length)
      return margin;
    margin = a;
    return chart;
  };

  chart.width = function(a) {
    if (!arguments.length)
      return width;
    width = a;
    return chart;
  };

  chart.height = function(a) {
    if (!arguments.length)
      return height;
    height = a;
    return chart;
  };

  chart.x = function(a) {//Do we need this?
    if (!arguments.length)
      return xValue;
    xValue = a;
    return chart;
  };

  chart.y = function(a) {
    if (!arguments.length)
      return yValue;
    yValue = a;
    return chart;
  };

  chart.xscale = function(a) {
    if (!arguments.length){
      console.log("log");
      return xScale;
    }
    if (a ==="linear"){
      console.log("log");
      xScale = d3.scale.linear();
    } else if (a === "log") {
      console.log("log");
      xScale = d3.scale.log();
    } else if (a === "time") {
      xScale = d3.time.scale();
      console.log("time");
    }
    return chart;
  };

  return chart;
}
