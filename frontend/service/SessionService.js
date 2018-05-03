/**
 * SessionService.
 * 03.05.2018
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "sap/ui/base/Object",
    "com/sap/ml/data/pool/util/Http"
], function(UI5Object, Http) {
    "use strict";

    return UI5Object.extend("com.sap.ml.data.pool.service.SessionService", {

        /**
         * Constructor.
         */
        constructor: function() {
            this._http = new Http();
        },

        /**
         * Logs current user out.
         *
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        logout: function(fSuccess, fError) {
            this._http.performPost("/logout", fSuccess, fError);
        }
    });
});