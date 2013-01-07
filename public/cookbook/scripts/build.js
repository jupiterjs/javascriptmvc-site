//js cookbook/scripts/build.js

load("steal/rhino/rhino.js");
steal('steal/build').then('steal/build/scripts','steal/build/styles',function(){
	steal.build('cookbook/scripts/build.html',{to: 'cookbook'});
});
