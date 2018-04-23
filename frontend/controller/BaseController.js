/**
 * BaseController.
 * 23.04.2018
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function(Controller, History) {
	"use strict";

	return Controller.extend("com.sap.ml.data.pool.controller.BaseController", {

		/**
		 * Returns the router instance.
		 *
		 * @return
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Returns the resource bundle.
		 *
		 * @return
		 */
		getResBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Returns the text for the id specified.
		 *
		 * @param sId (id of the text in i18n)
		 * @return
		 */
		getTextById: function(sId) {
			return this.getResBundle().getText(sId);
		},

		/**
		 * Navigates back to the previous view. If there
		 * is no previous view, the "Home" view is displayed.
		 *
		 * @param oEvent
		 */
		onNavBack: function(oEvent) {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if(sPreviousHash !== undefined) {
				window.history.go(-1); // go back one element in history
			} else {
				this.getRouter().navTo("appHome", {}, true /* no history */);
			}
		}
	});
});