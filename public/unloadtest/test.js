test("unload with other ", function(){
	stop()
	$('<iframe id="myframe" src="cookbook.html"></iframe>').appendTo('#qunit-test-area').load(function(){
		$($("#myframe")[0].contentWindow).bind("unload", function(){
			ok(true, "called unload")
			start();
		})
		$("#myframe").remove()
	})
})
