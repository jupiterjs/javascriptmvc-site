steal("funcunit/qunit", "cookbook/fixtures", "cookbook/models/recipe.js", function(){
	module("Model: Cookbook.Models.Recipe")
	
	test("findAll", function(){
		expect(4);
		stop();
		Cookbook.Models.Recipe.findAll({}, function(recipes){
			ok(recipes)
	        ok(recipes.length)
	        ok(recipes[0].name)
	        ok(recipes[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Cookbook.Models.Recipe({name: "dry cleaning", description: "take to street corner"}).save(function(recipe){
			ok(recipe);
	        ok(recipe.id);
	        equals(recipe.name,"dry cleaning")
	        recipe.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Cookbook.Models.Recipe({name: "cook dinner", description: "chicken"}).
	            save(function(recipe){
	            	equals(recipe.description,"chicken");
	        		recipe.update({description: "steak"},function(recipe){
	        			equals(recipe.description,"steak");
	        			recipe.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Cookbook.Models.Recipe({name: "mow grass", description: "use riding mower"}).
	            destroy(function(recipe){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})