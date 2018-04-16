// Modified from https://developers.google.com/maps/documentation/javascript/geolocation
// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

function getUserLocation() {
    var geoSuccess = function(position) {
        // A position was successfully returned.
        startPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        console.log("User location: {", startPos.lat, startPos.lng, "}");
        // if map was already set up --> map.setCenter(startPos);
        if (map.hasOwnProperty('center')) map.setCenter(startPos);
    };

    var geoError = function(error) {
        console.log('The browser supports the Geolocation API, but an error code was returned: ' + error.code);
        pos = false;
        // error.code can be:
        //   0: unknown error
        //   1: permission denied
        //   2: position unavailable (error response from location provider)
        //   3: timed out
    };
    var geoOptions = {
        timeout: 10 * 1000 // wait 10 seconds.
    };

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
    } else {
        // Browser doesn't support Geolocation.
        console.log("The browser does not support the Geolocation API.");
    }
}
