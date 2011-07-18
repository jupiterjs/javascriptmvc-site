steal('./popcorn.full.js').then(function(){
	Popcorn.p.bind = Popcorn.p.listen;
	Popcorn.p.unbind = Popcorn.p.unlisten;
})
