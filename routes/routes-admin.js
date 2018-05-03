/**
 * Routes admin.
 * 27.04.2018
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

"use strict";

// import necessary modules
var isAuthenticated = require("../passport/isAuthenticated.js");

// ==============================================================

module.exports = function(oApp) {

    /**
     * Checks if a user is admin.
     *
     * @name /isAdmin
     */
    oApp.get("/isAdmin", isAuthenticated, function(oReq, oRes) {
		if(oReq.user.username == "admin") {
			oRes.status(200).send("Accepted");
		} else {
			oRes.status(400).send("Rejected");
		}
	});
};