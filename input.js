var news = {};
var searchWord;
var advancedFlag = false;

function init() {
    wipeAll();
    document.getElementById("search").onclick = search;
    document.getElementById("advancedSearch").onclick = showAdvancedSearch;
}

//wipe all inputs when page refreshed
function wipeAll(){
  var searchWord = document.getElementById("searchWord");
  searchWord.value="";
  var operator = document.getElementById("operator");
  operator.value="and";
  var secondSearchWord = document.getElementById("secondSearchWord");
  secondSearchWord.value="";
  var fromDate = document.getElementById("fromDate");
  fromDate.value="";
  var toDate = document.getElementById("toDate");
  toDate.value="";
  var mediaType = document.getElementById("mediaTypeChosen");
  mediaType.value="all";
  var contributor = document.getElementById("contributor");
  contributor.value="";
  var sortBy = document.getElementById("sortMethod");
  sortBy.value="newest";
}

//receiving users' inputs
function search() {
    searchWord = document.getElementById("searchWord").value;
    //Then show the result on the page.
    if (advancedFlag) {
      //the operator is the dropdown menu (containing "and","or","not") displayed when user click advanced search button
      //the secondSearchWord is the input form displayed when user click advanced search button to allow another search word input
        var operator = document.getElementById("operator").value;
        var secondSearchWord = document.getElementById("secondSearchWord").value;
        var fromDate = document.getElementById("fromDate").value;
        var toDate = document.getElementById("toDate").value;
        var mediaType = document.getElementById("mediaTypeChosen").value;
        var contributor = document.getElementById("contributor").value;
        var sortBy = document.getElementById("sortMethod").value;

        if (secondSearchWord != ""){
            //add operator and secondSearchWord to the url
        }
        if (fromDate != ""){
            //add fromDate to the url
        }
        if (toDate != ""){
            //add toDate to the url
        }
        if (mediaType != "none"){
            //add mediaType to the url
        }
        if (contributor != ""){
            //add contributor to the url
        }
        //add sort by to the url

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
        wipeAll();
        advancedFlag = false;
    }

}


window.onload = init;
