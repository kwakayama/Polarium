var Polarium = require('/common/polarium_api').Polarium;

// Common Global Variables
var GV  =
{
    sessionID: '',
    currentWorkItemQueryID: 1,
    currentStage:'',
    previousStage:'',
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
    //function to delete Query by ID
    deleteQuery : function(id){
        
        Ti.API.log('start deleting query with id: '+id);
        //open database
        var db = Ti.Database.open('PolarionApp');
        
        var result = db.execute('DELETE FROM queries WHERE id IS ?', id);
        
    },
    //function to get all saved queries
    getQueries : function() {
        //open database
        var db = Ti.Database.open('PolarionApp');
        
        //create a return object
        var result = [];    
        
        //retrieve data
        var rows = db.execute('SELECT * FROM queries');
        
        while (rows.isValidRow()){
            var id = rows.fieldByName('id');
            Ti.API.log('id: '+id+' - name: '+rows.fieldByName('name'));
            query = {
                custom : rows.fieldByName('custom'),
                id : rows.fieldByName('id'),
                name : rows.fieldByName('name'),
                title : rows.fieldByName('title'),
                status : rows.fieldByName('status'),
                duedate : rows.fieldByName('duedate'),
                timepoint : rows.fieldByName('timepoint'),
                type : rows.fieldByName('type'),
                author : rows.fieldByName('author'),
                assignables : rows.fieldByName('assignables')
            };
            result.push(query);
            rows.next();
        }
        rows.close();
        db.close();
        return result;
    },
    //Funktion make a request with the currentWorkitemID
    getWorkitems : function(mycall) {        
        this.loginThen(function() {
            
            //get current query out of the database
            var query = getQueryById(GV.currentWorkItemQueryID);
            
            var ok = function(workitems) {
                Ti.API.log('we got ' + workitems.length + ' workitems :)');
                mycall(workitems);
            };
            var error = function(argument) {
                Ti.API.log("error - couldn't get workitems :()");
            };
            Polarium.trackerService.queryWorkitems(query,"id", ["id", "title", "status", "created", "description"], ok, error);
        });
    },
    login : function(argument){
        this.loginThen(argument);       
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
        
        this.loginThen(function() {
            Ti.API.log('global getprojects');
            var ok = function(projects) {
                Ti.API.log('start');
                Ti.API.log(projects);
            };
            var error = function(argument){
                Ti.API.log("error - couldn't get projects");
            };
            Polarium.projectService.getProjects(ok, error);
        });
    },
    getAssignables : function(){
        this.loginThen(function(){
            var ok = function(assignables) {
                Ti.API.log(assignables);
            };
            var error = function(argument) {
                Ti.API.log("error - couldn't get projects");
            };
            Polarium.trackerService.getAssignables(ok, error);
        });
    },
    getAllEnumOptionsForId : function(argument) {
        this.loginThen(function() {
            var ok = function(enumoptions) {
                Ti.API.log("OK getAllEnumOptionsForId");
                alert(enumoptions);
            };
            var error = function(argument) {
              alert('error');
            };
            Polarium.trackerService.getAllEnumOptionsForId("elibrary", "type", ok, error);
        });
    },
    loginThen : function(then) {
        credentials = getCredentials();
        Polarium.sessionService.login(
            credentials.username,
            credentials.pwd,
            function(arg) { then(arg); }, 
            function(err) { alert(err); });
    }
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

// function to retrieve query data form the database
var getQueryById = function(id){
    
    //open database
    var db = Ti.Database.open('PolarionApp');

    //retrieve data
    var queryData = db.execute('SELECT * FROM queries WHERE id IS ?', id);

    //create result object
    var query;

    if (queryData.isValidRow()) {
    
        var result = {
            name : queryData.fieldByName('name'),
            title : queryData.fieldByName('title'),
            status : queryData.fieldByName('status'),
            duedate : queryData.fieldByName('duedate'),
            timepoint : queryData.fieldByName('timepoint'),
            type : queryData.fieldByName('type'),
            author : queryData.fieldByName('author'),
            assignables : queryData.fieldByName('assignables'),
            custom : queryData.fieldByName('custom')
        };
        
        query = queryHelper('title',result.title)+' AND '+queryHelper('type',result.type)+' AND '+queryHelper('status',result.status)+' AND '+queryHelper('custom',result.custom)+' AND '+queryHelper('assignee.id',result.assignables)+' AND '+queryHelper('author.id',result.author);
        
        Ti.API.log('query: '+query);
            
    } else{
        query = null;
    }
    db.close();
    return query;
};

function queryHelper(title, value){
    var result;
    //expert mode ;)
    if (title === 'custom') {
        if (value === '' || value === null) {
            result = 'NOT '+title+':######NULL';
        } else{
            result = value;
        }
    }else{
        //is the value empty or null then set value to search ALL
        if (value === '' || value === null) {
            result = 'NOT '+title+':######NULL';
        } else{
            result = title+':'+value;
        }    
    }
    
    return result;
}

exports.GVUpdate  = function( globalVarName, globalVarValue )
{
    this.GV[globalVarName]    =   globalVarValue;
};

exports.GV = GV;