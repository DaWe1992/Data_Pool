/**
 * DatasetListController.
 * 23.04.201
 *
 * Update/Change-Log:
 * 27.07.2018: Added handler functions for "AlterDescriptionDialog"
 *
 *             Hide links that must not be used by non-admin users
 *
 * 13.08.2018: Added title for the dataset
 *
 *			   Added HTML tags for file description
 *
 * 24.08.2018: Moved data set information into message box
 *
 * 27.08.2018: Added category filter and update of category
 *
 * @author D062271
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
sap.ui.define([
	"com/sap/ml/data/pool/controller/BaseController",
	"com/sap/ml/data/pool/service/DatasetService",
	"com/sap/ml/data/pool/service/AdminService",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(BaseController, DatasetService, AdminService, JSONModel, Filter, MessageBox, MessageToast) {
	"use strict";
	
	var self;
	
	var oTextFilter;
	var oCategoryFilter;
	var aSelectedCategories;

	return BaseController.extend("com.sap.ml.data.pool.controller.DatasetList", {
		
		/**
		 * onInit function.
		 */
		onInit: function() {
			self = this;
			
			self.aSelectedCategories = [];
			
			setTimeout(function() {
				new AdminService().isAdmin(function() {}, function() {
					// hide links that must not be used by non-admins
					$(".admin").css("visibility", "hidden");
				});
			}, 500);
			
			self._getDatasets(function(aData) {
				var oView = self.getView();
				
				// set model
				oView.setModel(new JSONModel(aData));
				
				var oLabel = oView.byId("toolbarLabel");
				oLabel.setText(
					self.getTextById("Datasetlist.toolbar.text") + " " + aData.length
				);
			});
			
			self._getCategories(function(aData) {
				aData.forEach(function(oCategory) {
					self.aSelectedCategories.push(oCategory.file_category);
				});
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
				aFilters.push(
					new Filter("file_name", sap.ui.model.FilterOperator.Contains, sQuery)
				);
			}
			
			self.oTextFilter = new Filter({
				filters: aFilters
			});
			
			self._filter();
		},
		
		/**
		 * Deletes a dataset.
		 *
		 * @param oEvent
		 */
		onDeleteDataset: function(oEvent) {
			var sId = oEvent.getSource().data("file_id");
			
			// check if user has admin permissions
			new AdminService().isAdmin(function() {
				// has permission...
				MessageBox.confirm(
				self.getTextById("Datasetlist.delete.warning"), {
					onClose: function(sButton) {
						if(sButton === MessageBox.Action.OK) {
							self._deleteDataset(sId);
							
							// delete entry from binding
							var oView = self.getView();
							var oModel = oView.getModel();
							var oData = oModel.oData;
							
							for(var i = 0; i < oData.length; i++) {
								var oItem = oData[i];
								
								// item to be deleted found
								if(oItem.file_id == sId) {
									oData.splice(i, 1);
									oModel.setData(oData);
									break;
								}
							}
							
							// update toolbar label
							var oLabel = oView.byId("toolbarLabel");
							oLabel.setText(
								self.getTextById("Datasetlist.toolbar.text") + " " + oData.length
							);
						}
					}
				});
			},
			function() {
				// doesn't have permission...
				MessageBox.error(self.getTextById("Misc.error.no.admin"));
			});
		},
		
		/**
		 * Shows data set information.
		 *
		 * @param oEvent
		 */
		onShowInfo: function(oEvent) {
			var sId = oEvent.getSource().data("file_id");
			var aData = self.getView().byId("datasetList").getModel().getData()
			var oResult = {};
			
			for(var i = 0; i < aData.length; i++) {
				if(aData[i].file_id === sId) oResult = aData[i];
			}
			
			MessageBox.information(
				self.getTextById("Datasetlist.info.uploaded") + "\n" + oResult.file_date +
				"\n\n" + self.getTextById("Datasetlist.info.size") + "\n" + oResult.file_size_mb + " MB" +
				"\n\n" + self.getTextById("Datasetlist.info.category") + "\n" + oResult.file_category +
				"\n\n" + self.getTextById("Datasetlist.info.version") + "\n" + oResult.file_version
			);
		},
		
		/************************************************
		 *
		 * UPDATE DATASETINFO DIALOG
		 *
		 ************************************************/
		
		/**
		 * Opens a popup to update the information of a data set.
		 *
		 * @param oEvent
		 */
		onOpenAlterDescriptionDialog: function(oEvent) {
			var sId = oEvent.getSource().data("file_id");
			
			// check if user has admin permissions
			new AdminService().isAdmin(function() {
				// has permission...
				self._openDialog(
					"UpdateDatasetInfoDialog",
					"com.sap.ml.data.pool.fragment.UpdateDatasetInfoDialog"
				);
				
				self._getDataset(sId, function(aData) {
					var oView = self.getView();
					
					oView.byId("datasetId").setText(sId);
					oView.byId("titleInput").setValue(aData[0].file_title);
					oView.byId("categoryInput").setValue(aData[0].file_category);
					oView.byId("descriptionTextArea").setValue(aData[0].file_description);
				});
			}, function() {
				// doesn't have permission...
				MessageBox.error(self.getTextById("Misc.error.no.admin"));
			});
		},
		
		/**
		 * Updates the description.
		 *
		 * @param oEvent
		 */
		onUpdateDatasetInfoPress: function(oEvent) {
			var oView = self.getView();
			
			new DatasetService().updateDataSetInfo(
				oView.byId("datasetId").getText(),
				oView.byId("titleInput").getValue(),
				oView.byId("categoryInput").getValue(),
				oView.byId("descriptionTextArea").getValue(),
				function(res) {
					self._oUpdateDatasetInfoDialog.close();
					MessageToast.show(
						self.getTextById("Datasetlist.changed.datasetinfo")
					);
				},
				function(res) {
					MessageToast.show(
						self.getTextById("Misc.error")
					);
				}
			);
		},
		
		/**
		 * Closes the "UpdateDatasetInfoDialog".
		 *
		 * @param oEvent
		 */
		onUpdateDatasetInfoDialogCancel: function(oEvent) {
			self._oUpdateDatasetInfoDialog.close();
		},
		
		/************************************************
		 *
		 * CATEGORY FILTER DIALOG
		 *
		 ************************************************/
		
		/**
		 * Opens a popup to filter data sets by categories.
		 *
		 * @param oEvent
		 */
		onOpenFilterCategoryDialog: function(oEvent) {
			self._getCategories(function(aData) {
				var oDialog = self._openDialog(
					"FilterCategoryDialog",
					"com.sap.ml.data.pool.fragment.FilterCategoryDialog"
				);
				
				oDialog.setModel(new JSONModel(aData));
				
				// tick all selected categories
				oDialog.getItems().forEach(function(oItem) {
					var sCategory = oItem.getProperty("title");
					
					if(self.aSelectedCategories.includes(sCategory)) {
						oItem.setSelected(true);
					}
				});
			});
		},
		
		/**
		 * Filters categories in dialog.
		 *
		 * @param oEvent
		 */
		onCategorySearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("file_category", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		
		/**
		 * Filters data sets by categories
		 *
		 * @param oEvent
		 */
		onFilterCategoriesPress: function(oEvent) {
			var aSelectedItems = oEvent.getParameter("selectedItems");
			var aFilters = [];
			self.aSelectedCategories = [];
			
			for(var i = 0; i < aSelectedItems.length; i++) {
				var sCategory = aSelectedItems[i].getProperty("title");
				self.aSelectedCategories.push(sCategory);
				
				aFilters.push(new Filter(
					"file_category",
					sap.ui.model.FilterOperator.EQ,
					sCategory
				));
			}
			
			self.oCategoryFilter = new Filter({
				filters: aFilters,
				and: false
			});
			
			self._filter();
		},
		
		/************************************************
		 *
		 * HELPER FUNCTIONS
		 *
		 ************************************************/
		
		/**
         * Gets the list of datasets.
         *
         * @param fCallback
         */
        _getDatasets: function(fCallback) {
            new DatasetService().getDatasets(function(res) {
				var aData = res.data;
				
				// add html tags for the description
				for(var i = 0; i < aData.length; i++) {
					aData[i].file_description = "" +
					"<html>" +
						"<head>" +
							"<style>" +
								"ul {" +
									"font-size: 10pt;" +
								"}" +
								"ol {" +
									"font-size: 10pt;" +
								"}" +
								"p {" +
									"white-space: pre-line;" +
									"font-size: 10pt;" +
									"font-style: italic;" +
									"margin-top: 0px;" +
								"}" +
							"</style>" +
						"</head>" +
						"<body>" +
							"<p>" + aData[i].file_description + "</p>" +
						"</body>" +
					"</html>";
				}
				
                fCallback(res.data);
            }, function(res) {
                MessageBox.error(self.getTextById("Misc.error.data.load"));
            });
        },
		
		/**
		 * Gets the title, category and description of the data set.
		 *
		 * @param sId (id of the data set to load description for)
		 * @param fCallback
		 */
		_getDataset: function(sId, fCallback) {
			new DatasetService().getDataset(sId,
			function(res) {
				var aData = res.data;
				var aResult = [];
				
				for(var i = 0; i < aData.length; i++) {
					aResult.push({
						"file_title": aData[i].file_title,
						"file_category": aData[i].file_category,
						"file_description": aData[i].file_description
					});
				}
				
                fCallback(aResult);
			}, function(res) {
				MessageBox.error(self.getTextById("Misc.error.data.load"));
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
		
		/**
		 * Deletes the dataset.
		 *
		 * @param sId (id of dataset to be deleted)
		 */
		_deleteDataset: function(sId) {
			// Delete dataset
			new DatasetService().deleteDataset(
				sId,
				function() {},
				function() {}
			);	
		},
		
		/**
         * Opens the dialog specified
         *
         * @param sDialogType
         * @param sDialogName
         */
        _openDialog: function(sDialogType, sDialogName) {
            var oView = self.getView();

            var oDialog = (sDialogType === "UpdateDatasetInfoDialog")
                ? self._oUpdateDatasetInfoDialog
                : self._oFilterCategoryDialog;

            // create dialog lazily
            if(!oDialog) {
                // create dialog via fragment factory
                oDialog = sap.ui.xmlfragment(
                    oView.getId(),
                    sDialogName,
                    self
                );

                // connect dialog to the root view of this component
                oView.addDependent(oDialog);

                // forward compact/cozy style into dialog
                jQuery.sap.syncStyleClass(
                    oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog
                );
            }

            if(sDialogType === "UpdateDatasetInfoDialog") {
				self._oUpdateDatasetInfoDialog = oDialog;	
            } else {self._oFilterCategoryDialog = oDialog;}

            oDialog.open();
			return oDialog;
        },
		
		/**
		 * Filters data sets by categories and text input.
		 */
		_filter: function() {
			// update list binding
			var oList = self.byId("datasetList");
			var oBinding = oList.getBinding("items");
			
			var aFilters = [];
			if(self.oTextFilter && self.oTextFilter.aFilters.length > 0) {
				aFilters.push(self.oTextFilter);
			} else {oBinding.filter();}
			if(self.oCategoryFilter) aFilters.push(self.oCategoryFilter);
			
			// filter
			oBinding.filter(new Filter({
				filters: aFilters,
				and: true
			}));
			
			// update toolbar label
			var oView = self.getView();
			var oLabel = oView.byId("toolbarLabel");
			oLabel.setText(
				self.getTextById("Datasetlist.toolbar.text") +
				" " + oBinding.aIndices.length
			);
		}
	});
});