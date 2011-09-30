steal('jquery/model', function(){

/**
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend recipe services.  
 */
$.Model('Cookbook.Models.Recipe',
/* @Static */
{
	findAll: "/recipes.json",
  	findOne : "/recipes/{id}.json", 
  	create : "/recipes.json",
 	update : "/recipes/{id}.json",
  	destroy : "/recipes/{id}.json",
},
/* @Prototype */
{});

})