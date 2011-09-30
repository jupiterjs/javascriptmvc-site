//steal/js clui/simplemodal/scripts/compress.js

load("steal/rhino/steal.js");
steal.plugins('steal/build','steal/build/scripts','steal/build/styles',function(){
	steal.build('clui/simplemodal/scripts/build.html',{to: 'clui/simplemodal'});
});
