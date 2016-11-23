<<<<<<< Updated upstream
var news={};
window.onload=init;

function init() {
	
	getNewsFromServer();
	
	//this is not a good solution, we need to figure out how to call the function when the JSONP request is finished
	setTimeout(createTile,2000)

}
//send a JSONP request to the guardian API
function getNewsFromServer() {
	
	var baseurl = "https://content.guardianapis.com"
	var path = "/search"
	var APIkey="?api-key=cd76717d-271b-47b9-a69b-c06e83a77405"
	//something will be here later
	var query = "";
	var staticOptions="&tag=us-news/us-elections-2016&show-fields=thumbnail,trailText&show-tags=keyword,contributor&page-size=50"
	
	var jsonpOpts = "&format=json&callback=callback";
	var script = document.createElement("script");
	script.src = baseurl + path + APIkey + query + staticOptions + jsonpOpts;
	//this shows the URL we are requesting
	console.log(script.src);
	document.body.appendChild(script);
}

function callback(data) {
	console.log(data);
	//this is the only part of the JSONP request we are interested in
	news = data.response.results
}

//process the news object and create single records (tiles) for each of them
//one tile will contain for example: heading, text (beginning of the text body), date published, link, thumbnail
function createTile() {
	
			//console.log(news[1].webTitle);
			var newHeader1=news[0].webTitle;
			//var textBody1=(news[0].blocks.body[0].bodyTextSummary).slice(0,350) + "...";
			var textBody1=(news[0].fields.trailText)
			var thumbImg1=news[0].fields.thumbnail;
			var link1=news[0].webUrl
			//console.log(textBody);
			document.getElementById("newsHeading1").innerHTML=newHeader1;
			document.getElementById("newsBody1").innerHTML=textBody1;
			document.getElementById("newsThumbnail1").src=thumbImg1;
			document.getElementById("link1").href=link1;
			
			
			
			var newHeader2=news[1].webTitle;
			//var textBody2=(news[1].blocks.body[0].bodyTextSummary).slice(0,350) + "...";
			var textBody2=(news[1].fields.trailText)
			var thumbImg2=news[1].fields.thumbnail;
			var link2=news[1].webUrl
			//console.log(textBody);
			document.getElementById("newsHeading2").innerHTML=newHeader2;
			document.getElementById("newsBody2").innerHTML=textBody2;
			document.getElementById("newsThumbnail2").src=thumbImg2;
			document.getElementById("link2").href=link2;

=======
var news={};
window.onload=init;

function init() {
	
	getNewsFromServer();
	
	//this is not a good solution, we need to figure out how to call the function when the JSONP request is finished
	setTimeout(createTile,2000)

}
//send a JSONP request to the guardian API
function getNewsFromServer() {
	
	var baseurl = "https://content.guardianapis.com"
	var path = "/search"
	var APIkey="?api-key=cd76717d-271b-47b9-a69b-c06e83a77405"
	//something will be here later
	var query = "";
	var staticOptions="&tag=us-news/us-elections-2016&show-fields=thumbnail,trailText&show-tags=keyword,type,contributor&page-size=50"
	
	var jsonpOpts = "&format=json&callback=callback";
	var script = document.createElement("script");
	script.src = baseurl + path + APIkey + query + staticOptions + jsonpOpts;
	//this shows the URL we are requesting
	console.log(script.src);
	document.body.appendChild(script);
}

function callback(data) {
	console.log(data);
	//this is the only part of the JSONP request we are interested in
	news = data.response.results
}

//process the news object and create single records (tiles) for each of them
//one tile will contain for example: heading, text (beginning of the text body), date published, link, thumbnail
function createTile() {
	
			//console.log(news[1].webTitle);
			var newHeader1=news[0].webTitle;
			//var textBody1=(news[0].blocks.body[0].bodyTextSummary).slice(0,350) + "...";
			var textBody1=(news[0].fields.trailText)
			var thumbImg1=news[0].fields.thumbnail;
			var link1=news[0].webUrl
			//console.log(textBody);
			document.getElementById("newsHeading1").innerHTML=newHeader1;
			document.getElementById("newsBody1").innerHTML=textBody1;
			document.getElementById("newsThumbnail1").src=thumbImg1;
			document.getElementById("link1").href=link1;
			
			
			
			var newHeader2=news[1].webTitle;
			//var textBody2=(news[1].blocks.body[0].bodyTextSummary).slice(0,350) + "...";
			var textBody2=(news[1].fields.trailText)
			var thumbImg2=news[1].fields.thumbnail;
			var link2=news[1].webUrl
			//console.log(textBody);
			document.getElementById("newsHeading2").innerHTML=newHeader2;
			document.getElementById("newsBody2").innerHTML=textBody2;
			document.getElementById("newsThumbnail2").src=thumbImg2;
			document.getElementById("link2").href=link2;

>>>>>>> Stashed changes
}