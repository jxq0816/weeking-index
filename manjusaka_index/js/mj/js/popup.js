/**
 * 
 */
mj.view.popup = function(target, options) {
	mj.addView("mj-popup", this);
	this.target = target;
	var _this = this;
	this.options = {
		"top" : "0",// 提示框偏移上下水平像素
		"left" : "0",// 提示框偏移左右水平像素
		"position" : "bottom",// 默认提示框出现位置为底部
		"content" : "",// 提示框显示内容
		"width" : "100",
		"height" : "200",
		"bgColor" : "#FFF"
	};
	$.extend(true, this.options, options);
	this.destroy = function() {
		_this.destroy();
	};
	this.setContent = function(content) {
		_this.options.content = content;
		_this.$inner.buildBody();
	};
	this.setTarget = function(target) {
		_this.target = target;
	};
	this.close = function() {
		_this.$inner.close();
	}
	this.open = function() {
		_this.$inner.isOpen = true;// 设置open打开层的标示
		_this.$inner.buildView();
		_this.$inner.open();
	}
	_this.$inner = {

	};

	_this.$inner.build = function() {
		_this.$inner.popup = $(mj.templates.mjPopup);
		_this.$inner.body = this.popup.find(".mj-popup-body").first();
		_this.$inner.isOpen = false;// 是否通过open方法打开提示层
		_this.$inner.buildTarget();
		_this.$inner.buildBody();
		var dom = mj.getBody();
		dom.append(_this.$inner.popup);
		_this.$inner.body.css({
			"background-color" : _this.options.bgColor,
			"width" : _this.options.width,
			"height" : _this.options.height,
			"display" : "block"
		});
	}, _this.$inner.buildTarget = function() {
		_this.target.on("click", function(event) {
			event.stopPropagation();
			_this.$inner.buildView();
			_this.$inner.open();
		});
		var dom = mj.getBody();
		$(document.body).on("click", function(event) {
			if (!_this.$inner.isOpen) {// 通过正常方式打开提示层，点击提示层和控件以外部分就关闭页面
				event.stopPropagation();
				var ss = $(event.target).closest("div[data-tag='mjPopup']");
				if (ss.length == 0) {
					_this.$inner.close();
				}
			} else {// 通过open方式打开提示层后，再点击提示层和控件以外部分就关闭页面
				_this.$inner.isOpen = false;// 还原open打开层的标示
			}
		})
	}, _this.$inner.buildBody = function() {
		var children = _this.$inner.body.find("*[data-tag*='mj']");
		for (var i = children.length - 1; i >= 0; i--) {
			var view = mj.getView($(children[i]).attr("id"));
			if (!mj.isEmpty(view)) {
				if ($.isFunction(view.destroy)) {
					view.destroy();
				}
			}
		}
		_this.$inner.body.empty();
		_this.$inner.body.append(_this.options.content);
		mj.compile(_this.$inner.body);
	}, _this.$inner.buildView = function() {
		var targetTop = _this.options.top;
		var targetLeft = _this.options.left;
		var h;
		var w;
		var p = _this.target.offset();
		var _t = 2;
		if (_this.options.position == "bottom") {
			h = p.top + _this.target.outerHeight(true) + targetTop * 1 + _t;
			w = p.left + targetLeft * 1;
		} else if (_this.options.position == "top") {
			h = p.top - _this.$inner.popup.outerHeight(true) + targetTop * 1 - _t;
			w = p.left + targetLeft * 1;
		} else if (_this.options.position == "left") {
			h = p.top + targetTop * 1 + _t;
			w = p.left - _this.$inner.popup.width() + targetLeft * 1;
		} else if (_this.options.position == "right") {
			h = p.top + targetTop * 1 + _t;
			w = p.left + _this.target.width() + targetLeft * 1;
		}
		_this.$inner.popup.css({
			"top" : h + "px",
			"left" : w + "px",
			"z-index" : mj.getIndex()
		});

	},
	/**
	 * 显示方法
	 */
	_this.$inner.open = function() {
		_this.$inner.popup.css({
			"display" : "block"
		});
	},

	/**
	 * 关闭方法
	 */
	_this.$inner.close = function() {
		_this.$inner.hide();
	},

	_this.$inner.hide = function() {
		_this.$inner.popup.css({
			"display" : "none"
		});
	}, _this.$inner.destroy = function() {
		var children = this.__inner.popup.find("*[data-tag*='mj']");
		for (var i = children.length - 1; i >= 0; i--) {
			var view = mj.getView($(children[i]).attr("id"));
			if (!mj.isEmpty(view)) {
				if ($.isFunction(view.destroy)) {
					view.destroy();
				}
			}
		}
		_this.$inner.body.remove();
		_this.$inner.popup.remove();
		delete _this;
	}
};
mj.buildPopup = function(target, opts) {
	var popup = new mj.view.popup(target, opts);
	popup.$inner.build();
	return popup;
}
mj.popup = function(target, opts) {
	var popup = new mj.view.popup(target, opts);
	popup.$inner.build();
	return popup;
}
