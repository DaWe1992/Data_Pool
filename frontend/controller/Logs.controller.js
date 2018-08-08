/**
 * LogsController.
 * 08.08.2018
 *
 * Update/Change-Log:
 * -- 
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
	"com/sap/ml/data/pool/controller/BaseController",
	"com/sap/ml/data/pool/service/LogsService",
	"sap/ui/model/json/JSONModel"
], function(BaseController, LogsService, JSONModel) {
	"use strict";
	
	var self;

	return BaseController.extend("com.sap.ml.data.pool.controller.Logs", {

		/**
		 * onInit function.
		 */
		onInit: function() {
			self = this;
			
			this._getLogs(function(aData) {
				var oView = self.getView();
				
				// set model
				oView.setModel(new JSONModel(aData));
			});
		},
		
		/**
         * Gets the list of download logs.
         *
         * @param fCallback
         */
		_getLogs: function(fCallback) {
            new LogsService().getLogs(function(res) {
                fCallback(res.data);
            }, function(res) {
                MessageBox.error(self.getTextById("Misc.error.data.load"));
            });
        }
	});
});