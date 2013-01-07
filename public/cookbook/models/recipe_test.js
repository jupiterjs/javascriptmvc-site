steal( "./recipe.js", 
	   "funcunit/qunit", 
	   "cookbook/models/fixtures", 
	   function( Recipe ){
	   	
	module("cookbook/models/recipe");
	
	test("findAll", function(){
		expect(4);
		stop();
		Recipe.findAll({}, function(recipes){
			ok(recipes, "findAll provides an object")
	        ok(recipes.length, "findAll provides something array-like")
	        ok(recipes[0].name, "findAll provides an object with a name")
	        ok(recipes[0].description, "findAll provides an object with a description")
			start();
		});
	});
	
	test("create", function(){
		expect(3)
		stop();
		new Recipe({name: "dry cleaning", description: "take to street corner"}).save(function(recipe) {
			ok(recipe, "save provides an object");
			ok(recipe.id, "save provides and object with an id");
			equals(recipe.name,"dry cleaning", "save provides an objec with a name")
			recipe.destroy()
			start();
		});
	});

	test("update" , function(){
		expect(2);
		stop();
		new Recipe({name: "cook dinner", description: "chicken"}).save(function(recipe) {
			equals(recipe.description,"chicken", "save creates with description");
			recipe.attr({description: "steak"}).save(function(recipe){
				equals(recipe.description,"steak", "save udpates with description");
				recipe.destroy();
				start();
			});
        });
	});

	test("destroy", function(){
		expect(1);
		stop();
		new Recipe({name: "mow grass", description: "use riding mower"}).destroy(function(recipe) {
			ok( true ,"Destroy called" )
			start();
		});
	});
});