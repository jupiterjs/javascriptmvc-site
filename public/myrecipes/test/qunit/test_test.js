module("Model: Myrecipes.Models.Test")

asyncTest("findAll", function(){
	stop(2000);
	Myrecipes.Models.Test.findAll({}, function(tests){
		ok(tests)
        ok(tests.length)
        ok(tests[0].name)
        ok(tests[0].description)
		start()
	});
	
})

asyncTest("create", function(){
	stop(2000);
	new Myrecipes.Models.Test({name: "dry cleaning", description: "take to street corner"}).save(function(test){
		ok(test);
        ok(test.id);
        equals(test.name,"dry cleaning")
        test.destroy()
		start();
	})
})
asyncTest("update" , function(){
	stop();
	new Myrecipes.Models.Test({name: "cook dinner", description: "chicken"}).
            save(function(test){
            	equals(test.description,"chicken");
        		test.update({description: "steak"},function(test){
        			equals(test.description,"steak");
        			test.destroy();
        			start()
        		})
            })

});
asyncTest("destroy", function(){
	stop(2000);
	new Myrecipes.Models.Test({name: "mow grass", description: "use riding mower"}).
            destroy(function(test){
            	ok( true ,"Destroy called" )
            	start();
            })
})