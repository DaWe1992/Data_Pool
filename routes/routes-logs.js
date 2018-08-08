/**
 * Routes logs.
 * 08.08.2018
 *
 * Update/Change-Log:
 * -- 
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

"use strict";

// import necessary modules
var postgres 			 = require("../postgres/postgres.js");
var isAuthenticatedAdmin = require("../passport/isAuthenticatedAdmin.js");

// ==============================================================

module.exports = function(oApp) {

    /**
     * Returns a list of all datasets.
     *
     * @name /datasets
     */
    oApp.get("/logs", isAuthenticatedAdmin, function(oReq, oRes) {
		var sSql = "SELECT log_id, log_user, datasets.file_name, log_time " +
		"FROM logs INNER JOIN datasets ON logs.file_id = datasets.file_id";
		
		postgres.query(sSql, function(oErr, oResult) {
			if(oErr) {return oRes.status(500).json({"err": oErr});}
			return oRes.status(200).json({
				"data": oResult.rows
			});
		});
	});
};