/**
 * Postgres connector.
 * 11.05.2018
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

 "use strict";

// import necessary modules
var pg 		= require("pg");
var config 	= require("../config.js");

var oPool = new pg.Pool(config.postgres);

module.exports = {

    /**
     * Queries the database.
	 *
     * @param sSql (sql string to be executed)
     * @param fCallback
     */
    query: function(sSql, fCallback) {
        // execute sql
        oPool.connect(function(oErr, oClient, fDone) {
            oClient.query(sSql, function(oErr, oResult) {
                fDone();
                fCallback(oErr, oResult);
            });
        });
    }
};