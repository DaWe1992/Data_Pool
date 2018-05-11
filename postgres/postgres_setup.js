/**
 * Postgres setup.
 * 11.05.2018
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

"use strict";

// import necessary modules
var postgres = require("./postgres.js");

module.exports = function() {

    // create table customers
    postgres.query("" +
		"CREATE TABLE IF NOT EXISTS datasets (" +
			"file_id SERIAL PRIMARY KEY, " +
			"file_name VARCHAR(100) NOT NULL, " +
			"file_description TEXT" +
		");",
		function(oErr, oResult) {}
	);
};