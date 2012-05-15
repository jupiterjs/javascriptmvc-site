@page todo Todo
@parent examples 2

## Introduction

In this article we will be learning the basics of [DoneJS](http://DoneJS.com/) and the [Model-View-Controller pattern](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) by installing and walking through a simple To-do list manager. The separation of the application's core logic from its user interface behavior is the hallmark of MVC. By working through this exercise you will understand how DoneJS's particular flavor of this pattern enables you to create more flexible and maintainable browser-based applications.

Let's get started!

## Setup

First, clone the application from our [repository](http://github.com/jupiterjs/todo) at GitHub, and initialize all the necessary submodules. The following commands will get you up and running:

    $ git clone https://github.com/jupiterjs/todo
    $ cd todo
    $ git submodule update --init

This bundle now contains everything you need to run the application locally. Since there is no server-side dependency, you can now open the `todo/todo.html` file in your browser and see it in action.

@image tutorials/images/todos.png

## Structure

Now let's take a look at the anatomy of our application:

    /todo [top-level, the GitHub repository]
      /can
      /steal
      /funcunit
      /todo
        /scripts
        /test
        /styles
        funcunit.html
        qunit.html
        todo.html
        model.js
        todo.js
        ...

Breaking it down:

* The `can` folder is where the [CanJS](http://github.com/jupiterjs/canjs) library lives. DoneJS consists of powerful abstractions like [can.Construct], [can.Model], [can.Control], [can.View] and [can.route]
* The `steal` folder houses the [Steal](http://github.com/jupiterjs/steal) dependency management system, which is what makes it possible to keep your project organized during development, and compact and fast in production. Steal has two main responsibilities: As a JavaScript library, it facilitates on-demand loading of any resources (scripts, stylesheets, templates, or even user-defined content) your application requires. As a command line utility, it takes care of bundling, compressing, and optimizing your application for deployment.
* The [FuncUnit](http://github.com/jupiterjs/funcunit) testing framework lives in the `funcunit` folder -- think jQuery's excellent Qunit framework plus Selenium and headless (Env.js) support. Basically, Qunit on steroids.
* Lastly, our application files will live in the `todo` folder.

## MVC in JavaScript


MVC is a well-established architectural pattern in software engineering. Without going into too much detail, it states that there should be a clear separation of concerns between the part of the system that represents the application's core logic and state (Model), the part that renders the user interface (View), and the part that coordinates between the two (Controller). Since our application consists of only one model we can keep it in `model.js` right in the *todo* folder. The `views` folder contains our only view and `todo.js` is responsible for defining and instantiating the control. The diagram below shows how we've broken our application out into model, view, and controller layers:

@image tutorials/images/todo_arch.png

### Dependencies

If you look at `todo.js` the first thing you'll notice is that all the code is wrapped in a call to the `steal` function:

	steal('can/control',
		'can/view/ejs',
		'./model.js',
		'./styles/base.css',
		'./styles/todo.css',
		function() { /* ... */
	});

In fact, this is true of every JavaScript file in a DoneJS application: we use `steal` to state our dependencies up-front, which tells the framework what libraries, plugins, stylesheets, etc. we need to load before we can begin. Typically, the final argument to `steal` will be a callback function, which will be executed when all the other dependencies (and _their_ dependencies, and so on...) have been loaded and executed as well. No more worrying whether you forgot any `<script>` tags, or whether you've got them in the right order!

> For our application, we can see that our script requires the model defined in `model.js`, [can.Control], and our application's stylesheets.

### Model

The model will be located in `model.js` and will load its single dependency:

	steal('can/model', function() {

All models in CanJS extend the [can.Model] construct:

    can.Model('Todo', { /* static properties */ }, { /* instance/prototype properties */ })

> If you need a quick refresher on how to use CanJS's construct, see [can.Construct].

In the case of our application, the `Todo` model represents a single To-do item. Its job is simply to know about the name and completed state of the item, how to persist that information, and how to notify the rest of the application when the item is created, updated, or destroyed.

Since we want our To-do list manager to function without a server, we need some form of persistence in the browser. Sure, cookies are nice, but we're looking to the future -- so lets take advantage of HTML5's LocalStorage! We'll define a `Todo` model class with a static (i.e. shared across all instances), state-of-the-art HTML5 storage mechanism (don't worry too much about what this does). The `localStore` method accepts a callback function which will be invoked with an array of `Todo` object _properties_. All of our CRUD operations will use this helper in order to persist `Todo` items in the system:

    can.Model('Todo', {

        // Implement local storage handling
        localStore: function(cb){
            var name = 'todos-donejs',
                data = JSON.parse( window.localStorage[name] || (window.localStorage[name] = '[]') ),
                res = cb.call(this, data);
            if(res !== false){
                can.each(data, function(todo, i) {
                    delete todo.editing;
                });
                window.localStorage[name] = JSON.stringify(data);
            }
        },


Given the `localStorage` helper we've created, we can now define a finder method that returns all `Todos` that the application knows about. Inside the callback, we will call the static [can.Model.static.models models] function which takes an array of plain objects and converts them into a [can.Model.List] of actual model instances. All Model functions have to return a [can.Deferred] that resolves with the actual data.

	findAll: function(params){
		var def = new can.Deferred();
		this.localStore(function(todos){
			// .models converts an array of objects into an array of Model instances
			def.resolve({ data: this.models(todos) });
		})
		return def;
	},

> _Tip_: *findAll* is static, so `this` simply refers to the `Todo` construct itself. Writing `Todo.models` would have the same effect, but this way our code won't break if we ever decide to rename it to something else.

The static `create` and `update` methods may be called directly, but are most often invoked automatically by the model layer when an instance is saved. The `create` method expects an `attrs` argument to describe the properties of the To-do item we want to create:

    create: function(attrs){
        var def = new can.Deferred();
        this.localStore(function(todos){
            attrs.id = attrs.id || parseInt(100000 *Math.random());
            todos.push(attrs);
        });
        def.resolve({id : attrs.id});
        return def
    },

`Update` is similar to `create`, but rather than adding a new object to local storage, an existing object is looked up and modified in place with [can.extend]:

	update: function(id, attrs){
		var def = new can.Deferred();
		this.localStore(function(todos){
			for (var i = 0; i < todos.length; i++) {
				if (todos[i].id === id) {
					var todo = todos[i];
					break;
				}
			}
			can.extend(todo, attrs);
		});
		def.resolve({});
		return def
	},

Last we want to be able to delete Todos by implementing a `destroy` method:

	destroy: function(id){
		var def = new can.Deferred();
		this.localStore(function(todos){
			for (var i = 0; i < todos.length; i++) {
				if (todos[i].id === id) {
					todos.splice(i, 1);
					break;
				}
			}
			def.resolve({});
		});
		return def
	}

### Model Lists

One of the really great features of CanJS is the [can.Model.List Model.List]. A Model.List gives us a way to manage a collection of models as an aggregate, and (the cool part) be able to respond to and trigger events at the collection level. For our present purposes, we'd like to have a list of `Todo` items that can tell us which ones have been marked as completed, how many are left, if all of the Todos are marked as complete and the possibility to get an array of all completed Todos.

	can.Model.List('Todo.List', {
		completed: function() {
			// Ensure this triggers on length change
			this.attr('length');

			var completed = 0;
			this.each(function(todo) {
				completed += todo.attr('complete') ? 1 : 0
			});
			return completed;
		},

		getCompleted : function() {
			var completed = [];
			this.each(function(todo) {
				if(todo.attr('complete')) {
					completed.push(todo)
				}
			});
			return completed;
		},

		remaining: function() {
			return this.attr('length') - this.completed();
		},

		allComplete: function() {
			return this.attr('length') === this.completed();
		}
	});

> The `grep` method is similar to `jQuery.grep` in that it applies a filter to the list and returns a new list of all items for which the filter is true.

We'll see how lists really make our lives easier when it is time to do our view rendering below.

### Controller and View

Controls in CanJS get their mojo from [can.Control]. Basically, you can think of Control as a factory to build widgets: its job is to attach itself to a DOM element, and organize event handlers using event delegation.

Unlike models, controllers and views are inherently tied to the application's user interface, so before we dive into the JavaScript code, let's take a quick look at the basic HTML structure of the application:

	<div id="todoapp">
		<header>
			<h1>Todos</h1>
			<input id="new-todo" type="text" placeholder="What needs to be done?">
		</header>
	</div>
	<div id="instructions">
		Double-click to edit a todo.
	</div>
	<div id="credits">
		Created by <a href="http://bitovi.com/">Bitovi</a>.
	</div>

Not much to it! One wrapper element -- that's the element we're eventually going to attach the controller to -- and inside that wrapper, the following items:

* A title ("Todos")
* A text box where we're going to add new To-do items
* And a container for quick instructions and credits

With this document structure in mind, let's create our controller:

	can.Control('Todos', {

		// Initialize the Todos list
		init : function(){
			// Clear the new todo field
			$('#new-todo').val('').focus();

			// Render the Todos
			this.element.append(can.view('//todo/views/todo.ejs', {
				todos: this.options.todos
			}));
		},

The `init` method will be called when we initialize the control with `new Todo('selector', { todos : todolist })`. Upon initialization, we want to clear the text box and then "focus" it (that is, place the mouse cursor in it) and render our view with the `Todo.List` that the control got passed as the options during initialization and that are now available in `this.options.todos`.

__The view:__

The controls `init` method renders `//todo/views/todo.ejs` using [can.view] and [can.EJS EJS] as the templating engine. This is how `todo.ejs` looks like:

	<section id="main" class="<%= todos.attr("length") > 0 ? "show" : "" %>">
		<input id="toggle-all" type="checkbox" <%= todos.allComplete() ? "checked" : "" %>>
		<label for="toggle-all">Mark all as complete</label>
		<ul id="todo-list">
			<% list(todos, function( todo ) { %>
				<li class="todo
					<%= todo.attr("complete") ? "done" : "" %>
					<%= todo.attr("editing") ? "editing" : "" %>"
					<%= (el)-> el.data('todo', todo) %>>
					<div class="view">
						<input class="toggle" type="checkbox" <%= todo.attr("complete") ? "checked" : "" %>>
						<label><%= todo.attr("text") %></label>
						<a class="destroy"></a>
					</div>
					<input class="edit" type="text" value="<%= todo.attr("text") %>">
				</li>
			<% }) %>
		</ul>
	</section>
	<footer id="stats" class="<%= todos.attr("length") > 0 ? "show" : "" %>">
		<a id="clear-completed">Clear <%= todos.completed() %>
			completed item<%= todos.completed() == 1 ? "" : "s" %></a>
		<div id="todo-count"><span><%= todos.remaining() %></span>
			item<%= todos.remaining() == 1 ? "" : "s" %> left</div>
	</footer>

It is basically HTML with some JavaScript embedded in <% %> and <%= %> magic tags. The view makes use of EJS awesome *live binding* feature. The first part is an HTML 5 `<section>` that will be showing the Todo list. `<%= todos.attr("length") > 0 ? "show" : "" %>` will listen to whenever the *length* attribute of the `Model.List` changes and add or remove the *show* class. Whenever all of the Todos in the list are marked as completed `<input id="toggle-all" type="checkbox" <%= todos.allComplete() ? "checked" : "" %>>` will be checked.

`<% list(todos, function( todo ) { %>` now iterates through all the todos in the list and does a couple of things:

* Live bind to the *complete* and *editing* attributes adding appropriate classes to the list element
* Attach the current Todo model as data to the list element using `<%= (el)-> el.data('todo', todo) %>>`
* Add a checkbox to mark the Todo as *complete*
* Add a label bound to *text* attribute with `<label><%= todo.attr("text") %></label>`
* Add an input field attached to the *text* attribute which is hidden unless the Todo is in editing mode

In the `<footer>`:

* A link that allows us to remove all Todos marked as completed
* A div that shows the number of incomplete Todos

Keep in mind that thanks to EJS live binding everything will be updated as soon as the Model the attributes are bound to changes.  There is no need to render the view again. The [can.EJS.Helpers.prototype.list list helper] will also make sure that the list will stay up to date whenever our `Todo.List` changes (e.g. when removing or adding a Todo).

__Creating Todos__

Lets got back to the control: The first thing we want to do is to create new Todos. For that we will listen to the keyup event on the input field when the enter key (key code 13) was pressed and create a new `Todo` model with the input field value and marked as incomplete. When saving was successfull, empty the input field:

	// Listen for when a new Todo has been entered
	'#new-todo keyup' : function(el, ev){
		if(ev.keyCode == 13){
			new Todo({
				text : el.val(),
				complete : false
			}).save(function() {
				el.val('');
			});
		}
	},

The next step is to update the `Todo.List` that was passed in the controller options with the new Todo. For that we will listen to the *created* event that fires when a new Todo model has been saved sucessfully:

	// Handle a newly created Todo
	'{Todo} created' : function(list, ev, item){
		this.options.todos.push(item);
	},

These three lines of code are everything that needs to be done for a new Todo to show up in the list.

__Deleting Todos__

Deleting a Todo is even easier. We'll just listen to a click on the element with the *destroy* class and then fetch the Model from the data of the list element (remember, it has been added in the `todos.ejs` view using `<%= (el)-> el.data('todo', todo) %>>`):

	// Listen for a removed Todo
	'.todo .destroy click' : function(el){
		el.closest('.todo').data('todo').destroy();
	},

The magic is that [can.Model.List] will automatically remove the deleted model which in turn will update your view right away. So nothing else to do here, too.

This also makes it easy to add the functionality to delete all completed Todos. Just get the array of complete Todos from our Todo.List and destroy each one:

		// Listen for removing all completed Todos
		'#clear-completed click' : function() {
			can.each(this.options.todos.getCompleted(), function(todo) {
				todo.destroy();
			});
		},

__Editing Todos__

For editing a Todo we want to be able to double click on the text and have it show an inline input field. The field will show up by adding the *editing* class to the Todo list element. Since we bound to the *editing* attribute in the view with `<%= todo.attr("editing") ? "editing" : "" %>"` the class will be added when it changes to true. So on a doubleclick on the Todo the control sets the editing attribute, saves the Todo to the localStorage and focuses the editing input field:

	// Listen for editing a Todo
	'.todo dblclick' : function(el, ev) {
		el.data('todo').attr('editing', true).save(function() {
			el.children('.edit').focus().select();
		});
	},

The Todo should be updated when pressing the enter key and when leaving the input field. We create a helper `updateTodo` which will be called in both cases:

	// Update a todo
    updateTodo: function(el) {
        el.closest('.todo').data('todo')
            .attr({
                editing: false,
                text: el.val()
            }).save();
    },

    // Listen for an edited Todo
    '.todo .edit keyup' : function(el, ev){
        if(ev.keyCode == 13){
            this.updateTodo(el);
        }
    },
    '.todo .edit focusout' : function(el, ev) {
        this.updateTodo(el);
    },

Again, the view will be updated as soon as any attribute changes.

__Completing Todos__

Similar to editing Todos we will just listen to a click on the toggle button, mark the Todo from that list element as completed and save it. For marking all Todos

    // Listen for the toggled completion of a Todo
    '.todo .toggle click' : function(el, ev) {
        el.closest('.todo').data('todo')
            .attr('complete', el.is(':checked'))
            .save();
    },

    // Listen for toggle all completed Todos
    '#toggle-all click' : function(el, ev) {
        var toggle = el.prop('checked');
        can.each(this.options.todos, function(todo) {
            todo.attr('complete', toggle).save();
        });
    },

## That's It!

DoneJS enables you to write even the simplest application **the right way** from the start. With a Model that's completely independent from any knowledge of user interface behavior, and a Controller that's all ready to scale up to the complexities of modern Web experiences, you won't find yourself rewriting your app over and over again to deliver the goods.
