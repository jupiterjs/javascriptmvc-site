steal(
	'funcunit',
	'./list.js',
	'cookbook/models/recipe.js',
	'cookbook/models/fixtures',
	function(S, RecipeList, Recipe, recipeStore ){

	module("cookbook/recipe/list", { 
		setup: function(){
			$("#qunit-test-area").append("<div id='recipes'></div>");
			this.list = new RecipeList("#recipes");
		},
		teardown: function(){
			$("#qunit-test-area").empty();
			recipeStore.reset();
		}
	});
	
	test("lists all recipes", function(){
		stop();
		
		// retrieve recipes
		Recipe.findAll({}, function(recipes){
			// make sure they are listed in the page
			
			S(".recipe").size(recipes.length,function(){
				ok(true, "All recipes listed");
				
				start();
			})
		})
	});
	
	test("lists created recipes", function(){
		
		new Recipe({
			name: "Grilled Cheese",
			description: "grill cheese in bread"
		}).save();
		
		S('h3:contains(Grilled Cheese X)').exists("Lists created recipe");
	})
	
	
	test("delete recipes", function(){
		new Recipe({
			name: "Ice Water",
			description: "mix ice and water"
		}).save();
		
		// wait until grilled cheese has been added
		S('h3:contains(Ice Water X)').exists();
		
		S.confirm(true);
		S('h3:last a').click();
		
		
		S('h3:contains(Ice Water)').missing("Grilled Cheese Removed");
		
	});


});