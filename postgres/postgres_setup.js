/**
 * Postgres setup.
 * 11.05.2018
 *
 * @author D062271
 *
 * Update/Change-Log:
 * 08.08.2018: Added table definition for 'logs' table
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
			"file_name VARCHAR(100) NOT NULL UNIQUE, " +
			"file_description TEXT" +
		");",
		function(oErr, oResult) {}
	);
	
	// create table logs
	postgres.query("" +
		"CREATE TABLE IF NOT EXISTS logs (" +
			"log_id SERIAL PRIMARY KEY, " +
			"file_id INT REFERENCES datasets(file_id), " +
			"log_user VARCHAR(20), " +
			"log_time timestamp" +
		");",
		function(oErr, oResult) {}
	);
};