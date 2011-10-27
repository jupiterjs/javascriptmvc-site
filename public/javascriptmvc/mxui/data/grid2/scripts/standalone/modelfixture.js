
//jquery.class.js

(function( $ ) {

	// if we are initializing a new class
	var initializing = false,

		// tests if we can get super in .toString()
		fnTest = /xyz/.test(function() {
			xyz;
		}) ? /\b_super\b/ : /.*/,

		// overwrites an object with methods, sets up _super
		inheritProps = function( newProps, oldProps, addTo ) {
			addTo = addTo || newProps
			for ( var name in newProps ) {
				// Check if we're overwriting an existing function
				addTo[name] = typeof newProps[name] == "function" && typeof oldProps[name] == "function" && fnTest.test(newProps[name]) ? (function( name, fn ) {
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
		};


	/**
	 * @class jQuery.Class
	 * @plugin jquery/class
	 * @tag core
	 * @download dist/jquery/jquery.class.js
	 * @test jquery/class/qunit.html
	 * Class provides simulated inheritance in JavaScript. Use $.Class to bridge the gap between
	 * jQuery's functional programming style and Object Oriented Programming.
	 * It is based off John Resig's [http://ejohn.org/blog/simple-javascript-inheritance/|Simple Class]
	 * Inheritance library.  Besides prototypal inheritance, it includes a few important features:
	 * <ul>
	 *     <li>Static inheritance</li>
	 *     <li>Introspection</li>
	 *     <li>Namespaces</li>
	 *     <li>Setup and initialization methods</li>
	 *     <li>Easy callback function creation</li>
	 * </ul>
	 * <h2>Static v. Prototype</h2>
	 * <p>Before learning about Class, it's important to
	 * understand the difference between
	 * a class's <b>static</b> and <b>prototype</b> properties.
	 * </p>
	 * @codestart
	 * //STATIC
	 * MyClass.staticProperty  //shared property
	 *
	 * //PROTOTYPE
	 * myclass = new MyClass()
	 * myclass.prototypeMethod() //instance method
	 * @codeend
	 * <p>A static (or class) property is on the Class constructor
	 * function itself
	 * and can be thought of being shared by all instances of the Class.
	 * Prototype propertes are available only on instances of the Class.
	 * </p>
	 * <h2>A Basic Class</h2>
	 * <p>The following creates a Monster class with a
	 * name (for introspection), static, and prototype members.
	 * Every time a monster instance is created, the static
	 * count is incremented.
	 *
	 * </p>
	 * @codestart
	 * $.Class.extend('Monster',
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
	 *     this.Class.count++;
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
	 * <p>
	 * Notice that the prototype <b>init</b> function is called when a new instance of Monster is created.
	 * </p>
	 * <h2>Inheritance</h2>
	 * <p>When a class is extended, all static and prototype properties are available on the new class.
	 * If you overwrite a function, you can call the base class's function by calling
	 * <code>this._super</code>.  Lets create a SeaMonster class.  SeaMonsters are less
	 * efficient at eating small children, but more powerful fighters.
	 * </p>
	 * @codestart
	 * Monster.extend("SeaMonster",{
	 *   eat: function( smallChildren ) {
	 *     this._super(smallChildren / 2);
	 *   },
	 *   fight: function() {
	 *     this.health -= 1;
	 *   }
	 * });
	 *
	 * lockNess = new SeaMonster('Lock Ness');
	 * lockNess.eat(4);   //health = 12
	 * lockNess.fight();  //health = 11
	 * @codeend
	 * <h3>Static property inheritance</h3>
	 * You can also inherit static properties in the same way:
	 * @codestart
	 * $.Class.extend("First",
	 * {
	 *     staticMethod: function() { return 1;}
	 * },{})
	 *
	 * First.extend("Second",{
	 *     staticMethod: function() { return this._super()+1;}
	 * },{})
	 *
	 * Second.staticMethod() // -> 2
	 * @codeend
	 * <h2>Namespaces</h2>
	 * <p>Namespaces are a good idea! We encourage you to namespace all of your code.
	 * It makes it possible to drop your code into another app without problems.
	 * Making a namespaced class is easy:
	 * </p>
	 * @codestart
	 * $.Class.extend("MyNamespace.MyClass",{},{});
	 *
	 * new MyNamespace.MyClass()
	 * @codeend
	 * <h2 id='introspection'>Introspection</h2>
	 * Often, it's nice to create classes whose name helps determine functionality.  Ruby on
	 * Rails's [http://api.rubyonrails.org/classes/ActiveRecord/Base.html|ActiveRecord] ORM class
	 * is a great example of this.  Unfortunately, JavaScript doesn't have a way of determining
	 * an object's name, so the developer must provide a name.  Class fixes this by taking a String name for the class.
	 * @codestart
	 * $.Class.extend("MyOrg.MyClass",{},{})
	 * MyOrg.MyClass.shortName //-> 'MyClass'
	 * MyOrg.MyClass.fullName //->  'MyOrg.MyClass'
	 * @codeend
	 * The fullName (with namespaces) and the shortName (without namespaces) are added to the Class's
	 * static properties.
	 *
	 *
	 * <h2>Setup and initialization methods</h2>
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
	 * $.Class.extend("MyClass",
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
	 * <h3>Setup</h3>
	 * <p>Setup functions are called before init functions.  Static setup functions are passed
	 * the base class followed by arguments passed to the extend function.
	 * Prototype static functions are passed the Class constructor function arguments.</p>
	 * <p>If a setup function returns an array, that array will be used as the arguments
	 * for the following init method.  This provides setup functions the ability to normalize
	 * arguments passed to the init constructors.  They are also excellent places
	 * to put setup code you want to almost always run.</p>
	 * <p>
	 * The following is similar to how [jQuery.Controller.prototype.setup]
	 * makes sure init is always called with a jQuery element and merged options
	 * even if it is passed a raw
	 * HTMLElement and no second parameter.
	 * </p>
	 * @codestart
	 * $.Class.extend("jQuery.Controller",{
	 *   ...
	 * },{
	 *   setup: function( el, options ) {
	 *     ...
	 *     return [$(el),
	 *             $.extend(true,
	 *                this.Class.defaults,
	 *                options || {} ) ]
	 *   }
	 * })
	 * @codeend
	 * Typically, you won't need to make or overwrite setup functions.
	 * <h3>Init</h3>
	 *
	 * <p>Init functions are called after setup functions.
	 * Typically, they receive the same arguments
	 * as their preceding setup function.  The Foo class's <code>init</code> method
	 * gets called in the following example:
	 * </p>
	 * @codestart
	 * $.Class.Extend("Foo", {
	 *   init: function( arg1, arg2, arg3 ) {
	 *     this.sum = arg1+arg2+arg3;
	 *   }
	 * })
	 * var foo = new Foo(1,2,3);
	 * foo.sum //-> 6
	 * @codeend
	 * <h2>Callbacks</h2>
	 * <p>Similar to jQuery's proxy method, Class provides a
	 * [jQuery.Class.static.callback callback]
	 * function that returns a callback to a method that will always
	 * have
	 * <code>this</code> set to the class or instance of the class.
	 * </p>
	 * The following example uses this.callback to make sure
	 * <code>this.name</code> is available in <code>show</code>.
	 * @codestart
	 * $.Class.extend("Todo",{
	 *   init: function( name ) { this.name = name }
	 *   get: function() {
	 *     $.get("/stuff",this.callback('show'))
	 *   },
	 *   show: function( txt ) {
	 *     alert(this.name+txt)
	 *   }
	 * })
	 * new Todo("Trash").get()
	 * @codeend
	 * <p>Callback is available as a static and prototype method.</p>
	 * <h2>Demo</h2>
	 * @demo jquery/class/class.html
	 *
	 * @constructor Creating a new instance of an object that has extended jQuery.Class
	 *     calls the init prototype function and returns a new instance of the class.
	 *
	 */

	jQuery.Class = function() {
		if (arguments.length) {
			jQuery.Class.extend.apply(jQuery.Class, arguments);
		}
	};

	/* @Static*/
	$.extend($.Class, {
		/**
		 * @function callback
		 * Returns a callback function for a function on this Class.
		 * The callback function ensures that 'this' is set appropriately.  
		 * @codestart
		 * $.Class.extend("MyClass",{
		 *     getData: function() {
		 *         this.showing = null;
		 *         $.get("data.json",this.callback('gotData'),'json')
		 *     },
		 *     gotData: function( data ) {
		 *         this.showing = data;
		 *     }
		 * },{});
		 * MyClass.showData();
		 * @codeend
		 * <h2>Currying Arguments</h2>
		 * Additional arguments to callback will fill in arguments on the returning function.
		 * @codestart
		 * $.Class.extend("MyClass",{
		 *    getData: function( <b>callback</b> ) {
		 *      $.get("data.json",this.callback('process',<b>callback</b>),'json');
		 *    },
		 *    process: function( <b>callback</b>, jsonData ) { //callback is added as first argument
		 *        jsonData.processed = true;
		 *        callback(jsonData);
		 *    }
		 * },{});
		 * MyClass.getData(showDataFunc)
		 * @codeend
		 * <h2>Nesting Functions</h2>
		 * Callback can take an array of functions to call as the first argument.  When the returned callback function
		 * is called each function in the array is passed the return value of the prior function.  This is often used
		 * to eliminate currying initial arguments.
		 * @codestart
		 * $.Class.extend("MyClass",{
		 *    getData: function( callback ) {
		 *      //calls process, then callback with value from process
		 *      $.get("data.json",this.callback(['process2',callback]),'json') 
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
		callback: function( funcs ) {

			//args that should be curried
			var args = jQuery.makeArray(arguments),
				self;

			funcs = args.shift();

			if (!jQuery.isArray(funcs) ) {
				funcs = [funcs];
			}

			self = this;
			
			return function class_cb() {
				var cur = args.concat(jQuery.makeArray(arguments)),
					isString, 
					length = funcs.length,
					f = 0,
					func;

				for (; f < length; f++ ) {
					func = funcs[f];
					if (!func ) {
						continue;
					}

					isString = typeof func == "string";
					if ( isString && self._set_called ) {
						self.called = func;
					}
					cur = (isString ? self[func] : func).apply(self, cur || []);
					if ( f < length - 1 ) {
						cur = !jQuery.isArray(cur) || cur._use_call ? [cur] : cur
					}
				}
				return cur;
			}
		},
		/**
		 *   @function getObject 
		 *   Gets an object from a String.
		 *   If the object or namespaces the string represent do not
		 *   exist it will create them.  
		 *   @codestart
		 *   Foo = {Bar: {Zar: {"Ted"}}}
		 *   $.Class.getobject("Foo.Bar.Zar") //-> "Ted"
		 *   @codeend
		 *   @param {String} objectName the object you want to get
		 *   @param {Object} [current=window] the object you want to look in.
		 *   @return {Object} the object you are looking for.
		 */
		getObject: function( objectName, current ) {
			var current = current || window,
				parts = objectName ? objectName.split(/\./) : [],
				i = 0;
			for (; i < parts.length; i++ ) {
				current = current[parts[i]] || (current[parts[i]] = {})
			}
			return current;
		},
		/**
		 * @function newInstance
		 * Creates a new instance of the class.  This method is useful for creating new instances
		 * with arbitrary parameters.
		 * <h3>Example</h3>
		 * @codestart
		 * $.Class.extend("MyClass",{},{})
		 * var mc = MyClass.newInstance.apply(null, new Array(parseInt(Math.random()*10,10))
		 * @codeend
		 * @return {class} instance of the class
		 */
		newInstance: function() {
			var inst = this.rawInstance(),
				args;
			if ( inst.setup ) {
				args = inst.setup.apply(inst, arguments);
			}
			if ( inst.init ) {
				inst.init.apply(inst, $.isArray(args) ? args : arguments);
			}
			return inst;
		},
		/**
		 * Copy and overwrite options from old class
		 * @param {Object} oldClass
		 * @param {String} fullName
		 * @param {Object} staticProps
		 * @param {Object} protoProps
		 */
		setup: function( oldClass, fullName ) {
			this.defaults = $.extend(true, {}, oldClass.defaults, this.defaults);
			return arguments;
		},
		rawInstance: function() {
			initializing = true;
			var inst = new this();
			initializing = false;
			return inst;
		},
		/**
		 * Extends a class with new static and prototype functions.  There are a variety of ways
		 * to use extend:
		 * @codestart
		 * //with className, static and prototype functions
		 * $.Class.extend('Task',{ STATIC },{ PROTOTYPE })
		 * //with just classname and prototype functions
		 * $.Class.extend('Task',{ PROTOTYPE })
		 * //With just a className
		 * $.Class.extend('Task')
		 * @codeend
		 * @param {String} [fullName]  the classes name (used for classes w/ introspection)
		 * @param {Object} [klass]  the new classes static/class functions
		 * @param {Object} [proto]  the new classes prototype functions
		 * @return {jQuery.Class} returns the new class
		 */
		extend: function( fullName, klass, proto ) {
			// figure out what was passed
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
				_super = this.prototype,
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

				if ( this.constructor !== Class && arguments.length ) { //we are being called w/o new
					return arguments.callee.extend.apply(arguments.callee, arguments)
				} else { //we are being called w/ new
					return this.Class.newInstance.apply(this.Class, arguments)
				}
			}
			// Copy old stuff onto class
			for ( name in this ) {
				if ( this.hasOwnProperty(name) && $.inArray(name, ['prototype', 'defaults', 'getObject']) == -1 ) {
					Class[name] = this[name];
				}
			}

			// do static inheritance
			inheritProps(klass, this, Class);

			// do namespace stuff
			if ( fullName ) {

				var parts = fullName.split(/\./),
					shortName = parts.pop(),
					current = $.Class.getObject(parts.join('.')),
					namespace = current;

				
				current[shortName] = Class;
			}

			// set things that can't be overwritten
			$.extend(Class, {
				prototype: prototype,
				namespace: namespace,
				shortName: shortName,
				constructor: Class,
				fullName: fullName
			});

			//make sure our prototype looks nice
			Class.prototype.Class = Class.prototype.constructor = Class;


			/**
			 * @attribute fullName 
			 * The full name of the class, including namespace, provided for introspection purposes.
			 * @codestart
			 * $.Class.extend("MyOrg.MyClass",{},{})
			 * MyOrg.MyClass.shortName //-> 'MyClass'
			 * MyOrg.MyClass.fullName //->  'MyOrg.MyClass'
			 * @codeend
			 */

			var args = Class.setup.apply(Class, [_super_class].concat($.makeArray(arguments)));

			if ( Class.init ) {
				Class.init.apply(Class, args || []);
			}

			/* @Prototype*/
			return Class;
			/** 
			 * @function setup
			 * Called with the same arguments as new Class(arguments ...) when a new instance is created.
			 * @codestart
			 * $.Class.extend("MyClass",
			 * {
			 *    setup: function( val ) {
			 *       this.val = val;
			 *    }
			 * })
			 * var mc = new MyClass("Check Check")
			 * mc.val //-> 'Check Check'
			 * @codeend
			 * 
			 * <div class='whisper'>PRO TIP: 
			 * Setup functions are used to normalize constructor arguments and provide a place for
			 * setup code that extending classes don't have to remember to call _super to
			 * run.
			 * </div>
			 * 
			 * @return {Array|undefined} If an array is return, [jQuery.Class.prototype.init] is 
			 * called with those arguments; otherwise, the original arguments are used.
			 */
			//break up
			/** 
			 * @function init
			 * Called with the same arguments as new Class(arguments ...) when a new instance is created.
			 * @codestart
			 * $.Class.extend("MyClass",
			 * {
			 *    init: function( val ) {
			 *       this.val = val;
			 *    }
			 * })
			 * var mc = new MyClass("Check Check")
			 * mc.val //-> 'Check Check'
			 * @codeend
			 */
			//Breaks up code
			/**
			 * @attribute Class
			 * References the static properties of the instance's class.
			 * <h3>Quick Example</h3>
			 * @codestart
			 * // a class with a static classProperty property
			 * $.Class.extend("MyClass", {classProperty : true}, {});
			 * 
			 * // a new instance of myClass
			 * var mc1 = new MyClass();
			 * 
			 * //
			 * mc1.Class.classProperty = false;
			 * 
			 * // creates a new MyClass
			 * var mc2 = new mc.Class();
			 * @codeend
			 * Getting static properties via the Class property, such as it's 
			 * [jQuery.Class.static.fullName fullName] is very common.
			 */
		}

	})





	jQuery.Class.prototype.
	/**
	 * @function callback
	 * Returns a callback function.  This does the same thing as and is described better in [jQuery.Class.static.callback].
	 * The only difference is this callback works
	 * on a instance instead of a class.
	 * @param {String|Array} fname If a string, it represents the function to be called.  
	 * If it is an array, it will call each function in order and pass the return value of the prior function to the
	 * next function.
	 * @return {Function} the callback function
	 */
	callback = jQuery.Class.callback;


})(jQuery);

//jquery.lang.js

(function( $ ) {
	// Several of the methods in this plugin use code adapated from Prototype
	//  Prototype JavaScript framework, version 1.6.0.1
	//  (c) 2005-2007 Sam Stephenson
	var regs = {
		undHash: /_|-/,
		colons: /::/,
		words: /([A-Z]+)([A-Z][a-z])/g,
		lowerUpper: /([a-z\d])([A-Z])/g,
		dash: /([a-z\d])([A-Z])/g,
		replacer: /\{([^\}]+)\}/g
	},
	getObject = function( objectName, current, remove) {
		var current = current || window,
			parts = objectName ? objectName.split(/\./) : [],
			ret,
			i = 0;
		for (; i < parts.length-1 && current; i++ ) {
			current = current[parts[i]]
		}
		ret = current[parts[i]];
		if(remove){
			delete current[parts[i]];
		}
		return ret;
	};

	/** 
	 * @class jQuery.String
	 */
	var str = ($.String =
	{
		/**
		 * @function strip
		 * @param {String} s returns a string with leading and trailing whitespace removed.
		 */
		strip: function( string ) {
			return string.replace(/^\s+/, '').replace(/\s+$/, '');
		},
		/**
		 * Capitalizes a string
		 * @param {String} s the string to be lowercased.
		 * @return {String} a string with the first character capitalized, and everything else lowercased
		 */
		capitalize: function( s, cache ) {
			return s.charAt(0).toUpperCase() + s.substr(1);
		},

		/**
		 * Returns if string ends with another string
		 * @param {String} s String that is being scanned
		 * @param {String} pattern What the string might end with
		 * @return {Boolean} true if the string ends wtih pattern, false if otherwise
		 */
		endsWith: function( s, pattern ) {
			var d = s.length - pattern.length;
			return d >= 0 && s.lastIndexOf(pattern) === d;
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
			var parts = s.split(regs.undHash),
				i = 1;
			parts[0] = parts[0].charAt(0).toLowerCase() + parts[0].substr(1);
			for (; i < parts.length; i++ ) {
				parts[i] = str.capitalize(parts[i]);
			}

			return parts.join('');
		},
		/**
		 * Like camelize, but the first part is also capitalized
		 * @param {String} s
		 * @return {String} the classized string
		 */
		classize: function( s ) {
			var parts = s.split(regs.undHash),
				i = 0;
			for (; i < parts.length; i++ ) {
				parts[i] = str.capitalize(parts[i]);
			}

			return parts.join('');
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
			var parts = s.split(regs.undHash),
				i = 0;
			for (; i < parts.length; i++ ) {
				parts[i] = str.capitalize(parts[i]);
			}

			return parts.join(' ');
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
			return s.replace(regs.colons, '/').replace(regs.words, '$1_$2').replace(regs.lowerUpper, '$1_$2').replace(regs.dash, '_').toLowerCase();
		},
		/**
		 * Returns a string with {param} replaced with parameters
		 * from data.
		 *     $.String.sub("foo {bar}",{bar: "far"})
		 *     //-> "foo far"
		 * @param {String} s
		 * @param {Object} data
		 */
		sub : function( s, data, remove ){
			return s.replace(regs.replacer, function( whole, inside ) {
				//convert inside to type
				return getObject(inside, data, remove).toString(); //gets the value in options
			})
		}
	});

})(jQuery);

//jquery.model.js

(function() {
	
	/**
	 * @class jQuery.Model
	 * @tag core
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/model/model.js
	 * @test jquery/model/qunit.html
	 * @plugin jquery/model
	 * 
	 * Models wrap an application's data layer.  In large applications, a model is critical for:
	 * 
	 *  - Encapsulating services so controllers + views don't care where data comes from.
	 *    
	 *  - Providing helper functions that make manipulating and abstracting raw service data easier.
	 * 
	 * This is done in two ways:
	 * 
	 *  - Requesting data from and interacting with services
	 *  
	 *  - Converting or wrapping raw service data into a more useful form.
	 * 
	 * 
	 * ## Basic Use
	 * 
	 * The [jQuery.Model] class provides a basic skeleton to organize pieces of your application's data layer.
	 * First, consider doing Ajax <b>without</b> a model.  In our imaginary app, you:
	 * 
	 *  - retrieve a list of tasks</li>
	 *  - display the number of days remaining for each task
	 *  - mark tasks as complete after users click them
	 * 
	 * Let's see how that might look without a model:
	 * 
	 * @codestart
	 * $.Controller.extend("MyApp.Controllers.Tasks",{onDocument: true},
	 * {
	 *   // get tasks when the page is ready 
	 *   ready: function() {
	 *     $.get('/tasks.json', this.callback('gotTasks'), 'json')
	 *   },
	 *  |* 
	 *   * assume json is an array like [{name: "trash", due_date: 1247111409283}, ...]
	 *   *|
	 *  gotTasks: function( json ) { 
	 *     for(var i =0; i < json.length; i++){
	 *       var taskJson = json[i];
	 *       
	 *       //calculate time remaining
	 *       var remaininTime = new Date() - new Date(taskJson.due_date);
	 *       
	 *       //append some html
	 *       $("#tasks").append("&lt;div class='task' taskid='"+taskJson.id+"'>"+
	 *                           "&lt;label>"+taskJson.name+"&lt;/label>"+
	 *                           "Due Date = "+remaininTime+"&lt;/div>")
	 *     }
	 *   },
	 *   // when a task is complete, get the id, make a request, remove it
	 *   ".task click" : function( el ) {
	 *     $.post('/task_complete',{id: el.attr('data-taskid')}, function(){
	 *       el.remove();
	 *     })
	 *   }
	 * })
	 * @codeend
	 * 
	 * This code might seem fine for right now, but what if:
	 * 
	 *  - The service changes?
	 *  - Other parts of the app want to calculate <code>remaininTime</code>?
	 *  - Other parts of the app want to get tasks?</li>
	 *  - The same task is represented multiple palces on the page?
	 * 
	 * The solution is of course a strong model layer.  Lets look at what a
	 * a good model does for a controller before we learn how to make one:
	 * 
	 * @codestart
	 * $.Controller.extend("MyApp.Controllers.Tasks",{onDocument: true},
	 * {
	 *   load: function() {
	 *     Task.findAll({},this.callback('list'))
	 *   },
	 *   list: function( tasks ) {
	 *     $("#tasks").html(this.view(tasks))
	 *   },
	 *   ".task click" : function( el ) {
	 *     el.models()[0].complete(function(){
	 *       el.remove();
	 *     });
	 *   }
	 * })
	 * @codeend
	 * 
	 * In views/tasks/list.ejs
	 * 
	 * @codestart html
	 * &lt;% for(var i =0; i &lt; tasks.length; i++){ %>
	 * &lt;div class='task &lt;%= tasks[i].<b>identity</b>() %>'>
	 *    &lt;label>&lt;%= tasks[i].name %>&lt;/label>
	 *    &lt;%= tasks[i].<b>timeRemaining</b>() %>
	 * &lt;/div>
	 * &lt;% } %>
	 * @codeend
	 * 
	 * Isn't that better!  Granted, some of the improvement comes because we used a view, but we've
	 * also made our controller completely understandable.  Now lets take a look at the model:
	 * 
	 * @codestart
	 * $.Model.extend("Task",
	 * {
	 *  findAll: function( params,success ) {
	 *   $.get("/tasks.json", params, this.callback(["wrapMany",success]),"json");
	 *  }
	 * },
	 * {
	 *  timeRemaining: function() {
	 *   return new Date() - new Date(this.due_date)
	 *  },
	 *  complete: function( success ) {
	 *   $.get("/task_complete", {id: this.id }, success,"json");
	 *  }
	 * })
	 * @codeend
	 * 
	 * There, much better!  Now you have a single place where you can organize Ajax functionality and
	 * wrap the data that it returned.  Lets go through each bolded item in the controller and view.<br/>
	 * 
	 * ### Task.findAll
	 * 
	 * The findAll function requests data from "/tasks.json".  When the data is returned, it it is run through
	 * the "wrapMany" function before being passed to the success callback.<br/>
	 * If you don't understand how the callback works, you might want to check out 
	 * [jQuery.Model.static.wrapMany wrapMany] and [jQuery.Class.static.callback callback].
	 * 
	 * ### el.models
	 * 
	 * [jQuery.fn.models models] is a jQuery helper that returns model instances.  It uses
	 * the jQuery's elements' shortNames to find matching model instances.  For example:
	 * 
	 * @codestart html
	 * &lt;div class='task task_5'> ... &lt;/div>
	 * @codeend
	 * 
	 * It knows to return a task with id = 5.
	 * 
	 * ### complete
	 * 
	 * This should be pretty obvious.
	 * 
	 * ### identity
	 * 
	 * [jQuery.Model.prototype.identity Identity] returns a unique identifier that [jQuery.fn.models] can use
	 * to retrieve your model instance.
	 * 
	 * ### timeRemaining
	 * 
	 * timeRemaining is a good example of wrapping your model's raw data with more useful functionality.
	 * ## Validations
	 * 
	 * You can validate your model's attributes with another plugin.  See [validation].
	 */
	
	//helper stuff for later.
	var underscore = $.String.underscore,
		classize = $.String.classize,
		ajax = function(str, attrs, success, error, fixture, type){
			attrs = $.extend({},attrs)
			var url = $.String.sub(str, attrs, true)
			$.ajax({
				url : url,
				data : attrs,
				success : success,
				error: error,
				type : type || "post",
				dataType : "json",
				fixture: fixture
			});
		},
		fixture = function(){
			return "//"+$.String.underscore( this.fullName )
						.replace(/\.models\..*/,"")
						.replace(/\./g,"/")+"/fixtures/"+$.String.underscore( this.shortName )
		},
		addId = function(attrs, id){
			attrs = attrs || {};
			if(attrs[this.id]){
				attrs["new"+$.String.capitalize(this.id)] = attrs[this.id];
				delete attrs[this.id];
			}
			attrs[this.id] = id;
			return attrs;
		},
		// methods that we'll weave into model if provided
		ajaxMethods = 
		/** 
	     * @Static
	     */
		{

		/**
		 * Create is used to create a model instance on the server.  By implementing 
		 * create along with the rest of the [jquery.model.services service api], your models provide an abstract
		 * API for services.  
		 * 
		 * Create is called by save to create a new instance.  If you want to be able to call save on an instance
		 * you have to implement create.
		 * 
		 * The easist way to implement create is to just give it the url to post data to:
		 * 
		 *     $.Model("Recipe",{
		 *       create: "/recipes"
		 *     },{})
		 *     
		 * This lets you create a recipe like:
		 *  
		 *     new Recipe({name: "hot dog"}).save(function(){
		 *       this.name //this is the new recipe
		 *     }).save(callback)
		 *  
		 * You can also implement create by yourself.  You just need to call success back with
		 * an object that contains the id of the new instance and any other properties that should be
		 * set on the instance.
		 *  
		 * For example, the following code makes a request 
		 * to '/recipes.json?name=hot+dog' and gets back
		 * something that looks like:
		 *  
		 *     { 
		 *       id: 5,
		 *       createdAt: 2234234329
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
		 * ## API
		 * 
		 * @param {Object} attrs Attributes on the model instance
		 * @param {Function} success the callback function, it must be called with an object 
		 * that has the id of the new instance and any other attributes the service needs to add.
		 * @param {Function} error a function to callback if something goes wrong.  
		 */
		create: function(str  ) {
			return function(attrs, success, error){
				ajax(str, attrs, success, error, "-restCreate")
			};
		},
		/**
		 * Implement this function!
		 * Update is called by save to update an instance.  If you want to be able to call save on an instance
		 * you have to implement update.
		 */
		update: function( str ) {
			return function(id, attrs, success, error){
				ajax(str, addId.call(this,attrs, id), success, error, "-restUpdate")
			}
		},
		/**
		 * Implement this function!
		 * Destroy is called by destroy to remove an instance.  If you want to be able to call destroy on an instance
		 * you have to implement update.
		 * @param {String|Number} id the id of the instance you want destroyed
		 */
		destroy: function( str ) {
			return function( id, success, error ) {
				var attrs = {};
				attrs[this.id] = id;
				ajax(str, attrs, success, error, "-restDestroy")
			}
		},
		/**
		 * Implement this function!
		 * @param {Object} params
		 * @param {Function} success
		 * @param {Function} error
		 */
		findAll: function( str ) {
			return function(params, success, error){
				ajax(str, 
					params, 
					this.callback(['wrapMany',success]), 
					error, 
					fixture.call(this)+"s.json",
					"get");
			};
		},
		/**
		 * Implement this function!
		 * @param {Object} params
		 * @param {Function} success
		 * @param {Function} error
		 */
		findOne: function( str ) {
			return function(params, success, error){
				ajax(str, 
					params, 
					this.callback(['wrap',success]), 
					error, 
					fixture.call(this)+".json",
					"get");
			};
		}
	};





	jQuery.Class.extend("jQuery.Model",	{
		setup: function( superClass , stat, proto) {
			//we do not inherit attributes (or associations)
			if (!this.attributes || superClass.attributes === this.attributes ) {
				this.attributes = {};
			}

			if (!this.associations || superClass.associations === this.associations ) {
				this.associations = {};
			}
			if (!this.validations || superClass.validations === this.validations ) {
				this.validations = {};
			}

			//add missing converters
			if ( superClass.convert != this.convert ) {
				this.convert = $.extend(superClass.convert, this.convert);
			}


			this._fullName = underscore(this.fullName.replace(/\./g, "_"));

			if ( this.fullName.substr(0, 7) == "jQuery." ) {
				return;
			}

			//add this to the collection of models
			jQuery.Model.models[this._fullName] = this;

			if ( this.listType ) {
				this.list = new this.listType([]);
			}
			
			for(var name in ajaxMethods){
				if(typeof this[name] === 'string'){
					this[name] = ajaxMethods[name](this[name]);
				}
			}
		},
		/**
		 * @attribute attributes
		 * Attributes contains a list of properties and their types
		 * for this model.  You can use this in conjunction with 
		 * [jQuery.Model.static.convert] to provide automatic 
		 * [jquery.model.typeconversion type conversion].  
		 * 
		 * The following converts dueDates to JavaScript dates:
		 * 
		 * @codestart
		 * $.Model.extend("Contact",{
		 *   attributes : { 
		 *     birthday : 'date'
		 *   },
		 *   convert : {
		 *     date : function(raw){
		 *       if(typeof raw == 'string'){
		 *         var matches = raw.match(/(\d+)-(\d+)-(\d+)/)
		 *         return new Date( matches[1], 
		 *                  (+matches[2])-1, 
		 *                 matches[3] )
		 *       }else if(raw instanceof Date){
		 *           return raw;
		 *       }
		 *     }
		 *   }
		 * },{})
		 * @codeend
		 */
		attributes: {},
		/**
		 * @attribute defaults
		 * An object of default values to be set on all instances.  This 
		 * is useful if you want some value to be present when new instances are created.
		 * 
		 * @codestart
		 * $.Model.extend("Recipe",{
		 *   defaults : {
		 *     createdAt : new Date();
		 *   }
		 * },{})
		 * 
		 * var recipe = new Recipe();
		 * 
		 * recipe.createdAt //-> date
		 * 
		 * @codeend
		 */
		defaults: {},
		/**
		 * Wrap is used to create a new instance from data returned from the server.
		 * It is very similar to doing <code> new Model(attributes) </code> 
		 * except that wrap will check if the data passed has an
		 * 
		 * - attributes,
		 * - data, or
		 * - <i>singularName</i>
		 * 
		 * property.  If it does, it will use that objects attributes.
		 * 
		 * Wrap is really a convience method for servers that don't return just attributes.
		 * 
		 * @param {Object} attributes
		 * @return {Model} an instance of the model
		 */
		wrap: function( attributes ) {
			if (!attributes ) {
				return null;
			}
			return new this(
			// checks for properties in an object (like rails 2.0 gives);
			attributes[this.singularName] || attributes.data || attributes.attributes || attributes);
		},
		/**
		 * Takes raw data from the server, and returns an array of model instances.
		 * Each item in the raw array becomes an instance of a model class.
		 * 
		 * @codestart
		 * $.Model.extend("Recipe",{
		 *   helper : function(){
		 *     return i*i;
		 *   }
		 * })
		 * 
		 * var recipes = Recipe.wrapMany([{id: 1},{id: 2}])
		 * recipes[0].helper() //-> 1
		 * @codeend
		 * 
		 * If an array is not passed to wrapMany, it will look in the object's .data
		 * property.  
		 * 
		 * For example:
		 * 
		 * @codestart
		 * var recipes = Recipe.wrapMany({data: [{id: 1},{id: 2}]})
		 * recipes[0].helper() //-> 1
		 * @codeend
		 * 
		 * Often wrapMany is used with this.callback inside a model's [jQuery.Model.static.findAll findAll]
		 * method like:
		 * 
		 *     findAll : function(params, success, error){
		 *       $.get('/url',
		 *             params,
		 *             this.callback(['wrapMany',success]) )
		 *     }
		 * 
		 * If you are having problems getting your model to callback success correctly,
		 * make sure a request is being made (with firebug's net tab).  Also, you 
		 * might not use this.callback and instead do:
		 * 
		 *     findAll : function(params, success, error){
		 *       self = this;
		 *       $.get('/url',
		 *             params,
		 *             function(data){
		 *               var wrapped = self.wrapMany(data);
		 *               success(data)
		 *             })
		 *     }
		 * 
		 * ## API
		 * 
		 * @param {Array} instancesRawData an array of raw name - value pairs.
		 * @return {Array} a JavaScript array of instances or a [jQuery.Model.List list] of instances
		 *  if the model list plugin has been included.
		 */
		wrapMany: function( instancesRawData ) {
			if (!instancesRawData ) {
				return null;
			}
			var listType = this.List || $.Model.List || Array,
				res = new listType(),
				arr = $.isArray(instancesRawData),
				raw = arr ? instancesRawData : instancesRawData.data,
				length = raw.length,
				i = 0;
			
			res._use_call = true; //so we don't call next function with all of these
			for (; i < length; i++ ) {
				res.push(this.wrap(raw[i]));
			}
			if (!arr ) { //push other stuff onto array
				for ( var prop in instancesRawData ) {
					if ( prop !== 'data' ) {
						res[prop] = instancesRawData[prop];
					}

				}
			}
			return res;
		},
		/**
		 * The name of the id field.  Defaults to 'id'. Change this if it is something different.
		 * 
		 * For example, it's common in .NET to use Id.  Your model might look like:
		 * 
		 * @codestart
		 * $.Model.extend("Friends",{
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
			var stub;

			if ( this.associations[property] ) {
				return;
			}
			stub = this.attributes[property] || (this.attributes[property] = type);
			return type;
		},
		// a collection of all models
		models: {},
		/**
		 * If OpenAjax is available,
		 * publishes to OpenAjax.hub.  Always adds the shortName.event.
		 * 
		 * @codestart
		 * // publishes contact.completed
		 * Namespace.Contact.publish("completed",contact);
		 * @codeend
		 * 
		 * @param {String} event The event name to publish
		 * @param {Object} data The data to publish
		 */
		publish: function( event, data ) {
			
			if ( window.OpenAjax ) {
				OpenAjax.hub.publish(underscore(this.shortName) + "." + event, data);
			}

		},
		/**
		 * @hide
		 * Guesses the type of an object.  This is what sets the type if not provided in 
		 * [jQuery.Model.static.attributes].
		 * @param {Object} object the object you want to test.
		 * @return {String} one of string, object, date, array, boolean, number, function
		 */
		guessType: function( object ) {
			if ( typeof object != 'string' ) {
				if ( object === null ) {
					return typeof object;
				}
				if ( object.constructor == Date ) {
					return 'date';
				}
				if ( $.isArray(object) ) {
					return 'array';
				}
				return typeof object;
			}
			if ( object === "" ) {
				return 'string';
			}
			//check if true or false
			if ( object == 'true' || object == 'false' ) {
				return 'boolean';
			}
			if (!isNaN(object) && isFinite(+object) ) {
				return 'number';
			}
			return typeof object;
		},
		/**
		 * @attribute convert
		 * @type Object
		 * An object of name-function pairs that are used to convert attributes.
		 * Check out [jQuery.Model.static.attributes] or 
		 * [jquery.model.typeconversion type conversion]
		 * for examples.
		 */
		convert: {
			"date": function( str ) {
				return typeof str === "string" ? (isNaN(Date.parse(str)) ? null : Date.parse(str)) : str;
			},
			"number": function( val ) {
				return parseFloat(val);
			},
			"boolean": function( val ) {
				return Boolean(val);
			}
		}
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
		 * $.Model.extend("Recipe")
		 * var recipe = new Recipe({foo: "bar"});
		 * recipe.foo //-> "bar"
		 * recipe.attr("foo") //-> "bar"
		 * @codeend
		 * 
		 * @param {Object} attributes a hash of attributes
		 */
		setup: function( attributes ) {
			var stub;

			// so we know not to fire events
			this._initializing = true;

			stub = this.Class.defaults && this.attrs(this.Class.defaults);

			this.attrs(attributes);
			delete this._initializing;
		},
		/**
		 * Sets the attributes on this instance and calls save.
		 * The instance needs to have an id.  It will use
		 * the instance class's [jQuery.Model.static.update update]
		 * method.
		 * 
		 * @codestart
		 * recipe.update({name: "chicken"}, success, error);
		 * @codeend
		 * 
		 * If OpenAjax.hub is available, the model will also
		 * publish a "<i>modelName</i>.updated" message with
		 * the updated instance.
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
		 * @codestart
		 * $.Model.extend("Task",{
		 *   init : function(){
		 *     this.validatePresenceOf("dueDate")
		 *   }
		 * },{});
		 * 
		 * var task = new Task(),
		 *     errors = task.errors()
		 * 
		 * errors.dueDate[0] //-> "can't be empty"
		 * @codeend
		 */
		errors: function( attrs ) {
			if ( attrs ) {
				attrs = $.isArray(attrs) ? attrs : $.makeArray(arguments);
			}
			var errors = {},
				self = this,
				addErrors = function( attr, funcs ) {
					$.each(funcs, function( i, func ) {
						var res = func.call(self);
						if ( res ) {
							if (!errors.hasOwnProperty(attr) ) {
								errors[attr] = [];
							}

							errors[attr].push(res);
						}

					});
				};

			$.each(attrs || this.Class.validations || {}, function( attr, funcs ) {
				if ( typeof attr == 'number' ) {
					attr = funcs;
					funcs = self.Class.validations[attr];
				}
				addErrors(attr, funcs || []);
			});

			for ( var attr in errors ) {
				if ( errors.hasOwnProperty(attr) ) {
					return errors;
				}
			}
			return null;
		},
		/**
		 * Gets or sets an attribute on the model using setters and 
		 * getters if available.
		 * 
		 * @codestart
		 * $.Model.extend("Recipe")
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
		 * $.Model.extend("Recipe",{
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
		 * $.Model.extend("Recipe",{
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
		 * covered in [jQuery.Model.prototype.bind].
		 * 
		 * @param {String} attribute the attribute you want to set or get
		 * @param {String|Number|Boolean} [value] value the value you want to set.
		 * @param {Function} [success] an optional success callback.  
		 *    This gets called if the attribute was successful.
		 * @param {Function} [error] an optional success callback.  
		 *    The error function is called with validation errors.
		 */
		attr: function( attribute, value, success, error ) {
			var cap = classize(attribute),
				get = "get" + cap;
			if ( value !== undefined ) {
				this._setProperty(attribute, value, success, error, cap);
				return this;
			}
			return this[get] ? this[get]() : this[attribute];
		},
		/**
		 * Binds to events on this model instance.  Typically 
		 * you'll bind to an attribute name.  Handler will be called
		 * every time the attribute value changes.  For example:
		 * 
		 * @codestart
		 * $.Model.extend("School")
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
		 * $.Model.extend("School",{
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
		bind: function( eventType, handler ) {
			var wrapped = $(this);
			wrapped.bind.apply(wrapped, arguments);
			return this;
		},
		/**
		 * Unbinds an event handler from this instance.
		 * Read [jQuery.Model.prototype.bind] for 
		 * more information.
		 * @param {String} eventType
		 * @param {Function} handler
		 */
		unbind: function( eventType, handler ) {
			var wrapped = $(this);
			wrapped.unbind.apply(wrapped, arguments);
			return this;
		},
		/**
		 * Checks if there is a set_<i>property</i> value.  If it returns true, lets it handle; otherwise
		 * saves it.
		 * @hide
		 * @param {Object} property
		 * @param {Object} value
		 */
		_setProperty: function( property, value, success, error, capitalized ) {
			// the potential setter name
			var setName = "set" + capitalized,
				//the old value
				old = this[property],
				self = this,
				errorCallback = function( errors ) {
					var stub;
					stub = error && error.call(self, errors);
					$(self).triggerHandler("error." + property, errors);
				};

			// if the setter returns nothing, do not set
			// we might want to indicate if this was set ok
			if ( this[setName] && (value = this[setName](value, this.callback('_updateProperty', property, value, old, success, errorCallback), errorCallback)) === undefined ) {
				return;
			}
			this._updateProperty(property, value, old, success, errorCallback);
		},
		/**
		 * Triggers events when a property has been updated
		 * @hide
		 * @param {Object} property
		 * @param {Object} value
		 * @param {Object} old
		 * @param {Object} success
		 */
		_updateProperty: function( property, value, old, success, errorCallback ) {
			var Class = this.Class,
				val, type = Class.attributes[property] || Class.addAttr(property, Class.guessType(value)),
				//the converter
				converter = Class.convert[type],
				errors = null,
				stub;

			val = this[property] = (value === null ? //if the value is null or undefined
			null : // it should be null
			(converter ? converter.call(Class, value) : //convert it to something useful
			value)); //just return it
			//validate (only if not initializing, this is for performance)
			if (!this._initializing ) {
				errors = this.errors(property);
			}

			if ( errors ) {
				errorCallback(errors);
			} else {
				if ( old !== val && !this._initializing ) {
					$(this).triggerHandler(property, val);
				}
				stub = success && success(this);

			}

			//if this class has a global list, add / remove from the list.
			if ( property == Class.id && val !== null && Class.list ) {
				// if we didn't have an old id, add ourselves
				if (!old ) {
					Class.list.push(this);
				} else if ( old != val ) {
					// if our id has changed ... well this should be ok
					Class.list.remove(old);
					Class.list.push(this);
				}
			}

		},
		/**
		 * Gets or sets a list of attributes. 
		 * Each attribute is set with [jQuery.Model.prototype.attr attr].
		 * 
		 * @codestart
		 * recipe.attrs({
		 *   name: "ice water",
		 *   instructions : "put water in a glass"
		 * })
		 * @codeend
		 * 
		 * @param {Object} [attributes]  if present, the list of attributes to send
		 * @return {Object} the current attributes of the model
		 */
		attrs: function( attributes ) {
			var key;
			if (!attributes ) {
				attributes = {};
				for ( key in this.Class.attributes ) {
					if ( this.Class.attributes.hasOwnProperty(key) ) {
						attributes[key] = this.attr(key);
					}
				}
			} else {
				var idName = this.Class.id;
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
		 * Returns if the instance is a new object.  This is essentially if the
		 * id is null or undefined.
		 * 
		 *     new Recipe({id: 1}).isNew() //-> false
		 * @return {Boolean} false if an id is set, true if otherwise.
		 */
		isNew: function() {
			var id = this[this.Class.id];
			return (id === undefined || id === null); //if null or undefined
		},
		/**
		 * Saves the instance if there are no errors.  
		 * If the instance is new, [jQuery.Model.static.create] is
		 * called; otherwise, [jQuery.Model.static.update] is
		 * called.
		 * 
		 * @codestart
		 * recipe.save(success, error);
		 * @codeend
		 * 
		 * If OpenAjax.hub is available, after a successful create or update, 
		 * "<i>modelName</i>.created" or "<i>modelName</i>.updated" is published.
		 * 
		 * @param {Function} [success] called if a successful save.
		 * @param {Function} [error] called if the save was not successful.
		 */
		save: function( success, error ) {
			var stub;

			if ( this.errors() ) {
				//needs to send errors
				return false;
			}
			stub = this.isNew() ? this.Class.create(this.attrs(), this.callback(['created', success]), error) : this.Class.update(this[this.Class.id], this.attrs(), this.callback(['updated', success]), error);

			//this.is_new_record = this.Class.new_record_func;
			return true;
		},

		/**
		 * Destroys the instance by calling 
		 * [jQuery.Model.static.destroy] with the id of the instance.
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
			this.Class.destroy(this[this.Class.id], this.callback(["destroyed", success]), error);
		},


		/**
		 * Returns a unique identifier for the model instance.  For example:
		 * @codestart
		 * new Todo({id: 5}).identity() //-> 'todo_5'
		 * @codeend
		 * Typically this is used in an element's shortName property so you can find all elements
		 * for a model with [jQuery.Model.prototype.elements elements].
		 * @return {String}
		 */
		identity: function() {
			var id = this[this.Class.id];
			return this.Class._fullName + '_' + (this.Class.escapeIdentity ? encodeURIComponent(id) : id);
		},
		/**
		 * Returns elements that represent this model instance.  For this to work, your element's should
		 * us the [jQuery.Model.prototype.identity identity] function in their class name.  Example:
		 * 
		 *     <div class='todo <%= todo.identity() %>'> ... </div>
		 * 
		 * This also works if you hooked up the model:
		 * 
		 *     <div <%= todo %>> ... </div>
		 *     
		 * Typically, you'll use this as a response of an OpenAjax message:
		 * 
		 *     "todo.destroyed subscribe": function(called, todo){
		 *       todo.elements(this.element).remove();
		 *     }
		 * 
		 * ## API
		 * 
		 * @param {String|jQuery|element} context If provided, only elements inside this element
		 * that represent this model will be returned.
		 * 
		 * @return {jQuery} Returns a jQuery wrapped nodelist of elements that have this model instances
		 *  identity in their class name.
		 */
		elements: function( context ) {
			return $("." + this.identity(), context);
		},
		/**
		 * Publishes to open ajax hub
		 * @param {String} event
		 * @param {Object} [opt6] data if missing, uses the instance in {data: this}
		 */
		publish: function( event, data ) {
			this.Class.publish(event, data || this);
		},
		hookup: function( el ) {
			var shortName = underscore(this.Class.shortName),
				models = $.data(el, "models") || $.data(el, "models", {});
			$(el).addClass(shortName + " " + this.identity());
			models[shortName] = this;
		}
	});

	$.each([
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
	 * Called after an instance is destroyed.  Publishes
	 * "shortName.destroyed"
	 */
	"destroyed"], function( i, funcName ) {
		$.Model.prototype[funcName] = function( attrs ) {
			var stub;

			if ( funcName === 'destroyed' && this.Class.list ) {
				this.Class.list.remove(this[this.Class.id]);
			}
			$(this).triggerHandler(funcName);
			stub = attrs && typeof attrs == 'object' && this.attrs(attrs.attrs ? attrs.attrs() : attrs);
			this.publish(funcName, this);
			return [this].concat($.makeArray(arguments));
		};
	});

	/**
	 *  @add jQuery.fn
	 */
	// break
	/**
	 * @function models
	 * Returns a list of models.  If the models are of the same
	 * type, and have a [jQuery.Model.List], it will return 
	 * the models wrapped with the list.
	 * 
	 * @codestart
	 * $(".recipes").models() //-> [recipe, ...]
	 * @codeend
	 * 
	 * @param {jQuery.Class} [type] if present only returns models of the provided type.
	 * @return {Array|jQuery.Model.List} returns an array of model instances that are represented by the contained elements.
	 */
	$.fn.models = function( type ) {
		//get it from the data
		var collection = [],
			kind, ret, retType;
		this.each(function() {
			$.each($.data(this, "models") || {}, function( name, instance ) {
				//either null or the list type shared by all classes
				kind = kind === undefined ? instance.Class.List || null : (instance.Class.List === kind ? kind : null);
				collection.push(instance);
			});
		});

		retType = kind || $.Model.List || Array;
		ret = new retType();

		ret.push.apply(ret, $.unique(collection));
		return ret;
	};
	/**
	 * @function model
	 * 
	 * Returns the first model instance found from [jQuery.fn.models].
	 * 
	 * @param {Object} type
	 */
	$.fn.model = function( type ) {
		if ( type && type instanceof $.Model ) {
			type.hookup(this[0]);
			return this;
		} else {
			return this.models.apply(this, arguments)[0];
		}

	};
	/**
	 * @page jquery.model.services Service APIs
	 * @parent jQuery.Model
	 * 
	 * Models provide an abstract API for connecting to your Services.  By implementing static:
	 * 
	 *  - [jQuery.Model.static.findAll] 
	 *  - [jQuery.Model.static.findOne] 
	 *  - [jQuery.Model.static.create] 
	 *  - [jQuery.Model.static.update] 
	 *  - [jQuery.Model.static.destroy]
	 *  
	 * You can pass a model class to widgets and the widgets can interface with the
	 * model.  This prevents the need for every widget to be configured with the ajax functionality
	 * necessary to make a request to your services.
	 */
})(jQuery);

//jquery.dom.js



//jquery.dom.fixture.js

(function( $ ) {

	var ajax = $.ajax;

	/**
	 * @class jQuery.fixture
	 * @plugin jquery/dom/fixture
	 * @download http://jmvcsite.heroku.com/pluginify?plugins[]=jquery/dom/fixture/fixture.js
	 * @test jquery/dom/fixture/qunit.html
	 * @parent dom
	 * 
	 * Fixtures simulate AJAX responses by overwriting 
	 * [jQuery.ajax $.ajax], 
	 * [jQuery.get $.get], and 
	 * [jQuery.post $.post].  
	 * Instead of making a request to a server, fixtures simulate 
	 * the repsonse with a file or function.
	 * 
	 * They are a great technique when you want to develop JavaScript 
	 * independently of the backend. 
	 * 
	 * <h3>Quick Example</h3>
	 * <p>Instead of making a request to <code>/tasks.json</code>,
	 *    $.ajax will look in <code>fixtures/tasks.json</code>.
	 *    It's expected that a static <code>fixtures/tasks.json</code> 
	 *    file exists relative to the current page. 
	 * </p>
	 * @codestart
	 * $.ajax({url: "/tasks.json",
	 *   dataType: "json",
	 *   type: "get",
	 *   fixture: "fixtures/tasks.json",
	 *   success: myCallback});
	 * @codeend
	 * <h2>Using Fixtures</h2>
	 * To enable fixtures, you must add this plugin to your page and 
	 * set the fixture property.  
	 * 
	 * The fixture property is set as ...
	 * @codestart
	 * //... a property with $.ajax
	 * $.ajax({fixture: FIXTURE_VALUE})
	 * 
	 * //... a parameter in $.get and $.post
	 * $.get (  url, data, callback, type, FIXTURE_VALUE )
	 * $.post(  url, data, callback, type, FIXTURE_VALUE )
	 * @codeend
	 * <h3>Turning Off Fixtures</h3>
	 * <p>To turn off fixtures, simply remove the fixture plugin from 
	 *  your page.  The Ajax methods will ignore <code>FIXTURE_VALUE</code>
	 *  and revert to their normal behavior.  If you want to ignore a single
	 *  fixture, we suggest commenting it out.
	 * </p>
	 * <div class='whisper'>
	 * PRO TIP:  Don't worry about leaving the fixture values in your source.  
	 * They don't take up many characters and won't impact how jQuery makes
	 * requests.  They can be useful even after the service they simulate
	 * is created.
	 * </div>
	 * <h2>Types of Fixtures</h2>
	 * <p>There are 2 types of fixtures</p>
	 * <ul>
	 *  <li><b>Static</b> - the response is in a file.
	 *  </li>
	 *  <li>
	 *   <b>Dynamic</b> - the response is generated by a function.
	 *  </li>
	 * </ul>
	 * There are different ways to lookup static and dynamic fixtures.
	 * <h3>Static Fixtures</h3>
	 * Static fixture locations can be calculated:
	 * @codestart
	 * // looks in test/fixtures/tasks/1.get
	 * $.ajax({type:"get", 
	 *        url: "tasks/1", 
	 *        fixture: true}) 
	 * @codeend
	 * Or provided:
	 * @codestart
	 * // looks in fixtures/tasks1.json relative to page
	 * $.ajax({type:"get", 
	 *        url: "tasks/1", 
	 *        fixture: "fixtures/task1.json"})
	 * 
	 * // looks in fixtures/tasks1.json relative to jmvc root
	 * // this assumes you are using steal
	 * $.ajax({type:"get", 
	 *        url: "tasks/1", 
	 *        fixture: "//fixtures/task1.json"})` 
	 * @codeend
	 * <div class='whisper'>
	 *   PRO TIP: Use provided fixtures.  It's easier to understand what it is going.
	 *   Also, create a fixtures folder in your app to hold your fixtures.
	 * </div>
	 * <h3>Dynamic Fixtures</h3>
	 * <p>Dynamic Fixtures are functions that return the arguments the $.ajax callbacks 
	 *   (<code>beforeSend</code>, <code>success</code>, <code>complete</code>, 
	 *    <code>error</code>) expect.  </p>
	 * <p>For example, the "<code>success</code>" of a json request is called with 
	 * <code>[data, textStatus, XMLHttpRequest].</p>
	 * <p>There are 2 ways to lookup dynamic fixtures.<p>
	 * They can provided:
	 * @codestart
	 * //just use a function as the fixture property
	 * $.ajax({
	 *   type:     "get", 
	 *   url:      "tasks",
	 *   data:     {id: 5},
	 *   dataType: "json",
	 *   fixture: function( settings, callbackType ) {
	 *     var xhr = {responseText: "{id:"+settings.data.id+"}"}
	 *     switch(callbackType){
	 *       case "success": 
	 *         return [{id: settings.data.id},"success",xhr]
	 *       case "complete":
	 *         return [xhr,"success"]
	 *     }
	 *   }
	 * })
	 * @codeend
	 * Or found by name on $.fixture:
	 * @codestart
	 * // add your function on $.fixture
	 * // We use -FUNC by convention
	 * $.fixture["-myGet"] = function(settings, cbType){...}
	 * 
	 * // reference it
	 * $.ajax({
	 *   type:"get", 
	 *   url: "tasks/1", 
	 *   dataType: "json", 
	 *   fixture: "-myGet"})
	 * @codeend
	 * <p>Dynamic fixture functions are called with:</p>
	 * <ul>
	 * <li> settings - the settings data passed to <code>$.ajax()</code>
	 * <li> calbackType - the type of callback about to be called: 
	 *  <code>"beforeSend"</code>, <code>"success"</code>, <code>"complete"</code>, 
	 *    <code>"error"</code></li>
	 * </ul>
	 * and should return an array of arguments for the callback.<br/><br/>
	 * <div class='whisper'>PRO TIP: 
	 * Dynamic fixtures are awesome for performance testing.  Want to see what 
	 * 10000 files does to your app's performance?  Make a fixture that returns 10000 items.
	 * 
	 * What to see what the app feels like when a request takes 5 seconds to return?  Set
	 * [jQuery.fixture.delay] to 5000.
	 * </div>
	 * <h2>Helpers</h2>
	 * <p>The fixture plugin comes with a few ready-made dynamic fixtures and 
	 * fixture helpers:</p>
	 * <ul>
	 * <li>[jQuery.fixture.make] - creates fixtures for findAll, findOne.</li>
	 * <li>[jQuery.fixture.-restCreate] - a fixture for restful creates.</li>
	 * <li>[jQuery.fixture.-restDestroy] - a fixture for restful updates.</li>
	 * <li>[jQuery.fixture.-restUpdate] - a fixture for restful destroys.</li>
	 * </ul>
	 * @demo jquery/dom/fixture/fixture.html
	 * @constructor
	 * Takes an ajax settings and returns a url to look for a fixture.  Overwrite this if you want a custom lookup method.
	 * @param {Object} settings
	 * @return {String} the url that will be used for the fixture
	 */
	$.fixture = function( settings ) {
		var url = settings.url,
			match, left, right;
		url = url.replace(/%2F/g, "~").replace(/%20/g, "_");

		if ( settings.data && settings.processData && typeof settings.data !== "string" ) {
			settings.data = jQuery.param(settings.data);
		}


		if ( settings.data && settings.type.toLowerCase() == "get" ) {
			url += ($.String.include(url, '?') ? '&' : '?') + settings.data;
		}

		match = url.match(/^(?:https?:\/\/[^\/]*)?\/?([^\?]*)\??(.*)?/);
		left = match[1];

		right = settings.type ? '.' + settings.type.toLowerCase() : '.post';
		if ( match[2] ) {
			left += '/';
			right = match[2].replace(/\#|&/g, '-').replace(/\//g, '~') + right;
		}
		return left + right;
	};

	$.extend($.fixture, {
		/**
		 * Provides a rest update fixture function
		 */
		"-restUpdate": function( settings, cbType ) {
			switch ( cbType ) {
			case "success":
				return [$.extend({
					id: parseInt(settings.url, 10)
				}, settings.data), "success", $.fixture.xhr()];
			case "complete":
				return [$.fixture.xhr(), "success"];
			}
		},
		/**
		 * Provides a rest destroy fixture function
		 */
		"-restDestroy": function( settings, cbType ) {
			switch ( cbType ) {
			case "success":
				return [true, "success", $.fixture.xhr()];
			case "complete":
				return [$.fixture.xhr(), "success"];
			}
		},
		/**
		 * Provides a rest create fixture function
		 */
		"-restCreate": function( settings, cbType ) {
			switch ( cbType ) {
			case "success":
				return [{
					id: parseInt(Math.random() * 1000, 10)
				}, "success", $.fixture.xhr()];
			case "complete":
				return [$.fixture.xhr({
					getResponseHeader: function() {
						return settings.url + "/" + parseInt(Math.random() * 1000, 10);
					}
				}), "success"];
			}


		},
		/**
		 * Used to make fixtures for findAll / findOne style requests.
		 * @codestart
		 * //makes a threaded list of messages
		 * $.fixture.make(["messages","message"],1000, function(i, messages){
		 *   return {
		 *     subject: "This is message "+i,
		 *     body: "Here is some text for this message",
		 *     date: Math.floor( new Date().getTime() ),
		 *     parentId : i < 100 ? null : Math.floor(Math.random()*i)
		 *   }
		 * })
		 * //uses the message fixture to return messages limited by offset, limit, order, etc.
		 * $.ajax({
		 *   url: "messages",
		 *   data:{ 
		 *      offset: 100, 
		 *      limit: 50, 
		 *      order: "date ASC",
		 *      parentId: 5},
		 *    },
		 *    fixture: "-messages",
		 *    success: function( messages ) {  ... }
		 * });
		 * @codeend
		 * @param {Array} types An array of the fixture names
		 * @param {Number} count the number of items to create
		 * @param {Function} make a function that will return json data representing the object.
		 */
		make: function( types, count, make ) {
			// make all items
			var items = ($.fixture["~" + types[0]] = []);
			for ( var i = 0; i < (count); i++ ) {
				//call back provided make
				var item = make(i, items);

				if (!item.id ) {
					item.id = i;
				}
				items.push(item);
			}
			//set plural fixture for findAll
			$.fixture["-" + types[0]] = function( settings ) {

				//copy array of items
				var retArr = items.slice(0);

				//sort using order
				//order looks like ["age ASC","gender DESC"]
				$.each((settings.data.order || []).slice(0).reverse(), function( i, name ) {
					var split = name.split(" ");
					retArr = retArr.sort(function( a, b ) {
						if ( split[1].toUpperCase() !== "ASC" ) {
							return a[split[0]] < b[split[0]];
						}
						else {
							return a[split[0]] > b[split[0]];
						}
					});
				});

				//group is just like a sort
				$.each((settings.data.group || []).slice(0).reverse(), function( i, name ) {
					var split = name.split(" ");
					retArr = retArr.sort(function( a, b ) {
						return a[split[0]] > b[split[0]];
					});
				});


				var offset = parseInt(settings.data.offset, 10) || 0,
					limit = parseInt(settings.data.limit, 10) || (count - offset),
					i = 0;

				//filter results if someone added an attr like parentId
				for ( var param in settings.data ) {
					if ( param.indexOf("Id") != -1 || param.indexOf("_id") != -1 ) {
						while ( i < retArr.length ) {
							if ( settings.data[param] != retArr[i][param] ) {
								retArr.splice(i, 1);
							} else {
								i++;
							}
						}
					}
				}

				//return data spliced with limit and offset
				return [{
					"count": retArr.length,
					"limit": settings.data.limit,
					"offset": settings.data.offset,
					"data": retArr.slice(offset, offset + limit)
				}];
			};

			$.fixture["-" + types[1]] = function( settings ) {
				for ( var i = 0; i < (count); i++ ) {
					if ( settings.data.id == items[i].id ) {
						return [items[i]];
					}
				}
			};

		},
		/**
		 * Use $.fixture.xhr to create an object that looks like an xhr object. 
		 * <h3>Example</h3>
		 * The following example shows how the -restCreate fixture uses xhr to return 
		 * a simulated xhr object:
		 * @codestart
		 * "-restCreate" : function( settings, cbType ) {
		 *   switch(cbType){
		 *     case "success": 
		 *       return [
		 *         {id: parseInt(Math.random()*1000)}, 
		 *         "success", 
		 *         $.fixture.xhr()];
		 *     case "complete":
		 *       return [ 
		 *         $.fixture.xhr({
		 *           getResponseHeader: function() { 
		 *             return settings.url+"/"+parseInt(Math.random()*1000);
		 *           }
		 *         }),
		 *         "success"];
		 *   }
		 * }
		 * @codeend
		 * @param {Object} [xhr] properties that you want to overwrite
		 * @return {Object} an object that looks like a successful XHR object.
		 */
		xhr: function( xhr ) {
			return $.extend({}, {
				abort: $.noop,
				getAllResponseHeaders: function() {
					return "";
				},
				getResponseHeader: function() {
					return "";
				},
				open: $.noop,
				overrideMimeType: $.noop,
				readyState: 4,
				responseText: "",
				responseXML: null,
				send: $.noop,
				setRequestHeader: $.noop,
				status: 200,
				statusText: "OK"
			}, xhr);
		}
	});
	/**
	 * @attribute delay
	 * Sets the delay in milliseconds between an ajax request is made and
	 * the success and complete handlers are called.  This only sets
	 * functional fixtures.  By default, the delay is 200ms.
	 * @codestart
	 * steal('jquery/dom/fixtures').then(function(){
	 *   $.fixture.delay = 1000;
	 * })
	 * @codeend
	 */
	$.fixture.delay = 200;

	$.fixture["-handleFunction"] = function( settings ) {
		if ( typeof settings.fixture === "string" && $.fixture[settings.fixture] ) {
			settings.fixture = $.fixture[settings.fixture];
		}
		if ( typeof settings.fixture == "function" ) {
			setTimeout(function() {
				if ( settings.success ) {
					settings.success.apply(null, settings.fixture(settings, "success"));
				}
				if ( settings.complete ) {
					settings.complete.apply(null, settings.fixture(settings, "complete"));
				}
			}, $.fixture.delay);
			return true;
		}
		return false;
	};

	/**
	 *  @add jQuery
	 */
	// break
	$.
	/**
	 * Adds the fixture option to settings. If present, loads from fixture location instead
	 * of provided url.  This is useful for simulating ajax responses before the server is done.
	 * @param {Object} settings
	 */
	ajax = function( settings ) {
		var func = $.fixture;
		if (!settings.fixture ) {
			return ajax.apply($, arguments);
		}
		if ( $.fixture["-handleFunction"](settings) ) {
			return;
		}
		if ( typeof settings.fixture == "string" ) {
			var url = settings.fixture;
			if (/^\/\//.test(url) ) {
				url = steal.root.join(settings.fixture.substr(2));
			}
			
			settings.url = url;
			settings.data = null;
			settings.type = "GET";
			if (!settings.error ) {
				settings.error = function( xhr, error, message ) {
					throw "fixtures.js Error " + error + " " + message;
				};
			}
			return ajax(settings);

		}
		settings = jQuery.extend(true, settings, jQuery.extend(true, {}, jQuery.ajaxSettings, settings));

		settings.url = steal.root.join('test/fixtures/' + func(settings)); // convert settings
		settings.data = null;
		settings.type = 'GET';
		return ajax(settings);
	};

	$.extend($.ajax, ajax);

	$.
	/**
	 * Adds a fixture param.  
	 * @param {Object} url
	 * @param {Object} data
	 * @param {Object} callback
	 * @param {Object} type
	 * @param {Object} fixture
	 */
	get = function( url, data, callback, type, fixture ) {
		// shift arguments if data argument was ommited
		if ( jQuery.isFunction(data) ) {
			fixture = type;
			type = callback;
			callback = data;
			data = null;
		}

		return jQuery.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type,
			fixture: fixture
		});
	};

	$.
	/**
	 * Adds a fixture param.
	 * @param {Object} url
	 * @param {Object} data
	 * @param {Object} callback
	 * @param {Object} type
	 * @param {Object} fixture
	 */
	post = function( url, data, callback, type, fixture ) {
		if ( jQuery.isFunction(data) ) {
			fixture = type;
			type = callback;
			callback = data;
			data = {};
		}

		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type,
			fixture: fixture
		});
	};
})(jQuery);
