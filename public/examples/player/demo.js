var control, video, position, play;


// Object literal to hold onto our controller classes.
control = {

	// Position controller will be used to update the video position indicator.
	Position : can.Control({

		// Gets called upon instantiation.
		init : function(){

			// The movie starts at the beginning, so set the indicator to the
			// left.
			this.moving = $("<div>").css({
				position: 'absolute',
				left: "0px"
			})
		
			// Add it to the DOM.
			this.element.css("position","relative")
				.append( this.moving );
		
			// Make the indicator square.
			this.moving.outerWidth( this.element.height() );
			this.moving.outerHeight( this.element.height() );
		},

		// Templated binding the to Popcorn video object.
		"{video.video} timeupdate" : function( video ) {
			this.resize()
		},

		// Calculated and updates the position of the moving indicator.
		resize : function(){
			var video = this.options.video,
				percent = video.currentTime() / video.duration(),
				width = this.element.width() - this.moving.outerWidth();
			
			this.moving.css("left", percent*width+"px")
		},

		// Allows the user to drag the moving indicator to a specific point in
		// the video.
		"div draginit" : function(el, ev, drag){
			this.options.video.pause()
			drag.limit(this.element)
		},

		// When the user stops dragging, update the position and play the video
		// from that point.
		"div dragend" : function(el, ev, drag){
			var video = this.options.video,
				width = this.element.width() - this.moving.outerWidth()
				percent = parseInt(this.moving.css("left"), 10) / width;
		
			video.currentTime(  percent * video.duration()  );
			video.play()
		}
	}),
	// Play controller manages playing and pausing.
	Play : can.Control({

		// Set the text of the play button depending on if the video is playing
		// already or not.
		init : function(){
			if ( this.options.video.paused() ) {
				this.element.text("▶")
			} else {
				this.element.text("||")
			}
		},

		// Update button text on play / pause
		"{video.video} play" : function() {
			this.element.text("||").addClass('stop')
		},

		"{video.video} pause" : function() {
			this.element.text("▶").removeClass('stop')
		},

		// Play / pause the video on click
		click : function() {
			if( this.options.video.paused() ) {
				this.options.video.play()
			} else {
				this.options.video.pause()
			}
		}
	})
};

// Grab the popcorn video object.
video = Popcorn("#trailer");

// Instantiate the position and play controllers, passing in the popcorn video
// object.
position = new control.Position("#position", {
	video : video
});

play = new control.Play("#play", {
	video : video
});
