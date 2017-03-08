function hydrograph(id) {

  var myScreen = {
    width : viewModel.width(),
    height : viewModel.height()
  };
  data.sort(function(a, b) {
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  });

  var sitename = id;
  //future versions of the data object may store the name and site ID. For now, we'll just fake it.

  var margin = {//margin is for the larger focus graph.
    top : 10,
    right : 10,
    bottom : 100,
    left : 40
  }, margin2 = {//margin2 is for the smaller context graph.
    top : myScreen.height - 70,
    right : 10,
    bottom : 20,
    left : 40
  }, width = myScreen.width - margin.left - margin.right, height = myScreen.height - margin.top - margin.bottom, height2 = myScreen.height - margin2.top - margin2.bottom;

  var x = d3.time.scale().range([0, width]);
  //x is focus
  var x2 = d3.time.scale().range([0, width]);
  //x2 is context
  var y = d3.scale.linear().range([height, 0]);
  var y2 = d3.scale.linear().range([height2, 0]);
  //var y = d3.scale.log().range([height, 0]); //Dealt with trouble switching to log by changing y.domain to have a min of 1, not zero.
  //var y2 = d3.scale.log().range([height2, 0]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  //X axis for the focus graph.
  var xAxis2 = d3.svg.axis().scale(x2).orient("bottom");
  //X axis for the context graph.
  var yAxis = d3.svg.axis().scale(y).orient("left");
  //Y axis for the focus graph. Don't bother with a context Y axis.

  function brush() {
    x.domain(brush.empty() ? x2.domain() : brush.extent());
    focus.select("path").attr("d", area);
    focus.select(".x.axis").call(xAxis);
  }

  var brush = d3.svg.brush().x(x2).on("brush", brush);

  var area = d3.svg.area().interpolate("step-before")//If you use the "monotone" interpolate, it will be smooth. "step-before" will give a better idea of the data granularity.
  .x(function(d) {
    return x(d.date);
  }).y0(height).y1(function(d) {
    return y(d.value);
  });

  var area2 = d3.svg.area().interpolate("linear")
    .x(function(d) {
      return x2(d.date);
    })
    .y0(height2)
    .y1(function(d) {
      return y2(d.value);
    });

  d3.select("#graph_div svg").remove();
  var svg = d3.select("#graph_div").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
  svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);
  var focus = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var context = svg.append("g").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  x.domain(d3.extent(data.map(function(d) {
    return d.date;
  })));
  y.domain([1, d3.max(data.map(function(d) {
    return d.value;
  }))]);
  //If y.domain has a min value of 0, then you can't plot in a log scale.'
  x2.domain(x.domain());
  //make the context domain the same as the focus domain.
  y2.domain(y.domain());
  focus.append("path").datum(data).attr("clip-path", "url(#clip)").attr("d", area);
  focus.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
  focus.append("g").attr("class", "y axis").call(yAxis);
  context.append("path").datum(data).attr("d", area2);
  context.append("g").attr("class", "x axis").attr("transform", "translate(0," + height2 + ")").call(xAxis2);
  context.append("g").attr("class", "x brush").call(brush).selectAll("rect").attr("y", -6).attr("height", height2 + 7);

  //title block
  var title = focus.append("g").attr("transform", "translate(125,20)");
  //title.append("svg:text").attr("class", "Title").text(sitename);
  title.append("svg:text").attr("class", "Title").text(viewModel.siteName());
  title.append("svg:text").attr("class", "subTitle").attr("dy", "1em").text(data.length + " measurements");

  //axis labels
  focus.append("text").attr("class", "axisTitle").attr("transform", "rotate(-90)").attr("x", 0).attr("y", 0).attr("dy", "1em").style("text-anchor", "end").text("Stream discharge (cfs)");
  focus.append("text").attr("class", "axisTitle").attr("x", width).attr("y", height - 2).style("text-anchor", "end").text("time");
}

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

