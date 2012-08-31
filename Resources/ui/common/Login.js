
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140
141
142
143
144
145
146
147
148
149
150
151
152
153
154
155
156
157
158
159
160
161
162
163
164
165
166
167
168
169
170
171
172
173
174
175
176
177
178
179
180
181
182
183
184
185
186
187
188
189
190
191
192
193
194
195
196
197
198
199
200
201
202
203
204
205
206
207
208
209
210
211
212
213
214
215
216
217
218
219
220
221
222
223
224
225
226
227
228
229
230
231
232
233
234
235
236
237
238
239
240
241
242
243
244
245
246
247
248
249
250
251
252
253
254
255
256
257
258
259
260
261
262
263
264
265
266
267
268
269
270
271
272
273
274
275
276
277
278
279
280
281
282
283
284
285
286
287
288
289
290
291
292
293
294
295
// Private Vars
var self;
var VARS;
var Loginbutton;
var actInd;
var hasListener = false;
//type of window
exports.type = "full";
 
var Server_Field,
    Username_Field,
    Pwd_Field;
 
//eventlistener for project popover
Titanium.App.addEventListener('popoverProjects',function(obj){
     
    //hide loading animation
    actInd.hide();
    Loginbutton.setEnabled(true);
     
    //hide keyboard
    Server_Field.blur();
    Username_Field.blur();
    Pwd_Field.blur();
     
    var myprojects = obj.projects;
    var projectList = [];
     
    var key; 
    for (key in myprojects) {
       var obj = myprojects[key];
       // alert(obj.id);
       projectList.push(obj.id);
    }
    //open popover to choose project
    var popover = Ti.UI.iPad.createPopover({
        height:250,
        width:310,
        title:'Choose Project'
    });
 
    var popview = Ti.UI.createView({
        backgroundColor: 'transparent',
        layout: 'vertical',
        visible: true,
        height:'auto',
        width:'auto'
    });
     
    var column1 = Ti.UI.createPickerColumn();
    var i;
    for(i=0, ilen=projectList.length; i<ilen; i++){
      var row = Ti.UI.createPickerRow();
         
      var label = Ti.UI.createLabel({
        font:{fontSize:20,fontWeight:'bold'},
        text: projectList[i],
        textAlign:'left',
        height:'auto',
        width:'auto'
      });
       
      row.add(label);
      column1.addRow(row);
    }
 
    var picker = Ti.UI.createPicker({
      columns: [column1],
      visibleItems: 3,
      selectionIndicator: true
    });
     
    picker.setSelectedRow(0,0,true);
     
    var btn = Ti.UI.createButton({
        title:'Submit',
        height:'auto',
        width:320
    });
 
    btn.addEventListener('click',function(){
        VARS.GVUpdate('currentProjectId',picker.getSelectedRow(0).children[0].text);
         
        popover.hide();
        Ti.App.fireEvent('restart');
    });
     
    // popview.add(lbl);
    popview.add(picker);
    popview.add(btn);
     
    popover.add(popview);
    popover.show({view:Loginbutton,animation:false});
});
 
// Template Constructor
exports.createView = function() {
 
    // Global VARS
    VARS  = require('/common/globals');
 
    // Create Object Instance, A Parasitic Subclass of Observable
    self = Ti.UI.createView({
        backgroundGradient: {
            type: 'linear',
            startPoint: { y: '0%', x: '50%' },
            endPoint: {y: '100%', x: '50%'},
            colors: [ 'white', '#DDDDDD'],
            backfillStart: true,
            backfillEnd: true
        },
        layout: 'vertical',
        visible: false
    });
                 
    // UI
     
    return self;
};
 
var loginButtonFkt = function(){
     
    //set loading animation
    setTimeout(function() {
        actInd.hide();
        Loginbutton.setEnabled(true);
 
    }, 5000);
    actInd.show();
    Loginbutton.setEnabled(false);
 
     
    //get input fields
    var loginData = {
        username : Username_Field.getValue(),
        pwd : Pwd_Field.getValue(),
        serverURL : Server_Field.getValue()
    };
     
    //check input fields
    if (checkLoginData(loginData) === true) {
        // setCredentials(loginData);
        VARS.GV.saveCredentials(loginData);
        //log into Polarium
        //TODO ERROR CASE
        VARS.GV.login(function(sessionid) {
            if (sessionid !== null) {
                                    
                VARS.GV.getprojects();
                 
            }else {
                alert('sorry, can not log in');
            }
             
        })
 
    } else{
         
        alert("please check your login information");
 
    }
 
};
//function to validate a URL
function validateURL(textval) {
      // var urlregex = new RegExp(
            // "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
      // return urlregex.test(textval);
      return true;
}
 
//function to valitate a Username
function validateUsername(username) {
    return /^[0-9a-zA-Z_.-]+$/.test(username);
}
 
//function to check the logindata
//returns true if the logininformation is valid and false if it's invalid
function checkLoginData(login){
    // if (validateURL(login.serverURL) && validateUsername(login.username)) {
        // return true;
    // } else{
        // return false;
    // }
    return true;
}
 
// Show View
exports.showView = function(){
    var SPACING = 5;
    var TOPSPACE = 22;
     
    Ti.API.log('--- show login view ---');
    var username,
        pwd,
        serverURL;
         
    //check if data is stored in database
    credentials = VARS.GV.getCredentials();
    if (credentials !== null) {
        username = credentials.username;
        pwd = credentials.pwd;
        serverURL = credentials.serverURL;
    }
 
    var lbl = Ti.UI.createLabel({
        top: TOPSPACE,
        bottom: TOPSPACE,
        font: { fontWeight:'bold',fontSize:48 },
        text:'Login',
        height:'auto',
        width:'auto',
        color:'#000'
    });
    self.add(lbl);
 
    Server_Field = Ti.UI.createTextField({
          top: SPACING,
          borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
          color: '#336699',
          hintText: 'Server URL',
          width: 301, 
          height: 'auto',
          value: serverURL,
          autocorrect: false
        });
    self.add(Server_Field);
     
    Username_Field = Ti.UI.createTextField({
      top: SPACING,
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
      color: '#336699',
      hintText: 'Username',
      width: 301,
      height: 'auto',
      value: username,
      autocorrect: false
    });
    self.add(Username_Field);
 
    Pwd_Field = Ti.UI.createTextField({
      top: SPACING,
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
      color: '#336699',
      hintText: 'Password',
      passwordMask: 'true',
      width: 301, height: 'auto',
      value: '',
      autocorrect: false
    });
    self.add(Pwd_Field);
 
    Loginbutton = Titanium.UI.createButton({ 
        top: SPACING,
        color: '#ffffff',
        height: 57,
        font:{size:9, fontWeight:'bold'},
        width: 301,
        backgroundImage: 'assets/buttons/BUTT_grn_off.png',
        title:'Submit'
    });
     
    actInd = Titanium.UI.createActivityIndicator({
        //width:30,
        //height:30,
        //left:150,
        top:10
    });
    actInd.style = 2;
     
     
    // Loginbutton.addEventListener('click',loginButtonFkt);
    Loginbutton.callback = loginButtonFkt;
    hasListener = true;
    self.add(Loginbutton);
    self.add(actInd);
     
    // Show Stuff
    self.show();
};
 
 
// Hide View
exports.hideView = function(){
    // Remove EventListeners
    if (hasListener === true) {
       Loginbutton.removeEventListener('click',loginButtonFkt);
       hasListener = false;
    }
     
    // Hide Stuff
    VARS.GV.removeAllChildren(self);
    // alert("hide Fullview: " + self.children);
    // self.hide();
};