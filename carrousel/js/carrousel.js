;(function (jq) {
	var Carrousel = function (poster) {
		var _self = this;
		this.poster = poster;
		this.posterItemMain = poster.find('ul.poster-list');
		this.prevBtn = poster.find('div.poster-prev-btn');
		this.nextBtn = poster.find('div.poster-next-btn');
		this.posterItems = this.posterItemMain.find('li.poster-item');
		this.posterFirstItem = this.posterItems.first();
		this.posterLastItem = this.posterItems.last();
		this.animateFlag = true;
		this.setting = {
			"width":1000,
			"height":450,
			"posterWidth":800,
			"posterHeight":450,
			"speed":500,
			"scale":0.9,
			"verticalAlign":"middle",
			"autoPlay":"true",
			"delay":800,
		}
		$.extend(this.setting,this.getSetting())
		this.setSettingValue();
		this.setPosterPos();
		this.prevBtn.click(function () {
			if(_self.animateFlag){
				_self.carrouselRotate('left');
				_self.animateFlag = false;
			}
		})
		this.nextBtn.click(function () {
			if(_self.animateFlag){
				_self.carrouselRotate('right');
				_self.animateFlag = false;
			}
		});
		if(this.setting.autoPlay){
			this.autoPlay();
			this.poster.hover(function () {
				window.clearInterval(_self.timer)
			},function () {
				_self.autoPlay();
			})
		}
	};

	Carrousel.prototype = {
		getSetting :function(){
			var setting = this.poster.attr('data-setting');
			if(setting&&setting != ''){
				return $.parseJSON(setting);
			}else{
				return {};
			}
		},

		setSettingValue:function () {
			this.poster.css({
				width:this.setting.width,
				height:this.setting.height,
			});
			this.posterItemMain.css({
				width:this.setting.width,
				height:this.setting.height,
			});
			var w = (this.setting.width - this.setting.posterWidth)/2;
			this.prevBtn.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.posterItems.size()/2),
				lineHeight:this.setting.height+'px',
			})
			this.nextBtn.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.posterItems.size()/2),
				lineHeight:this.setting.height+'px',
			})
			this.posterFirstItem.css({
				left:w,
				width:this.setting.posterWidth,
				height:this.setting.posterHeight,
				zIndex:Math.floor(this.posterItems.size()/2),
			})
		},

		setPosterPos:function () {
			var _self = this,
					sliceItems = this.posterItems.slice(1),
					sliceSize = sliceItems.size()/2,
					rightSlice = sliceItems.slice(0,sliceSize),
					leftSlice = sliceItems.slice(sliceSize),
					oloop = level = Math.floor(this.posterItems.size()/2),
					lw = rw = this.setting.posterWidth,
					lh = rh = this.setting.posterHeight,
					gap = ((this.setting.width - this.setting.posterWidth)/2)/level,
					firstLevel = (this.setting.width - rw)/2,
					fixOffsetLeft = firstLevel + rw;
			rightSlice.each(function (i) {
				level--;
				rw *= _self.setting.scale;
				rh *= _self.setting.scale;
				var j = i;
				$(this).css({
					width:rw,
					height:rh,
					top:_self.setVerticalAlign(rh),
					left:fixOffsetLeft+(++j)*gap-rw,
					opacity:1/(++i),
					zIndex:level,
				})
			});
			leftSlice.each(function (ii) {
				var jj = Math.pow(_self.setting.scale,(oloop-ii))
				$(this).css({
					zIndex: ii,
					opacity: 1/(oloop-ii),
					width: lw * jj,
					height: lh * jj,
					top: _self.setVerticalAlign(lh*jj),
					left: gap * ii,
				}) 
			})
		},
		setVerticalAlign:function (height) {
			var top = 0,
					verticalType = this.setting.verticalAlign;
			switch(verticalType){
				case 'top':
					top = 0;
					break;
				case 'bottom':
					top = this.setting.height-height;
					break;
				default:
				  top = (this.setting.height-height)/2;
			}
			return top;
		},
		carrouselRotate:function (dir) {
			var _self = this;
			if (dir === 'left') {
				this.posterItems.each(function () {
					var _this = $(this),
							prev = _this .prev().get(0) ? _this.prev() : _self.posterLastItem,
							width = prev.width(),
							height = prev.height(),
							zIndex = prev.css('zIndex'),
							opacity = prev.css('opacity'),
							left = prev.css('left'),
							top = prev.css('top');
					_this.animate({
						width:width,
						height:height,
						zIndex,zIndex,
						opacity:opacity,
						left:left,
						top:top
					},_self.setting.speed,function () {
						_self.animateFlag = true;
					})
				})
			}else if(dir === 'right'){
				this.posterItems.each(function () {
					var _this = $(this),
							next = _this .next().get(0) ? _this.next() : _self.posterFirstItem,
							width = next.width(),
							height = next.height(),
							zIndex = next.css('zIndex'),
							opacity = next.css('opacity'),
							left = next.css('left'),
							top = next.css('top');
					_this.animate({
						width:width,
						height:height,
						zIndex,zIndex,
						opacity:opacity,
						left:left,
						top:top
					},_self.setting.speed,function () {
						_self.animateFlag = true;
					})
				})
			}
		},

		autoPlay:function () {
			var _self = this;
			this.timer = window.setInterval(function () {
				_self.nextBtn.click();
			},_self.setting.delay)
		},
	};

	Carrousel.init = function (posters) {
		var _self = this;
		posters.each(function(){
			new _self($(this))
		})
	}
	window['Carrousel'] = Carrousel;
}(jQuery))