var elevationData = [];

// Get the elevation data for each point, if there's less than 64points/1024 bytes.
function getElevationData(){
	var baseUrl = "https://api.open-elevation.com/api/v1/lookup\?locations\=";
	var latLongStr = "";

	for (var i = 0; i < shapePoints.length; i++) {
		if(i == shapePoints.length-1){
			latLongStr = latLongStr + shapePoints[i].childNodes[0].childNodes[0].nodeValue + ",";
			latLongStr = latLongStr + shapePoints[i].childNodes[1].childNodes[0].nodeValue;
		}else{
			latLongStr = latLongStr + shapePoints[i].childNodes[0].childNodes[0].nodeValue + ",";
			latLongStr = latLongStr + shapePoints[i].childNodes[1].childNodes[0].nodeValue + "\|";
		}	
	}

	var url = baseUrl + latLongStr;

	httpGetAsync(url, function(urlThingy){
		var jsonDoc = JSON.parse(urlThingy);

		for (var i = 0; i < jsonDoc.results.length; i++) {
			elevationData.push([jsonDoc.results[i].elevation]);
		}

		drawElevationChart();

	})
}

// Get the elevation data for each point, if there's more than 64points/1024 bytes.
function getElevationData2(){
	var baseUrl = "https://api.open-elevation.com/api/v1/lookup\?";
	var latLongStr = "{\"locations\":[";

	for (var i = 0; i < shapePoints.length; i++) {
		if(i == shapePoints.length-1){
			latLongStr = latLongStr + '{\"latitude\":' + shapePoints[i].childNodes[0].childNodes[0].nodeValue + ",";
			latLongStr = latLongStr + '\"longitude\":' + shapePoints[i].childNodes[1].childNodes[0].nodeValue+"}";
		}else{
			latLongStr = latLongStr + '{\"latitude\":' + shapePoints[i].childNodes[0].childNodes[0].nodeValue + ",";
			latLongStr = latLongStr + '\"longitude\":' + shapePoints[i].childNodes[1].childNodes[0].nodeValue+"},";
		}	
	}
	latLongStr = latLongStr+"]}";

	// Use PUT for the larger request to open-elevation.
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            var jsonDoc = JSON.parse(xmlHttp.responseText);
			for (var i = 0; i < jsonDoc.results.length; i++) {
				elevationData.push([jsonDoc.results[i].elevation]);
			}

            drawElevationChart();
            return "200";
        }
        if (xmlHttp.status == 400){
            addErrorResult("No results found");
            return "400";
        }
    	if (xmlHttp.status == 404){
        	addErrorResult("No results found");
        	return "404";
        }
    }

    xmlHttp.open("POST", baseUrl, true); // true for asynchronous 
    xmlHttp.setRequestHeader("Accept", "application/json");
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(latLongStr);
}

// Draw the elevation chart in the corner of the map.
function drawElevationChart(){
    var chartDiv = document.getElementById('elevationChart');
    var chart = new google.visualization.AreaChart(chartDiv);

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Sample');
    data.addColumn('number', 'Elevation');

    for (var i = 0; i < elevationData.length; i++) {
      data.addRow(['', parseInt(elevationData[i])]);
    }

    chart.draw(data, {
      height: 150,
      legend: 'none',
      titleY: 'Elevation (m)'
    });

}