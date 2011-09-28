steal.loadedProductionCSS = true;
steal(
	'jmvcdoc/content',
	'jmvcdoc/nav',
	'jmvcdoc/search',
	'jquery/dom/route'
	/*,
	
	'jquery/controller/view',
	'jquery/lang/json', 
	'jquery/dom/cookie',
	'mxui/layout/positionable'*/
	).then(function() {
	var pageNameArr = window.location.href.match(/docs\/(.*)\.html/),
		pageName = pageNameArr && pageNameArr[1];
		
		if ( pageName && location.hash == "" ) {
			window.location.hash = "&who=" + pageName
		}
	$.route.ready(false)
		(":who",{who: "index"})
		("/search/:search");
	
		
	$('#nav').jmvcdoc_nav();
	$("#doc").jmvcdoc_content({clientState : $.route.data});
	$("#search").jmvcdoc_search({clientState : $.route.data});
	//Doc.location = steal.root.join("jmvc/docs/")
	
	
	
	$.route.ready(false);
	Doc.load(function(){
		$.route.ready(true);
	});
	
  })
/*
if ( typeof(COMMENTS_LOCATION) != "undefined" ) {
	steal.css("http://mediacdn.disqus.com/1066/build/themes/narcissus.css?1281560657&", 
	          "http://mediacdn.disqus.com/1066/styles/embed/thread.css?");
			  
	if ( window.location.protocol == "file:" || window.location.hostname == "localhost" ) { // development
		window.disqus_developer = 1
	}
}*/