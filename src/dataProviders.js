var providerList = {
    'PEGELONLINE': {
        'name': 'PEGELONLINE',
        'idPrefix': 'po',
        'siteURL': stationsPegelUrl,
        'siteType': 'json',
        'siteParse': processPegelStations,
        'dischargeURL': dischargePegelUrl,
        'dischargeType': 'json',
        'dischargeParse': parsePegelDischarge
    },
    'UKEAengland': {
        'name': 'UKEAengland',
        'idPrefix': 'en',
        'siteURL': stationsUKEAUrl,
        'siteType': 'json',
        'siteParse': processUKEAStations,
        'dischargeURL': dischargeUKEAUrl,
        'dischargeType': 'json',
        'dischargeParse': parseUKEADischarge
    },
    'USGS-DV': {
        'name': 'USGS-DV',
        'idPrefix': 'dv',
        'siteURL': stationsUsgsUrl,
        'siteType': 'text',
        'siteParse': processUsgsStations,
        'dischargeURL': dischargeUsgsUrl,
        'dischargeType': 'json',
        'dischargeParse': parseUsgsDischarge
    },
    'USGS-IV': {
        'name': 'USGS-IV',
        'idPrefix': 'iv',
        'siteURL': stationsUsgsUrl,
        'siteType': 'text',
        'siteParse': processUsgsStations,
        'dischargeURL': dischargeUsgsUrl,
        'dischargeType': 'json',
        'dischargeParse': parseUsgsDischarge
    }
};

function processPegelStations(input) {
    var outJSON = [];
    var csvHeader = 'data:text/csv;charset=utf-8,';
    var outCSV = csvHeader + 'Source,STAID,STANAME,DRAIN_SQKM,HUC02,LAT_GAGE,LNG_GAGE\n';
    input.forEach(function(station, index, array) {
        var tempJSON = {};
        tempJSON['Source'] = 'PEGELONLINE';
        tempJSON['STAID'] = station['number'];
        tempJSON['STANAME'] = station['water']['longname'] + ' at ' + station['longname'];
        tempJSON['LAT_GAGE'] = station['latitude'];
        tempJSON['LNG_GAGE'] = station['longitude'];

        outJSON.push(tempJSON);

        outCSV += 'PEGELONLINE,' + station['number'] + ',' + station['water']['longname'] + ' at ' + station['longname'] + ',null,null,' + station['latitude'] + ',' + station['longitude'] + '\n';
    });
    //console.dir(outJSON);
    return outCSV;
}

function processUKEAStations(input) {
    var outJSON = [];
    var csvHeader = 'data:text/csv;charset=utf-8,';
    var outCSV = csvHeader + 'Source,STAID,STANAME,DRAIN_SQKM,HUC02,LAT_GAGE,LNG_GAGE\n';
    input = input['items'];
    //console.log(input);

    //The site name needs to include the part of the URL that changes. So, it should look like:
    //F1906-flow-logged-i-15_min-m3_s
    //six sites collect more than one type of flow. Taking the first isn't always the best. Still.

    input.forEach(function(station, index, array) {
        var tempJSON = {};
        tempJSON['Source'] = 'UKEAengland';
        //tempJSON['STAID'] = station['stationReference'];
        var stationURL = station['measures'][0]['@id'];
        var id = stationURL.slice(60);
        tempJSON['STAID'] = id;
        var river = station['riverName'] || "";
        if (station['riverName']) river += ' at ';
        var site = station['label'];
        tempJSON['STANAME'] = river + site;
        tempJSON['LAT_GAGE'] = station['lat'];
        tempJSON['LNG_GAGE'] = station['long'];

        outJSON.push(tempJSON);

        //outCSV += 'UKEAengland,' + station['stationReference'] + ',' + river + site + ',null,null,' + station['lat'] + ',' + station['long'] + '\n';
        outCSV += 'UKEAengland,' + id + ',' + river + site + ',null,null,' + station['lat'] + ',' + station['long'] + '\n';
    });
    //console.dir(outJSON);
    return outCSV;
}

