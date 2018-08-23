/**
 * UpdateController.
 * 23.08.2018
 *
 * Update/Change-Log:
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
	"com/sap/ml/data/pool/controller/BaseController",
	"com/sap/ml/data/pool/service/AdminService",
	"com/sap/ml/data/pool/service/DatasetService",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function(BaseController, AdminService, DatasetService, MessageBox, JSONModel) {
	"use strict";
	
	var self;

	return BaseController.extend("com.sap.ml.data.pool.controller.Update", {
		
		/**
		 * onInit function.
		 */
		onInit: function() {
			self = this;
			
			self._getDatasets(function(aData) {
				var oView = self.getView();
				
				// set model
				oView.setModel(new JSONModel(aData));
			});
		},
		
		/**
         * Gets the list of datasets.
         *
         * @param fCallback
         */
        _getDatasets: function(fCallback) {
            new DatasetService().getDatasets(function(res) {
				var aData = res.data;
				var aResult = [];
				
				for(var i = 0; i < aData.length; i++) {
					aResult.push({
						"file_id": aData[i].file_id,
						"file_name": aData[i].file_name
					});
				}
				
                fCallback(aResult);
            }, function(res) {
                MessageBox.error(self.getTextById("Misc.error.data.load"));
            });
        },
	});
});