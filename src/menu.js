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
    document.getElementById("map_canvas").style.display = "block";
    document.getElementById("aboutText").style.display = "none";
  });

  $(hydro).on('click', function(e) {
    console.log("hydro");
    d3.select("svg").remove();
    document.getElementById("map_canvas").style.display = "none";
    document.getElementById("aboutText").style.display = "none";
    hydrograph("name");
  });

  $(flow).on('click', function(e) {
    console.log("flow");
    d3.select("svg").remove();
    document.getElementById("map_canvas").style.display = "none";
    document.getElementById("aboutText").style.display = "none";
    flowduration("name");
  });

  $(histo).on('click', function(e) {
    console.log("histo");
    d3.select("svg").remove();
    document.getElementById("map_canvas").style.display = "none";
    document.getElementById("aboutText").style.display = "none";
    loghistogram("name");
  });

  $(download).on('click', function(e) {
    console.log("download");
    dataCsv("stream");
  });

  $(about).on('click', function(e) {
    console.log("about");
    d3.select("svg").remove();
    document.getElementById("map_canvas").style.display = "none";
    document.getElementById("aboutText").style.display = "block";
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
