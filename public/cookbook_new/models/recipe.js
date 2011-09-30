steal('jquery/model', function(){

/**
 * @parent index
 * Wraps backend recipe services.  Enables 
 * [Cookbook.Models.Recipe.static.findAll retrieving],
 * [Cookbook.Models.Recipe.static.update updating],
 * [Cookbook.Models.Recipe.static.destroy destroying], and
 * [Cookbook.Models.Recipe.static.create creating] recipes.
 */
$.Model('Cookbook.Models.Recipe',
/* @Static */
{
	/**
 	 * Retrieves recipes data from your backend services.
 	 * @param {Object} params params that might refine your results.
 	 * @param {Function} success a callback function that returns wrapped recipe objects.
 	 * @param {Function} error a callback function for an error in the ajax request.
 	 */
	findAll: "/recipes.json",
	/**
 	 * Retrieves recipe's data from your backend services.
 	 * @param {Object} params params that might refine your results (it should include an id for findOne).
 	 * @param {Function} success a callback function that returns wrapped recipe objects.
 	 * @param {Function} error a callback function for an error in the ajax request.
 	 */
  	findOne : "/recipes/{id}.json", 
	/**
	 * Creates a recipe.
	 * @param {Object} attrs A recipe's attributes.
	 * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
	 * @param {Function} error a callback that should be called with an object of errors.
	 */
  	create : "/recipes.json",
	/**
	 * Updates a recipe's data.
	 * @param {String} id A unique id representing your recipe.
	 * @param {Object} attrs Data to update your recipe with.
	 * @param {Function} success a callback function that indicates a successful update.
 	 * @param {Function} error a callback that should be called with an object of errors.
     */
 	update : "/recipes/{id}.json",
	/**
 	 * Destroys a recipe's data.
 	 * @param {String} id A unique id representing your recipe.
	 * @param {Function} success a callback function that indicates a successful destroy.
 	 * @param {Function} error a callback that should be called with an object of errors.
	 */
  	destroy : "/recipes/{id}.json"
},
/* @Prototype */
{});

})