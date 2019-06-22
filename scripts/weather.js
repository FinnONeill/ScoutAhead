// Get the weather at given Lat, Lon.
function getWeather(selectedLat, selectedLon, resultId){
	var baseUrl = "https://api.openweathermap.org/data/2.5/forecast?";
	var format = "&mode=xml";
	var units = "&units=metric";
	var urlLat = "lat="+selectedLat;
	var urlLon = "&lon="+selectedLon;
	var apiKey = "&APPID="+"9abd590cb6bb1bd143f152b550089560";

	var url = baseUrl+urlLat+urlLon+format+units+apiKey;

	httpGetAsync(url, function(urlThingy){

		// All weather information we want to display.
		var temp = [];
		var tempHigh = [];
		var perc = [];
		var wind = [];
		var windDir = [];
		var date = [];
		var time = [];
		var dateTime = [];
		var icon = [];
		var weatherLocation = "";
		var cloudCover = [];
		console.log(url);

		var xmlDoc = $.parseXML( urlThingy ),
		$xml = $( xmlDoc ),
		$temp = $xml.find('temperature');
		$temp.each(function(index, element) {
			if(element.attributes["value"]){
				temp.push(element.attributes["value"].value);
				tempHigh.push(element.attributes["max"].value);
			}
		})

		$perc = $xml.find('precipitation');
		$perc.each(function(index, element) {
			if(element.attributes["value"]){
				perc.push(element.attributes["value"].value);	
			}
		})

		$wind = $xml.find('windSpeed');
		$wind.each(function(index, element) {
			if(element.attributes["mps"]){
				//Convert M/S to Km/Hr
				var tmp = element.attributes["mps"].value;
				tmp = tmp * 18;
				tmp = tmp / 5;
				wind.push(tmp);
			}
		})

		$windDir = $xml.find('windDirection');
		$windDir.each(function(index, element) {
			if(element.attributes["code"]){
				windDir.push(element.attributes["code"].value);
			}
		})

		$dateTime = $xml.find('time');
		$dateTime.each(function(index, element) {
			if(element.attributes["from"]){
				var year, month, day, hours, minutes, seconds;
				year = parseInt(element.attributes["from"].value.substring(0,4));
				month = parseInt(element.attributes["from"].value.substring(5,7));
				day = parseInt(element.attributes["from"].value.substring(8,10));
				hours = parseInt(element.attributes["from"].value.substring(11,13));

				dateTime.push(new Date(year, month-1, day, hours, 0, 0, 0));
			}
		})

		$icon = $xml.find('symbol');
		$icon.each(function(index, element) {
			if(element.attributes["var"]){
				icon.push(element.attributes["var"].value);
			}
		})

		$cloudCover = $xml.find('clouds');
		$cloudCover.each(function(index, element) {
			if(element.attributes["all"]){
				cloudCover.push(element.attributes["all"].value);
			}
		})

		// Get name of location weather was retrieved from.
		weatherLocation = xmlDoc.getElementsByTagName("name")[0].childNodes[0].nodeValue;

		// Display the weather
		displayWeather(temp,tempHigh,perc,wind,windDir,dateTime,icon,cloudCover,weatherLocation,resultId);
	});
}

function displayWeather(temp,tempHigh,perc,wind,windDir,dateTime,icon,cloudCover,weatherLocation,resultId){
	clearWeather();

	var resultList = document.getElementById('weather');

	var weatherLink = document.createElement('a');
	weatherLink.setAttribute('href', '#');
	weatherLink.setAttribute('class', 'list-group-item list-group-item-action flex-column align-items-start');
	weatherLink.setAttribute('id', 'weatherCard');

	var weatherDiv = document.createElement('div');
	weatherDiv.setAttribute('class', 'd-flex w-100 justify-content-between');

	var weatherH5 = document.createElement('h5');
	weatherH5.setAttribute('class', 'mb-1 text-capitalize');
	weatherH5.setAttribute('id', 'weatherAreaName');

	var weatherName = document.createTextNode("Weather - "+weatherLocation);

	var buttonAttr = document.createElement('div');
	buttonAttr.setAttribute('class', 'text-center');
	buttonAttr.setAttribute('data-toggle', 'buttons');

	var tempButton = document.createElement('button');
	tempButton.setAttribute('class', 'btn btn-outline-dark btn-sm');
	tempButton.setAttribute('onclick', 'showTemp()');
	tempButton.appendChild(document.createTextNode("Temperature"));
	buttonAttr.appendChild(tempButton);

	var percButton = document.createElement('button');
	percButton.setAttribute('class', 'btn btn-outline-dark btn-sm');
	percButton.setAttribute('onclick', 'showPrec()');
	percButton.appendChild(document.createTextNode("Precipitation"));
	buttonAttr.appendChild(percButton);

	var windButton = document.createElement('button');
	windButton.setAttribute('class', 'btn btn-outline-dark btn-sm');
	windButton.setAttribute('onclick', 'showWind()');
	windButton.appendChild(document.createTextNode("Wind"));
	buttonAttr.appendChild(windButton);

	var filter_div = document.createElement('div');
	filter_div.setAttribute('id', 'filter_div');

	var chart_div = document.createElement('div');
	chart_div.setAttribute('id', 'chart_div');
	chart_div.setAttribute('class', "text-center");

	var buttonDay_div = document.createElement('div');
	buttonDay_div.setAttribute('id', 'buttonDay_div');
	buttonDay_div.setAttribute('class', "text-center");

	weatherH5.appendChild(weatherName);
	weatherDiv.appendChild(weatherH5);
	weatherLink.appendChild(weatherDiv);
	weatherLink.appendChild(buttonAttr);
	weatherLink.appendChild(filter_div);
	weatherLink.appendChild(chart_div);
	weatherLink.appendChild(buttonDay_div);
	resultList.appendChild(weatherLink);

	drawWeatherChart(temp,tempHigh,perc,wind,windDir,dateTime,icon,cloudCover,weatherLocation);
}



