// Private Vars
var self;
var VARS;
var table;
var tableRowValues = [];
//type of window
exports.type = "master";

//check if data for query exists in database
function checkLable(title){
	
	//open database
    var db = Ti.Database.open('PolarionApp');

    //retrieve data
    var queryData = db.execute('SELECT * FROM queries WHERE id IS ?', VARS.GV.currentWorkItemQueryID);

    //create result object
    var result;

    if (queryData.isValidRow()) {
    
        result = {
            name : queryData.fieldByName('name'),
            title : queryData.fieldByName('title'),
            status : queryData.fieldByName('status'),
            duedate : queryData.fieldByName('duedate'),
            timepoint : queryData.fieldByName('timepoint'),
            type : queryData.fieldByName('type'),
            author : queryData.fieldByName('author'),
            assignables : queryData.fieldByName('assignables'),
            custom : queryData.fieldByName('custom'),
        };

        db.close();

        if (title === 'Name'){
            return (result.name !== '' && result.name !== null) ? result.name : 'Query';
        } else if (title === 'Title'){
			return (result.title !== '' && result.title !== null) ? result.title : 'alle';
        } else if(title === 'Status'){
			return (result.status !== '' && result.status !== null) ? result.status : 'alle';
        } else if(title === 'Due Date'){
			return (result.duedate !== '' && result.duedate !== null) ? result.duedate : 'alle';
        } else if(title === 'Timepoint'){
			return (result.timepoint !== '' && result.timepoint !== null) ? result.timepoint : 'alle';
        } else if(title === 'Type'){
			return (result.type !== '' && result.type !== null) ? result.type : 'alle';
        } else if(title === 'Author'){
			return (result.author !== '' && result.author !== null) ? result.author : 'alle';
        } else if(title === 'Assignables'){
			return (result.assignables !== '' && result.assignables !== null) ? result.assignables : 'alle';
        } else if(title === 'Custom'){
			return (result.custom !== '' && result.custom !== null) ? result.custom : 'alle';
        } else{
			return 'alle';
        }
        
    
    } else{
		db.close();
        return 'alle';
    }
}

//some dummy data for our table view
var Data = [
	{title:'Title', getLable:checkLable, hasChild:true, callback:function function_name () {
		
		//open modal window
		Ti.App.fireEvent('notification',{ name:'openModalWindow', body:{'modalType':'query', 'modalTitle':'Title', 'params':'' } });

	}},
	{title:'Status', getLable:checkLable, hasChild:true, callback:function function_name () {
		
		//open modal window
		Ti.App.fireEvent('notification',{ name:'openModalWindow', body:{'modalType':'query', 'modalTitle':'Status', 'params':'' } });

	}},
	{title:'Due Date', getLable:checkLable, hasChild:true, callback:function function_name () {
		
		//open modal window
		Ti.App.fireEvent('notification',{ name:'openModalWindow', body:{'modalType':'query', 'modalTitle':'Due Date', 'params':'' } });

	}},
	{title:'Timepoint', getLable:checkLable, hasChild:true, callback:function function_name () {
		
		//open modal window
		Ti.App.fireEvent('notification',{ name:'openModalWindow', body:{'modalType':'query', 'modalTitle':'Timepoint', 'params':'' } });

	}},
	{title:'Type', getLable:checkLable, hasChild:true, callback:function function_name () {
		
		//open modal window
		Ti.App.fireEvent('notification',{ name:'openModalWindow', body:{'modalType':'query', 'modalTitle':'Type', 'params':'' } });

	}},
    {title:'Author', getLable:checkLable, hasChild:true, callback:function function_name () {
        
        //open modal window
        Ti.App.fireEvent('notification',{ name:'openModalWindow', body:{'modalType':'query', 'modalTitle':'Author', 'params':'' } });

    }},
    {title:'Assignables', getLable:checkLable, hasChild:true, callback:function function_name () {
        
        //open modal window
        Ti.App.fireEvent('notification',{ name:'openModalWindow', body:{'modalType':'query', 'modalTitle':'Assignables', 'params':'' } });

    }},
	{title:'Custom', getLable:checkLable, hasChild:true, callback:function function_name () {

		//open modal window
		Ti.App.fireEvent('notification',{ name:'openModalWindow', body:{'modalType':'query', 'modalTitle':'Custom', 'params':'' } });

	}}
];

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
		
	self.callback = function(){
		// fire global event
		Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'master', 'params':'' } });
	};
	
	// UI
	
	return self;
};


