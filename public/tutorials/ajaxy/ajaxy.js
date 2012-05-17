steal('can/control',
	  'can/util/hashchange.js',
	  'steal/html',function(){
	
	can.Control('Ajaxy',{
		init : function(){
			this.updateContent()
		},
		"{window} hashchange" : function(){
			this.updateContent();
		},
		updateContent : function(){
			var hash = window.location.hash.substr(2),
				url = "fixtures/"+(hash || "videos")+".html";
				
			steal.html.wait();
			
			$.get(url, {}, this.callback('replaceContent'),"text" )
		},
		replaceContent : function(html){
			this.element.html(html);
			steal.html.ready();
		}
	})
	
	new Ajaxy('#content');
})
