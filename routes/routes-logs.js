/**
 * Routes logs.
 * 08.08.2018
 *
 * Update/Change-Log:
 * 09.08.2018: Changed SQL statement (due to foreign key constraint removal).
 *             No join necessary any more. Also descending order of logs
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
		var sSql = "SELECT * from logs ORDER BY log_id DESC;";
		
		postgres.query(sSql, function(oErr, oResult) {
			if(oErr) {return oRes.status(500).json({"err": oErr});}
			return oRes.status(200).json({
				"data": oResult.rows
			});
		});
	});
};