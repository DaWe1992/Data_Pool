/**
 * DatasetListController.
 * 23.04.2018
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
	"com/sap/ml/data/pool/controller/BaseController",
	"com/sap/ml/data/pool/service/DatasetService",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/m/MessageBox"
], function(BaseController, DatasetService, JSONModel, Filter, MessageBox) {
	"use strict";
	
	var self;

	return BaseController.extend("com.sap.ml.data.pool.controller.DatasetList", {
		
		/**
		 * onInit function.
		 */
		onInit: function() {
			self = this;
			
			var oView = this.getView();
			
			this._getDatasets(function(data) {
				// set model
				oView.setModel(new JSONModel(data));
				
				var oLabel = oView.byId("toolbarLabel");
				oLabel.setText(
					self.getTextById("Datasetlist.toolbar.text") + " " + data.length
				);
			});
		},
		
		/**
		 * Filters the list of datasets
		 * according to the query specified.
		 *
		 * @param oEvent
		 */
		onSearch: function(oEvent) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if(sQuery && sQuery.length > 0) {
				var oFilter = new Filter("file_name", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(oFilter);
			}

			// update list binding
			var list = this.byId("datasetList");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
			
			// update toolbar label
			var oView = this.getView();
			var oLabel = oView.byId("toolbarLabel");
			oLabel.setText(
				self.getTextById("Datasetlist.toolbar.text") + " " + binding.aIndices.length
			);
		},
		
		/**
         * Gets the list of datasets.
         *
         * @param fCallback
         */
        _getDatasets: function(fCallback) {
            new DatasetService().getDatasets(function(res) {
                fCallback(res.data);
            }, function(res) {
                MessageBox.error(this.getTextById("Misc.error.data.load"));
            });
        }
	});
});