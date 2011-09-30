steal('funcunit').then(function(){

module("Acme.Create", { 
	setup: function(){
		S.open("//acme/create/create.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Acme.Create Demo","demo text");
});


});