function drawWeatherChart(temp,tempHigh,perc,wind,windDir,dateTime,icon,cloudCover){
	google.charts.load('current', {'packages':['line', 'controls']});
	google.charts.setOnLoadCallback(drawChart);

	function drawChart() {
		// Create our data table.
        var data = new google.visualization.DataTable();

		data.addColumn('datetime', 'Date');
		data.addColumn('number','Temperature');
		data.addColumn('number','Precipitation');
		data.addColumn('number', 'Wind');

		for (var i = 0; i < temp.length; i++) {
			var tmp = parseFloat(perc[i]);

			if(isNaN(tmp)){
				tmp = 0.0;
			}

			data.addRow([dateTime[i], parseFloat(temp[i]), tmp, parseFloat(wind[i])]);
		}

		var formatTemp = new google.visualization.NumberFormat({
			pattern: '#°'
		});

		var formatPrec = new google.visualization.NumberFormat({
			pattern: '# mm'
		});

		var formatWind = new google.visualization.NumberFormat({
			pattern: '# Km/H'
		});

		formatTemp.format(data, 1);
		formatPrec.format(data, 2);
		formatWind.format(data, 3);

        // Create a dashboard.
        var dashboard = new google.visualization.Dashboard(document.getElementById('weather'));
        var view = new google.visualization.DataView(data);

        // Create a range slider;
        var donutRangeSlider = new google.visualization.ControlWrapper({
          'controlType': 'DateRangeFilter',
          'containerId': 'filter_div',
          'options': {
            'filterColumnLabel': "Date"
          }
        });
        document.getElementById('filter_div').setAttribute('class', "d-none");

        var pieChart = new google.visualization.ChartWrapper({
          'chartType': 'AreaChart',
          'containerId': 'chart_div',
          'options': {
            'pieSliceText': 'value',
            'legend': 'top',
            //'colors': ['#7b1315','#6b999f'] 
            'colors': ['darkred','darkblue', 'grey'] 
          }
        });

        dashboard.bind(donutRangeSlider, pieChart);

        showTemp = function(){
        	view.setColumns([0,1,{
		        calc: "stringify",
		        sourceColumn: 1,
		        type: "string",
		        role: "annotation"
	    	}]);

	    	dashboard.draw(view);
	    }

	    showPrec = function(){
	    	view.setColumns([0,2,{
		        calc: "stringify",
		        sourceColumn: 2,
		        type: "string",
		        role: "annotation"
	    	}]);

	    	dashboard.draw(view);
	    }

	    showWind = function(){
	    	view.setColumns([0,3,{
		        calc: "stringify",
		        sourceColumn: 3,
		        type: "string",
		        role: "annotation"
	    	}]);

	    	dashboard.draw(view);
	    }

        // Draw the dashboard.
        dashboard.draw(data);

        var days = getEndOfDayIndexs(dateTime);

        selectDay0 = function(){
        	donutRangeSlider.setState({'lowValue':dateTime[0], 'highValue':dateTime[days[0]]});
        	donutRangeSlider.draw();
        }

        selectDay1 = function(){
        	donutRangeSlider.setState({'lowValue':dateTime[days[0]+1], 'highValue':dateTime[days[1]]});
        	donutRangeSlider.draw();
        }

        selectDay2 = function(){
        	donutRangeSlider.setState({'lowValue':dateTime[days[1]+1], 'highValue':dateTime[days[2]]});
        	donutRangeSlider.draw();
        }

        selectDay3 = function(){
        	donutRangeSlider.setState({'lowValue':dateTime[days[2]+1], 'highValue':dateTime[days[3]]});
        	donutRangeSlider.draw();
        }

        selectDay4 = function(){
        	donutRangeSlider.setState({'lowValue':dateTime[days[3]+1], 'highValue':dateTime[days[4]]});
        	donutRangeSlider.draw();
        } 

        var highLows = getHighLows(temp, tempHigh, dateTime);
        
        addDayButton(getDayName(dateTime[0].getDay()), "selectDay0()",icon[0], highLows[0][0], highLows[1][0]);
        addDayButton(getDayName(dateTime[days[0]].getDay()), "selectDay1()",icon[days[0]+2], highLows[0][1], highLows[1][1]);
		addDayButton(getDayName(dateTime[days[1]].getDay()), "selectDay2()",icon[days[1]+2], highLows[0][2], highLows[1][2]);
		addDayButton(getDayName(dateTime[days[2]].getDay()), "selectDay3()",icon[days[2]+2], highLows[0][3], highLows[1][3]);
        addDayButton(getDayName(dateTime[days[3]].getDay()), "selectDay4()",icon[days[3]+2], highLows[0][4], highLows[1][4]);

        // Create PDF of Weather for download.
		downloadWeatherTable(temp,tempHigh,perc,wind,windDir,dateTime,icon,cloudCover);
        
/*
		var func0, func1, func2, func3, func4, func5;
		for (var i = 0; i < days.length; i++) {
			if(i == 0){
				var tmp = "func"+i;
				tmp.value = function(){
		        	donutRangeSlider.setState({'lowValue':dateTime[i], 'highValue':dateTime[days[i]]});
		        	donutRangeSlider.draw();
		        	console.log("min ::"+dateTime[i]+" max :: "+dateTime[days[i]]);
	       		}

	       		addButton(getDayName(dateTime[i].getDay()), "funcName()",icon[days[i]], tempHigh[i], temp[i]);
	       		console.log(funcName);
	       		console.log(getDayName(dateTime[i].getDay()));
	       		console.log(funcName.name+"()");
	       		console.log(tempHigh[i]);
	       		console.log(temp[i]);

			}else{
				var funcName = "selectDay"+i;
				funcName = function(){
					donutRangeSlider.setState({'lowValue':dateTime[days[i]], 'highValue':dateTime[days[i]]});
	        		donutRangeSlider.draw();
	        		console.log("min ::"+dateTime[days[i]]+" max :: "+dateTime[days[i]]);
				}

				addButton(getDayName(dateTime[i].getDay()), funcName+"()",icon[days[i]], tempHigh[i], temp[i]);
			}
		}
*/	
	}
}

