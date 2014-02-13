/*
 * getData.js created by
 * Martin Roberge (c) 2013
 * October 1, 2013
 *
 * Department of Geography and Environmental Planning
 * Towson University
 */

function randomData(n) {//create n pairs of random points
  for (var i = 0; i < n; i++) {
    data[i] = {
      date : new Date(i + 1279568749000), //This creates a date starting at three years ago from when I wrote this
      value : Math.random()
    };

  };
}

function getUSGSlocal(id) {//This function is for grabbing USGS data objects that are stored locally in WaterJSON format.
  //var filename = id;
  var filename = id + ".txt";
  //my local server will not serve files with JSON extensions, so I renamed them with .txt extensions.
  //request data & deal with errors
  d3.json(filename, function(error, json) {
    if (error) {
      return console.warn(error);
    }
    //parse data into proper format. Since every source will have a unique object format, we can't reuse this code for different types of source.
    temp = json.value.timeSeries[0].values[0].value;
    //MR Create a new array of objects from the JSON.
    //data = [];//Clear out the array.
    temp.forEach(function(d, index, array) {
      d.date = new Date(d.dateTime);
      d.value = +d.value;
      data[index] = {
        date : d.date,
        value : d.value
      };
    });

    //console.log(data);
    //mySort(data);
    //console.log(data);

    //add the new data object to the stack of plotdata.
    //plotdata.push(data);
    //Call the function that creates the graph.
    //hydrograph(id);
    //loghistogram(id);
    //flowduration(id);
    //the id parameter is just temporary.
  });
};

function parseusgs(json) {
  temp = json.value.timeSeries[0].values[0].value;
  //MR Create a new array of objects from the JSON.
  data = [];
  //Clear out the array.
  temp.forEach(function(d, index, array) {
    d.date = new Date(d.dateTime);
    d.value = +d.value;
    data[index] = {
      date : d.date,
      value : d.value
    };
  });
  data.sort(function(a, b) {
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  });
  //Don't assume data are sorted by date yet.
}

/*
var dataEvent = new CustomEvent(
"dataReady",
{
detail : {"siteID" : "01585200"},
bubbles: true,
cancelable: true
}
);
document.addEventListener("dataReady",hydrograph(e.detail.siteID),false);
*/
//var myEvent = new Event("parsed");
//var body = document.getElementById("body").addEventListener("parsed", function (e){alert("parsed!" + e)}, false);

function getUSGS2(id) {
  if (id == "local") {
    var filename = "resources/USGSshort.txt";
  } else {
    var filename = "http://waterservices.usgs.gov/nwis/iv/?format=json&sites=" + id + "&period=P30D&parameterCd=00060";
  }
  //request data & deal with errors

  var xhr = d3.json(filename).on("progress", function() {
    console.log("progress", d3.event.loaded);
  }).on("error", function(error) {
    if (error.status === 0) {
      alert("CORS is not enabled.");
    };
    console.warn("failure!", error);
  }).on("load", function(json) {
    console.log("success!");
    temp = json.value.timeSeries[0].values[0].value;
    //MR Create a new array of objects from the JSON.
    data = [];
    //Clear out the array.
    temp.forEach(function(d, index, array) {
      d.date = new Date(d.dateTime);
      d.value = +d.value;
      data[index] = {
        date : d.date,
        value : d.value
      };
    });

    //Don't assume data are sorted by date yet.
    //document.getElementById("body").dispatchEvent(dataEvent);//post flag that the new data is ready

    //    body.dispatchEvent(myEvent2);//IE doesn't allow the creation of custom events.

    //hydrograph(id);
    //flowduration(id);
    //loghistogram(id);
  }).get();
};

function getUSGS(id) {
  if (id == "local") {
    var filename = "resources/USGSshort.txt";
  } else {
    var filename = "http://waterservices.usgs.gov/nwis/iv/?format=json&sites=" + id + "&period=P30D&parameterCd=00060";
  }
  d3.json(filename, function(error, json) {
    if (error) {
      if (error.status === 0) {
        alert("CORS is not enabled.");
      };
      return console.warn(error);
    }
    //if (!json.value.timeSeries[0].values[0].value){console.warn("there is no data for this site")};
    temp = json.value.timeSeries[0].values[0].value;
    //I need to check if this even has a value!!
    //MR Create a new array of objects from the JSON.
    data = [];
    //Clear out the array.
    temp.forEach(function(d, index, array) {
      d.date = new Date(d.dateTime);
      d.value = +d.value;
      data[index] = {
        date : d.date,
        value : d.value
      };
    });

    //    target.dispatchEvent(myEvent2);
    //hydrograph(id);
    //flowduration(id);
    //loghistogram(id);
  });

};

function getMike(id) {//This function is for grabbing data from the HydroCloud server.
  var filename = "http://10.55.17.169:28017/hydroCloudTest/id01582500/?";
  //Not allowed due to cross-domain request.

  //var filename = id + ".txt"; //A temp workaround the cross-domain issue. Requests a local file to test this function.
  //request data & deal with errors
  d3.json(filename, function(error, json) {
    if (error)
      return console.warn(error);
    //parse data into proper format. Since every source will have a unique object format, we can't reuse this code for different types of source.
    temp = json.rows;
    temp.forEach(function(d, index, array) {
      d.date = new Date(d.time);
      //parse the text into a date object.
      d.value = +d.data.discharge;
      //parse the discharge text into an integer.
      data[index] = {
        date : d.date,
        value : d.value
      };
      //store the parsed values in my data array.
    });

    //add the new data object to the stack of plotdata.
    //plotdata.push(data);
    //Call the function that creates the graph.
    hydrograph(id);
    //loghistogram(id);
    //the id parameter is just temporary.
  });
};

function getMike2(id) {//This function is for grabbing data from the HydroCloud server.
  //var filename = "http://10.55.17.169:28017/hydroCloudTest/id01582500/?";//Not allowed due to cross-domain request.
  //var filename = "http://10.55.17.48:5000/show_data/id01585200/2012-01-05/2013-06-12";
  var filename = "id01585200.json";
  //var filename = id + ".txt"; //A temp workaround the cross-domain issue. Requests a local file to test this function.
  //request data & deal with errors
  d3.json(filename, function(error, json) {
    if (error)
      return console.warn(error);
    //parse data into proper format. Since every source will have a unique object format, we can't reuse this code for different types of source.
    //console.log(json);
    //temp = json.rows;
    temp = json;
    temp.forEach(function(d, index, array) {
      d.date = new Date(d.time);
      //parse the text into a date object.
      d.value = +d.data.discharge;
      //parse the discharge text into an integer.
      data[index] = {
        date : d.date,
        value : d.value
      };
      //store the parsed values in my data array.
    });

    //add the new data object to the stack of plotdata.
    //plotdata.push(data);
    //Call the function that creates the graph.
    hydrograph(id);
    //loghistogram(id);
    //the id parameter is just temporary.
  });
};