// Private Vars
var self;
var VARS;
var Loginbutton;
var actInd;
var hasListener = false;
//type of window
exports.type = "full";
 
var Server_Field,
    Username_Field,
    Pwd_Field;
 
//eventlistener for project popover
Titanium.App.addEventListener('popoverProjects',function(obj){
     
    //hide loading animation
    actInd.hide();
    Loginbutton.setEnabled(true);
     
    //hide keyboard
    Server_Field.blur();
    Username_Field.blur();
    Pwd_Field.blur();
     
    var myprojects = obj.projects;
    var projectList = [];
     
    var key; 
    for (key in myprojects) {
       var obj = myprojects[key];
       // alert(obj.id);
       projectList.push(obj.id);
    }
    //open popover to choose project
    var popover = Ti.UI.iPad.createPopover({
        height:250,
        width:310,
        title:'Choose Project'
    });
 
    var popview = Ti.UI.createView({
        backgroundColor: 'transparent',
        layout: 'vertical',
        visible: true,
        height:'auto',
        width:'auto'
    });
     
    var column1 = Ti.UI.createPickerColumn();
    var i;
    for(i=0, ilen=projectList.length; i<ilen; i++){
      var row = Ti.UI.createPickerRow();
         
      var label = Ti.UI.createLabel({
        font:{fontSize:20,fontWeight:'bold'},
        text: projectList[i],
        textAlign:'left',
        height:'auto',
        width:'auto'
      });
       
      row.add(label);
      column1.addRow(row);
    }
 
    var picker = Ti.UI.createPicker({
      columns: [column1],
      visibleItems: 3,
      selectionIndicator: true
    });
     
    picker.setSelectedRow(0,0,true);
     
    var btn = Ti.UI.createButton({
        title:'Submit',
        height:'auto',
        width:320
    });
 
    btn.addEventListener('click',function(){
        VARS.GVUpdate('currentProjectId',picker.getSelectedRow(0).children[0].text);
         
        popover.hide();
        Ti.App.fireEvent('restart');
    });
     
    // popview.add(lbl);
    popview.add(picker);
    popview.add(btn);
     
    popover.add(popview);
    popover.show({view:Loginbutton,animation:false});
});
 
// Template Constructor
exports.createView = function() {
 
    // Global VARS
    VARS  = require('/common/globals');
 
    // Create Object Instance, A Parasitic Subclass of Observable
    self = Ti.UI.createView({
        backgroundGradient: {
            type: 'linear',
            startPoint: { y: '0%', x: '50%' },
            endPoint: {y: '100%', x: '50%'},
            colors: [ 'white', '#DDDDDD'],
            backfillStart: true,
            backfillEnd: true
        },
        layout: 'vertical',
        visible: false
    });
                 
    // UI
     
    return self;
};
 
var loginButtonFkt = function(){
     
    //set loading animation
    setTimeout(function() {
        actInd.hide();
        Loginbutton.setEnabled(true);
 
    }, 5000);
    actInd.show();
    Loginbutton.setEnabled(false);
 
     
    //get input fields
    var loginData = {
        username : Username_Field.getValue(),
        pwd : Pwd_Field.getValue(),
        serverURL : Server_Field.getValue()
    };
     
    //check input fields
    if (checkLoginData(loginData) === true) {
        // setCredentials(loginData);
        VARS.GV.saveCredentials(loginData);
        //log into Polarium
        //TODO ERROR CASE
        VARS.GV.login(function(sessionid) {
            if (sessionid !== null) {
                                    
                VARS.GV.getprojects();
                 
            }else {
                alert('sorry, can not log in');
            }
             
        })
 
    } else{
         
        alert("please check your login information");
 
    }
 
};
//function to validate a URL
function validateURL(textval) {
      // var urlregex = new RegExp(
            // "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
      // return urlregex.test(textval);
      return true;
}
 
//function to valitate a Username
function validateUsername(username) {
    return /^[0-9a-zA-Z_.-]+$/.test(username);
}
 
//function to check the logindata
//returns true if the logininformation is valid and false if it's invalid
function checkLoginData(login){
    // if (validateURL(login.serverURL) && validateUsername(login.username)) {
        // return true;
    // } else{
        // return false;
    // }
    return true;
}
 
// Show View
exports.showView = function(){
    var SPACING = 5;
    var TOPSPACE = 22;
     
    Ti.API.log('--- show login view ---');
    var username,
        pwd,
        serverURL;
         
    //check if data is stored in database
    credentials = VARS.GV.getCredentials();
    if (credentials !== null) {
        username = credentials.username;
        pwd = credentials.pwd;
        serverURL = credentials.serverURL;
    }
 
    var lbl = Ti.UI.createLabel({
        top: TOPSPACE,
        bottom: TOPSPACE,
        font: { fontWeight:'bold',fontSize:48 },
        text:'Login',
        height:'auto',
        width:'auto',
        color:'#000'
    });
    self.add(lbl);
 
    Server_Field = Ti.UI.createTextField({
          top: SPACING,
          borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
          color: '#336699',
          hintText: 'Server URL',
          width: 301, 
          height: 'auto',
          value: serverURL,
          autocorrect: false
        });
    self.add(Server_Field);
     
    Username_Field = Ti.UI.createTextField({
      top: SPACING,
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
      color: '#336699',
      hintText: 'Username',
      width: 301,
      height: 'auto',
      value: username,
      autocorrect: false
    });
    self.add(Username_Field);
 
    Pwd_Field = Ti.UI.createTextField({
      top: SPACING,
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
      color: '#336699',
      hintText: 'Password',
      passwordMask: 'true',
      width: 301, height: 'auto',
      value: '',
      autocorrect: false
    });
    self.add(Pwd_Field);
 
    Loginbutton = Titanium.UI.createButton({ 
        top: SPACING,
        color: '#ffffff',
        height: 57,
        font:{size:9, fontWeight:'bold'},
        width: 301,
        backgroundImage: 'assets/buttons/BUTT_grn_off.png',
        title:'Submit'
    });
     
    actInd = Titanium.UI.createActivityIndicator({
        //width:30,
        //height:30,
        //left:150,
        top:10
    });
    actInd.style = 2;
     
     
    // Loginbutton.addEventListener('click',loginButtonFkt);
    Loginbutton.callback = loginButtonFkt;
    hasListener = true;
    self.add(Loginbutton);
    self.add(actInd);
     
    // Show Stuff
    self.show();
};
 
 
// Hide View
exports.hideView = function(){
    // Remove EventListeners
    if (hasListener === true) {
       Loginbutton.removeEventListener('click',loginButtonFkt);
       hasListener = false;
    }
     
    // Hide Stuff
    VARS.GV.removeAllChildren(self);
    // alert("hide Fullview: " + self.children);
    // self.hide();
};