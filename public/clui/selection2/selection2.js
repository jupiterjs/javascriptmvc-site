steal.css('selection').plugins('jquery/event/selection','jquery/event/drag','jquery/view/ejs').then(function($){

	$.event.selection.preventDefault = true;
	var supportTouch = "ontouchend" in document,
		scrollEvent = "touchmove scroll",
		touchStartEvent = supportTouch ? "touchstart" : "mousedown",
		touchStopEvent = supportTouch ? "touchend" : "mouseup",
		touchMoveEvent = supportTouch ? "touchmove" : "mousemove",
		coords = function(event){
			var d = event.originalEvent.touches ?
				event.originalEvent.touches[ 0 ] :
				event;
			return {
					clientX: d.clientX, 
					clientY: d.clientY
			};
		};
	//draws 
	$.Controller('Clui.Selection',{
		defaults: {
			touchStartEvent: touchStartEvent, 
			touchStopEvent: touchStopEvent,
			touchMoveEvent: touchMoveEvent
		}
	}, 
	{
		init : function(){
			this.selecting = false;
			// add a context menu to this area
			this.$ = {
				selection: $("<div class='clui_selections'/>").hide().appendTo(document.body),
				start : $("<div class='clui_selection_start clui_selection_range'/>").hide().appendTo(document.body),
				end : $("<div class='clui_selection_end clui_selection_range'/>").hide().appendTo(document.body),
				cmenu: $("<div class='clui_selection_cmenu'/>").hide().appendTo(document.body),
				magGlass: $("<div class='clui_mag_glass' />").hide().appendTo(document.body)
			};
			this.delegate(".clui_selection_cmenu .buttons div", touchStartEvent, this.callback('clickMenuButton'))
			this.delegate(".clui_selection_cmenu .arrow", touchStartEvent, this.callback('clickArrow'))
		},
		"{touchStopEvent}" : function(el, ev){
			if(!this.selecting && !el.closest(".clui_selection_range, .clui_selection_cmenu").length){
				this._hideAll();
				this.selecting = false;
			} 
		},
		_hideAll: function(){
			this.$.start.hide();
			this.$.end.hide();
			this.$.selection.hide();
			this.$.cmenu.hide();
			this.$.magGlass.hide();
			this.selecting = false;
		},
		"selectionStart" : function(el, ev, range){
			if (!$(ev.target).closest(".clui_selection_range, .clui_selection_cmenu").length) {
				this.selecting = true;
				this.highlight(range);
				this.renderMagnifier(ev, range);
			} else {
				ev.preventDefault(); // should kill future highlighting
			}
			
		},
		renderMagnifier: function(ev, range){
			// get a range that is the current cloned range, only for the last 15 characters
			var xy = coords(ev),
				left = {
					clientX: xy.clientX > 40? xy.clientX - 40: 0,
					clientY: xy.clientY
				},
				right = {
					clientX: xy.clientX + 40,
					clientY: xy.clientY
				},
				leftR = $.Range(left),
				rightR = $.Range(right),
				fullR = leftR.move('END_TO_END', rightR),
				contents = fullR.range.cloneContents();
			if(!contents.childNodes.length) return;
			this.$.magGlass.html("").append(contents)
				.css({
					display:'block',
					left: xy.clientX-50,
					top: xy.clientY-50
				})
		},
		highlight : function(entire){
			var rects = $.makeArray( entire.rects('page') ),
				childs = this.$.selection.children();
			for(var i =0; i < rects.length; i++){
				
				var child = childs.eq(i).length ? childs.eq(i) : $('<div class="clui_select">')
				//.text(rects[i].left)
				.appendTo(this.$.selection);
				child.css({
					left: rects[i].left+"px",
					top: rects[i].top+"px"
				}).width(rects[i].width)
				  .height(rects[i].height);
			}
			
			childs.slice(i).remove();
			
			this.$.selection.show();
		},
		"selectionMoving" : function(el, ev){
			this._hideAll();
		},
		"selectionMove" : function(el, ev, range){
			this.renderMagnifier(ev, range);
			this.highlight(range);
		},
		_renderDraggables: function(renderMenu){
			var rect = this.currentRange.rect('page'),
				startR = this.currentRange.clone().collapse(),
				start = startR.rect('page');
			var endR = this.currentRange.clone().collapse(false);
			var end = endR.rect('page');
			//put draggables that change range
			this.$.start.css({
				display:'block',
				left: (start.left - this.$.start.width() / 2 )+"px",
				top: start.top+"px"
			})
			this.$.end.css({
				display:'block',
				left: (end.left - this.$.end.width() / 2)+"px",
				top: end.top+"px"
			});
			if (false && renderMenu) {
				this.$.cmenu.html("//clui/selection2/views/cmenu", {}).css({
					display: 'block',
					left: (start.left - this.$.end.width() / 2) + "px",
					top: start.top - this.$.cmenu.height() + "px"
				})
			}
		},
		"selectionEnd" : function(el, ev, range){
			
			this.highlight(range);
			//get start and endpoints
			this.currentRange = range;
			this._renderDraggables(true);
			
		},
		/**
		* expand the current selection by checking for the next match of the regex passed in
		*/
		expandSelectionRight: function(regex){
			// get my containing element
			var end = this.currentRange.end(),
				// get the boundary of the next word (offset in textnode)
			 	remainingText = end.container.data.slice(end.offset),
				nextMatch = remainingText.match(regex),
				// by default we'll match to the end of the container
				index = end.container.length - 1;

			if(nextMatch){
				index = nextMatch.index + end.offset;
			}	
			
			// advance to the next item
			if(index == end.offset){
				this.currentRange.end(index+1);
				return this.expandSelectionRight(regex);
			}
			
			this.currentRange.end(index);
			
			this.highlight(this.currentRange);
			this._renderDraggables(false);
		},
		expandSelectionLeft: function(regex){
			// get my containing element
			var start = this.currentRange.start(),
				// get the boundary of the next word (offset in textnode)
			 	prevText = start.container.data.slice(0, start.offset),
				prevMatch = regex.exec(prevText),
				match,
				// by default we'll match to the start of the container
				index = 0;
			
			while(prevMatch){
				match = prevMatch;
				prevText = prevText.slice(prevMatch.index+1);
				index += prevMatch.index+1;
				prevMatch = regex.exec(prevText);
			}
			
			// advance to the prev item
			if(index == start.offset && index > 0){
				this.currentRange.start(index-1);
				return this.expandSelectionLeft(regex);
			}
			
			this.currentRange.start(index);
			this.highlight(this.currentRange);
			this._renderDraggables(false);
		},
		clickMenuButton: function(ev){
			var el = $(ev.target);
			this.find(".clui_selection_cmenu .selected").removeClass('selected')
			el.addClass('selected');
		},
		clickArrow: function(ev){
			var el = $(ev.target),
				selectedEl = this.find(".clui_selection_cmenu .selected"), 
				regex,
				goRight = el.hasClass('right');
			if(selectedEl.hasClass('word')){
				regex = /\s|\./;
			} else if (selectedEl.hasClass('sentence')){
				regex = /\./;
			} else if (selectedEl.hasClass('paragraph')){
				regex = /\\n/;
			}
			if(goRight) {
				this.expandSelectionRight(regex);
			} else {
				this.expandSelectionLeft(regex);
			}
		},
		".clui_selection_range draginit" : function(el, ev, drag){
			this.selecting = true;
		},
		// we need to prevent the drags from intersecting each other
		".clui_selection_range dragmove" : function(el, ev, drag){
			// keep selectoin from getting this
			ev.stopImmediatePropagation();
			
			// now we should move the drag location where the text should be ...
			this.$.selection.hide();
			el.hide();
			
			var pos = $.Range(ev),
				isStart =el.hasClass('clui_selection_start'), 
				left;
			
			if(isStart) {
				// make sure pos isn't before
				
				if(this.currentRange.compare('END_TO_START', pos) == 1){
					this.currentRange.move('START_TO_START', pos)
					this.renderMagnifier(ev, this.currentRange);
				} else {
					pos = this.currentRange.clone();
				}
				// pos.collapse();
			} else {
				
				
				if(pos.compare('START_TO_START', this.currentRange) == 1){
					this.currentRange.move('END_TO_END', pos);
					this.renderMagnifier(ev, this.currentRange);
				} else {
					pos = this.currentRange.clone();
				}
				// pos.collapse(false);
			}
			
			var rect = pos.rect('page');
			if(isStart){
				left = rect.left-el.width()/2;
			} else{
				left = rect.left+rect.width-el.width()/2;
			}
			
			drag.location.top(rect.top);
			drag.location.left(left)
			
			
			this.highlight(this.currentRange);
			el.show()
		},
		".clui_selection_range dragend" : function(el, ev, drag){
			this._renderDraggables(true);
			this.selecting = false;
		}
	});
	


});