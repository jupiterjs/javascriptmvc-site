steal('jquery/controller',
	'jquery/controller/view',
	'jquery/view/ejs')
	.then(function()
{

$.Controller.extend("Kitten",
{
	
},
{
	init : function(){
		this.element.html(this.view('//cookbook/views/kitten.ejs'));
	}

});

})