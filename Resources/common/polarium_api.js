/* Polarium API
 * @author: sbejga 
 */

//====================================================================
// DEBUG
//====================================================================

var DEBUG = true;
var DEBUGXML = true;
var DEBUGPARSE = false;
var DEBUGFN = false;

var lastRequest = null;
var lastResponse = null;

//====================================================================
// Private Shortcut Functions
//====================================================================

var log = function(str) {
    if (DEBUG && console && console.log) {
        console.log(str);
    }
};
/**
 * Privat Shortcut Function: returns List of Elements. 
 * IMPORTANT: Get Items of list via list.item(index). Not via Array[]! <br/>
 * @param {Object} Element
 * @param {String} tagname
 * @param {Function} errorcallback
 * @param {Boolean} isRequired
 */
var finds = function(element,tagname, errorcallback, required) {
    if (element == undefined || element == null) {
        if (DEBUGFN) log("element to find '"+tagname+"' is null.");
        return null;
    }
    var list = element.getElementsByTagName(tagname);
    return list;
};

/**
 * Privat Shortcut Function: returns single item found in element by given tagname.  Uses finds(...)
 * IMPORTANT: No check if it exists. return could be undefined or null. <br/>
 * @param {Object} Element
 * @param {String} tagname
 * @param {Function} errorcallback
 * @param {Boolean} isRequired
 */
var find = function(element,tagname, errorcallback, required) {
    var list = finds(element,tagname, errorcallback, required);
    var item = list.item(0);
    
    return item;
};

/**
 * Privat Shortcut Function: returns text value of single item found in element by given tagname. Uses find(...)  <br/>
 * @param {Object} Element
 * @param {String} tagname
 * @param {Function} errorcallback
 * @param {Boolean} isRequired
 */
var text = function(element, tagname, errorcallback, required) {
    var found = find(element, tagname);
    if (found == null) {
        if (required != null && required) {
            apiErrorHandler("Required Field of Element is null: "+tagname, 100, errorcallback);
        } else {
            if (DEBUGFN)
                log("[DEBUG] Field of element '"+element+"'is null, returned empty: "+tagname);     
        }
        return null;
    }
    
    if (DEBUGPARSE) {
        log(tagname + ": "+found.textContent);
    }
    
    return found.textContent;
};

/**
 * Privat Shortcut Function: returns attribute value found in element by given name. <br/>
 * @param {Object} Element
 * @param {String} attrname - Attributes name to find
 * @param {Function} errorcallback
 * @param {Boolean} isRequired
 */
var attr = function(element, attrname, errorcallback, required) {
    if (element === undefined || element === null 
        || attrname === undefined || attrname === null ) {
            return null;
    }
    
    if (element.attributes === null || element.attributes == undefined
        || element.attributes.getNamedItem(attrname) === null 
        || element.attributes.getNamedItem(attrname) === undefined) {
        
        //if required = Error, else = Warn
        if (required != null && required) {
            apiErrorHandler("Required Attribute of Element is null: "+attrname, 100, errorcallback);
        } else {
            apiWarnHandler("Attribute of element is null, returned empty: "+attrname, 100, errorcallback);      
        }
        return null;        
    }
        
    var attr = element.attributes.getNamedItem(attrname);
    var attrval = attr.nodeValue;
    
    //return val
    return attrval;
}

/**
 * Error Handler as Proxy to make a console ouput within API.
 * @param {String} message to print
 * @param {String} errcode to identify error quick
 * @param {Function} Further Callback to call after.
 */
var apiErrorHandler = function(msg, errcode, callback) {
    log("API ERROR: ["+errcode+"] "+msg);
    //delegate error
    callback(msg, errcode);
}

/**
 * Warn Handler as Proxy to make a console ouput within API.
 * @param {String} message to print
 * @param {String} Code to identify error quick
 * @param {Function} Further Callback to call after.
 */
var apiWarnHandler = function(msg, code, callback) {
    log("API WARN: ["+code+"] "+msg);
}


