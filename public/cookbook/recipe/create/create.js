steal('can', 'cookbook/models/recipe.js', './init.ejs', 'jquery/dom/form_params',
	function (can, Recipe, initEJS) {

	/**
	 * @class cookbook/recipe/create
	 * @alias RecipeCreate
	 * @parent index
	 * @inherits jQuery.Controller
	 * Creates recipes
	 */
	return can.Control(
	/** @Prototype */
	{
		init: function () {
			this.element.html(initEJS());
		},
		submit: function (el, ev) {
			ev.preventDefault();
			el.find('[type=submit]').val('Creating...')
			new Recipe(el.formParams()).save(function() {
				el.find('[type=submit]').val('Create');
				el[0].reset()
			});
		}
	});
});