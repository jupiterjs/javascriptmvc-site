//js clui/simplemodal/scripts/doc.js

load('steal/rhino/steal.js');
steal.plugins("documentjs").then(function(){
	DocumentJS('clui/simplemodal/simplemodal.html');
});