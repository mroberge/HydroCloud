// spec sheet for index-drawGraph.js

describe("The drawGraph.js file", function() {
  it("contains a graph-drawing function named hydrograph()", function() {
    expect(hydrograph).toBeDefined();
    expect(hydrograph).toEqual(jasmine.any(Function));
  });
  it("contains a graph-drawing function named loghistogram()", function() {
    expect(loghistogram).toBeDefined();
    expect(loghistogram).toEqual(jasmine.any(Function));
  });
  it("contains a graph-drawing function named flowduration()", function() {
    expect(flowduration).toBeDefined();
    expect(flowduration).toEqual(jasmine.any(Function));
  });
  it("contains a data-loading and parsing function named getUSGS()", function() {
    expect(getUSGS).toBeDefined();
    expect(getUSGS).toEqual(jasmine.any(Function));
  });
});