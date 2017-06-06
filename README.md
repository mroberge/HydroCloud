HydroCloud
==========

[![Join the chat at https://gitter.im/HydroCloud-app/Lobby](https://badges.gitter.im/HydroCloud-app/Lobby.svg)](https://gitter.im/HydroCloud-app/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![DOI](https://zenodo.org/badge/16010929.svg)](https://zenodo.org/badge/latestdoi/16010929)

[HydroCloud](http://hydrocloud.org) is a web-application for quickly viewing and analyzing hydrologic data from multiple sources.

This repository hosts the web client.

Links:
* Latest stable version: [http://mroberge.github.io/HydroCloud/](http://mroberge.github.io/HydroCloud/)
* Unit tests: [http://mroberge.github.io/HydroCloud/test.html](http://mroberge.github.io/HydroCloud/test.html)

### Features
* Responsive design: optimized for mobile phones.
* Local data storage.
* Map view: shows location of stream gauges & NEXRAD imagery
  * Click on a stream gauge to select it for plotting
  * Info window gives the name and some information about the site
* Graph view: plot stream gage data
  * stream hydrograph: plot discharge over time
  * flow duration: plot a culmulative probability function of stream discharge
* Stats view: a table of non-spatial data from the [Gages-II](https://water.usgs.gov/GIS/metadata/usgswrd/XML/gagesII_Sept2011.xml) dataset (J. Falcone 2011)
* Help view: instructions for working with HydroCloud
* Legend: lists selected sites
* Chat: opens a sidebar where users can ask questions and provide feedback

### Re-using and Adapting HydroCloud
Many of the features found in HydroCloud can be repurposed and re-used in your own application. For example, you can: 
* Add a stream hydrograph to your own webpage: [Instructions](https://github.com/mroberge/HydroCloud/wiki/Add-a-hydrograph-to-your-website) | [Example](http://mroberge.github.io/HydroCloud/example-hydrograph.html)
* Create a HydroCloud widget in your webpage using an iframe: [Instructions](https://github.com/mroberge/HydroCloud/wiki/Embed-HydroCloud) | [Example](http://mroberge.github.io/HydroCloud/example-iframe.html)
* Incorporate a HydroCloud map widget in your Jupyter Notebook: [Instructions](https://github.com/mroberge/HydroCloud/wiki/Using-hydrocloud-with-Jupyter-notebooks)

### Contribute to HydroCloud
We welcome your comments, complaints, and pull requests!
* Suggest a new feature or report a bug: [Issue List](https://github.com/mroberge/HydroCloud/issues)
* Fork this project to your own GitHub account: [Instructions](https://github.com/mroberge/HydroCloud/wiki/Contribute-to-HydroCloud)
* Clone or download this project for local development: [Instructions](https://github.com/mroberge/HydroCloud/wiki/Contribute-to-HydroCloud)
* [Style guide](https://github.com/mroberge/HydroCloud/wiki/Coding-Style-Conventions) for the code, branches, and pull requests. 
