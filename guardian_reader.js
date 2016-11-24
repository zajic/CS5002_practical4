window.onload=init;
var news={};

function init() {
	getArticles();
}

//object holds all search input entered by the user and the format of the query for each search criteria
function userInput(searchWord,tag,fromDate,toDate,mediaType,contributor,sortedBy) {

	this.searchWord = {
		query:"&q=",
		value:searchWord
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
}


//generate a query from inputs stored in userInput object
userInput.prototype.generateQuery = function() {
	
	var urlQuery="";
	//go through the userInput properties and if a property has a value, add it to the urlQuery (tags are handled separately)
	for (prop in this) {
		if (typeof this[prop]  != 'function' && this[prop] != "tags") {
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

	return urlQuery+tags;
}

//get user input, create url for JSONP query and execute the jsonp request
function getArticles() {
	//for now the user input is hardcoded here
	//var myUserInput = new userInput("Trump","","","","","","");
	var myUserInput = new userInput("Trump","us-news/hillary-clinton","2016-01-30","2016-05-30","article","profile/megan-carpentier","oldest");
	myUrl=createUrl(myUserInput);
	executeJsonp(myUrl);
}

//add the script with jsonp url to the html
function executeJsonp(/*string*/url) {
	
	console.log(url);
	var scriptElement = document.createElement("script");
	scriptElement.src = url;
	scriptElement.id = "jsonp";
	document.head.appendChild(scriptElement);
	//to see what happens next go to function callback()
}

//create url for the request: the url consists of static query part that never change and dynamic query generated based on user input
function createUrl(/*object*/userInput) {
	
	if (typeof userInput == 'object' && arguments.length>0) {
		//the basic part of url is the same for every request
		var baseurl = "https://content.guardianapis.com/search"
		var APIkey="?api-key=cd76717d-271b-47b9-a69b-c06e83a77405"
		var staticOptions="&show-fields=thumbnail,trailText&show-tags=keyword,contributor&page-size=50&format=json&callback=callback"
		
		//generate the dynamic part of the query
		var userQueryOptions=userInput.generateQuery();

		return baseurl + APIkey + staticOptions + userQueryOptions;
	}
	else
		throw new Error("userInput object must be passed to the function as argument.")

}

//callback function used in JSONP request
function callback(/*object*/data) {
	
	//cleanup the previous jsonp request
	cleanupScript();
	console.log(data);
	if (data.response.results.total == 0){
		//this we will have to display to the user
		console.log("No results for the given search criteria. Please try again.")
	}
	else {
		//this is the part of the JSONP request we are interested in
		news = data.response.results;
		//this will be replaced by a better function from Roger
		createTiles();
	}
}


//removes previous jsonp requests
function cleanupScript() {
	
	var scriptElement = document.getElementById("jsonp");
	scriptElement.parentNode.removeChild(scriptElement);
}

function createTiles() {
	
			var newHeader1=news[0].webTitle;
			var textBody1=(news[0].fields.trailText)
			var thumbImg1=news[0].fields.thumbnail;
			var link1=news[0].webUrl;
			var datePub1=news[0].webPublicationDate;
			for (x in news[0].tags) {
				if (news[0]["tags"][x]["type"] == "contributor")
				var contributor1=news[0].tags[x].webTitle;
			}
			
			document.getElementById("newsHeading1").innerHTML=newHeader1;
			document.getElementById("newsBody1").innerHTML=textBody1;
			document.getElementById("newsThumbnail1").src=thumbImg1;
			document.getElementById("link1").href=link1;
			document.getElementById("datePublished1").innerHTML="Published: " + datePub1.slice(0,10) + " " + datePub1.slice(-9,-1);
			document.getElementById("contributedBy1").innerHTML="By " + contributor1;
			
			
			var newHeader2=news[1].webTitle;
			//var textBody2=(news[1].blocks.body[0].bodyTextSummary).slice(0,350) + "...";
			var textBody2=(news[1].fields.trailText)
			var thumbImg2=news[1].fields.thumbnail;
			var link2=news[1].webUrl;
			var datePub2=news[1].webPublicationDate;
				for (x in news[1].tags) {
				if (news[1]["tags"][x]["type"] == "contributor")
				var contributor2=news[1].tags[x].webTitle;
			}
			document.getElementById("newsHeading2").innerHTML=newHeader2;
			document.getElementById("newsBody2").innerHTML=textBody2;
			document.getElementById("newsThumbnail2").src=thumbImg2;
			document.getElementById("link2").href=link2;
			document.getElementById("datePublished2").innerHTML="Published: " + datePub2.slice(0,10) + " " + datePub2.slice(-9,-1);
			document.getElementById("contributedBy2").innerHTML="By " + contributor2;

}

