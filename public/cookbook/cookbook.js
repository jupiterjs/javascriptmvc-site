steal(
	'./cookbook.css', 			// application CSS file
	'./models/models.js',		// steals all your models
	'./fixtures/fixtures.js',	// sets up fixtures for your models
	'cookbook/recipe/create',
	'cookbook/recipe/list',
	function(){					// configure your application
		
		$('#recipes').cookbook_recipe_list();
		$('#create').cookbook_recipe_create();
})