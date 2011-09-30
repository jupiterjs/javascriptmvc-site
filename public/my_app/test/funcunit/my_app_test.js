steal("funcunit", function(){
	module("my_app test", { 
		setup: function(){
			S.open("//my_app/my_app.html");
		}
	});
	
	test("Copy Test", function(){
		equals(S("h1").text(), "Welcome to JavaScriptMVC 3.X!","welcome text");
	});
})