function processUsgsStations(input) {
    console.log("processUSGSstations");
    //remove all commas
    var re = /,/gi;
    input = input.replace(re, '');
    //split text at newlines;
    var tempJSON = input.split('\n');
    console.log(input);

    //var outJSON = [];
    var outCSV = '';

    var header = 2;
    tempJSON.forEach(function (line) {
        if (line[0] == '#') {
            //Don't copy lines that start with #.
        } else if (header > 0) {
            //Don't copy the next two lines either.
            header -= 1;
        } else {
            //replace tabs with commas
            var temp = line.split('\t');
            //remove unwanted columns
            //outJSON.push(['USGS', temp[1], temp[2], null, temp[11], temp[4], temp[5]]);
            outCSV += '"USGS", ' + temp[1] + ', ' + temp[2] + ', null, ' + temp[11] + ', ' + temp[4] + ', ' + temp[5] + '\n';
        }
    });
    
    //add csv header and header row
    var csvHeader = 'data:text/csv;charset=utf-8,';
    outCSV = csvHeader + 'Source,STAID,STANAME,DRAIN_SQKM,HUC02,LAT_GAGE,LNG_GAGE\n' + outCSV;
    return outCSV;
}

function stationsPegelUrl(options) {
    if (options === undefined || options === null) options = {};
    //return 'http://www.pegelonline.wsv.de/webservices/rest-api/v2/stations.json';

    //This returns only stations that measure discharge.
    return 'https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations.json?timeseries=Q&includeTimeseries=true';
}

function stationsUKEAUrl(options) {
    if (options === undefined || options === null) options = {};
    //This seems like the official request. It seems to have the correct header!
    return 'http://environment.data.gov.uk/flood-monitoring/id/stations?parameter=flow';
}

function stationsUsgsUrl(options) {
    if (options === undefined || options === null) options = {};
    var state = options.state || 'al';
    var service = options.service || 'dv';
    var url = 'https://waterservices.usgs.gov/nwis/site/?stateCd=' + state + '&siteStatus=active&parameterCd=00060&outputDataTypeCd=' + service;
    return url;
}

function dischargePegelUrl(site, options) {
    if (options === undefined || options === null) options = {};
    var period = options.period || 'P30D';
    var url = 'http://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/' + site + '/Q/measurements.json?start=' + period;
    return url;
}

function dischargeUKEAUrl(site, options) {
    if (options === undefined || options === null) options = {};
    var period = options.period || 'P30D'; //can't use this. Site only provides data from the past month. Has a since date query though.

    //This query returns all of the data that they are willing to provide for a site. It is limited to the past month, unfortunately.
    var url = 'https://environment.data.gov.uk/flood-monitoring/id/measures/' + site + '/readings?_sorted';
    //var url = 'https://environment.data.gov.uk/flood-monitoring/id/measures/' + site + '-flow--i-15_min-m3_s/readings?_sorted&_limit=' + measurements;
    return url;
}


function dischargeUsgsUrl(site, options) {
    if (options === undefined || options === null) options = {};
    var period = options.period || 'P30D';
    var url = 'https://waterservices.usgs.gov/nwis/dv/?format=json&sites=' + site + '&parameterCd=00060&period=' + period;
    return url;
}

function parsePegelDischarge(returnedData) {
    output = [];
    //check for no data or empty set.
    if (returnedData < 1) {
        return output;
    }
    returnedData.forEach(function (d, index, array) {
        output[index] = [];
        output[index][0] = new Date(d.timestamp);
        //Screen out all negative, '', [], NaN, etc, and store as null.
        output[index][1] = Math.max(0, +d.value) || null;
        //TODO: how does PEGELONLINE data indicate bad values?
    });
    return output;
}

function parseUKEADischarge(returnedData) {
    output = [];
    try {
        var temp = returnedData['items'];
        temp.forEach(function (d, index, array) {
            output[index] = [];
            output[index][0] = new Date(d.dateTime);
            output[index][1] = +d.value;
        });

    } catch (error) {
        console.warn("The UK Environmental Agency did not have data for this site.");
        console.log(error);
    } finally {
        return output;
    }
}

