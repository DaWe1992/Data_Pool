/**
 * Http.
 * 27.04.2018
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "sap/ui/base/Object"
], function(UI5Object) {
    "use strict";

    return UI5Object.extend("com.sap.ml.data.pool.util.Http", {

        /**
         * Constructor.
         */
        constructor: function() {},

        /**
         * Performs an AJAX GET request.
         *
         * @param sReqUrl (REST endpoint)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        performGet: function(sReqUrl, fSuccess, fError) {
            $.ajax({
                url: sReqUrl,
                method: "GET",
                statusCode: {
                    200: function(res) {fSuccess(res)},
                    201: function(res) {fSuccess(res)},
                    400: function(res) {fError(res)},
                    500: function(res) {fError(res)}
                }
            });
        },

        /**
         * Performs a AJAX POST request.
         *
         * @param sReqUrl (REST endpoint)
         * @param oData (data to be posted)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        performPost: function(sReqUrl, oData, fSuccess, fError) {
            $.ajax({
                url: sReqUrl,
                method: "POST",
                data: oData,
                statusCode: {
                    200: function(res) {fSuccess(res)},
                    201: function(res) {fSuccess(res)},
                    400: function(res) {fError(res)},
                    500: function(res) {fError(res)}
                }
            });
        },

        /**
         * Performs a AJAX DELETE request.
         *
         * @param sReqUrl (REST endpoint)
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        performDelete: function(sReqUrl, fSuccess, fError) {
            $.ajax({
                url: sReqUrl,
                method: "DELETE",
                statusCode: {
                    200: function(res) {fSuccess(res)},
                    201: function(res) {fSuccess(res)},
                    400: function(res) {fError(res)},
                    500: function(res) {fError(res)}
                }
            });
        }
    });
});