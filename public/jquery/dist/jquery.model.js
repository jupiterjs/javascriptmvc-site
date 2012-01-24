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
(function( $ ) {

	// =============== HELPERS =================

	    // if we are initializing a new class
	var initializing = false,
		makeArray = $.makeArray,
		isFunction = $.isFunction,
		isArray = $.isArray,
		extend = $.extend,
		getObject = $.String.getObject,
		concatArgs = function(arr, args){
			return arr.concat(makeArray(args));
		},
		
		// tests if we can get super in .toString()
		fnTest = /xyz/.test(function() {
			xyz;
		}) ? /\b_super\b/ : /.*/,
		
		// overwrites an object with methods, sets up _super
		//   newProps - new properties
		//   oldProps - where the old properties might be
		//   addTo - what we are adding to
		inheritProps = function( newProps, oldProps, addTo ) {
			addTo = addTo || newProps
			for ( var name in newProps ) {
				// Check if we're overwriting an existing function
				addTo[name] = isFunction(newProps[name]) && 
							  isFunction(oldProps[name]) && 
							  fnTest.test(newProps[name]) ? (function( name, fn ) {
					return function() {
						var tmp = this._super,
							ret;

						// Add a new ._super() method that is the same method
						// but on the super-class
						this._super = oldProps[name];

						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						ret = fn.apply(this, arguments);
						this._super = tmp;
						return ret;
					};
				})(name, newProps[name]) : newProps[name];
			}
		},
		STR_PROTOTYPE = 'prototype'

	/**
	 * @class jQuery.Class
	 * @plugin jquery/class
	 * @parent jquerymx
	 * @download dist/jquery/jquery.class.js
	 * @test jquery/class/qunit.html
	 * @description Easy inheritance in JavaScript.
	 * 
	 * Class provides simulated inheritance in JavaScript. Use clss to bridge the gap between
	 * jQuery's functional programming style and Object Oriented Programming. It 
	 * is based off John Resig's [http://ejohn.org/blog/simple-javascript-inheritance/|Simple Class]
	 * Inheritance library.  Besides prototypal inheritance, it includes a few important features:
	 * 
	 *   - Static inheritance
	 *   - Introspection
	 *   - Namespaces
	 *   - Setup and initialization methods
	 *   - Easy callback function creation
	 * 
	 * 
	 * The [mvc.class Get Started with jQueryMX] has a good walkthrough of $.Class.
	 * 
	 * ## Static v. Prototype
	 * 
	 * Before learning about Class, it's important to
	 * understand the difference between
	 * a class's __static__ and __prototype__ properties.
	 * 
	 *     //STATIC
	 *     MyClass.staticProperty  //shared property
	 *     
	 *     //PROTOTYPE
	 *     myclass = new MyClass()
	 *     myclass.prototypeMethod() //instance method
	 * 
	 * A static (or class) property is on the Class constructor
	 * function itself
	 * and can be thought of being shared by all instances of the 
	 * Class. Prototype propertes are available only on instances of the Class.
	 * 
	 * ## A Basic Class
	 * 
	 * The following creates a Monster class with a
	 * name (for introspection), static, and prototype members.
	 * Every time a monster instance is created, the static
	 * count is incremented.
	 *
	 * @codestart
	 * $.Class('Monster',
	 * /* @static *|
	 * {
	 *   count: 0
	 * },
	 * /* @prototype *|
	 * {
	 *   init: function( name ) {
	 *
	 *     // saves name on the monster instance
	 *     this.name = name;
	 *
	 *     // sets the health
	 *     this.health = 10;
	 *
	 *     // increments count
	 *     this.constructor.count++;
	 *   },
	 *   eat: function( smallChildren ){
	 *     this.health += smallChildren;
	 *   },
	 *   fight: function() {
	 *     this.health -= 2;
	 *   }
	 * });
	 *
	 * hydra = new Monster('hydra');
	 *
	 * dragon = new Monster('dragon');
	 *
	 * hydra.name        // -> hydra
	 * Monster.count     // -> 2
	 * Monster.shortName // -> 'Monster'
	 *
	 * hydra.eat(2);     // health = 12
	 *
	 * dragon.fight();   // health = 8
	 *
	 * @codeend
	 *
	 * 
	 * Notice that the prototype <b>init</b> function is called when a new instance of Monster is created.
	 * 
	 * 
	 * ## Inheritance
	 * 
	 * When a class is extended, all static and prototype properties are available on the new class.
	 * If you overwrite a function, you can call the base class's function by calling
	 * <code>this._super</code>.  Lets create a SeaMonster class.  SeaMonsters are less
	 * efficient at eating small children, but more powerful fighters.
	 * 
	 * 
	 *     Monster("SeaMonster",{
	 *       eat: function( smallChildren ) {
	 *         this._super(smallChildren / 2);
	 *       },
	 *       fight: function() {
	 *         this.health -= 1;
	 *       }
	 *     });
	 *     
	 *     lockNess = new SeaMonster('Lock Ness');
	 *     lockNess.eat(4);   //health = 12
	 *     lockNess.fight();  //health = 11
	 * 
	 * ### Static property inheritance
	 * 
	 * You can also inherit static properties in the same way:
	 * 
	 *     $.Class("First",
	 *     {
	 *         staticMethod: function() { return 1;}
	 *     },{})
	 *
	 *     First("Second",{
	 *         staticMethod: function() { return this._super()+1;}
	 *     },{})
	 *
	 *     Second.staticMethod() // -> 2
	 * 
	 * ## Namespaces
	 * 
	 * Namespaces are a good idea! We encourage you to namespace all of your code.
	 * It makes it possible to drop your code into another app without problems.
	 * Making a namespaced class is easy:
	 * 
	 * 
	 *     $.Class("MyNamespace.MyClass",{},{});
	 *
	 *     new MyNamespace.MyClass()
	 * 
	 * 
	 * <h2 id='introspection'>Introspection</h2>
	 * 
	 * Often, it's nice to create classes whose name helps determine functionality.  Ruby on
	 * Rails's [http://api.rubyonrails.org/classes/ActiveRecord/Base.html|ActiveRecord] ORM class
	 * is a great example of this.  Unfortunately, JavaScript doesn't have a way of determining
	 * an object's name, so the developer must provide a name.  Class fixes this by taking a String name for the class.
	 * 
	 *     $.Class("MyOrg.MyClass",{},{})
	 *     MyOrg.MyClass.shortName //-> 'MyClass'
	 *     MyOrg.MyClass.fullName //->  'MyOrg.MyClass'
	 * 
	 * The fullName (with namespaces) and the shortName (without namespaces) are added to the Class's
	 * static properties.
	 *
	 *
	 * ## Setup and initialization methods
	 * 
	 * <p>
	 * Class provides static and prototype initialization functions.
	 * These come in two flavors - setup and init.
	 * Setup is called before init and
	 * can be used to 'normalize' init's arguments.
	 * </p>
	 * <div class='whisper'>PRO TIP: Typically, you don't need setup methods in your classes. Use Init instead.
	 * Reserve setup methods for when you need to do complex pre-processing of your class before init is called.
	 *
	 * </div>
	 * @codestart
	 * $.Class("MyClass",
	 * {
	 *   setup: function() {} //static setup
	 *   init: function() {} //static constructor
	 * },
	 * {
	 *   setup: function() {} //prototype setup
	 *   init: function() {} //prototype constructor
	 * })
	 * @codeend
	 *
	 * ### Setup
	 * 
	 * Setup functions are called before init functions.  Static setup functions are passed
	 * the base class followed by arguments passed to the extend function.
	 * Prototype static functions are passed the Class constructor 
	 * function arguments.
	 * 
	 * If a setup function returns an array, that array will be used as the arguments
	 * for the following init method.  This provides setup functions the ability to normalize
	 * arguments passed to the init constructors.  They are also excellent places
	 * to put setup code you want to almost always run.
	 * 
	 * 
	 * The following is similar to how [jQuery.Controller.prototype.setup]
	 * makes sure init is always called with a jQuery element and merged options
	 * even if it is passed a raw
	 * HTMLElement and no second parameter.
	 * 
	 *     $.Class("jQuery.Controller",{
	 *       ...
	 *     },{
	 *       setup: function( el, options ) {
	 *         ...
	 *         return [$(el),
	 *                 $.extend(true,
	 *                    this.Class.defaults,
	 *                    options || {} ) ]
	 *       }
	 *     })
	 * 
	 * Typically, you won't need to make or overwrite setup functions.
	 * 
	 * ### Init
	 *
	 * Init functions are called after setup functions.
	 * Typically, they receive the same arguments
	 * as their preceding setup function.  The Foo class's <code>init</code> method
	 * gets called in the following example:
	 * 
	 *     $.Class("Foo", {
	 *       init: function( arg1, arg2, arg3 ) {
	 *         this.sum = arg1+arg2+arg3;
	 *       }
	 *     })
	 *     var foo = new Foo(1,2,3);
	 *     foo.sum //-> 6
	 * 
	 * ## Proxies
	 * 
	 * Similar to jQuery's proxy method, Class provides a
	 * [jQuery.Class.static.proxy proxy]
	 * function that returns a callback to a method that will always
	 * have
	 * <code>this</code> set to the class or instance of the class.
	 * 
	 * 
	 * The following example uses this.proxy to make sure
	 * <code>this.name</code> is available in <code>show</code>.
	 * 
	 *     $.Class("Todo",{
	 *       init: function( name ) { 
	 *       	this.name = name 
	 *       },
	 *       get: function() {
	 *         $.get("/stuff",this.proxy('show'))
	 *       },
	 *       show: function( txt ) {
	 *         alert(this.name+txt)
	 *       }
	 *     })
	 *     new Todo("Trash").get()
	 * 
	 * Callback is available as a static and prototype method.
	 * 
	 * ##  Demo
	 * 
	 * @demo jquery/class/class.html
	 * 
	 * 
	 * @constructor
	 * 
	 * To create a Class call:
	 * 
	 *     $.Class( [NAME , STATIC,] PROTOTYPE ) -> Class
	 * 
	 * <div class='params'>
	 *   <div class='param'><label>NAME</label><code>{optional:String}</code>
	 *   <p>If provided, this sets the shortName and fullName of the 
	 *      class and adds it and any necessary namespaces to the 
	 *      window object.</p>
	 *   </div>
	 *   <div class='param'><label>STATIC</label><code>{optional:Object}</code>
	 *   <p>If provided, this creates static properties and methods
	 *   on the class.</p>
	 *   </div>
	 *   <div class='param'><label>PROTOTYPE</label><code>{Object}</code>
	 *   <p>Creates prototype methods on the class.</p>
	 *   </div>
	 * </div>
	 * 
	 * When a Class is created, the static [jQuery.Class.static.setup setup] 
	 * and [jQuery.Class.static.init init]  methods are called.
	 * 
	 * To create an instance of a Class, call:
	 * 
	 *     new Class([args ... ]) -> instance
	 * 
	 * The created instance will have all the 
	 * prototype properties and methods defined by the PROTOTYPE object.
	 * 
	 * When an instance is created, the prototype [jQuery.Class.prototype.setup setup] 
	 * and [jQuery.Class.prototype.init init]  methods 
	 * are called.
	 */

	clss = $.Class = function() {
		if (arguments.length) {
			clss.extend.apply(clss, arguments);
		}
	};

	/* @Static*/
	extend(clss, {
		/**
		 * @function proxy
		 * Returns a callback function for a function on this Class.
		 * Proxy ensures that 'this' is set appropriately.  
		 * @codestart
		 * $.Class("MyClass",{
		 *     getData: function() {
		 *         this.showing = null;
		 *         $.get("data.json",this.proxy('gotData'),'json')
		 *     },
		 *     gotData: function( data ) {
		 *         this.showing = data;
		 *     }
		 * },{});
		 * MyClass.showData();
		 * @codeend
		 * <h2>Currying Arguments</h2>
		 * Additional arguments to proxy will fill in arguments on the returning function.
		 * @codestart
		 * $.Class("MyClass",{
		 *    getData: function( <b>callback</b> ) {
		 *      $.get("data.json",this.proxy('process',<b>callback</b>),'json');
		 *    },
		 *    process: function( <b>callback</b>, jsonData ) { //callback is added as first argument
		 *        jsonData.processed = true;
		 *        callback(jsonData);
		 *    }
		 * },{});
		 * MyClass.getData(showDataFunc)
		 * @codeend
		 * <h2>Nesting Functions</h2>
		 * Proxy can take an array of functions to call as 
		 * the first argument.  When the returned callback function
		 * is called each function in the array is passed the return value of the prior function.  This is often used
		 * to eliminate currying initial arguments.
		 * @codestart
		 * $.Class("MyClass",{
		 *    getData: function( callback ) {
		 *      //calls process, then callback with value from process
		 *      $.get("data.json",this.proxy(['process2',callback]),'json') 
		 *    },
		 *    process2: function( type,jsonData ) {
		 *        jsonData.processed = true;
		 *        return [jsonData];
		 *    }
		 * },{});
		 * MyClass.getData(showDataFunc);
		 * @codeend
		 * @param {String|Array} fname If a string, it represents the function to be called.  
		 * If it is an array, it will call each function in order and pass the return value of the prior function to the
		 * next function.
		 * @return {Function} the callback function.
		 */
		proxy: function( funcs ) {

			//args that should be curried
			var args = makeArray(arguments),
				self;

			// get the functions to callback
			funcs = args.shift();

			// if there is only one function, make funcs into an array
			if (!isArray(funcs) ) {
				funcs = [funcs];
			}
			
			// keep a reference to us in self
			self = this;
			
			
			return function class_cb() {
				// add the arguments after the curried args
				var cur = concatArgs(args, arguments),
					isString, 
					length = funcs.length,
					f = 0,
					func;
				
				// go through each function to call back
				for (; f < length; f++ ) {
					func = funcs[f];
					if (!func ) {
						continue;
					}
					
					// set called with the name of the function on self (this is how this.view works)
					isString = typeof func == "string";
					if ( isString && self._set_called ) {
						self.called = func;
					}
					
					// call the function
					cur = (isString ? self[func] : func).apply(self, cur || []);
					
					// pass the result to the next function (if there is a next function)
					if ( f < length - 1 ) {
						cur = !isArray(cur) || cur._use_call ? [cur] : cur
					}
				}
				return cur;
			}
		},
		/**
		 * @function newInstance
		 * Creates a new instance of the class.  This method is useful for creating new instances
		 * with arbitrary parameters.
		 * <h3>Example</h3>
		 * @codestart
		 * $.Class("MyClass",{},{})
		 * var mc = MyClass.newInstance.apply(null, new Array(parseInt(Math.random()*10,10))
		 * @codeend
		 * @return {class} instance of the class
		 */
		newInstance: function() {
			// get a raw instance objet (init is not called)
			var inst = this.rawInstance(),
				args;
				
			// call setup if there is a setup
			if ( inst.setup ) {
				args = inst.setup.apply(inst, arguments);
			}
			// call init if there is an init, if setup returned args, use those as the arguments
			if ( inst.init ) {
				inst.init.apply(inst, isArray(args) ? args : arguments);
			}
			return inst;
		},
		/**
		 * Setup gets called on the inherting class with the base class followed by the
		 * inheriting class's raw properties.
		 * 
		 * Setup will deeply extend a static defaults property on the base class with 
		 * properties on the base class.  For example:
		 * 
		 *     $.Class("MyBase",{
		 *       defaults : {
		 *         foo: 'bar'
		 *       }
		 *     },{})
		 * 
		 *     MyBase("Inheriting",{
		 *       defaults : {
		 *         newProp : 'newVal'
		 *       }
		 *     },{}
		 *     
		 *     Inheriting.defaults -> {foo: 'bar', 'newProp': 'newVal'}
		 * 
		 * @param {Object} baseClass the base class that is being inherited from
		 * @param {String} fullName the name of the new class
		 * @param {Object} staticProps the static properties of the new class
		 * @param {Object} protoProps the prototype properties of the new class
		 */
		setup: function( baseClass, fullName ) {
			// set defaults as the merger of the parent defaults and this object's defaults
			this.defaults = extend(true, {}, baseClass.defaults, this.defaults);
			return arguments;
		},
		rawInstance: function() {
			// prevent running init
			initializing = true;
			var inst = new this();
			initializing = false;
			// allow running init
			return inst;
		},
		/**
		 * Extends a class with new static and prototype functions.  There are a variety of ways
		 * to use extend:
		 * 
		 *     // with className, static and prototype functions
		 *     $.Class('Task',{ STATIC },{ PROTOTYPE })
		 *     // with just classname and prototype functions
		 *     $.Class('Task',{ PROTOTYPE })
		 *     // with just a className
		 *     $.Class('Task')
		 * 
		 * You no longer have to use <code>.extend</code>.  Instead, you can pass those options directly to
		 * $.Class (and any inheriting classes):
		 * 
		 *     // with className, static and prototype functions
		 *     $.Class('Task',{ STATIC },{ PROTOTYPE })
		 *     // with just classname and prototype functions
		 *     $.Class('Task',{ PROTOTYPE })
		 *     // with just a className
		 *     $.Class('Task')
		 * 
		 * @param {String} [fullName]  the classes name (used for classes w/ introspection)
		 * @param {Object} [klass]  the new classes static/class functions
		 * @param {Object} [proto]  the new classes prototype functions
		 * 
		 * @return {jQuery.Class} returns the new class
		 */
		extend: function( fullName, klass, proto ) {
			// figure out what was passed and normalize it
			if ( typeof fullName != 'string' ) {
				proto = klass;
				klass = fullName;
				fullName = null;
			}
			if (!proto ) {
				proto = klass;
				klass = null;
			}

			proto = proto || {};
			var _super_class = this,
				_super = this[STR_PROTOTYPE],
				name, shortName, namespace, prototype;

			// Instantiate a base class (but only create the instance,
			// don't run the init constructor)
			initializing = true;
			prototype = new this();
			initializing = false;
			
			// Copy the properties over onto the new prototype
			inheritProps(proto, _super, prototype);

			// The dummy class constructor
			function Class() {
				// All construction is actually done in the init method
				if ( initializing ) return;

				// we are being called w/o new, we are extending
				if ( this.constructor !== Class && arguments.length ) { 
					return arguments.callee.extend.apply(arguments.callee, arguments)
				} else { //we are being called w/ new
					return this.Class.newInstance.apply(this.Class, arguments)
				}
			}
			// Copy old stuff onto class
			for ( name in this ) {
				if ( this.hasOwnProperty(name) ) {
					Class[name] = this[name];
				}
			}

			// copy new static props on class
			inheritProps(klass, this, Class);

			// do namespace stuff
			if ( fullName ) {

				var parts = fullName.split(/\./),
					shortName = parts.pop(),
					current = getObject(parts.join('.'), window, true),
					namespace = current;

				
				current[shortName] = Class;
			}

			// set things that can't be overwritten
			extend(Class, {
				prototype: prototype,
				/**
				 * @attribute namespace 
				 * The namespaces object
				 * 
				 *     $.Class("MyOrg.MyClass",{},{})
				 *     MyOrg.MyClass.namespace //-> MyOrg
				 * 
				 */
				namespace: namespace,
				/**
				 * @attribute shortName 
				 * The name of the class without its namespace, provided for introspection purposes.
				 * 
				 *     $.Class("MyOrg.MyClass",{},{})
				 *     MyOrg.MyClass.shortName //-> 'MyClass'
				 *     MyOrg.MyClass.fullName //->  'MyOrg.MyClass'
				 * 
				 */
				shortName: shortName,
				constructor: Class,
				/**
				 * @attribute fullName 
				 * The full name of the class, including namespace, provided for introspection purposes.
				 * 
				 *     $.Class("MyOrg.MyClass",{},{})
				 *     MyOrg.MyClass.shortName //-> 'MyClass'
				 *     MyOrg.MyClass.fullName //->  'MyOrg.MyClass'
				 * 
				 */
				fullName: fullName
			});

			//make sure our prototype looks nice
			Class[STR_PROTOTYPE].Class = Class[STR_PROTOTYPE].constructor = Class;

			

			// call the class setup
			var args = Class.setup.apply(Class, concatArgs([_super_class],arguments));
			
			// call the class init
			if ( Class.init ) {
				Class.init.apply(Class, args || concatArgs([_super_class],arguments));
			}

			/* @Prototype*/
			return Class;
			/** 
			 * @function setup
			 * If a setup method is provided, it is called when a new 
			 * instances is created.  It gets passed the same arguments that
			 * were given to the Class constructor function (<code> new Class( arguments ... )</code>).
			 * 
			 *     $.Class("MyClass",
			 *     {
			 *        setup: function( val ) {
			 *           this.val = val;
			 *         }
			 *     })
			 *     var mc = new MyClass("Check Check")
			 *     mc.val //-> 'Check Check'
			 * 
			 * Setup is called before [jQuery.Class.prototype.init init].  If setup 
			 * return an array, those arguments will be used for init. 
			 * 
			 *     $.Class("jQuery.Controller",{
			 *       setup : function(htmlElement, rawOptions){
			 *         return [$(htmlElement), 
			 *                   $.extend({}, this.Class.defaults, rawOptions )] 
			 *       }
			 *     })
			 * 
			 * <div class='whisper'>PRO TIP: 
			 * Setup functions are used to normalize constructor arguments and provide a place for
			 * setup code that extending classes don't have to remember to call _super to
			 * run.
			 * </div>
			 * 
			 * Setup is not defined on $.Class itself, so calling super in inherting classes
			 * will break.  Don't do the following:
			 * 
			 *     $.Class("Thing",{
			 *       setup : function(){
			 *         this._super(); // breaks!
			 *       }
			 *     })
			 * 
			 * @return {Array|undefined} If an array is return, [jQuery.Class.prototype.init] is 
			 * called with those arguments; otherwise, the original arguments are used.
			 */
			//break up
			/** 
			 * @function init
			 * If an <code>init</code> method is provided, it gets called when a new instance
			 * is created.  Init gets called after [jQuery.Class.prototype.setup setup], typically with the 
			 * same arguments passed to the Class 
			 * constructor: (<code> new Class( arguments ... )</code>).  
			 * 
			 *     $.Class("MyClass",
			 *     {
			 *        init: function( val ) {
			 *           this.val = val;
			 *        }
			 *     })
			 *     var mc = new MyClass(1)
			 *     mc.val //-> 1
			 * 
			 * [jQuery.Class.prototype.setup Setup] is able to modify the arguments passed to init.  Read
			 * about it there.
			 * 
			 */
			//Breaks up code
			/**
			 * @attribute constructor
			 * 
			 * A reference to the Class (or constructor function).  This allows you to access 
			 * a class's static properties from an instance.
			 * 
			 * ### Quick Example
			 * 
			 *     // a class with a static property
			 *     $.Class("MyClass", {staticProperty : true}, {});
			 *     
			 *     // a new instance of myClass
			 *     var mc1 = new MyClass();
			 * 
			 *     // read the static property from the instance:
			 *     mc1.constructor.staticProperty //-> true
			 *     
			 * Getting static properties with the constructor property, like
			 * [jQuery.Class.static.fullName fullName], is very common.
			 * 
			 */
		}

	})





	clss.callback = clss[STR_PROTOTYPE].callback = clss[STR_PROTOTYPE].
	/**
	 * @function proxy
	 * Returns a method that sets 'this' to the current instance.  This does the same thing as 
	 * and is described better in [jQuery.Class.static.proxy].
	 * The only difference is this proxy works
	 * on a instance instead of a class.
	 * @param {String|Array} fname If a string, it represents the function to be called.  
	 * If it is an array, it will call each function in order and pass the return value of the prior function to the
	 * next function.
	 * @return {Function} the callback function
	 */
	proxy = clss.proxy;


})(jQuery);
(function() {

	// Common helper methods taken from jQuery (or other places)
	// Keep here so someday can be abstracted
	var $String = $.String,
		getObject = $String.getObject,
		underscore = $String.underscore,
		classize = $String.classize,
		isArray = $.isArray,
		makeArray = $.makeArray,
		extend = $.extend,
		each = $.each,
		trigger = function(obj, event, args){
			$.event.trigger(event, args, obj, true)
		},
		
		// used to make an ajax request where
		// ajaxOb - a bunch of options
		// data - the attributes or data that will be sent
		// success - callback function
		// error - error callback
		// fixture - the name of the fixture (typically a path or something on $.fixture
		// type - the HTTP request type (defaults to "post")
		// dataType - how the data should return (defaults to "json")
		ajax = function(ajaxOb, data, success, error, fixture, type, dataType ) {

			
			// if we get a string, handle it
			if ( typeof ajaxOb == "string" ) {
				// if there's a space, it's probably the type
				var sp = ajaxOb.indexOf(" ")
				if ( sp > -1 ) {
					ajaxOb = {
						url:  ajaxOb.substr(sp + 1),
						type: ajaxOb.substr(0, sp)
					}
				} else {
					ajaxOb = {url : ajaxOb}
				}
			}

			// if we are a non-array object, copy to a new attrs
			ajaxOb.data = typeof data == "object" && !isArray(data) ?
				extend(ajaxOb.data || {}, data) : data;
	

			// get the url with any templated values filled out
			ajaxOb.url = $String.sub(ajaxOb.url, ajaxOb.data, true);

			return $.ajax(extend({
				type: type || "post",
				dataType: dataType ||"json",
				fixture: fixture,
				success : success,
				error: error
			},ajaxOb));
		},
		// guesses at a fixture name where
		// extra - where to look for 'MODELNAME'+extra fixtures (ex: "Create" -> '-recipeCreate')
		// or - if the first fixture fails, default to this
		fixture = function( model, extra, or ) {
			// get the underscored shortName of this Model
			var u = underscore(model.shortName),
				// the first place to look for fixtures
				f = "-" + u + (extra || "");

			// if the fixture exists in $.fixture
			return $.fixture && $.fixture[f] ?
			// return the name
			f :
			// or return or
			or ||
			// or return a fixture derived from the path
			"//" + underscore(model.fullName).replace(/\.models\..*/, "").replace(/\./g, "/") + "/fixtures/" + u + (extra || "") + ".json";
		},
		// takes attrs, and adds it to the attrs (so it can be added to the url)
		// if attrs already has an id, it means it's trying to update the id
		// in this case, it sets the new ID as newId.
		addId = function( model, attrs, id ) {
			attrs = attrs || {};
			var identity = model.id;
			if ( attrs[identity] && attrs[identity] !== id ) {
				attrs["new" + $String.capitalize(id)] = attrs[identity];
				delete attrs[identity];
			}
			attrs[identity] = id;
			return attrs;
		},
		// returns the best list-like object (list is passed)
		getList = function( type ) {
			var listType = type || $.Model.List || Array;
			return new listType();
		},
		// a helper function for getting an id from an instance
		getId = function( inst ) {
			return inst[inst.constructor.id]
		},
		// returns a collection of unique items
		// this works on objects by adding a "__u Nique" property.
		unique = function( items ) {
			var collect = [];
			// check unique property, if it isn't there, add to collect
			each(items, function( i, item ) {
				if (!item["__u Nique"] ) {
					collect.push(item);
					item["__u Nique"] = 1;
				}
			});
			// remove unique 
			return each(collect, function( i, item ) {
				delete item["__u Nique"];
			});
		},
		// helper makes a request to a static ajax method
		// it also calls updated, created, or destroyed
		// and it returns a deferred that resolvesWith self and the data
		// returned from the ajax request
		makeRequest = function( self, type, success, error, method ) {
			// create the deferred makeRequest will return
			var deferred = $.Deferred(),
				// on a successful ajax request, call the
				// updated | created | destroyed method
				// then resolve the deferred
				resolve = function( data ) {
					self[method || type + "d"](data);
					deferred.resolveWith(self, [self, data, type]);
				},
				// on reject reject the deferred
				reject = function( data ) {
					deferred.rejectWith(self, [data])
				},
				// the args to pass to the ajax method
				args = [self.serialize(), resolve, reject],
				// the Model
				model = self.constructor,
				jqXHR,
				promise = deferred.promise();

			// destroy does not need data
			if ( type == 'destroy' ) {
				args.shift();
			}

			// update and destroy need the id
			if ( type !== 'create' ) {
				args.unshift(getId(self))
			}

			// hook up success and error
			deferred.then(success);
			deferred.fail(error);

			// call the model's function and hook up
			// abort
			jqXHR = model[type].apply(model, args);
			if(jqXHR && jqXHR.abort){
				promise.abort = function(){
					jqXHR.abort();
				}
			}
			return promise;
		},
		// a quick way to tell if it's an object and not some string
		isObject = function( obj ) {
			return typeof obj === 'object' && obj !== null && obj;
		},
		$method = function( name ) {
			return function( eventType, handler ) {
				return $.fn[name].apply($([this]), arguments);
			}
		},
		bind = $method('bind'),
		unbind = $method('unbind'),
		STR_CONSTRUCTOR = 'constructor';
	/**
	 * @class jQuery.Model
	 * @parent jquerymx
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/model/model.js
	 * @test jquery/model/qunit.html
	 * @plugin jquery/model
	 * @description Models and apps data layer.
	 * 
	 * Models super-charge an application's
	 * data layer, making it easy to:
	 * 
	 *  - Get and modify data from the server
	 *  - Listen to changes in data
	 *  - Setting and retrieving models on elements
	 *  - Deal with lists of data
	 *  - Do other good stuff
	 * 
	 * Model inherits from [jQuery.Class $.Class] and make use
	 * of REST services and [http://api.jquery.com/category/deferred-object/ deferreds]
	 * so these concepts are worth exploring.  Also, 
	 * the [mvc.model Get Started with jQueryMX] has a good walkthrough of $.Model.
	 * 
	 * 
	 * ## Get and modify data from the server
	 * 
	 * $.Model makes connecting to a JSON REST service 
	 * really easy.  The following models <code>todos</code> by
	 * describing the services that can create, retrieve,
	 * update, and delete todos. 
	 * 
	 *     $.Model('Todo',{
	 *       findAll: 'GET /todos.json',
	 *       findOne: 'GET /todos/{id}.json',
	 *       create:  'POST /todos.json',
	 *       update:  'PUT /todos/{id}.json',
	 *       destroy: 'DELETE /todos/{id}.json' 
	 *     },{});
	 * 
	 * This lets you create, retrieve, update, and delete
	 * todos programatically:
	 * 
	 * __Create__
	 * 
	 * Create a todo instance and 
	 * call <code>[$.Model::save save]\(success, error\)</code>
	 * to create the todo on the server.
	 *     
	 *     // create a todo instance
	 *     var todo = new Todo({name: "do the dishes"})
	 *     
	 *     // save it on the server
	 *     todo.save();
	 * 
	 * __Retrieve__
	 * 
	 * Retrieve a list of todos from the server with
	 * <code>[$.Model.findAll findAll]\(params, callback(items)\)</code>: 
	 *     
	 *     Todo.findAll({}, function( todos ){
	 *     
	 *       // print out the todo names
	 *       $.each(todos, function(i, todo){
	 *         console.log( todo.name );
	 *       });
	 *     });
	 * 
	 * Retrieve a single todo from the server with
	 * <code>[$.Model.findOne findOne]\(params, callback(item)\)</code>:
	 * 
	 *     Todo.findOne({id: 5}, function( todo ){
	 *     
	 *       // print out the todo name
	 *       console.log( todo.name );
	 *     });
	 * 
	 * __Update__
	 * 
	 * Once an item has been created on the server,
	 * you can change its properties and call
	 * <code>save</code> to update it on the server.
	 * 
	 *     // update the todos' name
	 *     todo.attr('name','Take out the trash')
	 *       
	 *     // update it on the server
	 *     todo.save()
	 *       
	 * 
	 * __Destroy__
	 * 
	 * Call <code>[$.Model.prototype.destroy destroy]\(success, error\)</code>
	 * to delete an item on the server.
	 * 
	 *     todo.destroy()
	 * 
	 * ## Listen to changes in data
	 * 
	 * Listening to changes in data is a critical part of 
	 * the [http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller Model-View-Controller]
	 * architecture.  $.Model lets you listen to when an item is created, updated, destroyed
	 * or its properties are changed. Use 
	 * <code>Model.[$.Model.bind bind]\(eventType, handler(event, model)\)</code>
	 * to listen to all events of type on a model and
	 * <code>model.[$.Model.prototype.bind bind]\(eventType, handler(event)\)</code>
	 * to listen to events on a specific instance.
	 * 
	 * __Create__
	 * 
	 *     // listen for when any todo is created
	 *     Todo.bind('created', function( ev, todo ) {...})
	 *     
	 *     // listen for when a specific todo is created
	 *     var todo = new Todo({name: 'do dishes'})
	 *     todo.bind('created', function( ev ) {...})
	 *   
	 * __Update__
	 * 
	 *     // listen for when any todo is updated
	 *     Todo.bind('updated', function( ev, todo ) {...})
	 *     
	 *     // listen for when a specific todo is created
	 *     Todo.findOne({id: 6}, function( todo ) {
	 *       todo.bind('updated', function( ev ) {...})
	 *     })
	 *   
	 * __Destroy__
	 * 
	 *     // listen for when any todo is destroyed
	 *     Todo.bind('destroyed', function( ev, todo ) {...})
	 *    
	 *     // listen for when a specific todo is destroyed
	 *     todo.bind('destroyed', function( ev ) {...})
	 * 
	 * __Property Changes__
	 * 
	 *     // listen for when the name property changes
	 *     todo.bind('name', function(ev){  })
	 * 
	 * __Listening with Controller__
	 * 
	 * You should be using controller to listen to model changes like:
	 * 
	 *     $.Controller('Todos',{
	 *       "{Todo} updated" : function(Todo, ev, todo) {...}
	 *     })
	 * 
	 * 
	 * ## Setting and retrieving data on elements
	 * 
	 * Almost always, we use HTMLElements to represent
	 * data to the user.  When that data changes, we update those
	 * elements to reflect the new data.
	 * 
	 * $.Model has helper methods that make this easy.  They
	 * let you "add" a model to an element and also find
	 * all elements that have had a model "added" to them.
	 * 
	 * Consider a todo list widget
	 * that lists each todo in the page and when a todo is
	 * deleted, removes it.  
	 * 
	 * <code>[jQuery.fn.model $.fn.model]\(item\)</code> lets you set or read a model 
	 * instance from an element:
	 * 
	 *     Todo.findAll({}, function( todos ) {
	 *       
	 *       $.each(todos, function(todo) {
	 *         $('<li>').model(todo)
	 *                  .text(todo.name)
	 *                  .appendTo('#todos')
	 *       });
	 *     });
	 * 
	 * When a todo is deleted, get its element with
	 * <code>item.[$.Model.prototype.elements elements]\(context\)</code>
	 * and remove it from the page.
	 * 
	 *     Todo.bind('destroyed', function( ev, todo ) { 
	 *       todo.elements( $('#todos') ).remove()
	 *     })
	 * 
	 * __Using EJS and $.Controller__
	 * 
	 * [jQuery.View $.View] and [jQuery.EJS EJS] makes adding model data 
	 * to elements easy.  We can implement the todos widget like the following:
	 * 
	 *     $.Controller('Todos',{
	 *       init: function(){
	 *         this.element.html('//todos/views/todos.ejs', Todo.findAll({}) ); 
	 *       },
	 *       "{Todo} destroyed": function(Todo, ev, todo) {
	 *         todo.elements( this.element ).remove()
	 *       }
	 *     })
	 * 
	 * In todos.ejs
	 * 
	 * @codestart html
	 * &lt;% for(var i =0; i &lt; todos.length; i++){ %>
	 *   &lt;li &lt;%= todos[i] %>>&lt;%= todos[i].name %>&lt;/li>
	 * &lt;% } %>
	 * @codeend
	 * 
	 * Notice how you can add a model to an element with <code>&lt;%= model %&gt;</code>
	 * 
	 * ## Lists
	 * 
	 * [$.Model.List $.Model.List] lets you handle multiple model instances
	 * with ease.  A List acts just like an <code>Array</code>, but you can add special properties 
	 * to it and listen to events on it.  
	 * 
	 * <code>$.Model.List</code> has become its own plugin, read about it
	 * [$.Model.List here].
	 * 
	 * ## Other Good Stuff
	 * 
	 * Model can make a lot of other common tasks much easier.
	 * 
	 * ### Type Conversion
	 * 
	 * Data from the server often needs massaging to make it more useful 
	 * for JavaScript.  A typical example is date data which is 
	 * commonly passed as
	 * a number representing the Julian date like:
	 * 
	 *     { name: 'take out trash', 
	 *       id: 1,
	 *       dueDate: 1303173531164 }
	 * 
	 * But instead, you want a JavaScript date object:
	 * 
	 *     date.attr('dueDate') //-> new Date(1303173531164)
	 *     
	 * By defining property-type pairs in [$.Model.attributes attributes],
	 * you can have model auto-convert values from the server into more useful types:
	 * 
	 *     $.Model('Todo',{
	 *       attributes : {
	 *         dueDate: 'date'
	 *       }
	 *     },{})
	 * 
	 * ### Associations
	 * 
	 * The [$.Model.attributes attributes] property also 
	 * supports associations. For example, todo data might come back with
	 * User data as an owner property like:
	 * 
	 *     { name: 'take out trash', 
	 *       id: 1, 
	 *       owner: { name: 'Justin', id: 3} }
	 * 
	 * To convert owner into a User model, set the owner type as the User's
	 * [$.Model.model model]<code>( data )</code> method:
	 * 
	 *     $.Model('Todo',{
	 *       attributes : {
	 *         owner: 'User.model'
	 *       }
	 *     },{})
	 * 
	 * ### Helper Functions
	 * 
	 * Often, you need to perform repeated calculations 
	 * with a model's data.  You can create methods in the model's 
	 * prototype and they will be available on 
	 * all model instances.  
	 * 
	 * The following creates a <code>timeRemaining</code> method that
	 * returns the number of seconds left to complete the todo:
	 * 
	 *     $.Model('Todo',{
	 *     },{
	 *        timeRemaining : function(){
	 *          return new Date() - new Date(this.dueDate)
	 *        }
	 *     })
	 *     
	 *     // create a todo
	 *     var todo = new Todo({dueDate: new Date()});
	 *     
	 *     // show off timeRemaining
	 *     todo.timeRemaining() //-> Number
	 * 
	 * ### Deferreds
	 * 
	 * Model methods that make requests to the server such as:
	 * [$.Model.findAll findAll], [$.Model.findOne findOne], 
	 * [$.Model.prototype.save save], and [$.Model.prototype.destroy destroy] return a
	 * [jquery.model.deferreds deferred] that resolves to the item(s)
	 * being retrieved or modified.  
	 * 
	 * Deferreds can make a lot of asynchronous code much easier.  For example, the following
	 * waits for all users and tasks before continuing :
	 * 
	 *     $.when(Task.findAll(), User.findAll())
	 *       .then(function( tasksRes, usersRes ){ ... })
	 * 
	 * ### Validations
	 * 
	 * [jquery.model.validations Validate] your model's attributes.
	 * 
	 *     $.Model("Contact",{
	 *     init : function(){
	 *         this.validate("birthday",function(){
	 *             if(this.birthday > new Date){
	 *                 return "your birthday needs to be in the past"
	 *             }
	 *         })
	 *     }
	 *     ,{});
	 * 
	 *     
	 */
	// methods that we'll weave into model if provided
	ajaxMethods =
	/** 
	 * @Static
	 */
	{
		create: function( str ) {
			/**
			 * @function create
			 * Create is used by [$.Model.prototype.save save] to create a model instance on the server. 
			 * 
			 * The easiest way to implement create is to give it the url to post data to:
			 * 
			 *     $.Model("Recipe",{
			 *       create: "/recipes"
			 *     },{})
			 *     
			 * This lets you create a recipe like:
			 *  
			 *     new Recipe({name: "hot dog"}).save();
			 *  
			 * You can also implement create by yourself.  Create gets called with:
			 * 
			 *  - `attrs` - the [$.Model.serialize serialized] model attributes.
			 *  - `success(newAttrs)` - a success handler.
			 *  - `error` - an error handler. 
			 *  
			 * You just need to call success back with
			 * an object that contains the id of the new instance and any other properties that should be
			 * set on the instance.
			 *  
			 * For example, the following code makes a request 
			 * to `POST /recipes.json {'name': 'hot+dog'}` and gets back
			 * something that looks like:
			 *  
			 *     { 
			 *       "id": 5,
			 *       "createdAt": 2234234329
			 *     }
			 * 
			 * The code looks like:
			 * 
			 *     $.Model("Recipe", {
			 *       create : function(attrs, success, error){
			 *         $.post("/recipes.json",attrs, success,"json");
			 *       }
			 *     },{})
			 * 
			 * 
			 * @param {Object} attrs Attributes on the model instance
			 * @param {Function} success(newAttrs) the callback function, it must be called with an object 
			 * that has the id of the new instance and any other attributes the service needs to add.
			 * @param {Function} error a function to callback if something goes wrong.  
			 */
			return function( attrs, success, error ) {
				return ajax(str || this._shortName, attrs, success, error, fixture(this, "Create", "-restCreate"))
			};
		},
		update: function( str ) {
			/**
			 * @function update
			 * Update is used by [$.Model.prototype.save save] to 
			 * update a model instance on the server. 
			 * 
			 * The easist way to implement update is to just give it the url to `PUT` data to:
			 * 
			 *     $.Model("Recipe",{
			 *       update: "/recipes/{id}"
			 *     },{})
			 *     
			 * This lets you update a recipe like:
			 *  
			 *     // PUT /recipes/5 {name: "Hot Dog"}
			 *     Recipe.update(5, {name: "Hot Dog"},
			 *       function(){
			 *         this.name //this is the updated recipe
			 *       })
			 *  
			 * If your server doesn't use PUT, you can change it to post like:
			 * 
			 *     $.Model("Recipe",{
			 *       update: "POST /recipes/{id}"
			 *     },{})
			 * 
			 * Your server should send back an object with any new attributes the model 
			 * should have.  For example if your server udpates the "updatedAt" property, it
			 * should send back something like:
			 * 
			 *     // PUT /recipes/4 {name: "Food"} ->
			 *     {
			 *       updatedAt : "10-20-2011"
			 *     }
			 * 
			 * You can also implement create by yourself.  You just need to call success back with
			 * an object that contains any properties that should be
			 * set on the instance.
			 *  
			 * For example, the following code makes a request 
			 * to '/recipes/5.json?name=hot+dog' and gets back
			 * something that looks like:
			 *  
			 *     { 
			 *       updatedAt: "10-20-2011"
			 *     }
			 * 
			 * The code looks like:
			 * 
			 *     $.Model("Recipe", {
			 *       update : function(id, attrs, success, error){
			 *         $.post("/recipes/"+id+".json",attrs, success,"json");
			 *       }
			 *     },{})
			 * 
			 * 
			 * @param {String} id the id of the model instance
			 * @param {Object} attrs Attributes on the model instance
			 * @param {Function} success(attrs) the callback function.  It optionally accepts 
			 * an object of attribute / value pairs of property changes the client doesn't already 
			 * know about. For example, when you update a name property, the server might 
			 * update other properties as well (such as updatedAt). The server should send 
			 * these properties as the response to updates.  Passing them to success will 
			 * update the model instance with these properties.
			 * 
			 * @param {Function} error a function to callback if something goes wrong.  
			 */
			return function( id, attrs, success, error ) {
				return ajax( str || this._shortName+"/{"+this.id+"}", addId(this, attrs, id), success, error, fixture(this, "Update", "-restUpdate"), "put")
			}
		},
		destroy: function( str ) {
			/**
			 * @function destroy
			 * Destroy is used to remove a model instance from the server.
			 * 
			 * You can implement destroy with a string like:
			 * 
			 *     $.Model("Thing",{
			 *       destroy : "POST /thing/destroy/{id}"
			 *     })
			 * 
			 * Or you can implement destroy manually like:
			 * 
			 *     $.Model("Thing",{
			 *       destroy : function(id, success, error){
			 *         $.post("/thing/destroy/"+id,{}, success);
			 *       }
			 *     })
			 * 
			 * You just have to call success if the destroy was successful.
			 * 
			 * @param {String|Number} id the id of the instance you want destroyed
			 * @param {Function} success the callback function, it must be called with an object 
			 * that has the id of the new instance and any other attributes the service needs to add.
			 * @param {Function} error a function to callback if something goes wrong.  
			 */
			return function( id, success, error ) {
				var attrs = {};
				attrs[this.id] = id;
				return ajax( str || this._shortName+"/{"+this.id+"}", attrs, success, error, fixture(this, "Destroy", "-restDestroy"), "delete")
			}
		},

		findAll: function( str ) {
			/**
			 * @function findAll
			 * FindAll is used to retrive a model instances from the server. 
			 * findAll returns a deferred ($.Deferred).
			 * 
			 * You can implement findAll with a string:
			 * 
			 *     $.Model("Thing",{
			 *       findAll : "/things.json"
			 *     },{})
			 * 
			 * Or you can implement it yourself.  The `dataType` attribute 
			 * is used to convert a JSON array of attributes
			 * to an array of instances.  It calls <code>[$.Model.models]\(raw\)</code>.  For example:
			 * 
			 *     $.Model("Thing",{
			 *       findAll : function(params, success, error){
			 *         return $.ajax({
			 *           url: '/things.json',
			 *           type: 'get',
			 *           dataType: 'json thing.models',
			 *           data: params,
			 *           success: success,
			 *           error: error})
			 *       }
			 *     },{})
			 * 
			 * 
			 * @param {Object} params data to refine the results.  An example might be passing {limit : 20} to
			 * limit the number of items retrieved.
			 * @param {Function} success(items) called with an array (or Model.List) of model instances.
			 * @param {Function} error
			 */
			return function( params, success, error ) {
				return ajax( str ||  this._shortName, params, success, error, fixture(this, "s"), "get", "json " + this._shortName + ".models");
			};
		},
		findOne: function( str ) {
			/**
			 * @function findOne
			 * FindOne is used to retrive a model instances from the server. By implementing 
			 * findOne along with the rest of the [jquery.model.services service api], your models provide an abstract
			 * service API.
			 * 
			 * You can implement findOne with a string:
			 * 
			 *     $.Model("Thing",{
			 *       findOne : "/things/{id}.json"
			 *     },{})
			 * 
			 * Or you can implement it yourself. 
			 * 
			 *     $.Model("Thing",{
			 *       findOne : function(params, success, error){
			 *         var self = this,
			 *             id = params.id;
			 *         delete params.id;
			 *         return $.get("/things/"+id+".json",
			 *           params,
			 *           success,
			 *           "json thing.model")
			 *       }
			 *     },{})
			 * 
			 * 
			 * @param {Object} params data to refine the results. This is often something like {id: 5}.
			 * @param {Function} success(item) called with a model instance
			 * @param {Function} error
			 */
			return function( params, success, error ) {
				return ajax(str || this._shortName+"/{"+this.id+"}", params, success, error, fixture(this), "get", "json " + this._shortName + ".model");
			};
		}
	};





	jQuery.Class("jQuery.Model", {
		setup: function( superClass, stat, proto ) {

			var self = this,
				fullName = this.fullName;
			//we do not inherit attributes (or validations)
			each(["attributes", "validations"], function( i, name ) {
				if (!self[name] || superClass[name] === self[name] ) {
					self[name] = {};
				}
			})

			//add missing converters and serializes
			each(["convert", "serialize"], function( i, name ) {
				if ( superClass[name] != self[name] ) {
					self[name] = extend({}, superClass[name], self[name]);
				}
			});

			this._fullName = underscore(fullName.replace(/\./g, "_"));
			this._shortName = underscore(this.shortName);

			if ( fullName.indexOf("jQuery") == 0 ) {
				return;
			}

			//add this to the collection of models
			//$.Model.models[this._fullName] = this;
			if ( this.listType ) {
				this.list = new this.listType([]);
			}
			
			each(ajaxMethods, function(name, method){
				var prop = self[name];
				if ( typeof prop !== 'function' ) {
					self[name] = method(prop);
				}
			});

			//add ajax converters
			var converters = {},
				convertName = "* " + this._shortName + ".model";

			converters[convertName + "s"] = this.proxy('models');
			converters[convertName] = this.proxy('model');

			$.ajaxSetup({
				converters: converters
			});
		},
		/**
		 * @attribute attributes
		 * Attributes contains a map of attribute names/types.  
		 * You can use this in conjunction with 
		 * [$.Model.convert] to provide automatic 
		 * [jquery.model.typeconversion type conversion] (including
		 * associations).  
		 * 
		 * The following converts dueDates to JavaScript dates:
		 * 
		 * 
		 *     $.Model("Contact",{
		 *       attributes : { 
		 *         birthday : 'date'
		 *       },
		 *       convert : {
		 *         date : function(raw){
		 *           if(typeof raw == 'string'){
		 *             var matches = raw.match(/(\d+)-(\d+)-(\d+)/)
		 *             return new Date( matches[1], 
		 *                      (+matches[2])-1, 
		 *                     matches[3] )
		 *           }else if(raw instanceof Date){
		 *               return raw;
		 *           }
		 *         }
		 *       }
		 *     },{})
		 * 
		 * ## Associations
		 * 
		 * Attribute type values can also represent the name of a 
		 * function.  The most common case this is used is for
		 * associated data. 
		 * 
		 * For example, a Deliverable might have many tasks and 
		 * an owner (which is a Person).  The attributes property might
		 * look like:
		 * 
		 *     attributes : {
		 *       tasks : "App.Models.Task.models"
		 *       owner: "App.Models.Person.model"
		 *     }
		 * 
		 * This points tasks and owner properties to use 
		 * <code>Task.models</code> and <code>Person.model</code>
		 * to convert the raw data into an array of Tasks and a Person.
		 * 
		 * Note that the full names of the models themselves are <code>App.Models.Task</code>
		 * and <code>App.Models.Person</code>. The _.model_ and _.models_ parts are appended
		 * for the benefit of [$.Model.convert convert] to identify the types as 
		 * models.
		 * 
		 * @demo jquery/model/pages/associations.html
		 * 
		 */
		attributes: {},
		/**
		 * $.Model.model is used as a [http://api.jquery.com/extending-ajax/#Converters Ajax converter] 
		 * to convert the response of a [$.Model.findOne] request 
		 * into a model instance.  
		 * 
		 * You will never call this method directly.  Instead, you tell $.ajax about it in findOne:
		 * 
		 *     $.Model('Recipe',{
		 *       findOne : function(params, success, error ){
		 *         return $.ajax({
		 *           url: '/services/recipes/'+params.id+'.json',
		 *           type: 'get',
		 *           
		 *           dataType : 'json recipe.model' //LOOK HERE!
		 *         });
		 *       }
		 *     },{})
		 * 
		 * This makes the result of findOne a [http://api.jquery.com/category/deferred-object/ $.Deferred]
		 * that resolves to a model instance:
		 * 
		 *     var deferredRecipe = Recipe.findOne({id: 6});
		 *     
		 *     deferredRecipe.then(function(recipe){
		 *       console.log('I am '+recipes.description+'.');
		 *     })
		 * 
		 * ## Non-standard Services
		 * 
		 * $.jQuery.model expects data to be name-value pairs like:
		 * 
		 *     {id: 1, name : "justin"}
		 *     
		 * It can also take an object with attributes in a data, attributes, or
		 * 'shortName' property.  For a App.Models.Person model the following will  all work:
		 * 
		 *     { data : {id: 1, name : "justin"} }
		 *     
		 *     { attributes : {id: 1, name : "justin"} }
		 *     
		 *     { person : {id: 1, name : "justin"} }
		 * 
		 * 
		 * ### Overwriting Model
		 * 
		 * If your service returns data like:
		 * 
		 *     {id : 1, name: "justin", data: {foo : "bar"} }
		 *     
		 * This will confuse $.Model.model.  You will want to overwrite it to create 
		 * an instance manually:
		 * 
		 *     $.Model('Person',{
		 *       model : function(data){
		 *         return new this(data);
		 *       }
		 *     },{})
		 *     
		 * 
		 * @param {Object} attributes An object of name-value pairs or an object that has a 
		 *  data, attributes, or 'shortName' property that maps to an object of name-value pairs.
		 * @return {Model} an instance of the model
		 */
		model: function( attributes ) {
			if (!attributes ) {
				return null;
			}
			if ( attributes instanceof this ) {
				attributes = attributes.serialize();
			}
			return new this(
			// checks for properties in an object (like rails 2.0 gives);
			isObject(attributes[this._shortName]) || isObject(attributes.data) || isObject(attributes.attributes) || attributes);
		},
		/**
		 * $.Model.models is used as a [http://api.jquery.com/extending-ajax/#Converters Ajax converter] 
		 * to convert the response of a [$.Model.findAll] request 
		 * into an array (or [$.Model.List $.Model.List]) of model instances.  
		 * 
		 * You will never call this method directly.  Instead, you tell $.ajax about it in findAll:
		 * 
		 *     $.Model('Recipe',{
		 *       findAll : function(params, success, error ){
		 *         return $.ajax({
		 *           url: '/services/recipes.json',
		 *           type: 'get',
		 *           data: params
		 *           
		 *           dataType : 'json recipe.models' //LOOK HERE!
		 *         });
		 *       }
		 *     },{})
		 * 
		 * This makes the result of findAll a [http://api.jquery.com/category/deferred-object/ $.Deferred]
		 * that resolves to a list of model instances:
		 * 
		 *     var deferredRecipes = Recipe.findAll({});
		 *     
		 *     deferredRecipes.then(function(recipes){
		 *       console.log('I have '+recipes.length+'recipes.');
		 *     })
		 * 
		 * ## Non-standard Services
		 * 
		 * $.jQuery.models expects data to be an array of name-value pairs like:
		 * 
		 *     [{id: 1, name : "justin"},{id:2, name: "brian"}, ...]
		 *     
		 * It can also take an object with additional data about the array like:
		 * 
		 *     {
		 *       count: 15000 //how many total items there might be
		 *       data: [{id: 1, name : "justin"},{id:2, name: "brian"}, ...]
		 *     }
		 * 
		 * In this case, models will return an array of instances found in 
		 * data, but with additional properties as expandos on the array:
		 * 
		 *     var people = Person.models({
		 *       count : 1500,
		 *       data : [{id: 1, name: 'justin'}, ...]
		 *     })
		 *     people[0].name // -> justin
		 *     people.count // -> 1500
		 * 
		 * ### Overwriting Models
		 * 
		 * If your service returns data like:
		 * 
		 *     {ballers: [{name: "justin", id: 5}]}
		 * 
		 * You will want to overwrite models to pass the base models what it expects like:
		 * 
		 *     $.Model('Person',{
		 *       models : function(data){
		 *         return this._super(data.ballers);
		 *       }
		 *     },{})
		 * 
		 * @param {Array} instancesRawData an array of raw name - value pairs.
		 * @return {Array} a JavaScript array of instances or a [$.Model.List list] of instances
		 *  if the model list plugin has been included.
		 */
		models: function( instancesRawData ) {
			if (!instancesRawData ) {
				return null;
			}
			// get the list type
			var res = getList(this.List),
				// did we get an array
				arr = isArray(instancesRawData),
				// cache model list
				ML = $.Model.List,
				// did we get a model list?
				ml = (ML && instancesRawData instanceof ML),
				// get the raw array of objects
				raw = arr ?
				// if an array, return the array
				instancesRawData :
				// otherwise if a model list
				(ml ?
				// get the raw objects from the list
				instancesRawData.serialize() :
				// get the object's data
				instancesRawData.data),
				// the number of items
				length = raw ? raw.length : null,
				i = 0;

			
			for (; i < length; i++ ) {
				res.push(this.model(raw[i]));
			}
			if (!arr ) { //push other stuff onto array
				each(instancesRawData, function(prop, val){
					if ( prop !== 'data' ) {
						res[prop] = val;
					}
				})
			}
			return res;
		},
		/**
		 * The name of the id field.  Defaults to 'id'. Change this if it is something different.
		 * 
		 * For example, it's common in .NET to use Id.  Your model might look like:
		 * 
		 * @codestart
		 * $.Model("Friends",{
		 *   id: "Id"
		 * },{});
		 * @codeend
		 */
		id: 'id',
		//if null, maybe treat as an array?
		/**
		 * Adds an attribute to the list of attributes for this class.
		 * @hide
		 * @param {String} property
		 * @param {String} type
		 */
		addAttr: function( property, type ) {
			var stub, attrs = this.attributes;

			stub = attrs[property] || (attrs[property] = type);
			return type;
		},
		/**
		 * @attribute convert
		 * @type Object
		 * An object of name-function pairs that are used to convert attributes.
		 * Check out [$.Model.attributes] or 
		 * [jquery.model.typeconversion type conversion]
		 * for examples.
		 * 
		 * Convert comes with the following types:
		 * 
		 *   - date - Converts to a JS date.  Accepts integers or strings that work with Date.parse
		 *   - number - an integer or number that can be passed to parseFloat
		 *   - boolean - converts "false" to false, and puts everything else through Boolean()
		 */
		convert: {
			"date": function( str ) {
				var type = typeof str;
				if ( type === "string" ) {
					return isNaN(Date.parse(str)) ? null : Date.parse(str)
				} else if ( type === 'number' ) {
					return new Date(str)
				} else {
					return str
				}
			},
			"number": function( val ) {
				return parseFloat(val);
			},
			"boolean": function( val ) {
				return Boolean(val === "false" ? 0 : val);
			},
			"default": function( val, error, type ) {
				var construct = getObject(type),
					context = window,
					realType;
				// if type has a . we need to look it up
				if ( type.indexOf(".") >= 0 ) {
					// get everything before the last .
					realType = type.substring(0, type.lastIndexOf("."));
					// get the object before the last .
					context = getObject(realType);
				}
				return typeof construct == "function" ? construct.call(context, val) : val;
			}
		},
		/**
		 * @attribute serialize
		 * @type Object
		 * An object of name-function pairs that are used to serialize attributes.
		 * Similar to [$.Model.convert], in that the keys of this object
		 * correspond to the types specified in [$.Model.attributes].
		 * 
		 * For example, to serialize all dates to ISO format:
		 * 
		 * 
		 *     $.Model("Contact",{
		 *       attributes : {
		 *         birthday : 'date'
		 *       },
		 *       serialize : {
		 *         date : function(val, type){
		 *           return new Date(val).toISOString();
		 *         }
		 *       }
		 *     },{})
		 *     
		 *     new Contact({ birthday: new Date("Oct 25, 1973") }).serialize()
		 *        // { "birthday" : "1973-10-25T05:00:00.000Z" }
		 * 
		 */
		serialize: {
			"default": function( val, type ) {
				return isObject(val) && val.serialize ? val.serialize() : val;
			},
			"date": function( val ) {
				return val && val.getTime()
			}
		},
		/**
		 * @function bind
		 */
		bind: bind,
		/**
		 * @function unbind
		 */
		unbind: unbind,
		_ajax: ajax
	},
	/**
	 * @Prototype
	 */
	{
		/**
		 * Setup is called when a new model instance is created.
		 * It adds default attributes, then whatever attributes
		 * are passed to the class.
		 * Setup should never be called directly.
		 * 
		 * @codestart
		 * $.Model("Recipe")
		 * var recipe = new Recipe({foo: "bar"});
		 * recipe.foo //-> "bar"
		 * recipe.attr("foo") //-> "bar"
		 * @codeend
		 * 
		 * @param {Object} attributes a hash of attributes
		 */
		setup: function( attributes ) {
			// so we know not to fire events
			this._init = true;
			this.attrs(extend({}, this.constructor.defaults, attributes));
			delete this._init;
		},
		/**
		 * Sets the attributes on this instance and calls save.
		 * The instance needs to have an id.  It will use
		 * the instance class's [$.Model.update update]
		 * method.
		 * 
		 * @codestart
		 * recipe.update({name: "chicken"}, success, error);
		 * @codeend
		 * 
		 * The model will also publish a _updated_ event with [jquery.model.events Model Events].
		 * 
		 * @param {Object} attrs the model's attributes
		 * @param {Function} success called if a successful update
		 * @param {Function} error called if there's an error
		 */
		update: function( attrs, success, error ) {
			this.attrs(attrs);
			return this.save(success, error); //on success, we should 
		},
		/**
		 * Runs the validations on this model.  You can
		 * also pass it an array of attributes to run only those attributes.
		 * It returns nothing if there are no errors, or an object
		 * of errors by attribute.
		 * 
		 * To use validations, it's suggested you use the 
		 * model/validations plugin.
		 * 
		 *     $.Model("Task",{
		 *       init : function(){
		 *         this.validatePresenceOf("dueDate")
		 *       }
		 *     },{});
		 * 
		 *     var task = new Task(),
		 *         errors = task.errors()
		 * 
		 *     errors.dueDate[0] //-> "can't be empty"
		 * 
		 * @param {Array} [attrs] an optional list of attributes to get errors for:
		 * 
		 *     task.errors(['dueDate']);
		 *     
		 * @return {Object} an object of attributeName : [errors] like:
		 * 
		 *     task.errors() // -> {dueDate: ["cant' be empty"]}
		 */
		errors: function( attrs ) {
			// convert attrs to an array
			if ( attrs ) {
				attrs = isArray(attrs) ? attrs : makeArray(arguments);
			}
			var errors = {},
				self = this,
				attr,
				// helper function that adds error messages to errors object
				// attr - the name of the attribute
				// funcs - the validation functions
				addErrors = function( attr, funcs ) {
					each(funcs, function( i, func ) {
						var res = func.call(self);
						if ( res ) {
							if (!errors[attr] ) {
								errors[attr] = [];
							}
							errors[attr].push(res);
						}

					});
				},
				validations = this.constructor.validations;

			// go through each attribute or validation and
			// add any errors
			each(attrs || validations || {}, function( attr, funcs ) {
				// if we are iterating through an array, use funcs
				// as the attr name
				if ( typeof attr == 'number' ) {
					attr = funcs;
					funcs = validations[attr];
				}
				// add errors to the 
				addErrors(attr, funcs || []);
			});
			// return errors as long as we have one
			return $.isEmptyObject(errors) ? null : errors;

		},
		/**
		 * Gets or sets an attribute on the model using setters and 
		 * getters if available.
		 * 
		 * @codestart
		 * $.Model("Recipe")
		 * var recipe = new Recipe();
		 * recipe.attr("foo","bar")
		 * recipe.foo //-> "bar"
		 * recipe.attr("foo") //-> "bar"
		 * @codeend
		 * 
		 * ## Setters
		 * 
		 * If you add a set<i>AttributeName</i> method on your model,
		 * it will be used to set the value.  The set method is called
		 * with the value and is expected to return the converted value.
		 * 
		 * @codestart
		 * $.Model("Recipe",{
		 *   setCreatedAt : function(raw){
		 *     return Date.parse(raw)
		 *   }
		 * })
		 * var recipe = new Recipe();
		 * recipe.attr("createdAt","Dec 25, 1995")
		 * recipe.createAt //-> Date
		 * @codeend
		 * 
		 * ## Asynchronous Setters
		 * 
		 * Sometimes, you want to perform an ajax request when 
		 * you set a property.  You can do this with setters too.
		 * 
		 * To do this, your setter should return undefined and
		 * call success with the converted value.  For example:
		 * 
		 * @codestart
		 * $.Model("Recipe",{
		 *   setTitle : function(title, success, error){
		 *     $.post(
		 *       "recipe/update/"+this.id+"/title",
		 *       title,
		 *       function(){
		 *         success(title);
		 *       },
		 *       "json")
		 *   }
		 * })
		 * 
		 * recipe.attr("title","fish")
		 * @codeend
		 * 
		 * ## Events
		 * 
		 * When you use attr, it can also trigger events.  This is
		 * covered in [$.Model.prototype.bind].
		 * 
		 * @param {String} attribute the attribute you want to set or get
		 * @param {String|Number|Boolean} [value] value the value you want to set.
		 * @param {Function} [success] an optional success callback.  
		 *    This gets called if the attribute was successful.
		 * @param {Function} [error] an optional success callback.  
		 *    The error function is called with validation errors.
		 */
		attr: function( attribute, value, success, error ) {
			// get the getter name getAttrName
			var cap = classize(attribute),
				get = "get" + cap;

			// if we are setting the property
			if ( value !== undefined ) {
				// the potential setter name
				var setName = "set" + cap,
					//the old value
					old = this[attribute],
					self = this,
					// if an error happens, this gets called
					// it calls back the error handler
					errorCallback = function( errors ) {
						var stub;
						stub = error && error.call(self, errors);
						trigger(self, "error." + attribute, errors);
					};

				// if we have a setter
				if ( this[setName] &&
				// call the setter, if returned value is undefined,
				// this means the setter is async so we 
				// do not call update property and return right away
				(value = this[setName](value,
				// a success handler we pass to the setter, it needs to call
				// this if it returns undefined
				this.proxy('_updateProperty', attribute, value, old, success, errorCallback), errorCallback)) === undefined ) {
					return;
				}
				// call update property which will actually update the property
				this._updateProperty(attribute, value, old, success, errorCallback);
				return this;
			}
			// get the attribute, check if we have a getter, otherwise, just get the data
			return this[get] ? this[get]() : this[attribute];
		},

		/**
		 * @function bind
		 * Binds to events on this model instance.  Typically 
		 * you'll bind to an attribute name.  Handler will be called
		 * every time the attribute value changes.  For example:
		 * 
		 * @codestart
		 * $.Model("School")
		 * var school = new School();
		 * school.bind("address", function(ev, address){
		 *   alert('address changed to '+address);
		 * })
		 * school.attr("address","1124 Park St");
		 * @codeend
		 * 
		 * You can also bind to attribute errors.
		 * 
		 * @codestart
		 * $.Model("School",{
		 *   setName : function(name, success, error){
		 *     if(!name){
		 *        error("no name");
		 *     }
		 *     return error;
		 *   }
		 * })
		 * var school = new School();
		 * school.bind("error.name", function(ev, mess){
		 *    mess // -> "no name";
		 * })
		 * school.attr("name","");
		 * @codeend
		 * 
		 * You can also bind to created, updated, and destroyed events.
		 * 
		 * @param {String} eventType the name of the event.
		 * @param {Function} handler a function to call back when an event happens on this model.
		 * @return {model} the model instance for chaining
		 */
		bind: bind,
		/**
		 * @function unbind
		 * Unbinds an event handler from this instance.
		 * Read [$.Model.prototype.bind] for 
		 * more information.
		 * @param {String} eventType
		 * @param {Function} handler
		 */
		unbind: unbind,
		// Actually updates a property on a model.  This
		// - Triggers events when a property has been updated
		// - uses converters to change the data type
		// propety - the attribute name
		// value - the new value
		// old - the old value
		// success - 
		_updateProperty: function( property, value, old, success, errorCallback ) {
			var Class = this.constructor,
				// the value that we will set
				val,
				// the type of the attribute
				type = Class.attributes[property] || Class.addAttr(property, "string"),
				//the converter
				converter = Class.convert[type] || Class.convert['default'],
				// errors for this property
				errors = null,
				// the event name prefix (might be error.)
				prefix = "",
				global = "updated.",
				args, globalArgs, callback = success,
				list = Class.list;

			// set the property value
			// notice that even if there's an error
			// property values get set
			val = this[property] =
				//if the value is null
				( value === null ?
				// it should be null
				null :
				// otherwise, the converters to make it something useful
				converter.call(Class, value, function() {}, type) );

			//validate (only if not initializing, this is for performance)
			if (!this._init ) {
				errors = this.errors(property);
			}
			// args triggered on the property event name
			args = [val];
			// args triggered on the 'global' event (updated.attr) 
			globalArgs = [property, val, old];
			
			// if there are errors, change props so we trigger error events
			if ( errors ) {
				prefix = global = "error.";
				callback = errorCallback;
				globalArgs.splice(1, 0, errors);
				args.unshift(errors)
			}
			// as long as we changed values, trigger events
			if ( old !== val && !this._init ) {
				!errors && trigger(this, prefix + property, args);
				trigger(this,global + "attr", globalArgs);
			}
			callback && callback.apply(this, args);

			//if this class has a global list, add / remove from the list.
			if ( property === Class.id && val !== null && list ) {
				// if we didn't have an old id, add ourselves
				if (!old ) {
					list.push(this);
				} else if ( old != val ) {
					// if our id has changed ... well this should be ok
					list.remove(old);
					list.push(this);
				}
			}

		},

		/**
		 * Removes an attribute from the list existing of attributes. 
		 * Each attribute is set with [$.Model.prototype.attr attr].
		 * 
		 * @codestart
		 * recipe.removeAttr('name')
		 * @codeend
		 * 
		 * @param {Object} [attribute]  the attribute to remove
		 */
		removeAttr: function( attr ) {
			var old = this[attr],
				deleted = false,
				attrs = this.constructor.attributes;

			//- pop it off the object
			if ( this[attr] ) {
				delete this[attr];
			}

			//- pop it off the Class attributes collection
			if ( attrs[attr] ) {
				delete attrs[attr];
				deleted = true;
			}

			//- trigger the update
			if (!this._init && deleted && old ) {
				trigger(this,"updated.attr", [attr, null, old]);
			}
		},

		/**
		 * Gets or sets a list of attributes. 
		 * Each attribute is set with [$.Model.prototype.attr attr].
		 * 
		 * @codestart
		 * recipe.attrs({
		 *   name: "ice water",
		 *   instructions : "put water in a glass"
		 * })
		 * @codeend
		 * 
		 * This can be used nicely with [jquery.model.events].
		 * 
		 * @param {Object} [attributes]  if present, the list of attributes to send
		 * @return {Object} the current attributes of the model
		 */
		attrs: function( attributes ) {
			var key, constructor = this.constructor,
				attrs = constructor.attributes;
			if (!attributes ) {
				attributes = {};
				for ( key in attrs ) {
					if ( attrs.hasOwnProperty(key) ) {
						attributes[key] = this.attr(key);
					}
				}
			} else {
				var idName = constructor.id;
				//always set the id last
				for ( key in attributes ) {
					if ( key != idName ) {
						this.attr(key, attributes[key]);
					}
				}
				if ( idName in attributes ) {
					this.attr(idName, attributes[idName]);
				}

			}
			return attributes;
		},
		/**
		 * Get a serialized object for the model. Serialized data is typically
		 * used to send back to a server. See [$.Model.serialize].
		 *
		 *     model.serialize() // -> { name: 'Fred' }
		 *
		 * @return {Object} a JavaScript object that can be serialized with
		 * `JSON.stringify` or other methods.
		 */
		serialize: function() {
			var Class = this.constructor,
				attrs = Class.attributes,
				type, converter, data = {},
				attr;

			attributes = {};

			for ( attr in attrs ) {
				if ( attrs.hasOwnProperty(attr) ) {
					type = attrs[attr];
					// the attribute's converter or the default converter for the class
					converter = Class.serialize[type] || Class.serialize['default'];
					data[attr] = converter.call(Class, this[attr], type);
				}
			}
			return data;
		},
		/**
		 * Returns if the instance is a new object.  This is essentially if the
		 * id is null or undefined.
		 * 
		 *     new Recipe({id: 1}).isNew() //-> false
		 * @return {Boolean} false if an id is set, true if otherwise.
		 */
		isNew: function() {
			var id = getId(this);
			return (id === undefined || id === null || id === ''); //if null or undefined
		},
		/**
		 * Creates or updates the instance using [$.Model.create] or
		 * [$.Model.update] depending if the instance
		 * [$.Model.prototype.isNew has an id or not].
		 * 
		 * When a save is successful, `success` is called and depending if the
		 * instance was created or updated, a created or updated event is fired.
		 * 
		 * ### Example
		 * 
		 *     $.Model('Recipe',{
		 *       created : "/recipes",
		 *       updated : "/recipes/{id}.json"
		 *     },{})
		 *     
		 *     // create a new instance
		 *     var recipe = new Recipe({name: "ice water"});
		 * 	   
		 *     // listen for when it is created or updated
		 *     recipe.bind('created', function(ev, recipe){
		 *       console.log('created', recipe.id)
		 *     }).bind('updated', function(ev, recipe){
		 *       console.log('updated', recipe.id );
		 *     })
		 *     
		 *     // create the recipe on the server
		 *     recipe.save(function(){
		 *       // update the recipe's name
		 *       recipe.attr('name','Ice Water');
		 *       
		 *       // update the recipe on the server
		 *       recipe.save();
		 *     }, error);
		 * 
		 * 
		 * @param {Function} [success] called with (instance,data) if a successful save.
		 * @param {Function} [error] error handler function called with (jqXHR) if the 
		 * save was not successful. It is passed the ajax request's jQXHR object.
		 * @return {$.Deferred} a jQuery deferred that resolves to the instance, but
		 * after it has been created or updated.
		 */
		save: function( success, error ) {
			return makeRequest(this, this.isNew() ? 'create' : 'update', success, error);
		},

		/**
		 * Destroys the instance by calling 
		 * [$.Model.destroy] with the id of the instance.
		 * 
		 * @codestart
		 * recipe.destroy(success, error);
		 * @codeend
		 * 
		 * If OpenAjax.hub is available, after a successful
		 * destroy "<i>modelName</i>.destroyed" is published
		 * with the model instance.
		 * 
		 * @param {Function} [success] called if a successful destroy
		 * @param {Function} [error] called if an unsuccessful destroy
		 */
		destroy: function( success, error ) {
			return makeRequest(this, 'destroy', success, error, 'destroyed');
		},


		/**
		 * Returns a unique identifier for the model instance.  For example:
		 * @codestart
		 * new Todo({id: 5}).identity() //-> 'todo_5'
		 * @codeend
		 * Typically this is used in an element's shortName property so you can find all elements
		 * for a model with [$.Model.prototype.elements elements].
		 * @return {String}
		 */
		identity: function() {
			var id = getId(this),
				constructor = this.constructor;
			return (constructor._fullName + '_' + (constructor.escapeIdentity ? encodeURIComponent(id) : id)).replace(/ /g, '_');
		},
		/**
		 * Returns elements that represent this model instance.  For this to work, your element's should
		 * us the [$.Model.prototype.identity identity] function in their class name.  Example:
		 * 
		 *     <div class='todo <%= todo.identity() %>'> ... </div>
		 * 
		 * This also works if you hooked up the model:
		 * 
		 *     <div <%= todo %>> ... </div>
		 *     
		 * Typically, you'll use this as a response to a Model Event:
		 * 
		 *     "{Todo} destroyed": function(Todo, event, todo){
		 *       todo.elements(this.element).remove();
		 *     }
		 * 
		 * 
		 * @param {String|jQuery|element} context If provided, only elements inside this element
		 * that represent this model will be returned.
		 * 
		 * @return {jQuery} Returns a jQuery wrapped nodelist of elements that have this model instances
		 *  identity in their class name.
		 */
		elements: function( context ) {
			var id = this.identity();
			if( this.constructor.escapeIdentity ) {
				id = id.replace(/([ #;&,.+*~\'%:"!^$[\]()=>|\/])/g,'\\$1')
			}
			
			return $("." + id, context);
		},
		hookup: function( el ) {
			var shortName = this.constructor._shortName,
				models = $.data(el, "models") || $.data(el, "models", {});
			$(el).addClass(shortName + " " + this.identity());
			models[shortName] = this;
		}
	});


	each([
	/**
	 * @function created
	 * @hide
	 * Called by save after a new instance is created.  Publishes 'created'.
	 * @param {Object} attrs
	 */
	"created",
	/**
	 * @function updated
	 * @hide
	 * Called by save after an instance is updated.  Publishes 'updated'.
	 * @param {Object} attrs
	 */
	"updated",
	/**
	 * @function destroyed
	 * @hide
	 * Called after an instance is destroyed.  
	 *   - Publishes "shortName.destroyed".
	 *   - Triggers a "destroyed" event on this model.
	 *   - Removes the model from the global list if its used.
	 * 
	 */
	"destroyed"], function( i, funcName ) {
		$.Model.prototype[funcName] = function( attrs ) {
			var stub, constructor = this.constructor;

			// remove from the list if instance is destroyed
			if ( funcName === 'destroyed' && constructor.list ) {
				constructor.list.remove(getId(this));
			}

			// update attributes if attributes have been passed
			stub = attrs && typeof attrs == 'object' && this.attrs(attrs.attrs ? attrs.attrs() : attrs);

			// call event on the instance
			trigger(this,funcName);
			
			

			// call event on the instance's Class
			trigger(constructor,funcName, this);
			return [this].concat(makeArray(arguments)); // return like this for this.proxy chains
		};
	});

	/**
	 *  @add jQuery.fn
	 */
	// break
	/**
	 * @function models
	 * Returns a list of models.  If the models are of the same
	 * type, and have a [$.Model.List], it will return 
	 * the models wrapped with the list.
	 * 
	 * @codestart
	 * $(".recipes").models() //-> [recipe, ...]
	 * @codeend
	 * 
	 * @param {jQuery.Class} [type] if present only returns models of the provided type.
	 * @return {Array|$.Model.List} returns an array of model instances that are represented by the contained elements.
	 */
	$.fn.models = function( type ) {
		//get it from the data
		var collection = [],
			kind, ret, retType;
		this.each(function() {
			each($.data(this, "models") || {}, function( name, instance ) {
				//either null or the list type shared by all classes
				kind = kind === undefined ? instance.constructor.List || null : (instance.constructor.List === kind ? kind : null);
				collection.push(instance);
			});
		});

		ret = getList(kind);

		ret.push.apply(ret, unique(collection));
		return ret;
	};
	/**
	 * @function model
	 * 
	 * Returns the first model instance found from [jQuery.fn.models] or
	 * sets the model instance on an element.
	 * 
	 *     //gets an instance
	 *     ".edit click" : function(el) {
	 *       el.closest('.todo').model().destroy()
	 *     },
	 *     // sets an instance
	 *     list : function(items){
	 *        var el = this.element;
	 *        $.each(item, function(item){
	 *          $('<div/>').model(item)
	 *            .appendTo(el)
	 *        })
	 *     }
	 * 
	 * @param {Object} [type] The type of model to return.  If a model instance is provided
	 * it will add the model to the element.
	 */
	$.fn.model = function( type ) {
		if ( type && type instanceof $.Model ) {
			type.hookup(this[0]);
			return this;
		} else {
			return this.models.apply(this, arguments)[0];
		}

	};
})(jQuery)