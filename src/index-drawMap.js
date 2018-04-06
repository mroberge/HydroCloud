var map;
var fusionLayerInfoWindow;
var center = new google.maps.LatLng(39.395, -76.609);

function drawMap() {
  var mapOptions = {
    zoom : 8,
    center : new google.maps.LatLng(39.395, -76.609),
    mapTypeId : google.maps.MapTypeId.TERRAIN
  };

  map = new google.maps.Map(document.getElementById('map_div'), mapOptions);

  fusionLayerInfoWindow = new google.maps.InfoWindow();

  //Fusion tables load much faster than KML layers!
  //fusion table ID: 11Ujto70g1r7bWNSax5X84KYYuTpwPGmWeacAhkwP
  var fusionLayer = new google.maps.FusionTablesLayer({
    query : {
      select : 'location',
      //real.kmz, has more sites than Gages II, but less info for each.
      //from : '1Rt_U4LqeNPi6Tk1-kq8ta-6OP748nJJJTqdwlC0Q'

      //from Gages II merge, too large, takes too long to load
      //from : '1wtRBQVozXdLsn5t0PL8egL5wL7tUzFQvw6NYQizn'

      //from Gages II merge- small
      from : '103gQIyU069THrk7KGZYtbC8_My1rW4JwaHhX1ehe'
      //Add queries like this:
      //where : 'DRAIN_SQKM < 20'
    },
    suppressInfoWindows: true
  });
  fusionLayer.setMap(map);

  google.maps.event.addListener(fusionLayer, 'click', function(event) {
    //TODO: Google sometimes returns an error; I can't replicate this anymore. ???
    //console.dir(event);

    //Parse real.kmz
    //var re = /[0-9]+/;
    //var sId = "dv" + re.exec(event.row.site_no.value)[0];
    //var siteName = event.row.station_nm.value;
    //var siteArray = {id: sId, name: event.row.station_nm.value, area: +event.row.drain_area_va.value};

    //Parsing Gages II merge

    var sId = String(event.row.STAID.value);
    var siteName = event.row.STANAME.value;
    //TODO: At some point it will be necessary to create a system that requests IV or Daily Values.

    // Many of the USGS sites don't have their Source set yet, so automatically set to 'USGS-DV' if empty.
    var source = event.row.Source.value || 'USGS-DV';
    //TODO: Some USGS sites have Source set to 'USGS', which is not in the providerList right now.
    if (source === 'USGS') source = 'USGS-DV';
    var prefix = providerList[source].idPrefix;
    sId = prefix + sId;
    var siteDict = {id: sId,
                     name: siteName || null,
                     area: +event.row.DRAIN_SQKM.value || null,
                     impervious: +event.row.IMPNLCD06.value || null
    };

    //Update our viewModel with the current site information.
    viewModel.siteId(sId);
    viewModel.siteName(siteName);

    //update our InfoWindow, then open it.
    fusionLayerInfoWindow.setOptions(
        {
          //content: event.infoWindowHtml, //You can also use the default html as set by the fusion table.
          content: "<div class='googft-info-window' id='"+ sId +"'>" +
                    "<b>" + siteName + "</b><br>" +
                    "<b>site ID: </b>" + sId + "<br>" +
                    "</div>",
          position: event.latLng,
          pixelOffset: event.pixelOffset
        });
    fusionLayerInfoWindow.open(map);

    requestData(sId, source, siteName, siteDict);

  });

/*
  //KML layers can use real-time updates from USGS, and will plot 5,000 points quickly... compared to plotting 5,000 points using other methods.
  //The KML layer still loads too slowly, or not at all.
  var points = new google.maps.KmlLayer("http://waterwatch.usgs.gov/kmls/real.kmz", {
    suppressInfoWindows : true,
    preserveViewport : true,
    map : map
  });

*/

  var tileNEX = new google.maps.ImageMapType({
    getTileUrl : function(tile, zoom) {
      return "http://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/" + zoom + "/" + tile.x + "/" + tile.y + ".png?" + (new Date()).getTime();
    },
    tileSize : new google.maps.Size(256, 256),
    opacity : 0.90,
    name : 'NEXRAD',
    isPng : true
  });

  var goes = new google.maps.ImageMapType({
    getTileUrl : function(tile, zoom) {
      return "http://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/goes-east-vis-1km-900913/" + zoom + "/" + tile.x + "/" + tile.y + ".png?" + (new Date()).getTime();
    },
    tileSize : new google.maps.Size(256, 256),
    opacity : 0.40,
    name : 'GOES East Vis',
    isPng : true
  });

  //create empty overlay entry
  map.overlayMapTypes.push(null);
  //Add the GOES cloud imagery layer
  //map.overlayMapTypes.setAt("0", goes);
  map.overlayMapTypes.setAt("1", tileNEX);
}

