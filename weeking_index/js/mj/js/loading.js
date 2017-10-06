/**
 * 
 */

mj.view.loading = function(options) {
	mj.addView("mj-loading", this);
	this.options = options;
	this.close = function() {
		this.__inner.view.remove();
		this.__inner.mash.remove();
		mj.delView("mj-loading");
	}
};
mj.view.loading.prototype = {
	__opts : {
		"id" : mj.key(),
		"title" : "系统提示",
		"width" : "300px",
		"height" : "120px",
		"icon" : "",
		"content" : "正在加载..."
	},
	__inner : {},
	__build : function() {
		this.__buildOption();
		this.__buildMask();
		this.__inner.view = $(mj.templates.mjLoading);
		this.__inner.head = this.__inner.view.find(".mj-loading-head:first-child");
		this.__inner.body = this.__inner.view.find(".mj-loading-body:first-child");
		this.__buildView();
	},
	__buildOption:function(){
		this.__opts = {
				"id" : mj.key(),
				"title" : "系统提示",
				"width" : "300px",
				"height" : "120px",
				"icon" : "",
				"horizontal" : "left",
				"vertical" : "middle",
				"content" : "正在加载..."
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
	},

	__buildHead : function() {
		var title = $('<span class="mj-loading-head-text"></span>');
		title.text(this.__opts.title);
		this.__inner.head.append(this.__buildLevel());
		this.__inner.head.append(title);
	},

	__buildBody : function() {
		this.__inner.body.html(this.__opts.content);
		this.__inner.body.css({
			"text-align" : this.__opts.horizontal,
			"vertical-align" : this.__opts.vertical
		});
	},

	__buildLevel : function() {
		var level = $('<span class="mj-loading-head-icon"></span>');
		level.addClass("fa fa-spinner fa-spin");
		return level;
	},

	__buildMask : function() {
		this.__inner.mash = $(mj.templates.mjMash);
		this.__inner.mash.css({
			"z-index" : mj.getIndex()
		});
		$(document.body).append(this.__inner.mash);
	}

};

mj.buildLoading = function(options) {
	if (mj.checkView("mj-loading")) {
		return;
	}
	var win = new mj.view.loading(options);
	win.__build();
	return win;
}
