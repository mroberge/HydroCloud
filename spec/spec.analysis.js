describe ("analysis.js is a suite of functions that includes:", function(){
    var series1 = [];
    var startDate = new Date(2012, 05, 01);
    //increment by 15 minutes (1000ms/s * 60s/min * 15 min)
    var increment = 1000 * 60 * 15;
    for (var i = 0; i < 100; i++){
      var time = new Date(startDate.getTime() + (i * increment));
      var value = 40 * Math.sin(i/10) + 100 + i;
      var obs = [time, value];
      series1.push(obs);
    };
    //console.log(startDate);
    //console.log(increment);
    //console.log(series1);

  it("start() returns the first time in a series", function() {
    var startTime = start(series1);
    expect(startTime).toEqual(new Date(2012, 05, 01));
  });
  it("end() returns the last time in a series", function() {
    var endTime = end(series1);
    expect(endTime).toEqual(new Date(2012, 05, 02, 00, 45, 00));
  });
  it(".length returns the number of observations in a series", function() {
    var length = series1.length;
    expect(length).toEqual(100);
  });
  it("elapsed() returns the time in minutes between the start and end times of a series", function() {
    var result = elapsed(series1);
    //the elapsed time between 100 times is equal to 99 * 15.
    expect(result).toEqual(1485);
  });
  it("maxpeak() returns the maximum observed value", function(){
    var result = maxpeak(series1);
    expect(result).toBeCloseTo(219.7956, 4);
  });
  it("minvalue() returns the minimum observed value", function() {
    var result = minvalue(series1);
    expect(result).toEqual(100);
  });
  it("avgTimeUnit() returns the average length of time between each time increment in a series", function() {
    var result = avgTimeUnit(series1);
    //use minutes as units.
    expect(result).toEqual(15);
  });
  it("minMaxTimeUnit() returns the nominal (typical) length of time between each time increment in a series.", function() {
    var result = minMaxTimeUnit(series1);
    expect(result.min).toEqual(15);
    expect(result.max).toEqual(15);
  });
  it("skipped() returns true when observations are missing from a series", function() {
    var result = skipped(series1);
    expect(result).toBe(false);
  });
});
