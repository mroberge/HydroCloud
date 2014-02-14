$(function() {
  //Menu design from Thoriq Firdaus www.hongkiat.com/blog/responsive-web-nav/
  var pull = $('#pull');
  menu = $('nav ul');
  menuHeight = menu.height();

  $(pull).on('click', function(e) {
    e.preventDefault();
    menu.slideToggle();
  });

  $(showMap).on('click', function(e) {
    console.log("map");
    d3.select("svg").remove();
    //document.getElementById("map_div").style.display = "block";
    //document.getElementById("about_div").style.display = "none";
    //document.getElementById("svg").style.
    document.getElementById("map_div").style.visibility = "visible";
    document.getElementById("about_div").style.display = "none";
    document.getElementById("graph_div").style.visibility = "visible";
  });

  $(hydro).on('click', function(e) {
    console.log("hydro");
    d3.select("svg").remove();
    //document.getElementById("map_div").style.display = "none";
    //document.getElementById("about_div").style.display = "none";
    document.getElementById("map_div").style.visibility = "hidden";
    document.getElementById("about_div").style.display = "none";
    document.getElementById("graph_div").style.visibility = "visible";
    hydrograph("name");
  });

  $(flow).on('click', function(e) {
    console.log("flow");
    d3.select("svg").remove();
    //document.getElementById("map_div").style.display = "none";
    //document.getElementById("about_div").style.display = "none";
    document.getElementById("map_div").style.visibility = "hidden";
    document.getElementById("about_div").style.display = "none";
    document.getElementById("graph_div").style.visibility = "visible";
    flowduration("name");
  });

  $(histo).on('click', function(e) {
    console.log("histo");
    d3.select("svg").remove();
    //document.getElementById("map_div").style.display = "none";
    //document.getElementById("about_div").style.display = "none";
    document.getElementById("map_div").style.visibility = "hidden";
    document.getElementById("about_div").style.display = "none";
    document.getElementById("graph_div").style.visibility = "visible";
    loghistogram("name");
  });

  $(download).on('click', function(e) {
    console.log("download");
    dataCsv("stream");
  });

  $(about).on('click', function(e) {
    console.log("about");
    d3.select("svg").remove();
    //document.getElementById("map_div").style.display = "none";
    //document.getElementById("about_div").style.display = "none";
    document.getElementById("map_div").style.visibility = "hidden";
    document.getElementById("about_div").style.display = "block";
    document.getElementById("graph_div").style.visibility = "hidden";
  });

  $(window).resize(function() {
    var w = $(window).width();
    if (w > 320 && menu.is(':hidden')) {
      menu.removeAttr('style');
      myScreen.width = $(window).width() - 20;
      myScreen.height = $(window).height() - (header + 60);
      //hydrograph(id);
    }
  });
});
