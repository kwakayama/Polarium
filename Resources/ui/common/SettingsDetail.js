// Private Vars
var self;
var VARS;
//type of window
exports.type = "detail";

//Function For switch Event
function switchFkt(e){
    if (e.value === true) {
        VARS.GV.setIsSetPin('armed');
    } else{
        VARS.GV.setIsSetPin('defused');   
    }
}

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
        text:'Settings'
    });
    
    var tmpPwd = Ti.UI.createTextField({
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        color: '#336699',
        hintText: 'enter your new Pin',
        passwordMask: 'true',
        width: 250, 
        height: 'auto',
        value: VARS.GV.getTmpPin(),
        autocorrect: false
    });
    
    var  pwdSubmitBtn = Ti.UI.createButton({
        title:'set temp Password',
        height: 'auto',
        width: 250
    });
    
    var PinIsActive = VARS.GV.getIsSetPin();
    var tmpPwdSwitch = Titanium.UI.createSwitch({
        value:PinIsActive
    });
    var wipeBtn = Ti.UI.createButton({
        title:'wipe data',
        height: 'auto',
        width: 250
    });
    
    tmpPwdSwitch.addEventListener('change',switchFkt);
    
    pwdSubmitBtn.callback = function(argument) {
        newTmpPwd = tmpPwd.getValue();
        VARS.GV.setTmpPin(newTmpPwd);  
    };
    
    wipeBtn.callback = function(){
        alert('you wiped all data');
        VARS.GV.wipeData();  
    };

    self.add(lbl);
    self.add(tmpPwd);
    self.add(pwdSubmitBtn);
    self.add(tmpPwdSwitch);
    self.add(wipeBtn);
    
    // Show Stuff
    self.show();
};


// Hide View
exports.hideView = function(){

    VARS.GV.removeAllChildren(self);

    // Hide Stuff
    self.hide();
};

