//private Variables, DEBUG & LOG Fn
var DEBUG = true;
var DEBUGXML = true;
var DEBUGPARSE = false;
var log = function(str) {
    Ti.API.log(str);
};
/**
 * returns List of Elements. IMPORTANT: Get Items of list via list.item(index). Not via Array[]! <br/>
 * @param {Object} Element
 * @param {String} tagname
 * @param {Function} errorcallback
 * @param {Boolean} isRequired
 */
var finds = function(element,tagname, errorcallback, required) {
    var list = element.getElementsByTagName(tagname);
    return list;
};
var find = function(element,tagname, errorcallback, required) {
    var list = finds(element,tagname, errorcallback, required);
    var item = list.item(0);
    
    return item;
};

var text = function(element, tagname, errorcallback, required) {
    var found = find(element, tagname);
    if (found == null) {
        if (required != null && required) {
            apiErrorHandler("Required Field of Element is null: "+tagname, 100, errorcallback);
        } else {
            apiWarnHandler("Field of element is null, returned empty: "+tagname, 100, errorcallback);       
        }
        return "";
    }
    
    if (DEBUGPARSE) {
        log(tagname + ": "+found.textContent);
    }
    
    return found.textContent;
};

var attr = function(element, attrname, errorcallback, required) {
    var attr = element.attributes.getNamedItem(attrname);
    var attrval = attr.nodeValue;
    if (element.attributes == null || attr == null || attrval == null ) {
        //if required = Error, else = Warn
        if (required != null && required) {
            apiErrorHandler("Required Attribute of Element is null: "+attrname, 100, errorcallback);
        } else {
            apiWarnHandler("Attribute of element is null, returned empty: "+attrname, 100, errorcallback);      
        }
    }
    
    return attrval;
}

var apiErrorHandler = function(msg, errcode, callback) {
    //log("API ERROR: ["+errcode+"] "+msg);
    //delegate error
    callback(msg, errcode);
}

var apiWarnHandler = function(msg, code, callback) {
    log("API WARN: ["+code+"] "+msg);
}

//CORE PART
//Global Variable
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


//Types
Polarium.types = {};
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

Polarium.types.User = function() {
    this.fromElement = function(el, errorcallback) {
        //TODO: check unresolvable attr! of el
        this.id = text(el,'id', errorcallback, true);
        this.name = text(el,'name', errorcallback, true);
        //TODO: parse Vote & Watch Sublist
        this.voteuris = text(el,'voteuris', errorcallback, false);
        this.watchuris = text(el,'watcheURIs', errorcallback, false);
        return this;
    };
    this.id = "";
    this.name = "";
    this.voteuris = "";
    this.watchuris = "";
};

/*
 * Session Web Service
 */
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
            sessionid = head.getText();
            
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


/*
 * Project Web Service
 */
Polarium.projectService = {};
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

Polarium.projectService.getUser = function(userid, callback, errorcallback) {
    Polarium.SOAP.send(
            Polarium.connection.getProjectService(),
            sessionid, 
            "<getUser><userID>"+userid+"</userID></getUser>",
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

/*
 * Tracker Web Service 
 */
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
                    u = new Polarium.types.User;
                    u.fromElement(node, errorcallback);
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

//commonjs style
exports.Polarium = Polarium;