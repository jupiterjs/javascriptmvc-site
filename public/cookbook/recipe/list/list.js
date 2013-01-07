steal('can','./init.ejs', 'cookbook/models/recipe.js',
function (can, initEJS, Recipe) {
	/**
	 * @class cookbook/recipe/list
	 * @alias RecipeList
	 * @parent index
	 * @inherits can.Control
	 * Lists recipes and lets you destroy them.
	 */
	return can.Control(
	/** @Static */
	{
		defaults : {
			Recipe: Recipe
		}
	},
	/** @Prototype */
	{
		init: function () {
			this.list = new Recipe.List();
			this.element.html(initEJS(this.list));
			this.list.replace(Recipe.findAll());
		},
		'.destroy click': function (el) {
			if (confirm("Are you sure you want to destroy?")) {
				el.closest('.recipe').data('recipe').destroy();
			}
		},
		"{Recipe} created": function (Model, ev, instance) {
			this.list.push(instance);
		}
	});
});