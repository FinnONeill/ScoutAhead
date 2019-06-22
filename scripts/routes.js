//Global Variables
var start = document.getElementById('searchInput');
var finish = document.getElementById('searchInputFinish');
var shapePoints;
var bounds;
var vehicleType = "car";

// Get the route between two points.
function searchRoutes(){
	var baseUrl = "https://open.mapquestapi.com/directions/v2/route?key=ugu40KSfOnVGSAEm4EZGuwm8vsxyzROR&from=";
	var join = "&to=";
	var format = "&outFormat=xml";
	var url;
	
	//If used contextMenu, get lat and lon, else use text given.
	if((start.getAttribute('lat') != "") && ((finish.getAttribute('lat') != ""))){
		url = baseUrl+start.getAttribute('lat')+","+start.getAttribute('lon')+join+finish.getAttribute('lat')+","+finish.getAttribute('lon')+format;
	}else{
		url = baseUrl+start.value+""+join+finish.value+format;
	}

	//If walking is selcted.
	if(vehicleType === "walking"){
		url = url + "&routeType=pedestrian";
	}

	console.log("RoutesUrl :: "+url);

	httpGetAsync(url, function(urlThingy){
		//Clear everything before getting new route.
		clearResults();
		clearRoute();
		
		var xmlDoc = new DOMParser().parseFromString(urlThingy,"text/xml");
		sessionId = xmlDoc.getElementsByTagName("sessionId")[0].childNodes[0].nodeValue;
		console.log("sessionId :: "+sessionId);

		//Initiate Div's to display route.
		var totalTime = xmlDoc.getElementsByTagName("formattedTime")[0].childNodes[0].nodeValue;
		routeResultSetup(start.value, finish.value, totalTime);

		var maneuver = xmlDoc.getElementsByTagName("maneuver");
		var output = "";
		var lat, lon, dist, narr, totalDist, time;
		var totalDist = 0;


		for (var i = 0; i < maneuver.length; i++) {

			if(typeof maneuver[i].childNodes[0].childNodes[0] != 'undefined'){
				lat = maneuver[i].childNodes[0].childNodes[0].childNodes[0].nodeValue;
				lon = maneuver[i].childNodes[0].childNodes[1].childNodes[0].nodeValue;
			}

			if(typeof maneuver[i].childNodes[2] != 'undefined'){
				dist = parseFloat(maneuver[i].childNodes[2].childNodes[0].nodeValue);
				totalDist = totalDist+dist;
				time = maneuver[i].childNodes[4].childNodes[0].nodeValue
			}
			
			if(typeof maneuver[i].childNodes[8] != 'undefined'){
				narr = maneuver[i].childNodes[8].childNodes[0].nodeValue;
			}
			
			// Add the direction to the list.
			addRouteResult(narr, dist.toFixed(2), lat, lon, time);
		}

		// Get the total distance and add it to the header.
		addTotalDist(totalDist.toFixed(2));

		// Display the route on the map.
		displayRoute(sessionId, lat, lon);

	});
}

// Setup the Div's to display the route directions.
function routeResultSetup(startPoint, finishPoint, totalTime){
	var resultList = document.getElementById('headerDiv');
	clearDiv('headerDiv');

	var list = document.createElement('div');
	list.setAttribute('class', 'list-group'); 

	var headingLink = document.createElement('a');
	headingLink.setAttribute('href', '#');
	headingLink.setAttribute('class', 'list-group-item list-group-item-action flex-column align-items-start active');

	var headingDiv = document.createElement('div');
	headingDiv.setAttribute('id', 'headingDirectionDiv')
	headingDiv.setAttribute('class', 'd-flex w-100 justify-content-between');

	var headingH5 = document.createElement('h5');
	headingH5.setAttribute('class', 'mb-1 text-capitalize');

	var headingName = document.createTextNode(startPoint +" - "+finishPoint + " Directions");

	var timeDiv = document.createElement('small');
	//timeDiv.setAttribute('class', 'text-muted');
	var timeText = document.createTextNode("Time: "+totalTime);
	
	timeDiv.appendChild(timeText);
	headingH5.appendChild(headingName);
	headingDiv.appendChild(headingH5);
	headingLink.appendChild(headingDiv);
	headingLink.appendChild(timeDiv);
	list.appendChild(headingLink);
	resultList.appendChild(list);
}

