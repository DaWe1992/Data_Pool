/**
 * Routes dataset.
 * 27.04.2018
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

"use strict";

// import necessary modules
var fs 		= require("fs");
var path	= require("path");
var utils 	= require("../utils/utils.js");
var config 	= require("../config.js");
var busboy 	= require("connect-busboy"); 

module.exports = function(oApp) {

    /**
     * Returns a list of all datasets.
     *
     * @name /datasets
     */
    oApp.get("/datasets", function(oReq, oRes) {
		fs.readdir(config.app.dataset_root_path, function(oErr, aFiles) {
			var resultArr = new Array()
			
			aFiles.forEach(function(oFile) {
				resultArr.push({
					"file_name": oFile
				});
			});
			
			return oRes.status(200).json({
				"data": resultArr
			});
		});
	}),
	
	/**
     * Downloads file specified.
     *
     * @name /datasets/:file_name
	 * @param file_name (obligatory)
     */
	oApp.get("/datasets/:file_name", function(oReq, oRes) {
		var sFileName = oReq.params.file_name;
		var sPath = path.join(config.app.dataset_root_path, sFileName);
		var oStat = fs.statSync(sPath);
		
		oRes.writeHead(200, {
			"Content-Type": "application/zip",
			"Content-Length": oStat.size,
			"Content-disposition": "attachment; filename=dataset.zip"
		});
		
		var oStream = fs.createReadStream(sPath);
		oStream.pipe(oRes);
	}),
	
	/**
	 * Posts a new dataset to the server.
	 *
	 * @name /dataset
	 */
	oApp.post("/dataset"/*, utils.isAdmin*/ ,function(oReq, oRes) {
		var oWriteStream;
		oReq.pipe(oReq.busboy);
	
		oReq.busboy.on("file", function(sFieldname, oFile, sFilename) { 
			oWriteStream = fs.createWriteStream(
				path.join(config.app.dataset_root_path, sFilename)
			);
			oFile.pipe(oWriteStream);
			oWriteStream.on("close", function() {
				oRes.redirect("back");
			});
		});
	});
};