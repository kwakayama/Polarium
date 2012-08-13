
//private Variables
var DEBUG = true;
var x;
var sessionID;

//Global Variable
var Polarium = {};

Polarium.connection = {
	protocol: "http",
	host: "mito.stranged.de",
	port: 80,
	path: "/polarion/",
	getUrl: function() {
		return this.protocol + "://" + this.host + ":" + this.port + this.path;
	},
	getSession: function() {
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
        if (session !== null) {
        	xml += 		"<soap:Header>"+
					    "<ns1:sessionID xmlns:ns1=\"http://ws.polarion.com/session\">"+
					      session+
					    "</ns1:sessionID>"+
					    "</soap:Header>";
        }
			xml +=	    "<soap:Body>"+
                                body+
                        "</soap:Body>"+
                "</soap:Envelope>";
        return xml;
	},
	send: function(url, session, body, donecallback, errorcallback) {
		//console.log("envelope:");
		//console.log(Polarium.SOAP.envelope(session, body));

		var client = Ti.Network.createHTTPClient();
		/*client.onload = function(){

			if(client.readyState === 4 && client.status === 200) {
				alert("success :) "+this.responseText);
				
				//get doc
				var doc = this.responseXML.documentElement;
				//get session id
				alert(doc.getFirstChild().getText());
				//get soapenv header
				// var heads = $(xmldoc.children().get(0));
				//get session id
				// sessionid = $(heads.children().get(0)).text();


			}else {
				alert("Oh no a httpclient-error :(");
			}
		};*/
		client.onload = donecallback;
		client.onerror = errorcallback;
		client.open('POST',url);
		client.setRequestHeader('SOAPAction','Hello');
		client.setRequestHeader('Content-Type','text/xml');
		client.send(Polarium.SOAP.envelope(session, body));

		// $.ajax({
		// 	url: url,
		// 	headers: {"SOAPAction": "Hello"},
		// 	data: Polarium.SOAP.envelope(session, body),
		// 	type: "POST",
		// 	success: donecallback,
		// 	error: errorcallback,
		// 	contentType: "text/xml"
		// });
	}
};

Polarium.types = {};

//Types
Polarium.types.WorkItem = function() {
	this.fromElement = function(el) {
		this.id = el.find('id').first().text();
		this.title = el.find('title').text();
		this.author = el.find('author').text();
		this.created = el.find('created').text();
		this.updated = el.find('updated').text();
		this.status = el.find('status').text();
		this.description = el.find('description').text();
		// this.comments = el.find('comments').text();
		// this.attachments = el.find('attachments').text();
		// this.hyperlinks = el.find('hyperlinks').text();
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
};
Polarium.types.Session = {
	username: "",
	password: "",
	login: function(u, p, donecallback, errorcallback) {
		var _username = u;
		var _password = p;
		if (!u) {
			_username = this.username;
		}
		if (!p) {
			_password = this.password;
		}
		Polarium.SOAP.send(
			Polarium.connection.getSession(), 
			null, 
			"<logIn><userName>"+_username+"</userName><password>"+_password+"</password></logIn>",
			donecallback,
			errorcallback
		);
	}
};
Polarium.types.Project = {
	fromElement: function(p) {
		this.id = p.find('id').first().text();
		this.active = p.find('active').text() == "true" ? true : false;
		this.description = p.find('description').find('content').text();
		this.location = p.find('location').text();
		this.name = p.find('name').text();
		this.projectgroupuri = p.find('projectGroupURI').text();
		this.start = p.find('start').text();
		this.prefix = p.find('trackerprefix').text();
		this.lead = p.find('lead').find('id').text();
		console.log('created project object: '+this.id);
		return this;
	},
	id: "",
	active: "",
	description: "",
	location: "",
	name: "",
	projectgroupuri: "",
	start: "",
	prefix: "",
	lead: ""
};

Polarium.types.User = {
	fromElement: function(el) {
		this.id = el.find('id').text();
		this.name = el.find('name').text();
		this.voteuris = el.find('voteuris').text();
		this.watchuris = el.find('voteuris').text();
		return this;
	},
	id: "",
	name: "",
	voteuris: "",
	watchuris: ""
};

/*
 * Project Web Service
 */
Polarium.projectService = {};
Polarium.projectService.getProject = function(projectid, callback) {
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
			function(data,status,xhr) {
				alert("error: "+data);
			}
	);
};

Polarium.projectService.getUser = function(userid, callback) {
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
			function(data,status,xhr) {
				alert("error: "+data);
			}
	);
};

/*
 * Tracker Web Service 
 */
Polarium.trackerService = {};
Polarium.trackerService.queryWorkitems = function(query, sort, fields, callback) {
	var fieldstr = "";
	$(fields).each(function(i,el) {
		fieldstr += "<fields>"+el+"</fields>";
	})
	if (fieldstr == "") fieldstr = "id";
	
	Polarium.SOAP.send(
			Polarium.connection.getTrackerService(),
			sessionid, 
			"<queryWorkItems>"+
				"<query>"+query+"</query>"+
				"<sort>"+sort+"</sort>"+
				fieldstr+
			"</queryWorkItems>",
			function(data, status, xhr) {
				var nodes = $(xhr.responseXML.getElementsByTagName('queryWorkItemsReturn'));
				x = nodes;
				var workitems = Array();
				nodes.each(function(i,el) {
					wi = new Polarium.types.WorkItem;
					wi.fromElement($(el));
					workitems[i] = wi;
					
				});
				
				//Debug User
				if (DEBUG) {
					console.log('TrackerService queryWorkitems:')
					console.log(nodes)
					console.log(workitems);
				}
				
				//Return Project
				callback(workitems);
			},
			function(data,status,xhr) {
				alert("error: "+data);
			}
	);
};
Polarium.logintoPolarium = function loginIntoPolarion(username, pwd, callback) {
	this.types.Session.login(
		username, 
		pwd,
		function(data, state, xhr) {
			// alert("success");
			
			//get doc
			var doc = this.responseXML.documentElement;
			//get session id
			sessionID = doc.getFirstChild().getText();
			// alert(sessionID);
			Ti.API.log(sessionID);

			//do sth after, if callback is set
			if (callback !== null) {
				return callback();
			} else {
				return true;
			}
		},
		function(data, state, xhr) {
			alert("error")
			alert($(data));
			return false;
		}
	);
}

exports.Polarium = Polarium;