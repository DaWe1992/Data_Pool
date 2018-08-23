/**
 * Routes misc.
 * 22.08.2018
 *
 * Update/Change-Log:
 * -- 
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

"use strict";

// import necessary modules
var fs				= require("fs");
var path 			= require("path");

// own modules
var config 			= require("../config.js");
var isAuthenticated = require("../passport/isAuthenticated.js");

// ==============================================================

module.exports = function(oApp) {

    /**
     * Checks the disk space.
     *
     * @name /diskusage
     */
    oApp.get("/diskusage", isAuthenticated, function(oReq, oRes) {
		fs.readdir(config.app.dataset_root_path, function(oErr, aFileNames) {
			if(oErr) {return oRes.status(500).json({"err": oErr});}
		
			var dUsed = 0;
		
			for(var i = 0; i < aFileNames.length; i++) {
				var sPath = path.join(config.app.dataset_root_path, aFileNames[i]);
				var oStat = fs.statSync(sPath);
			
				dUsed += oStat.size;
			}
			
			return oRes.status(200).json({
				"data": {
					"used_space_mb": (dUsed / 1000000),
					"used_space_percent": 100 * dUsed / 1000000000000
				}
			});
		});
	});
};