/**
 * Postgres setup.
 * 11.05.2018
 *
 * Update/Change-Log:
 * 08.08.2018: Added table definition for 'logs' table
 *
 * 09.08.2018: Removed foreign key constraint
 *
 * 13.08.2018: Added 'file_title' column in 'datasets' table
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
			"file_title VARCHAR(100) NOT NULL, " +
			"file_name VARCHAR(100) NOT NULL UNIQUE, " +
			"file_description TEXT" +
		");",
		function(oErr, oResult) {}
	);
	
	// create table logs
	postgres.query("" +
		"CREATE TABLE IF NOT EXISTS logs (" +
			"log_id SERIAL PRIMARY KEY, " +
			"log_file VARCHAR(100)," +
			"log_user VARCHAR(20), " +
			"log_time timestamp" +
		");",
		function(oErr, oResult) {}
	);
};