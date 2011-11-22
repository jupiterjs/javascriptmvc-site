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

/**
 * @function jQuery.fn.triggerAsync
 * @plugin jquery/event/default
 * @parent jquery.event.pause
 * 
 * Triggers an event and calls success when the event has finished propagating through the DOM and preventDefault is not called.
 *
 *     $('#panel').triggerAsync('show', function() {
 *        $('#panel').show();
 *     });
 *
 * You can also provide a callback that gets called if preventDefault was called on the event:
 *
 *     $('panel').triggerAsync('show', function(){
 *         $('#panel').show();
 *     },function(){ 
 *         $('#other').addClass('error');
 *     });
 *
 * triggerAsync is design to work with the [jquery.event.pause] plugin although it is defined in _jquery/event/default_.
 * 
 * @param {String} type The type of event
 * @param {Object} data The data for the event
 * @param {Function} success a callback function which occurs upon success
 * @param {Function} prevented a callback function which occurs if preventDefault was called
 */
$.fn.triggerAsync = function(type, data, success, prevented){
	if(typeof data == 'function'){
		success = data;
		data = undefined;
	}
	
	if ( this[0] ) {
		var event = $.Event( type ),
			old = event.preventDefault;
		
		event.preventDefault = function(){
			old.apply(this, arguments);
			prevented && prevented(this)
		}
		//event._success= success;
		jQuery.event.trigger( {type: type, _success: success}, data, this[0]  );
	} else{
		success.call(this);
	}
	return this;
}
	


/**
 * @add jQuery.event.special
 */
//cache default types for performance
var types = {}, rnamespaces= /\.(.*)$/, $event = $.event;
/**
 * @attribute default
 * @parent specialevents
 * @plugin jquery/event/default
 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/event/default/default.js
 * @test jquery/event/default/qunit.html
 * Allows you to perform default actions as a result of an event.
 * 
 * Event based APIs are a powerful way of exposing functionality of your widgets.  It also fits in 
 * quite nicely with how the DOM works.
 * 
 * 
 * Like default events in normal functions (e.g. submitting a form), synthetic default events run after
 * all event handlers have been triggered and no event handler has called
 * preventDefault or returned false.
 * 
 * To listen for a default event, just prefix the event with default.
 * 
 *     $("div").bind("default.show", function(ev){ ... });
 *     $("ul").delegate("li","default.activate", function(ev){ ... });
 * 
 * 
 * ## Example
 * 
 * Lets look at how you could build a simple tabs widget with default events.
 * First with just jQuery:
 * 
 * Default events are useful in cases where you want to provide an event based 
 * API for users of your widgets.  Users can simply listen to your synthetic events and 
 * prevent your default functionality by calling preventDefault.  
 * 
 * In the example below, the tabs widget provides a show event.  Users of the 
 * tabs widget simply listen for show, and if they wish for some reason, call preventDefault 
 * to avoid showing the tab.
 * 
 * In this case, the application developer doesn't want to show the second 
 * tab until the checkbox is checked. 
 * 
 * @demo jquery/event/default/defaultjquery.html
 * 
 * Lets see how we would build this with JavaScriptMVC:
 * 
 * @demo jquery/event/default/default.html
 */
$event.special["default"] = {
	add: function( handleObj ) {
		//save the type
		types[handleObj.namespace.replace(rnamespaces,"")] = true;
		
		//move the handler ...
		var origHandler = handleObj.handler;
		
		handleObj.origHandler = origHandler;
		handleObj.handler = function(ev, data){
			if(!ev._defaultActions) ev._defaultActions = [];
			ev._defaultActions.push({element: this, handler: origHandler, event: ev, data: data, currentTarget: ev.currentTarget})
		}
	},
	setup: function() {return true},
	triggerDefault : function(event, elem, data){
		
		var defaultGetter = jQuery.Event("default."+event.type);
			
		$.extend(defaultGetter,{
			target: elem,
			_defaultActions: event._defaultActions,
			exclusive : true
		});
		
		defaultGetter.stopPropagation();
	
		//default events only work on elements
		if(elem){
			// Event object or event type
			var type = defaultGetter.type || event, namespaces = [], exclusive;
			
			if (type.indexOf("!") >= 0) {
				// Exclusive events trigger only for the exact event (no namespaces)
				type = type.slice(0, -1);
				exclusive = true;
			}
			
			if (type.indexOf(".") >= 0) {
				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split(".");
				type = namespaces.shift();
				namespaces.sort();
			}
			defaultGetter.type = type;
			defaultGetter.exclusive = exclusive;
			
			$event.handle.call(elem, defaultGetter, data);
		}
	},
	checkAndRunDefaults : function(event, elem){
		//fire if there are default actions to run && 
	    //        we have not prevented default &&
	    //        propagation has been stopped or we are at the document element
	    //        we have reached the document
		if (!event.isDefaultPrevented() &&
		    (!event.isPaused || !event.isPaused()) &&  // no paused function or it's not paused
	         event._defaultActions  &&
	        ( ( event.isPropagationStopped() ) ||
	          ( !elem.parentNode && !elem.ownerDocument ) )
	          
	        ) {			
			var origNamespace = event.namespace,
				origType = event.type,
				origLiveFired = event.liveFired;
			// put event back
			event.namespace= event.type;
			event.type = "default";
			event.liveFired = null;
			
			// call each event handler
			for(var i = 0 ; i < event._defaultActions.length; i++){
				var a  = event._defaultActions[i],
					oldHandle = event.handled;
				event.currentTarget = a.currentTarget;
				a.handler.call(a.element, event, a.data);
				event.handled = event.handled === null ? oldHandle : true;
	        }
	        
			event._defaultActions = null; //set to null so everyone else on this element ignores it
	        
			if(event._success){
				event._success(event);
			}
			
			event.namespace= origNamespace;
			event.type = origType;
			event.liveFired = origLiveFired;
			
	    }
	}
}

// overwrite trigger to allow default types
var oldTrigger = $event.trigger,
	triggerDefault = $event.special['default'].triggerDefault,
	checkAndRunDefaults = $event.special['default'].checkAndRunDefaults,
	oldData = jQuery._data;
	
$._data = function(elem, name, data){
	// always need to supply a function to call for handle
	if(!data && name === "handle"){
		var func = oldData.apply(this, arguments);
		return function(e){
			// Discard the second event of a jQuery.event.trigger() and
			// when an event is called after a page has unloaded
			return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
				jQuery.event.handle.apply( this, arguments ) :
				undefined;
		}
	}
	return oldData.apply(this, arguments)
}

$event.trigger =  function defaultTriggerer( event, data, elem, onlyHandlers){
	// Event object or event type
	var type = event.type || event,
		namespaces = [],

	// Caller can pass in an Event, Object, or just an event type string
	event = typeof event === "object" ?
		// jQuery.Event object
		event[ jQuery.expando ] ? event :
		// Object literal
		new jQuery.Event( type, event ) :
		// Just the event type (string)
		new jQuery.Event( type );
		
    event._defaultActions = []; //set depth for possibly reused events
	
	oldTrigger.call($.event, event, data, elem, onlyHandlers);
};
	
	
	
	
})(jQuery)