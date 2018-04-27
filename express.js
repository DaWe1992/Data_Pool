/**
 * Server setup.
 * 27.04.2018
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

"use strict";

// import necessary modules
var path 	 = require("path");
var http 	 = require("http");
var express  = require("express");
//var nodeSSPI = require("node-sspi");
var config 	 = require("./config.js");
var favicon  = require("serve-favicon");
var busboy 	 = require("connect-busboy"); 

// create express app
var oApp 	= express();

oApp.use(busboy());

// serve favicon
oApp.use(favicon(path.join(__dirname, "frontend", "img", "favicon.ico")));
// serve static files in frontend(_sapui5) folder
oApp.use(
    express.static(
        __dirname + "/frontend"
    )
);

// This code is used for SSO (not possible on linux...)
// authentication using single-sign-on (SSO)
/*oApp.use(function(oReq, oRes, fNext) {
	var nodeSSPIObj = new nodeSSPI({
		retrieveGroups: false
	});
	
	nodeSSPIObj.authenticate(oReq, oRes, function(oErr) {
		oRes.finished || fNext();
	});
});*/

// include routes
require("./routes/routes-datasets.js")(oApp);
require("./routes/routes-admin.js")(oApp);

// bind application to port
http.createServer(oApp).listen(config.app.port, function() {
    console.log("Server listens on port " + config.app.port);
});