//====================================================================
// Core Polarium
//====================================================================

var Polarium = {};

//API Version
Polarium.VERSION = "v0.1a";

Polarium.connection = {
    protocol: "http",
    host: "mito.stranged.de",
    port: 80,
    path: "/polarion/",
    setProtocol: function(protocolstring) {
        this.protocol = protocolstring;
    },
    setHost: function(hostring) {
        this.host = hostring;
    },
    setPort: function(portint) {
        this.port = portint;
    },
    setPath: function(pathstr) {
        this.path = pathstr;
    },
    getUrl: function() {
        return this.protocol + "://" + this.host + ":" + this.port + this.path;
    },
    getSessionService: function() {
        return this.getUrl() + "ws/services/SessionWebService";
    },
    getProjectService: function() {
        return this.getUrl() + "ws/services/ProjectWebService";
    },
    getTrackerService: function() {
        return this.getUrl() + "ws/services/TrackerWebService";
    }
};
Polarium.SOAP = {
    envelope: function(session, body) {
        var xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"+
                "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "+
                        "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" "+
                        "xmlns=\"http://ws.polarion.com/SessionWebService\">";
        if (session != null) {
            xml +=      "<soap:Header>"+
                        "<ns1:sessionID xmlns:ns1=\"http://ws.polarion.com/session\">"+
                          session+
                        "</ns1:sessionID>"+
                        "</soap:Header>";
        }
            xml +=      "<soap:Body>"+
                                body+
                        "</soap:Body>"+
                "</soap:Envelope>";
                
        if (DEBUGXML) {
            lastRequest = xml;
            log(xml);
        }
        
        return xml;
    },
    send: function(url, session, body, donecallback, errorcallback) {
        
        //titanium style - create a httpclient 
        var client = Ti.Network.createHTTPClient({
            // function called when the response data is available
            onload : function(e) {
                if (client.readyState === 4 && client.status === 200) {
                    //get doc
                    var doc = this.responseXML.documentElement;
                    
                    if (DEBUGXML) {
                        lastResponse = this.responseXML;
                        log(""+this.responseText);
                    }
                    
                    donecallback(doc);
                } else {
                    errorcallback("Server Error: Unexpected HTTP Code",300);
                }
            },
            // function called when an error occurs, including a timeout
            onerror : function(e) {
                Ti.API.debug(e.error);
                    errorcallback("Connection Error: No Internet connection or Server unavailable",200);
            },
            timeout : 5000  //ms
        });
    
        client.open('POST',url);
        //set the headers
        client.setRequestHeader('SOAPAction','Hello');
        client.setRequestHeader('Content-Type','text/xml');
        //send the request
        client.send(Polarium.SOAP.envelope(session, body));
    }
};


//====================================================================
// Types
//====================================================================

Polarium.types = {};

/**
 * Type: Text
 * {String} texttype
 * {String} content
 * {Boolean} contentLossy
 * targetNamespace: http://ws.polarion.com/types/Text
 */
Polarium.types.Text = function() {
    this.texttype = null; //string
    this.content = null; //string
    this.contentLossy = null; //boolean
}


/**
 * creates new Polarium.types.Text 
 * @param {Element} NodeElement
 * @param {Function} Error Callback
 * @returns {Text} newText
 */
Polarium.types.createText = function(el, error) {
    if (DEBUGFN) log("createText for el '"+el+"'");
    
    var newText = new Polarium.types.Text;
    newText.texttype = text(el, 'type', error, true);
    newText.content = text(el, 'content', error, true);
    newText.contentLossy = text(el, 'contentLossy', error, true);
    //check type of contentLossy 
    if (newText.contentLossy == "true") newText.contentLossy = true;
    else if (newText.contentLossy == "false") newText.contentLossy = false;
    else {
        error("required field 'contentLossy' of type 'boolean' is not valid", 10);
    }
    return newText;
};

