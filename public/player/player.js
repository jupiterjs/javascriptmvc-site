steal('play','position').then(function(){
	
	var video = Popcorn("#trailer");
	
	$('#play').play({video: video});
	$('#position').player_position({video: video});
})

/*
$.Model("Player") // track, duration, running, position


$.Model("Test") // track





*/




