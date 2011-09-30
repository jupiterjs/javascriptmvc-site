// map fixtures for this application

steal("jquery/dom/fixture", function(){
	
	$.fixture.make("recipe", 5, function(i, recipe){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "recipe "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
})