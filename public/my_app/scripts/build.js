//steal/js my_app/scripts/compress.js

load("steal/rhino/rhino.js");
steal('steal/build').then('steal/build/scripts','steal/build/styles',function(){
	steal.build('my_app/scripts/build.html',{to: 'my_app'});
});
