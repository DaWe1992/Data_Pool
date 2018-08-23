/**
 * MiscService.
 * 23.08.2018
 *
 * Update/Change-Log:
 * --
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "sap/ui/base/Object",
    "com/sap/ml/data/pool/util/Http"
], function(UI5Object, Http) {
    "use strict";

    return UI5Object.extend("com.sap.ml.data.pool.service.MiscService", {

        /**
         * Constructor.
         */
        constructor: function() {
            this._http = new Http();
        },

        /**
         * Gets the disk usage.
         *
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        getDiskUsage: function(fSuccess, fError) {
            this._http.performGet("/diskusage", fSuccess, fError);
        }
    });
});