/**
 * creates Date by ISO Date String 
 * @param {String} ISO DateString (e.g. "2012-03-21")
 * @param {Function} Error Callback
 * @returns {Date} newDate
 */
Polarium.types.createDate = function(str, error) {
    var newText = new Date();
    
    var time = Date.parse(str);
    newText.setTime(time);
    if (newText != undefined && newText != null)
        return newText;
    else {
        error("Error while parsing date '"+str+"'","30");
        return null;
    }
};

Polarium.types.WorkItem = function() {
    this.fromElement = function(el, errorcallback) {
        this.id = text(el,'id', errorcallback, true);
        this.title = text(el,'title', errorcallback, true);
        // this.author = text(el,'author'); //TODO: WorkItem.author
        this.created = text(el,'created', errorcallback, true);
        this.updated = text(el,'updated', errorcallback, false);
        this.status = text(el,'status', errorcallback, false); //TODO: true
        this.description = text(el,'description', errorcallback, false);
        //TODO: WorkItem.comments, WorkItem.attachments, WorkItem.hyperlinks
        // this.comments = el.find('comments').text();
        // this.attachments = el.find('attachments').text();
        // this.hyperlinks = el.find('hyperlinks').text();
        
        //uri
        this.uri = attr(el, "uri", errorcallback, true);
        
        log("created WorkItem from Element: "+this.id);
        return this;
    }
    this.id = "";
    this.title = "";
    this.author = "";
    this.created = "";
    this.updated = "";
    this.status = "";
    this.description = "";
    this.comments = [];
    this.attachments = [];
    this.hyperlinks = [];
    this.uri = "";
};

Polarium.types.Property = function() {
    this.key = "";
    this.value = "";
    this.fromElement = function(el, error) {
        this.key = text(el,'key', error, true);
        this.value = text(el,'value', error, true);
        return this;
    }
}

Polarium.types.EnumOption = function() {
    //String Output
    this.toString = function() {
        
    };
    //construct from XML NodeElement
    this.fromElement = function(el, error) {
        
        this.id = text(el,'id', error, true);
        this.enumid = text(el,'enumId', error, true);
        this.isDefault = text(el,'default', error, true);
        this.hidden = text(el,'hidden', error, true);
        this.name = text(el,'name', error, true);
        this.phantom = text(el,'phantom', error, true);
        this.sequencenumber = text(el,'default', error, true);
        
        //Properties, each Property
        var props = finds(el,'property',error, true);
        for (var i=0; i<props.length; i++) {
            var prop = new Polarium.types.Property;
            this.properties[i] = prop.fromElement(props.item(i), error);
        }

        return this;
    };
    
    this.enumid = "";
    this.isDefault = "";
    this.hidden = "";
    this.id = "";
    this.name = "";
    this.phantom = "";
    this.sequencenumber = "";
    this.properties = [];
    
}

Polarium.types.Project = function() {
    this.toString = function() {
        return "[Project id:"+this.id+"]";
    };
    this.fromElement =  function(p) {
        this.id = find(p, 'id').textContent; //text
        this.active = find(p,'active').textContent == "true" ? true : false;
        // var desc = find(p,'description');
        // this.description = find(desc,'content').textContent;
        this.location = find(p,'location').textContent;
        this.name = find(p,'name').textContent;
        this.projectgroupuri = find(p,'projectGroupURI').textContent;
        // this.start = find(p,'start').textContent;
        // this.prefix = find(p,'trackerprefix').textContent;
        // var lead = find(p,'lead');
        // this.lead = find(lead,'id').textContent;
        this.isResolved = true; //should be overridden if not. (e.g. in getProjects by projectGroups)
        
        console.log('created project object: '+this.id);
        return this;
    };
    this.id = "";
    this.active = "";
    this.description = "";
    this.location = "";
    this.name = "";
    this.projectgroupuri = "";
    this.start = "";
    this.prefix = "";
    this.lead = "";
    this.isResolved = false; //all obligatory fields are set
    return this;
};