function flowduration(id) {
  console.log("flowduration");
  var myScreen = {
    width : viewModel.width(),
    height : viewModel.height()
  };

  var sitename = id;
  //future versions of the data object may store the name and site ID. For now, we'll just fake it.
  //var sorted = [];
  //sorted = data;//this just passes a reference, so data will get sorted too.
  data.sort(function(a, b) {
    return a.value < b.value ? 1 : a.value > b.value ? -1 : 0;
  });
  //console.log(sorted);

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
    return yScale(d.value);
  });

  d3.select("#graph_div svg").remove();
  var svg = d3.select("#graph_div").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
  svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", width).attr("height", height);
  var focus = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  xScale.domain(d3.extent([0, data.length]));
  yScale.domain([1, d3.max(data.map(function(d) {
    return d.value;
  }))]);
  //If y.domain has a min value of 0, then you can't plot in a log scale.'

  focus.append("path").datum(data).attr("clip-path", "url(#clip)").attr("d", area);
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
    });
  var area2 = d3.svg.area().interpolate("step-before")
    .x(function(d) {
      return xScale(d.date);
    })
    .y0(height2)
    .y1(function(d) {
      return y2Scale(d.value);
    });
    
  //Plot the data from the viewModel.dataArray() that matches the sID.
  var siteIndex = viewModel.siteIdArray().indexOf(id);
  if (siteIndex === -1) {
    //The id should be in the siteIdArray already; this should have been tested for already. If it isn't, it returns -1.
    console.log("Hyetograph() was called with an id that is not in the siteIdArray.")
    console.log("id: " + id + "; the siteIndex is: " + siteIndex + "; and the siteIdArray:")
    console.dir(viewModel.siteIdArray());
    return;
  }

  var stream = viewModel.dataArray()[siteIndex]; //this is the last site in the array.
  //var rain = viewModel.tuNexrad().data;
  var rain = null;
  if (!stream) {
    //No data!
    console.log("!stream");
    //no data, so we can't plot, so return?
    return;
  }
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

function dateStr(d) {
  var month = +d.getMonth() + 1;
  month = new String("00" + month).slice(-2);
  var date = +d.getDate();
  date = new String("00" + date).slice(-2);

  var now = {
    time : d,
    year : d.getFullYear(),
    month : month,
    date : date
  };
  //console.log(now);
  var dstr = "" + now.year + "-" + now.month + "-" + now.date;
  //console.log(dstr);
  return dstr;
}

function processN(inputArray) {
  var myArray = [];
  InputArray.forEach(function (d, index, array) {
    myArray[index] = {};
    myArray[index].date = new Date(d.dateTime);
    myArray[index].value = +d.precipitation;
  });
  //console.log(myArray);
  return myArray;
}

function getTuNexrad(id) {
  //add some error functions.
  //if new data is requested, get rid of old data, set one element to null.
  viewModel.tuNexrad({status: "requesting data...", data: [{date: null, value: null}]});
  console.log("requesting data from TU NEXRAD service");
  //var now = new Date(); //system stopped collecting data 2015-03-01
  //var end = new Date(now - (1 * 24 * 60 * 60 * 1000));
  //var start = new Date(end - (90 * 24 * 60 * 60 * 1000));
  var endstr = "/enddate=" + dateStr(time.end);
  var startstr = "/startdate=" + dateStr(time.start);
  //var endstr = "/enddate=" + dateStr(end);
  //var startstr = "/startdate=" + dateStr(start);
  var urlDates = "http://10.55.15.196:5000/nexradTS/id=" + id + startstr + endstr;
  var urlRecent = "http://10.55.15.196:5000/nexradTSrecent/id=" + id + "/recent=" + time.recent;

  //console.log(endstr);
  result = $.ajax({
    url : urlDates,
    //url : urlRecent,
    dataType : "json",
    error : function (ErrObj, ErrStr) {
      console.log("TUnexrad returns an error");
      console.log(ErrObj);//The header.
      console.log(ErrStr);//just returns "error". This is ErrObj.statusText
      viewModel.tuNexrad({status: "data not available"});
      viewModel.plotGraph();
    },
    success : function (returnedJSON, statusMsg, returnedjqXHR) {
      //TODO: test this to make sure it responds properly when data is returned.
      //Use this if we get some data back.
      console.log("Success! vM.tuNexrad:");
      console.log(viewModel.tuNexrad());
      viewModel.tuNexrad({status: "success", data: processN(result.returnedJSON)});
      viewModel.plotGraph();
    },
    //Stop using complete except to catch non-error and non-success.
    complete : function() {
      console.log("NEXRAD request complete");
      console.log(result);
    }
  });
}

