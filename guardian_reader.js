window.onload=init;
var news={};
var RESULTS_PER_PAGE=50;

function init() {

	var search=document.getElementById("searchButton");
	search.addEventListener("click",getArticles);
	
	//the variable newSearch helps to distinguish whether user clicked on Search button or on a page number
	search.addEventListener("click",function() { window.newSearch=true;});
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

//generate a query from inputs stored in userInput object
userInput.prototype.generateQuery = function() {
	
	var urlQuery="";
	//go through the userInput properties and if a property has a value, add it to the urlQuery (tags and keywords are handled separately)
	for (prop in this) {
		if (typeof this[prop]  != 'function' && this[prop] != "tags" && this[prop] != "searchWord") {
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

//get user input, create url for JSONP query and execute the jsonp request
function getArticles() {
	//if the function was called by clicking on Search button get user input and create new url
	if (this.id == "searchButton") {
		//window.myUserInput = new userInput("","","","","","","","","");
		//many pages
		window.myUserInput = new userInput("Trump","OR","Barrack Obama","","","","","","");
		//no pages
		//window.myUserInput = new userInput("Trump","OR","Hillary","us-news/hillary-clinton","2016-01-30","2016-05-30","article","profile/megan-carpentier","oldest");
		//two pages
		//window.myUserInput = new userInput("","","","","","","article","profile/megan-carpentier","oldest");

	}
	//if the function was called by clicking on page number there is no need to get user input, just update the page number and generate new url
	else {
		var pageNumber=document.getElementById(this.id).innerHTML;
		window.myUserInput.page.value=pageNumber;
	}
	myUrl=createUrl(window.myUserInput,"callbackGeneric");
	executeJsonp(myUrl);
}

//create url for the request: the url consists of static query part that never change and dynamic query generated based on user input
function createUrl(/*object*/userInput,/*string*/callback) {
	
	if (typeof userInput == 'object' && arguments.length>0) {
		//the basic part of url is the same for every request
		var baseurl = "https://content.guardianapis.com/search";
		var APIkey="?api-key=cd76717d-271b-47b9-a69b-c06e83a77405";
		var callbackOption="&callback=" + callback
		var staticOptions="&show-fields=thumbnail,trailText&show-tags=keyword,contributor&page-size=50&format=json"
		
		//generate the dynamic part of the query
		var userQueryOptions=userInput.generateQuery();

		return baseurl + APIkey + staticOptions + callbackOption + userQueryOptions;
	}
	else
		throw new Error("userInput object must be passed to the function as argument.")

}

//add the script with jsonp url to the html
function executeJsonp(/*string*/url) {

	console.log(url);
	var scriptElement = document.createElement("script");
	scriptElement.src = url;
	scriptElement.id = "jsonp";
	document.head.appendChild(scriptElement);
	//go to function callback()
}

//callback function used in JSONP request
function callbackGeneric(/*object*/data) {
	
	//cleanup the previous jsonp request and articles
	cleanupScript();
	cleanUpArticles();
	console.log(data);
	
	//jsonp did not return any results
	if (data.response.results.total == 0){
		//TO DO: display to the user
		console.log("No results for the given search criteria. Please try again.")
	}
	else {
		news=data.response;
		listStories(data.response.results, "content");  //.response.results is relevant child within parent file
		
		//add paging only if the user clicked on "Search" and if the results do not fit on one page
		if (window.newSearch && news.total > news.pageSize) {
			addPaging();
			//getTopTenTags();
			
		}
		//add the number of results to the top of the page
		addNumberOfResults();
	}
}

function getTagsCallback() {
	
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
	else {
		//if the user is trying to go to next page set but he is on the last set and there is nowhere to go
		document.getElementById("page" + news.currentPage).focus();
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
	//if the user is trying to go to previous page set but he is on the first set and there is nowhere to go
	else {
		document.getElementById("page" + news.currentPage).focus();
	}
	
}
//whenever the user moves to next, prev page the first page of the set is loaded
function openFirstPageOfSet() {
		//make the current page set visible, set focus on the first page of the set and click on it
		document.getElementById("pageSet"+window.currentPageSet).style.display="inline-block";
		document.getElementById("pageSet"+window.currentPageSet).firstChild.focus();
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
}

//add the number of results to the top of the page in the format "Displaying results 1 to 50 of 150"
function addNumberOfResults() {
	
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

//create div structure and page nodes to move between pages of results
function createPages() {
	
	var pages=document.getElementById("pages");
	clearNodes(pages);

	//create an appropriate number of page sets
	for (i=1;i<=window.pageSetMax;i++) {
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
					pageButton.addEventListener("click",function() { window.newSearch=false});
			}
		}
	}
	//set the currentPageSet to 1, make it visible and set focus on the first page
	window.currentPageSet=1;
	document.getElementById("pageSet"+window.currentPageSet).style.display="inline-block";
	document.getElementById("pageSet"+window.currentPageSet).firstChild.focus();
}

//make visibl buttons next, previous, goToFirst, goToLast to move within page sets (i.e. 1-10, 11-20)
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
	
	//add event listeneres
	nextButton.onclick=incrementPageSet;
	previousButton.onclick=decrementPageSet;
	firstButton.onclick=goToFirst;
	lastButton.onclick=goToLast;

}

//go to first page set of paging (pages 1-10)
function goToFirst(){
	//button does not do anything if the user is on the first page set already
	if (window.currentPageSet == 1) {
		document.getElementById("page" + news.currentPage).focus();
	}
	else {
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
	if (window.currentPageSet == window.pageSetMax) {
		document.getElementById("page" + news.currentPage).focus();
	}
	else {
		document.getElementById("pageSet"+window.currentPageSet).style.display="none";
		//go to last and load the first page of the last page set
		window.currentPageSet = window.pageSetMax;
		openFirstPageOfSet();
	}
}

function getTopTenTags() {
	
	window.tags=[];
	
	for (i=1; i<news.pages; i++) {
		window.myUserInput.page.value=i;
		myUrl=createUrl(myUserInput,"getTagsCallback");
		executeJsonp(myUrl);
	}
}

function filterOutTags() {
	
	for (article in myNews) {
			for (tag in myNews[article].tags) {
				if (myNews[article].tags[tag].type=="keyword" && tags.indexOf(myNews[article].tags[tag].webTitle) == -1)
				window.tags.push(myNews[article].tags[tag].webTitle);
			}
		}
}

function getTagsCallback(data) {
	myNews=data.response.results;
	filterOutTags();
	console.log(window.tags);
	console.log((window.tags).length);
}

