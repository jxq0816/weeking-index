/**
 * 
 */

mj.view.confirm = function(options) {
	mj.addView("mj-confirm", this);
	this.options = options;
	this.close = function() {
		this.__inner.view.remove();
		this.__inner.mash.remove();
		mj.delView("mj-confirm");
	}
};

mj.view.confirm.prototype = {
	__inner : {},
	__build : function() {
		this.__buildOption();
		this.__buildMask();
		this.__inner.view = $(mj.templates.mjConfirm);
		this.__inner.head = this.__inner.view.find(".mj-confirm-head:first-child");
		this.__inner.body = this.__inner.view.find(".mj-confirm-body:first-child");
		this.__inner.foot = this.__inner.view.find(".mj-confirm-foot:first-child");
		this.__buildView();
	},
	__buildOption : function() {
		this.__opts = {
			"id" : mj.key(),
			"title" : "系统提示",
			"width" : "300px",
			"height" : "120px",
			"level" : "info",
			"horizontal" : "left",
			"vertical" : "middle",
			"icon" : "",
			"content" : "...",
			"handler" : null
		};
		$.extend(true, this.__opts, this.options);
		delete this.options;
	},
	__buildView : function() {
		var dom = $(document.body);
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
		var title = $('<span class="mj-confirm-head-text"></span>');
		title.text(this.__opts.title);
		this.__inner.head.append(this.__buildLevel());
		this.__inner.head.append(title);
	},

	__buildFoot : function() {
		var _this = this;
		var btns = this.__inner.foot.children();
		var ok_button = $(btns[0]);
		ok_button.on("click", function() {
			_this.close();
			if ($.isFunction(_this.__opts.handler)) {
				_this.__opts.handler('yes');
			}
		});

		var cancel_button = $(btns[1]);
		cancel_button.on("click", function() {
			_this.close();
			if ($.isFunction(_this.__opts.handler)) {
				_this.__opts.handler("no");
			}

		});
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
			level.addClass("glyphicon glyphicon-question-sign mj-color-help");
			break;
		case "info":
			level.addClass("glyphicon glyphicon-info-sign mj-color-info");
			break;
		case "warn":
			level.addClass("glyphicon glyphicon-exclamation-sign mj-color-warn");
			break;
		case "error":
			level.addClass("glyphicon glyphicon-remove-circle mj-color-error");
			break;
		default:
			level.addClass("glyphicon glyphicon-info-sign mj-color-info");
		}
		return level;
	},

	__buildMask : function() {
		this.__inner.mash = $(mj.templates.mjMash);
		this.__inner.mash.css({
			"z-index" : mj.getIndex()
		});
		$(document.body).append(this.__inner.mash);
	},

	__open : function() {
		this.__inner.view.remove();
		this.__inner.mash.remove();
		mj.delView(this.__opts.id);
	}

};

mj.buildConfirm = function(options) {
	if (mj.checkView("mj-confirm")) {
		return;
	}
	var win = new mj.view.confirm(options);
	win.__build();
	return win;
}