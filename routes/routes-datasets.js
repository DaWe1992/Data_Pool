/**
 * Created by Daniel on 24.04.2018.
 */

"use strict";

// import necessary modules
var fs 		= require("fs")
var config 	= require("../config.js");

module.exports = function(oApp) {

    /**
     * Returns a list of all datasets.
     *
     * @name /datasets
     */
    oApp.get("/datasets", function(oReq, oRes) {
		fs.readdir(config.app.root_path, function(err, files) {
			return oRes.status(200).json({
                "n_data": files.length,
                "data": files
            });
		});
	})
};