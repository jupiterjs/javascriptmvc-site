if (!Array.prototype.reduce)
{
  Array.prototype.reduce = function(fun /*, initial*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    // no value to return if no initial value and an empty array
    if (len == 0 && arguments.length == 1)
      throw new TypeError();

    var i = 0;
    if (arguments.length >= 2)
    {
      var rv = arguments[1];
    }
    else
    {
      do
      {
        if (i in this)
        {
          rv = this[i++];
          break;
        }

        // if array contains no values, no initial value to return
        if (++i >= len)
          throw new TypeError();
      }
      while (true);
    }

    for (; i < len; i++)
    {
      if (i in this)
        rv = fun.call(null, rv, this[i], i, this);
    }

    return rv;
  };
}

var filePath, file;
// rhino
print('ONE');
if(typeof require === "undefined"){
	// load require
	load("steal/build/scripts/uglify/require.js");
	filePath = _args[0];
	file = readFile(filePath);
	var uglify = require("./steal/build/scripts/uglify/compress");
	print(filePath);
	var compressed = uglify(file);
	print(compressed)
	// java.lang.System.out.println(compressed);
}
// node
else {
	var uglify = require("./compress");
	var args = JSP.slice(process.argv, 2);
	filePath = args[0];
	print = function(){
		process.stdout.write.apply(process.stdout, arguments);
	}
	var fs = require("fs");
    fs.readFile(filePath, "utf8", function(err, text){
        if (err) throw err;
        file = text;
		// print(uglify(file));
		uglify(file);
    });	
}
