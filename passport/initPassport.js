/**
 * Setup of passport.
 * 03.05.2018
 *
 * Update/Change-Log:
 * --
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

"use strict";

// import necessary modules
var login = require("./login.js");

module.exports = function(passport) {
	
	passport.serializeUser(function(oUser, done) {
		done(null, oUser);
	});

	passport.deserializeUser(function(oUser, done) {
		done(null, oUser);
	});

    // set up passport strategies for login
    login(passport);
};
