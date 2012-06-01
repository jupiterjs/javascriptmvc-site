load('steal/rhino/rhino.js')

steal('steal/html/crawl', function(){
	steal.html.crawl("site/docs.html#!canjs", 
	{
		out: 'html',
		browser: 'phantomjs'
	})
})