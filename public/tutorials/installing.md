@page installing Installing DoneJS
@parent tutorials 0

## Requirements

DoneJS requires [http://www.oracle.com/technetwork/java/javase/downloads/java-se-jdk-7-download-432154.html Java JRE 1.6] or greater for:

 - Compression (Google Closure)
 - Running [http://www.funcunit.com/ FuncUnit] tests with [http://seleniumhq.org/ Selenium]
 - Easy updating
 - Code Generators

But your backend server can be written in any language.  
Download [http://www.java.com/en/download/index.jsp Java here].

## Getting DoneJS

There are 2 ways to get DoneJS:

 - [http://donejs.com/builder.html Downloading]
 - Installing DoneJS with Git
 
We (and the [http://forum.donejs.com/ community]) would much prefer you to develop with git.  DoneJS is built 
around modular development so it fits in perfectly
with git development.  Plus we can trade improvements really easy. 


## Downloading

[http://donejs.com/builder.html Download] the latest DoneJS. 
Unzip the folder on your file system or web server.  
If you are using this on a webserver, 
unzip in a public folder where the server hosts static content.  
	
<div class='whisper'>PRO TIP: 
  Unzip these files as
  high in your apps folder structure as possible (i.e. don't
  put them under a donejs folder in your public directory).
</div>

## Installing DoneJS with Git.

DoneJS is comprised of several subprojects:

 - [CanJS](http://github.com/jupiterjs/canjs)
 - [jQuery++](http://github.com/jupiterjs/jquerypp)
 - [StealJS](http://github.com/jupiterjs/steal)
 - [DocumentJS](http://github.com/jupiterjs/documentjs)
 - [FuncUnit](http://github.com/jupiterjs/funcunit)
 - [CanUI](http://github.com/jupiterjs/canui)

You want to fork each project and add it as a submodule to your project 
in a public folder (where your server keeps static content).
If these words mean nothing to you, or you'd like more 
explanation, you might want to read [developwithgit Developing With Git].

Forking the repos looks like:

@codestart text
git submodule add git@github.com:_YOU_/steal.git public/steal
git submodule add git@github.com:_YOU_/canjs.git public/<b style='font-size: 14px;color: red'>can</b>
git submodule add git@github.com:_YOU_/documentjs.git public/documentjs
git submodule add git@github.com:_YOU_/funcunit.git public/funcunit
@codeend

Notice that the canjs repository is put in a <b style='font-size: 14px;color: red'>can</b> folder.  

After installing the repository, run:

@codestart
[WINDOWS] > steal\js steal\make.js

[Lin/Mac] > ./steal/js steal/make.js
@codeend

## Verifing the install

In your public (or static) folder, you should have something that looks like:

@codestart
static
  \documentjs - DocumentJS library
  \funcunit   - FuncUnit testing library
  \can        - CanJS library
  \steal      - compression and build system
  \js.bat     - Windows Rhino shortcut
  \js         - Mac/Linux Rhino shortcut
@codeend


Open a command line to that folder and run:

@codestart
[WINDOWS] > js

[Lin/Mac] > ./js
@codeend

This starts the [http://www.mozilla.org/rhino/ Rhino JS engine].  Type <code>quit()</code> to exit.

## Updating DoneJS

We are constantly improving DoneJS.  If you're using git, you can
just pull changes.  Otherwise, to get the latest, most
error free code, in a console, type:

@codestart text
C:\workspace\Cookbook>js documentjs\update
C:\workspace\Cookbook>js funcunit\update
C:\workspace\Cookbook>js canjs\update
C:\workspace\Cookbook>js steal\update
@codeend
<div class='whisper'>
	P.S. If you are using linux/mac you
	want to use <code>./js</code> and change <code>\</code> 
	to <code>/</code>.
</div>
