steal('player/popcorn',
	'jquery/controller',
	'jquery/dom/dimensions',
	'jquery/event/resize',
	'jquery/event/drag/limit',

	function() {
		$.Controller('PlayerPosition', {
			init : function(){
				this.moving = $("<div>").css({
					position: 'absolute',
					left: "0px"
				})
			
				this.element.css("position","relative")
					.append(this.moving);
			
				this.moving.outerWidth( this.element.height() );
				this.moving.outerHeight( this.element.height() );

			},
			"{video} timeupdate" : function(video){
				this.resize()
			},
			resize : function(){
				var video = this.options.video,
					percent = video.currentTime() / video.duration(),
					width = this.element.width() - this.moving.outerWidth();
				
				this.moving.css("left", percent*width+"px")
			},
			"div draginit" : function(el, ev, drag){
				this.options.video.pause()
				drag.limit(this.element)
			},
			"div dragend" : function(el, ev, drag){
				var video = this.options.video,
					width = this.element.width() - this.moving.outerWidth()
					percent = parseInt(this.moving.css("left"), 10) / width;
			
				video.currentTime(  percent * video.duration()  );
				video.play()
			}
		});
});