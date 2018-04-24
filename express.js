/**
 * Created by D062271 on 23.04.2018.
 * This file contains the setup of the server.
 */

"use strict";

// import necessary modules
var path 	= require("path")
var http 	= require("http")
var express = require("express");
var favicon = require("serve-favicon");
var config 	= require("./config.js");

// create express app
var oApp 	= express();

// serve favicon
oApp.use(favicon(path.join(__dirname, "frontend", "img", "favicon.ico")));
// serve static files in frontend(_sapui5) folder
oApp.use(
    express.static(
        __dirname + "/frontend"
    )
);

// include routes
require("./routes/routes-datasets.js")(oApp);

// bind application to port
http.createServer(oApp).listen(config.app.port, function() {
    console.log("Server listens on port " + config.app.port);
});