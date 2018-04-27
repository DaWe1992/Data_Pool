/**
 * Backend configuration.
 * 27.04.2018
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

"use strict";

// import necessary modules
var path 	= require("path")

// return config object
module.exports = {
    app: {
        port: 8080,
		dataset_root_path: path.join(__dirname, "__DATA__"),
		auth_path: path.join(__dirname, "auth", "admins.txt")
    }
};