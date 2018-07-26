/**
 * Backend configuration.
 * 27.04.2018
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

"use strict";

// import necessary modules
var path = require("path")

// return config object
module.exports = {
    app: {
        port: 8080,
		dataset_root_path: path.join(__dirname, "__DATA__", "datasets") // path.join("/", "mnt", "aoa_share", "__DATA__")
    },
    session: {
        secret: "mySecretKey",
        resave: true,
        saveUninitialized: true,
        cookieMaxAge: 7200000 // delete the session cookie after two hours
    },
	postgres: {
        user: "postgres",
        host: "localhost",
        database: "db_data_pool",
        password: "postgres",
        port: 5432
    }
};