// Function to add a direction to the list.
function addRouteResult(directions, dist, lat, lon, time){
	var resultList = document.getElementById('resultCard');

	var headingLink = document.createElement('a');
	headingLink.setAttribute('href', '#');
	headingLink.setAttribute('class', 'list-group-item list-group-item-action flex-column align-items-start');
	headingLink.setAttribute('onclick', "pan("+lat+","+lon+",15)");

	var headingDiv = document.createElement('div');
	headingDiv.setAttribute('class', 'd-flex w-100 justify-content-between');

	var headingH5 = document.createElement('h5');
	headingH5.setAttribute('class', 'mb-1');

	var headingName = document.createTextNode(directions);
	var headingDist = document.createElement('small');
	var headingDistValue = document.createTextNode(dist + " Km");

	var latLong = document.createElement('small');
	latLong.setAttribute('class', 'text-muted col-6');
	var latLongText = document.createTextNode("Lat:"+lat+"\tLon:"+lon);

	var timeDiv = document.createElement('small');
	timeDiv.setAttribute('class', 'text-muted col-6');
	var timeText = document.createTextNode("Time: "+time);

	headingDist.appendChild(headingDistValue);
	headingH5.appendChild(headingName);
	latLong.appendChild(latLongText);
	timeDiv.appendChild(timeText);
	headingDiv.appendChild(headingH5);
	headingDiv.appendChild(headingDist);
	headingLink.appendChild(headingDiv);
	headingLink.appendChild(latLong);
	headingLink.appendChild(timeDiv);
	resultList.appendChild(headingLink);
}

// Function to add the distance to the header div of the Directions.
function addTotalDist(totalDist){
	var resultList = document.getElementById('headingDirectionDiv');

	var headingDist = document.createElement('small');
	var headingDistValue = document.createTextNode(totalDist + " Km");

	headingDist.appendChild(headingDistValue);
	resultList.appendChild(headingDist);
}

// Display the route on the map.
function displayRoute(sessionId, lat, lon){

	var baseUrl = "https://www.mapquestapi.com/directions/v2/routeshape?key=ugu40KSfOnVGSAEm4EZGuwm8vsxyzROR"
	var sessionIdUrl = "&sessionId="+sessionId;
	var mapWidth = "&mapWidth=" + map.getSize()[0];
	var mapHeight = "&mapHeight=" + map.getSize()[1];
	var mapScale = "&mapZoom="+getMapZoom(Math.trunc(mapScaleCalc(72)));
	var mapLat = "&mapLat="+lat;
	var mapLon = "&mapLng="+lon;
	var format = "&outFormat=xml";
	
	//var url = baseUrl+sessionIdUrl+mapWidth+mapHeight+mapScale+mapLat+mapLon+format;
	var url = baseUrl+sessionIdUrl+"&fullShape=true"+format;
	console.log("urlRouteDisplay :: "+url);

	httpGetAsync(url, function(urlThingy){
		
		var xmlDoc = new DOMParser().parseFromString(urlThingy,"text/xml");

		//Add bounding box data for GPX File.
		var minLatLon = xmlDoc.getElementsByTagName("boundingBox");
		bounds = [];
		bounds.push([minLatLon[0].childNodes[0].childNodes[1].childNodes[0].nodeValue, minLatLon[0].childNodes[0].childNodes[0].childNodes[0].nodeValue]);
		bounds.push([minLatLon[0].childNodes[1].childNodes[1].childNodes[0].nodeValue, minLatLon[0].childNodes[1].childNodes[0].childNodes[0].nodeValue]);

		// Get all the points of the route.
		shapePoints = xmlDoc.getElementsByTagName("latLng");
		var routePoints = [];
		for (var i = 0; i < shapePoints.length; i++) {

			var tmp = [];
			tmp.push(parseFloat(shapePoints[i].childNodes[1].childNodes[0].nodeValue));
			tmp.push(parseFloat(shapePoints[i].childNodes[0].childNodes[0].nodeValue));
			routePoints[i] = tmp;
		}

		//routePoints = quickFix();

		var newGeoObj = {};
		newGeoObj["type"] = "LineString";
		newGeoObj["coordinates"] = routePoints;

		//Transform the points to points on our map.
		routeGeom = new ol.geom.LineString(newGeoObj.coordinates).transform('EPSG:4326','EPSG:3857');
		routeFeature = new ol.Feature({
			geometry:routeGeom
		})

		//Determine what zoom level should be.
		extentToZoom = routeGeom.getExtent();
		console.log(routeGeom);

		//Add the route points to the vector layer
		vectorSource = new ol.source.Vector({
			features: [routeFeature]
		});

		//Initiate the route as a new vector layer.
		vectorLayer = new ol.layer.Vector({
			source: vectorSource,
			style: styleFunction
		});

		//Add the route as a new layer and display it.
		map.addLayer(vectorLayer);  
		map.getView().fit(extentToZoom,map.getSize());

		//Now that we have all points of our route, get the elevation of each point.
		if(shapePoints.length > 64){
			getElevationData2();
		}else{
			getElevationData();
		}

		//Display the GPX download button for the given route.
		showGPXDownload();
	});

}

