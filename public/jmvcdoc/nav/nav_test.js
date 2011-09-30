steal.plugins('funcunit').then(function(){

module("Jmvcdoc.Nav", { 
	setup: function(){
		S.open("//jmvcdoc/nav/nav.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Jmvcdoc.Nav Demo","demo text");
});


});