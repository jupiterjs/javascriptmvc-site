module("Model: Myrecipes.Models.Another")

asyncTest("findAll", function(){
	stop(2000);
	Myrecipes.Models.Another.findAll({}, function(anothers){
		ok(anothers)
        ok(anothers.length)
        ok(anothers[0].name)
        ok(anothers[0].description)
		start()
	});
	
})

asyncTest("create", function(){
	stop(2000);
	new Myrecipes.Models.Another({name: "dry cleaning", description: "take to street corner"}).save(function(another){
		ok(another);
        ok(another.id);
        equals(another.name,"dry cleaning")
        another.destroy()
		start();
	})
})
asyncTest("update" , function(){
	stop();
	new Myrecipes.Models.Another({name: "cook dinner", description: "chicken"}).
            save(function(another){
            	equals(another.description,"chicken");
        		another.update({description: "steak"},function(another){
        			equals(another.description,"steak");
        			another.destroy();
        			start()
        		})
            })

});
asyncTest("destroy", function(){
	stop(2000);
	new Myrecipes.Models.Another({name: "mow grass", description: "use riding mower"}).
            destroy(function(another){
            	ok( true ,"Destroy called" )
            	start();
            })
})