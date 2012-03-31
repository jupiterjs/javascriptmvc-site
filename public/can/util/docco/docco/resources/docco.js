(function() {

	var h2s = document.getElementsByTagName("h2"),
		lis = [],
		len = h2s.length,
		text,
		parent,
		ul;

	while ( len-- ) {
		text = h2s[ len ].innerHTML;
		parent = h2s[ len ].parentNode.parentNode;
		lis.unshift( "<li><a href=\"#" + parent.id + "\">" + text + "</a></li>" );
	}

	ul = document.createElement("ul");
	ul.innerHTML = lis.join("");
	document.getElementsByTagName("h1")[0].parentNode.appendChild( ul );

}());

