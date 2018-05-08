/**
 * Routes dataset.
 * 27.04.2018
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

"use strict";

// import necessary modules
var fs 				= require("fs");
var path			= require("path");
var rl 				= require("readline");
var busboy 			= require("connect-busboy"); 

// own modules
var config 			= require("../config.js");
var isAuthenticated = require("../passport/isAuthenticated.js");

// ==============================================================

module.exports = function(oApp) {

    /**
     * Returns a list of all datasets.
     *
     * @name /datasets
     */
    oApp.get("/datasets", isAuthenticated, function(oReq, oRes) {
		fs.readdir(config.app.dataset_root_path, function(oErr, aFiles) {
			var aResult = new Array()
			
			// create a reader for the descriptions.txt file
			var reader = rl.createInterface({
				input: fs.createReadStream(config.app.dataset_description_path)
			});
			
			// a line was read
			reader.on("line", function(sLine) {
				var aTokens = sLine.split("***");
				aResult.push({
					"file_id": aTokens[0],
					"file_name": aTokens[1],
					"file_description": aTokens[2]
				});
			});
			
			// finished reading the file
			reader.on("close", function(){
				return oRes.status(200).json({
					"data": aResult
				});
			});
		});
	}),
	
	/**
     * Downloads file specified.
     *
     * @name /datasets/:file_name
	 * @param file_name (obligatory)
     */
	oApp.get("/datasets/:file_name", isAuthenticated, function(oReq, oRes) {
		var sFileName = oReq.params.file_name;
		var sPath = path.join(config.app.dataset_root_path, sFileName);
		// statistics about file
		var oStat = fs.statSync(sPath);
		
		oRes.writeHead(200, {
			"Content-Type": "application/zip", // it is a *.zip file
			"Content-Length": oStat.size,
			"Content-disposition": "attachment; filename=dataset.zip"
		});
		
		// pipe result into response
		fs.createReadStream(sPath).pipe(oRes);
	}),
	
	/**
	 * Posts a new dataset to the server.
	 *
	 * @name /dataset
	 */
	oApp.post("/dataset", isAuthenticated, function(oReq, oRes) {
		oReq.pipe(oReq.busboy);
	
		oReq.busboy.on("file", function(sFieldname, oFile, sFilename) {
			// if a new file arrives => create write stream
			var oWriteStream = fs.createWriteStream(
				path.join(config.app.dataset_root_path, sFilename)
			);
			
			oFile.pipe(oWriteStream);
			oWriteStream.on("close", function() {
				oRes.redirect("back");
			});
		});
	});
	
	/**
	 * Posts a new dataset description to the server.
	 *
	 * @name /addDescription
	 */
	oApp.post("/addDescription", isAuthenticated, function(oReq, oRes) {
		var sFileName = oReq.body.file_name;
		var sDescription = oReq.body.file_description;
		
		fs.appendFile(config.app.dataset_description_path,
		"\n" + sFileName + "***" + sDescription, function(oErr) {/* DO NOTHING */});
	});
};