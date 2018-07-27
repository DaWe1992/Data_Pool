/**
 * UploadController.
 * 27.04.2018
 *
 * Update/Change-Log:
 * 26.07.2018: Changed upload file name: Added prefix "AOA_<timestamp>__"
 *
 * 27.07.2018: Added busy indicator while uploading
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
	"com/sap/ml/data/pool/controller/BaseController",
	"com/sap/ml/data/pool/service/AdminService",
	"com/sap/ml/data/pool/service/DatasetService",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(BaseController, AdminService, DatasetService, MessageToast, MessageBox) {
	"use strict";
	
	var self;

	return BaseController.extend("com.sap.ml.data.pool.controller.Upload", {
		
		/**
		 * onInit function.
		 */
		onInit: function() {
			self = this;			
		},
		
		/**
		 * Is called as soon as the upload is complete.
		 *
		 * @param oEvent
		 */
		handleUploadComplete: function(oEvent) {
			// TODO: error handling
			var oView = self.getView();
			
			MessageToast.show(
				self.getTextById("Upload.upload.complete")
			);
			
			oView.byId("fileUploader").setValue("");
			oView.byId("descriptionTextArea").setValue("");
			oView.byId("uploadPage").setBusy(false);
		},

		/**
		 * Uploads the file selected (if authorized).
		 *
		 * @param oEvent
		 */
		handleUploadPress: function(oEvent) {
			self._isAdmin(function(res) {
				// this is only executed if user is authorized
				var oView = self.getView();
				var oFileUploader = oView.byId("fileUploader");
				
				var sFileName = "AOA_" + Date.now() + "_" + oFileUploader.getValue();
				
				// check if valid file was selected
				if(!sFileName) {
					MessageToast.show(
						self.getTextById("Upload.error.no.file.selected")
					);
					return;
				}
				
				oView.byId("uploadPage").setBusy(true);
				
				// file was selected and user is authorized...
				var oTextArea = oView.byId("descriptionTextArea");
				var sDescription = oTextArea.getValue();
				
				new DatasetService().addDescription(sFileName, sDescription,
				function() {}, function() {});
				
				// upload file (including renaming)
				oFileUploader.setUploadUrl("/dataset/" + sFileName);
				oFileUploader.upload();
			});
		},
		
		/**
		 * Is called if file type does not match *.zip.
		 *
		 * @param oEvent
		 */
		handleTypeMissmatch: function(oEvent) {
			MessageToast.show(
				self.getTextById("Upload.error.no.zip.selected")
			);
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