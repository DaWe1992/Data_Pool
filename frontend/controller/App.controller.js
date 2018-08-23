/**
 * AppController.
 * 23.04.2018
 *
 * Update/Change-Log:
 * 08.08.2018: Added logs page navigation
 *
 * 23.08.2018: Added disk usage
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "com/sap/ml/data/pool/controller/BaseController",
	"com/sap/ml/data/pool/service/SessionService",
	"com/sap/ml/data/pool/service/AdminService",
	"com/sap/ml/data/pool/service/MiscService",
	"sap/m/MessageBox"
], function(BaseController, SessionService, AdminService, MiscService, MessageBox) {
    "use strict";

    var self;

    return BaseController.extend("com.sap.ml.data.pool.controller.App", {

        /**
         * onInit function.
         */
        onInit: function() {
            self = this;
			
			new AdminService().isAdmin(function() {},
			function() {
				// hide sections for non-admin users
				self.getView().byId("itemNavUpload").setVisible(false);
				self.getView().byId("itemNavLogs").setVisible(false);
				self.getView().byId("itemNavDiskUsage").setVisible(false);
			});
        },
		
		/*
		 * Navigation
		 */
		 
		onPressGoToHome: function(oEvent) {
			this.getRouter().navTo("home");
		},
		
		onPressGoToDatasets: function(oEvent) {
			this.getRouter().navTo("datasets");
		},
		
		onPressGoToUpload: function(oEvent) {
			this.getRouter().navTo("upload");
		},
		
		onPressGoToLogs: function(oEvent) {
			this.getRouter().navTo("logs");
		},
		
		onPressDiskUsage: function(oEvent) {
			self._getDiskUsage(function(data) {
				MessageBox.information("Disk Usage: " + data.used_space_mb + " MB" +
				"\nDisk Usage: " + data.used_space_percent + " %");
			});
		},
		
		onPressLogout: function(oEvent) {
			new SessionService().logout(
                function() {location.reload();},
                function() {location.reload();}
            );
		},
		
		/**
		 * Gets the current disk usage from the server.
		 *
		 * @param fCallback
		 */
		_getDiskUsage: function(fCallback) {
			new MiscService().getDiskUsage(
			function(res) {
				fCallback(res.data);
			}, function(res) {
				MessageBox.error(self.getTextById("Misc.error.data.load"));
			});
		}
	});
});