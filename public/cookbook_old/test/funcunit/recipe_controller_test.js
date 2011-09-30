/*global module: true, ok: true, equals: true, S: true, test: true */
module("recipe", {
	setup: function () {
		// open the page
		S.open("//cookbook/cookbook.html");

		//make sure there's at least one recipe on the page before running a test
		S('.recipe').exists();
	},
	//a helper function that creates a recipe
	create: function () {
		S("[name=name]").type("Ice");
		S("[name=description]").type("Cold Water");
		S("[type=submit]").click();
		S('.recipe:nth-child(2)').exists();
	}
});

test("recipes present", function () {
	ok(S('.recipe').size() >= 1, "There is at least one recipe");
});

test("create recipes", function () {

	this.create();

	S(function () {
		ok(S('.recipe:nth-child(2) td:first').text().match(/Ice/), "Typed Ice");
	});
});

test("edit recipes", function () {

	this.create();

	S('.recipe:nth-child(2) a.edit').click();
	S(".recipe input[name=name]").type(" Water");
	S(".recipe input[name=description]").type("\b\b\b\b\bTap Water");
	S(".update").click();
	S('.recipe:nth-child(2) .edit').exists(function () {

		ok(S('.recipe:nth-child(2) td:first').text().match(/Ice Water/), "Typed Ice Water");

		ok(S('.recipe:nth-child(2) td:nth-child(2)').text().match(/Cold Tap Water/), "Typed Cold Tap Water");
	});
});

test("destroy", function () {

	this.create();

	S(".recipe:nth-child(2) .destroy").click();

	//makes the next confirmation return true
	S.confirm(true);

	S('.recipe:nth-child(2)').missing(function () {
		ok("destroyed");
	});

});