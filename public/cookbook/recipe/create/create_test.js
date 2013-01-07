steal('funcunit', 
	'./create.js',
	'cookbook/models/recipe.js',
	'cookbook/models/fixtures', 
	function (S, RecipeCreate, Recipe, recipeStore ) {

	module("cookbook/recipe/create", {
		setup: function(){
			$("#qunit-test-area").append("<form id='create'></form>");
			new RecipeCreate("#create");
		},
		teardown: function(){
			$("#qunit-test-area").empty();
			recipeStore.reset();
		}
	});
	
	test("create recipes", function () {
		stop();
		
		Recipe.bind("created",function(ev, recipe){
			ok(true, "Ice Water added");
			equals(recipe.name, "Ice Water", "name set correctly");
			equals(recipe.description, 
				"Pour water in a glass. Add ice cubes.", 
				"description set correctly");
			start();
			Recipe.unbind("created",arguments.callee);
		})
		
		S("[name=name]").type("Ice Water");
		S("[name=description]").type("Pour water in a glass. Add ice cubes.");
		
		S("[type=submit]").click();
		
		S("[type=submit]").val("Creating...","button text changed while created");
		S("[type=submit]").val("Create", function(){
			ok(true, "button text changed back after create");
			equals(S("[name=name]").val(), "", "form reset");
			equals(S("[name=description]").val(), "", "form reset");
		});
	});

});