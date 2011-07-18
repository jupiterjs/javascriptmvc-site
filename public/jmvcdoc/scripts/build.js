//steal/js cookbook/scripts/compress.js
load("steal/rhino/steal.js");
steal.plugins('steal/build', 'steal/build/scripts', function() {
	steal.build('jmvcdoc/jmvcdoc.html', {
		to: 'jmvcdoc'
	});
});