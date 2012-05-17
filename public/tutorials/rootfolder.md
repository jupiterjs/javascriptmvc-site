@page rootfolder

The root folder is the folder where DoneJS is installed (the folder which has
funcunit, jquery, steal, documentjs, etc).  

Typically, the root folder should be a public folder that serves static content.

steal references files from the root folder.  Also, paths that begin with "//" also reference the root folder:

    steal('//foo/bar') // -> ROOTFOLDER/foo/bar
    can.view('//views/bar.ejs',{}) // uses ROOTFOLDER/views/bar.ejs
