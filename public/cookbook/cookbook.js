steal(
	'./cookbook.css',
	'./cookbook copy 2.css',
	'./cookbook copy 3.css',
	'./cookbook copy 4.css',
	'./cookbook copy 5.css',
	'./cookbook copy 6.css',
	'./cookbook copy 7.css',
	'./cookbook copy 8.css',
	'./cookbook copy 9.css',
	'./cookbook copy 10.css',
	'./cookbook copy 11.css',
	'./cookbook copy 12.css',
	'./cookbook copy 13.css',
	'./cookbook copy 14.css',
	'./cookbook copy 15.css',
	'./cookbook copy 16.css',
	'./cookbook copy 17.css',
	'./cookbook copy 18.css',
	'./cookbook copy 19.css',
	'./cookbook copy 20.css',
	'./cookbook copy 21.css',
	'./cookbook copy 22.css',
	'./cookbook copy 23.css',
	'./cookbook copy 24.css',
	'./cookbook copy 25.css',
	'./cookbook copy 26.css',
	'./cookbook copy 27.css',
	'./cookbook copy 28.css',
	'./cookbook copy 29.css',
	'./cookbook copy 30.css',
	'./cookbook copy 31.css',
	'./cookbook copy 32.css',
	'./cookbook copy 33.css',
	'./controllers/kitten.js')
	.then(function(){
		steal.then('./views/kitten.ejs').then(function(){
			$(document.body).kitten();
		})
		
	})