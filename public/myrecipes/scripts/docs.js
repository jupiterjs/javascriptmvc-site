//js myrecipes/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs").then(function(){
	DocumentJS('myrecipes/myrecipes.html', {
		markdown : ['myrecipes']
	});
});