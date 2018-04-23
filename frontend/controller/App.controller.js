/**
 * AppController.
 * 23.04.2018
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
    "com/sap/ml/data/pool/controller/BaseController"
], function(BaseController) {
    "use strict";

    var self;

    return BaseController.extend("com.sap.ml.data.pool.controller.App", {

        /**
         * onInit function.
         * Sets the content density class for the app.
         * Sets the session model.
         */
        onInit: function() {
            self  = this;
			
			// add content density class
            this.getView().addStyleClass(
                this.getOwnerComponent().getContentDensityClass()
            );
        },
		
		onPressGoToHome: function(oEvent) {
			this.getRouter().navTo("home");
		},
		
		onPressGoToDatasets: function(oEvent) {
			this.getRouter().navTo("datasetlist");
		}
	})
});