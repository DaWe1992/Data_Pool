/**
 * UploadController.
 * 27.04.2018
 *
 * Update/Change-Log:
 * 26.07.2018: Changed upload file name: Added prefix "AOA_<timestamp>__"
 *
 * 27.07.2018: Added busy indicator while uploading
 *
 * 13.08.2018: Added title for the data set
 *
 * 27.08.2018: Added data set category
 *
 * 28.08.2018: Added guided category input
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
	"com/sap/ml/data/pool/controller/BaseController",
	"com/sap/ml/data/pool/service/AdminService",
	"com/sap/ml/data/pool/service/DatasetService",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(BaseController, AdminService, DatasetService, JSONModel, MessageToast, MessageBox) {
	"use strict";
	
	var self;

	return BaseController.extend("com.sap.ml.data.pool.controller.Upload", {
		
		/**
		 * onInit function.
		 */
		onInit: function() {
			self = this;
	
			// guided category input
			self._getCategories(function(aData) {			
				self.getView().byId("categoryInput").setModel(
					new JSONModel(aData)
				);
			});
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
				var oInputTitle = oView.byId("titleInput");
				var oInputCategory = oView.byId("categoryInput");
				
				var sFileName = oFileUploader.getValue();
				
				// check if valid file was selected
				if(!(sFileName && oInputTitle.getValue())) {
					MessageToast.show(
						self.getTextById("Upload.error.no.file.selected.no.title")
					);
					return;
				}
				
				var sFileName = "AOA_" + Date.now() + "_1_" + sFileName;
				
				oView.byId("uploadPage").setBusy(true);
				
				// file was selected and user is authorized...
				var oTextAreaDescription = oView.byId("descriptionTextArea");
				
				new DatasetService().addDataSetInfo(
					sFileName,
					oInputTitle.getValue(),
					oInputCategory.getValue(),
					oTextAreaDescription.getValue(),
					function() {}, function() {}
				);
				
				// upload file (including renaming)
				oFileUploader.setUploadUrl("/dataset/" + sFileName);
				oFileUploader.upload();
			});
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
			oView.byId("titleInput").setValue("");
			oView.byId("categoryInput").setValue("");
			oView.byId("descriptionTextArea").setValue("");
			oView.byId("uploadPage").setBusy(false);
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
		},
		
		/**
		 * Gets the list of all categories.
		 *
		 * @param fCallback
		 */
		_getCategories: function(fCallback) {
			new DatasetService().getCategories(
			function(res) {
				fCallback(res.data)
			}, function(res) {
				MessageBox.error(self.getTextById("Misc.error.data.load"));
			});
		},
	});
});