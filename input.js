var news = {};
var searchWord;
var advancedFlag = false;

function init() {
    document.getElementById("search").onclick = search;
    document.getElementById("advancedSearch").onclick = showAdvancedSearch;

}
//receiving users' inputs
function search() {
    searchWord = document.getElementById("searchWord").value;
    //Then show the result on the page.
    if (advancedFlag) {
        var tag = document.getElementById("tag").value;
        var fromDate = document.getElementById("fromDate").value;
        var toDate = document.getElementById("toDate").value;
        var mediaType = document.getElementById("mediaTypeChosen").value;
        var contributor = document.getElementById("contributor").value;
        var sort = document.getElementById("sortMethod").value;

        // generate url. Check each advanced variable before add them to the 
        // url. If there is no value or it is default value for selection element, then don't add it to the url.
        // send request with all advanced variables

    } else {
        //just send request with searchWord. no advanced values
    }
}

function showAdvancedSearch() {
    if (!advancedFlag) {
        document.getElementById("advancedSearchField").style.display = "";
        document.getElementById("advancedSearch").value = "Hide Advanced Search";
        advancedFlag = true;
    } else {
        document.getElementById("advancedSearchField").style.display = "none";
        document.getElementById("advancedSearch").value = "Show Advanced Search";
        document.getElementById("tag").value = '';
        document.getElementById("toDate").value = '';
        document.getElementById("fromDate").value = '';
        document.getElementById("mediaTypeChosen").value = 'none';
        document.getElementById("contributor").value = '';
        document.getElementById("sortMethod").value = 'latestTenFirst';
        advancedFlag = false;
    }

}


window.onload = init;
