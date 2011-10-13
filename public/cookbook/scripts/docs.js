//js cookbook/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs").then(function(){
	DocumentJS('cookbook/cookbook.html', {
		markdown : ['cookbook']
	});
});