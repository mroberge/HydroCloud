var fourthChart = scatterChart();
//console.log(fourthChart);
var updatableChart = scatterChart2();

//console.log(updatableChart);

var viewModel = {
    width : ko.observable($(window).width()),
    height : ko.observable($(".carousel-inner").height()),
    showLegend : ko.observable(false),
    time : {
      start : ko.observable(),
      end : ko.observable(),
      recent : ko.observable()
    },
    toggleLegend : function() {
        console.log("toggleLegend click");
        this.showLegend() ? this.showLegend(false) : this.showLegend(true);
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
        console.log(this.graph());
        if (this.graph() == "hydro") {
            hydrograph(this.siteId());
        } else if (this.graph() === "flow") {
            flowduration(this.siteId());
            //alternatively, use a fourthChart.duration() method.
        } else if (this.graph() === "histo") {
            //loghistogram(this.siteId());
            updatableChart.plot();
            d3.select('#updatableChart')
                .data(viewModel.dataArray())
                .call(updatableChart);
        } else if (this.graph() === "hyeto") {
            hyetograph(this.siteId());
        } else if (this.graph() === "scatter") {
            //alternatively, use a fourthChart.hydrograph() method.
            var graphDiv = d3.select("#graph_div");
            //console.log(this.dataArray());
            //fourthChart.datum(dataArray());
            d3.select("#graph_div svg").remove();
            graphDiv.datum(this.dataArray()).call(fourthChart);
            //scatterChart();
        } else {
            console.log("no option selected");
        }
    },
    siteId : ko.observable(),
    siteIdArray : ko.observableArray(),
    siteName : ko.observable(),
    siteDict : ko.observableArray(),
    dataArray : ko.observableArray([]),//Initial value set to empty.
    tuNexrad : ko.observable({status: "requesting data"}) //just a single object, which happens to be an array...
};






