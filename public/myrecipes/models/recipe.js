steal('jquery/model', function(){

/**
 * @parent index
 * Wraps backend recipe services.  Enables 
 * [Myrecipes.Models.Recipe.static.findAll retrieving],
 * [Myrecipes.Models.Recipe.static.update updating],
 * [Myrecipes.Models.Recipe.static.destroy destroying], and
 * [Myrecipes.Models.Recipe.static.create creating] recipes.
 */
$.Model.extend('Myrecipes.Models.Recipe',
/* @Static */
{
	/**
 	 * Retrieves recipes data from your backend services.
 	 */
	findAll: "/recipes.json",
  	findOne : "/recipes/{id}.json", 
  	create : "/recipes.json",
 	update : "/recipes/{id}.json",
  	destroy : "/recipes/{id}.json"
},
/* @Prototype */
{});

})