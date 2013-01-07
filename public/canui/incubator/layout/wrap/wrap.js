steal('jquery').then(function ($) {
	/**
	 * @function jQuery.fn.can_ui_layout_wrap
	 * @parent canui
	 * @plugin canui/layout/wrap
	 * @test canui/layout/wrap/qunit.html
	 *
	 * Wraps an element with another element, keeps all margins and
	 * returns the new element.
	 *
	 * @return {jQuery} The new element
	 */
	var tags = /canvas|textarea|input|select|button|img/i
	$.fn.can_ui_layout_wrap = function () {
		var ret = [];
		this.each(function () {
			if (this.nodeName.match(tags)) {
				var $el = $(this),
					$org = $el
				//Opera fix for relative positioning
				if (/relative/.test($el.css('position')) && $.browser.opera)
					$el.css({ position : 'relative', top : 'auto', left : 'auto' });

				//Create a wrapper element and set the wrapper to the new current internal element
				var position = $el.css('position')
				$el.wrap(
					$('<div class="ui-wrapper"></div>').css({
						position : position == 'static' ? "relative" : position,
						width : $el.outerWidth(),
						height : $el.outerHeight(),
						top : $el.css('top'),
						left : $el.css('left')
					})
				);

				//Overwrite the original $el
				$el = $el.parent()

				$elIsWrapper = true;

				//Move margins to the wrapper
				$el.css({ marginLeft : $org.css("marginLeft"), marginTop : $org.css("marginTop"), marginRight : $org.css("marginRight"), marginBottom : $org.css("marginBottom") });
				$org.css({ marginLeft : "0px", marginTop : "0px", marginRight : "0px", marginBottom : "0px"});

				ret.push($el)
			} else {
				ret.push(this)
			}
		});

		return $(ret);
	}
});
