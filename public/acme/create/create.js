steal('jquery/controller').then(function($){

/**
 * @class Acme.Create
 */
$.Controller('Acme.Create',
/* @Static */
{
	defaults : {
	
	}
},
/* @Prototype */
{
	init : function(){
		this.element.html("Hello World!");
	}
})

});