steal.has("mxui/nav/accordion/accordion.js");
steal("jquery/controller","jquery/dom/dimensions","jquery/event/drag","jquery/event/resize",function(e){e.Controller("Mxui.Nav.Accordion",{defaults:{title:"h3",duration:"fast",activeClassName:"ui-state-active",hoverClassName:"ui-state-hover",activateFirstByDefault:!0,clickToActivate:!0},listensTo:["insert","resize"]},{init:function(){var a=this.options.title,b=this.element.children().each(function(){var b=e(this);b.is(a)?b.addClass("ui-helper-reset ui-state-default"):b.hide()});this.options.activateFirstByDefault&&
this.activate(b.eq(0));this.element.css("overflow","hidden")},currentContent:function(){return this.element.children(":visible").not(this.options.title)},setHeight:function(a){var a=(a||this.element.children()).filter(this.options.title),b=0,c=this.currentContent();c.height("");a&&0<a.length&&(b=this.calculateRemainder(a));50<b&&c.outerHeight(b)},activate:function(a,b){var c=a.next();this.current=a;c.is(this.options.title)||(c.triggerHandler("show",b),c.show());a.addClass(this.options.activeClassName);
this.setHeight()},"{title} click":function(a,b){this.options.clickToActivate&&this.expand.apply(this,arguments)},"{title} activate":function(){this.expand.apply(this,arguments)},expand:function(a){var b=a.next();if(!this.current||b.is(this.options.title))this.current&&this.current.removeClass(this.options.activeClassName),this.activate(a,arguments);else if(a[0]===this.current[0])a.addClass(this.options.activeClassName);else{var c=this.calculateRemainder(null,a),f=this.element.children(":visible").not(this.options.title),
d=a.next().show().height(0).trigger("show",arguments),b=this.current;d.find(".activated").removeClass("activated selected");b.removeClass(this.options.activeClassName);a.addClass(this.options.activeClassName);var g=f[0].style.overflow,h=d[0].style.overflow;f.css("overflow","hidden");d.css("overflow","hidden");f.stop(!0,!0).animate({outerHeight:"0px"},{complete:function(){e(this).hide();d.outerHeight(c);f.css("overflow",g);d.css("overflow",h)},step:function(a,b){0>=c?d.css("height","auto"):d.outerHeight(c*
b.pos)},duration:this.options.duration});this.current=a}},calculateRemainder:function(a){var b=this.element.height();(a||this.element.children(this.options.title)).each(function(){b-=e(this).outerHeight(!0)});return b},resize:function(){clearTimeout(this._resizeTimeout);var a=this;this._resizeTimeout=setTimeout(function(){a.setHeight()},10)},insert:function(){this.setHeight()},"{title} mouseleave":function(a){a.removeClass(this.options.hoverClassName)},"{title} mouseenter":function(a){a.addClass(this.options.hoverClassName)},
"{title} dropover":function(a){this._timer=setTimeout(this.callback("titleOver",a),200)},"{title} dropout":function(){clearTimeout(this._timer)}})});steal.executed("mxui/nav/accordion/accordion.js");
