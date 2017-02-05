var map;
var fusionLayerInfoWindow;
var center = new google.maps.LatLng(39.395, -76.609);

function drawMap() {
  //document.getElementById('map_div').style.display = "none";
  var mapOptions = {
    zoom : 8,
    center : new google.maps.LatLng(39.395, -76.609),
    mapTypeId : google.maps.MapTypeId.TERRAIN
  };

  //console.log(document.getElementById('map_div'));
  map = new google.maps.Map(document.getElementById('map_div'), mapOptions);

  fusionLayerInfoWindow = new google.maps.InfoWindow();

  //Fusion tables load much faster than KML layers!
  //fusion table ID: 11Ujto70g1r7bWNSax5X84KYYuTpwPGmWeacAhkwP
  var fusionLayer = new google.maps.FusionTablesLayer({
    query : {
      select : 'location',
      //real.kmz, has more sites than Gages II, but less info.
      //from : '1Rt_U4LqeNPi6Tk1-kq8ta-6OP748nJJJTqdwlC0Q'

      //from Gages II merge, too large, takes too long to load
      from : '1wtRBQVozXdLsn5t0PL8egL5wL7tUzFQvw6NYQizn'

      //from Gages II merge- small
      //from : '103gQIyU069THrk7KGZYtbC8_My1rW4JwaHhX1ehe'
      //where : 'DRAIN_SQKM < 20'
    },
    suppressInfoWindows: true
  });
  fusionLayer.setMap(map);

  google.maps.event.addListener(fusionLayer, 'click', function(event) {
    //Parse real.kmz
    //var re = /[0-9]+/;
    //var sId = re.exec(event.row.site_no.value)[0];
    //var siteName = event.row.station_nm.value;
    //var siteArray = {id: sId, name: event.row.station_nm.value, area: +event.row.drain_area_va.value};

    //Parsing Gages II merge
    var sId = event.row.STAID.value;
    var siteName = event.row.STANAME.value;
    var siteArray = {id: sId, name: siteName, area: +event.row.DRAIN_SQKM.value, impervious: +event.row.IMPNLCD06.value};

    //update our InfoWindow, then open it.
    fusionLayerInfoWindow.setOptions(
        {
          //content: event.infoWindowHtml, //You can also use the default html as set by the fusion table.
          content: "<div class='googft-info-window'>" +
                    "<b>" + siteName + "</b><br>" +
                    "<b>site ID: </b>" + sId + "<br>" +
                    "</div>",
          position: event.latLng,
          pixelOffset: event.pixelOffset
        });
    fusionLayerInfoWindow.open(map);

    //Update the viewModel with new site info.
    viewModel.siteId(sId);
    viewModel.siteName(siteName);
    viewModel.siteArray.push(siteArray);
    //This siteIdArray.push won't capture the first data requested.
    viewModel.siteIdArray.push(sId);
    //console.log(viewModel.siteId());
    console.log(viewModel.siteArray());
    //viewModel.siteName.push(kmlEvent.featureData.name);

    getUSGS(sId);
    getTuNexrad(sId);
  });
  
/*
  //KML layers can use real-time updates from USGS, and will plot 5,000 points quickly... compared to plotting 5,000 points using other methods.
  //The KML layer still loads too slowly, or not at all.
  var points = new google.maps.KmlLayer("http://waterwatch.usgs.gov/kmls/real.kmz", {
    suppressInfoWindows : true,
    preserveViewport : true,
    map : map
  });

  google.maps.event.addListener(fusionLayer, 'click', function(event) {
    console.log(event);
    var re = /^[0-9]+/;
    var sId = re.exec(event.featureData.name)[0];
    viewModel.siteId(sId);
    viewModel.siteName(event.featureData.name);
    //This siteIdArray.push won't capture the first data requested.
    viewModel.siteIdArray.push(+sId);
    console.log(viewModel.siteId());
    console.log(viewModel.siteIdArray());
    //viewModel.siteName.push(kmlEvent.featureData.name);

    //console.log(sId);
    //console.log(viewModel.siteId());
    //console.log(viewModel.siteName());

    getUSGS(sId);
  });
*/

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
  google.maps.event.addListener(map, 'bounds_changed', function() {
    //console.log(map.getBounds());
  });
}
google.maps.event.addDomListener(window, 'load', drawMap);
