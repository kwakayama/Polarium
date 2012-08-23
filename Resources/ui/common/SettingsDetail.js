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
        text:'Settings',
        height:'auto',
        height:'auto',
        width:'auto',
        color:'#000'
    });
    
    var tmpPwd = Ti.UI.createTextField({
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        color: '#336699',
        hintText: 'enter your new Pin',
        passwordMask: 'true',
        width: 250, 
        height: 'auto',
        // value: 'asdf',
        autocorrect: false
    });
    
    var  pwdSubmitBtn = Ti.UI.createButton({
        title:'set temp Password'
    });
    
    pwdSubmitBtn.callback = function(argument) {
        newTmpPwd = tmpPwd.getValue();
        VARS.GV.setTmpPin(newTmpPwd);  
    };

    self.add(lbl);
    self.add(tmpPwd);
    self.add(pwdSubmitBtn);
    
    // Show Stuff
    self.show();
};


// Hide View
exports.hideView = function(){

    VARS.GV.removeAllChildren(self);

    // Hide Stuff
    self.hide();
};

