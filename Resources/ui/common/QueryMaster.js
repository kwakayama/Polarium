// Private Vars
var self;
var VARS;
var table;
var tableRows = [];
var scrollStartCallback;
var scrollEndCallback;
var currentQueryData = {};
//var to check if listener are set
var setListener;

//type of window
exports.type = "master";

//check if data for query exists in database
function checkLable(title){
    result = currentQueryData;
    // var result = VARS.GV.getCurrentQuery();
    // Ti.API.log('---check label---'+result);
    if (title === 'Name'){
        return (result.name !== '' && result.name !== null && typeof result.name !== 'undefined') ? result.name : 'new Query';
    } else if (title === 'Title'){
        return (result.title !== '' && result.title !== null && typeof result.name !== 'undefined') ? result.title : 'all';
    } else if(title === 'Status'){
        return (result.status !== '' && result.status !== null && typeof result.name !== 'undefined') ? result.status : 'all';
    } else if(title === 'Due Date'){
        return (result.duedate !== '' && result.duedate !== null && typeof result.name !== 'undefined') ? result.duedate : 'all';
    } else if(title === 'Timepoint'){
        return (result.timepoint !== '' && result.timepoint !== null && typeof result.name !== 'undefined') ? result.timepoint : 'all';
    } else if(title === 'Type'){
        return (result.type !== '' && result.type !== null && typeof result.name !== 'undefined') ? result.type : 'all';
    } else if(title === 'Author'){
        return (result.author !== '' && result.author !== null && typeof result.name !== 'undefined') ? result.author : 'all';
    } else if(title === 'Assignables'){
        return (result.assignables !== '' && result.assignables !== null && typeof result.name !== 'undefined') ? result.assignables : 'all';
    } else if(title === 'Custom'){
        return (result.custom !== '' && result.custom !== null && typeof result.name !== 'undefined') ? result.custom : 'all';
    } else{
        return 'all';
    }
}

function openPopover(e){
    //open modal window to choose project
    var title = e.row.id;

    var popover = Ti.UI.iPad.createPopover({
        height:65,
        width:250,
        title:title
    }); 

    var popview = Ti.UI.createView({
        backgroundColor: 'transparent',
        layout: 'vertical',
        visible: true,
        height:'auto',
        width:'auto'
    });
    
    var queryData = {};
    
    if (title === 'Title') {
        
        queryData.textfield = Ti.UI.createTextField({
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
            color: '#336699',
            hintText: title,
            width: 250, height: 'auto',
            // value: serverURL,
            autocorrect: false 
        });
        popview.add(queryData.textfield);
    } else if (title === 'Status'){
        queryData.textfield = Ti.UI.createTextField({
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
            color: '#336699',
            hintText: title,
            width: 250, height: 'auto',
            // value: serverURL,
            autocorrect: false 
        });
        popview.add(queryData.textfield);  
    } else if (title === 'Due Date'){
        queryData.textfield = Ti.UI.createTextField({
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
            color: '#336699',
            hintText: title,
            width: 250, height: 'auto',
            // value: serverURL,
            autocorrect: false 
        });
        popview.add(queryData.textfield);   
    } else if (title === 'Timepoint'){
        queryData.textfield = Ti.UI.createTextField({
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
            color: '#336699',
            hintText: title,
            width: 250, height: 'auto',
            // value: serverURL,
            autocorrect: false 
        });
        popview.add(queryData.textfield);   
    } else if (title === 'Type'){
        queryData.textfield = Ti.UI.createTextField({
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
            color: '#336699',
            hintText: title,
            width: 250, height: 'auto',
            // value: serverURL,
            autocorrect: false 
        });
        popview.add(queryData.textfield);
        
        VARS.GV.getAllEnumOptionsForId();
           
    } else if (title === 'Author'){
        
        queryData.textfield = Ti.UI.createTextField({
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
            color: '#336699',
            hintText: title,
            width: 250, height: 'auto',
            // value: serverURL,
            autocorrect: false 
        });
        popview.add(queryData.textfield);
        
    } else if (title === 'Assignables'){
        queryData.textfield = Ti.UI.createTextField({
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
            color: '#336699',
            hintText: title,
            width: 250, height: 'auto',
            // value: serverURL,
            autocorrect: false 
        });
        popview.add(queryData.textfield);
          
    } else if (title === 'Custom'){
        queryData.textfield = Ti.UI.createTextField({
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
            color: '#336699',
            hintText: title,
            width: 250, height: 'auto',
            // value: serverURL,
            autocorrect: false 
        });
        popview.add(queryData.textfield); 
    }
    
    var btn = Ti.UI.createButton({
        title:'Submit',
        width: 250, height: 'auto'
    });
    // btn.callback = function(){
        // alert("submit in popover");
    // };
    btn.addEventListener('click',function(){
        VARS.GV.saveQueryData(title, queryData.textfield.getValue());
        popover.hide();
        Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'queryMaster', 'type':'master', 'params':'' } });
        Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'queryDetail', 'type':'detail', 'params':'' } });
    });
    
    
    popview.add(btn);
    
    popover.add(popview);
   
    popover.show({view:table,animation:false});
}

