describe("analysis.js is a suite of functions that includes:", function() {
  var series1 = [];
  var startDate = new Date(2012, 05, 01);
  //increment by 15 minutes (1000ms/s * 60s/min * 15 min)
  var increment = 1000 * 60 * 15;
  for (var i = 0; i < 100; i++) {
    var time = new Date(startDate.getTime() + (i * increment));
    var value = 40 * Math.sin(i / 10) + 100 + i;
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
  it("maxpeak() returns the maximum observed value", function() {
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

describe("The interpolation functions return a Y value for a given X value.", function() {
  var series2 = [[new Date(2013, 1, 1), 1], [new Date(2013, 1, 2), 3], [new Date(2013, 1, 3), 3], [new Date(2013, 1, 4), 1], [new Date(2013, 1, 5), 3]];
  //console.log(series2);

  describe("The interBefore() function", function() {
    it("will return null if given a time that is out of range.", function(){
      console.log("test 1");
      expect(interBefore(series2, new Date(2000, 0))).toBeNull;
      expect(interBefore(series2, new Date(2014, 0))).toBeNull;
      //one millisecond before the first measurement.
      expect(interBefore(series2, new Date(2013, 1, 0, 23, 59, 59, 999))).toBeNull;
      //One millisecond after the last measurement.
      expect(interBefore(series2, new Date(2013, 1, 5, 0, 0, 0, 1))).toBeNull;
    });
    it("will return the most recent measurement to occur before the given time.", function() {
      console.log("test 2");
      expect(interBefore(series2, new Date(2013, 1, 1, 12))).toEqual(1);
      expect(interBefore(series2, new Date(2013, 1, 1, 23, 59, 59, 998))).toEqual(1);
      expect(interBefore(series2, new Date(2013, 1, 2, 12))).toEqual(3);
      expect(interBefore(series2, new Date(2013, 1, 3, 12))).toEqual(3);
    });
    it("will return the measurement from a matching time.", function() {
      console.log("test 3");
      //The first time in the series.
      expect(interBefore(series2, new Date(2013, 1, 1))).toEqual(1);
      expect(interBefore(series2, new Date(2013, 1, 2))).toEqual(3);
      //The last time in the series.
      expect(interBefore(series2, new Date(2013, 1, 5))).toEqual(3);
    });
  });
  describe("The interLinear() function", function() {
    it("will return null if given a time that is out of range.", function(){
      console.log("test 1");
      expect(interLinear(series2, new Date(2000, 0))).toBeNull;
      expect(interLinear(series2, new Date(2014, 0))).toBeNull;
      //one millisecond before the first measurement.
      expect(interLinear(series2, new Date(2013, 1, 0, 23, 59, 59, 999))).toBeNull;
      //One millisecond after the last measurement.
      expect(interLinear(series2, new Date(2013, 1, 5, 0, 0, 0, 1))).toBeNull;
    });
    it("will return a linear interpolation for a given time.", function() {
      console.log("test 2");
      expect(interLinear(series2, new Date(2013, 1, 1, 12))).toEqual(2);
      expect(interLinear(series2, new Date(2013, 1, 1, 23, 59, 59, 998))).toBeCloseTo(3, 2);
      expect(interLinear(series2, new Date(2013, 1, 2, 12))).toEqual(3);
      expect(interLinear(series2, new Date(2013, 1, 3, 12))).toEqual(2);
    });
    it("will return the measurement from a matching time.", function() {
      console.log("test 3");
      //The first time in the series.
      expect(interLinear(series2, new Date(2013, 1, 1))).toEqual(1);
      //A time in the middle of the series.
      expect(interLinear(series2, new Date(2013, 1, 2))).toEqual(3);
      //The last time in the series.
      expect(interLinear(series2, new Date(2013, 1, 5))).toEqual(3);
    });
  });
});

describe("The tableJoin() function", function() {
  var data1 = {
    id: "123456",
    data: [[new Date(2012, 0, 1, 0), 100],[new Date(2012, 0, 1, 1), 100],[new Date(2012, 0, 1, 2), 100],[new Date(2012, 0, 1, 3), 100],[new Date(2012, 0, 1, 4), 100]]
  };
  console.log(data1);
  var data2 = {
    id: "987654",
    data: [[new Date(2012, 0, 1, 3, 0), 200],[new Date(2012, 0, 1, 3, 15), 200],[new Date(2012, 0, 1, 3, 30), 200],[new Date(2012, 0, 1, 3, 45), 200],[new Date(2012, 0, 1, 4, 0), 200],[new Date(2012, 0, 1, 4, 15), 200]]
  };
  console.log(data2);
  
  it("will return undefined if called with no parameters", function() {
    expect(tableJoin()).toBeUndefined;
  });
  it("will return an object with two properties: data and id", function() {
    var joined = tableJoin(data1, data2);
    expect(joined.data).toBeDefined();
    expect(joined.id).toBeDefined();
  });
  
  describe("contains a validate() function that", function() {
    xit("returns 'invalid' if a data object is invalid", function() {
      expect(dataJoin.validate()).toEqual("invalid");
    });
    xit("validates input objects to determine if they have id and data", function() {
      var result = tableJoin(data1);
      expect(result).toBeDefined();
    });
  });
  

  xit("accepts multiple data objects as input", function() {
    var result = tableJoin(data1,data2,data1);
    expect(result).toBeDefined();
  });
  it("returns an object unchanged if it is the only input", function() {
    var result = tableJoin(data1);
    expect(result).toEqual(data1);
  });
  xit("will return data: null and id: null if input an empty series", function() {
    var result = tableJoin([]);
    expect(result.data).toBeNull();
    expect(result.id).toBeNull();
  });
  
});
