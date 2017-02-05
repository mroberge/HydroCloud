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

function checkStorage(){
    if (storageAvailable('localStorage')) {
        // Yippee! We can use localStorage awesomeness
        console.log("localStorage is available!")
    }
    else {
        // Too bad, no localStorage for us
        console.log("localStorage is not available.")
    }
}

