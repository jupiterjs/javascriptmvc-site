steal('jquery/model', function(){

/**
 * @parent index
 * Wraps backend another services.  Enables 
 * [Myrecipes.Models.Another.static.findAll retrieving],
 * [Myrecipes.Models.Another.static.update updating],
 * [Myrecipes.Models.Another.static.destroy destroying], and
 * [Myrecipes.Models.Another.static.create creating] anothers.
 */
$.Model.extend('Myrecipes.Models.Another',
/* @Static */
{
	/**
 	 * Retrieves anothers data from your backend services.
 	 */
	findAll: "/anothers.json",
  	findOne : "/anothers/{id}.json", 
  	create : "/anothers.json",
 	update : "/anothers/{id}.json",
  	destroy : "/anothers/{id}.json"
},
/* @Prototype */
{});

})