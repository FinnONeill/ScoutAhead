function httpGetAsync(theUrl, callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            //console.log("200");
            callback(xmlHttp.responseText);
            return "200";
        }
        if (xmlHttp.status == 400){
            //console.log("Error 400 ::"+xmlHttp.status);
            addErrorResult("No results found");
            return "400";
        }
    	if (xmlHttp.status == 404){
        	//console.log("Error 404 ::"+xmlHttp.status);
        	addErrorResult("No results found");
        	return "404";
        }
    }

    xmlHttp.open("GET", theUrl, true); // true for asynchronous 

    xmlHttp.timeout = 2000;

    xmlHttp.ontimeout = function(e) {
        addErrorResult("Request timed out. Please check your internet connection.");
    }

    xmlHttp.send(null);
}

function addErrorResult(msg){
	clearSearch();

	var resultList = document.getElementById('resultCard');

	var headingLink = document.createElement('a');
	headingLink.setAttribute('href', '#');
	headingLink.setAttribute('class', 'list-group-item list-group-item-action flex-column align-items-start');

	var headingDiv = document.createElement('div');
	headingDiv.setAttribute('class', 'd-flex w-100 justify-content-between');

	var headingH5 = document.createElement('h5');
	headingH5.setAttribute('class', 'mb-1 text-capitalize');

	var headingName = document.createTextNode(msg);

	headingH5.appendChild(headingName);
	headingDiv.appendChild(headingH5);
	headingLink.appendChild(headingDiv);
	resultList.appendChild(headingLink);
}