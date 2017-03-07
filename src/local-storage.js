function storageAvailable(type) {
    //type can be 'localStorage' or 'sessionStorage'
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return false;
    }
}

function checkStorage(site){
    if (storageAvailable('localStorage')) {
        // localStorage is available
        console.log("localStorage is available. site:" + site);
        try {
            var storage = window['localStorage'];
            var data = JSON.parse(storage.getItem(site));
            //Need to check that the data are working; if not, return false and system will request data.
            //Also, the data might look fine to whatever data-checking function I write, but the user might not like it.
            //In this case, I may want to have a refresh button near the graph to ask for more data.
            //If there is no data stored for this site, return false
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
                return false;
            }
        }
        catch(e) {
            console.log("error");
            console.log(e);
            return false;
        }
    }
    else {
        console.log("localStorage is not available.")
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
            console.log("Unable to save data");
            console.log(e);
            console.log("Key: " + key);
            console.log(data);
        }
    }
}