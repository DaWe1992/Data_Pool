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
var postgres 		= require("../postgres/postgres.js");
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
			//var aResult = new Array()
			
			var sSql = "SELECT * FROM datasets;";

			postgres.query(sSql, function(oErr, oResult) {
				if(oErr) {return oRes.status(500).json({"err": oErr});}

				return oRes.status(200).json({
					"data": oResult.rows
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
		
		// insert new dataset into database
		var sSql = "INSERT INTO datasets (file_name, file_description) VALUES ('"
		+ sFileName + "', '" + sDescription + "')";
		
		postgres.query(sSql, function(oErr, oResult) {
			if(oErr) {return oRes.status(500).json({"err": oErr});}

			return oRes.status(200).json({
				"status": "ok"
			});
		});
	});
	
	/**
	 * Deletes a dataset from the server.
	 *
	 * @name /dataset/:file_id
	 * @param file_id (obligatory)
	 */
	oApp.delete("/dataset/:file_id", isAuthenticated, function(oReq, oRes) {
		var sId = oReq.params.file_id;
		
		// get file name of file with id specified
		var sSql = "SELECT file_name FROM datasets WHERE file_id = '"
		+ sId + "';";
		
		postgres.query(sSql, function(oErr, oResult) {
			if(oErr) {return oRes.status(500).json({"err": oErr});}
			
			var sFileName = oResult.rows[0].file_name;
			var sSql = "DELETE FROM datasets WHERE file_id = '"
			+ sId + "';";
			
			// delete dataset entry from database
			postgres.query(sSql, function(oErr, oResult) {
				if(oErr) {return oRes.status(500).json({"err": oErr});}
				
				// delete *.zip file from file system
				fs.unlink(path.join(
					config.app.dataset_root_path, sFileName
				), function(err) {
					if(err) {
						return oRes.status(500).json({
							"err": oErr
						});
						
						// TODO: actually we would have to restore
						// the database entry here...
					}
					return oRes.status(200).json({
						"status": "ok"
					});
				}); 
			});
		});
	});
};