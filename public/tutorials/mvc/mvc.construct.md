@page mvc.construct Construct
@parent mvc 0

Can's Control and Model inherit from its Class helper - [Can.Construct]. To create a class, call `can.Construct([NAME, classProperties, ] instanceProperties])`.

    can.Construct("Animal",{
      breathe : function(){
         console.log('breathe'); 
      }
    });

In the example above, instances of Animal have a `breathe()` method. We can create a new `Animal` instance and call `breathe()` on it like:

    var man = new Animal();
    man.breathe();

If you want to extend the construct, simply call the the base construct with the sub-class's name and properties:

    Animal("Dog",{
      wag : function(){
        console.log('wag');
      }
    })

    var dog = new Dog;
    dog.wag();
    dog.breathe();

### Instantiation

When a new construct instance is created, it calls the class's `init` method with the arguments passed to the constructor function:

    can.Construct('Person',{
      init : function(name){
        this.name = name;
      },
      speak : function(){
        return "I am "+this.name+".";
      }
    });
    
    var payal = new Person("Payal");
    assertEqual( payal.speak() ,  'I am Payal.' );

### Calling base methods

Call base methods either by calling [apply](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/Apply)
on the prototype method:

    Person("ClassyPerson", {
      speak : function(){
        return "Salutations, " + Person.prototype.speak.apply(this, arguments);
      }
    });

Or when using the [can.Construct.super] plugin with <code>this._super</code>:

    Person("ClassyPerson", {
      speak : function(){
        return "Salutations, "+this._super();
      }
    });
    
    var fancypants = new ClassyPerson("Mr. Fancy");
    assertEquals( fancypants.speak() , 'Salutations, I am Mr. Fancy.')

### Proxies

Use the [can.Construct.proxy] plugin to create a function that has 'this' set appropriately (similar to [jQuery.proxy](http://api.jquery.com/jQuery.proxy/)). The following creates a clicky class that counts how many times it was clicked:

    can.Construct("Clicky",{
      init : function(){
        this.clickCount = 0;
      },
      clicked: function(){
        this.clickCount++;
      },
      listen: function(el){
        el.click( this.proxy('clicked') );
      }
    })
    
    var clicky = new Clicky();
    clicky.listen( $('#foo') );
    clicky.listen( $('#bar') ) ;

### Static Inheritance 

Construct lets you define inheritable static properties and methods.  The following allows us to retrieve a person instance from the server by calling <code>Person.findOne(ID, success(person) )</code>.  Success is called back with an instance of Person, which has the <code>speak</code> method.

    can.Construct("Person",{
      findOne : function(id, success){
        can.ajax({
            url : '/person/'+id,
            method : 'GET'
		}).done(function(attrs){
          success( new Person( attrs ) );
        })
      }
    },{
      init : function(attrs){
        can.extend(this, attrs)
      },
      speak : function(){
        return "I am "+this.name+".";
      }
    })

    Person.findOne(5, function(person){
      assertEqual( person.speak(), "I am Payal." );
    })

### Introspection

Construct provides namespacing and access to the name of the class and namespace object:

    can.Construct("Bitovi.Person");

    Bitovi.Person.shortName; //-> 'Person'
    Bitovi.Person.fullName;  //-> 'Bitovi.Person'
    Bitovi.Person.namespace; //-> Bitovi
    
    var person = new Bitovi.Person();
    
    person.constructor.shortName; //-> 'Person'

### Model example

Putting it all together, we can make a basic ORM-style model layer.  Just by inheriting from Model, we can request data from REST services and get it back wrapped in instances of the inheriting Model.

    can.Construct("Model",{
      findOne : function(id, success){
        can.ajax({
            url : '/'+this.fullName.toLowerCase()+'/'+id,
            method : 'GET'
		}).done(this.proxy(function(attrs){
         success( new this( attrs ) );
      })
      }
    },{
      init : function(attrs){
        $.extend(this, attrs)
      }
    })

    Model("Person",{
      speak : function(){
        return "I am "+this.name+".";
      }
    });

    Person.findOne(5, function(person){
      alert( person.speak() );
    });

    Model("Task")

    Task.findOne(7,function(task){
      alert(task.name);
    })
    

This is similar to how CanJS's model layer works. Please continue to [mvc.model Model].