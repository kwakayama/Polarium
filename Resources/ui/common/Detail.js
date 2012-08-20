// Private Vars
var self;
var VARS;
var visible = false;
var table;
var deleteBtnArray = [];
//type of window
exports.type = "detail";

function tableDelete (e){
    queryId = e.row.id;    
    VARS.GV.deleteQuery(queryId);
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
        
    self.callback = function(){
        alert("callback von detail view");
        // fire global event
        // Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'filterMenu', 'params':'' } });
    };
    
    // UI
    
    return self;
};


// Show View
exports.showView = function(arguments){
    
    visible = true;
    var customTableData = [];
    
    //get queries from database
    var queries = VARS.GV.getQueries();
    
    var lbl = Ti.UI.createLabel({
        top:10,
        height:'auto',
        font: { fontWeight:'bold',fontSize:24 },
        text:'Your saved Queries:'
    });
    self.add(lbl);
    
    table = Ti.UI.createTableView({
        top:10,
        rowHeight:50,
        editable:true,
        allowsSelectionDuringEditing:false
    });
    
    var i;    
    for(i=0,j=queries.length; i<j; i++){
        var row = Titanium.UI.createTableViewRow({
            height:50,
        });
        var rowTitle = Titanium.UI.createLabel({
            text: queries[i].name,
            font:{fontSize:18,fontWeight:'bold'},
            height:'auto',
            width:'auto',
            textAlign:'left',
            top:20,
            left:50,
            wordWrap:true,
            rowId:i,
            height:'auto'
        });
        var deleteBtn = Ti.UI.createButton({
            title:'delete',
            left:400
        });
        row.add(rowTitle);
        
        row.add(deleteBtn);
        deleteBtnArray.push(deleteBtn);
        deleteBtn.hide();
        
        //variable to store query id
        row.id = queries[i].id;
        rowTitle.id = queries[i].id;
        
        //callback for click listener
        row.callback = function(e) {
            //set the current workitem id and navigate to the workitem view
            VARS.GVUpdate('currentWorkItemQueryID',this.id);
            Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'queryMaster', 'type':'master', 'params':'' } });
            Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'queryDetail', 'type':'detail', 'params':'' } });
        };
        rowTitle.callback = function(e) {
          //set the current workitem id and navigate to the workitem view
            VARS.GVUpdate('currentWorkItemQueryID',this.id);
            Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'queryMaster', 'type':'master', 'params':'' } });
            Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'queryDetail', 'type':'detail', 'params':'' } });
        };
       
        customTableData.push(row);
    }
    table.setData(customTableData);
    
    //add swipe eventlistener for delete item
    table.addEventListener('delete',tableDelete);
    
    // Show Stuff
    self.add(table);
    self.show();
};


// Hide View
exports.hideView = function(){

    if (visible === true) {
        //remove Eventlistener
        table.removeEventListener('delete',tableDelete);
        visible = false;  
    }
    
    VARS.GV.removeAllChildren(self);

    // Hide Stuff
    self.hide();
};

