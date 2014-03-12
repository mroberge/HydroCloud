/*
 * Analysis.js
 * a suite of functions for use in HydroCloud
 * 
 * (c) 2014 Martin Roberge
 * 
 */

function start(series) {
  var result = d3.min(series, function(d) { return d[0]; });
  return result;
}

function end(series) {
  var result = d3.max(series, function(d) { return d[0]; });
  return result;
}

function elapsed(series) {
  var startTime = start(series);
  var endTime = end(series);
  var result = (endTime.getTime() - startTime.getTime())/(1000 * 60);
  return result;
}

function maxpeak(series) {
  var result = d3.max(series, function(d) { return d[1]; });
  return result;
}

function minvalue(series) {
  var result = d3.min(series, function(d) { return d[1]; });
  return result;
}

function avgTimeUnit(series) {
  var elapsedTime = elapsed(series);
  var result = elapsedTime / (series.length-1);
  return result;
}

function minMaxTimeUnit(series) {
  var timeOnly = series.map(function(d) {return d[0]; });
  var times = [];
  for (i = 0; i < (timeOnly.length - 1); i++) {
    //use minutes as the unit.
    times[i] = (timeOnly[i+1]-timeOnly[i]) / (1000 * 60);
  };
  var result = {
    min: d3.min(times),
    max: d3.max(times)
  };
  return result;
}

function skipped(series) {
  var minMax = minMaxTimeUnit(series);
  var cond1 = (minMax.min === minMax.max ? true : false);
  console.log(cond1);
  return (cond1 ? false : true);
}
