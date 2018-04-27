/**
 * Routes admin.
 * 27.04.2018
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

"use strict";

// import necessary modules
var utils 	= require("../utils/utils.js");

module.exports = function(oApp) {

    /**
     * Checks if a user is admin.
     *
     * @name /isAdmin/:pw
	 * @param pw (password)
     */
    oApp.get("/isAdmin/:pw", function(oReq, oRes) {
		var sPw = oReq.params.pw;
		
		if(sPw == "123456") {
			oRes.status(200).send("Accepted");
		} else {
			oRes.status(400).send("Rejected");
		}
		
		// This code is used for SSO (not possible on linux...)
		/*var user = utils.removeDomainName(oReq.connection.user);
		utils.userInAdminsList(user, function(isAdmin) {
			if(isAdmin) {
				oRes.status(200).send("Accepted");
			} else {
				oRes.status(400).send("Rejected");
			}
		});*/
	})
};