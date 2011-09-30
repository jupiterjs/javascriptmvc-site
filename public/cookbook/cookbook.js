steal(
	'./cookbook.css', 			// application CSS file
	'./models/models.js',		// steals all your models
	'./fixtures/fixtures.js',	// sets up fixtures for your models
	'cookbook/recipe/list', function(){					// configure your application
		// steal.dev.log(1, 2, 3, document.documentElement)
		$('#recipes').cookbook_recipe_list();
		// var obj = ["12",]
		// $('#create').cookbook_recipe_create();
}).then("jquery")
