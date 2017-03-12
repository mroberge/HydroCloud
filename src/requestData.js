/**
 * Created by Marty on 3/11/2017.
 */

function requestData(id, name, info) {
    //Check if this site is already in our siteIdArray.
    // This will not match strings and integers. Be careful that both are integers or strings...
    var siteIndex = viewModel.siteIdArray.indexOf(id);
    console.log("The siteIndex is: " + siteIndex);
    if (siteIndex === -1) {
        //If the id is not in the siteIdArray, this will return -1.
        //Now we must add the site to the siteIdArray and request data.

        //Update the viewModel with the new site id and site info.
        console.log("siteIndex is -1, so pushing id and site info to arrays. Before val:");
        console.log(viewModel.siteIdArray().toString());
        viewModel.siteIdArray.push(id);
        console.log(viewModel.siteIdArray().toString());

        console.log(viewModel.siteDict().toString());
        viewModel.siteDict.push(info);
        console.log(viewModel.siteDict().toString());

        //Now collect the Stream Gage data and put in the dataArray
        //First check storage. We might have collected this data earlier, but not in this session.
        console.log("Checking for gage data in localStorage. Result of stored:")
        var stored = checkStorage(id);
        console.log(stored);
        if (stored) {
            console.log("Old data for site " + id + " retrieved from localStorage; length: " + stored.length);
            viewModel.dataArray.push(stored);

            //console.dir(viewModel.siteIdArray());
        } else {
            //The site is not in our siteIdArray and gage data is not in localStorage.
            //This is the first time we've ever selected this site!
            console.log("No data in storage. Calling getUSGS(" + id + ");");
            getUSGS(id);

        }
    } else {
        console.log("This site is already in the siteIdArray, so it is likely that we already have the data in the dataArray.")
        //If we matched the site to our siteIdArray, then we should already have gage data. Plot.
        viewModel.plotGraph();
    }
    //We've got our data, now it is time to plot the graph.
    //console.log("plotGraph");
    //viewModel.plotGraph();
}
