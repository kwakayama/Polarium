// Private Vars
var self;
var VARS;
//type of window
exports.type = "detail";

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
        height:'auto',
        font: { fontWeight:'bold',fontSize:24 },
        text:'About'
    });
    
    var webview1 = Ti.UI.createWebView({
        html:"<a>This App brings Polarion ALM to the iPad.<br>It's a free App, which is part of the Polarion Pop Challange 2012<br>Polarion is a Application Lifecycle Management Service, specially used by Enterprises. This App is not familiar with Polarion Software GmbH.</a>",
        height:70
    });
    
    var webview2 = Ti.UI.createWebView({
        html:"<a>For More Information please \"Click Me\"</a>",
        height:70
    });
    webview2.callback = function(){
        Ti.Platform.openURL("http://extensions.polarion.com/polarion/extensions/challenge.jsp");
    };

    
    var Logo_Tsystems = Ti.UI.createImageView({
       image:'/assets/images/tsystems_header.gif' 
    });
    
    var Logo_DHBW = Ti.UI.createImageView({
        height:80,
        width:'auto',
        image:'/assets/images/dhbw_logo.png' 
    });
    
    var Logo_PolarionPop = Ti.UI.createImageView({
       image:'/assets/images/polarionpop.png' 
    });

    self.add(lbl);
    self.add(webview1);
    self.add(webview2);
    self.add(Logo_PolarionPop);
    self.add(Logo_Tsystems);
    self.add(Logo_DHBW);
    
    
    // Show Stuff
    self.show();
};


// Hide View
exports.hideView = function(){

    VARS.GV.removeAllChildren(self);

    // Hide Stuff
    self.hide();
};

