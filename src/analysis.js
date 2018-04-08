/*
 * Analysis.js
 * a suite of functions for use in HydroCloud
 *
 * (c) 2014 Martin Roberge
 *
 */

function start(series) {
  var result = d3.min(series, function(d) {
    return d[0];
  });
  return result;
}

function end(series) {
  var result = d3.max(series, function(d) {
    return d[0];
  });
  return result;
}

function elapsed(series) {
  var startTime = start(series);
  var endTime = end(series);
  return (endTime.getTime() - startTime.getTime()) / (1000 * 60);
}

function maxpeak(series) {
  var result = d3.max(series, function(d) {
    return d[1];
  });
  return result;
}

function minvalue(series) {
  var result = d3.min(series, function(d) {
    return d[1];
  });
  return result;
}

function avgTimeUnit(series) {
  var elapsedTime = elapsed(series);
  var result = elapsedTime / (series.length - 1);
  return result;
}

function minMaxTimeUnit(series) {
  var timeOnly = series.map(function(d) {
    return d[0];
  });
  var times = [];
  for ( var i = 0; i < (timeOnly.length - 1); i++) {
    //use minutes as the unit.
    times[i] = (timeOnly[i + 1] - timeOnly[i]) / (1000 * 60);
  }
  var result = {
    min : d3.min(times),
    max : d3.max(times)
  };
  return result;
}

function skipped(series) {
  var minMax = minMaxTimeUnit(series);
  var cond1 = (minMax.min === minMax.max ? true : false);
  //console.log(cond1);
  return ( cond1 ? false : true);
}

//Interpolation function
//These return a Y value from a time series for a given time.

function interBefore(series, time) {
  //console.log("interBefore()");
  //console.log(series);
  //console.log(time);
  if (time < start(series) || time > end(series)) {
    console.log("time not in series");
    return null;
  }
  //return the value that occurs before the selected time.
  //.left and .right only matter if time matches a value in series.
  var bisect = d3.bisector(function(d) {
    return d[0];
  }).right;
  //console.log(bisect);
  var i = bisect(series, time);
  //console.log(i);
  var result = series[i-1][1];
  //console.log(result);
  return result;
}

function interLinear(series, time) {
  //console.log("interLinear()");
  //console.log(series);
  //console.log(time);
  if (time < start(series) || time > end(series)) {
    console.log("time not in series");
    return null;
  }
  if (Math.abs(time - end(series)) < 1) {
    console.log("time at end of series.");
    //return last value.
    return series[series.length-1][1];
  }
  //return the value that occurs before the selected time.
  //.left and .right only matter if time matches a value in series.
  var bisect = d3.bisector(function(d) {
    return d[0];
  }).right;
  //console.log(bisect);
  var i = bisect(series, time);
  var x0 = series[i-1][0];
  var x1 = series[i][0];
  var y0 = series[i-1][1];
  var y1 = series[i][1];
  var x = time;

  var result = y0 + ((x - x0) * (y0 - y1)) / (x0 - x1);
  return result;
}

function tableJoin(input) {
  if (input) {

    var result = {
      id : ["time", "name1", "name2"],
      data : [[1, 2, 3], [1, 2, 3]]
    };
    return result;
  } else {

  }
}

function joinData(array1, array2) {
  // Combine two datasets, sort, and remove redundant elements based on the time the element was recorded.
  // Keeps the value from the first array in the case of a duplicate.
  var join = array1.concat(array2);
  join.sort(function (a, b) {
    return a[0] - b[0];
  });
  var result = [];
  var temp;
  var threshold = 100000; //100 seconds.
  join.forEach(function (el, i, array){
    var diff = Math.abs(el[0] - temp);
    if(diff < threshold) {
      //dateTimes are roughly the same. Close enough for me!
      //We won't bother saving this element; we'll just keep the previous element.
    } else {
      //This element is a different time than the previous element, so keep it.
      result.push(el);
    }
    temp = el[0];
  });
  return result;
}

function datatostring (data) {
  //Okay, there's not much point to this function.
  var string = JSON.stringify(data);
  return string;
}

function stringtodata (string) {
  var data = JSON.parse(string);
  data.forEach(function(d, index, array){
    d[0] = new Date(d[0]);
    d[1] = +d[1];
  });
  return data;
}

function colors(n) {
    var colorList = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
    return colorList[n % colorList.length];
}