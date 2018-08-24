/**
 * Routes data sets upload.
 * 27.04.2018
 *
 * Update/Change-Log:
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
	 * @name /dataset/:file_name
	 * @param file_name (optional, used for renaming the file on the server)
	 */
	oApp.post("/dataset/:file_name?", isAuthenticatedAdmin, function(oReq, oRes) {
		oReq.pipe(oReq.busboy);
	
		oReq.busboy.on("file", function(sFieldname, oFile, sFileName) {
			sFileName = oReq.params.file_name ? oReq.params.file_name : sFileName;
			// if a new file arrives => create write stream
			var oWriteStream = fs.createWriteStream(
				path.join(config.app.dataset_root_path, sFileName)
			);
			
			oFile.pipe(oWriteStream);
			oWriteStream.on("close", function() {
				oRes.redirect("back");
			});
		});
	});
	
	/**
	 * Posts a new dataset description and title to the server.
	 *
	 * @name /addDescription
	 */
	oApp.post("/addDescription", isAuthenticatedAdmin, function(oReq, oRes) {
		var sFileName = oReq.body.file_name;
		var sFileTitle = oReq.body.file_title;
		var sDescription = oReq.body.file_description || "No description";
		
		// insert new dataset into database
		var sSql = esc("INSERT INTO datasets (file_name, file_title, file_description) VALUES (%Q, %Q, %Q);",
		sFileName, sFileTitle, sDescription);
		
		postgres.query(sSql, function(oErr, oResult) {
			if(oErr) {return oRes.status(500).json({"err": oErr});}

			return oRes.status(200).json({
				"status": "ok"
			});
		});
	});
};