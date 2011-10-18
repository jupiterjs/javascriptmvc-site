steal('funcunit',function(){

module("Cookbook.Recipe.List", { 
	setup: function(){
		S.open("//cookbook/recipe/list/list.html");
	}
});

test("delete recipes", function(){
	S('#create').click()
	
	// wait until grilled cheese has been added
	S('h3:contains(Grilled Cheese X)').exists();
	
	S.confirm(true);
	S('h3:last a').click();
	
	
	S('h3:contains(Grilled Cheese)').missing(function(){
		ok(true,"Grilled Cheese Removed")
	});
	
});


});