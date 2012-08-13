// Private Vars
var self;

//declare module dependencies
var MasterView = require('ui/common/MasterView'),
	DetailView = require('ui/common/DetailView');


// Template Constructor
exports.createWindow = function() {

	// Global VARS
	var VARS  = require('/common/globals');
	

	// Create Object Instance.
	self = Ti.UI.createWindow({
		backgroundColor:'#ffffff'
	});
				
	// UI
	var masterView = new MasterView(),
		detailView = new DetailView();
		
	masterView.borderColor = '#000';
	masterView.borderWidth = 1;
		
	//create master view container
	var masterContainer = Ti.UI.createView({
		top:0,
		bottom:0,
		left:0,
		width:240
	});
	masterContainer.add(masterView);
	self.add(masterContainer);
	
	//create detail view container
	var detailContainer = Ti.UI.createView({
		top:0,
		bottom:0,
		right:0,
		left:240
	});
	detailContainer.add(detailView);
	self.add(detailContainer);

	return self;
};


// Show Window
exports.showWindow = function(){
	
	alert('show window');
	
	// Add EventListeners
	
	// Show Stuff
	self.show();
};


// Hide Window
exports.hideWindow = function(){

	// Remove EventListeners
	
	// Hide Stuff
	VARS.GV.removeAllChildren(self);
	self.hide();
};

// Delete Window
exports.killWindow = function() {
	self.close();
};