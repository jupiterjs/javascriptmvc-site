var control = {

		Position : can.Control({

			init : function(){

				this.moving = $("<div>").css({
					position: 'absolute',
					left: "0px"
				})
			
				this.element.css("position","relative")
					.append( this.moving );
			
				this.moving.outerWidth( this.element.height() );
				this.moving.outerHeight( this.element.height() );
			},

			"{video.video} timeupdate" : function(video){
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
		}),
		Play : can.Control({
			init : function(){
				if ( this.options.video.video.paused ) {
					this.element.text("▶")
				} else {
					this.element.text("||")
				}
			},

			"{video.video} play" : function() {
				this.element.text("||").addClass('stop')
			},

			"{video.video} pause" : function() {
				this.element.text("▶").removeClass('stop')
			},

			click : function() {
				if( this.options.video.video.paused ) {
					this.options.video.play()
				} else {
					this.options.video.pause()
				}
			}
		})
	},
	video = Popcorn("#trailer"),

position = new control.Position("#position", {
	video : video
}),

play = new control.Play("#play", {
	video : video
});
