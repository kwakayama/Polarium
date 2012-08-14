var Polarium = require('/common/polarium_api').Polarium;

// Common Global Variables
var GV  =
{
    sessionID: '',
    currentWorkItemQueryID: 1,
    currentFull: '',
    previousFull: '',
    currentMaster: '',
    previousMaster: '',
    currentDetail: '',
    previousDetail: '',
	removeAllChildren : function(viewObject){
        // alert("type: " + viewObject.type);
        if (typeof viewObject !== 'undefined' && typeof viewObject.children !== 'undefined') {
            //copy array of child object references because view's "children" property is live collection of child object references
            var children = viewObject.children.slice(0);
            var i;
            for (i = 0; i < children.length; ++i) {
        
                viewObject.remove(children[i]);

                if(children[i] !== null){

                    children[i] = null;
                }
            }
        }
	},
    saveQueryData : function(type, value) {
        //open database
        var db = Ti.Database.open('PolarionApp');
        
        Ti.API.log('start inserting: '+type+' - '+value + ' - '+this.currentWorkItemQueryID);
        
        if (type === 'Name') {
            
            db.execute('UPDATE OR REPLACE queries SET name = ? WHERE id IS ?', value, this.currentWorkItemQueryID);
            
        } else if (type === 'Title') {
            
            db.execute('UPDATE OR REPLACE queries SET title = ? WHERE id IS ?', value, this.currentWorkItemQueryID);
            
        } else if(type === 'Status'){
            
            db.execute('UPDATE OR REPLACE queries SET status = ? WHERE id IS ?', value, this.currentWorkItemQueryID);
            
        } else if(type === 'Type'){
            
            db.execute('UPDATE OR REPLACE queries SET type = ? WHERE id IS ?', value, this.currentWorkItemQueryID);
            
        } else if(type === 'Due Date'){
            
            db.execute('UPDATE OR REPLACE queries SET duedate = ? WHERE id IS ?', value, this.currentWorkItemQueryID);
            
        } else if(type === 'Timepoint'){
            
            db.execute('UPDATE OR REPLACE queries SET timepoint = ? WHERE id IS ?', value, this.currentWorkItemQueryID);
            
        } else if(type === 'Author'){
            
            db.execute('UPDATE OR REPLACE queries SET author = ? WHERE id IS ?', value, this.currentWorkItemQueryID);
            
        } else if(type === 'Assignables'){
            
            db.execute('UPDATE OR REPLACE queries SET assignables = ? WHERE id IS ?', value, this.currentWorkItemQueryID);
            
        } else if(type === 'Custom'){
            
            db.execute('UPDATE OR REPLACE queries SET custom = ? WHERE id IS ?', value, this.currentWorkItemQueryID);
            
        }

        db.close();

    },
    getWorkitems : function(mycall) {        
        loginThen(function() {
            var ok = function(workitems) {
                Ti.API.log('we got ' + workitems.length + ' workitems :)');
                mycall(workitems);
            };
            var error = function(argument) {
                Ti.API.log("error - couldn't get workitems :()");
            };
            Polarium.trackerService.queryWorkitems("status:draft","id", ["id", "title", "status", "created", "description"], ok, error);
        });
    },
	login : function(argument){
        loginThen(argument);	    
	},
	logout : function(argument) {
        var ok = function(workitems) {
            Ti.API.debug("Logout done");
        };
        var error = function(argument) {
          alert("error - couldn't logout");
        };
        Polarium.sessionService.logout(ok,error);
	},
	getprojects : function(argument) {
	    loginThen(function(){
            var ok = function(projects) {
                Ti.API.log(projects);
            };
            var error = function(argument) {
                Ti.API.log("error - couldn't get projects");
            };
            Polarium.projectService.getProjects(ok, error);
        });
	},
	getAssignables : function(){
	    loginThen(function(){
            var ok = function(assignables) {
                Ti.API.log(assignables);
            };
            var error = function(argument) {
                Ti.API.log("error - couldn't get projects");
            };
            Polarium.trackerService.getAssignables(ok, error);
        });
	}
	
};

var loginThen = function(then) {
    credentials = getCredentials();
    Polarium.sessionService.login(
        credentials.username,
        credentials.pwd,
        function(arg) { then(arg); }, 
        function(err) { alert(err); });
};

// function to retrieve values form the database
// returns an object containing username, pwd, serverURL and projectID
var getCredentials = function(){
    
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
        };
    
    } else{
        result = null;
    }

    db.close();

    return result;
};

exports.GVUpdate  = function( globalVarName, globalVarValue )
{
    this.GV[globalVarName]	  =   globalVarValue;
};

exports.GV = GV;