//Private Vars
var self,
    VARS,
    lbl,
    actInd,
    table,
    hasQueryData = false,
    tableHasListener = false,
    workitems,
    wi = {};
    
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

//table click callback
//open popover to show the details of a workitem
function tableClickFkt (e){
    for(key in workitems){
        var obj = workitems[key];
        Ti.API.log('title: '+obj.title);
        Ti.API.log('status: '+obj.status);
        Ti.API.log('created: '+obj.created);
        if (obj.id === e.row.children[1].text) {            
            wi = obj;
        }
    }
    actInd.show();
    VARS.GV.getAssignableByWorkitemURI(wi.uri);
    alert(wi);
}

Titanium.App.addEventListener('openDetailPopover', function(obj){
    
    //hide loading animation
    actInd.hide();
    
    var assignees = obj.assignees;
    
    var popover = Ti.UI.iPad.createPopover({
        height:250,
        width:300,
        title:wi.title
    }); 

    var popview = Ti.UI.createView({
        backgroundColor: 'transparent',
        layout: 'vertical',
        visible: true,
        height:'auto',
        width:'auto'
    });
     
    var section = Ti.UI.createTableViewSection({
        headerTitle:'General'
    });
      
    var statusLabel =Ti.UI.createLabel({
        text:'Status',
        left:'5%'
    });
    var statusData = Titanium.UI.createLabel({
        text: wi.status,
        font:{fontSize:12,fontWeight:'bold'},
        height:'auto',
        width:'auto',
        textAlign:'left',
        left:'40%',
        height:'auto'
    });
    var statusRow = Ti.UI.createTableViewRow();
    statusRow.add(statusLabel);
    statusRow.add(statusData);
    
    var typeLabel = Ti.UI.createLabel({
        text:'Type',
        left:'5%'
    });
    var typeData = Titanium.UI.createLabel({
        text: wi.type,
        font:{fontSize:12,fontWeight:'bold'},
        height:'auto',
        width:'auto',
        textAlign:'left',
        left:'40%',
        height:'auto'
    });
    var typeRow = Ti.UI.createTableViewRow();
    typeRow.add(typeLabel);
    typeRow.add(typeData);
    
    var idLabel = Ti.UI.createLabel({
        text:'ID',
        left:'5%'
    });
    var idData = Titanium.UI.createLabel({
        text: wi.id,
        font:{fontSize:12,fontWeight:'bold'},
        height:'auto',
        width:'auto',
        textAlign:'left',
        left:'40%',
        height:'auto'
    });
    var idRow = Ti.UI.createTableViewRow();
    idRow.add(idLabel);
    idRow.add(idData);
    
    //TODO Asynchronous Table Update
    
    var assigneeRow = Ti.UI.createTableViewRow();        
    var assigneeLabel = Ti.UI.createLabel({
        text:'Assignee',
        left:'5%'
    });
    assigneeRow.add(assigneeLabel);
    var assigneeData = Ti.UI.createView({
        layout:'vertical',
        left:'40%'
    })
    for(key in assignees){
        
        var name = Ti.UI.createLabel({
            text: assignees[key].id,
            font:{fontSize:12,fontWeight:'bold'},
            height:'auto',
            width:'auto',
            textAlign:'left',
            left:0,
            height:'auto'
        });
        assigneeData.add(name);
    }   
    assigneeRow.add(assigneeData);
    
    var createdLabel = Ti.UI.createLabel({
        text:'Created',
        left:'5%'
    });
    var createdData = Titanium.UI.createLabel({
        text: wi.created,
        font:{fontSize:12,fontWeight:'bold'},
        height:'auto',
        width:'auto',
        textAlign:'left',
        left:'40%',
        height:'auto'
    });
    var createdRow = Ti.UI.createTableViewRow();
    createdRow.add(createdLabel);
    createdRow.add(createdData);
    
    var updatedLabel = Ti.UI.createLabel({
        text:'Updated',
        left:'5%'
    });
    var updatedData = Titanium.UI.createLabel({
        text: wi.created,
        font:{fontSize:12,fontWeight:'bold'},
        height:'auto',
        width:'auto',
        textAlign:'left',
        left:'40%',
        height:'auto'
    });
    var updatedRow = Ti.UI.createTableViewRow();
    updatedRow.add(updatedLabel);
    updatedRow.add(updatedData);

    var descriptionLabel = Ti.UI.createLabel({
        text:'Description',
        left:'5%'
    });
    var descriptionData = Titanium.UI.createLabel({
        text: wi.description.content,
        font:{fontSize:12,fontWeight:'bold'},
        height:'auto',
        width:'auto',
        textAlign:'left',
        left:'40%',
        height:'auto'
    });
    var descriptionRow = Ti.UI.createTableViewRow();
    descriptionRow.add(descriptionLabel);
    descriptionRow.add(descriptionData);
    
    var authorLabel = Ti.UI.createLabel({
        text:'Author',
        left:'5%'
    });
    var authorData = Titanium.UI.createLabel({
        text: wi.author.id,
        font:{fontSize:12,fontWeight:'bold'},
        height:'auto',
        width:'auto',
        textAlign:'left',
        left:'40%',
        height:'auto'
    });
    var authorRow = Ti.UI.createTableViewRow();
    authorRow.add(authorLabel);
    authorRow.add(authorData);
    
    //add rows to the section 
    section.add(idRow);
    // section.add(typeRow);
    section.add(authorRow);
    section.add(statusRow);
    section.add(assigneeRow);
    section.add(createdRow);
    section.add(updatedRow);
    // section.add(descriptionRow);
    
    var detailTable = Ti.UI.createTableView({
        rowHeight:'auto',
        width:300,
        height:'auto',
        style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
        backgroundColor:'white',
        data:[section]
    });
    
    popview.add(detailTable);
    popover.add(popview);
    popover.show({view:lbl,animation:false});
})

//eventlistener for project popover
Titanium.App.addEventListener('createQueryDetailTable',function(arg){
    
    //hide loading animation
    actInd.hide();
    
    //temp-save workitems-obj 
    workitems = arg.workitems;
    
    lbl.text = 'Query Results: ('+workitems.length+')';
    if (workitems.length > 0) {
        var customTableData = [];
        var key;
        for (key in workitems) {
            var obj = workitems[key];
            Ti.API.log('title: '+obj.title);
            Ti.API.log('status: '+obj.status);
            Ti.API.log('created: '+obj.created);
            Ti.API.log('created: '+obj.id);
            
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
            
        }
        table.setData(customTableData);

    }else{
        
        //plain table
        
        table.data = [];
        
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
        left:'25%',
        height:'auto',
        font: { fontWeight:'bold',fontSize:24 },
        text:'Query Results:'
    });
    
    actInd = Titanium.UI.createActivityIndicator({
        width:30,
        height:30,
        left:'20%',
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
    
    table.addEventListener('click',tableClickFkt);
    tableHasListener = true;

    // Show Stuff
    self.add(table);
	
	//it's callback fills the table via the createQueryDetailTable listener
    VARS.GV.getWorkitems();
	
	self.show();
};


// Hide View
exports.hideView = function(){

	// Remove EventListeners
    if (tableHasListener === true) {
        table.removeEventListener('click',tableClickFkt);
        tableHasListener = false;
    }
	// Hide Stuff
	self.hide();

	// Remove Stuff
	VARS.GV.removeAllChildren(self);
};

