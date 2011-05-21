steal('popcorn.full').then(function(){
	Popcorn.p.bind = Popcorn.p.listen;
	Popcorn.p.unbind = Popcorn.p.unlisten;
})
