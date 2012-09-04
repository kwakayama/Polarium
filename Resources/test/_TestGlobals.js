Titanium.include("/test/TitaniumUnity.js");

// Global VARS
var VARS  = require('/common/globals');
    

var DataTestSuite = {
 
    suiteName: "Data Test Suite",
 
    setUp: function() {
        jsUnity.assertions.assertTrue(true);
    },
 
    tearDown: function() {
        jsUnity.assertions.assertTrue(true);
    },
 
// add your test functions:
 
    test_encrypt_decrypt: function() {
        var string = "Ich bin die Telekom – auf mich ist Verlass"
        
        var enc = VARS.GV.encrypt(string);
        var dec = VARS.GV.decrypt(enc);
        
        jsUnity.assertions.assertEqual( string, dec, 'expect strings to be equal');
    },
 
};
 
jsUnity.run(DataTestSuite);

