steal.loadedProductionCSS = true;

steal('steal/less')
	.then('site/stylesheets/site.less')
	.then('jquery/controller', 'jquery/view/ejs')
	.then('//site/views/blog.ejs', function(){

		jQuery.Controller.extend('Feed',
			/* @Static */
			{
			},
			/* @Prototype */
			{
				date_template: '{day}, {date} {month} {year}',
				days : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
				months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				linkify : function(text){
					var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
					return text.replace(exp,"<a href='$1'>$1</a>");
				},
				// gets passed strings like "Jan"
				getMonth: function(month_string){
					for(var i=0; i<this.months.length; i++){
						if(this.months[i] == month_string){
							return i;
						}
					}
					return 0;
				},
				formatDate : function(date_string){
					var date = new Date(date_string);
					"Thu, 13 Jan 2011 11:59:47 -0800"
					return can.sub(this.date_template, {
						day: this.days[date.getDay()],
						date: date.getDate(),
						month: this.months[date.getMonth()],
						year: date.getFullYear()
					});
				}
			});


		Feed.extend('TwitterFeed',
			/* @Static */
			{
			},
			/* @Prototype */
			{
				template: "<li><p>{tweet}</p><div class='date'>{date}</div></li>",
				init : function(){
					var twitterUrl = 'http://twitter.com/status/user_timeline/javascriptmvc.json?count=30';
					$.ajax({
						url: twitterUrl,
						dataType: 'jsonp',
						success: this.proxy('insertTwitterFeed')
					});
				},
				insertTwitterFeed : function(data){
					var tweets = [];
					for(var i = 0, ii = data.length; i < ii; i++){ //Filter out direct replies
						var tweet = data[i];
						tweet.date = this.getDate(tweet.created_at)
						if(tweet.text.charAt(0) != '@' && tweets.length < 6){
							var formattedDate = this.formatDate(tweet.date);
							tweets.push(can.sub(this.template, {tweet: this.linkify(tweet.text), date: formattedDate}));
						}
					}
					this.element.html('<ul>' + tweets.join('') + '</ul>');
				},
				linkify : function(text){
					var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
					return text.replace(exp,"<a href='$1'>$1</a>");
				},
				// receives a date like "Thu Jan 13 05:33:12 +0000 2011"
				getDate : function(date_string){
					var dateMatch = date_string.match(/\w+\s+(\w+)\s+(\d+).*\s+(\d+)$/),
						date = new Date(
							parseInt(dateMatch[3], 10),
							this.getMonth(dateMatch[1]),
							parseInt(dateMatch[2], 10)
						)
					return date;
				}
			});

		Feed.extend('ForumFeed',
			/* @Static */
			{
				loadData : function(data){
					$('#forum-feed').data("controls")[0].insertForumFeed(data.value.items);
				}
			},
			/* @Prototype */
			{
				template : '<li><a href="{href}"><strong>{title}</strong>{author} - {date}</a></li>',
				init : function(){
					var forumUrl = 'http://pipes.yahoo.com/pipes/pipe.run?_id=a6c6d9c200823b78d02087c6ea16b9ad&_render=json&_callback=ForumFeed.loadData';
					$.ajax({
						url: forumUrl,
						dataType: 'script'
					});
				},
				insertForumFeed : function(data){
					var html = [], titles = [], title, d;
					for(var i = 0, ii = data.length; i < 6 && i < data.length; i++){
						title = data[i].title.replace(/^Re\s\:\s/, "");
						if($.inArray(title, titles) == -1){
							titles.push(title);
							d = {
								title  : title,
								author : data[i]['dc:creator'],
								date   : this.formatDate(data[i].pubDate),
								href   : data[i].link
							}
							html.push(can.sub(this.template, d));
						}
					}
					if(html.length > 0){
						this.element.find('ul').html(html.join(''));
					}
				},
				// "Thu, 13 Jan 2011 11:59:47 -0800" - forum
				// receives a date like "Thu Jan 13 05:33:12 +0000 2011"
				// receives a date like "Thu, 13 Jan 2011 11:59:47 -0800" - forum
				getDate : function(date_string){
					var dateMatch = date_string.match(/\w+\s+(\d+)\s+(\w+)\s+(\d)+/),
						date = new Date(
							parseInt(dateMatch[3], 10),
							this.getMonth(dateMatch[2]),
							parseInt(dateMatch[1], 10)
						)
					return date;
				}
			});

		Feed.extend('BlogFeed',
			/* @Static */
			{
				loadData : function(data){
					$('#blog').data("controls")[0].insertBlogFeed(data.responseData.feed.entries);
				}
			},
			/* @Prototype */
			{
				init : function(){
					var forumUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://bitovi.com/blog/tag/javascriptmvc.rss&v=1.0&callback=BlogFeed.loadData&num=10'
					$.ajax({
						url: forumUrl,
						dataType: 'script'
					});
				},
				formatDate : function(date_string){
					var parts = date_string.match(/\/blog\/(\d+)\/(\d+)/);
					return {
						// TODO the date doesn't come back in this feed, add it
						date: parseInt(parts[2], 10)+1,
						month: parseInt(parts[2], 10),
						year: parseInt(parts[1], 10)
					};
				},
				insertBlogFeed : function(data){
					var html = [], d, date, li, url;
					for(var i = 0, ii = data.length; i < 10 && i < data.length; i++){
						date = this.formatDate(data[i].link);
						d = {
							title  : data[i].title,
							month  : date.month,
							date   : date.date,
							year   : date.year,
							body   : data[i].contentSnippet,
							url	   : data[i].link
						}
						li = $.View("//site/views/blog.ejs", d);
						this.element.append(li);
					}
				}
			});

		$('#twitter-feed').twitter_feed();
		$('#forum-feed').forum_feed();
		$('#blog').blog_feed();

	});