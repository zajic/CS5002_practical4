window.onload=init;
var news={};
var RESULTS_PER_PAGE=50;
var advancedFlag = false;

function init() {

	wipeAllInputFields();
    addButtonsEventListeners();
}

function addButtonsEventListeners() {

	document.getElementById("advancedSearch").onclick = showAdvancedSearch;
	document.getElementById("search").addEventListener("click",getArticles);
	//the variable newSearch helps to distinguish whether user clicked on Search button or on a page number
	document.getElementById("search").addEventListener("click",function() { window.newSearch=true;});
	document.getElementById("readingList").addEventListener("click",createReadingList);
	document.getElementById("clearReadingList").addEventListener("click",clearReadingList);
}

//object holds all search input entered by the user and the format of the query for each search criteria
function userInput() {

	this.searchKeywords = {
		query:"&q=",
		value:"",
		operator:"",
		advancedSearchValue:""
	};

	this.tags = {
		query:"&tag=us-news/us-elections-2016",
		keyword:"",
		author:""
	};

	this.fromDate= {
		query:"&from-date=",
		value:""
	};

	this.toDate={
		query:"&to-date=",
		value:"",
	};

	this.mediaType={
		query:"&type=",
		value:""
	};

	this.sortedBy={
		query:"&order-by=",
		value:""
	};

	this.page={
		query:"&page=",
		value:1
	}
}

//generate a query from inputs stored in userInput object
userInput.prototype.generateQuery = function() {

	var urlQuery="";
	//go through the userInput properties and if a property has a value, add it to the urlQuery (tags and keywords are handled separately)
	for (prop in this) {
		if (typeof this[prop]  != 'function' && prop != "tags" && prop != "searchKeywords") {
			if (this[prop].value)
				urlQuery=urlQuery + this[prop].query + this[prop].value
		}
	}

	//create the "tag" part of the query: by default the tag query only contains the "us-news/us-elections-2016" tag
	var tags=this.tags.query;
	//if there are any other tags specified they are added and separated by comma
	if (this.tags.keyword) {
		tags = tags + "," + this.tags.keyword;
	}
	if (this.tags.author) {
		tags = tags + "," + this.tags.author;
	}

	//create the "keywords" part of the query: keywords are quoted and separated by operators AND, OR, NOT (if applicable)
	var keywordsQuery="";
	if (this.searchKeywords.value) {
		keywordsQuery=this.searchKeywords.query + "\"" + this.searchKeywords.value + "\""
	}
	if (this.searchKeywords.advancedSearchValue) {
		keywordsQuery=keywordsQuery + " " + this.searchKeywords.operator + " \"" + this.searchKeywords.advancedSearchValue + "\""
	}
	return urlQuery + keywordsQuery + tags;
}

//get user input, create url for JSONP query and execute the JSONP request
function getArticles() {
	//if the function was called by clicking on Search button get user input and create new url
	if (this.id == "search") {

		window.myUserInput = new userInput();
		window.myUserInput.getUserInput();

	}
	//if the function was called by clicking on page number there is no need to get user input, just update the page number and generate new url
	else {
		var pageNumber=document.getElementById(this.id).innerHTML;
		window.myUserInput.page.value=pageNumber;
	}
	//create the URL and execute JSONP request
	//myUrl=createUrl(window.myUserInput,"callbackGeneric");
  myUrl=window.myUserInput.createUrl("callbackGeneric");
	executeJsonp(myUrl);
}

//create url for the request: the url consists of static query part that never changes and dynamic query generated based on user input
userInput.prototype.createUrl = function (/*string*/callback) {

//	if (typeof userInput == 'object' && arguments.length>0) {

		//the basic part of url is the same for every request
		var baseurl = "https://content.guardianapis.com/search";
		var APIkey="?api-key=cd76717d-271b-47b9-a69b-c06e83a77405";
		var callbackOption="&callback=" + callback
		var staticOptions="&show-fields=thumbnail,trailText&show-tags=keyword,contributor&page-size=50&format=json";
		var userOptions=this.generateQuery();

	//	}
	//else
	//	throw new Error("userInput object must be passed to the function as argument.")


	return baseurl + APIkey + callbackOption + staticOptions + userOptions;
}

//add the script with jsonp url to the html
function executeJsonp(/*string*/url) {

	console.log(url);
	var scriptElement = document.createElement("script");
	scriptElement.src = url;
	scriptElement.id = "jsonp";
	document.head.appendChild(scriptElement);
}

