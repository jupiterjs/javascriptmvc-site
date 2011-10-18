steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'cookbook/models' )
.then( './views/init.ejs', 
       './views/recipe.ejs', 
       function($){

/**
 * @class Cookbook.Recipe.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists recipes and lets you destroy them.
 */
$.Controller('Cookbook.Recipe.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Cookbook.Models.Recipe.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.recipe').model().destroy();
		}
	},
	"{Cookbook.Models.Recipe} destroyed" : function(Recipe, ev, recipe) {
		recipe.elements(this.element).remove();
	},
	"{Cookbook.Models.Recipe} created" : function(Recipe, ev, recipe){
		this.element.append(this.view('init', [recipe]))
	},
	"{Cookbook.Models.Recipe} updated" : function(Recipe, ev, recipe){
		recipe.elements(this.element)
		      .html(this.view('recipe', recipe) );
	}
});

});