// map fixtures for this application

steal("jquery/dom/fixture", function(){
	
$.fixture.make(["recipes","recipe"],5, function(i, recipe){
  var descriptions = ["take out trash", "make ice", "walk dogs"]
  return {
    name: "This is recipe "+i,
    description: descriptions[i%3]
  }
})
$.fixture.make(["tests","test"],5, function(i, test){
  var descriptions = ["take out trash", "make ice", "walk dogs"]
  return {
    name: "This is test "+i,
    description: descriptions[i%3]
  }
})
$.fixture.make(["anothers","another"],5, function(i, another){
  var descriptions = ["take out trash", "make ice", "walk dogs"]
  return {
    name: "This is another "+i,
    description: descriptions[i%3]
  }
})
})