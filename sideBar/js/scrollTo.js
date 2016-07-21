define(['jquery'],function ($) {
	function ScrollTo(opts) {
		this.opts = $.extend({},ScrollTo.DEFAULTS,opts);
		this.elhtml = $('html,body');
	}
	ScrollTo.DEFAULTS = {
		dest: 0,
		speed: 800,
	}
	ScrollTo.prototype.move = function() {
		var opts = this.opts,
				dest = opts.dest;
		if($(window).scrollTop() != dest){
			if(!this.elhtml.is(':animated')){
				this.elhtml.animate({
					scrollTop: dest,
				},opts.speed);
			}
		}
	};
	ScrollTo.prototype.go = function() {
		var dest = this.opts.dest;
		if ($(window).scrollTop() != dest) {
			this.elhtml.scrollTop(dest)
		}
	};
	return {
		ScrollTo:ScrollTo
	}
})