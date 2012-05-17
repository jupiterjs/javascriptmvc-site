@page mvc Get Started with CanJS
@parent tutorials 3

[canjs CanJS] is DoneJS's Model-View-Controller (MVC) framework. Every part of CanJS can be used without every other part, making the library extremely lightweight. Its Construct, Model, View, and Control combined are only 7k minified and compressed, yet even they can be used independently. CanJS's independence  lets you start small and scale to meet the challenges of the most  complex applications on the web.

This tutorial covers __only__ CanJS's can.Construct, can.Model, can.view, and can.Control. The following describes each component:

  - [mvc.construct can.Construct] - Easy prototypal inheritance for JavaScript
  - [mvc.model can.Model] - Traditional model layer
  - [mvc.view can.View] - Client side template system
  - [mvc.view can.Control] - Widget factory

CanJS's naming conventions deviate slightly from the traditional [Model-View-Controller](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller#Concepts)  design pattern. can.Control is used to create traditional  view controls, like pagination buttons and list, as well as  traditional controllers, which coordinate between the  traditional views and models.

## Setup

DoneJS can be used as a single download that includes the entire framework.  But since  this chapter covers only the MVC parts, go to  the [download builder](http://donejs.com/builder.html), check Controller, Model,  and View's EJS templates and click download.

The download will come with minified and unminified versions of jQuery and the plugins you selected.  Load these with script tags in your page:

    <script type='text/javascript' src='jquery-1.6.1.js'></script>  
    <script type='text/javascript' src='canjs-1.0.custom.js'></script> 

Please continue to [mvc.construct can.Construct].
