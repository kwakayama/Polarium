// Private Vars
var self;
var VARS;
//Polarium API
var Polarium;
//type of window
exports.type = "full";

var Server_Field,
	Username_Field,
	Pwd_Field;

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

// Show View
exports.showView = function(){
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
		top:20,
		font: { fontWeight:'bold',fontSize:48 },
		text:'Login',
		height:'auto',
		width:'auto',
		color:'#000'
	});
	self.add(lbl);

	Server_Field = Ti.UI.createTextField({
	      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	      color: '#336699',
	      hintText: 'Server URL',
	      width: 250, height: 'auto',
	      value: serverURL,
	      autocorrect: false 
	    });
    self.add(Server_Field);
	
	Username_Field = Ti.UI.createTextField({
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
      color: '#336699',
      hintText: 'Username',
      width: 250, height: 'auto',
      value: username,
      autocorrect: false
    });
    self.add(Username_Field);

    Pwd_Field = Ti.UI.createTextField({
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
      color: '#336699',
      hintText: 'Password',
      passwordMask: 'true',
      width: 250, height: 'auto',
      value: pwd,
      autocorrect: false
    });
    self.add(Pwd_Field);

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
	self.add(button);
	
	// Show Stuff
	self.show();
};


// Hide View
exports.hideView = function(){
	// Remove EventListeners
	// Hide Stuff
	VARS.GV.removeAllChildren(self);
	// alert("hide Fullview: " + self.children);
	// self.hide();
};

