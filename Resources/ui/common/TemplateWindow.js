// Private Vars
var self,
	VARS,
	view;

// Template Constructor
exports.createWindow = function() {

	// Global VARS
	VARS  = require('/common/globals');

	// Create Window Instance
	self = Ti.UI.createWindow({
		backgroundColor: 'transparent'
	});
	
	return self;
};


// Show View
exports.showWindow = function(){
	
	// UI
	
	// Create View Instance
	view = Ti.UI.createView({
		layout: 'vertical',
	});
	// Create UI-elements and add them to the view

	// Add EventListeners or Custom Callbacks
	
	// Show Stuff
	self.add(view);
	self.show();
};


// Hide View
exports.hideWindow = function(){

	// Remove EventListeners

	// Hide Stuff
	VARS.GV.hideAllChildren(self);
	self.hide();
};

// Hide View
exports.killWindow = function(){

	// Remove EventListeners

	// Remove Stuff
	VARS.GV.removeAllChildren(self);
	self.close();
	self = null;
};