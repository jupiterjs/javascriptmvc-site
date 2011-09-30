// load('my_app/scripts/crawl.js')

load('steal/rhino/rhino.js')

steal('steal/html/crawl', function(){
  steal.html.crawl("my_app/my_app.html","my_app/out")
});