// Function to calculate the scale of the map, given the dpi of the screen.
function mapScaleCalc (dpi) {
    var unit = map.getView().getProjection().getUnits();
    var resolution = map.getView().getResolution();
    var inchesPerMetre = 39.37;

    return (inchesPerMetre * dpi) * (resolution * ol.proj.METERS_PER_UNIT[unit]);
}

// Determine what zoom level to use.
function getMapZoom(mapScale){
	var mapZoom = {
		221871572: 1,
		110935786: 2,
		55467893: 3,
		27733946: 4,
		13866973: 5,
		6933486: 6,
		3466743: 7,
		1733371: 8,
		866685: 9,
		433342: 10,
		1216671: 11,
		108335: 12,
		54167: 13,
		27083: 14,
		13541: 15,
		6770: 16,
		3385: 17,
		1692: 18
	}

	return mapZoom[mapScale];
}

// Clear all routes from the map.
function clearRoute(){
	map.removeLayer(vectorLayer);
}

// Clear all childNodes of given DivId.
function clearDiv(divId) {
	var results = document.getElementById(divId);
	while (results.childNodes[0]) {
	  results.removeChild(results.childNodes[0]);
	}
}

// Set the vehicle type to either "Car" or "Walking".
function setVehicleType(pickedVehicleType){
  console.log("vehicleType :: "+vehicleType);
  vehicleType = pickedVehicleType;
  console.log("vehicleType :: "+vehicleType);

  return vehicleType;
}

// Show only the start input.
function showStartOnly(){
	var finishDiv = document.getElementById('routeSearchbar');
	var optionsFooter = document.getElementById('optionsFooter');

	finishDiv.setAttribute('class', 'd-none');
	optionsFooter.setAttribute('class', 'd-none');
}

// Show only the finish input.
function showFinishOnly(){
	var startDiv = document.getElementById('searchbar');
	var optionsFooter = document.getElementById('optionsFooter');

	startDiv.setAttribute('class', 'd-none');
	optionsFooter.setAttribute('class', 'd-none');
}

// Show both the start and finish input.
function showStartFinish(){
	var startDiv = document.getElementById('searchbar');
	var finishDiv = document.getElementById('routeSearchbar');
	var optionsFooter = document.getElementById('optionsFooter');

	startDiv.setAttribute('class', 'col input-group centre-block');
	finishDiv.setAttribute('class', 'col input-group centre-block');	
	optionsFooter.setAttribute('class', 'row');
}

/*
function quickFix(){
	var tmp1 = [

                [
                    53.450187,
                    -6.157212
                ],
                [
                    53.448379,
                    -6.169444
                ],
                [
                    53.445884,
                    -6.172842
                ],
                [
                    53.445884,
                    -6.172842
                ],
                [
                    53.44849,
                    -6.180333
                ],
                [
                    53.452087,
                    -6.192032
                ],
                [
                    53.452449,
                    -6.194134
                ],
                [
                    53.453392,
                    -6.203579
                ],
                [
                    53.453392,
                    -6.203579
                ],
                [
                    53.453266,
                    -6.203845
                ],
                [
                    53.453441,
                    -6.204073
                ],
                [
                    53.453941,
                    -6.209478
                ],
                [
                    53.454078,
                    -6.213791
                ],
                [
                    53.454078,
                    -6.213791
                ],
                [
                    53.453861,
                    -6.213901
                ],
                [
                    53.453731,
                    -6.214368
                ],
                [
                    53.454021,
                    -6.214829
                ],
                [
                    53.454242,
                    -6.214725
                ],
                [
                    53.454357,
                    -6.214336
                ],
                [
                    53.454738,
                    -6.213819
                ],
                [
                    53.456066,
                    -6.213019
                ],
                [
                    53.458522,
                    -6.212636
                ],
                [
                    53.459583,
                    -6.212735
                ],
                [
                    53.460342,
                    -6.212993
                ],
                [
                    53.460342,
                    -6.212993
                ],
                [
                    53.460556,
                    -6.213285
                ],
                [
                    53.460475,
                    -6.214279
                ],
                [
                    53.460021,
                    -6.217398
                ],
                [
                    53.459766,
                    -6.21814
                ],
                [
                    53.459873,
                    -6.218246
                ]
	]

	shapePoints = [];
	for (var i = 0; i < tmp1.length; i++) {

			var tmp2 = [];
			tmp2.push(parseFloat(tmp1[i][1]));
			tmp2.push(parseFloat(tmp1[i][0]));
			shapePoints.push(tmp2);
		}

	return shapePoints;
}
*/