// map fixtures for this application

steal("jquery/dom/fixture", function(){
	
$.fixture.make("recipe", 5, function(i, recipe){
  var descriptions = ["take out trash", "make ice", "walk dogs"]
  return {
    name: "This is recipe "+i,
    description: descriptions[i%3]
  }
})
})