/**
 * type: Timepoint
 * {String} uri
 * {Boolean} unresolvable
 * {String} id
 * {String} name
 * {Date} date
 * {Date} earliestPlannedStart
 * {Boolean} closed
 * {Text} description
 * targetNamespace: http://ws.polarion.com/TrackerWebService-types/Timepoint
 */
Polarium.types.Timepoint = function() {
    this.uri = null;
    this.unresolvable = null;
    this.id = null;
    this.name = null;
    this.date = null;
    this.earliestPlannedStart = null;
    this.closed = null;
    this.description = null;
};

/**
 * Create new Polarium.types.Timepoint
 * @param {NodeElement} Element
 * @param {Function} Error Callback
 * @returns {Timepoint} newTimepoint
 */
Polarium.types.createTimepoint = function(el, error) {
    var newTimepoint = new Polarium.types.Timepoint();

    //Attr
    newTimepoint.uri = attr(el,'uri', error, true);
    newTimepoint.unresolvable = attr(el,'unresolvable', error, true);

    //subelements
    newTimepoint.id = text(el,'id', error, true);
    newTimepoint.name = text(el, 'name', error, false);
    newTimepoint.closed = text(el, 'closed', error, false);
    
    //Subelement Date
    var tpdate = text(el, 'date', error, false);
    if (tpdate != undefined && tpdate != null)
        newTimepoint.date = Polarium.types.createDate(tpdate, error);
    
    
    //Subelement Date earlyStart
    var earlystart = text(el, 'earliestPlannedStart', error, false);
    if (earlystart != undefined && earlystart != null)
        newTimepoint.earliestPlannedStart = Polarium.types.createDate(earlystart, error);
    
    //Subelement Text Desc
    var desc = find(el, 'description', error, false);
    if (desc != undefined && desc != null) {
        newTimepoint.description = Polarium.types.createText(desc, error);  
    }
    
    return newTimepoint;
};

/**
 * Type: User <br/>
 * {String} id
 * {String} name
 * {String} email
 * {Text} description 
 * {Boolean} unresolvable
 * Props unimplemented: voteuris, watchuris
 * targetNamespace: http://ws.polarion.com/ProjectWebService-types/User
 */
Polarium.types.User = function() {
    this.id = null;
    this.name = null;
    this.email = null;
    this.description = null;
    this.voteuris = [];
    this.watchuris = [];
    this.unresolvable = null;
};

/**
 * Creates new Polarium.types.User
 * 
 * @param {Element} NodeElement
 * @param {Function} Error Callback
 * @returns {User} newUser
 */
Polarium.types.createUser = function(el, error) {
    var newUser = new Polarium.types.User();
        
    newUser.id = text(el,'id', error, true);
    newUser.name = text(el,'name', error, true);
    newUser.email = text(el, 'email', error, false);
    
    //{Text} Description Subobject
    var descriptionText = find(el,'description',error, false);
    if (descriptionText) { 
        newUser.description = Polarium.types.createText(descriptionText, error);
    }
    
    //Vote List
    var voteuri = find(el,'voteURIs', error, false);
    if (voteuri != undefined && voteuri != null) {
        var voteuris = finds(voteuri,'SubterraURI', error, false);
        for(var i=0; i<voteuris.length; i++) {
            newUser.voteuris[i] = voteuris.item(i).textContent;
        }
    }
    
    //Watch List
    var watchuri = find(el,'watcheURIS', error, false);
    if (watchuri != undefined && watchuri != null) {
        var watchuris = finds(watchuri,'SubterraURI', error, false);
        for(var i=0; i<watchuris.length; i++) {
            newUser.watchuris[i] = watchuris.item(i).textContent;
        }
    }
    
    var unresolvable = attr(el,'unresolvable',error,true);
    if (unresolvable === "true") {
        log("Element of type 'User' is unresolvable");
        newUser.unresolvable = true;
    } else {
        newUser.unresolvable = false;
    }
    
    return newUser;
}


