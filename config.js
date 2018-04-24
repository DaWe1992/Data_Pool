/**
 * Created by D062271 on 23.04.2018.
 * This file contains the configuration of the app.
 */

"use strict";

// import necessary modules
var path 	= require("path")

// return config object
module.exports = {
    app: {
        port: 8080,
		root_path: path.join(__dirname, "__DATA__")
    }
};