// Common Global Variables
var GV  =
{
    sessionID: '',
    currentWorkItemQueryID: '',
    currentFull: '',
    previousFull: '',
    currentMaster: '',
    previousMaster: '',
    currentDetail: '',
    previousDetail: '',
	removeAllChildren : function(viewObject){
        // alert("type: " + viewObject.type);
        if (typeof viewObject !== 'undefined' && typeof viewObject.children !== 'undefined') {
            //copy array of child object references because view's "children" property is live collection of child object references
            var children = viewObject.children.slice(0);
            var i;
            for (i = 0; i < children.length; ++i) {
        
                viewObject.remove(children[i]);

                if(children[i] !== null){

                    children[i] = null;
                }
            }
        }
	}
};

// GV.ai = function(){
//     alert("global!");
// };

exports.GVUpdate  = function( globalVarName, globalVarValue )
{
    this.GV[globalVarName]	  =   globalVarValue;
};

exports.GV = GV;