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
  var result = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
  return result;
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
  for ( i = 0; i < (timeOnly.length - 1); i++) {
    //use minutes as the unit.
    times[i] = (timeOnly[i + 1] - timeOnly[i]) / (1000 * 60);
  };
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
    return;
  }
}

