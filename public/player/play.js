steal.plugins('player/popcorn','jquery/controller').then(function(){
	
	$.Controller('Play', {
		init : function(){
			if( this.options.video.video.paused ){
				this.element.text("play")
			} else {
				this.element.text("stop")
			}
		},
		"{video} play" : function(){
			this.element.text("stop").addClass('stop')
		},
		"{video} pause" : function(){
			this.element.text("play").removeClass('stop')
		},
		click : function(){
			if( this.options.video.video.paused ){
				this.options.video.play()
			} else {
				this.options.video.pause()
			}
		}
	});
	
	
})
