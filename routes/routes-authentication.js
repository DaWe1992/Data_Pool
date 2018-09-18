/**
 * Routes authentication.
 * 03.05.2018
 *
 * Update/Change-Log:
 * --
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

"use strict";

// import necessary modules
var isAuthenticated = require("../passport/isAuthenticated.js");

// ==============================================================

module.exports = function(oApp, passport) {

	/**
     * Shows the login screen.
     *
     * @name /login
     */
	oApp.get("/login", function(oReq, oRes) {
    	// display the login page with flash message (if present)
		oRes.render("login", {
            message: oReq.flash("message")
        });
	});

    /**
     * Handles login post.
     *
     * @name /login
     */
	oApp.post("/login", passport.authenticate("login", {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true
	}));

	/**
	 * Gets the user information.
	 *
	 * @name /me
	 */
	oApp.get("/me", isAuthenticated, function(oReq, oRes) {
		return oRes.status(200).json({
			"data": {
				"username": oReq.user.username
			}
		});
	});

    /**
     * Handles logout post.
     *
     * @name /logout
     */
	oApp.post("/logout", function(oReq, oRes) {
		oReq.logout();
		oRes.redirect("/login");
	});
};