function parseUsgsDischarge(returnedData) {
    output = [];
    //process data
    //    check for no data or empty set;
    try {
        var temp = returnedData.value.timeSeries[0].values[0].value;
        temp.forEach(function (d, index, array) {
            //    convert values to dates and numbers
            output[index] = [];
            output[index][0] = new Date(d.dateTime);
            //screen out negative and non-number values; return null instead.
            // 0 || null returns null.
            var Q = Math.max(0, +d.value * 0.0283168)||null;
            //convert cfs to cms.
            output[index][1] = Q;
            //    a more precise way would be to obtain the actual 'noDataValue'
            //    located at: returnedData.value.timeSeries[0].variable.noDataValue
        });
    } catch (error) {
        console.warn("The USGS did not have data for this site.");
        console.log(error);
    } finally {
        return output;
    }
}

function getDischarge(siteId, source, options) {
    if (options === undefined || options === null) options = {};
    //Get provider-related materials from the providerList
    var provider = providerList[source];
    //My internal site ID has a 2 letter prefix added to the provider's site ID to prevent confusion when two
    // providers use the same site ID.
    var site = siteId.slice(2);
    //console.log("getDischarge siteId: " + siteId + "site: " + site);
    var url = provider.dischargeURL(site, options);
    var data = [];

    $.ajax({
        url: url,
        dataType: provider.dischargeType,
        error: function (ErrObj, ErrStr) {
            console.warn("error while requesting data!");
            console.log("Data Source: " + provider.name);
            console.log("Requested URL: " + url);
            console.log("Returned Error Object:");
            console.log(ErrObj);
            console.log("Returned Error String:");
            console.log(ErrStr);
            //This seems to give good messages from USGS and PEGELONLINE:
            console.log(ErrObj.statusText);
            //Unless we add the site ID as the element ID, this assumes that the window from this request is still open, and user didn't manage to click another window open quickly!
            $('.googft-info-window#' + siteId).append( "<p class='bg-warning'>An error occurred when requesting data for this site.</p>" );
        },
        success: function (returnedData, statusMsg, returnedjqXHR) {
            console.log("success!");
            console.log(returnedData);
            console.log(statusMsg);
            console.log(returnedjqXHR);
            data = providerList[source].dischargeParse(returnedData);

        },
        complete: function () {
            console.log('complete!');
            //save the data to localStorage
            //If error, then data = []
            saveData(siteId, data);
            //add data to viewModel.dataArray
            viewModel.dataArray.push(data);

        }
    });

}

function getStations(providerName, options) {
    if (options === undefined || options === null) options = {};
    var provider = providerList[providerName];
    console.log("Get station list from " + provider.name);
    var stationCSV = null;

    $.ajax({
        url: provider.siteURL(options),
        dataType: provider.siteType,
        error: function (ErrObj, ErrStr) {
            console.warn(provider.name + " returned an error.");
            console.dir(ErrObj);
            window.alert(provider.name + " returned an error.\n" + ErrObj.statusText);
        },
        success: function (returnedData, statusMsg, returnedjqXHR) {
            console.log("Success!");

            stationCSV = provider.siteParse(returnedData);

        },
        complete: function () {
            console.log("complete");
            downloadCSV({ filename: provider.name + "-stations.csv", csv: stationCSV });
            //downloadJSON({ filename: provider.name + "-stations.json", json: stationCSV });
        }

    });
}

//Not in use.
function requestStations(providerName, options) {
    if (options === undefined || options === null) options = {};

    var provider = providerList[providerName];
    console.log("Get station list from " + provider.name);
    var stationCSV = null;

    $.ajax({
        url: provider.siteURL,
        dataType: provider.siteType,
        error: function (ErrObj, ErrStr) {
            console.warn(provider.name + " returned an error.");
            console.dir(ErrObj);
            window.alert(provider.name + " returned an error.\n" + ErrObj.statusText);
        },
        success: function (returnedData, statusMsg, returnedjqXHR) {
            console.log("Success!");

            stationCSV = provider.siteParse(returnedData);

        },
        complete: function () {
            console.log("complete");
            downloadCSV({ filename: provider.name + "-stations.csv", csv: stationCSV });
            downloadJSON({ filename: provider.name + "-stations.json", json: stationCSV });
        }

    });
}

