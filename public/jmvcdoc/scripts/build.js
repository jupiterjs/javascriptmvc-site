//steal/js cookbook/scripts/compress.js
load("steal/rhino/rhino.js");
steal('steal/build', 'steal/build/scripts', function() {
	steal.build('jmvcdoc/jmvcdoc.html', {
		to: 'jmvcdoc'
	});
});