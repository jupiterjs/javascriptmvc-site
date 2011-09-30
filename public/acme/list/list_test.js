steal('funcunit').then(function(){

module("Acme.List", { 
	setup: function(){
		S.open("//acme/list/list.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Acme.List Demo","demo text");
});


});