//====================================================================
// Session Web Service 
//====================================================================

Polarium.sessionService = {
    username: "",
    password: "",
    isLogin: false,
    session: null,
    login: function(u, p, donecallback, errorcallback) {
        log("--- sessionService Login ---");
        
        var _username = u;
        var _password = p;
        if (!u) {
            _username = this.username;
        } else {
            this.username = u;
        }
        if (!p) {
            _password = this.password;
        } else {
            this.password = p;
        }
        
        //internal login callback
        var logindelegate = function(doc) {
            //head
            var head = doc.getFirstChild();
            //get session id
            sessionid = head.textContent;
            
            //save session
            this.session = sessionid;
            this.isLogin = true;
            
            //log
            log("login success. session: "+sessionid);
            
            //call futher delegation callback
            donecallback(sessionid);
        };
        
        var loginerrdelegate = function(msg, errcode) {
            this.session = null;
            this.isLogin = false;
            
            //call api error handler with further callback of application layer
            apiErrorHandler(msg, errcode, errorcallback);
        }
        
        //send login SOAP
        Polarium.SOAP.send(
            Polarium.connection.getSessionService(), 
            null, 
            "<logIn><userName>"+_username+"</userName><password>"+_password+"</password></logIn>",
            logindelegate,
            loginerrdelegate
        );
    },
    logout: function(donecallback, errorcallback) {
        //internal login callback
        var ok = function(doc) {
            
            //TODO: tag with 'endSessionResponse'
            //check logout success via same session? 
            //But keep in mind, logout could already occured via timeout.
            //TODO: auto-relogin?
            //implement method 'hasSubject' : true/false to check if there is a logged in user for session?
            
            //log
            log("logout response");
            
            //reset session
            this.session = null;
            this.isLogin = false;
            
            //call futher delegation callback
            donecallback();
        };
        
        var fail = function(msg, errcode) {
            //call api error handler with further callback of application layer
            apiErrorHandler(msg, errcode, null);
            errorcallback("Logout not successful.", errcode);
        }
        
        //send logout SOAP (endSession)
        Polarium.SOAP.send(
            Polarium.connection.getSessionService(), 
            null, 
            "<endSession/>",
            ok,
            fail
        );
    }
};

//====================================================================
// Project Web Service 
//====================================================================

Polarium.projectService = {};

Polarium.projectService.getUser = function(userid, callback, errorcallback) {
    Polarium.SOAP.send(
            Polarium.connection.getProjectService(),
            sessionid, 
            "<getUser><userID>"+userid+"</userID></getUser>",
            //TODO: FIX getUser callback without jquery
            function(data, status, xhr) {
                var node = $(xhr.responseXML.getElementsByTagName('getUserReturn')[0]);
                var user = Polarium.types.User.fromElement(node);
                
                //Debug 
                if (DEBUG) {
                    console.log('ProjectService getUser:')
                    console.log(node)
                    console.log(user);
                }
                
                //Return 
                callback(user);
            },
            function(msg, code) {
                //call api error handler with further callback of application layer
                apiErrorHandler(msg, errcode, errorcallback);
            }
    );
};

Polarium.projectService.getUsers = function(callback, errorcallback) {
    log("--- getUsers ---");
    
    Polarium.SOAP.send(
            Polarium.connection.getProjectService(),
            sessionid, 
            "<getUsers/>",
            function(doc) {
                var nodes = doc.getElementsByTagName('getUsersReturn');
                var users = Array();
                for(var i=0, j=nodes.length; i<j; i++) {
                    var node = nodes.item(i);
                    u = Polarium.types.createUser(node, errorcallback);
                    users[i] = u;
                }
                
                //Debug 
                log('getUsers returned: '+users.length+' Users');
                
                //Return 
                callback(users);
            },
            function(msg, code) {
                //call api error handler with further callback of application layer
                apiErrorHandler(msg, errcode, errorcallback);
            }
    );
};