function getEndOfDayIndexs(dateTime){
	var result = [];

	for (var i = 0; i < dateTime.length; i++) {
		if(dateTime[i].getHours() == 0)
			result.push(i);
	}
	console.log("Result :: "+result);
	return result;
}

function addDayButton(dayName, funcName, iconIndex, high, low){
	var weather = document.getElementById('buttonDay_div');

	var weatherButton = document.createElement('button');
	weatherButton.setAttribute('id', dayName);
	weatherButton.setAttribute('class', 'btn btn-outline-dark');
	weatherButton.setAttribute('onclick', funcName);

	var dayNameElem = document.createElement('small');
	dayNameElem.setAttribute('class', "text-muted");
	var dayTxt = document.createTextNode(dayName);
	dayNameElem.appendChild(dayTxt);

	var weatherImg = document.createElement('img');
	weatherImg.setAttribute('src', "./resources/Weather/"+iconIndex+".png");
	weatherImg.setAttribute('class', "mx-auto d-block");

	var highElem = document.createElement('small');
	highElem.setAttribute('style', "font-size: 1.1em;")
	var highTxt = document.createTextNode(high+"°");
	highElem.appendChild(highTxt);

	var lowElem = document.createElement('small');
	lowElem.setAttribute('class', "text-muted");
	var lowTxt = document.createTextNode(low+"°");
	lowElem.appendChild(lowTxt);

	weatherButton.appendChild(dayNameElem);
	weatherButton.appendChild(weatherImg);
	weatherButton.appendChild(highElem);
	weatherButton.appendChild(lowElem);
	weather.appendChild(weatherButton);
}

function getDayName(dayIndex){
	var day = "";

	if(dayIndex == 0) day="Sun";
	if(dayIndex == 1) day="Mon";
	if(dayIndex == 2) day="Tue";
	if(dayIndex == 3) day="Wed";
	if(dayIndex == 4) day="Thurs";
	if(dayIndex == 5) day="Fri";
	if(dayIndex == 6) day="Sat";
	

	return day;
}

function clearWeather(){
	var results = document.getElementById('weather');
	while (results.childNodes[0]) {
	  results.removeChild(results.childNodes[0]);
	}
}

function getHighLows(tempLow, tempHigh, dateTime){
	var dayBreaks = getEndOfDayIndexs(dateTime);
	var outHigh = [];
	var outLow = [];
	var count = 0;

	for (var i = 0; i < dayBreaks.length; i++) {
		outHigh.push(-100);
		outLow.push(100);
	}

	for (var i = 0; i < tempLow.length; i++) {
		tempLow[i] = parseFloat(tempLow[i]);
		tempHigh[i] = parseFloat(tempHigh[i]);

		if(i <= dayBreaks[count]){
			if(tempHigh[i] > outHigh[count]){
				outHigh[count] = tempHigh[i];
			} 
			if(tempLow[i] < outLow[count]){
				outLow[count] = tempLow[i];
			} 
			if(i === dayBreaks[count]){
				count++;
			} 
		}
	}

	return [outHigh, outLow];
}