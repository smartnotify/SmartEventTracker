Smart Event Manager
Copyright © 2012-2015, PyraSolutions LLC. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

Neither the name of PyraSolutions nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

************************************************************************************************************************
*
*      LATEST REVISION: 06/06/2015
*
*      GET STARTED  
*
*	1)	To use our Tracker with our servers, you will need the the proper access codes and links.  At this stage we are releasing this functionality
*		on a beta basis. To request an account, please email team@smartnotify.us and we'll get you setup.
*		+ The website is at: http://www.pyrasolutions.com/newbt/viewdebug.aspx
*
*

Variables you can set:
A) Severity levels:  We let you pick different severity levels (which can then trigger actions on our servers).  While you can set the level to whichever number you want, we currently support the following schema:

- 0=low
- 1=medium
- 2=high
- 3=Critical

B) Debug level:
- 0 = Test Server - Console Logging
- 1 = Save to local storage
- 2 = Send to tracker (the content of the local storage are then sent in one call and stored in the database in one entry so you can review the whole stack that led to the error)
- 3 = shows up as Alert. Only for the bravest souls.


4) How to use the tracker:
* First, add this object to whatever you want to track
var pyraTrackThis = {
	 
	"Content": "We have reached Init App",
	"Title": "Init App Debug",
    "Severity":2,
    "ErrorType":3,
    "Identifier": " " 
};

More information and direct API calls at:  http://smartnotifyapi.azurewebsites.net/swagger/ui/index#!/eventTracker/eventTracker_eventTracker

Identifyier can be anything you would like to use to identify a specific user, or a device.  
If could be a GUID, an Int, a String. Anything that can help you!  Remember that you are responsible for the data you send out so make sure you can use that specific identifier.

*  Then call this method:  PyraSolutionTracker (pyraTrackThis, DebugLevel);
*   Where 
*   --> pyraTrackThis is the object you collected
*   --> DEBUG_LEVEL The debug level you seek.  Note that you can over-ride the default DebugLevel in this call.
***************************************************************************************************************************
*
*							HERE WE GO, GO, GO!
*
***************************************************************************************************************************/

/* jshint -W099 */
/*jshint multistr: true */
/*jshint -W117 */


/****************************************************************************************************************************
*           VARIABLES TO UPDATE
*
* Geolocation:  Make sure you add the Geolocation component (cordova plugin if need be) if you want to track geoloc within the app.
* 
* If you are saving the data on our server, we are expecting a double to be sent.  
* You can also set the values to 0 if needed.
*****************************************************************************************************************************/

var DebugLevel = 1;  // See above for numbering system.
var synchronisationID =  218 ;//This is an individual ID that you get from us. 218 is our demo account and we often reset the data there so don't even think about using it for anything important or you will be quite sad. And we'd hate to see you sad.
var key ='fb090454-e371-4797-a785-8bac0e24e486|hu$pol*S' ;//This is an individual ID that you get from us. 218 is our demo account and we often reset the data there so don't even think about using it for anything important or you will be quite sad. And we'd hate to see you sad.

var myLatitude = 0;
var myLongitude = 0;
    if ("geolocation" in navigator) {
           
        var positionGet = navigator.geolocation.getCurrentPosition(function (position) {
            myLatitude = position.coords.latitude;
            myLongitude = position.coords.longitude;
        },

        function (errorNagGet){
        
        }
        )} ;  //end navigator.geolocation.getCurrentPosition
 



/****************************************************************************************************************************
*           File Specific variables, in the words of John Lennon, let it be
*****************************************************************************************************************************/

var timeStamp ;                     // global placeholders for below. Used to time app. not all webviews support performance.
var performanceStart = 0 ;          // Used for timing of App Run Time
var serviceLocation = "http://smartnotifyapi.azurewebsites.net/";  //Our endpoing.  Please treat it with love and care
var connectionType = "";
var logContent=""; //This will be a string in which we store our bugs.
var speedAware = true; //This is used to only transmit if the connection is fast enough to not impeed the experience of the end-user

var pyraError = {
	"EventDate": " ",
	"Content": " ",
	"Title": " ",
	"LocationPoints": [
	  0,0
	],
	"ConnectionType": " ",
	"DeviceType": " ",
	"Severity": 0,
	"Locator": 0,
	"EventType": 0,
	"DeviceModel": " ",
	"Identifier": " ",
	"Key": " ",

}



//Setting of the timers based on which time trackign is available on the specific web view.
if( window.performance && performance.now ) {
    timeStamp = function() { return performance.now().toFixed(3) ; } ;
}
else {
    performanceStart = Date.now() ; // feeble zero ref for relative time in ms
    timeStamp = function() { return (Date.now() - performanceStart) ; } ;
}
 
 
/*************************************************************************************************************************
* enhancedConsoleDebug  
* --> Where we process the error log and dispatch it to the proper spot.
**************************************************************************************************************************/

