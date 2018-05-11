/**
 * DatasetService.
 * 27.04.2018
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "sap/ui/base/Object",
    "com/sap/ml/data/pool/util/Http"
], function(UI5Object, Http) {
    "use strict";

    return UI5Object.extend("com.sap.ml.data.pool.service.CustomerService", {

        /**
         * Constructor.
         */
        constructor: function() {
            this._http = new Http();
        },

        /**
         * Gets all datasets from the backend.
         *
         * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
         */
        getDatasets: function(fSuccess, fError) {
            this._http.performGet("/datasets", fSuccess, fError);
        },
		
		/**
		 * Posts the description of the dataset
		 *
		 * @param sFileName (name of the file)
		 * @param sDescription (description of the dataset)
		 * @param fSuccess (callback in case of success)
         * @param fError (callback in case of error)
		 */
		addDescription: function(sFileName, sDescription, fSuccess, fError) {
			this._http.performPost("/addDescription", {
				"file_name": sFileName,
				"file_description": sDescription
			}, fSuccess, fError);
		},
		
		/**
		 * Deletes the dataset specified.
		 *
		 * @param sId (id of dataset to be deleted)
		 * @param fSuccess (callback in case of success)
		 * @param fError (callback in case of error)
		 */
		deleteDataset: function(sId, fSuccess, fError) {
			this._http.performDelete("/dataset/" + sId, fSuccess, fError);
		}
    });
});