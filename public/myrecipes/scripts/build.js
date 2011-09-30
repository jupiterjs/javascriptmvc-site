//steal/js myrecipes/scripts/compress.js

load("steal/rhino/rhino.js");
steal('steal/build').then('steal/build/scripts','steal/build/styles',function(){
	steal.build('myrecipes/scripts/build.html',{to: 'myrecipes'});
});
