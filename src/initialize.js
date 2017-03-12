/**
 * Created by Marty on 3/12/2017.
 */

function initialize() {

    ko.applyBindings(viewModel);

    var data = [];

    
    

    viewModel.time.start(new Date(2014,01,01));
    viewModel.time.end(new Date(2015,01,01));
    viewModel.time.recent("90");
    
    viewModel.dataArray.subscribe(function(newValue) {
        //alert("dataArray was just updated. " + newValue[0]);
        console.log("plotGraph() called from index.html");
        viewModel.plotGraph();
    });

//getUSGS(viewModel.siteDict()[0].id);
    console.log("Initial value of requestData parameters: ");
    console.log(viewModel.siteId());
    console.log(viewModel.siteName());
    console.log(viewModel.siteDict().toString());

    console.log("setting viewModel values.");
    viewModel.siteId("dv01580000");
    viewModel.siteName("Deer Creek at Rocks, MD");
    var initialSiteDict = {
        id : "dv01580000",
        name : "DEER CREEK AT ROCKS, MD",
        area : 94.4,
        impervious : 1.26
    };
//viewModel.siteDict().push(initialSiteDict); //This doesn't get done in drawMap, don't do it here.

    console.log("Initial call of requestData with: ");
    console.log(viewModel.siteId());
    console.log(viewModel.siteName());
    console.log(viewModel.siteDict().toString());
    requestData(viewModel.siteId(), viewModel.siteName(), initialSiteDict);

//getTuNexrad(viewModel.siteDict()[0].id);
//$(window).resize();
    google.maps.event.addDomListener(window, 'load', drawMap);
    google.maps.event.addDomListener(window, 'load', redraw);
    $(window).resize(redraw);
}