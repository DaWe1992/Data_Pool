/**
 * UploadController.
 * 27.04.2018
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
	"com/sap/ml/data/pool/controller/BaseController",
	"com/sap/ml/data/pool/service/AdminService",
	"jquery.sap.global",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(BaseController, AdminService, jQuery, MessageToast, MessageBox) {
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
			var oView = this.getView();
			
			MessageToast.show(
				this.getTextById("Upload.upload.complete")
			);
			
			oView.byId("fileUploader").setValue("");
			
		},

		/**
		 * Uploads the file selected (if authorized).
		 *
		 * @param oEvent
		 */
		handleUploadPress: function(oEvent) {
			var secret = prompt("Please enter the secret...");
			
			this._isAdmin(secret, function(res) {
				// this is only executed if user is authorized
				var oView = self.getView();
				var oFileUploader = oView.byId("fileUploader");
			
				if(!oFileUploader.getValue()) {
					MessageToast.show(
						self.getTextById("Upload.error.no.file.selected")
					);
					return;
				}
				
				// upload file
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
				this.getTextById("Upload.error.no.zip.selected")
			);
		},
		
		/**
		 * Checks if user is admin
		 * and is allowed to visit upload page.
		 *
		 * @param fCallback
		 */
		_isAdmin: function(pw, fCallback) {
			new AdminService().isAdmin(pw, function(res) {
				fCallback(res)
			}, function(res) {
				MessageBox.error(self.getTextById("Upload.error.no.admin"));
			});
		}
	});
});