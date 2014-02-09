HydroCloud
==========
HydroCloud is a system for viewing and analyzing hydrologic data from multiple sources. It consists of a web app that handles mapping, graphing, and analysis, plus a scalable, distributed database system on the back end that processes NEXRAD imagery and provides precipitation data.

This repository hosts the web client.

Visit [the wiki](https://github.com/mroberge/HydroCloud/wiki) to read about how I have organized the folders, branches, and for the style guide.

Links:
* Latest stable version: [http://mroberge.github.io/HydroCloud/](http://mroberge.github.io/HydroCloud/)
* A reformulated version of the hydrograph function rewritten as a closure: [reuseableChart.html](http://mroberge.github.io/HydroCloud/reuseableChart.html)
* Unit tests: [http://mroberge.github.io/HydroCloud/spec/SpecRunner.ReusableScatterChart.html](http://mroberge.github.io/HydroCloud/spec/SpecRunner.ReusableScatterChart.html)
* Visit [http://mroberge.github.io](http://mroberge.github.io) to see an early proof-of-concept for this project.

###Features
* Map view shows location of stream gauges & NEXRAD imagery
* click on a stream gauge to select it for plotting
* Plot multiple time series:
  * stream hydrographs
  * hyetographs
* Plot time series as a culmulative probability function (flow duration graph)
* Plot time series as a histogram
* Axes that show discharge can plot linear or logarithmic
* User can download time-series data as a *.CSV file for MS Excel, JSON, or tab-delimited.
* Works on mobile.
* Stream gauge data from USGS
* NEXRAD time series from our cloud-based back-end system

###A Note to Visitors:

Please excuse the mess while I migrate the project to GitHub. I am still getting used to the system and figuring out the best way to take advantage of all of GitHub's features.

Thanks!

-Marty
