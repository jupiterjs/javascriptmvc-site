steal(
	'funcunit',
	'./models/recipe_test.js',
	'cookbook/recipe/create/create_test.js',
	'cookbook/recipe/list/list_test.js',
	function (S) {

	// this tests the assembly 
	module("cookbook", {
		setup : function () {
			S.open("//cookbook/index.html");
		}
	});

	test("welcome test", function () {
		equals(S("h1").text(), "Welcome to JavaScriptMVC!", "welcome text");
	});

	
	test("creating a recipes adds it to the list ", function () {
		
		S("[name=name]").type("Ice Water");
		S("[name=description]").type("Pour water in a glass. Add ice cubes.");
		
		S("[type=submit]").click();
		
		S("h3:contains(Ice Water)").exists();
		S("p:contains(Pour water in a glass. Add ice cubes.)").exists()
	});
});
