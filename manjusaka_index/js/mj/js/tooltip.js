/**
 * 
 */
mj.view.tooltip = function(target, options) {
	mj.addView("mj-tooltip", this);
	var _this = this;
	this.options = {
		"top" : "0",// 提示框偏移上下水平像素
		"left" : "0",// 提示框偏移左右水平像素
		"position" : "bottom",// 默认提示框出现位置为底部
		"title" : ""// 提示框显示文字
	};
	this.target = target;
	$.extend(true, this.options, options);
	this.destroy = function() {
		_this.destroy();
	};
	this.setTitle = function(title) {
		_this.options.title = title;
		_this.$inner.buildBody();
	};
	
	_this.$inner = {
		
	};
	
	_this.$inner.build = function() {
		_this.$inner.tooltip = $(mj.templates.mjTooltip);
		_this.$inner.arrow = this.tooltip.find(".mj-tooltip-arrow").first();
		_this.$inner.inner = this.tooltip.find(".mj-tooltip-inner").first();		
		_this.$inner.buildTarget();
	},
	_this.$inner.buildTarget = function() {
		_this.target.on("mouseover", function(event) {
			if (!mj.isEmpty(_this.options.title)) {
//				_this.target = $(event.target);
				_this.$inner.buildView();
				_this.$inner.open();
			}else{
				_this.$inner.close();
			}
		});
		_this.target.on("mouseout", function(event) {
			_this.$inner.close();
		});
	},
	_this.$inner.buildBody = function() {
		if (!mj.isEmpty(_this.options.title)) {
			_this.$inner.inner.text(_this.options.title);			
		}
		
	},
	_this.$inner.buildView = function() {
		var targetTop = _this.options.top;
		var targetLeft = _this.options.left;
		_this.$inner.buildBody();
		var dom = mj.getBody();
		dom.append(_this.$inner.tooltip);

		var h;
		var w;
		var _o=_this.target.offset();
		if (_this.options.position == "bottom") {
			h = _o.top + _this.target.outerHeight(true) + targetTop * 1;
			w = _o.left + targetLeft * 1;
			_this.$inner.tooltip.addClass("mj-tooltip-bottom");
			_this.$inner.arrow.addClass("mj-tooltip-bottom-arrow");
		} else if (_this.options.position == "top") {
			h = _o.top - _this.$inner.tooltip.height()  + targetTop * 1;
			w = _o.left + targetLeft * 1;
			_this.$inner.tooltip.addClass("mj-tooltip-top");
			_this.$inner.arrow.addClass("mj-tooltip-top-arrow");
		} else if (_this.options.position == "left") {
			h = _o.top + targetTop * 1;
			w = _o.left - _this.$inner.tooltip.width() + targetLeft * 1;
			_this.$inner.tooltip.addClass("mj-tooltip-left");
			_this.$inner.arrow.addClass("mj-tooltip-left-arrow");
		} else if (_this.options.position == "right") {
			h = _o.top + targetTop * 1;
			w = _o.left + _this.target.outerWidth(true) + targetLeft * 1;
			_this.$inner.tooltip.addClass("mj-tooltip-right");
			_this.$inner.arrow.addClass("mj-tooltip-right-arrow");
		}
		_this.$inner.tooltip.css({
			"top" : h,
			"left" : w,
			"z-index" : mj.getIndex(),
			"display" : "block"
		});
	},
	/**
	 * 显示方法
	 */
	_this.$inner.open = function() {
		if (!$.isEmptyObject(_this.options.title)) {
			var index = _this.$inner.tooltip.css("z-index");
			if (index != "-100" && index != -100) {
				return;
			}
			this.tooltip.css({
				"z-index" : mj.getIndex()
			});
		}
	},

	/**
	 * 关闭方法
	 */
	_this.$inner.close = function() {
		_this.$inner.hide();
	},

	_this.$inner.hide = function() {
		_this.$inner.tooltip.css({
			"z-index" : "-100"
		});
	},
	_this.$inner.destroy = function() {
		_this.$inner.arrow.remove();
		_this.$inner.inner.remove();
		_this.$inner.tooltip.remove();
		delete _this;
	}
};


mj.buildTooltip = function(target, opts) {
	var tooltip = new mj.view.tooltip(target, opts);
	tooltip.$inner.build();
	return tooltip;
}
