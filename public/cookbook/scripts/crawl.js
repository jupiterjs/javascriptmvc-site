// load('cookbook/scripts/crawl.js')

load('steal/rhino/rhino.js')

steal('steal/html/crawl', function(){
  steal.html.crawl("cookbook/cookbook.html","cookbook/out")
});