function PyraSolutionTracker (pyraTrackThis,DebugLevel){
    GetConnectionType();
    var deviceModel = "";
            try{
                deviceModel = device.model ;
                bugDeviceType=device.platform;
            }
            catch (err) {
                deviceModel = "No device info yet";
                bugDeviceType="no platform";
            }
    
            var pyraError = {
            	"EventDate": new Date().toISOString(),
            	"Content": pyraTrackThis.Content,
            	"Title": pyraTrackThis.Title,
            	"LocationPoints": [
				  myLatitude, myLongitude
            	],
            	"ConnectionType": connectionType,
            	"DeviceType": bugDeviceType,
            	"Severity": pyraTrackThis.Severity,
            	"Locator": synchronisationID,
            	"EventType": pyraTrackThis.ErrorType,
            	"DeviceModel": deviceModel,
            	"Identifier": pyraTrackThis.Identifier,
            	"Key": key,

            }


    if (DebugLevel ===0){  //We console log
            printToConsole(pyraError);
    
    }
    else if (DebugLevel===1){ //We send to the tracker
        SaveToLocalLog(pyraError);
    }
    else if (DebugLevel===2){
        SaveToBugTracker(pyraError);
    }
    else if (DebugLevel===3){
        alert(pyraError.Content);
    }
}

function printToConsole (pyraError) {
    
    console.log("*********"+pyraError.Title+" at: ("+pyraError.TimeStamp+") ******");
    console.dir(pyraError);
    console.log("********* END : "+pyraError.Title+"******");
    
}


/*************************************************************************************************************************
* SaveToLocalLog  
* --> Saving to local storage.  Gets cleared when sent to the server.
**************************************************************************************************************************/


function SaveToLocalLog(pyraError) {
	    
	var old = localStorage.getItem('pyraTrack');
        if (old === null) {
            localStorage.setItem('pyraTrack',  JSON.stringify(pyraError));
        }
        else {
            localStorage.setItem('pyraTrack', old + "," + JSON.stringify(pyraError));
        }
	
}


/*************************************************************************************************************************
* SaveToBugTracker 
*
*  --> Send the log content up to our server for analysis
**************************************************************************************************************************/

function SaveToBugTracker(pyraError) {

	//1. get from storage (if any)
	var old = localStorage.getItem('pyraTrack');
	if (old === null) {
		//do Nothing.
		pyraError.ErrorStream = " ";
	}
	else {
		//set log past
		pyraError.ErrorStream = old;
	}

	// You REALLY want async = true.
	// Otherwise, it'll block ALL execution waiting for server response.
	var async = true;

	var request = new XMLHttpRequest();
	request.onload = function () {
		// You can get all kinds of information about the HTTP response.
		var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
		if (status == 200) {
			localStorage.removeItem('pyraTrack');
		}
		else {
			//Data was not saved. We are clearing the buglog at the moment
			//though better practice will be to store and then start a silent updater
			//in the background
			localStorage.removeItem('pyraTrack');
		}

		var data = request.responseText; // Returned data, e.g., an HTML document.

	}

	request.open("POST",
		serviceLocation + "/api/eventTracker/eventTracker",
		async);

	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	pyraError = JSON.stringify(pyraError)
	request.send(pyraError);
}

/*************************************************************************************************************************
* Helpers' methods  .  You can update and use your own if you wish.
*
* 
**************************************************************************************************************************/

function GetConnectionType() {
	
	try {
		var networkState = navigator.connection.type,states = {};
		states[Connection.UNKNOWN] = 'Unknown';
		states[Connection.ETHERNET] = 'Ethernet';
		states[Connection.WIFI] = 'WiFi';
		states[Connection.CELL_2G] = 'Cell 2G';
		states[Connection.CELL_3G] = 'Cell 3G';
		states[Connection.CELL_4G] = 'Cell 4G';
		states[Connection.NONE] = 'No network';
		connectionType = states[networkState];
        //here we set speedaware
        if (connectionType==='WiFi' || connectionType==='Ethernet' || connectionType==='Cell 4G'|| connectionType==='Cell 3G'){
        speedAware = true;    
        }
        
            else
                speedAware = false;
	}
	catch (errn) {
		connectionType = "Unknown: " + errn.Message;
	}
	return connectionType;
}

function GetLongitude() {
	var longitude = " ";
	try {
		var position = navigator.geolocation.getCurrentPosition;
		longitude = position.coords.longitude;
	}
	catch (err) {
		longitude = "Unknown: " + err.Message;
	}
	return longitude;
}

function GetDeviceID() {
	var deviceID = " ";
	try {
		deviceID = device.uuid;
	}
	catch (err) {
		deviceID = "Unknown";
	}
	return deviceID;
}

function PrepareDeviceData() {
	var deviceData = " ";
	try {
		deviceData = ""; 
	}
	catch (err) {
		deviceData = "Unknown";
	}
	return deviceData;
}

/**************************************************************************************************************************
*
*			TEST CASES
*
***************************************************************************************************************************/

function testEventReporter() {
	var pyraError = {
		"EventDate": new Date().toISOString(),
		"Content": "This is the content of my debug issue",
		"Title": "Test of the debug system",
		"LocationPoints": [
		   myLongitude, myLatitude
		],
		"ConnectionType": "Wifi",
		"DeviceType": "Laptop",
		"Severity": "1",
		"Locator": synchronisationID,
		"EventType": "2",
		"DeviceModel": "ZZ 45",
		"Identifier": "Joe's device",
		"Key": key,

	}
	var e = document.getElementById("ddlDebugLevel");

	DebugLevel = e.options[e.selectedIndex].value;
	DebugLevel = parseInt(DebugLevel, 10);
	console.log("Debug level is: " + DebugLevel);
	PyraSolutionTracker(pyraError, DebugLevel);
}
