/**
 * Routes data sets update.
 * 24.08.2018
 *
 * Update/Change-Log:
 * 27.08.2018: Rename PUT route '/datasets/:file_id/description' to '/datasets/:file_id/info'
 *
 *			    Added update of category
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

"use strict";

// import necessary modules
var fs 					 = require("fs");
var path				 = require("path");
var esc		  	 		 = require("pg-escape");
var busboy 				 = require("connect-busboy");

// own modules
var config 				 = require("../config.js");
var postgres 			 = require("../postgres/postgres.js");
var isAuthenticatedAdmin = require("../passport/isAuthenticatedAdmin.js");

// ==============================================================

module.exports = function(oApp) {
	
	/**
	 * Posts a new dataset to the server.
	 *
	 * @name /dataset/update/:file_name
	 * @param file_name (optional, used for renaming the file on the server)
	 */
	oApp.post("/dataset/update/:file_name?", isAuthenticatedAdmin, function(oReq, oRes) {
		
		var regex = /^AOA_(.*?)_(.*?)_(.*)$/;
		
		var sFileNameOld = oReq.params.file_name;
		var aMatch = regex.exec(sFileNameOld);
		// update time stamp and increment version
		var sFileNameNew = "AOA_" + Date.now() + "_" + (parseInt(aMatch[2]) + 1) + "_" + aMatch[3];
		
		oReq.pipe(oReq.busboy);
		oReq.busboy.on("file", function(sFieldname, oFile, sFileName) {
			// if a new file arrives => create write stream
			var oWriteStream = fs.createWriteStream(
				path.join(config.app.dataset_root_path, sFileNameNew)
			);
			
			oFile.pipe(oWriteStream);
			oWriteStream.on("close", function() {
				updateDbEntryAndMove(sFileNameOld, sFileNameNew, function(oErr) {
					if(oErr) {return oRes.status(500).json({"err": oErr});}
					oRes.redirect("back");
				});
			});
		});
	});
	
	/**
	 * Updates the information of the data set.
	 *
	 * @name /datasets/:file_id/info
	 * @param file_id (obligatory)
	 */
	oApp.put("/datasets/:file_id/info", isAuthenticatedAdmin, function(oReq, oRes) {
		var sId = oReq.params.file_id;
		var sFileTitle = oReq.body.file_title;
		var sFileCategory = oReq.body.file_category || "Miscellaneous";
		var sDescription = oReq.body.file_description || "No description";
		
		var sSql = esc("UPDATE datasets SET file_description = %Q, file_title = %Q, file_category = %Q WHERE file_id = %Q;",
		sDescription, sFileTitle, sFileCategory, sId);
		
		postgres.query(sSql, function(oErr, oResult) {
			if(oErr) {return oRes.status(500).json({"err": oErr});}
			return oRes.status(200).json({
				"status": "ok"
			});
		});
	});
};

/**
 * Updates database entry and moves the old file into the archive.
 *
 * @param sFileNameOld
 * @param sFileNameNew
 * @param fCallback
 */
function updateDbEntryAndMove(sFileNameOld, sFileNameNew, fCallback) {
	// update database entry
	var sSql = esc("UPDATE datasets SET file_name = %Q WHERE file_name = %Q;",
	sFileNameNew, sFileNameOld);
		
	postgres.query(sSql, function(oErr, oResult) {
		if(oErr) {fCallback(oErr);}
			
		// move old file to the archive
		fs.rename(
			path.join(config.app.dataset_root_path, sFileNameOld),
			path.join(config.app.dataset_root_path, "A", sFileNameOld),
		function(oErr) {
			if(oErr) {fCalllback(oErr);}
			fCallback();
		});
	});
}