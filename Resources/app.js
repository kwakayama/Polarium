/*
* A master detail view, utilizing a native table view component and platform-specific UI and navigation.
* A starting point for a navigation-based application with hierarchical data, or a stack of windows.
* Requires Titanium Mobile SDK 1.8.0+.
*
* In app.js, we generally take care of a few things:
* - Bootstrap the application with any data we need
* - Check for dependencies like device type, platform version or network connection
* - Require and open our top-level UI component
*
*/

//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
    alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

// This is a single context application with mutliple windows in a stack
(function() {
        
    // Global VARS
    var VARS  = require('/common/globals');
    
    //include testing    
    Titanium.include("/test/DataTest.js");
    
    //setting up the databases
    //bootstrap the database
    var db = Ti.Database.open('PolarionApp');
    
    //don't backup to iCloud
    db.file.setRemoteBackup(false);
    
    //table to store application informations
    db.execute("CREATE TABLE IF NOT EXISTS appinfo(id INTEGER PRIMARY KEY, version TEXT, tmpPin TEXT default '"+VARS.GV.encrypt('')+"', tmpPinIsSet TEXT DEFAULT '"+VARS.GV.encrypt('defused')+"');");
    //get count of appinfo
    var rows = db.execute('SELECT COUNT(*) FROM appinfo');
    var count = rows.field(0);
    //initialize the first querie if it doesn't exist
    if (count === 0) {
        db.execute('INSERT INTO appinfo DEFAULT VALUES');
    }
    
    //table to store user credentials
    db.execute('CREATE TABLE IF NOT EXISTS credentials(id INTEGER PRIMARY KEY, username TEXT, pwd TEXT, serverURL TEXT);');

    //table to store queries
    db.execute("CREATE TABLE IF NOT EXISTS queries(id INTEGER PRIMARY KEY, name TEXT default '"+VARS.GV.encrypt('new Query')+"', title TEXT, status TEXT, duedate TEXT, timepoint TEXT, type TEXT, author TEXT, assignables TEXT, custom TEXT);");
    
    //get count of queries
    var rows = db.execute('SELECT COUNT(*) FROM queries');
    var count = rows.field(0);
    //initialize the first querie if it doesn't exist
    if (count === 0) {
        db.execute('INSERT INTO queries DEFAULT VALUES');
    }
    
    db.close();

    //determine platform and form factor and render approproate components
    var osname = Ti.Platform.osname,
        version = Ti.Platform.version,
        height = Ti.Platform.displayCaps.platformHeight,
        width = Ti.Platform.displayCaps.platformWidth;
    
    //considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
    //yourself what you consider a tablet form factor for android
    var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
    
    var Window;
    if (isTablet) {
        if (osname === 'ipad') {
        
            //hide status bar iOS only !!!
            Titanium.UI.iPhone.hideStatusBar();
            
            Window = require('ui/tablet/ApplicationWindow').ApplicationWindow;
        
        } else{
        
        //it's another tablet
        Window = require('ui/tablet/ApplicationWindow').ApplicationWindow;

        }
    }
    else {
        // iPhone and Mobile Web make use of the platform-specific navigation controller,
        // all other platforms follow a similar UI pattern
        if (osname === 'iphone') {
            Window = require('ui/handheld/ios/ApplicationWindow');
        }
        else if (osname === 'mobileweb') {
            Window = require('ui/handheld/mobileweb/ApplicationWindow');
        }
        else {
            Window = require('ui/handheld/android/ApplicationWindow');
        }
    }
    
    //check if pin is set to armed
    if (VARS.GV.getIsSetPin() === false) {
        
        new Window().open();
        
    } else{
        var attempts = 3;
        // create root window
        var w = Ti.UI.createWindow({
            backgroundColor:'#ffffff',
            title:'Pin',
            barColor:'#336699',
            tabBarHidden:true
        });
        
        var v = Ti.UI.createView({
            backgroundColor: 'transparent',
            layout: 'vertical'
        });
        
        var lbl = Ti.UI.createLabel({
            top:20,
            font: { fontWeight:'bold',fontSize:48 },
            text:'Pin',
            height:'auto',
            width:'auto',
            color:'#000'
        });
        var tmpPwd = Ti.UI.createTextField({
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
            color: '#336699',
            hintText: 'enter your Pin',
            passwordMask: 'true',
            width: 250, 
            height: 'auto',
            // value: 'asdf',
            autocorrect: false
        });
        var SubmitButton = Titanium.UI.createButton({ 
            backgroundColor: 'blue',
            borderColor: '#1c1d1c',
            borderRadius: 6,
            color: '#ffffff',
            borderWidth: '2',
            height: 50,
            font:{size:9, fontWeight:'bold'},
            width: 250,
            backgroundImage: 'none',
            title:'Submit'
        });
        SubmitButton.addEventListener('click',function(){
            if (checkPin(tmpPwd.getValue())) {
                w.close();
                new Window().open();    
            } else{
                    if (attempts === 0) {
                        
                        alert('Your Data has been deleted');
                        VARS.GV.wipeData();
                        w.close();
                        new Window().open();
                        
                    }else{
                        alert('Sorry your Pin is not correct :(\nYou have '+attempts+' attempts left');   
                    }
                }
        });
        function checkPin(tmpPwd){

                pin = VARS.GV.getTmpPin();
                
                if (pin === tmpPwd) {
                    
                    //reset versuche
                    attempts = 3
                    return true;
                        
                }else{
                    
                    //ziehe ein versuch ab
                    attempts = attempts - 1;
                    return false;
                }  
            }
        
        v.add(lbl);
        v.add(tmpPwd);
        v.add(SubmitButton);
        w.add(v);
        w.open();
    }
    
    // Notification System - Listen for Global Events
    Ti.App.addEventListener('restart', function(obj) {
        ApplikationWin = new Window().open();
    });
    
    Titanium.App.addEventListener('resume',function(){
        Ti.API.log("getissetpin: "+VARS.GV.getIsSetPin());
        var attempts = 3;
        //check if pin is set to armed
        if (VARS.GV.getIsSetPin() === false) {
            
            Ti.API.log('welcome back - pin is set false');
            
        } else{
            
            // create root window
            var w = Ti.UI.createWindow({
                backgroundColor:'#ffffff',
                title:'Pin',
                barColor:'#336699',
                tabBarHidden:true
            });
            
            var v = Ti.UI.createView({
                backgroundColor: 'transparent',
                layout: 'vertical'
            });
            
            var lbl = Ti.UI.createLabel({
                top:20,
                font: { fontWeight:'bold',fontSize:48 },
                text:'Pin',
                height:'auto',
                width:'auto',
                color:'#000'
            });
            var tmpPwd = Ti.UI.createTextField({
                borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
                color: '#336699',
                hintText: 'enter your Pin',
                passwordMask: 'true',
                width: 250, 
                height: 'auto',
                // value: 'asdf',
                autocorrect: false
            });
            var SubmitButton = Titanium.UI.createButton({ 
                backgroundColor: 'blue',
                borderColor: '#1c1d1c',
                borderRadius: 6,
                color: '#ffffff',
                borderWidth: '2',
                height: 50,
                font:{size:9, fontWeight:'bold'},
                width: 250,
                backgroundImage: 'none',
                title:'Submit'
            });
            SubmitButton.addEventListener('click',function(){
                if (checkPin(tmpPwd.getValue())) {
                    w.close();    
                } else{
                    if (attempts === 0) {
                        
                        alert('Your Data has been deleted');
                        VARS.GV.wipeData();
                        w.close();
                        Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'login', 'type':'full', 'params':'' } });
                        
                    }else{
                        alert('Sorry your Pin is not correct :(\nYou have '+attempts+' attempts left');   
                    }
                }
            });
                        
            function checkPin(tmpPwd){

                pin = VARS.GV.getTmpPin();
                
                if (pin === tmpPwd) {
                    
                    //reset versuche
                    attempts = 3
                    return true;
                        
                }else{
                    
                    //ziehe ein versuch ab
                    attempts = attempts - 1;
                    return false;
                }  
            }
            
            v.add(lbl);
            v.add(tmpPwd);
            v.add(SubmitButton);
            w.add(v);
            w.open();
        }
    });
})();
