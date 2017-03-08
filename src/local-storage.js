function storageAvailable(storageType) {
    //storageType can be 'localStorage' or 'sessionStorage'
    try {
        var storage = window[storageType],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        console.log(storageType + " not available.")
        console.dir(e);
        return false;
    }
}

function checkStorage(site){
    if (storageAvailable('localStorage')) {
        // localStorage is available
        console.log("localStorage is available. site: " + site);
        try {
            var storage = window['localStorage'];
            var data = JSON.parse(storage.getItem(site));
            //Need to check that the data are working; if not, return false and system will request data.
            //Also, the data might look fine to whatever data-checking function I write, but the user might not like it.
            //In this case, I may want to have a refresh button near the graph to ask for more data.
            //
            if (Array.isArray(data) && data.length > 20) {
                console.log("Retrieved data from site " + site + ". Length is:" + data.length);
                //convert string to Date
                data.forEach(function(d, index, array){
                    d[0] = new Date(d[0]);
                });
                return data;
                //console.log(data);
                //return false;
            } else {
                console.log("Problem with retrieved data for site " + site);
                console.log(data);
                if (data === null) console.log("No data stored for this site.");
                return false;
            }
        }
        catch(e) {
            console.log("localStorage is not enabled on this browser.");
            console.dir(e);
            return false;
        }
    }
    else {
        console.log("localStorage is not available.");
        return false;
    }
}

function saveData(key, data) {
    if (storageAvailable('localStorage')) {
        // localStorage is available
        console.log("attempting to save");
        try {
            var storage = window['localStorage'];
            storage.setItem(key, JSON.stringify(data));
            return true;
        }
        catch(e) {
            console.log("Unable to save data.");
            if (isQuotaExceeded(e)) {
                console.log("localStorage quota has been exceeded.");
                //TODO: create an alert box that tells users to delete some sites?
            }
            console.dir(e);
        }
    }
}

function isQuotaExceeded(e) {
    // This function thanks to: Dillon de Voor
    // http://crocodillon.com/blog/always-catch-localstorage-security-and-quota-exceeded-errors
    var quotaExceeded = false;
    if (e) {
        if (e.code) {
            switch (e.code) {
                case 22:
                    quotaExceeded = true;
                    break;
                case 1014:
                    // Firefox
                    if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                        quotaExceeded = true;
                    }
                    break;
            }
        } else if (e.number === -2147024882) {
            // Internet Explorer 8
            quotaExceeded = true;
        }
    }
    return quotaExceeded;
}