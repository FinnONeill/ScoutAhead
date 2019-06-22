//First upload attempt
/*function upload(){
	var fileInput = document.getElementById("GpxUpload");
	//fileInput.accept = "gpx/*";
	var file = fileInput.files[0];
	var formData = new FormData();
	formData.append('file', file);

	var xhr = new XMLHttpRequest();
	// Add any event handlers here...
	xhr.open('POST', 'http://localhost:8080/ScoutAheadGpxUpload/', true);
	//request.setRequestHeader('Authorization', 'Basic ' + authorizationBasic);
	xhr.send("username=John&password=Smith&grant_type=password");
	xhr.send(formData);

	return false; // To avoid actual submission of the form
}
*/


//FileReader
//FormData
//http://igstan.ro/posts/2009-01-11-ajax-file-upload-with-pure-javascript.html
/*
var request = new XMLHttpRequest();
request.open('POST', oAuth.AuthorizationServer, true);
request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
request.setRequestHeader('Authorization', 'Basic ' + authorizationBasic);
request.setRequestHeader('Accept', 'application/json');
request.send("username=root&password=&grant_type=password");
*/

/*
function upload(){
	var fileInput = document.getElementById("GpxUpload");
	//fileInput.accept = "gpx/*";
	var file = fileInput.files[0];
	var formData = new FormData();
	formData.append('file', file);

	$.ajaxSetup({
		headers: {
			"Authorization": "Basic " + btoa("root" + ":" + "")
		}
	});

	$.ajax({
        url: "http://localhost:8080/ScoutAheadGpxUpload/", 
        method: "post",
        data: formData,
        contentType: false,
        processData: false,
        success: function () {
            //Firing event if File Upload is completed!  
            alert("Upload Completed");
        },
        error: function (error) { alert("Error"); }

    });
}

*/

function startRead() {
  // obtain input element through DOM

  var file = document.getElementById('GpxUpload').files[0];
  if(file){
    getAsText(file);
  }
}

function getAsText(readFile) {

  var reader = new FileReader();

  // Read file into memory as UTF-16
  reader.readAsText(readFile, "UTF-16");

  // Handle progress, success, and errors
  reader.onprogress = updateProgress;
  reader.onload = loaded;
  reader.onerror = errorHandler;
}

function updateProgress(evt) {
  if (evt.lengthComputable) {
    // evt.loaded and evt.total are ProgressEvent properties
    var loaded = (evt.loaded / evt.total);
    if (loaded < 1) {
      // Increase the prog bar length
      // style.width = (loaded * 200) + "px";
    }
  }
}

function loaded(evt) {
  // Obtain the read file data
  var fileString = evt.target.result;
  // Handle UTF-16 file dump
  if(utils.regexp.isChinese(fileString)) {
    //Chinese Characters + Name validation
  }
  else {
    // run other charset test
  }
  // xhr.send(fileString)
}

function errorHandler(evt) {
  if(evt.target.error.name == "NotReadableError") {
    // The file could not be read
  }
}