//callback function used in JSONP request
function callbackGeneric(/*object*/data) {

	//cleanup the previous jsonp request and articles
	cleanupScript();
	cleanUpArticles();

	console.log(data);

	//jsonp did not return any results
	if (data.response.total == 0){
		//RENKUN: display a message to the user that no results were returned for his search criteria. Implement this and test it, please.
		hideEverything();
		console.log("No results for the given search criteria. Please try again.");
	}
	//jsonp did return some results
	else {
		news=data.response;
		listStories(data.response.results, "content");  //.response.results is relevant child within parent file

		//add paging only if the user clicked on "Search" and if the results do not fit on one page
		if (window.newSearch) {
			removeOldPaging();
			if (news.total > news.pageSize) {
					addPaging();
			}
		}

		//add the number of results to the top of the page
		addNumberOfResults();
		addBackToTopLink();
	}
	//this is not run for every search since it triggers a high number of requests but was left here for marking purposes
	//getTopTags();
}
//when no results for user input are returned: hide paging, articles container, number of results, back to top link
function hideEverything() {

		removeOldPaging();
		document.getElementById("numberOfResults").innerHTML="";
		document.getElementById("pagingTop").style.display="none";
		document.getElementById("content").style.display="none";
		hideBackToTopLink();

}

//remove all articles from the screen
function cleanUpArticles() {

	var articlesDiv = document.getElementById("content");

	while (articlesDiv.hasChildNodes()) {
		articlesDiv.removeChild(articlesDiv.lastChild);
	}
}

//removes previous jsonp requests
function cleanupScript() {

	var scriptElement = document.getElementById("jsonp");
	scriptElement.parentNode.removeChild(scriptElement);
}


//move to next page set (i.e. from 1-10 to 11-20), open the first page of the set
function incrementPageSet(){
	//if the user is not on the last page set
	if (window.currentPageSet < window.pageSetMax) {
		//hide the page set the user is leaving
		document.getElementById("pageSet"+window.currentPageSet).style.display="none";
		window.currentPageSet=window.currentPageSet + 1;
		//make the new page set visible
		openFirstPageOfSet();
	}
}

//move to previous page set (i.e. from 11-20 to 1-11), open the first page of the set
function decrementPageSet(){
	//if the user is not on the first page set
	if (window.currentPageSet > 1) {
		//hide the page set the user is leaving
		document.getElementById("pageSet"+window.currentPageSet).style.display="none";
		//new page set
		window.currentPageSet=window.currentPageSet - 1;
		//make the new page set visible
		openFirstPageOfSet();
	}
}

//whenever the user moves to next, prev page the first page of the set is loaded
function openFirstPageOfSet() {
		//make the current page set visible and click on it
		document.getElementById("pageSet"+window.currentPageSet).style.display="inline-block";
		document.getElementById("pageSet"+window.currentPageSet).firstChild.click();
}

//add sets of pages (i.e. 1-10, 11-20 etc.), define buttons next/prev/first/last to move between page sets
function addPaging() {

	document.getElementById("pagingTop").style.display="block";
	//calculate the number of page sets (max 10 pages per set)
	window.pageSetMax = Math.ceil(news.pages/10);

	window.maxNumOfPages=news.pages;
	//add page elements for every set
	createPages();

	//add navigation buttons if there is more than one page of results
	if (window.pageSetMax > 1) {
		addPreviousNextButtons();
	}
	else {
		hidePreviousNextButtons();
		hideBackToTopLink;
	}
}

//add the number of results to the top of the page in the format "Displaying results 1 to 50 of 150"
function addNumberOfResults() {
	document.getElementById("pagingTop").style.display="block";
	var numOfResults=document.getElementById("numberOfResults");
	//results from
	var currRangeFrom=(news.currentPage - 1) * RESULTS_PER_PAGE + 1;
	//results to - if there is more than one page
	if (news.pages > 1){
		//the user is on the last page
		if (news.currentPage == news.pages) {
			var currRangeTo=news.total
		}
		//the user is on any other page
		else {
			var currRangeTo=news.currentPage * RESULTS_PER_PAGE;
		}
	}
	//results to - if there is only one page of results
	else {
		var currRangeTo=news.total;
	}
	//build a string "Displaying results 'x' to 'y' of 'total'"
	var numOfResultsText="Displaying results " + currRangeFrom + " to " + currRangeTo + " of " + news.total;
	numOfResults.innerHTML=numOfResultsText;

}

//remove all child nodes of a given div
//stackoverflow: http://stackoverflow.com/questions/32259635/recursively-remove-all-nested-nodes-in-javascript
function clearNodes(node) {

  while (node.hasChildNodes()) {
    clear(node.firstChild);
  }
}

//remove child nodes recursivelly
//stackoverflow: http://stackoverflow.com/questions/32259635/recursively-remove-all-nested-nodes-in-javascript
function clear(node) {

  while (node.hasChildNodes()) {
    clear(node.firstChild);
  }
  node.parentNode.removeChild(node);
}