//checklable helper function
function getCurrentQueryData(){
    currentQueryData = VARS.GV.getCurrentQuery();
    Ti.API.log('---check label---'+currentQueryData);
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
        
    // self.callback = function(){
        // // fire global event
        // Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'master', 'params':'' } });
    // };
    
    // UI
    
    return self;
};


// Show View
exports.showView = function(){
    
    //set CurrentQueryData
    getCurrentQueryData();
    
    var lbl = Ti.UI.createLabel({
        top:10,
        font: { fontWeight:'bold',fontSize:24 },
        text: checkLable('Name')
    });
    
    var queryData = {};
    
    lbl.callback = function(){
        
        var popover = Ti.UI.iPad.createPopover({
            height:65,
            width:250,
            title:'Name'
        });

        var popview = Ti.UI.createView({
            backgroundColor: 'transparent',
            layout: 'vertical',
            visible: true,
            height:'auto',
            width:'auto'
        });
        
        queryData.textfield = Ti.UI.createTextField({
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
            color: '#336699',
            hintText: 'Name',
            width: 250, height: 'auto',
            // value: serverURL,
            autocorrect: false 
        });
        popview.add(queryData.textfield);
        
        var btn = Ti.UI.createButton({
            title:'Submit',
            width: 250, height: 'auto'
        });
        // btn.callback = function(){
            // alert("submit in popover");
        // };
        btn.addEventListener('click',function(){
            VARS.GV.saveQueryData('Name', queryData.textfield.getValue());
            popover.hide();
            Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'queryMaster', 'type':'master', 'params':'' } });
            Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'queryDetail', 'type':'detail', 'params':'' } });
        });
        
        
        popview.add(btn);
        
        popover.add(popview);
        popover.show({view:lbl,animation:false});
        
    };
    
    self.add(lbl);
    
    //create the table
    table = Ti.UI.createTableView({
        // data:tableData
    });

    //cool pull down - refresh feature

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
        var workitemCallback = function(arg){
            Ti.API.log('mycallback says: '+arg);
            Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'queryDetail', 'type':'detail', 'params':arg } });
        };
        var timeoutCallback = function(argument) {
          VARS.GV.getWorkitems(workitemCallback);
        };
        //TODO Beide Timeouts zusammenführen
        //timeout for hiding the bar
        setTimeout(endReloading,2000);
        //timeout for sending the request
        // setTimeout(timeoutCallback,0);
        timeoutCallback();
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
    scrollStartCallback = function(e) {
        var offset = e.contentOffset.y;
        if (offset <= -65.0 && !pulling && !reloading)
        {
            reloading = true;
            pulling = false;
            arrow.hide();
            actInd.show();
            statusLabel.text = "Reloading...";
            table.setContentInsets({top:60},{animated:true});
            arrow.transform=Ti.UI.create2DMatrix();
            beginReloading();
        }
        else if (pulling && offset > -65.0 && offset < 0)
        {
            
            setTimeout(function(){
            pulling = false;
            Ti.API.log('set pulling false');   
            },2000);

            
            var t = Ti.UI.create2DMatrix();
            arrow.animate({transform:t,duration:180});
            statusLabel.text = "Pull down to refresh...";
        }   
    };
    
    //add Eventlistener and remove them in the hide function
    table.addEventListener('scroll',scrollStartCallback);
    setListener = true;
    
    var customTableData = [];
    var i;
    for (i = 0; i < Data.length; i++) {
        var row = Titanium.UI.createTableViewRow({
            height:50,
            id:Data[i].title
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
        //rowValue.callback = Data[i].callback;
        //rowTitle.callback = Data[i].callback;
        //row.callback = Data[i].callback;

        tableRows.push(row);
        customTableData.push(row);
    }
    table.setData(customTableData);
    
    table.addEventListener('click',openPopover);

    self.add(table);
        
    // Show Stuff
    self.show();
};


// Hide View
exports.hideView = function(){
    //remove eventlistener
    if (setListener === true) {
        table.removeEventListener('scroll',scrollStartCallback);
    }
    VARS.GV.removeAllChildren(self);

    // Hide Stuff
    self.hide();
};

