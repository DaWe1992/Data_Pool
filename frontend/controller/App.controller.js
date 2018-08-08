/**
 * AppController.
 * 23.04.2018
 *
 * Update/Change-Log:
 * 08.08.2018: Added logs page navigation
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "com/sap/ml/data/pool/controller/BaseController",
	"com/sap/ml/data/pool/service/SessionService",
	"com/sap/ml/data/pool/service/AdminService"
], function(BaseController, SessionService, AdminService) {
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
				// hide upload section if user is no admin
				var oListItemUpload = self.getView().byId("itemNavUpload");
				oListItemUpload.setVisible(false);
				
				// hide logs section if user is no admin
				var oListItemLogs = self.getView().byId("itemNavLogs");
				oListItemLogs.setVisible(false);
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
		
		onPressLogout: function(oEvent) {
			new SessionService().logout(
                function() {location.reload();},
                function() {location.reload();}
            );
		}
	});
});