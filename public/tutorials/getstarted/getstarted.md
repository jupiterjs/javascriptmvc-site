@page getstarted Get Started with DoneJS
@parent tutorials 2

This guide introduces the most important aspects of DoneJS by 
creating a simple cookbook application.

<h2 class='spaced'>Basics</h2>

Before jumping in, there are some things you should know:

### Purpose

DoneJS is for client side JavaScript development.  DoneJS is our way
of making quality, maintainable applications in the shortest amount of time.

### Sub Projects

DoneJS is comprised of 6 sub projects:

  - [DocumentJS] - A documentation engine
  - [FuncUnit] - A web testing framework
  - [canjs CanJS] - CanJS framework.
  - [stealjs StealJS] - A code manager : dependency management, code cleaning, building, etc.
  - [jquerypp jQuery++] - jQuery extensions
  - [canui CanUI] - User interface components build with CanJS and jQuery++

### Plugins 

Sub-projects are futher broken down into plugins.  Just [steal] the ones you need.  Plugins load 
their own dependencies and won't load duplicate files.  It looks like:

    steal('can/model',
          'can/view/ejs',
          'can/control',
          function($){
          ...
          });


<div class='whisper'>
  P.S. <code>steal('can/util')</code> adds <code>can/util/util.js</code>
 to your project. </div>

## License

DoneJS is MIT with the following exceptions:

 - [http://www.mozilla.org/rhino/ Rhino] - JS command line ([http://www.mozilla.org/MPL/ MPL] 1.1)
 - [http://seleniumhq.org/ Selenium] - Browser Automation ([http://www.apache.org/licenses/LICENSE-2.0 Apache 2])

These exceptions, although permissive licenses themselves, are not linked in your final production build.

## Installing DoneJS

Before continuing, make sure you have [installing installed DoneJS].  Once you
have installed DoneJS, continue to [creating Creating Cookbook].
