/**
 * HomeController.
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

	return BaseController.extend("com.sap.ml.data.pool.controller.Home", {
		
		onInit: function() {
			self = this;
			var oPage = this.byId("homePage");
			oPage.addStyleClass("myBackgroundStyle");
		}
	});
});