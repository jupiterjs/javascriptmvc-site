steal('jquery/controller', 'jquery/model', 'jquery/view/ejs').then(function($){

/**
 * @class Acme.List
 */
$.Controller('Acme.List',
/* @Static */
{
	defaults: {
		model: null,
		template: "//acme/list/views/row.ejs",
		params: {}
	}
},
/* @Prototype */
{
	init: function(el){
		this.options.model.findAll(this.options.params, this.callback('list'))
	},
	list: function(items){
		this.element.html("//acme/list/views/list.ejs", {
			items: items,
			template: this.options.template
		})
	},
	// on tr click, publish selected event with model instance
	"tr click": function(el, ev){
		el.trigger("selected", el.model())
	}
})

});