/**
 * Middleware isAuthenticated.
 * 03.05.2018
 *
 * Update/Change-Log:
 * --
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

"use strict";

module.exports = function(oReq, oRes, fNext) {
	
	// check is user is authenticated
	if(oReq.isAuthenticated()) {
		return fNext();
    }

	// if the user is not authenticated then redirect to login page
	oRes.redirect("/login");
};
