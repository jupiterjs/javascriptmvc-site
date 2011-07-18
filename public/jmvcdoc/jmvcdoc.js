steal.loadedProductionCSS = true;
steal(
	'jmvcdoc/content',
	'jmvcdoc/nav',
	'jmvcdoc/search',
	'jquery/lang/deparam'
	/*,
	
	'jquery/controller/view',
	'jquery/lang/json', 
	'jquery/lang/deparam',
	'jquery/dom/cookie',
	'mxui/layout/positionable'*/
	).then(function() {
	var pageNameArr = window.location.href.match(/docs\/(.*)\.html/),
		pageName = pageNameArr && pageNameArr[1];
		
		if ( pageName && location.hash == "" ) {
			window.location.hash = "&who=" + pageName
		}
	
	var clientState = new $.Observe({});
				
	$('#nav').jmvcdoc_nav({clientState : clientState});
	$("#doc").jmvcdoc_content({clientState : clientState});
	$("#search").jmvcdoc_search({clientState : clientState});
	//Doc.location = steal.root.join("jmvc/docs/")
	
	
	
	Doc.load(function(){
		
		var hashchange = function(){
			var p = window.location.hash.substr(2);
			var params = $.String.deparam(p || "who=index");
			
			clientState.merge(params, true);
			
		}

		$(window).bind('hashchange', hashchange)
		
		hashchange();
	});
	
	$("#doc").jmvcdoc_content();
	
	
  })
/*
if ( typeof(COMMENTS_LOCATION) != "undefined" ) {
	steal.css("http://mediacdn.disqus.com/1066/build/themes/narcissus.css?1281560657&", 
	          "http://mediacdn.disqus.com/1066/styles/embed/thread.css?");
			  
	if ( window.location.protocol == "file:" || window.location.hostname == "localhost" ) { // development
		window.disqus_developer = 1
	}
}*/