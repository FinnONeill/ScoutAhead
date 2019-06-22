function downloadWeatherTable(temp,tempHigh,perc,wind,windDir,dateTime,icon,cloudCover){

	var weatherDiv = document.getElementById('weatherCard');

	var chartDL = document.createElement('button');
	chartDL.setAttribute('onclick', 'downloadChart()');
	chartDL.setAttribute('class', 'btn btn-outline-dark btn-small');
	chartDL.setAttribute('id', 'weatherDownloadBtn');
	chartDL.setAttribute('data-toggle', 'tooltip');
	chartDL.setAttribute('data-placement', 'right');
	chartDL.setAttribute('title', "Download detailed weather forcast");

	var weatherTxt = document.createElement('strong');
	weatherTxt.appendChild(document.createTextNode("Weather"));

	var dlSpan = document.createElement('span');
	var dlImg = document.createElement('img');
	dlImg.setAttribute('src', './resources/Icons/glyphicons-182-download-alt.png');
	dlImg.setAttribute('style', 'margin-bottom: 5px; margin-left: 2px; max-width: 30%; max-height: 30%;');
	dlImg.setAttribute('class', 'img-fluid');

	dlSpan.appendChild(dlImg);
	chartDL.appendChild(weatherTxt);
	chartDL.appendChild(dlSpan);

	var weatherDownloadDiv = document.createElement('div');
	weatherDownloadDiv.setAttribute('class', 'text-center');
	weatherDownloadDiv.setAttribute('style', 'margin-top:12px;')

	weatherDownloadDiv.appendChild(chartDL)
	weatherDiv.appendChild(weatherDownloadDiv);

	downloadChart = function(){

		var dayBreaks = getEndOfDayIndexs(dateTime);

		var columns0 = [];
		var columns1 = [];
		var columns2 = [];
		var columns3 = [];
		var columns4 = [];

		columns0.push('Init:\n'+dateTime[dayBreaks[0]].getDate()+"/"+dateTime[dayBreaks[0]].getMonth()+"/"+dateTime[dayBreaks[0]].getFullYear());
		columns1.push('Init:\n'+dateTime[dayBreaks[0]].getDate()+"/"+dateTime[dayBreaks[0]].getMonth()+"/"+dateTime[dayBreaks[0]].getFullYear());
		columns2.push('Init:\n'+dateTime[dayBreaks[0]].getDate()+"/"+dateTime[dayBreaks[0]].getMonth()+"/"+dateTime[dayBreaks[0]].getFullYear());
		columns3.push('Init:\n'+dateTime[dayBreaks[0]].getDate()+"/"+dateTime[dayBreaks[0]].getMonth()+"/"+dateTime[dayBreaks[0]].getFullYear());
		columns4.push('Init:\n'+dateTime[dayBreaks[0]].getDate()+"/"+dateTime[dayBreaks[0]].getMonth()+"/"+dateTime[dayBreaks[0]].getFullYear());

		if(dayBreaks[0] != 0){
			for (var i = 0; i < dayBreaks[0]; i++) {
				columns0.push(getDayName(dateTime[i].getDay())+"\n"+dateTime[i].getDate()+"th\n"+dateTime[i].getHours()+"h");
			}
		}
		
		for (var i = dayBreaks[0]; i <= dayBreaks[1]; i++) {
			columns1.push(getDayName(dateTime[i].getDay())+"\n"+dateTime[i].getDate()+"th\n"+dateTime[i].getHours()+"h");
		}
		for (var i = dayBreaks[1]; i <= dayBreaks[2]; i++) {
			columns2.push(getDayName(dateTime[i].getDay())+"\n"+dateTime[i].getDate()+"th\n"+dateTime[i].getHours()+"h");
		}
		for (var i = dayBreaks[2]; i <= dayBreaks[3]; i++) {
			columns3.push(getDayName(dateTime[i].getDay())+"\n"+dateTime[i].getDate()+"th\n"+dateTime[i].getHours()+"h");
		}
		console.log("datetime :: "+dateTime[i].getDay()-1);
		for (var i = dayBreaks[3]; i <= dayBreaks[4]; i++) {
			columns4.push(getDayName(dateTime[i].getDay())+"\n"+dateTime[i].getDate()+"th\n"+dateTime[i].getHours()+"h");
		}

		var tempRow0 = [];
		var tempRow1 = [];
		var tempRow2 = [];
		var tempRow3 = [];
		var tempRow4 = [];

		var percRow0 = [];
		var percRow1 = [];
		var percRow2 = [];
		var percRow3 = [];
		var percRow4 = [];

		var windRow0 = [];
		var windRow1 = [];
		var windRow2 = [];
		var windRow3 = [];
		var windRow4 = [];

		var windDirRow0 = [];
		var windDirRow1 = [];
		var windDirRow2 = [];
		var windDirRow3 = [];
		var windDirRow4 = [];

		if(dayBreaks[0] != 0){
			tempRow0.push('Temperature (°C)');
			percRow0.push('Precipitation (mm/3h)');
			windRow0.push('Wind (km/h)');
			windDirRow0.push('Wind Direction');
		}

		tempRow1.push('Temperature (°C)');
		percRow1.push('Precipitation (mm/3h)');
		windRow1.push('Wind (km/h)');
		windDirRow1.push('Wind Direction');

		tempRow2.push('Temperature (°C)');
		percRow2.push('Precipitation (mm/3h)');
		windRow2.push('Wind (km/h)');
		windDirRow2.push('Wind Direction');

		tempRow3.push('Temperature (°C)');
		percRow3.push('Precipitation (mm/3h)');
		windRow3.push('Wind (km/h)');
		windDirRow3.push('Wind Direction');

		tempRow4.push('Temperature (°C)');
		percRow4.push('Precipitation (mm/3h)');
		windRow4.push('Wind (km/h)');
		windDirRow4.push('Wind Direction');

		if(dayBreaks[0] != 0){
			for (var i = 0; i < dayBreaks[0]; i++) {
				if(perc[i]===undefined){
					tempRow0.push(parseFloat(temp[i]).toFixed(1)+'°');
					percRow0.push('0.0');
					windRow0.push(parseFloat(wind[i]).toFixed(1));
					windDirRow0.push(windDir[i]);
				}else{
					tempRow0.push(parseFloat(temp[i]).toFixed(1)+'°');
					percRow0.push(parseFloat(perc[i]).toFixed(1));
					windRow0.push(parseFloat(wind[i]).toFixed(1));
					windDirRow0.push(windDir[i]);
				}
			}
		}
		
		for (var i = dayBreaks[0]; i <= dayBreaks[1]; i++) {
			if(perc[i]===undefined){
				tempRow1.push(parseFloat(temp[i]).toFixed(1)+'°');
				percRow1.push('0.0');
				windRow1.push(parseFloat(wind[i]).toFixed(1));
				windDirRow1.push(windDir[i]);
			}else{
				tempRow1.push(parseFloat(temp[i]).toFixed(1)+'°');
				percRow1.push(parseFloat(perc[i]).toFixed(1));
				windRow1.push(parseFloat(wind[i]).toFixed(1));
				windDirRow1.push(windDir[i]);
			}
		}
		for (var i = dayBreaks[1]; i <= dayBreaks[2]; i++) {
			if(perc[i]===undefined){
				tempRow2.push(parseFloat(temp[i]).toFixed(1)+'°');
				percRow2.push('0.0');
				windRow2.push(parseFloat(wind[i]).toFixed(1));
				windDirRow2.push(windDir[i]);
			}else{
				tempRow2.push(parseFloat(temp[i]).toFixed(1)+'°');
				percRow2.push(parseFloat(perc[i]).toFixed(1));
				windRow2.push(parseFloat(wind[i]).toFixed(1));
				windDirRow2.push(windDir[i]);
			}
		}
		for (var i = dayBreaks[2]; i <= dayBreaks[3]; i++) {
			if(perc[i]===undefined){
				tempRow3.push(parseFloat(temp[i]).toFixed(1)+'°');
				percRow3.push('0.0');
				windRow3.push(parseFloat(wind[i]).toFixed(1));
				windDirRow3.push(windDir[i]);
			}else{
				tempRow3.push(parseFloat(temp[i]).toFixed(1)+'°');
				percRow3.push(parseFloat(perc[i]).toFixed(1));
				windRow3.push(parseFloat(wind[i]).toFixed(1));
				windDirRow3.push(windDir[i]);
			}
		}
		for (var i = dayBreaks[3]; i <= dayBreaks[4]; i++) {
			if(perc[i]===undefined){
				tempRow4.push(parseFloat(temp[i]).toFixed(1)+'°');
				percRow4.push('0.0');
				windRow4.push(parseFloat(wind[i]).toFixed(1));
				windDirRow4.push(windDir[i]);
			}else{
				tempRow4.push(parseFloat(temp[i]).toFixed(1)+'°');
				percRow4.push(parseFloat(perc[i]).toFixed(1));
				windRow4.push(parseFloat(wind[i]).toFixed(1));
				windDirRow4.push(windDir[i]);
			}
		}


		var rows0 = [tempRow0, percRow0, windRow0, windDirRow0];
		var rows1 = [tempRow1, percRow1, windRow1, windDirRow1];
		var rows2 = [tempRow2, percRow2, windRow2, windDirRow2];
		var rows3 = [tempRow3, percRow3, windRow3, windDirRow3];
		var rows4 = [tempRow4, percRow4, windRow4, windDirRow4];

		var doc = new jsPDF('p', 'pt');
		doc.setFontSize(22);
	    doc.text(document.getElementById('weatherAreaName').innerHTML, 14, 20);
	    doc.setFontSize(12);

		if(dayBreaks[0] != 0){
			doc.autoTable(columns0, rows0, {startY: 30});
			doc.autoTable(columns1, rows1, {startY: doc.autoTable.previous.finalY + 10});
		}else{
			doc.autoTable(columns1, rows1, {startY: 30});
		}
		
		doc.autoTable(columns2, rows2, {startY: doc.autoTable.previous.finalY + 10});
		doc.autoTable(columns3, rows3, {startY: doc.autoTable.previous.finalY + 10});
		doc.autoTable(columns4, rows4, {startY: doc.autoTable.previous.finalY + 10});

		doc.save(document.getElementById('weatherAreaName').innerHTML+'.pdf');
	}

}