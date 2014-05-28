HydroCloud
==========
HydroCloud is a system for viewing and analyzing hydrologic data from multiple sources. It consists of a web app that handles mapping, graphing, and analysis, plus a scalable, distributed database system on the back end that processes NEXRAD imagery and provides precipitation data.

This repository hosts the web client.

Visit [the wiki](https://github.com/mroberge/HydroCloud/wiki) to read about how I have organized the folders, branches, and for the style guide.

Links:
* Latest stable version: [http://mroberge.github.io/HydroCloud/](http://mroberge.github.io/HydroCloud/)
* Unit tests: [http://mroberge.github.io/HydroCloud/test.html](http://mroberge.github.io/HydroCloud/test.html)
* Visit [http://mroberge.github.io](http://mroberge.github.io) to see an early proof-of-concept for this project.

###Features
* Map view shows location of stream gauges & NEXRAD imagery
* Click on a stream gauge to select it for plotting
* Plot multiple time series:
  * stream hydrographs
  * hyetographs
* Plot time series as a culmulative probability function (flow duration graph)
* Plot time series as a histogram
* User can download time-series data as a *.CSV file for MS Excel, JSON, or tab-delimited.
* Works on mobile.
* Stream gauge data from USGS or our database
* NEXRAD time series from our cloud-based back-end system
* Future features:
  * User can select linear or logarithmic Y axis for discharge
  * User can request earlier time-series data
  * User can plot stream discharge against precipitation