// Show View
exports.showView = function(){
	
	var lbl = Ti.UI.createLabel({
		top:11,
		font: { fontWeight:'bold',fontSize:24 },
		text: checkLable('Name')
	});
	lbl.callback = function(){
	    //open modal window
        Ti.App.fireEvent('notification',{ name:'openModalWindow', body:{'modalType':'query', 'modalTitle':'Name', 'params':'' } });
	};
	self.add(lbl);
	
	//create the table
	table = Ti.UI.createTableView({
		// data:tableData
	});

	//cool pull down - refresh feature
	var pulling = false;
	var reloading = false;

	function formatDate(){

		var date = new Date();
		var datestr = date.getMonth()+1+'/'+date.getDate()+'/'+date.getFullYear();
		if (date.getHours()>=12)
		{
			datestr+=' '+(date.getHours()===12 ? date.getHours() : date.getHours()-12)+':'+date.getMinutes()+' PM';
		}
		else
		{
			datestr+=' '+date.getHours()+':'+date.getMinutes()+' AM';
		}
		return datestr;
	}
	function beginReloading(){
	    VARS.GV.getWorkitems();
		// just mock out the reload
		setTimeout(endReloading,2000);
	}

	function endReloading(){
		// when you're done, just reset
		table.setContentInsets({top:0},{animated:true});
		reloading = false;
		lastUpdatedLabel.text = "Last Updated: "+formatDate();
		statusLabel.text = "Pull down to refresh...";
		actInd.hide();
		arrow.show();
	}

	table.addEventListener('scroll',function(e){
		var offset = e.contentOffset.y;
		if (offset < -65.0 && !pulling && !reloading)
		{
			var t = Ti.UI.create2DMatrix();
			t = t.rotate(-180);
			pulling = true;
			arrow.animate({transform:t,duration:180});
			statusLabel.text = "Release to refresh...";
		}
		else if((offset > -65.0 && offset < 0 ) && pulling && !reloading)
		{
			pulling = false;
			var s = Ti.UI.create2DMatrix();
			arrow.animate({transform:s,duration:180});
			statusLabel.text = "Pull down to refresh...";
		}    
	});

	table.addEventListener('scrollEnd', function(){	
		if(pulling && !reloading)
		{
			reloading = true;
			pulling = false;
			arrow.hide();
			actInd.show();
			statusLabel.text = "Reloading...";
			table.setContentInsets({top:60},{animated:true});
			table.scrollToTop(-60,true);
			arrow.transform=Ti.UI.create2DMatrix();
			beginReloading();
		}
	});

	var border = Ti.UI.createView({
		backgroundColor:"#576c89",
		height:2,
		bottom:0
	});

	var tableHeader = Ti.UI.createView({
		backgroundColor:"#e2e7ed",
		width:320,
		height:60
	});

	// fake it til ya make it..  create a 2 pixel
	// bottom border
	tableHeader.add(border);

	var arrow = Ti.UI.createView({
		backgroundImage:"assets/images/arrow_down.png",
		width:23,
		height:60,
		bottom:10,
		left:12
	});

	var statusLabel = Ti.UI.createLabel({
		text:"Pull to reload",
		left:40,
		width:200,
		bottom:30,
		height:"auto",
		color:"#576c89",
		textAlign:"center",
		font:{fontSize:13,fontWeight:"bold"},
		shadowColor:"#999",
		shadowOffset:{x:0,y:1}
	});

	var lastUpdatedLabel = Ti.UI.createLabel({
		text:"Last Updated: "+formatDate(),
		left:40,
		width:200,
		bottom:15,
		height:"auto",
		color:"#576c89",
		textAlign:"center",
		font:{fontSize:12},
		shadowColor:"#999",
		shadowOffset:{x:0,y:1}
	});

	var actInd = Titanium.UI.createActivityIndicator({
		left:12,
		bottom:13,
		width:30,
		height:30
	});

	tableHeader.add(arrow);
	tableHeader.add(statusLabel);
	tableHeader.add(lastUpdatedLabel);
	tableHeader.add(actInd);

	table.headerPullView = tableHeader;

	var customTableData = [];
	var i;
	for (i = 0; i < Data.length; i++) {
		var row = Titanium.UI.createTableViewRow({
			height:50
		});

		var rowTitle = Titanium.UI.createLabel({
			text: Data[i].title,
			font:{fontSize:16,fontWeight:'bold'},
			width:'auto',
			textAlign:'left',
			// top:2,
			left:10,
			height:'auto'
		});

		var rowValue =  Titanium.UI.createLabel({
			// text: 'alle',
			text: Data[i].getLable(Data[i].title),
			font:{fontSize:12,fontWeight:'bold'},
			width:'auto',
			textAlign:'left',
			// bottom:0,
			left:130,
			height:'auto'
		});
		
		row.add(rowValue);
		row.add(rowTitle);
		row.hasChild = Data[i].hasChild;

		//define callbacks. title and value have to be clickable, too.
		rowValue.callback = Data[i].callback;
		rowTitle.callback = Data[i].callback;
		row.callback = Data[i].callback;

		tableRowValues.push(rowValue);
		customTableData.push(row);
	}
	table.setData(customTableData);

	self.add(table);
		
	// Show Stuff
	self.show();
};


// Hide View
exports.hideView = function(){

	VARS.GV.removeAllChildren(self);

	// Hide Stuff
	self.hide();
};

