function requestData(id, source, siteName, siteDict) {
    //Check if this site is already in our siteIdArray.
    // This will not match strings and integers. Be careful that both are integers or strings...
    var siteIndex = viewModel.siteIdArray.indexOf(id);
    //console.log("The siteIndex is: " + siteIndex);
    if (siteIndex === -1) {
        //If the id is not in the siteIdArray, this will return -1.
        //Now we must add the site to the siteIdArray and request data.

        //Update the viewModel with the new site id and site info.
        //console.log("siteIndex is -1, so pushing id and site info to arrays. Before val:");
        //console.log(viewModel.siteIdArray().toString());
        viewModel.siteIdArray.push(id);
        //console.log(viewModel.siteIdArray().toString());

        //console.log(viewModel.siteDict().toString());
        viewModel.siteDict.push(siteDict);
        //console.log(viewModel.siteDict().toString());

        //Now collect the Stream Gage data and put in the dataArray
        //First check storage. We might have collected this data earlier, but not in this session.
        //console.log("Checking for gage data in localStorage. Result of stored:");
        var stored = checkStorage(id);
        //console.log(stored);
        if (stored) {
            //We have some data in localStorage.

            //Check if it is recent
                //request more data if not
                //var options = null; //or maybe set an update flag.
                //getDischarge(id, source, options);
                //take the data and compare it to what we have; need to integrate it.

            //The stored data is up to date, or we updated it.
            //Now store the data & push the data into the viewModel.dataArray //This job gets done by the finally clause of getDischarge.



            //console.log("Old data for site " + id + " retrieved from localStorage; length: " + stored.length);
            viewModel.dataArray.push(stored);
            //console.dir(viewModel.siteIdArray());
        } else {
            //The site is not in our siteIdArray and gage data is not in localStorage.
            //This is the first time we've ever selected this site!
            //console.log("No data in storage. Calling getUSGS(" + id + ");");

            //
            //getUSGS(id);
            var options = null;
            getDischarge(id, source, options);

        }
    } else {
        //console.log("This site is already in the siteIdArray, so it is likely that we already have the data in the dataArray.");
        //If we matched the site to our siteIdArray, then we should already have gage data. Plot.
        viewModel.plotGraph();
    }
}

function dateStr(d) {
    var month = +d.getMonth() + 1;
    month = String("00" + month).slice(-2);
    var date = +d.getDate();
    date = String("00" + date).slice(-2);

    var now = {
        time : d,
        year : d.getFullYear(),
        month : month,
        date : date
    };
    return "" + now.year + "-" + now.month + "-" + now.date;
}

function processN(inputArray) {
    var myArray = [];
    inputArray.forEach(function (d, index, array) {
        myArray[index] = {};
        myArray[index].date = new Date(d.dateTime);
        myArray[index].value = +d.precipitation;
    });
    return myArray;
}

function getTuNexrad(id) {
    //add some error functions.
    //if new data is requested, get rid of old data, set one element to null.
    viewModel.tuNexrad({status: "requesting data...", data: [{date: null, value: null}]});
    console.log("requesting data from TU NEXRAD service");
    var endstr = "/enddate=" + dateStr(time.end);
    var startstr = "/startdate=" + dateStr(time.start);
    var urlDates = "http://10.55.15.196:5000/nexradTS/id=" + id + startstr + endstr;
    var urlRecent = "http://10.55.15.196:5000/nexradTSrecent/id=" + id + "/recent=" + time.recent;

    //console.log(endstr);
    var result = $.ajax({
        url : urlDates,
        //url : urlRecent,
        dataType : "json",
        error : function (ErrObj, ErrStr) {
            console.log("TUnexrad returns an error");
            console.log(ErrObj);//The header.
            console.log(ErrStr);//just returns "error". This is ErrObj.statusText
            viewModel.tuNexrad({status: "data not available"});
            viewModel.plotGraph();
        },
        success : function (returnedJSON, statusMsg, returnedjqXHR) {
            //TODO: test this to make sure it responds properly when data is returned.
            //Use this if we get some data back.
            console.log("Success! vM.tuNexrad:");
            console.log(viewModel.tuNexrad());
            viewModel.tuNexrad({status: "success", data: processN(result.returnedJSON)});
            viewModel.plotGraph();
        },
        //Stop using complete except to catch non-error and non-success.
        complete : function() {
            console.log("NEXRAD request complete");
            console.log(result);
        }
    });
}

