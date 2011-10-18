(function() {

	var event = jQuery.event,

		//helper that finds handlers by type and calls back a function, this is basically handle
		findHelper = function( events, types, callback ) {
			var t, type, typeHandlers, all, h, handle, namespaces, namespace;
			for ( t = 0; t < types.length; t++ ) {
				type = types[t];
				all = type.indexOf(".") < 0;
				if (!all ) {
					namespaces = type.split(".");
					type = namespaces.shift();
					namespace = new RegExp("(^|\\.)" + namespaces.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");
				}
				typeHandlers = (events[type] || []).slice(0);

				for ( h = 0; h < typeHandlers.length; h++ ) {
					handle = typeHandlers[h];
					if (!handle.selector && (all || namespace.test(handle.namespace)) ) {
						callback(type, handle.origHandler || handle.handler);
					}
				}
			}
		};

	/**
	 * Finds event handlers of a given type on an element.
	 * @param {HTMLElement} el
	 * @param {Array} types an array of event names
	 * @param {String} [selector] optional selector
	 * @return {Array} an array of event handlers
	 */
	event.find = function( el, types, selector ) {
		var events = $.data(el, "events"),
			handlers = [],
			t, liver, live;

		if (!events ) {
			return handlers;
		}

		if ( selector ) {
			if (!events.live ) {
				return [];
			}
			live = events.live;

			for ( t = 0; t < live.length; t++ ) {
				liver = live[t];
				if ( liver.selector === selector && $.inArray(liver.origType, types) !== -1 ) {
					handlers.push(liver.origHandler || liver.handler);
				}
			}
		} else {
			// basically re-create handler's logic
			findHelper(events, types, function( type, handler ) {
				handlers.push(handler);
			});
		}
		return handlers;
	};
	/**
	 * Finds all events.  Group by selector.
	 * @param {HTMLElement} el the element
	 * @param {Array} types event types
	 */
	event.findBySelector = function( el, types ) {
		var events = $.data(el, "events"),
			selectors = {},
			//adds a handler for a given selector and event
			add = function( selector, event, handler ) {
				var select = selectors[selector] || (selectors[selector] = {}),
					events = select[event] || (select[event] = []);
				events.push(handler);
			};

		if (!events ) {
			return selectors;
		}
		//first check live:
		$.each(events.live || [], function( i, live ) {
			if ( $.inArray(live.origType, types) !== -1 ) {
				add(live.selector, live.origType, live.origHandler || live.handler);
			}
		});
		//then check straight binds
		findHelper(events, types, function( type, handler ) {
			add("", type, handler);
		});

		return selectors;
	};
	event.supportTouch = "ontouchend" in document;
	
	$.fn.respondsTo = function( events ) {
		if (!this.length ) {
			return false;
		} else {
			//add default ?
			return event.find(this[0], $.isArray(events) ? events : [events]).length > 0;
		}
	};
	$.fn.triggerHandled = function( event, data ) {
		event = (typeof event == "string" ? $.Event(event) : event);
		this.trigger(event, data);
		return event.handled;
	};
	/**
	 * Only attaches one event handler for all types ...
	 * @param {Array} types llist of types that will delegate here
	 * @param {Object} startingEvent the first event to start listening to
	 * @param {Object} onFirst a function to call 
	 */
	event.setupHelper = function( types, startingEvent, onFirst ) {
		if (!onFirst ) {
			onFirst = startingEvent;
			startingEvent = null;
		}
		var add = function( handleObj ) {

			var bySelector, selector = handleObj.selector || "";
			if ( selector ) {
				bySelector = event.find(this, types, selector);
				if (!bySelector.length ) {
					$(this).delegate(selector, startingEvent, onFirst);
				}
			}
			else {
				//var bySelector = event.find(this, types, selector);
				if (!event.find(this, types, selector).length ) {
					event.add(this, startingEvent, onFirst, {
						selector: selector,
						delegate: this
					});
				}

			}

		},
			remove = function( handleObj ) {
				var bySelector, selector = handleObj.selector || "";
				if ( selector ) {
					bySelector = event.find(this, types, selector);
					if (!bySelector.length ) {
						$(this).undelegate(selector, startingEvent, onFirst);
					}
				}
				else {
					if (!event.find(this, types, selector).length ) {
						event.remove(this, startingEvent, onFirst, {
							selector: selector,
							delegate: this
						});
					}
				}
			};
		$.each(types, function() {
			event.special[this] = {
				add: add,
				remove: remove,
				setup: function() {},
				teardown: function() {}
			};
		});
	};
})(jQuery);
(function(){
	
var $event = $.event, 
	oldTrigger = $event.trigger, 
	isElement = function(o){
		return (
			typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
			typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string"
		) || (o === window) || (o === document);
	};
$.event.trigger = function(event, data, elem, onlyHandlers){
		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			exclusive;

		if ( type.indexOf("!") >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.exclusive = exclusive;
		event.namespace = namespaces.join(".");
		event.namespace_re = new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)");
		
		// triggerHandler() and global events don't bubble or run the default action
		if ( onlyHandlers || !elem ) {
			event.preventDefault();
			event.stopPropagation();
		}

		// Handle a global trigger
		if ( !elem ) {
			// TODO: Stop taunting the data cache; remove global events and always attach to document
			jQuery.each( jQuery.cache, function() {
				// internalKey variable is just used to make it easier to find
				// and potentially change this stuff later; currently it just
				// points to jQuery.expando
				var internalKey = jQuery.expando,
					internalCache = this[ internalKey ];
				if ( internalCache && internalCache.events && internalCache.events[ type ] ) {
					jQuery.event.trigger( event, data, internalCache.handle.elem );
				}
			});
			return;
		}

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		event.target = elem;

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		var cur = elem,
			// IE doesn't like method names with a colon (#3533, #8272)
			ontype = type.indexOf(":") < 0 ? "on" + type : "";

		// Fire event on the current element, then bubble up the DOM tree
		do {
			var handle = jQuery._data( cur, "handle" );

			event.currentTarget = cur;
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Trigger an inline bound script
			if ( ontype && jQuery.acceptData( cur ) && cur[ ontype ] && cur[ ontype ].apply( cur, data ) === false ) {
				event.result = false;
				event.preventDefault();
			}

			// Bubble up to document, then to window
			cur = cur.parentNode || cur.ownerDocument || cur === event.target.ownerDocument && window;
		} while ( cur && !event.isPropagationStopped() );

		// If nobody prevented the default action, do it now
		if ( !event.isDefaultPrevented() ) {
			var old,
				special = jQuery.event.special[ type ] || {};

			if ( (!special._default || special._default.call( elem.ownerDocument, event ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction)() check here because IE6/7 fails that test.
				// IE<9 dies on focus to hidden element (#1486), may want to revisit a try/catch.
				try {
					if ( ontype && elem[ type ] ) {
						// Don't re-trigger an onFOO event when we call its FOO() method
						old = elem[ ontype ];

						if ( old ) {
							elem[ ontype ] = null;
						}

						jQuery.event.triggered = type;
						elem[ type ]();
					}
				} catch ( ieError ) {}

				if ( old ) {
					elem[ ontype ] = old;
				}

				jQuery.event.triggered = undefined;
			}
		}
		
		return event.result;
}
// a copy of $'s handle function that goes until it finds 
$.event.handle = function( event ) {
	
	event = jQuery.event.fix( event || window.event );
	// Snapshot the handlers list since a called handler may add/remove events.
	var handlers = ((jQuery._data( this, "events" ) || {})[ event.type ] || []).slice(0),
		run_all = !event.exclusive && !event.namespace,
		args = Array.prototype.slice.call( arguments, 0 );

	// Use the fix-ed Event rather than the (read-only) native event
	args[0] = event;
	event.currentTarget = this;

	// JMVC CHANGED
	var oldType = event.type, 
		// run if default is included
		runDefault = event.type !== "default" && $event.special['default'] && 
			// and its not an original event
			!event.originalEvent && 
			// and its an element 
			isElement(event.target);
	if (runDefault) {
		$event.special['default'].triggerDefault(event, this, args[1]);
	}
	event.type = oldType;
	
	for ( var j = 0, l = handlers.length; j < l; j++ ) {
		var handleObj = handlers[ j ];
		if( event.firstPass ){
			event.firstPass = false;
			continue;
		}

		// Triggered event must 1) be non-exclusive and have no namespace, or
		// 2) have namespace(s) a subset or equal to those in the bound event.
		if ( run_all || event.namespace_re.test( handleObj.namespace ) ) {
			// Pass in a reference to the handler function itself
			// So that we can later remove it
			event.handler = handleObj.handler;
			event.data = handleObj.data;
			event.handleObj = handleObj;

			var ret = handleObj.handler.apply( this, args );


			if ( ret !== undefined ) {
				event.result = ret;
				if ( ret === false ) {
					event.preventDefault();
					event.stopPropagation();
				}
			}

			if ( event.isImmediatePropagationStopped() ) {
				break;
			}
		}
	}
	
	// JMVC CHANGED
	if (runDefault) {
		$event.special['default'].checkAndRunDefaults(event, this);
	}
	return event.result;
}
})(jQuery);
(function($){


var current,
	rnamespaces = /\.(.*)$/,
	returnFalse = function(){return false},
	returnTrue = function(){return true};

/**
 * @function
 * @parent jquery.event.pause
 * Pauses an event (to be resumed later);
 */
//
/**
 * @function
 * @parent jquery.event.pause
 * 
 * Resumes an event
 */
//
/**
 * @page jquery.event.pause Pause-Resume
 * @plugin jquery/event/pause
 * @parent specialevents
 * The jquery/event/pause plugin adds the ability to pause and 
 * resume events. 
 * 
 *     $('#todos').bind('show', function(ev){
 *       ev.pause();
 *       
 *       $(this).load('todos.html', function(){
 *         ev.resume();
 *       });
 *     })
 * 
 * When an event is paused, stops calling other event handlers for the 
 * event (similar to event.stopImmediatePropagation() ).  But when 
 * resume is called on the event, it will begin calling events on event handlers
 * after the 'paused' event handler.
 * 
 * 
 * Pause-able events complement the [jQuery.event.special.default default]
 * events plugin, providing the ability to easy create widgets with 
 * an asynchronous API.  
 * 
 * ## Example
 * 
 * Consider a basic tabs widget that:
 * 
 *   - trigger's a __show__ event on panels when they are to be displayed
 *   - shows the panel after the show event.
 *   
 * The sudo code for this controller might look like:
 * 
 *     $.Controller('Tabs',{
 *       ".button click" : function( el ){
 *         var panel = this.getPanelFromButton( el );
 *         panel.triggerAsync('show', function(){
 *           panel.show();
 *         })
 *       }
 *     })
 *     
 * Someone using this plugin would be able to delay the panel showing until ready:
 * 
 *     $('#todos').bind('show', function(ev){
 *       ev.pause();
 *       
 *       $(this).load('todos.html', function(){
 *         ev.resume();
 *       });
 *     })
 * 
 * Or prevent the panel from showing at all:
 * 
 *     $('#todos').bind('show', function(ev){
 *       if(! isReady()){
 *         ev.preventDefault();
 *       }
 *     })
 *     
 * ## Limitations
 * 
 * The element and event handler that the <code>pause</code> is within can not be removed before 
 * resume is called.
 * 
 * ## Big Example
 * 
 * The following example shows a tabs widget where the user is prompted to save, ignore, or keep editing
 * a tab when a new tab is clicked.
 * 
 * @demo jquery/event/pause/pause.html
 * 
 * It's a long, but great example of how to do some pretty complex state management with JavaScriptMVC.
 * 
 */
$.Event.prototype.isPaused = returnFalse


$.Event.prototype.pause = function(){
	current = this;
	this.stopImmediatePropagation();
	this.isPaused = returnTrue;
};

$.Event.prototype.resume = function(){
	this.isPaused = this.isImmediatePropagationStopped = this.isPropagationStopped = returnFalse;
	
	var el = this.liveFired || this.currentTarget || this.target,
		defult = $.event.special['default'], 
		oldType = this.type;
	
	// if we were in a 'live' -> run our liveHandler
	if(this.handleObj.origHandler){
		var cur = this.currentTarget;
		this.currentTarget = this.liveFired;
		this.liveFired = undefined;
		
		liveHandler.call(el, this, cur );
		el = cur;
	}
	if(this.isImmediatePropagationStopped()){
		return false;
	}
	
	// skip the event the first pass because we've already handled it
	this.firstPass = true;
	
	if(!this.isPropagationStopped()){
		$.event.trigger(this, [this.handleObj], el, false);
	}
	
};


function liveHandler( event, after ) {
	var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
		elems = [],
		selectors = [],
		events = jQuery._data( this, "events" );

	// Make sure we avoid non-left-click bubbling in Firefox (#3861) and disabled elements in IE (#6911)
	if ( event.liveFired === this || !events || !events.live || event.target.disabled || event.button && event.type === "click" ) {
		return;
	}

	if ( event.namespace ) {
		namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
	}

	event.liveFired = this;

	var live = events.live.slice(0);

	for ( j = 0; j < live.length; j++ ) {
		handleObj = live[j];

		if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
			selectors.push( handleObj.selector );

		} else {
			live.splice( j--, 1 );
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		close = match[i];

		for ( j = 0; j < live.length; j++ ) {
			handleObj = live[j];

			if ( close.selector === handleObj.selector && (!namespace || namespace.test( handleObj.namespace )) && !close.elem.disabled ) {
				elem = close.elem;
				related = null;

				// Those two events require additional checking
				if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
					event.type = handleObj.preType;
					related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];

					// Make sure not to accidentally match a child element with the same selector
					if ( related && jQuery.contains( elem, related ) ) {
						related = elem;
					}
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, handleObj: handleObj, level: close.level });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];
		// inserted to only call elements after this point ...
		if(after) {
			if(after === match.elem){
				after = undefined;
			}
			continue;
		}

		if ( maxLevel && match.level > maxLevel ) {
			break;
		}

		event.currentTarget = match.elem;
		event.data = match.handleObj.data;
		event.handleObj = match.handleObj;

		ret = match.handleObj.origHandler.apply( match.elem, arguments );

		if ( ret === false || event.isPropagationStopped() ) {
			maxLevel = match.level;

			if ( ret === false ) {
				stop = false;
			}
			if ( event.isImmediatePropagationStopped() ) {
				break;
			}
		}
	}

	return stop;
}

})(jQuery)