Polarium.projectService.getProjectUsers = function(projectid, callback, errorcallback) {
    log("--- projectService: getProjectUsers ---");
    
    Polarium.SOAP.send(
            Polarium.connection.getProjectService(),
            sessionid, 
            "<getProjectUsers>"+
                "<projectID>"+projectid+"</projectID>"+
            "</getProjectUsers>",
            function(doc) {
                var nodes = doc.getElementsByTagName('getProjectUsersReturn');
                var users = Array();
                for(var i=0, j=nodes.length; i<j; i++) {
                    var node = nodes.item(i);
                    u = Polarium.types.createUser(node, errorcallback);
                    users[i] = u;
                }
                
                //Debug 
                log('getProjectUsers returned: '+users.length+' Users');
                
                //Return 
                callback(users);
            },
            function(msg, code) {
                //call api error handler with further callback of application layer
                apiErrorHandler(msg, errcode, errorcallback);
            }
    );
};

Polarium.projectService.getProject = function(projectid, callback, errorcallback) {
    Polarium.SOAP.send(
            Polarium.connection.getProjectService(), 
            sessionid, 
            "<getProject><projectID>"+projectid+"</projectID></getProject>",
            function(data, status, xhr) {
                var projectNode = $(xhr.responseXML.getElementsByTagName('getProjectReturn')[0]);
                var proj = Polarium.types.Project.fromElement(projectNode);
                
                //Return Project
                callback(proj);
            },
            function(msg, code) {
                //call api error handler with further callback of application layer
                apiErrorHandler(msg, errcode, errorcallback);
            }
    );
};

Polarium.projectService.getProjects = function(callback, errorcallback) {
    log("--- projectService: getProjects ---");
    
    Polarium.SOAP.send(
            Polarium.connection.getProjectService(),
            sessionid, 
            //"<getUser><userID>"+userid+"</userID></getUser>",
            "<getDeepContainedProjects><projectGroupURI>"+
                //is root project URI  //via SOAP:getRootProjectGroup
                "subterra:data-service:objects:/default/${ProjectGroup}Group"+
            "</projectGroupURI></getDeepContainedProjects>",
            function(doc) {
                var nodes = doc.getElementsByTagName('getDeepContainedProjectsReturn');
                var projects = Array();
                for(var i=0, j=nodes.length; i<j; i++) {
                    var node = nodes.item(i);
                    proj = new Polarium.types.Project;
                    proj.fromElement(node);
                    proj.isResolved = false; //not all fields of project proto in response
                    projects[i] = proj;
                }
                
                //Debug 
                log("projects returned: "+projects.length);
                
                //Return 
                callback(projects);
            },
            function(msg, code) {
                //call api error handler with further callback of application layer
                apiErrorHandler(msg, errcode, errorcallback);
            }
    );
};


//====================================================================
// Tracker Web Service 
//====================================================================

Polarium.trackerService = {};

/**
 * Query WorkItems with Sort Criterium and Array of wanted Fields. <br/>
 * Do not forget, that WorkItems will only have fields resolved which where requested!
 * 
 * Default fields if Param null: id
 * 
 * @param {Object} query
 * @param {Object} sort
 * @param {Object} fields if null default fields
 * @param {Object} callback
 * @param {Object} errorcallback
 */
