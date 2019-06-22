function createGPX(){
	var xmlDoc = document.implementation.createDocument(null, "xml");

	var docBody = document.createElementNS('http://www.w3.org/1999/xhtml', 'gpx');
	docBody.setAttribute('version', "1.0");
	docBody.setAttribute('creator', "http://scoutAhead.ie");
	docBody.setAttribute('xmlns', "http://www.topografix.com/GPX/1/1");
	docBody.setAttribute('xmlns:xsi', "http://www.w3.org/2001/XMLSchema-instance");
	docBody.setAttribute('xsi:schemaLocation', "http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd");

	var name = document.createElement('name');
	name.appendChild(document.createTextNode(start.value+" to "+finish.value+" GPX"));

	var metadata = document.createElement('metadata');
	var boundsElem = document.createElement('bounds');
	console.log("bounds :: "+bounds);
	boundsElem.setAttribute('minlat', bounds[1][1]);
	boundsElem.setAttribute('minlon', bounds[1][0]);
	boundsElem.setAttribute('maxlat', bounds[0][1]);
	boundsElem.setAttribute('maxlon', bounds[0][0]);
	metadata.appendChild(boundsElem);

	var trk = document.createElement('trk');

	var trkName = document.createElement('name');
	trkName.appendChild(document.createTextNode(start.value+" to "+finish.value));

	var trkseg = document.createElement('trkseg');
	var d = new Date();
	var timestamp = d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+"T"+d.getHours()+":"+d.getSeconds()+":"+d.getMilliseconds();
	for (var i = 0; i < shapePoints.length; i++) {
		var trkpt = document.createElement("trkpt");
		trkpt.setAttribute('lat', parseFloat(shapePoints[i].childNodes[0].childNodes[0].nodeValue));
		trkpt.setAttribute('lon', parseFloat(shapePoints[i].childNodes[1].childNodes[0].nodeValue));

		var elevTmp = document.createElement("ele");
		elevTmp.appendChild(document.createTextNode(elevationData[i]));

		var timeTmp = document.createElement("time");
		timeTmp.appendChild(document.createTextNode(timestamp));

		trkpt.appendChild(elevTmp);
		trkpt.appendChild(timeTmp);
		trkseg.appendChild(trkpt);
	}

	trk.appendChild(name);
	trk.appendChild(trkseg);
	docBody.appendChild(metadata);
	docBody.appendChild(trk);
	xmlDoc.documentElement.appendChild(docBody);

	var serializer = new XMLSerializer();
	var xmlString = serializer.serializeToString(xmlDoc);

	xmlString = xmlString.substring(5,xmlString.length);
	xmlString = xmlString.substring(0, xmlString.length-6);

	xmlProlog = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
	xmlString = xmlProlog.concat(xmlString);

    download(start.value+" to "+finish.value+".gpx", xmlString);
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function showGPXDownload() {
	var gpxDiv = document.getElementById('GPXDiv');
	gpxDiv.setAttribute('class', 'list-group-item list-group-item-action flex-column align-items-start text-center');
}

function hideGPXDownload() {
	var gpxDiv = document.getElementById('GPXDiv');
	gpxDiv.setAttribute('class', 'd-none');
}