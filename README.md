HydroCloud
==========

[![Join the chat at https://gitter.im/HydroCloud-app/Lobby](https://badges.gitter.im/HydroCloud-app/Lobby.svg)](https://gitter.im/HydroCloud-app/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![DOI](https://zenodo.org/badge/16010929.svg)](https://zenodo.org/badge/latestdoi/16010929)

[HydroCloud](http://hydrocloud.org) is a web-application for quickly viewing and analyzing hydrologic data from multiple sources.

This repository hosts the web client.

Visit [the wiki](https://github.com/mroberge/HydroCloud/wiki) to read about how I have organized the folders, branches, and for the style guide.

Links:
* Latest stable version: [http://mroberge.github.io/HydroCloud/](http://mroberge.github.io/HydroCloud/)
* Unit tests: [http://mroberge.github.io/HydroCloud/test.html](http://mroberge.github.io/HydroCloud/test.html)

### Features
* Map view: shows location of stream gauges & NEXRAD imagery
  * Click on a stream gauge to select it for plotting
  * Info window gives the name and some information about the site
* Graph view: plot USGS stream gage data
  * stream hydrograph: plots discharge over time
  * flow duration: plots a culmulative probability function of stream discharge
* Stats view: a table of non-spatial data from the [Gages-II](https://water.usgs.gov/GIS/metadata/usgswrd/XML/gagesII_Sept2011.xml) dataset (J. Falcone 2011)
* Help
* Legend: lists selected sites
* Chat: opens a sidebara where users can ask questions and provide feedback

### More Features...
* Works on mobile.
* Stream gage data is saved and retrieved from local storage  

* Future features:
  * User can select linear or logarithmic Y axis for discharge
  * Legend will display pending data requests and line symbol for graph
  * User can request earlier time-series data
  * User can plot stream discharge against precipitation
