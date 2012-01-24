(function($){
    /**
     * @page jQuery.toJSON jQuery.toJSON
     * @parent jquerymx.lang
     * 
     *     jQuery.toJSON( json-serializble )
     * 
     * Converts the given argument into a JSON respresentation.
     * 
     * If an object has a "toJSON" function, that will 
     * be used to get the representation.
     * Non-integer/string keys are skipped in the 
     * object, as are keys that point to a function.
     * 
     * json-serializble:
     * The *thing* to be converted.
     */
    $.toJSON = function(o, replacer, space, recurse)
    {
        if (typeof(JSON) == 'object' && JSON.stringify)
            return JSON.stringify(o, replacer, space);

        if (!recurse && $.isFunction(replacer))
            o = replacer("", o);

        if (typeof space == "number")
            space = "          ".substring(0, space);
        space = (typeof space == "string") ? space.substring(0, 10) : "";
        
        var type = typeof(o);
    
        if (o === null)
            return "null";
    
        if (type == "undefined" || type == "function")
            return undefined;
        
        if (type == "number" || type == "boolean")
            return o + "";
    
        if (type == "string")
            return $.quoteString(o);
    
        if (type == 'object')
        {
            if (typeof o.toJSON == "function") 
                return $.toJSON( o.toJSON(), replacer, space, true );
            
            if (o.constructor === Date)
            {
                var month = o.getUTCMonth() + 1;
                if (month < 10) month = '0' + month;

                var day = o.getUTCDate();
                if (day < 10) day = '0' + day;

                var year = o.getUTCFullYear();
                
                var hours = o.getUTCHours();
                if (hours < 10) hours = '0' + hours;
                
                var minutes = o.getUTCMinutes();
                if (minutes < 10) minutes = '0' + minutes;
                
                var seconds = o.getUTCSeconds();
                if (seconds < 10) seconds = '0' + seconds;
                
                var milli = o.getUTCMilliseconds();
                if (milli < 100) milli = '0' + milli;
                if (milli < 10) milli = '0' + milli;

                return '"' + year + '-' + month + '-' + day + 'T' +
                             hours + ':' + minutes + ':' + seconds + 
                             '.' + milli + 'Z"'; 
            }

            var process = ($.isFunction(replacer)) ?
                function (k, v) { return replacer(k, v); } :
                function (k, v) { return v; },
                nl = (space) ? "\n" : "",
                sp = (space) ? " " : "";

            if (o.constructor === Array) 
            {
                var ret = [];
                for (var i = 0; i < o.length; i++)
                    ret.push(( $.toJSON( process(i, o[i]), replacer, space, true ) || "null" ).replace(/^/gm, space));

                return "[" + nl + ret.join("," + nl) + nl + "]";
            }
        
            var pairs = [], proplist;
            if ($.isArray(replacer)) {
                proplist = $.map(replacer, function (v) {
                    return (typeof v == "string" || typeof v == "number") ?
                        v + "" :
                        null;
                });
            }
            for (var k in o) {
                var name, val, type = typeof k;

                if (proplist && $.inArray(k + "", proplist) == -1)
                    continue;

                if (type == "number")
                    name = '"' + k + '"';
                else if (type == "string")
                    name = $.quoteString(k);
                else
                    continue;  //skip non-string or number keys
            
                val = $.toJSON( process(k, o[k]), replacer, space, true );
            
                if (typeof val == "undefined")
                    continue;  //skip pairs where the value is a function.
            
                pairs.push((name + ":" + sp + val).replace(/^/gm, space));
            }

            return "{" + nl + pairs.join("," + nl) + nl + "}";
        }
    };

    /** 
     * @function jQuery.evalJSON
     * Evaluates a given piece of json source.
     **/
    $.evalJSON = function(src)
    {
        if (typeof(JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        return eval("(" + src + ")");
    };
    
    /** 
     * @function jQuery.secureEvalJSON
     * Evals JSON in a way that is *more* secure.
     **/
    $.secureEvalJSON = function(src)
    {
        if (typeof(JSON) == 'object' && JSON.parse)
            return JSON.parse(src);
        
        var filtered = src;
        filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
        filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
        filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
        
        if (/^[\],:{}\s]*$/.test(filtered))
            return eval("(" + src + ")");
        else
            throw new SyntaxError("Error parsing JSON, source is not valid.");
    };

    /** 
     * @function jQuery.quoteString
     * 
     * Returns a string-repr of a string, escaping quotes intelligently.  
     * Mostly a support function for toJSON.
     * 
     * Examples:
     * 
     *      jQuery.quoteString("apple") //-> "apple"
     * 
     *      jQuery.quoteString('"Where are we going?", she asked.')
     *        // -> "\"Where are we going?\", she asked."
     **/
    $.quoteString = function(string)
    {
        if (string.match(_escapeable))
        {
            return '"' + string.replace(_escapeable, function (a) 
            {
                var c = _meta[a];
                if (typeof c === 'string') return c;
                c = a.charCodeAt();
                return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + string + '"';
    };
    
    var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;
    
    var _meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    };
})(jQuery);
(function( $ ) {
	// Several of the methods in this plugin use code adapated from Prototype
	//  Prototype JavaScript framework, version 1.6.0.1
	//  (c) 2005-2007 Sam Stephenson
	var regs = {
		undHash: /_|-/,
		colons: /::/,
		words: /([A-Z]+)([A-Z][a-z])/g,
		lowUp: /([a-z\d])([A-Z])/g,
		dash: /([a-z\d])([A-Z])/g,
		replacer: /\{([^\}]+)\}/g,
		dot: /\./
	},
		// gets the nextPart property from current
		// add - if true and nextPart doesnt exist, create it as an empty object
		getNext = function(current, nextPart, add){
			return current[nextPart] !== undefined ? current[nextPart] : ( add && (current[nextPart] = {}) );
		},
		// returns true if the object can have properties (no nulls)
		isContainer = function(current){
			var type = typeof current;
			return current && ( type == 'function' || type == 'object' );
		},
		// a reference
		getObject,
		/** 
		 * @class jQuery.String
		 * @parent jquerymx.lang
		 * 
		 * A collection of useful string helpers. Available helpers are:
		 * <ul>
		 *   <li>[jQuery.String.capitalize|capitalize]: Capitalizes a string (some_string &raquo; Some_string)</li>
		 *   <li>[jQuery.String.camelize|camelize]: Capitalizes a string from something undercored 
		 *       (some_string &raquo; someString, some-string &raquo; someString)</li>
		 *   <li>[jQuery.String.classize|classize]: Like [jQuery.String.camelize|camelize], 
		 *       but the first part is also capitalized (some_string &raquo; SomeString)</li>
		 *   <li>[jQuery.String.niceName|niceName]: Like [jQuery.String.classize|classize], but a space separates each 'word' (some_string &raquo; Some String)</li>
		 *   <li>[jQuery.String.underscore|underscore]: Underscores a string (SomeString &raquo; some_string)</li>
		 *   <li>[jQuery.String.sub|sub]: Returns a string with {param} replaced values from data.
		 *       <code><pre>
		 *       $.String.sub("foo {bar}",{bar: "far"})
		 *       //-> "foo far"</pre></code>
		 *   </li>
		 * </ul>
		 * 
		 */
		str = $.String = $.extend( $.String || {} , {
			
			
			/**
			 * @function getObject
			 * Gets an object from a string.  It can also modify objects on the
			 * 'object path' by removing or adding properties.
			 * 
			 *     Foo = {Bar: {Zar: {"Ted"}}}
		 	 *     $.String.getObject("Foo.Bar.Zar") //-> "Ted"
			 * 
			 * @param {String} name the name of the object to look for
			 * @param {Array} [roots] an array of root objects to look for the 
			 *   name.  If roots is not provided, the window is used.
			 * @param {Boolean} [add] true to add missing objects to 
			 *  the path. false to remove found properties. undefined to 
			 *  not modify the root object
			 * @return {Object} The object.
			 */
			getObject : getObject = function( name, roots, add ) {
			
				// the parts of the name we are looking up
				// ['App','Models','Recipe']
				var parts = name ? name.split(regs.dot) : [],
					length =  parts.length,
					current,
					ret, 
					i,
					r = 0,
					type;
				
				// make sure roots is an array
				roots = $.isArray(roots) ? roots : [roots || window];
				
				if(length == 0){
					return roots[0];
				}
				// for each root, mark it as current
				while( current = roots[r++] ) {
					// walk current to the 2nd to last object
					// or until there is not a container
					for (i =0; i < length - 1 && isContainer(current); i++ ) {
						current = getNext(current, parts[i], add);
					}
					// if we can get a property from the 2nd to last object
					if( isContainer(current) ) {
						
						// get (and possibly set) the property
						ret = getNext(current, parts[i], add); 
						
						// if there is a value, we exit
						if( ret !== undefined ) {
							// if add is false, delete the property
							if ( add === false ) {
								delete current[parts[i]];
							}
							return ret;
							
						}
					}
				}
			},
			/**
			 * Capitalizes a string
			 * @param {String} s the string.
			 * @return {String} a string with the first character capitalized.
			 */
			capitalize: function( s, cache ) {
				return s.charAt(0).toUpperCase() + s.substr(1);
			},
			/**
			 * Capitalizes a string from something undercored. Examples:
			 * @codestart
			 * jQuery.String.camelize("one_two") //-> "oneTwo"
			 * "three-four".camelize() //-> threeFour
			 * @codeend
			 * @param {String} s
			 * @return {String} a the camelized string
			 */
			camelize: function( s ) {
				s = str.classize(s);
				return s.charAt(0).toLowerCase() + s.substr(1);
			},
			/**
			 * Like [jQuery.String.camelize|camelize], but the first part is also capitalized
			 * @param {String} s
			 * @return {String} the classized string
			 */
			classize: function( s , join) {
				var parts = s.split(regs.undHash),
					i = 0;
				for (; i < parts.length; i++ ) {
					parts[i] = str.capitalize(parts[i]);
				}

				return parts.join(join || '');
			},
			/**
			 * Like [jQuery.String.classize|classize], but a space separates each 'word'
			 * @codestart
			 * jQuery.String.niceName("one_two") //-> "One Two"
			 * @codeend
			 * @param {String} s
			 * @return {String} the niceName
			 */
			niceName: function( s ) {
				return str.classize(s,' ');
			},

			/**
			 * Underscores a string.
			 * @codestart
			 * jQuery.String.underscore("OneTwo") //-> "one_two"
			 * @codeend
			 * @param {String} s
			 * @return {String} the underscored string
			 */
			underscore: function( s ) {
				return s.replace(regs.colons, '/').replace(regs.words, '$1_$2').replace(regs.lowUp, '$1_$2').replace(regs.dash, '_').toLowerCase();
			},
			/**
			 * Returns a string with {param} replaced values from data.
			 * 
			 *     $.String.sub("foo {bar}",{bar: "far"})
			 *     //-> "foo far"
			 *     
			 * @param {String} s The string to replace
			 * @param {Object} data The data to be used to look for properties.  If it's an array, multiple
			 * objects can be used.
			 * @param {Boolean} [remove] if a match is found, remove the property from the object
			 */
			sub: function( s, data, remove ) {
				var obs = [],
					remove = typeof remove == 'boolean' ? !remove : remove;
				obs.push(s.replace(regs.replacer, function( whole, inside ) {
					//convert inside to type
					var ob = getObject(inside, data, remove);
					
					// if a container, push into objs (which will return objects found)
					if( isContainer(ob) ){
						obs.push(ob);
						return "";
					}else{
						return ""+ob;
					}
				}));
				
				return obs.length <= 1 ? obs[0] : obs;
			},
			_regs : regs
		});
})(jQuery);
(function() {
    // break
    /**
     * @function jQuery.cookie
     * @parent dom
     * @plugin jquery/dom/cookie
     * @author Klaus Hartl/klaus.hartl@stilbuero.de
     *
     *  JavaScriptMVC's packaged cookie plugin is written by
     *  Klaus Hartl (stilbuero.de)<br />
	 *  Dual licensed under the MIT and GPL licenses:<br />
	 *  http://www.opensource.org/licenses/mit-license.php<br />
	 *  http://www.gnu.org/licenses/gpl.html
	 *  </p>
	 *  <p>
	 *  Create a cookie with the given name and value and other optional parameters.
	 *  / Get the value of a cookie with the given name.
	 *  </p>
	 *  <h3>Quick Examples</h3>
	 * 
	 *  Set the value of a cookie.
	 *  
	 *     $.cookie('the_cookie', 'the_value');
	 * 
	 *  Create a cookie with all available options.
	 *  @codestart
	 *  $.cookie('the_cookie', 'the_value',
	 *  { expires: 7, path: '/', domain: 'jquery.com', secure: true });
	 *  @codeend
	 * 
	 *  Create a session cookie.
	 *  @codestart
	 *  $.cookie('the_cookie', 'the_value');
	 *  @codeend
	 * 
	 *  Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
	 *  used when the cookie was set.
	 *  @codestart
	 *  $.cookie('the_cookie', null);
	 *  @codeend
	 * 
	 *  Get the value of a cookie.
	 *  @codestart
	 *  $.cookie('the_cookie');
	 *  @codeend
	 * 
     *
     * @param {String} [name] The name of the cookie.
     * @param {String} [value] The value of the cookie.
     * @param {Object} [options] An object literal containing key/value pairs to provide optional cookie attributes.<br />
     * @param {Number|Date} [expires] Either an integer specifying the expiration date from now on in days or a Date object.
     *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
     *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
     *                             when the the browser exits.<br />
     * @param {String} [path] The value of the path atribute of the cookie (default: path of page that created the cookie).<br />
     * @param {String} [domain] The value of the domain attribute of the cookie (default: domain of page that created the cookie).<br />
     * @param {Boolean} secure If true, the secure attribute of the cookie will be set and the cookie transmission will
     *                        require a secure protocol (like HTTPS).<br />
     * @return {String} the value of the cookie or {undefined} when setting the cookie.
     */
    jQuery.cookie = function(name, value, options) {
        if (typeof value != 'undefined') { // name and value given, set cookie
            options = options ||
            {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            if (typeof value == 'object' && jQuery.toJSON) {
                value = jQuery.toJSON(value);
            }
            var expires = '';
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                }
                else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            // CAUTION: Needed to parenthesize options.path and options.domain
            // in the following expressions, otherwise they evaluate to undefined
            // in the packed version for some reason...
            var path = options.path ? '; path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        }
        else { // only name given, get cookie
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            if (jQuery.evalJSON && cookieValue && cookieValue.match(/^\s*\{/)) {
                try {
                    cookieValue = jQuery.evalJSON(cookieValue);
                }
                catch (e) {
                }
            }
            return cookieValue;
        }
    };

})(jQuery);
(function($){

/**
 * @class jQuery.Model.List.Cookie
 * @plugin jquery/model/list/cookie
 * @test jquery/model/list/cookie/qunit.html
 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/model/list/cookie/cookie.js
 * @parent jQuery.Model.List
 * 
 * Provides a store-able list of model instances.  The following 
 * retrieves and saves a list of contacts:
 * 
 * @codestart
 * var contacts = new Contact.List([]).retrieve("contacts");
 * 
 * // add each contact to the page
 * contacts.each(function(){
	addContact(this);
 * });
 * 
 * // when a new cookie is crated
 * $("#contact").submit(function(ev){
 * 	ev.preventDefault();
 * 	var data = $(this).formParams();
 * 	
 * 	// gives it a random id
 * 	data.id = +new Date();
 * 	var contact = new Contact(data);
 * 	
 * 	//add it to the list of contacts 
 * 	contacts.push(contact);
 * 	
 * 	//store the current list
 * 	contacts.store("contacts");
 * 	
 * 	//show the contact
 * 	addContact(contact);
 * })
 * @codeend
 * 
 * You can see this in action in the following demo.  Create a contact, then
 * refresh the page.
 * 
 * @demo jquery/model/list/cookie/cookie.html
 */
$.Model.List("jQuery.Model.List.Cookie",
/**
 * @Prototype
 */
{
	days : null,
	/**
	 * Deserializes a list of instances in the cookie with the provided name
	 * @param {String} name the name of the cookie to use.
	 * @return {jQuery.Model} returns this model instance.
	 */
	retrieve : function(name){
		// each also needs what they are referencd by ?
		var props = $.cookie( name ) || {type : null, ids : []},
			instances = [],
			Class = props.type ? $.String.getObject(props.type) :  null;
		for(var i =0; i < props.ids.length;i++){
			var identity = props.ids[i],
				instanceData = $.cookie( identity );
			instances.push( new Class(instanceData) )
		}
		this.push.apply(this,instances);
		return this;
	},
	/**
	 * Serializes and saves this list of model instances to the cookie in name.
	 * @param {String} name the name of the cookie
	 * @return {jQuery.Model} returns this model instance.
	 */
	store : function(name){
		//  go through and listen to instance updating
		var ids = [], days = this.days;
		this.each(function(i, inst){
			$.cookie(inst.identity(), $.toJSON(inst.attrs()), { expires: days });
			ids.push(inst.identity());
		});
		
		$.cookie(name, $.toJSON({
			type: this[0] && this[0].constructor.fullName,
			ids: ids
		}), { expires: this.days });
		return this;
	}
})
	
})(jQuery)