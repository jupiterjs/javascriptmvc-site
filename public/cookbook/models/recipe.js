steal('can', function (can) {
	/**
	 * @class cookbook/models/recipe
	 * @alias Recipe
	 * @parent index
	 * @inherits can.Model
	 *
	 * Wraps backend recipe services.
	 */
	return can.Model(
	/* @static */
	{
		findAll : "GET /recipes",
		findOne : "GET /recipes/{id}",
		create : "POST /recipes",
		update : "PUT /recipes/{id}",
		destroy : "DELETE /recipes/{id}"
	},
	/* @Prototype */
	{});
});