Polarium.trackerService.queryWorkitems = function(query, sort, fields, callback, errorcallback) {
    log('--- TrackerService queryWorkitems ---');
    
    var fieldstr = "";
    for(var i=0,j=fields.length; i<j; i++){
      fieldstr += "<fields>"+fields[i]+"</fields>";
    };
    if (fieldstr == "") fieldstr = "<fields>id</fields>";
    
    Polarium.SOAP.send(
            Polarium.connection.getTrackerService(),
            sessionid, 
            "<queryWorkItems>"+
                "<query>"+query+"</query>"+
                "<sort>"+sort+"</sort>"+
                fieldstr+
            "</queryWorkItems>",
            function(doc) {
                var nodes = doc.getElementsByTagName('queryWorkItemsReturn');
                var workitems = Array();
                for(var i=0, j=nodes.length; i<j; i++) {
                    var node = nodes.item(i);
                    wi = new Polarium.types.WorkItem;
                    wi.fromElement(node, errorcallback);
                    workitems[i] = wi;
                }
                
                //Debug 
                log("workitems returned: "+workitems.length);
                
                //Return Project
                callback(workitems);
            },
            function(msg, code) {
                //call api error handler with further callback of application layer
                apiErrorHandler(msg, errcode, errorcallback);
            }
    );
};
    
Polarium.trackerService.getAllowedAssignees = function(workitemuri, callback, errorcallback) {
    Polarium.SOAP.send(
            Polarium.connection.getTrackerService(),
            sessionid, 
            "<getAllowedAssignees>"+
                "<workitemURI>"+workitemuri+"</workitemURI>"+
            "</getAllowedAssignees>",
            function(doc) {
                var nodes = doc.getElementsByTagName('getAllowedAssigneesReturn');
                var users = Array();
                var u;
                for(var i=0, j=nodes.length; i<j; i++) {
                    var node = nodes.item(i);
                    u = new Polarium.types.createUser(node, errorcallback);
                    users[i] = u;
                }
                
                //Debug 
                log("users returned: "+users.length);
                
                //Return Project
                callback(users);
            },
            function(msg, code) {
                //call api error handler with further callback of application layer
                apiErrorHandler(msg, errcode, errorcallback);
            }
    );
};

Polarium.trackerService.getAllEnumOptionsForId = function(projectid, enumid, callback, errorcallback) {
    Polarium.SOAP.send(
            Polarium.connection.getTrackerService(),
            sessionid, 
            "<getAllEnumOptionsForId>"+
                "<projectID>"+projectid+"</projectID>"+
                "<enumID>"+enumid+"</enumID>"+
            "</getAllEnumOptionsForId>",
            function(doc) {
                var nodes = doc.getElementsByTagName('getAllEnumOptionsForIdReturn');
                var enumoptions = Array();
                var enumoption;
                for(var i=0, j=nodes.length; i<j; i++) {
                    var node = nodes.item(i);
                    enumoption = new Polarium.types.EnumOption;
                    enumoption.fromElement(node, errorcallback);
                    enumoptions[i] = enumoption;
                }
                
                //Debug 
                log("enumoptions returned: "+enumoptions.length);
                
                //Return Project
                callback(enumoptions);
            },
            function(msg, code) {
                //call api error handler with further callback of application layer
                apiErrorHandler(msg, errcode, errorcallback);
            }
    );
};

/**
 * Get Timepoints of Project
 * @param {String} projectid
 * @param {Function} callback
 * @param {Function} error
 */
Polarium.trackerService.getTimepoints = function(projectid, callback, error) {
    Polarium.SOAP.send(
            Polarium.connection.getTrackerService(),
            sessionid, 
            "<getTimepoints>"+
                "<projectID>"+projectid+"</projectID>"+
            "</getTimepoints>",
            function(doc) {
                var nodes = doc.getElementsByTagName('getTimepointsReturn');
                log(nodes);
                var tps = Array();
                for(var i=0, j=nodes.length; i<j; i++) {
                    var node = nodes.item(i);
                    var tp = Polarium.types.createTimepoint(node, error);
                    tps[i] = tp;
                }
                
                //Debug 
                log("getTimepoints returned: "+tps.length+" timepoints");
                
                //Return Project
                callback(tps);
            },
            function(msg, code) {
                //call api error handler with further callback of application layer
                apiErrorHandler(msg, errcode, error);
            }
    );
};


//====================================================================
// Public Access 
//====================================================================

//commonjs style
exports.Polarium = Polarium;