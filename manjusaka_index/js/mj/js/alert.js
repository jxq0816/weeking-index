/**
 * 
 */
mj.view.alert = function(options) {
	mj.addView("mj-alert", this);
	this.options = options;
	this.close = function() {
		this.__inner.view.remove();
		this.__inner.mash.remove();
		mj.delView("mj-alert");
	}
};
mj.view.alert.prototype = {
	__inner : {},
	__build : function() {
		this.__buildOption();
		this.__buildMask();
		this.__inner.view = $(mj.templates.mjAlert);
		this.__inner.head = this.__inner.view.find(".mj-alert-head:first-child");
		this.__inner.body = this.__inner.view.find(".mj-alert-body:first-child");
		this.__inner.foot = this.__inner.view.find(".mj-alert-foot:first-child");
		this.__buildView();
	},
	__buildOption : function() {
		this.__opts = {
			"title" : "系统提示",
			"width" : "300px",
			"height" : "120px",
			"level" : "info",
			"icon" : "",
			"horizontal" : "left",
			"vertical" : "middle",
			"content" : "...",
			"handler" : null,
			"closable" : true
		};
		$.extend(true, this.__opts, this.options);
		delete this.options;
	},
	__buildView : function() {
		var dom = mj.getBody();
		dom.append(this.__inner.view);
		this.__inner.view.css({
			"width" : this.__opts.width,
			"height" : this.__opts.height
		});

		var h = (dom.height() - this.__inner.view.height()) / 2;
		var w = (dom.width() - this.__inner.view.width()) / 2;
		this.__inner.view.css({
			"top" : h,
			"left" : w,
			"z-index" : mj.getIndex()
		});
		this.__buildHead();
		this.__buildBody();
		this.__buildFoot();
	},

	__buildHead : function() {
		var title = $('<span class="mj-alert-head-text"></span>');
		title.text(this.__opts.title);
		this.__inner.head.append(this.__buildLevel());
		this.__inner.head.append(title);
	},

	__buildFoot : function() {
		var _this = this;
		var button = $(".mj-alert-button:first-child");
		button.on("click", function() {
			_this.close();
			if ($.isFunction(_this.__opts.handler)) {
				_this.__opts.handler();
			}
		});
		button.focus();
	},

	__buildBody : function() {
		this.__inner.body.html(this.__opts.content);
		this.__inner.body.css({
			"text-align" : this.__opts.horizontal,
			"vertical-align" : this.__opts.vertical
		});
	},

	__buildLevel : function() {
		var level = $('<span class="mj-alert-head-icon"></span>');
		switch (this.__opts.level) {
		case "help":
			level.addClass("fa fa-question-circle-o mj-color-help");
			break;
		case "info":
			level.addClass("fa fa-info-circle mj-color-info");
			break;
		case "warn":
			level.addClass("fa fa-exclamation-triangle mj-color-warn");
			break;
		case "error":
			level.addClass("fa fa-times mj-color-error");
			break;
		default:
			level.addClass("fa fa-info-circle mj-color-info");
		}
		return level;
	},

	__buildMask : function() {
		this.__inner.mash = $(mj.templates.mjMash);
		this.__inner.mash.css({
			"z-index" : mj.getIndex()
		});
		mj.getBody().append(this.__inner.mash);
	},
	__open : function() {
		this.__inner.view.remove();
		this.__inner.mash.remove();
		mj.delView(this.__opts.id);
	}
};

mj.buildAlert = function(options) {
	if (mj.checkView("mj-alert")) {
		return;
	}
	var win = new mj.view.alert(options);
	win.__build();
	return win;
}