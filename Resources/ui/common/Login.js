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
	Polarium = require('/common/polarium_api').Polarium;

	// Create Object Instance, A Parasitic Subclass of Observable
	self = Ti.UI.createView({
		backgroundColor: 'transparent',
		layout: 'vertical',
		visible: false
	});
				
	// UI
	
	return self;
};

// function to retrieve values form the database
// returns an object containing username, pwd, serverURL and projectID
function getCredentials(){
	
	//open database
	var db = Ti.Database.open('PolarionApp');

	//retrieve data
	var credentials = db.execute('SELECT * FROM credentials');

	//create result object
	var result;

	if (credentials.isValidRow()) {
	
		result = {
			pwd : credentials.fieldByName('pwd'),
			username : credentials.fieldByName('username'),
			serverURL : credentials.fieldByName('serverURL'),
			projectID : credentials.fieldByName('projectID')
		};
	
	} else{
		result = null;
	}

	db.close();

	return result;
}

// function for setting the credentials in the database
function setCredentials(login){
	
	//open database
	var db = Ti.Database.open('PolarionApp');

	db.execute('INSERT OR REPLACE INTO credentials (id,username,pwd,serverURL,projectID) VALUES (1,?,?,?,?)', login.username, login.pwd, login.serverURL, login.projectID);

	db.close();

}

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

//function to valitate a ProjectID
function validateProjectID(id) {
    return /^[0-9a-zA-Z_.-]+$/.test(id);
}

//function to check the logindata
//returns true if the logininformation is valid and false if it's invalid
function checkLoginData(login){
	if (validateURL(login.serverURL) && validateUsername(login.username) && validateProjectID(login.projectID)) {
		return true;
	} else{
		return false;
	}
}

// Show View
exports.showView = function(){
	var username,
		pwd,
		serverURL,
		projectID;

	//check if data is stored in database
	credentials = getCredentials();
	if (credentials !== null) {
		username = credentials.username;
		pwd = credentials.pwd;
		serverURL = credentials.serverURL;
		projectID = credentials.projectID;
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
	      value: serverURL
	    });
    self.add(Server_Field);

    Project_Field = Ti.UI.createTextField({
	      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	      color: '#336699',
	      hintText: 'Project ID',
	      width: 250, height: 'auto',
	      value: projectID
	    });
    self.add(Project_Field);
	
	Username_Field = Ti.UI.createTextField({
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
      color: '#336699',
      hintText: 'Username',
      width: 250, height: 'auto',
      value: username
    });
    self.add(Username_Field);

    Pwd_Field = Ti.UI.createTextField({
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
      color: '#336699',
      hintText: 'Password',
      passwordMask: 'true',
      width: 250, height: 'auto',
      value: pwd
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
			serverURL : Server_Field.getValue(),
			projectID : Project_Field.getValue()
		};
		
		//check input fields
		if (checkLoginData(loginData) === true) {

			setCredentials(loginData);
			
			//log into Polarium
			//TODO ERROR CASE
			//PAPI.Polarium.logintoPolarium(loginData.username, loginData.pwd);
			Polarium.sessionService.login(
                loginData.username,
                loginData.pwd,
                function(arg) { alert(arg); }, 
                function(err) { alert(err); });

			Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'master', 'type':'master', 'params':'' } });
			Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'detail', 'type':'detail', 'params':'' } });

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

