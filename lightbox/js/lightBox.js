;(function (a) {
	var LightBox = function(){
		var _self = this;
		this.mask = $('<div class="mask" id="mask">');
		this.layer = $('<div class="layer" id="layer">');
		this.bodyNode = $(document.body);

		this.renderDom();
		this.picViewArea = this.layer.find('div.img-show');
		this.popupPic = this.layer.find('img');
		this.picCaptionArea = this.layer.find('div.img-detail');
		this.preBtn = this.layer.find('span.pre-btn');
		this.nextBtn = this.layer.find('span.next-btn');
		this.captionText = this.layer.find('p');
		this.currentIndex = this.layer.find('span.pic-index');
		this.closeBtn = this.layer.find('span.guan-btn');

		this.groupName = null;
		this.groupData = [];
		this.bodyNode.delegate('.js-lightbox,*[data-role=lightbox]','click',function(e){
			e.stopPropagation();//阻止事件冒泡
			var currentGroupName = $(this).attr('data-group');
			if(currentGroupName != _self.groupName){
				_self.groupName = currentGroupName;
				_self.getGroup();
			}
			_self.initPopup($(this));
		})
		this.mask.click(function(){
			$(this).fadeOut();
			_self.layer.fadeOut();
		})
		this.closeBtn.click(function(){
			_self.mask.fadeOut();
			_self.layer.fadeOut();
		});
		this.nextBtn.click(function(e){
			e.stopPropagation();
			_self.goto('next');
		})
		this.preBtn.click(function(e){
			e.stopPropagation();
			_self.goto('pre')
		})
	}


	LightBox.prototype = {
		renderDom : function () {
			var strHtml ='<div class="img-show">'+
											'<img src="imgs/zly1.jpg" alt="" width="100%">'+ 
											'<span class="pre-btn btn"><i class="iconfont zuofanye">&#xe63f;</i></span>'+
											'<span class="next-btn btn"><i class="iconfont youfanye">&#xe63e;</i></span>'+
										'</div>'+
										'<div class="img-detail">'+
											'<div class="img-inf">'+
												'<p>这是一张图片</p>'+
												'<span class="pic-index">0 of 0</span>'+
											'</div>'+
											'<span class="iconfont guanbi guan-btn">&#xe61b;</span>'+
										'</div>';
			this.layer.html(strHtml);
			this.bodyNode.append(this.mask,this.layer);
		},

		goto:function(dir){
			if (dir === 'next') {
				this.index++;
				if(this.index >= this.groupData.length - 1){
					this.nextBtn.addClass('hide-btn');
				}
				if(this.index != 0){
					this.preBtn.removeClass('hide-btn');
				}
				var src = this.groupData[this.index].src;
				this.loadPreSize(src);
			}else if(dir === 'pre'){
				this.index--;
				if(this.index <= 0){
					this.preBtn.addClass('hide-btn');
				}
				if(this.index != this.groupData.length - 1){
					this.nextBtn.removeClass('hide-btn');
				}
				var src = this.groupData[this.index].src
				this.loadPreSize(src);
			}
		},

		getGroup:function () {
			var _self = this;
			var groupList = this.bodyNode.find('*[data-group='+this.groupName+']');
			_self.groupData.length = 0;
			groupList.each(function (item) {
				_self.groupData.push({
					src:$(this).attr('data-source'),
					id:$(this).attr('data-id'),
					caption:$(this).attr('data-caption')
				})
			})
		},

		initPopup:function (currentObj) {
			var _self = this,
					sourceSrc = currentObj.attr('data-source'),
					currentId = currentObj.attr('data-id')
			this.showMaskandPopup(sourceSrc,currentId)
		},

		showMaskandPopup:function (sourceSrc,currentId) {
			var _self = this,
					winWidth = $(window).width(),
					winHeight = $(window).height(),
					viewHeight = winHeight/2+10,
					groupDataLength = this.groupData.length
			this.popupPic.hide();
			this.picCaptionArea.hide();
			this.mask.fadeIn();
			this.picViewArea.css({
				width:winWidth/2,
				height:winHeight/2
			});
			this.layer.fadeIn();
			this.layer.css({
				width:winWidth/2+10,
				height:winHeight/2+10,
				marginLeft:-(winWidth/2+10)/2,
				top:-viewHeight
			}).animate({
				top:(winHeight-viewHeight)/2
			},function(){
				_self.loadPreSize(sourceSrc)
			});
			this.index = this.getIndexOf(currentId);
			if (groupDataLength > 1) {
				if (this.index === 0 ) {
					this.preBtn.addClass('hide-btn');
					this.nextBtn.removeClass('hide-btn');
				}else if(this.index === groupDataLength-1){
					this.nextBtn.addClass('hide-btn');
					this.preBtn.removeClass('hide-btn');
				}else{
					this.nextBtn.removeClass('hide-btn');
					this.preBtn.removeClass('hide-btn');
				}
			}else{
				this.nextBtn.addClass('hide-btn');
				this.preBtn.addClass('hide-btn');
			}
		},

		getIndexOf:function(currentId){
			var index = 0;
			$(this.groupData).each(function(i){
				index = i;
				if(this.id === currentId){
					return false;
				}
			})
			return index;
		},

		loadPreSize:function(sourceSrc){
			var _self = this;
			_self.popupPic.css({
				width:'auto',
				height:'auto',
			}).hide();
			this.preLoadImg(sourceSrc,function(){
				_self.popupPic.attr('src',sourceSrc);
				var picWidth = _self.popupPic.width();
				var picHeight = _self.popupPic.height();
				_self.changePic(picWidth,picHeight)
			})
		},

		changePic:function(width,height){
			var _self = this,
					winWidth = $(window).width(),
					winHeight = $(window).height(),
					scale = Math.min(winWidth/(width+10),winHeight/(height+10),1);
			width*=scale;
			height*=scale;
			this.picViewArea.animate({
				width:width-10,
				height:height-10
			});
			this.layer.animate({
				width:width,
				height:height,
				marginLeft:-(width/2),
				top:(winHeight-height)/2
			},function(){
				_self.popupPic.css({
					width:width-10,
					height:height-10,
				}).fadeIn();
				_self.picCaptionArea.fadeIn();
			})
			this.captionText.text(this.groupData[this.index].caption)
			this.currentIndex.text(this.index+1 + ' in ' + this.groupData.length)
		},

		preLoadImg:function(src,callback){
			var img = new Image();
			if(window.ActiveXObject){
				img.onreadystatechange = function(){
					if (this.readyState == 'complete') {
						callback();
					}
				}
			}else{
				img.onload = function(){
					callback();
				}
			}
			img.src = src
		}
	};
	window['LightBox'] = LightBox;
}('jQuery'))