//remove the nodes from the paging div
function removeOldPaging() {

	hidePreviousNextButtons();
	var pages=document.getElementById("pages");
	clearNodes(pages);
}

//create div structure and page nodes to move between pages of results
function createPages() {

	//create an appropriate number of page sets
	for (i=1; i<=window.pageSetMax; i++) {
		var pageSet = document.createElement("div");
		pageSet.setAttribute("class", "hidden");
		pageSet.setAttribute("id", "pageSet" + i);
		pages.appendChild(pageSet);

		//for each page set create 10 pages (buttons)
		for (j=(i*10)-9 ; j<= i*10; j++) {
			if (j>window.maxNumOfPages){
				break;
			}
			else {
				var pageButton = document.createElement("button");
					pageButton.setAttribute("id", "page" + j);
					pageButton.innerHTML=j;
					pageSet.appendChild(pageButton);
					pageButton.addEventListener("click",getArticles);
					pageButton.addEventListener("click",function() { unmarkClickedButton(); this.className="activeButton"});
					pageButton.addEventListener("click",function() { window.newSearch=false});

			}
		}
	}
	//set the currentPageSet to 1, make it visible open the first page
	window.currentPageSet=1;
	document.getElementById("pageSet"+window.currentPageSet).style.display="inline-block";
	document.getElementById("pageSet"+window.currentPageSet).firstChild.click();
}

//make the next/previous/goToFirst/goToLast buttons invisible before adding new paging element
function hidePreviousNextButtons() {

	var previousButton = document.getElementById("buttonPrevious");
	var nextButton = document.getElementById("buttonNext");
	var firstButton = document.getElementById("buttonFirstPageSet");
	var lastButton = document.getElementById("buttonLastPageSet");

	//set to invisible
	nextButton.style.display="none";
	previousButton.style.display="none";
	firstButton.style.display="none";
	lastButton.style.display="none";

}


//make visible buttons next, previous, goToFirst, goToLast to move within page sets (i.e. 1-10, 11-20)
function addPreviousNextButtons() {

	var previousButton = document.getElementById("buttonPrevious");
	var nextButton = document.getElementById("buttonNext");
	var firstButton = document.getElementById("buttonFirstPageSet");
	var lastButton = document.getElementById("buttonLastPageSet");

	//set to visible
	nextButton.style.display="inline-block";
	previousButton.style.display="inline-block";
	firstButton.style.display="inline-block";
	lastButton.style.display="inline-block";

	//add event listeners
	nextButton.onclick=incrementPageSet;
	previousButton.onclick=decrementPageSet;
	firstButton.onclick=goToFirst;
	lastButton.onclick=goToLast;

}

//add back to top link when results are displayed on the scren
function addBackToTopLink() {

	var backToTop=document.getElementById("backToTop");
	backToTop.style.display="block";
}

//hide the back to top link when there are no results displayed on the page
function hideBackToTopLink() {

	var backToTop=document.getElementById("backToTop");
	backToTop.style.display="none";
}

//go to first page set of paging (pages 1-10)
function goToFirst(){
	//button does not do anything if the user is on the first page set already
	if (window.currentPageSet != 1) {
		//hide the previous page set
		document.getElementById("pageSet"+window.currentPageSet).style.display="none";
		//go to first and load the first page of the first page set
		window.currentPageSet = 1;
		openFirstPageOfSet();
	}
}

//go to last page set of paging
function goToLast(){
	//button does not do anything if the user is on the last page set already
	if (window.currentPageSet != window.pageSetMax) {
		//hide the previous page set
		document.getElementById("pageSet"+window.currentPageSet).style.display="none";
		//go to last and load the first page of the last page set
		window.currentPageSet = window.pageSetMax;
		openFirstPageOfSet();
	}
}

//creates html content for the pop-up (modal) window that displays the saved articles to the user
function createReadingList() {

	var readingListItems = document.getElementById("readingListItems");
	clearNodes(readingListItems);
	var readingListElement=document.createElement("UL");
	readingListItems.appendChild(readingListElement);

	for (key in localStorage){
		if (typeof localStorage[key] != "function" && key != "length") {

			var newItemOnReadingList = document.createElement("LI")
			//var newItemOnReadingList = document.createElement("a");
			newItemOnReadingList.setAttribute("class","readingListItem");

			var newItemLink=document.createElement("a");
			newItemLink.href=localStorage[key];
			newItemLink.target="_blank";
			newItemLink.innerHTML=key;
			//newItemOnReadingList.href=localStorage[key];
			//newItemOnReadingList.target="_blank"
			readingListElement.appendChild(newItemOnReadingList);
			newItemOnReadingList.appendChild(newItemLink);
		}
	}
}
//removes the saved articles from local storage
function clearReadingList() {

	localStorage.clear();
	createReadingList();
}

