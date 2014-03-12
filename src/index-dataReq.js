function dataReq() {
  console.log("dataReq");
  var select = document.getElementById('selectRes');
  var siteID = select.options[select.selectedIndex].value;
  getUSGS(siteID);
}