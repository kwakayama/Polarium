// Private Vars
var self;
var VARS;
//type of window
exports.type = "full";

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
	
	alert('show view');
	
	// Add EventListeners
	
	// Show Stuff
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

