// Private Variables
var self;

var VARS;
var logoutButton;

//Application Window Component Constructor
exports.ApplicationWindow = function() {
	
	// Global VARS
	VARS  = require('/common/globals');

	//declare views
	var MasterView = require('ui/common/Master'),
		DetailView = require('ui/common/Detail'),
		QueryMaster = require('ui/common/QueryMaster'),
		QueryDetail = require('ui/common/QueryDetail'),
		Login = require('ui/common/Login'),
		TemplateView = require('ui/common/TemplateView');

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

	// Create and Add Views To Main Window
	var createViews = function(){
		
		//construct UI
		var masterView = MasterView.createView();
		var queryMasterView = QueryMaster.createView();
		var queryDetailView = QueryDetail.createView();
		var detailView = DetailView.createView();
		var template = TemplateView.createView();
		var loginView = Login.createView();

		//add view controller to container
		viewControllers.push(TemplateView);
		viewControllers.push(Login);
		viewControllers.push(DetailView);
		viewControllers.push(MasterView);
		viewControllers.push(QueryMaster);
		viewControllers.push(QueryDetail);

		//add views to "stage" / into the containers
		self.add(template);
		fullwindowContainer.add(loginView);
		masterContainer.add(masterView);
		masterContainer.add(queryMasterView);
		detailContainer.add(queryDetailView);
		detailContainer.add(detailView);

		//hide all views
		hideAllViews('all');

		//show start view
		fullwindowContainer.show();
		Login.showView();
	};

	// create root window
	self = Ti.UI.createWindow({
		backgroundColor:'#ffffff',
		title:'PolarionApp',
		barColor:'#336699',
		tabBarHidden:true
	});

	// create tab group  
	var tabGroup = Titanium.UI.createTabGroup(); 
	
	// create base UI tab, which will be hidden
	var tab1 = Titanium.UI.createTab({    
	    title:'Home',  
	    window:self  
	});

	// add tabs  
	tabGroup.addTab(tab1);   
	  
	// open tab group  
	tabGroup.open();

	//Create view containers
	//create full-window view container
	var fullwindowContainer = Ti.UI.createView({
		type:'container'
	});

	//create master view container
	var masterContainer = Ti.UI.createView({
		top:-1, //workaround to hide the upper edge (black)
		bottom:0,
		left:0,
		width:240,
		type:'container'
	});

	masterContainer.borderColor = '#000';
	masterContainer.borderWidth = 1;
	
	//create detail view container
	var detailContainer = Ti.UI.createView({
		top:0,
		bottom:0,
		right:0,
		left:240,
		type:'container'
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
			Ti.API.info("no callback defined");
		}
	});

	// Notification System - Listen for Global Events
	Ti.App.addEventListener('notification', function(obj) {

		var notificationName = obj.name;
		var notificationData = obj.body;

		if( notificationName === "switchView" ){
			
			//check type of view
			if (notificationData.type === 'master') {
				VARS.GVUpdate('previousMaster' , VARS.GV.currentMaster);
				if (notificationData.view === 'master') {

					//set logout button
					setLogoutButton(true);
					setBackButton(false);

					//hide views
					hideAllViews('master');
					hideAllViews('full');

					// Set Current view
					VARS.GVUpdate( 'currentMaster', 'master' );

					// Show master View
					masterContainer.show();
					MasterView.showView();

				} else if (notificationData.view === 'queryMaster') {

					//set back and logout buttons
					setBackButton(true);
					setLogoutButton(true);

					//hide views
					hideAllViews('master');
					hideAllViews('full');

					// Set Current view
					VARS.GVUpdate( 'currentMaster', 'queryMaster' );

					// Show master View
					masterContainer.show();
					QueryMaster.showView();

				}
			} else if(notificationData.type === 'detail') {
				VARS.GVUpdate('previousDetail' , VARS.GV.currentDetail);
				if(notificationData.view === 'detail') {
					
					//set logout button
					setLogoutButton(true);

					//hide views
					hideAllViews('detail');
					hideAllViews('full');

					// Set Current view
					VARS.GVUpdate( 'currentDetail', 'detail' );
					
					// Show detail View
					detailContainer.show();
					DetailView.showView();

				} else if(notificationData.view === 'queryDetail') {
					
					//set logout button
					setLogoutButton(true);

					//hide views
					hideAllViews('detail');
					hideAllViews('full');

					// Set Current view
					VARS.GVUpdate( 'currentDetail', 'queryDetail' );
					
					// Show detail View
					detailContainer.show();
					QueryDetail.showView();

				}

			} else if (notificationData.type === 'full') {
				VARS.GVUpdate('previousFull' , VARS.GV.currentFull);
				if (notificationData.view === 'login') {

					//hide logout button
					setLogoutButton(false);

					//hide views
					hideAllViews('all');
					// Set Current view
					VARS.GVUpdate( 'currentFull', 'login' );
					
					// Show full View
					fullwindowContainer.show();
					Login.showView();
				}
			}
		
		}else if(notificationName === "openModalWindow"){

			if( notificationData.modalType === 'query' ){
				//modal window for setting the values for the query
				
				//create modal window
				var modalWindow = Ti.UI.createWindow({
					title: notificationData.modalTitle,
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
				
				//create submit button
				var submitButton = Ti.UI.createButton({
					title:'Submit',
					width:100,
					height:30
				});
				//set the callback of the submit button
				submitButton.callback = function () {
					alert("submit it");
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
			logoutButton = Ti.UI.createButton({title:'Logout'});
			
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
		var testButton;
		
		if (visible === true) {
			
			//create logout button
			backButton = Ti.UI.createButton({title:'Back'});
			
			// workaround for callback of navButton	
			self.add(backButton);
			self.setLeftNavButton(backButton);
			backButton.hide();

			backButton.callback = function(){

				//Navigate  Backwards
				Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'master', 'type':'master', 'params':'' } });
				Ti.App.fireEvent('notification',{ name:'switchView', body:{'view':'detail', 'type':'detail', 'params':'' } });

			};

		} else{
			if (backButton !== 'undefined') {

				self.setLeftNavButton(null);
				backButton = null;

			}
		}
	};
	
	//the "real" start
	createViews();

	//
	// orientation change listener
	//
	Ti.Gesture.addEventListener('orientationchange',function(e)
	{
		// device orientation
		// l.text = 'Current Orientation: ' + getOrientation(Titanium.Gesture.orientation);
		// setLogoutButton(false);
		// alert(define update/render funktion);
		// logoutButton.hide();
		// get orienation from event object
		//var orientation = getOrientation(e.orientation);
		
		//Titanium.API.info("orientation changed = "+orientation+", is portrait?"+e.source.isPortrait()+", orientation = "+Ti.Gesture.orientation + "is landscape?"+e.source.isLandscape());
	});

	return self;
};