	console.log("BEFORE ONEFINGER defined")
steal.plugins('jquery', 'jquery/controller').then(function($){
	console.log("ONEFINGER defined")
	var supportTouch = "ontouchend" in document,
		data = function(event){
			var d = event.originalEvent.touches ?
				event.originalEvent.touches[ 0 ] :
				event;
			return {
				coords: [ d.clientX, d.clientY ]
			};
		};
		var scrollableEl = function(el){
			return $(el).map(function(){
			 var elem = this,
			  isWin = !elem.nodeName || $.inArray( elem.nodeName.toLowerCase(), ['iframe','#document','html','body'] ) != -1;
			
			  if( !isWin )
			   return elem;
			
			 var doc = (elem.contentWindow || elem).document || elem.ownerDocument || elem;
			
			 return $.browser.safari || doc.compatMode == 'BackCompat' ?
			  doc.body : 
			  doc.documentElement;
			});
		};
		$.Controller("Clui.Onefinger", {
			defaults: {
				touchstart: supportTouch ? "touchstart" : "mousedown",
				touchmove: supportTouch ? "touchmove" : "mousemove",
				touchend: supportTouch ? "touchend" : "mouseup"
			}
		}, {
			init: function(){
				console.log("here")
				this.scrollableEl = scrollableEl(this.element);
			},
			"{touchstart}": function(el, ev){
				console.log("touchstart")
				this.scrollStartPos = $(this.scrollableEl).scrollTop() + data(ev).coords[1];
				ev.preventDefault();
			},
			"{touchend}": function(){
				this.scrollStartPos = null;
			},
			"mouseleave": function(el, ev){
				this.scrollStartPos = null;
			},
			"{touchmove}": function(el, ev){
				if(!this.scrollStartPos) return;
				console.log("touchmove")
				ev.preventDefault();
                $(this.scrollableEl).scrollTop( this.scrollStartPos - data(ev).coords[1] );
//                if (ev.target.toString().indexOf("javascript://")==-1)
//                    {
//                        event.preventDefault();
//                    
//                    }
			}
		})
	
})