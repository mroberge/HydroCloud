describe("The HydroCloud project", function() {
  it("contains a map-drawing function named drawMap()", function() {
    expect(drawMap).toBeDefined();
    expect(drawMap).toEqual(jasmine.any(Function));
  });
  it("contains a graph-drawing function named scatterChart()", function() {
    expect(scatterChart).toBeDefined();
    expect(scatterChart).toEqual(jasmine.any(Function));
  });
  it("includes hcfixture.html", function() {
    loadFixtures("hcfixture.html");
    expect($("body")).toExist();
  });

  describe("The reusableScatterChart library", function() {
    it("has been loaded", function() {
      expect(scatterChart).toBeDefined();
    });

    it("includes margin, width, height, x, and y...", function() {
      expect(scatterChart().margin).toBeDefined();
      expect(scatterChart().width).toBeDefined();
      expect(scatterChart().height).toBeDefined();
      expect(scatterChart().x).toBeDefined();
      expect(scatterChart().y).toBeDefined();
    });

    it("...which return functions...", function() {
      // .margin returns the function.
      expect(scatterChart().margin).toEqual(jasmine.any(Function));
      expect(scatterChart().width).toEqual(jasmine.any(Function));
      expect(scatterChart().height).toEqual(jasmine.any(Function));
      expect(scatterChart().x).toEqual(jasmine.any(Function));
      expect(scatterChart().y).toEqual(jasmine.any(Function));
    });

    it("...or values.", function() {
      //  .margin() returns the default value.
      expect(scatterChart().margin()).toEqual(jasmine.any(Object));
      expect(scatterChart().margin().top).toEqual(jasmine.any(Number));
      expect(scatterChart().margin().right).toEqual(jasmine.any(Number));
      expect(scatterChart().margin().bottom).toEqual(jasmine.any(Number));
      expect(scatterChart().margin().left).toEqual(jasmine.any(Number));
      expect(scatterChart().width()).toEqual(jasmine.any(Number));
      expect(scatterChart().height()).toEqual(jasmine.any(Number));
      //.x and .y return function xValue() and yValue().
      expect(scatterChart().x()).toEqual(jasmine.any(Function));
      expect(scatterChart().y()).toEqual(jasmine.any(Function));

      //var test = scatterChart().width(5);
      //console.log(test);
      //console.log(scatterChart().width(5));
      //expect(scatterChart().width(5)).toBe(test);  //doesn't work.
      //expect(scatterChart().width(5)).toEqual(test); //doesn't work.'
      expect(scatterChart().width(5)).toEqual(jasmine.any(Function));
      //  .width(5) should return the chart function.

    });
    it("can get the default value", function() {
      var testChart = scatterChart();
      var defaultMargin = {
        top : 20,
        right : 60,
        bottom : 20,
        left : 40
      };
      expect(testChart.margin()).toEqual(defaultMargin);
      expect(testChart.margin().top).toEqual(20);
      expect(testChart.width()).toEqual(760);
      expect(testChart.height()).toEqual(120);

      /*
       console.log("default values");
       console.log(testChart.x);
       testChart.x(function (d) {return 2+d});
       testChart.x()
       console.log(testChart.x());
       condole.log(testChart.x());
       */
    });
    it("can set the default to a new value", function() {
      var testChart = scatterChart();
      //we need to define testChart each time.
      //console.log("set new values");

      var defaultMargin = {
        top : 20,
        right : 60,
        bottom : 20,
        left : 40
      };
      var newMargin = {
        top : 1,
        right : 2,
        bottom : 3,
        left : 4
      };
      expect(testChart.margin()).toEqual(defaultMargin);
      testChart.margin(newMargin);
      //set the margin.
      expect(testChart.margin()).toEqual(newMargin);

      expect(testChart.margin().top).toEqual(1);
      testChart.margin().top = 5;
      //set the top margin to 5.
      expect(testChart.margin().top).toEqual(5);
      testChart.margin({
        right : 17
      });
      //another way to set a margin value.
      expect(testChart.margin().right).toEqual(17);

      expect(testChart.width()).toEqual(760);
      testChart.width(9);
      //set the width to 9.
      expect(testChart.width()).toEqual(9);

      expect(testChart.height()).toEqual(120);
      testChart.height(11);
      //set the height to 11.
      expect(testChart.height()).toEqual(11);
    });
  });
  describe("hcfixture.html", function(){
    it("contains a header", function(){
      loadFixtures("hcfixture.html");
      expect($("body")).toContainElement("header");
    });
    it("contains a container for the views named container_div", function(){
      loadFixtures("hcfixture.html");
      expect($("body")).toContainElement("div#container_div");
    });
    it("contains a footer", function(){
      loadFixtures("hcfixture.html");
      expect($("body")).toContainElement("footer");
    });
    describe("the header", function(){
      it("contains an h1 element #logo that says HydroCloud", function(){
        loadFixtures("hcfixture.html");
        expect($("header")).toContainElement("H1#logo");
        expect($("#logo")).toContainText("HydroCloud");
      });
    });
  });
});

describe("The D3 library", function() {
  it("has been loaded", function() {
    expect(d3.interpolate(0, 1)).not.toEqual(0.5);
    expect(d3).toBeDefined();
  });
});

describe("The jasmine-jquery library", function() {
  it("contains a div named sandbox", function() {
    setFixtures(sandbox());
    expect($('#sandbox')).toBeEmpty();
    expect($('#sandbox')).toExist();
    expect($('#sandbox')).toBeInDOM();
    expect($('#sandbox')).toContainText("");
  });
  it("contains a div named myfixture", function() {
    loadFixtures("myfixture.html");
    expect($("#myfixture")).toContainText("sample text");
    expect($("#myfixture")).toExist();
    expect($("#myfixture")).toBeInDOM();
  });
});
