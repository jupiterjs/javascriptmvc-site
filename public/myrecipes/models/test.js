steal('jquery/model', function(){

/**
 * @parent index
 * Wraps backend test services.  Enables 
 * [Myrecipes.Models.Test.static.findAll retrieving],
 * [Myrecipes.Models.Test.static.update updating],
 * [Myrecipes.Models.Test.static.destroy destroying], and
 * [Myrecipes.Models.Test.static.create creating] tests.
 */
$.Model.extend('Myrecipes.Models.Test',
/* @Static */
{
	/**
 	 * Retrieves tests data from your backend services.
 	 */
	findAll: "/tests.json",
  	findOne : "/tests/{id}.json", 
  	create : "/tests.json",
 	update : "/tests/{id}.json",
  	destroy : "/tests/{id}.json"
},
/* @Prototype */
{});

})