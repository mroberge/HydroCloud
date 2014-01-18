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
  var margin = {top: 20, right: 60, bottom: 20, left: 40},
      width = 760,
      height = 120,
      xValue = function(d) { return +d[0]; },
      yValue = function(d) { return +d[1]; },
      xScale = d3.scale.linear(),
      yScale = d3.scale.linear(),
      xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0),
      yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(6, 0).ticks(5),//NEW
      area = d3.svg.area().x(X).y1(Y),
      line = d3.svg.line().x(X).y(Y),
      xDomain = [];//leave empty. First time data are loaded, it will calculate the full x domain.
  var fullxDomain = [],
      fullyDomain = [];

  function chart(selection) {
    selection.each(function(dataArray) {      
      // Convert data to standard representation greedily;
      // this is needed for nondeterministic accessors.
      for (i=0; i < dataArray.length; i++){
          dataArray[i] = dataArray[i].map(function(d, i) {
              return [xValue.call(dataArray[i], d, i), yValue.call(dataArray[i], d, i)];
          });
          
      };
      
/*   This is the old function that the new function is based upon.
      data = data.map(function(d, i) {
        return [xValue.call(data, d, i), yValue.call(data, d, i)];
      }); 
*/

      if (!xDomain.length) {//if xDomain hasn't been set yet, set it to the full domain.
          //xDomain = d3.extent(dataArray[0], function(d) { return d[0]; });
          xDomain = setFullxDomain();
      };

      // Update the full x & y domain.
      fullxDomain = setFullxDomain();
      fullyDomain = setFullyDomain();
     
      // Update the x-scale.
      xScale
          .domain(xDomain)//don't change the xDomain.
          .range([0, width - margin.left - margin.right]);

      // Update the y-scale.
      yScale
          //.domain([0, d3.max(dataArray[0], function(d) { return d[1]; })])//need to set extent in a new way, since some lines will have a different max.
          .domain(fullyDomain)
          .range([height - margin.top - margin.bottom, 0]);

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([dataArray]);//bind data to svg if it exists. IF it doesn't, then a new one will be made in the next line with the .enter(); WE only want one graph, so we should only have one element in the array.
      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter().append("svg").append("g");//took out when I took out .data() above.

      
      var lineGroup = gEnter.append("g").attr("class", "lineGroup");
      var lineEnter = lineGroup.selectAll("path").data(dataArray).enter().append("path").attr("class", "line");//.attr("d", line);//don't draw the line yet. update the size of the svg first.
      

      gEnter.append("g").attr("class", "x axis");
      gEnter.append("g").attr("class", "y axis");
      
      // Update the outer dimensions.
      svg .attr("width", width)
          .attr("height", height);

      // Update the inner dimensions.
      var g = svg.select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      // Update the lines.
      g.selectAll(".line").attr("d", line);

      // Update the x-axis.
      g.select(".x.axis")
          .attr("transform", "translate(0," + yScale.range()[0] + ")")
          .call(xAxis)
          .on("click", myClickFunction);
          
      // Update the y-axis.  
      g.select(".y.axis")
          .attr("transform", "translate(0," + xScale.range()[0] + ")")
          .call(yAxis)
          .on("click", myRClickFunction);

      //title block
      var title = g.append("g").attr("transform", "translate(10,-10)");
      title.append("svg:text").attr("class", "Title").text("title");
      title.append("svg:text").attr("class", "subTitle").attr("dy", "1em").text(dataArray.length + " lines");
      title.on("click", myRClickFunction);


          
      //NEW click function for handling mouseclicks on an object.
      function myClickFunction(){ //just a silly function taken from http://bl.ocks.org/mbostock/1166403 
          //Problem: when you resize the window, it loses the new domain when it redraws the graph.
          //solution 1: when you change domain, set the new domain just like you set width.
          //solution 2: when you redraw the graph, it recalculates the domain. Maybe don't do that anymore.
          console.log("click");

          var n = dataArray[0].length - 1,
              i = Math.floor(Math.random() * n / 2),
              j = i + Math.floor(Math.random() * n / 2) + 1;
          xDomain = [xValue(dataArray[0][i]), xValue(dataArray[0][j])];
          xScale.domain(xDomain);//It would be nice if you could set this and then call a redraw function.
          var t = g.transition().duration(750);
          t.select(".x.axis").call(xAxis);
          t.selectAll(".line").attr("d", line);
      }
      
      function myRClickFunction(){
          xDomain = setFullxDomain();
          console.log("myRClickFunction");
          xScale.domain(xDomain);
          var t = g.transition().duration(750);
          t.select(".x.axis").call(xAxis);
          t.selectAll(".line").attr("d", line);
      }
      
      function setFullxDomain (){
          var max = 0,
              min = 0,
              localMax = 0,
              localMin = 0
              domain = [];
          for (i=0; i < dataArray.length; i++){
            localMax = d3.max(dataArray[i], function(d) { return d[0]; });
            if(localMax>max) max = localMax;
            localMin = d3.min(dataArray[i], function(d) { return d[0]; });
            if(localMin<min) min = localMin;
          }
          domain = [min, max];
          return domain;
      }
      
      function setFullyDomain (){
          var max = 0,
              min = 0,
              localMax = 0,
              localMin = 0
              domain = [];
          for (i=0; i < dataArray.length; i++){
            localMax = d3.max(dataArray[i], function(d) { return d[1]; });
            if(localMax>max) max = localMax;
            localMin = d3.min(dataArray[i], function(d) { return d[1]; });
            if(localMin<min) min = localMin;
          }
          domain = [min, max];
          return domain;
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
    if (!arguments.length) return margin;
    margin = a;
    return chart;
  };

  chart.width = function(a) {
    if (!arguments.length) return width;
    width = a;
    return chart;
  };

  chart.height = function(a) {
    if (!arguments.length) return height;
    height = a;
    return chart;
  };
  
  chart.x = function(a) {//What is this for? Is it for getting and setting the function that accesses the data??? How would I use it?
    if (!arguments.length) return xValue;
    xValue = a;
    return chart;
  };
 
  chart.y = function(a) {
    if (!arguments.length) return yValue;
    yValue = a;
    return chart;
  };

  return chart;
}
