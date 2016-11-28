var news = {};
var searchWord;
var advancedFlag = false;


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

//object holds all search input entered by the user and the format of the query for each search criteria
function userInput(searchKeyword,advancedSearchOperator,advancedSearchKeyword,tag,fromDate,toDate,mediaType,contributor,sortedBy) {

	this.searchKeywords = {
		query:"&q=",
		value:searchKeyword,
		operator:advancedSearchOperator,
		advancedSearchValue:advancedSearchKeyword
	};

	this.tags = {
		query:"&tag=us-news/us-elections-2016",
		keyword:tag,
		author:contributor
	};

	this.fromDate= {
		query:"&from-date=",
		value:fromDate
	};

	this.toDate={
		query:"&to-date=",
		value:toDate,
	};

	this.mediaType={
		query:"&type=",
		value:mediaType
	};

	this.sortedBy={
		query:"&order-by=",
		value:sortedBy
	};
	
	this.page={
		query:"&page=",
		value:1
	}
}


//receiving users' inputs
userInput.prototype.getUserInput = function()  {
    searchWord = document.getElementById("searchWord").value;
    this.searchKeywords.value=searchWord;
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
	

	
	/*userInput.searchKeywords.operator=operator;
	userInput.searchKeywords.advancedSearchValue=secondSearchWord;
	//window.myUserInput.fromDate.value=fromDate;
	//window.myUserInput.toDate.value=toDate;
	userInput.mediaType.value=mediaType;
	userInput.sortedBy.value=sortBy;
	userInput.tags.author=contributor;*/
	}

	
       /* if (secondSearchWord != ""){
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
    }*/
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
