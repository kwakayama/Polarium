// Private Vars
var self;
var VARS;
//type of window
exports.type = "detail";

//Data
var Data = [
	{workItemTitle:'item1'},
	{workItemTitle:'item2'}
];

// Template Constructor
exports.createView = function() {

	// Global VARS
	VARS  = require('/common/globals');
	

	// Create Object Instance, A Parasitic Subclass of Observable
	self = Ti.UI.createView({
		backgroundColor: 'transparent',
		layout: 'vertical',
		visible: false
	});				
	
	// UI
	
	return self;
};


// Show View
exports.showView = function(){
	
	var lbl = Ti.UI.createLabel({
		top:10,
		font: { fontWeight:'bold',fontSize:24 },
		text:'Query Results:'
	});
	self.add(lbl);
	
	table = Ti.UI.createTableView({
		// data:tableData
	});
	var customTableData = [];
	var i;
	for (i = 0; i < Data.length; i++) {
		var row = Titanium.UI.createTableViewRow({
			height:50
		});
		var rowTitle = Titanium.UI.createLabel({
			text: Data[i].workItemTitle,
			font:{fontSize:16,fontWeight:'bold'},
			width:'auto',
			textAlign:'left',
			// top:2,
			left:40,
			height:'auto'
		});
		row.add(rowTitle);
		customTableData.push(row);
	}

	table.setData(customTableData);
	
	// Show Stuff
	self.add(table);
	self.show();
};


// Hide View
exports.hideView = function(){

	// Remove EventListeners

	// Hide Stuff
	self.hide();

	// Remove Stuff
	VARS.GV.removeAllChildren(self);
};

