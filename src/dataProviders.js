var providerList = {
    'PEGELONLINE': {
        'name': 'PEGELONLINE',
        'idPrefix': 'po',
        'siteURL': 'http://www.pegelonline.wsv.de/webservices/rest-api/v2/stations.json',
        'siteType': 'json',
        'siteParse': processPegelStations,
        'dischargeURL': dischargePegelUrl,
        'dischargeType': 'json',
        'dischargeParse': ''
    },
    'USGS-DV': {
        'name': 'USGS-DV',
        'idPrefix': 'dv',
        'siteURL': 'https://waterservices.usgs.gov/nwis/site/?stateCd=al&siteStatus=active&parameterCd=00060&outputDataTypeCd=dv',
        'siteType': 'text',
        'siteParse': processUsgsStations,
        'dischargeURL': dischargeUsgsUrl,
        'dischargeType': 'json',
        'dischargeParse': ''
    },
    'USGS-IV': {
        'name': 'USGS-IV',
        'idPrefix': 'iv',
        'siteURL': 'https://waterservices.usgs.gov/nwis/site/?stateCd=al&siteStatus=active&parameterCd=00060&outputDataTypeCd=iv',
        'siteType': 'text',
        'siteParse': processUsgsStations,
        'dischargeURL': dischargeUsgsUrl,
        'dischargeType': 'json',
        'dischargeParse': ''
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

function dischargePegelUrl(site, options) {
    var url = 'http://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/48900237/W/measurements.json?start=P30D';
    return url;
}

function dischargeUsgsUrl(site, options) {
    //strip the dv from the siteID
    var url = 'resources/USGSshort.txt';
    return url;
}

function processUsgsStations(input) {
    console.log("processUSGSstations");
    var outCSV = 'TEMP for USGS!';
    //remove header

    //replace tabs with commas

    //remove unwanted columns

    //add csv header and header row
    var csvHeader = 'data:text/csv;charset=utf-8,';
    outCSV = csvHeader + 'Source,STAID,STANAME,DRAIN_SQKM,HUC02,LAT_GAGE,LNG_GAGE\n' + outCSV;
    return outCSV;
}

function getDischarge(siteId, source, options) {
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
            console.warn("error!");
            console.log("Data Source: " + provider.name);
            console.log("Requested URL: " + url);
            console.log("Returned Error Object:");
            console.log(ErrObj);
            console.log("Returned Error String:");
            console.log(ErrStr);
            //This seems to give good messages from USGS and PEGELONLINE:
            console.log(ErrObj.statusText);
            $('.googft-info-window').append( "<p class='bg-warning'>An error occurred when requesting data for this site.</p>" );
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

function getStations(providerName) {
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
        }

    });
}

