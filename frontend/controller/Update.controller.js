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
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function(BaseController, AdminService, DatasetService, MessageToast, MessageBox, JSONModel) {
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
		 * Replaces the file selected (if authorized) with a new file.
		 *
		 * @param oEvent
		 */
		handleUpdatePress: function(oEvent) {
			self._isAdmin(function(res) {
				// this is only executed if user is authorized
				var oView = self.getView();
				var oFileUploader = oView.byId("fileUploader");
				var oSelectFile = oView.byId("selectFileName");

				var sFileName = oSelectFile.getSelectedItem().getText();
				
				// check if valid file was selected
				if(!sFileName) {
					MessageToast.show(
						self.getTextById("Update.error.no.file.selected.no.title")
					);
					return;
				}
				
				// user is authorized...
				//oView.byId("updatePage").setBusy(true);
				
				// upload file (including renaming)
				oFileUploader.setUploadUrl("/dataset/update/" + sFileName);
				oFileUploader.upload();
			});
		},
		
		/**
		 * Is called as soon as the upload is complete.
		 *
		 * @param oEvent
		 */
		handleUploadComplete: function(oEvent) {
			var oView = self.getView();
			
			MessageToast.show(
				self.getTextById("Update.upload.complete")
			);
			
			oView.byId("fileUploader").setValue("");
			oView.byId("uploadPage").setBusy(false);
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
		
		/**
		 * Checks if user is admin.
		 *
		 * @param fCallback
		 */
		_isAdmin: function(fCallback) {
			new AdminService().isAdmin(function(res) {
				fCallback(res)
			}, function(res) {
				MessageBox.error(self.getTextById("Misc.error.no.admin"));
			});
		}
	});
});