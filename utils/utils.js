/**
 * Util functions.
 * 27.04.2018
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
 
"use strict"
 
// import necessary modules
var fs		= require("fs")
var config 	= require("../config.js");
 	
var mod = {}
	
/**
 * Checks if the user is authenticated.
 *	 
 * @param oReq
 * @param oRes
 * @param fNext
 */
mod.isAdmin = function(oReq, oRes, fNext) {
	var user = mod.removeDomainName(oReq.connection.user);
	
	// check if user is listed in admins file
	mod.userInAdminsList(user, function(isAuthenticated) {
		if(isAuthenticated) {
			// continue, user is authenticated
			fNext();
		} else {
			// forbidden
			oRes.sendStatus(403);
		}
	});
}

/**
 * Removes GLOBAL\\ from username.
 *
 * @param user (e.g. GLOBAL\\Dxxxxxx)
 * @return user without GLOBAL\\ prefix
 */
mod.removeDomainName = function(user) {
	// trim "GLOBAL\\"
	if(user.indexOf("GLOBAL\\") !== -1) {
		user = user.substring(7);
	}
	
	return user;
}

/**
 * Reads authenticated users from file
 * and checks whether current user is contained in list.
 *
 * @param user (user to be authenticated)
 * @param fCallback (callback function)
 * @return true (if user authenticated) false (otherwise)
 */
mod.userInAdminsList = function(user, fCallback) {
	fs.readFile(config.app.auth_path, "utf8", function(oErr, sData) {
		var aAdmins = sData.split(";");
		
		if(aAdmins.indexOf(user) > -1) {
			// user is authenticated
			fCallback(true);
		} else {
			// user is not authenticated
			fCallback(false);
		}
	});
}

module.exports = mod;