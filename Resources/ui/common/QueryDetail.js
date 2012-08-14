// Private Vars
var self;
var VARS;
var hasQueryData = false;
//type of window
exports.type = "detail";

//Data
var Data = [
	{workItemTitle:'item1',value:'test'},
	{workItemTitle:'item2',value:'test2'}
];

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


// Show View
exports.showView = function(arguments){
	if (arguments !== null) {
	    hasQueryData = true;
	    Ti.API.log(JSON.stringify(arguments));
	}
	var lbl = Ti.UI.createLabel({
		top:10,
		font: { fontWeight:'bold',fontSize:24 },
		text:'Query Results:'
	});
	self.add(lbl);
	
	table = Ti.UI.createTableView({
	    rowHeight:50
		// data:tableData
	});
	
    if (hasQueryData === true) {
        var customTableData = [];
        var key;
        for (key in arguments) {
            var obj = arguments[key];
            Ti.API.log('title: '+obj.title);
            Ti.API.log('status: '+obj.status);
            Ti.API.log('created: '+obj.created);
            
            var row = Titanium.UI.createTableViewRow({
                height:50
            });
            var rowID = Titanium.UI.createLabel({
                text: obj.id,
                font:{fontSize:12,fontWeight:'bold'},
                width:'auto',
                textAlign:'left',
                top:27,
                left:5,
                height:'auto'
            });
            var rowTitle = Titanium.UI.createLabel({
                text: trimTitle(obj.title),
                font:{fontSize:16,fontWeight:'bold'},
                height:'5',
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
                width:'auto',
                textAlign:'left',
                top:27,
                left:100,
                height:'auto'
            });
            var rowCreated = Titanium.UI.createLabel({
                text: obj.created,
                font:{fontSize:12,fontWeight:'bold'},
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
    } else{
        alert('no table data :(');    
    }

	// Show Stuff
	self.add(table);
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

