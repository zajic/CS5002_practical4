function init() {
    document.getElementById("search").onclick=searchWordInput();
    document.getElementById("advancedSearch").onclick=advSearchOption();
    // still need correction...
    document.getElementById("search").onclick=advSearchInput();
  }
//receiving users' key word inputs
function searchWordInput(){
var searchWord=document.getElementById("searchWord");
}
//generating the options of advanced search variables
function advSearchOption(){
  for(i=1,i<news.length,i++){
    for(j=1,j<tag.lenghth,i++){
      if (tag.type=="keyword"）{
        tag.push(tag[j].webTitle);
      }
      if (tag.type=="contributor"){
        contributor.push(tag[j].webTitle);
      }
    }
    mediaType.push(news[i].type);
  }
}
//receiving uses' advanced search inputs
function advSearchInput(){
  var tagChosen=document.getElementById("tagChosen");
  var fromDate=document.getElementById("fromDate");
  var toDate=document.getElementById("toDate");
  var mediaTypeChosen=document.getElementById("mediaTypeChosen");
  var contributorChosen=document.getElementById("contributorChosen");
  var sort=document.getElementById("sortMethod");
}
}
window.onload = init;