function getUSGS(id) {
    var data = [];

    // Nothing stored locally, so make data request.
    // strip the id of the leading characters before requesting from USGS.
    var re = /[0-9]+/;
    var usgsId = re.exec(id)[0];
    //console.log("id: " + id + ", usgsId: " + usgsId);
    var localQuery = "resources/USGSshort.txt";
    var recentQuery = "https://nwis.waterservices.usgs.gov/nwis/iv/?format=json&sites=" + usgsId + "&period=P" + viewModel.time.recent() + "D&parameterCd=00060";
    var dateQuery = "https://nwis.waterservices.usgs.gov/nwis/iv/?format=json&sites=" + usgsId + "&startDT=" + dateStr(viewModel.time.start()) + "&endDT=" + dateStr(viewModel.time.end()) + "&parameterCd=00060";
    var staticQuery = "https://nwis.waterservices.usgs.gov/nwis/iv/?format=json&sites=01646500&startDT=2013-05-01&endDT=2013-5-10&parameterCd=00060";
    var testDaily = "https://waterservices.usgs.gov/nwis/dv/?format=json&sites=01646500&period=P10D&parameterCd=00060";
    var recentDaily = "https://waterservices.usgs.gov/nwis/dv/?format=json&sites=" + usgsId + "&period=P" + viewModel.time.recent() + "D&parameterCd=00060";
    var staticDateDaily = "https://waterservices.usgs.gov/nwis/dv/?format=json&sites=01646500&startDT=2013-05-01&endDT=2013-5-10&parameterCd=00060";
    var url = recentDaily;

    if (id == "local") {
        url = localQuery;
    } else {
        url = recentDaily;
    }
    var result = $.ajax({
        url: url,
        //headers: {"Accept-Encoding": "gzip, compress"},//These are sent automatically by the browser. No need for this here.
        dataType: "json",
        error: function (ErrObj, ErrStr) {
            console.warn("USGS returned an error for site " + id);
            console.dir(ErrObj);//The header.
            //console.log(ErrStr);//This is ErrObj.statusText; it is only 'error'
            //Display a message, don't plot the graph?
            $('.googft-info-window').append( "<p class='bg-warning'>An error occurred when requesting data for this site.</p>" );
            //We've got nothing, so save [] to localStorage. This happens when complete.
            //TODO: maybe create a status attribute for USGS data? This would let us try again.
        },
        success: function (returnedData, statusMsg, returnedjqXHR) {//TODO: test this to make sure it responds properly when data is returned.
            //Use this if we get some data back.
            console.log("Successful data request from USGS!");
            console.log(statusMsg); // StatusMsg should be "success"
            console.log(returnedjqXHR);
            console.log(returnedData);
            //process data
            //    check for no data or empty set;
            if (returnedData.value.timeSeries[0] < 1) {
                // Leave data = [] for storage.
            } else {
                var temp = returnedData.value.timeSeries[0].values[0].value;
                if (temp < 1) {
                    // [] < 1  is true.
                    // The USGS returned [] for this site's data.
                    // Leave data = [] for storage.
                }
                //If we don't have data, the following won't change the [].
                //If we do have data, the following will clean it up.
                temp.forEach(function (d, index, array) {
                    //    convert values to dates and numbers
                    data[index] = [];
                    data[index][0] = new Date(d.dateTime);
                    data[index][1] = +d.value;
                    //    screen out -999 values; replace with null? or 0.
                    //    a more precise way would be to obtain the actual 'noDataValue'
                    //    located at: returnedData.value.timeSeries[0].variable.noDataValue
                    if (data[index][1] < 0) data[index][1] = null;
                });
            }
        },
        complete: function () {
            console.log("USGS request for site " + id + "complete.");
            //save the data to localStorage
            //If error, then data = []
            saveData(id, data);
            //add data to viewModel.dataArray
            viewModel.dataArray.push(data);
        }
    });

}

function chooseData(id) {
    //Plot the data from the viewModel.dataArray() that matches the id.
    var siteIndex = viewModel.siteIdArray().indexOf(id);
    //console.log("inside chooseData(" + id + "); siteIndex: " + siteIndex);
    if (siteIndex === -1) {
        //The id should be in the siteIdArray already; this should have been tested for already. If it isn't, it returns -1.
        console.log("chooseData() was called with an id that is not in the siteIdArray.");
        console.log("id: " + id + "; the siteIndex is: " + siteIndex + "; and the siteIdArray:");
        console.dir(viewModel.siteIdArray());
        return;
    }
    var data = viewModel.dataArray()[siteIndex].slice(0);
    //Remove elements from data that contain null, undefined, or empty values at [1].
    //D3js might not need this. Check to see if preserving nulls is useful to show empty spots.
    data = data.filter(function(n){ return n[1] != undefined });
    if (data.length < 1) {
        //No data!
        console.log("No data for site" + id);
        //TODO: The code gets too spaghetti-like here. (Why would we update something in the map view from the flow duration chart???) Instead of improving this code, wait for improved viewModel with a stored status.
        $('.googft-info-window').append( "<p class='bg-warning'>There is no stream data for this site.</p>" );
        //no data, so we can't plot, so return?
        return false;
    }
    return data;
}

function redraw() {
    //fourthChart.width(window.innerWidth - 10);
    //Set the new width here, then redraw the graph.
    viewModel.width($(window).width());
    viewModel.height($(".carousel-inner").height());
    //graph-scatterChart.js requires you to set the new width for the graph.
    fourthChart.width(viewModel.width()).height(viewModel.height());
    //if there is data, plot the data.
    if (viewModel.dataArray().length) {
        viewModel.plotGraph();
    }
    //console.log("resize");
    google.maps.event.trigger(map, 'resize');
}
