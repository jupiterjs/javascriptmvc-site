//js cookbook/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs", function(DocumentJS){
	DocumentJS('cookbook/index.html', {
		markdown : ['cookbook', 'steal', 'jquery', 'can', 'funcunit']
	});
});