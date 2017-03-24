// spec sheet for the graphing files

describe("The graph-flowduration.js file", function() {
  it("contains a graph drawing function named flowduration(id)", function () {
    expect(hydrograph).toBeDefined();
    expect(hydrograph).toEqual(jasmine.any(Function));
  });
});

describe("The graph-hydrograph.js file", function() {  
  it("contains a graph-drawing function named hydrograph()", function() {
    expect(hydrograph).toBeDefined();
    expect(hydrograph).toEqual(jasmine.any(Function));
  });
});

describe("The graph-hyetograph.js file", function() {
  it("contains a graph-drawing function named hyetograph()", function() {
    expect(hyetograph).toBeDefined();
    expect(hyetograph).toEqual(jasmine.any(Function));
  });
});

describe("The graph-loghistogram.js file", function() {
  it("contains a graph-drawing function named loghistogram()", function() {
    expect(loghistogram).toBeDefined();
    expect(loghistogram).toEqual(jasmine.any(Function));
  });
});

describe("The graph-hydrograph.js file", function() {
    describe("The hyetograph() function", function() {
    it("", function() {//it modifies global variables and adds stuff to the DOM. hard to test.

    });

  });
});

describe("The graph-hydrograph.js file", function() {
  it("contains a data-loading and parsing function named getUSGS()", function() {
    expect(getUSGS).toBeDefined();
    expect(getUSGS).toEqual(jasmine.any(Function));
  });
});