//Private Vars
var self,
    VARS,
    lbl,
    actInd,
    table,
    hasQueryData = false;
    
//type of window
exports.type = "detail";

function trimTitle (string) {
    var trimmedString
    if (string.length > 60) {
        var length = 60;
        trimmedString = string.substring(0, length);
        trimmedString += '...';    
    }else{
        trimmedString = string;
    }
    
    return trimmedString;
}

//eventlistener for project popover
Titanium.App.addEventListener('createQueryDetailTable',function(arg){
    
    //hide loading animation
    actInd.hide();
    
    var workitems = arg.workitems;
    
    lbl.text = 'Query Results: ('+workitems.length+')';
        
    var customTableData = [];
    var key;
    for (key in workitems) {
        var obj = workitems[key];
        Ti.API.log('title: '+obj.title);
        Ti.API.log('status: '+obj.status);
        Ti.API.log('created: '+obj.created);
        
        var row = Titanium.UI.createTableViewRow({
            height:50
        });
        var rowID = Titanium.UI.createLabel({
            text: obj.id,
            font:{fontSize:12,fontWeight:'bold'},
            height:'auto',
            width:'auto',
            textAlign:'left',
            top:27,
            left:5,
            height:'auto'
        });
        var rowTitle = Titanium.UI.createLabel({
            text: trimTitle(obj.title),
            font:{fontSize:16,fontWeight:'bold'},
            height:'auto',
            width:'auto',
            textAlign:'left',
            top:5,
            left:5,
            wordWrap:true,
            height:'auto'
        });
        var rowStatus = Titanium.UI.createLabel({
            text: obj.status,
            font:{fontSize:12,fontWeight:'bold'},
            height:'auto',
            width:'auto',
            textAlign:'left',
            top:27,
            left:100,
            height:'auto'
        });
        var rowCreated = Titanium.UI.createLabel({
            text: obj.created,
            font:{fontSize:12,fontWeight:'bold'},
            height:'auto',
            width:'auto',
            textAlign:'left',
            top:27,
            left:200,
            height:'auto'
        });
        row.add(rowTitle);
        row.add(rowID);
        row.add(rowCreated);
        row.add(rowStatus);
        customTableData.push(row);
        table.setData(customTableData);
    }
});


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
	
	return self;
};


// Show View
exports.showView = function(arguments){
    
    // UI
    lbl = Ti.UI.createLabel({
        top:10,
        height:'auto',
        font: { fontWeight:'bold',fontSize:24 },
        text:'Query Results:'
    });
    
    actInd = Titanium.UI.createActivityIndicator({
        width:30,
        height:30,
        left:150,
        top:-30
    });
    actInd.style = 2;
    
    self.add(lbl);
    self.add(actInd);
    actInd.show();
    
    table = Ti.UI.createTableView({
        rowHeight:50
        // data:tableData
    });


    // Show Stuff
    self.add(table);
	
	//it's callback fills the table via the createQueryDetailTable listener
    VARS.GV.getWorkitems();
	
	self.show();
};


// Hide View
exports.hideView = function(){

	// Remove EventListeners

	// Hide Stuff
	self.hide();

	// Remove Stuff
	VARS.GV.removeAllChildren(self);
};

