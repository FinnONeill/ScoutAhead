//Global Variables
var inputBox = document.getElementById('searchInput');
finish = document.getElementById('searchInputFinish');

// Search for locations, given area name.
function search(startFinish){
	var baseUrl = "https://nominatim.openstreetmap.org/search?";
	var query = "q=";
	var format = "&format=xml";
	var polygon = "&polygon=";
	var addressdetails = "&addressdetails=";
	
	if(startFinish === "start"){
		query = query + inputBox.value;
	}else if(startFinish === "finish"){
		query = query + finish.value;
	}
	
	var url = baseUrl+query+format+polygon+"1"+addressdetails+"1";
	console.log("Search URL :: "+ url);

	httpGetAsync(url, function(urlThingy){
		//Clear previous results before displaying new ones.
		clearResults();
		clearWeather();

		//If searching for another area without clearing previous search.
		if((inputBox.value != "") || (finish.value != "")){
			clearDiv('headerDiv');
			clearRoute();
			hideGPXDownload();
			clearDiv('elevationChart');
		}

		var xmlDoc = $.parseXML( urlThingy );
		$xml = $( xmlDoc );
		$place = $xml.find('place');

		//If no results are found.
		if($place.length === 0){
			addErrorResult("No results found with that name, please try another area name.");
			optionsFooter.setAttribute('class', 'row');
		}else{
			$place.each(function(index, element) {
				if(element.attributes["importance"]){

					//Get the Name, Lat, Long, Importance(ranking) and type of each location.
					var placeName = element.attributes["display_name"].value;
					var importance = element.attributes["importance"].value;
					var lat = element.attributes["lat"].value;
					var lon = element.attributes["lon"].value;
					var type = element.attributes["type"].value;

					// Add each result to the list.
					addResult(placeName, index, lat, lon, type, startFinish);
				}
			})
		}
		
	});
}

// Function to display each result to the result list.
function addResult(resultName, resultId, lat, lon, type, startFinish){
	var resultList = document.getElementById('resultCard');

	var headingLink = document.createElement('a');
	headingLink.setAttribute('href', '#');
	headingLink.setAttribute('class', 'list-group-item list-group-item-action flex-column align-items-start');
	if(startFinish === "start"){
			headingLink.setAttribute('onclick', "pan(" + lat + "," + lon + ",15);getWeather(" + lat + "," + lon + "," + resultId + ");showStartFinish();setLatLon(0,"+lat+","+lon+")");
	}else if(startFinish === "finish"){
			headingLink.setAttribute('onclick', "pan(" + lat + "," + lon + ",15);getWeather(" + lat + "," + lon + "," + resultId + ");showStartFinish();setLatLon(1,"+lat+","+lon+");searchRoutes();getWeather("+lat+","+lon+",finish)");
	}
  	
	var headingDiv = document.createElement('div');
	headingDiv.setAttribute('class', 'd-flex w-100 justify-content-between');

	var headingH5 = document.createElement('h5');
	headingH5.setAttribute('class', 'mb-1 text-capitalize');
	headingH5.setAttribute('id', "search"+resultId);

	var headingName = document.createTextNode(resultName);

	var latLong = document.createElement('small');
	latLong.setAttribute('class', 'text-muted');
	latLong.setAttribute('id', 'searchLatLon'+resultId);
	var latLongText = document.createTextNode("Lat:\t"+lat+"\tLon:\t"+lon+"\tType:\t"+type);

	headingH5.appendChild(headingName);
	latLong.appendChild(latLongText);
	headingDiv.appendChild(headingH5);
	headingLink.appendChild(headingDiv);
	headingLink.appendChild(latLong);
	resultList.appendChild(headingLink);
}

//Clear all previous results.
function clearResults() {
	var results = document.getElementById('resultCard');
	while (results.childNodes[0]) {
	  results.removeChild(results.childNodes[0]);
	}
}

// Search for locations, given Lat, Lon.
function searchLatLon(latLonObj){
	var baseUrl = "https://nominatim.openstreetmap.org/reverse?";
	var format = "&format=xml";
	var zoom = "&zoom=18";
	var addressdetails = "&addressdetails=1";

	// Transform to Lat, Lon.
	var lat = ol.proj.transform(latLonObj.coordinate, 'EPSG:3857', 'EPSG:4326')[1];
	var lon = ol.proj.transform(latLonObj.coordinate, 'EPSG:3857', 'EPSG:4326')[0];

	var url = baseUrl+format+"&lat="+lat+"&lon="+lon+zoom+addressdetails;

	httpGetAsync(url, function(urlThingy){
		//Clear previous results before displaying new ones.
		clearResults();
		clearWeather();

		var xmlDoc = new DOMParser().parseFromString(urlThingy,"text/xml");
		var addressParts = xmlDoc.getElementsByTagName("addressparts");
		var placeName = addressParts[0].childNodes[0].childNodes[0].nodeValue;
		placeName = placeName + ", "+ addressParts[0].childNodes[1].childNodes[0].nodeValue;

		//isMark === true, then it's the start location else its the finish location.
		if(isMark === true){
			inputBox.value = placeName;
			inputBox.setAttribute('lat', lat);
			inputBox.setAttribute('lon', lon);
		} 
		if(isMark === false){
			finish.value = placeName;	
			finish.setAttribute('lat', lat);
			finish.setAttribute('lon', lon);
			searchRoutes();
		} 
	});
}

//Set the latLon for either the start or finish input.
function setLatLon(startFinish, lat, lon){
	if(startFinish === 0){
		inputBox.setAttribute('lat', lat);
		inputBox.setAttribute('lon', lon);
	} 
	if(startFinish === 1){
		finish.setAttribute('lat', lat);
		finish.setAttribute('lon', lon);
	} 

	clearResults();
}

// Clear all components for a new search.
function clearSearch(){
	clearWeather();
	clearResults();
	clearDiv('headerDiv');
	clearRoute();
	hideGPXDownload();
	clearDiv('elevationChart');

	inputBox.value = "";
	inputBox.setAttribute('lat', "");
	inputBox.setAttribute('lon', "");

	finish.value = "";
	finish.setAttribute('lat', "");
	finish.setAttribute('lon', "");
}

//Swap the start and finish information.
function swapStartFinish(){
	var tmp = inputBox.value;
	inputBox.value = finish.value;
	finish.value = tmp;

	tmp = inputBox.getAttribute('lat');
	inputBox.setAttribute('lat', finish.getAttribute('lat'));
	finish.setAttribute('lat', tmp);

	tmp = inputBox.getAttribute('lon');
	inputBox.setAttribute('lon', finish.getAttribute('lon'));
	finish.setAttribute('lon', tmp);
}