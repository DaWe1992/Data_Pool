/**
 * Server setup.
 * 27.04.2018
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

"use strict";

// import necessary modules

// express, server, ...
var express  		= require("express");
var path 	 		= require("path");
var http 	 		= require("http");

// authentication and sessions
var passport 		= require("passport");
var flash 	 		= require("connect-flash");
var expressSession 	= require("express-session");

// misc
var favicon  		= require("serve-favicon");
var busboy 	 		= require("connect-busboy");
var bodyParser 		= require("body-parser");
var cookieParser 	= require("cookie-parser");

// own modules
var config 	 		= require("./config.js");
var isAuthenticated = require("./passport/isAuthenticated.js");

// ==============================================================

// create express app
var oApp = express();

// set up postgres tables
require("./postgres/postgres_setup.js")();

// setup jade for authentication
oApp.set("views", path.join(__dirname, "passport", "views"));
oApp.set("view engine", "jade");

// support JSON encoded bodies
oApp.use(bodyParser.json());
// support encoded bodies
oApp.use(bodyParser.urlencoded({extended: true}));
oApp.use(cookieParser());

oApp.use(busboy());

// initialize passport.js
oApp.use(expressSession({
    secret: config.session.secret,
    resave: config.session.resave,
    saveUninitialized: config.session.saveUninitialized,
    cookie: {
        maxAge: config.session.cookieMaxAge
    }
}));
oApp.use(passport.initialize());
oApp.use(passport.session());

require("./passport/initPassport.js")(passport);

// flash middleware to store messages in session
oApp.use(flash());

// include routes
require("./routes/routes-datasets.js")(oApp);
require("./routes/routes-admin.js")(oApp);
require("./routes/routes-authentication.js")(oApp, passport);

// serve favicon
oApp.use(favicon(path.join(__dirname, "frontend", "img", "favicon.ico")));
// serve static files in frontend folder
oApp.use(
    isAuthenticated, express.static(
        __dirname + "/frontend"
    )
);

// bind application to port
http.createServer(oApp).listen(config.app.port, function() {
    console.log("Server listens on port " + config.app.port);
});