//gets the values from all the checkboxes (tags) that are checked
function getTagsCheckboxesValues() {

	var selectedCheckboxes="";
	var checkboxes=document.getElementsByName("tag");
	for (item in checkboxes) {
		if (checkboxes[item].checked == true) {
			selectedCheckboxes = selectedCheckboxes + checkboxes[item].value + ","
		}
	}
	console.log(selectedCheckboxes.slice(0,-1));

	return selectedCheckboxes.slice(0,-1)
}

//clears the checks from all checkboxes (tags)
function uncheckCheckboxes() {

	var checkboxes=document.getElementsByName("tag");
	for (item in checkboxes) {
		checkboxes[item].checked = false;
	}
}

//removes the styling from the currently highlighted page number button
function unmarkClickedButton(){

				var currentButton = document.getElementsByClassName("activeButton")[0];
				console.log(currentButton);
				if (currentButton) {
						currentButton.className="";
				}
}

/*
 * This piece of code was used to filter out the top ten tags from all articles. The original intention was to run this every time the user submits
 * a new search but since the code triggers a large number of requests (one jsonp request for each page - there can be up to 100 pages)
 * and the number of requests per day per API key is limited, it was commented out.
 * In real world it could be run from time to time to update the top tags search options.
 */

/*function getTopTags() {

	window.tags={};

	for (i=1; i<=news.pages; i++) {
		window.myUserInput.page.value=i;
		myUrl=window.myUserInput.createUrl("getTagsCallback");
		executeJsonp(myUrl);
	}
}

function filterOutTags() {

	for (article in myNews) {
		for (tag in myNews[article].tags) {
			if (myNews[article].tags[tag].type=="keyword") {

				if (!window.tags.hasOwnProperty(myNews[article].tags[tag].id)) {
					window.tags[myNews[article].tags[tag].id] = 1;
				}
				else
					window.tags[myNews[article].tags[tag].id]=tags[myNews[article].tags[tag].id] + 1
			}
		}
	}
}

function findTopTenTags() {

	var sortedTags = [];
	for (tag in window.tags) {
		sortedTags.push([tag, window.tags[tag]])
	}

	sortedTags.sort(function(a, b) {
    return b[1] - a[1];})
	console.log(sortedTags.slice(0,50));

}

function getTagsCallback(data) {

	myNews=data.response.results;
	filterOutTags();
	findTopTenTags();

}*/

//receive user input and set the values in the userInput object
userInput.prototype.getUserInput = function()  {

    var searchWord = document.getElementById("searchWord").value;
    this.searchKeywords.value=searchWord;



    if (advancedFlag) {

		//dropdown menu (containing "and","or","not") displayed when user clicks advanced search button
        var operator = document.getElementById("operator").value;
		//input form displayed when user clicks advanced search
        var secondSearchWord = document.getElementById("secondSearchWord").value;
		var fromDate = document.getElementById("fromDate").value;
        var toDate = document.getElementById("toDate").value;
        var mediaType = document.getElementById("mediaTypeChosen").value;
        var contributor = document.getElementById("contributor").value;
        var sortBy = document.getElementById("sortMethod").value;

		this.searchKeywords.operator=operator;
		this.searchKeywords.advancedSearchValue=secondSearchWord;
		this.tags.keyword=getTagsCheckboxesValues();
		//RENKUN: the date must be converted to format "2016-01-30"
		this.fromDate.value=fromDate;
		//RENKUN: the date must be converted to format "2016-01-30"
		this.toDate.value=toDate;

		if (mediaType == "all"){
			this.mediaType="";
		}

		else {
			this.mediaType.value=mediaType;
		}

		this.sortedBy.value=sortBy;
		//RENKUN: convert "Edward Helmore" to "profile/edward-helmore"
		this.tags.author=contributor;

    }

}

//wipe all inputs when page refreshed
function wipeAllInputFields(){

  document.getElementById("searchWord").value="";
  document.getElementById("operator").value="AND";
  document.getElementById("secondSearchWord").value="";
  document.getElementById("fromDate").value="";
  document.getElementById("toDate").value="";
  document.getElementById("mediaTypeChosen").value="all";
  document.getElementById("contributor").value="";
  document.getElementById("sortMethod").value="relevance";
  uncheckCheckboxes();
}

function showAdvancedSearch() {

    if (!advancedFlag) {

        document.getElementById("advancedSearchField").style.display = "";
        document.getElementById("advancedSearch").value = "Hide Advanced Search";
        advancedFlag = true;
    }
    else {

        document.getElementById("advancedSearchField").style.display = "none";
        document.getElementById("advancedSearch").value = "Show Advanced Search";
        wipeAllInputFields();
        advancedFlag = false;
    }

}
