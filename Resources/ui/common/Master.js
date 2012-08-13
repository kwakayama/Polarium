// Private Vars
var self;
var VARS;
//type of window
exports.type = "master";

//some dummy data for our table view
	var Data = [
		{title:'Workitems', hasChild:true, image:'workitemsIcon.png', callback:function function_name (argument) {
			// body...
			Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'queryMaster', 'type':'master', 'params':'' } });
			Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'queryDetail', 'type':'detail', 'params':'' } });
		}},
		{title:'Settings', hasChild:true, image:'settingsIcon.png', callback:function function_name (argument) {
			Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'settings', 'type':'detail', 'params':'' } });
		}},
		{title:'About', hasChild:true, image:'aboutIcon.png', callback:function function_name (argument) {
			Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'about', 'type':'detail', 'params':'' } });
		}}
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
	
	var table = Ti.UI.createTableView({
		// data:tableData
		scrollable:false
	});
	var tableData = [];
	var i;
	for (i = 0; i < Data.length; i++) {
		var row = Titanium.UI.createTableViewRow({
			height:50
		});

		var rowTitle = Titanium.UI.createLabel({
			text: Data[i].title,
			font:{fontSize:16,fontWeight:'bold'},
			width:'auto',
			textAlign:'left',
			// top:2,
			left:40,
			height:'auto'
		});

		var rowIcon =  Titanium.UI.createImageView({
			// url:CustomData[i].flag,
			image: 'assets/images/' + Data[i].image,
			width:32,
			height:32,
			left:4,
			top:2
		});
		
		row.add(rowIcon);
		row.add(rowTitle);
		row.hasChild = Data[i].hasChild;
		
		//define callbacks. title and icons have to be clickable, too.
		rowIcon.callback = Data[i].callback;
		rowTitle.callback = Data[i].callback;
		row.callback = Data[i].callback;
		
		tableData.push(row);
	}
	table.setData(tableData);

	self.add(table);

	// Show Stuff
	self.show();
};


// Hide View
exports.hideView = function(){

	VARS.GV.removeAllChildren(self);

	// Hide Stuff
	self.hide();
};

