/**
 * AppController.
 * 23.04.2018
 *
 * Update/Change-Log:
 * 08.08.2018: Added logs page navigation
 *
 * 23.08.2018: Added disk usage
 *
 *			   Added update page
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
			
			new AdminService().isAdmin(
			function() {},
			function() {
				// hide sections for non-admin users
				self.getView().byId("itemNavUpload").setVisible(false);
				self.getView().byId("itemNavUpdate").setVisible(false);
				self.getView().byId("itemNavLogs").setVisible(false);
				self.getView().byId("itemNavDiskUsage").setVisible(false);
			});
        },
		
		/*
		 * Navigation
		 */
		 
		onPressGoToHome: function(oEvent) {
			self.getRouter().navTo("home");
		},
		
		onPressGoToDatasets: function(oEvent) {
			self.getRouter().navTo("datasets");
		},
		
		onPressGoToUpload: function(oEvent) {
			self.getRouter().navTo("upload");
		},
		
		onPressGoToUpdate: function(oEvent) {
			self.getRouter().navTo("update");
		},
		
		onPressGoToLogs: function(oEvent) {
			self.getRouter().navTo("logs");
		},
		
		onPressDiskUsage: function(oEvent) {
			self._getDiskUsage(function(data) {
				MessageBox.information(
					self.getTextById("Misc.diskusage") + data.used_space_mb + " MB\n" +
					self.getTextById("Misc.diskusage") + data.used_space_percent + " %"
				);
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