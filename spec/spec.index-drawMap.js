//Spec sheet for index-drawMap.js

describe("The drawMap.js file", function() {
  it("contains a map-drawing function named drawMap()", function() {
    expect(drawMap).toBeDefined();
    expect(drawMap).toEqual(jasmine.any(Function));
  });
  describe("The initialize function", function() {
    it("requires a div called #map_div", function(){
      jasmine.getFixtures().set('<div id="map_div"></div>');
      expect($('#map_div')).toBeEmpty();
      expect($('#map_div')).toExist();
      expect($('#map_div')).toBeInDOM();
      expect($('#map_div')).toContainText("");
    });
    xit("starts by using the TERRAIN map type", function(){
      jasmine.getFixtures().set('<div id="map_div"></div>');
      initialize();
      //expect(initialize.mapOptions.mapTypeId).toExist();
      // = google.maps.MapTypeId.TERRAIN;
    });
    xit("puts a map into #map_div", function(){
      jasmine.getFixtures().set('<div id="map_div"></div>');
      initialize();
      expect($('#map_div')).not.toBeEmpty();
    });
  });
});