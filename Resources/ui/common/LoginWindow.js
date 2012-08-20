// Private Variables
var self;

var VARS;

//declare views
var Login;

//function to validate a URL
function validateURL(textval) {
      var urlregex = new RegExp(
            "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
      return urlregex.test(textval);
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

//Application Window Component Constructor
// exports.ApplicationWindow = function() {
    alert('i am also open');
    // Global VARS
    VARS  = require('/common/globals');
    
    var showToolbar = function(type) {
        
        var flexSpace = Titanium.UI.createButton({
            systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
        });
        
        if (type === 'query') {
            var refreshButton = Ti.UI.createButton({
                systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
            });
            var logBtn = Ti.UI.createButton({title:'Logout'});
            logBtn.callback = function(){
                alert('login button pressed');
                //Navigate  to Login View
                Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'login', 'type':'full', 'params':'' } });
                
                //fire polarium logout request
                VARS.GV.logout();
            };
            logBtn.hide();
            self.add(logBtn);
            
            
            var newButton = Ti.UI.createButton({title:'New'});
            self.add(newButton);
            newButton.hide();
            newButton.callback = function(argument) {

                //open database
                var db = Ti.Database.open('PolarionApp');
                db.execute('INSERT INTO queries DEFAULT VALUES');
                
                //get count of table
                
                var count = db.lastInsertRowId;
                
                db.close();
                
                VARS.GVUpdate('currentWorkItemQueryID',count);
                Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'queryMaster', 'type':'master', 'params':'' } });
                Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'queryDetail', 'type':'detail', 'params':'' } });
                
            };
            self.setToolbar([newButton,flexSpace,refreshButton,flexSpace,flexSpace,flexSpace,logBtn]);
            
        } else if(type === 'logout'){
            
            var logBtn = Ti.UI.createButton({title:'Logout'});
            
            logBtn.callback = function(){
                //Navigate  to Login View
                Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'login', 'type':'full', 'params':'' } });
                
                //fire polarium logout request
                VARS.GV.logout();
            };
            
            logBtn.hide();
            self.add(logBtn);
            
            self.setToolbar([flexSpace,flexSpace,flexSpace,flexSpace,flexSpace,flexSpace,logBtn]);
        } else{
            //show blank toolbar        
            self.setToolbar([flexSpace]);
            
        }
    };

    // create root window
    // self = Ti.UI.createWindow({
        // backgroundColor:'#ffffff',
        // title:'PolarionApp',
        // barColor:'#336699',
        // tabBarHidden:false
    // });
    self = Titanium.UI.currentWindow;
    
    showToolbar();

    self.addEventListener('click', function(e) {
        // Ein "globaler" click listener welcher die function "callback" ausführt.
        if (typeof e.source.callback !== "undefined") {
            e.source.callback();
        }else{
            // Ti.API.log("no callback defined :(");
            // alert("no "+e.source.type);
            Ti.API.info("no callback defined" + e.source.id);
        }
    });

    // initialize to all modes
    self.orientationModes = [
        Titanium.UI.PORTRAIT,
        Titanium.UI.UPSIDE_PORTRAIT,
        Titanium.UI.LANDSCAPE_LEFT,
        Titanium.UI.LANDSCAPE_RIGHT
    ]; 
    
    // UI
    var username,
        pwd,
        serverURL;
    
    var Server_Field,
        Username_Field,
        Pwd_Field;    
    
    var v = Ti.UI.createView({
        backgroundColor: 'transparent',
        layout: 'vertical',
        visible: false
    });
    //check if data is stored in database
    credentials = VARS.GV.getCredentials();
    if (credentials !== null) {
        username = credentials.username;
        pwd = credentials.pwd;
        serverURL = credentials.serverURL;
    }

    var lbl = Ti.UI.createLabel({
        top:20,
        font: { fontWeight:'bold',fontSize:48 },
        text:'Login',
        height:'auto',
        width:'auto',
        color:'#000'
    });
    v.add(lbl);

    Server_Field = Ti.UI.createTextField({
          borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
          color: '#336699',
          hintText: 'Server URL',
          width: 250, height: 'auto',
          value: serverURL,
          autocorrect: false 
        });
    v.add(Server_Field);
    
    Username_Field = Ti.UI.createTextField({
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
      color: '#336699',
      hintText: 'Username',
      width: 250, height: 'auto',
      value: username,
      autocorrect: false
    });
    v.add(Username_Field);

    Pwd_Field = Ti.UI.createTextField({
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
      color: '#336699',
      hintText: 'Password',
      passwordMask: 'true',
      width: 250, height: 'auto',
      value: pwd,
      autocorrect: false
    });
    v.add(Pwd_Field);

    var button = Titanium.UI.createButton({ 
        backgroundColor: 'blue',
        borderColor: '#1c1d1c',
        borderRadius: 6,
        color: '#ffffff',
        borderWidth: '2',
        height: 50,
        font:{size:9, fontWeight:'bold'},
        width: 250,
        backgroundImage: 'none',
        title:'Submit'
    });


    button.callback = function(){

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
                    
                    Ti.API.log("sessionid: "+sessionid);                    
                    //open modal window to choose project
                    Ti.App.fireEvent('notification',{ name:'openModalWindow', body:{'modalType':'chooseProject', 'modalTitle':'Choose Project', 'params':'' } });
                    
                    
                }else {
                    alert('sorry, can not log in');
                }
                
            })

        } else{
            
            alert("please check your login information");

        }

    };
    v.add(button);
    self.add(v);
    // Show Stuff
    v.show();
    /*
    // Notification System - Listen for Global Events
    Ti.App.addEventListener('notification', function(obj) {

        var notificationName = obj.name;
        var notificationData = obj.body;

        if( notificationName === "openWindow" ){
            if (notificationData.window === "masterDetail") {
               
                // self.close();
                // self.hide();
                // tabGroup.close();
//                  
                //TODO Set master detail tab active
               
                    
                // new masterDetailWindow.open();
                
            }
            
        
        }else if(notificationName === "openModalWindow"){
            
            if (notificationData.modalType === 'chooseProject') {
                //modal window for setting the values for the query
                
                // VARS.GV.getprojects();
                
                var title = notificationData.modalTitle;
                //create modal window
                var modalWindow = Ti.UI.createWindow({
                    title: title,
                    backgroundColor:'white',
                    barColor:'#336699'
                });

                //add to parent window, for using it's eventlistener
                self.add(modalWindow);
                
                //create modal view
                var modalView = Ti.UI.createView({
                    backgroundColor: 'transparent',
                    layout: 'vertical',
                    visible: true
                });
                
                //modal window logic
                            
                var picker = Ti.UI.createPicker({
                    top:50
                });
                
                var data = [];
                data[0]=Ti.UI.createPickerRow({title:'E-Library'});
                data[1]=Ti.UI.createPickerRow({title:'Playground'});
                data[2]=Ti.UI.createPickerRow({title:'Document Library'});
                
                picker.add(data);
                picker.selectionIndicator = true;        
                
                modalView.add(picker);
                

                //create submit button
                var submitButton = Ti.UI.createButton({
                    title:'Submit',
                    width:100,
                    height:30
                });

                //set the callback of the submit button
                submitButton.callback = function () {
                    modalWindow.close();
                    Ti.App.fireEvent('notification',{ name:'openWindow', body:{'window':'masterDetail', 'params':'' } });
                };

                //create cancel button
                var cancelButton = Ti.UI.createButton({
                    title:'Cancel',
                    width:100,
                    height:30
                });

                //set the callback of the cancel button
                cancelButton.callback = function () {
                    modalWindow.close();
                };

                //add buttons to the window and hide them
                //workaround to get the callback
                modalView.add(submitButton);
                modalView.add(cancelButton);
                submitButton.hide();
                cancelButton.hide();

                //add modal view to window
                modalWindow.add(modalView);

                //add buttons to the navigation
                modalWindow.setLeftNavButton(cancelButton);
                modalWindow.setRightNavButton(submitButton);

                //0 -> Ti.UI.iPad.MODAL_TRANSITION_STYLE_COVER_VERTICAL
                //2 -> MODAL_PRESENTATION_FORMSHEET
                modalWindow.open({modal:true,modalTransitionStyle:0,modalStyle:2,navBarHidden:false});
                
            }

        }
    });
    */


