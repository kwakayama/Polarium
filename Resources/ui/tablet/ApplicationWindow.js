// Private Variables
var self;

var VARS;

//Application Window Component Constructor
exports.ApplicationWindow = function() {
	
	// Global VARS
	VARS  = require('/common/globals');

	//declare views
	var MasterView = require('ui/common/Master'),
		DetailView = require('ui/common/Detail'),
		About = require('ui/common/AboutDetail'),
		Settings = require('ui/common/SettingsDetail'),
		QueryMaster = require('ui/common/QueryMaster'),
		QueryDetail = require('ui/common/QueryDetail'),
		Login = require('ui/common/Login'),
		TemplateView = require('ui/common/TemplateView');
		
	var fullwindowContainer, detailContainer, masterContainer;

	var viewControllers = [];
	var viewContainers = [];

	var hideAllViews = function(type){
		Ti.API.log("kill this type of view: "+type);
		if (type === 'all') {
			var i;
			for(i=0; i<viewControllers.length; i++ ){
				// viewControllers[i].hideView();
				viewControllers[i].hideView();
			}
			var h;
			for (h = 0; h < viewContainers.length; h++) {
					viewContainers[h].hide();
			}	
		} else if (type === 'master'){
			var j;
			for(j=0; j<viewControllers.length; j++ ){
				if (viewControllers[j].type === 'master') {
					viewControllers[j].hideView();
				}				
			}
		} else if (type === 'detail'){
			var k;
			for(k=0; k<viewControllers.length; k++ ){
				if (viewControllers[k].type === 'detail') {
					viewControllers[k].hideView();
				}				
			}
		} else if (type === 'full'){
			var l;
			for(l=0; l<viewControllers.length; l++ ){
				if (viewControllers[l].type === 'full') {
					viewControllers[l].hideView();
				}				
			}
		} else if (type === 'container'){
			var m;
			for(m=0; m<viewContainers.length; m++ ){
				if (viewContainers[m].type === 'container') {
					viewContainers[m].hide();
				}				
			}
		}
	};
		
	var toogleLoginTab = function(visible){
	   
	    // create tab group  
        var tabGroup = Titanium.UI.createTabGroup(); 

        var LoginWindow = Ti.UI.createWindow({
                backgroundColor:'#ffffff',
                url:'ui/common/LoginWindow.js',
                title:'Login',
                barColor:'#336699',
                tabBarHidden:false
            });
            
        // create base UI tab, which will be hidden
        var tab1 = Titanium.UI.createTab({    
            title:'Home',  
            window:self  
        });
        
        loginTab = Titanium.UI.createTab({    
            title:'Hello',  
            window:LoginWindow 
        });

        // add tabs  
        tabGroup.addTab(tab1);
        tabGroup.addTab(loginTab);   


        // open tab group  
        tabGroup.open();
        
       // if(visible === false){
           // alert('remove');
       // }      
    };
	
	var showToolbar = function(type) {
        
        var flexSpace = Titanium.UI.createButton({
            systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
        });
        
        if (type === 'query') {
            var refreshButton = Ti.UI.createButton({
                systemButton:Titanium.UI.iPhone.SystemButton.REFRESH
            });
            var logBtn = Ti.UI.createButton({title:'Logout'});
            logBtn.callback = function(){
                //Navigate  to Login View
                // Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'login', 'type':'full', 'params':'' } });
                // add tabs  
                
                toogleLoginTab();
                 
                //fire polarium logout request
                VARS.GV.logout();
            };
            logBtn.hide();
            self.add(logBtn);
            
            
            var newButton = Ti.UI.createButton({title:'New'});
            self.add(newButton);
            newButton.hide();
            newButton.callback = function(argument) {

                //open database
                var db = Ti.Database.open('PolarionApp');
                db.execute('INSERT INTO queries DEFAULT VALUES');
                
                //get count of table
                
                var count = db.lastInsertRowId;
                
                db.close();
                
                VARS.GVUpdate('currentWorkItemQueryID',count);
                Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'queryMaster', 'type':'master', 'params':'' } });
                Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'queryDetail', 'type':'detail', 'params':'' } });
                
            };
            self.setToolbar([newButton,flexSpace,refreshButton,flexSpace,flexSpace,flexSpace,logBtn]);
            
        } else if(type === 'logout'){
            
            var logBtn = Ti.UI.createButton({title:'Logout'});
            
            logBtn.callback = function(){
                //Navigate  to Login View
                Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'login', 'type':'full', 'params':'' } });
                
                //fire polarium logout request
                VARS.GV.logout();
            };
            
            logBtn.hide();
            self.add(logBtn);
            
            self.setToolbar([flexSpace,flexSpace,flexSpace,flexSpace,flexSpace,flexSpace,logBtn]);
        } else{
            //show blank toolbar        
            self.setToolbar([flexSpace]);
            
        }
    };

	// Create and Add Views To Main Window
	var createViews = function(){
		
		//construct UI
		var masterView = MasterView.createView();
		var queryMasterView = QueryMaster.createView();
		var queryDetailView = QueryDetail.createView();
		var detailView = DetailView.createView();
		var template = TemplateView.createView();
		var loginView = Login.createView();
		var settingsView = Settings.createView();
		var aboutView = About.createView();

		//add view controller to container
		viewControllers.push(TemplateView);
		viewControllers.push(Login);
		viewControllers.push(DetailView);
		viewControllers.push(MasterView);
		viewControllers.push(QueryMaster);
		viewControllers.push(QueryDetail);
		viewControllers.push(Settings);
		viewControllers.push(About);
		

		//add views to "stage" / into the containers
		self.add(template);
		fullwindowContainer.add(loginView);
		masterContainer.add(masterView);
		masterContainer.add(queryMasterView);
		detailContainer.add(queryDetailView);
		detailContainer.add(detailView);
		detailContainer.add(settingsView);
		detailContainer.add(aboutView);

		//hide all views
		hideAllViews('all');

		//show start view
		// fullwindowContainer.show();
		// Login.showView();
		masterContainer.show();
		MasterView.showView();
        detailContainer.show();
        DetailView.showView();
	};

	// create root window
	self = Ti.UI.createWindow({
		backgroundColor:'#ffffff',
		title:'PolarionApp',
		barColor:'#336699',
		tabBarHidden:false
	});
	
		
    showToolbar();
    toogleLoginTab();
	//Create view containers
	//create full-window view container
	fullwindowContainer = Ti.UI.createView({
		type:'container',
		id:'full'
	});

	//create master view container
	masterContainer = Ti.UI.createView({
		top:0,
		bottom:0,
		left:0,
		width:240,
		type:'container',
		id:'master'
	});

	masterContainer.borderColor = '#000';
	masterContainer.borderWidth = 1;
	
	//create detail view container
	detailContainer = Ti.UI.createView({
		top:0,
		bottom:0,
		right:0,
		left:240,
		type:'container',
		id:'detail'
	});

	viewContainers.push(fullwindowContainer);
	viewContainers.push(masterContainer);
	viewContainers.push(detailContainer);

	self.add(fullwindowContainer);
	self.add(masterContainer);
	self.add(detailContainer);

	self.addEventListener('click', function(e) {
		// Ein "globaler" click listener welcher die function "callback" ausführt.
		if (typeof e.source.callback !== "undefined") {
			e.source.callback();
		}else{
			// Ti.API.log("no callback defined :(");
			// alert("no "+e.source.type);
			Ti.API.info("no callback defined" + e.source.id);
		}
	});

	// Notification System - Listen for Global Events
	Ti.App.addEventListener('notification', function(obj) {

		var notificationName = obj.name;
		var notificationData = obj.body;

		if( notificationName === "switchView" ){
			
			//check type of view
			if (notificationData.type === 'master') {
				if (notificationData.view === 'master') {

					//set logout button
					//setLogoutButton(true);
					setBackButton(false);
					showToolbar('logout');

					//hide views
					hideAllViews('master');
					hideAllViews('full');

					// Show master View
					masterContainer.show();
					MasterView.showView();

				} else if (notificationData.view === 'queryMaster') {

					//set back and logout buttons
					setBackButton(true);
					// setLogoutButton(true);
					showToolbar('query');

					//hide views
					hideAllViews('master');
					hideAllViews('full');
					fullwindowContainer.hide();

					// Show master View
					masterContainer.show();
					QueryMaster.showView();

				}
			} else if(notificationData.type === 'detail') {
				if(notificationData.view === 'detail') {
                    VARS.GVUpdate('previousStage' , VARS.GV.currentStage);
					
					//set logout button
					// setLogoutButton(true);
					showToolbar('logout');

					//hide views
					hideAllViews('detail');
					hideAllViews('full');

					// Set Current view
					VARS.GVUpdate('previousStage' , VARS.GV.currentStage);
					VARS.GVUpdate( 'currentStage', 'dashboard' );
					
					// Show detail View
					detailContainer.show();
					DetailView.showView();

				} else if(notificationData.view === 'settings') {
                    
                    //set logout and back button
                    // setLogoutButton(true);
                    showToolbar('logout');
                    setBackButton(true);

                    //hide views
                    hideAllViews('detail');
                    hideAllViews('full');
                    fullwindowContainer.hide();

                    // Set Current view
                    VARS.GVUpdate('previousStage' , VARS.GV.currentStage);
                    VARS.GVUpdate( 'currentStage', 'settings' );
                    
                    // Show detail View
                    detailContainer.show();
                    Settings.showView();

                }else if(notificationData.view === 'about') {
                
                    //set logout and back button
                    // setLogoutButton(true);
                    showToolbar('logout');
                    setBackButton(true);

                    //hide views
                    hideAllViews('detail');
                    hideAllViews('full');
                    fullwindowContainer.hide();

                    // Set Current view
                    VARS.GVUpdate('previousStage' , VARS.GV.currentStage);
                    VARS.GVUpdate( 'currentStage', 'about' );
                    
                    // Show detail View
                    detailContainer.show();
                    About.showView();

                } else if(notificationData.view === 'queryDetail') {
                    var arguments;
                    if (notificationData.params !== '') {
                        arguments = notificationData.params;
                    } else{
                        arguments = null;
                    }
					//set logout button
					// setLogoutButton(true);
					showToolbar('query');

					//hide views
					hideAllViews('detail');
					hideAllViews('full');
					fullwindowContainer.hide();
					
					// Set Current view
                    VARS.GVUpdate('previousStage' , VARS.GV.currentStage);
                    VARS.GVUpdate( 'currentStage', 'query' );

					// Show detail View
					detailContainer.show();
					QueryDetail.showView(arguments);

				}

			} else if (notificationData.type === 'full') {
				VARS.GVUpdate('previousStage' , VARS.GV.currentStage);
				if (notificationData.view === 'login') {
				    
					//hide logout button
					// setLogoutButton(false);
					showToolbar();

					//hide views
					hideAllViews('all');
					// Set Current view
					VARS.GVUpdate( 'currentStage', 'login' );
					
					// Show full View
					fullwindowContainer.show();
					Login.showView();
				}
			}
		
		}else if(notificationName === "openModalWindow"){

			if( notificationData.modalType === 'query' ){
				//modal window for setting the values for the query
				
				var title = notificationData.modalTitle;
				//create modal window
				var modalWindow = Ti.UI.createWindow({
					title: title,
					backgroundColor:'white',
					barColor:'#336699'
				});

				//add to parent window, for using it's eventlistener
				self.add(modalWindow);
				
				//create modal view
				var modalView = Ti.UI.createView({
					backgroundColor: 'transparent',
					layout: 'vertical',
					visible: true
				});
				
				//modal window logic
				//variable to save textfield data to database
				var queryData = {};
				
				if (title === 'Name') {
                    
                    queryData.textfield = Ti.UI.createTextField({
                        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
                        color: '#336699',
                        hintText: title,
                        width: 250, height: 'auto',
                        // value: serverURL,
                        autocorrect: false 
                    });
                    modalView.add(queryData.textfield);
                } else if (title === 'Title') {
				    
                    queryData.textfield = Ti.UI.createTextField({
                        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
                        color: '#336699',
                        hintText: title,
                        width: 250, height: 'auto',
                        // value: serverURL,
                        autocorrect: false 
                    });
				    modalView.add(queryData.textfield);
				} else if (title === 'Status'){
				    queryData.textfield = Ti.UI.createTextField({
                        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
                        color: '#336699',
                        hintText: title,
                        width: 250, height: 'auto',
                        // value: serverURL,
                        autocorrect: false 
                    });
                    modalView.add(queryData.textfield);  
				} else if (title === 'Due Date'){
				    queryData.textfield = Ti.UI.createTextField({
                        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
                        color: '#336699',
                        hintText: title,
                        width: 250, height: 'auto',
                        // value: serverURL,
                        autocorrect: false 
                    });
                    modalView.add(queryData.textfield);   
                } else if (title === 'Timepoint'){
                    queryData.textfield = Ti.UI.createTextField({
                        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
                        color: '#336699',
                        hintText: title,
                        width: 250, height: 'auto',
                        // value: serverURL,
                        autocorrect: false 
                    });
                    modalView.add(queryData.textfield);   
                } else if (title === 'Type'){
                    queryData.textfield = Ti.UI.createTextField({
                        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
                        color: '#336699',
                        hintText: title,
                        width: 250, height: 'auto',
                        // value: serverURL,
                        autocorrect: false 
                    });
                    modalView.add(queryData.textfield);
                    
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
                    modalView.add(queryData.textfield);
                    
                } else if (title === 'Assignables'){
                    queryData.textfield = Ti.UI.createTextField({
                        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
                        color: '#336699',
                        hintText: title,
                        width: 250, height: 'auto',
                        // value: serverURL,
                        autocorrect: false 
                    });
                    modalView.add(queryData.textfield);  
                } else if (title === 'Custom'){
					queryData.textfield = Ti.UI.createTextField({
                        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
                        color: '#336699',
                        hintText: title,
                        width: 250, height: 'auto',
                        // value: serverURL,
                        autocorrect: false 
                    });
                    modalView.add(queryData.textfield); 
                }

				//create submit button
				var submitButton = Ti.UI.createButton({
					title:'Submit',
					width:100,
					height:30
				});

				//set the callback of the submit button
				submitButton.callback = function () {
				    VARS.GV.saveQueryData(title, queryData.textfield.getValue());
				    modalWindow.close();
				    Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'queryMaster', 'type':'master', 'params':'' } });
				    Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'queryDetail', 'type':'detail', 'params':'' } });
				};

				//create cancel button
				var cancelButton = Ti.UI.createButton({
					title:'Cancel',
					width:100,
					height:30
				});

				//set the callback of the cancel button
				cancelButton.callback = function () {
					modalWindow.close();
				};

				//add buttons to the window and hide them
				//workaround to get the callback
				modalView.add(submitButton);
				modalView.add(cancelButton);
				submitButton.hide();
				cancelButton.hide();

				//add modal view to window
				modalWindow.add(modalView);

				//add buttons to the navigation
				modalWindow.setLeftNavButton(cancelButton);
				modalWindow.setRightNavButton(submitButton);

				//0 -> Ti.UI.iPad.MODAL_TRANSITION_STYLE_COVER_VERTICAL
				//2 -> MODAL_PRESENTATION_FORMSHEET
				modalWindow.open({modal:true,modalTransitionStyle:0,modalStyle:2,navBarHidden:false});

			}else if (notificationData.modalType === 'detail') {
				alert("yeeeeeha detail");
			}else if (notificationData.modalType === 'chooseProject') {
                //modal window for setting the values for the query
                // VARS.GV.getprojects();
                
                var title = notificationData.modalTitle;
                //create modal window
                var modalWindow = Ti.UI.createWindow({
                    title: title,
                    backgroundColor:'white',
                    barColor:'#336699'
                });

                //add to parent window, for using it's eventlistener
                self.add(modalWindow);
                
                //create modal view
                var modalView = Ti.UI.createView({
                    backgroundColor: 'transparent',
                    layout: 'vertical',
                    visible: true
                });
                
                //modal window logic
                            
                var picker = Ti.UI.createPicker({
                    top:50
                });
                
                var data = [];
                data[0]=Ti.UI.createPickerRow({title:'E-Library'});
                data[1]=Ti.UI.createPickerRow({title:'Playground'});
                data[2]=Ti.UI.createPickerRow({title:'Document Library'});
                
                picker.add(data);
                picker.selectionIndicator = true;        
                
                modalView.add(picker);
                

                //create submit button
                var submitButton = Ti.UI.createButton({
                    title:'Submit',
                    width:100,
                    height:30
                });

                //set the callback of the submit button
                submitButton.callback = function () {
                    modalWindow.close();
                    // Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'master', 'type':'master', 'params':'' } });
                    // Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'detail', 'type':'detail', 'params':'' } });
                    toogleLoginTab(false);
                };

                //create cancel button
                var cancelButton = Ti.UI.createButton({
                    title:'Cancel',
                    width:100,
                    height:30
                });

                //set the callback of the cancel button
                cancelButton.callback = function () {
                    modalWindow.close();
                };

                //add buttons to the window and hide them
                //workaround to get the callback
                modalView.add(submitButton);
                modalView.add(cancelButton);
                submitButton.hide();
                cancelButton.hide();

                //add modal view to window
                modalWindow.add(modalView);

                //add buttons to the navigation
                modalWindow.setLeftNavButton(cancelButton);
                modalWindow.setRightNavButton(submitButton);

                //0 -> Ti.UI.iPad.MODAL_TRANSITION_STYLE_COVER_VERTICAL
                //2 -> MODAL_PRESENTATION_FORMSHEET
                modalWindow.open({modal:true,modalTransitionStyle:0,modalStyle:2,navBarHidden:false});
                
            }

		}/*else if(notificationName === "closeView"){

			if( notificationData.view === 'imagePresentation' ){
				
				// Hide ImagePresentation View
				ImagePresentation.hideView();
				CameraRoll.enableView();
			}
		}*/
	});

	var setLogoutButton = function(visible) {
				
		if (visible === true) {
			//create logout button
			var logoutButton = Ti.UI.createButton({title:'Logout'});
			
			// workaround for callback of navButton	
			self.add(logoutButton);
			self.setRightNavButton(logoutButton);
			logoutButton.hide();

			logoutButton.callback = function(){
			
				//Navigate  to Login View
				Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'login', 'type':'full', 'params':'' } });
				
				//fire polarium logout request
                VARS.GV.logout();
			
			};

		} else{
			if (logoutButton !== 'undefined') {
				self.setRightNavButton(null);
			}
		}
	};
    
	var setBackButton = function(visible) {
		
		var backButton;
		var hasBackEventlistener = false;
		function backFunktion(){
           //Navigate to Dashboard
            Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'master', 'type':'master', 'params':'' } });
            Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'detail', 'type':'detail', 'params':'' } });	    
		}
		
		if (visible === true) {
			
			//create logout button
			backButton = Ti.UI.createButton({title:'Back'});
			
			backButton.addEventListener('click',backFunktion);
			hasBackEventlistener = true;
			// workaround for callback of navButton	
			//self.add(backButton);
			self.setLeftNavButton(backButton);
			//backButton.hide();


		} else{
			if (backButton !== 'undefined') {
                if (hasBackEventlistener === true) {
                    backButton.removeEventListener('click',backFunktion);
                    hasBackEventlistener = false;   
                }
                
                var emptyView = Titanium.UI.createView({});
                
				self.setLeftNavButton(null);
				
				backButton = null;

			}
		}
	};
	
	// initialize to all modes
    self.orientationModes = [
        Titanium.UI.PORTRAIT,
        Titanium.UI.UPSIDE_PORTRAIT,
        Titanium.UI.LANDSCAPE_LEFT,
        Titanium.UI.LANDSCAPE_RIGHT
    ]; 
	
	//the "real" start
	createViews();
    
	//
	// orientation change listener
	//
	Ti.Gesture.addEventListener('orientationchange',function(e)
	{
		// Ti.API.log('not implemented yet '+VARS.GV.currentStage);
		// Ti.App.restart();
	});

	return self;
};