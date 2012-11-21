load('steal/rhino/rhino.js');

steal("documentjs", function(DocumentJS){
	DocumentJS('site/scripts/doc.html',{
		markdown : [ 'jquery', 'can', 'site' ],
		out : 'docs'
	});
});
