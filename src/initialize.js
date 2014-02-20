var map;
function initialize() {
  //document.getElementById('map_div').style.display = "none";
  var mapOptions = {
    zoom : 8,
    center : new google.maps.LatLng(39.395, -76.609),
    mapTypeId : google.maps.MapTypeId.TERRAIN
  };
  
  //console.log(document.getElementById('map_div'));
  map = new google.maps.Map(document.getElementById('map_div'), mapOptions);

        var points = new google.maps.KmlLayer("http://mroberge.github.io/real.kmz", {
          suppressInfoWindows : true,
          preserveViewport : true,
          map : map
        });

        google.maps.event.addListener(points, 'click', function(kmlEvent) {
          var sDesc = kmlEvent.featureData.description;
          var sName = kmlEvent.featureData.name;
          var re = /^[0-9]+/;
          var sId = re.exec(sName);

          $("#siteName").text(sName);
          $("#siteQ").html(sDesc);
          $("#siteId").text(sId);
          getUSGS(sId[0]);
        });

  tileNEX = new google.maps.ImageMapType({
    getTileUrl : function(tile, zoom) {
      return "http://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/" + zoom + "/" + tile.x + "/" + tile.y + ".png?" + (new Date()).getTime();
    },
    tileSize : new google.maps.Size(256, 256),
    opacity : 0.90,
    name : 'NEXRAD',
    isPng : true
  });

  goes = new google.maps.ImageMapType({
    getTileUrl : function(tile, zoom) {
      return "http://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/goes-east-vis-1km-900913/" + zoom + "/" + tile.x + "/" + tile.y + ".png?" + (new Date()).getTime();
    },
    tileSize : new google.maps.Size(256, 256),
    opacity : 0.40,
    name : 'GOES East Vis',
    isPng : true
  });

  map.overlayMapTypes.push(null);
  //create empty overlay entry
  //map.overlayMapTypes.setAt("0",goes);
  map.overlayMapTypes.setAt("1", tileNEX);

}

google.maps.event.addDomListener(window, 'load', initialize);