function getUSGS(id) {
  //add some error functions.
  //if new data is requested, get rid of old data, set one element to null.
  //viewModel.dataArray([null,null]);
  var data = [];
  var stored = checkStorage(id);
  if (stored) {
    console.log("data for site " + id + " retrieved from localStorage; length: " + stored.length);
    //console.log(stored);
    data = stored;
    viewModel.dataArray.push(data);
    //console.log(viewModel.dataArray()[viewModel.dataArray().length - 1]);
    viewModel.plotGraph();
    return;
  }
  // Nothing stored locally, so make data request.
  // strip the id of the leading characters before requesting from USGS.
  var re = /[0-9]+/;
  var usgsId = re.exec(id)[0];
  console.log("id: " + id + ", usgsId: " + usgsId);
  var localQuery = "resources/USGSshort.txt";
  var recentQuery = "http://nwis.waterservices.usgs.gov/nwis/iv/?format=json&sites=" + usgsId + "&period=P" + time.recent + "D&parameterCd=00060";
  var dateQuery = "http://nwis.waterservices.usgs.gov/nwis/iv/?format=json&sites=" + usgsId + "&startDT=" + dateStr(time.start) + "&endDT=" + dateStr(time.end) + "&parameterCd=00060";
  var staticQuery = "http://nwis.waterservices.usgs.gov/nwis/iv/?format=json&sites=01646500&startDT=2013-05-01&endDT=2013-5-10&parameterCd=00060";
  var testDaily = "http://waterservices.usgs.gov/nwis/dv/?format=json&sites=01646500&period=P10D&parameterCd=00060";
  var recentDaily = "http://waterservices.usgs.gov/nwis/dv/?format=json&sites=" + usgsId + "&period=P" + time.recent + "D&parameterCd=00060";

  if (id == "local") {
    var url = recentDaily;
  } else {
    // The ideal query for now (2017-03-07) is to request a small amount of the most recent daily data: recentDaily
    // recentDaily will minimize the impact the program has on the USGS servers.
    var url = localQuery;
  }
  result = $.ajax({
    url: url,
    //headers: {"Accept-Encoding": "gzip, compress"},
    dataType: "json",
    error: function (ErrObj, ErrStr) {
      console.log("USGS returns an error");
      console.log(ErrObj);//The header.
      console.log(ErrStr);//This is ErrObj.statusText
      //Display a message, don't plot the graph?
      //viewModel.plotGraph();
    },
    success: function (returnedData, statusMsg, returnedjqXHR) {//TODO: test this to make sure it responds properly when data is returned.
      //Use this if we get some data back.
      console.log("Successful data request from USGS!");
      console.log(statusMsg); // StatusMsg should be "success"
      console.log(returnedjqXHR);
      console.log(returnedData); // localQuery looks great.
      //process data
      //    check for no data or empty set; timeSeries[0] is empty
      if (!returnedData.value.timeSeries[0].values[0].value) {
        //TODO: test if this is able to handle sites with no data; usgs returns [].
        console.warn("there is no data for this site");
        //Do something!
        return; //should trigger "complete".
      }
      var temp = returnedData.value.timeSeries[0].values[0].value;
      //console.log(temp);
      temp.forEach(function (d, index, array) {
        //    convert values to dates and numbers
        data[index] = [];
        data[index][0] = new Date(d.dateTime);
        data[index][1] = +d.value;
        //    screen out -999 values; replace with null? or 0.
        //    a more precise way would be to obtain the actual 'noDataValue'
        //    located at: returnedData.value.timeSeries[0].variable.noDataValue
        if (data[index][1] < 0) data[index][1] = null;
      });
      //console.log("post-processing");
      //console.log(data);
      //save the data to localStorage
      saveData(id, data);
      //add data to viewModel.dataArray
      viewModel.dataArray.push(data);
      viewModel.plotGraph();
    },
    //Stop using complete except to catch non-error and non-success.
    complete: function () {
      console.log("USGS request for site " + id + "complete.");
      //console.log(result); //just returns 'success'
    }
  });

}
