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

);
