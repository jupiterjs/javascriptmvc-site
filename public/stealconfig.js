steal.config({
	map: {
		"*": {
			"can/util/util.js": "can/util/jquery/jquery.js",
			"jquery/jquery.js" : "jquery"
		}
	},
	paths: {
		"jquery": "can/util/jquery/jquery.1.8.2.js"
	},
	shim : {
		jquery: {
			exports: "jQuery"
		}
	},
	shim : {
		jquery: {
			exports: "jQuery"
		}
	},
	ext: {
		js: "js",
		css: "css",
		less: "steal/less/less.js",
		coffee: "steal/coffee/coffee.js",
		ejs: "can/view/ejs/ejs.js"
	}
});
