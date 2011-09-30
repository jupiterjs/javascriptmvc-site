//js my_app/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs").then(function(){
	DocumentJS('my_app/my_app.html', {
		markdown : ['my_app']
	});
});