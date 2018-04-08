var fourthChart = scatterChart();

var viewModel = {
    width : ko.observable($(window).width()),
    height : ko.observable($(".carousel-inner").height()),
    showLegend : ko.observable(false),
    showFeedback : ko.observable(false),
    time : {
      start : ko.observable(),
      end : ko.observable(),
      recent : ko.observable()
    },
    toggleLegend : function() {
        //console.log("toggleLegend click");
        this.showLegend() ? this.showLegend(false) : this.showLegend(true);
    },
    toggleFeedback : function() {
        console.log("toggleFeedback click");
        this.showFeedback() ? this.showFeedback(false) : this.showFeedback(true);
    },
    view : ko.observable("map"),
    graph : ko.observable("scatter"),
    hydro : function() {
        this.view("hydro");
        this.graph("hydro");
        this.plotGraph();
    },
    flow : function() {
        this.view("flow");
        this.graph("flow");
        this.plotGraph();
    },
    histo : function() {
        this.view("histo");
        this.graph("histo");
        this.plotGraph();
    },
    scatter : function() {
        this.view("scatter");
        this.graph("scatter");
        this.plotGraph();
    },
    hyeto : function() {
        this.view("hyeto");
        this.graph("hyeto");
        this.plotGraph();
    },
    map : function() {
        //this is only called when map button is pressed, not next and prev arrows.
        fusionLayerInfoWindow.close();
        this.view("map");
        google.maps.event.trigger(map, 'resize');
    },
    slide : function() {
        fusionLayerInfoWindow.close();
    },
    plotGraph : function() {
        //console.log("Inside viewModel.plotGraph()");
        //console.log(this.graph());
        if (this.graph() === "flow") {
            flowduration(this.siteId());
        } else if (this.graph() === "scatter") {
            var graphDiv = d3.select("#graph_div");
            d3.select("#graph_div svg").remove();
            graphDiv.datum(this.dataArray()).call(fourthChart);
        } else {
            console.log("no option selected");
        }
    },
    siteId : ko.observable(),
    siteIdArray : ko.observableArray(),
    siteName : ko.observable(),
    siteDict : ko.observableArray(),
    dataArray : ko.observableArray([]),//Initial value set to empty.
    tuNexrad : ko.observable({status: "requesting data"})
};






