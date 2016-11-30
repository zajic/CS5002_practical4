
/*
 * Generic function to render a list of articles under the div element with the
 * given id.
 */
function listStories(stories, divId) {
	var StoriesDiv = document.getElementById(divId);
	StoriesDiv.style.display="block";
	for (var i = 0; i<stories.length; i++) {  // SHOWS STORIES 1-5
		var story = stories[i];  
		renderStory(StoriesDiv, i, stories[i]);
	}
}

//Parent hyperlink.
/*
function renderHyperlink(parentDiv, i, story) {  //TO REPLACE renderLink
	var hyperlink = document.createElement("a");
	hyperlink.setAttribute("href", story.webUrl);
	hyperlink.setAttribute("class", "hyperlink");
	renderStory(hyperlink, story);  //renderStory(hyperlink, i, story);
	renderThumbnail(hyperlink, story);
	renderTitle(hyperlink, story);
	renderAuthor(hyperlink, story);
	renderDate(hyperlink, story);
	renderSummary(hyperlink, story);
	renderLink(hyperlink, story);
	parentDiv.appendChild(hyperlink);
	var clear = document.createElement("div");
	clear.setAttribute("class","clear");
	hyperlink.appendChild(clear);
	console.log("hi");
}
*/

//Produces a representation for an article in the given div.
function renderStory(parentDiv, i, story) {  //function renderStory(parentDiv, i, story) {
	var storyDiv = document.createElement("div");
	storyDiv.setAttribute("class", "story");
	renderThumbnail(storyDiv, story);
	renderTitle(storyDiv, story);
	renderAuthor(storyDiv, story);
	//renderDate(storyDiv, story);
	renderSummary(storyDiv, story);
	//renderLink(storyDiv, story);
	parentDiv.appendChild(storyDiv);
	var clear = document.createElement("div");
	clear.setAttribute("class","clear");
	storyDiv.appendChild(clear);
	//div.appendChild(storyDiv);
}

// Render thumbnail
function renderThumbnail(div, story) {
	
	var image = document.createElement("img");
	
	if(story.fields.hasOwnProperty('thumbnail')) { 
		image.setAttribute("src", story.fields.thumbnail);
		image.setAttribute("class", "thumbnail");
	}
	else {
		image.setAttribute("src","images/no_image_available.jpg");
		image.setAttribute("class", "image-unavailable");
	}
	div.appendChild(image);
}

// Render title
function renderTitle(div, story) {
	var titleDiv = document.createElement("a");
	titleDiv.setAttribute("class", "headline");
	titleDiv.setAttribute("href", story.webUrl);
	titleDiv.setAttribute("target", "_blank");
	//titleDiv.innerHTML = story.webTitle.slice(0,40) + "..."; 
	titleDiv.innerHTML = story.webTitle
	div.appendChild(titleDiv);
	/////////////////////////////////////////////////////
	titleDiv.addEventListener("click",function() {localStorage.setItem(titleDiv.innerHTML,titleDiv.href)});
}

//stores the article headline and link to local storage
function storeArticle() {
	localStorage.setItem(1,"newArticle");
}

// Render author
function renderAuthor(div, story) {
	var authorDiv = document.createElement("div");
	authorDiv.setAttribute("class", "author");
		for (x in story.tags) {
					if (story["tags"][x]["type"] == "contributor") {
							authorDiv.innerHTML = story.tags[x].webTitle+", "+story.webPublicationDate.slice(0,10); 
						}
					else {
							authorDiv.innerHTML = story.webPublicationDate.slice(0,10);
					}
				}
	div.appendChild(authorDiv);
}

// Render date
/*
function renderDate(div, story) {

	var dateDiv = document.createElement("div");
	dateDiv.setAttribute("class", "date");
	dateDiv.innerHTML = story.webPublicationDate.slice(0,10); //JSON file element
	div.appendChild(dateDiv);
}
*/

// Render summary
function renderSummary(div, story) {

	var summaryDiv = document.createElement("div");
	summaryDiv.setAttribute("class", "summary");
	summaryDiv.innerHTML = story.fields.trailText.slice(0,135) + "..."; //slice to shorten summary
	div.appendChild(summaryDiv);
}

// Render link
/*
function renderLink(div, story) {

	var linkDiv = document.createElement("a");
	linkDiv.setAttribute("class", "hyperlink");
	linkDiv.setAttribute("href", story.webUrl);
	linkDiv.innerHTML = story.webUrl; //JSON file element
	div.appendChild(linkDiv);
}
*/