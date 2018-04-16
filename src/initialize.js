function initialize() {

    ko.applyBindings(viewModel);

    var data = [];

    viewModel.time.start(new Date(2014,1,1));
    viewModel.time.end(new Date(2015,1,1));
    viewModel.time.recent("P90D");

    startPos = {lat: 30.3, lng: -89.8};
    getUserLocation();

    //viewModel.dataArray.subscribe(function(oldValue) {
    //    console.log("new value about to be added to dataArray. ");
    //    console.log(oldValue);
    //}, null, "beforeChange");
    viewModel.dataArray.subscribe(function(newValue) {
    //    console.log("plotGraph() called with new value added to dataArray.");
    //    console.log(newValue);
        viewModel.plotGraph();
    });

    //console.log("Initial value of requestData parameters: ");
    //console.log(viewModel.siteId());
    //console.log(viewModel.siteName());
    //console.log("setting viewModel values.");
    viewModel.siteId("dv07376500");
    var source = 'USGS-DV';
    viewModel.siteName("Natalbany River at Baptist, LA");
    var initialSiteDict = {
        id : "dv07376500",
        name : "Natalbany River at Baptist, LA",
        area : 205.2,
        impervious : 1.57,
        color: "white"
    };

    //console.log("Initial call of requestData with: ");
    //console.log(viewModel.siteId());
    //console.log(viewModel.siteName());
    //console.log(viewModel.siteDict().toString());
    requestData(viewModel.siteId(), source, viewModel.siteName(), initialSiteDict);

    google.maps.event.addDomListener(window, 'load', drawMap);
    google.maps.event.addDomListener(window, 'load', redraw);
    $(window).resize(redraw);
}