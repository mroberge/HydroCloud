/*
 var myEvent = new Event("parsed");//IE doesn't let you create custom events.
 var body = document.getElementById('target');
 //console.log(body);
 body.addEventListener("parsed", function(e) {
 alert("parsed!" + e);
 }, false);

 var myEvent2 = new CustomEvent("parsed2", {
 'detail' : "site name"
 });
 //everytime we load new data, it draws a hydrograph. That's not what we want anymore.
 //body.addEventListener("parsed2", function (e){hydrograph(e.detail);}, false);
 body.addEventListener("parsed2", function(e) {
 console.log("data loaded: site " + e.detail);
 }, false);
 */
var data = [];
getUSGS("01646500");
//Initial data request.
