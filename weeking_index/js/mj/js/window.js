/**
 * 
 */

mj.view.window = function(options) {
	mj.addView("mj-window", this);
	this.options = options;

	/**
	 * 关闭方法
	 */
	this.close = function() {
		if ($.isFunction(this.__opts.beforeClose)) {
			this.__opts.beforeClose();
		}
		if (this.__opts.closeModel == "hide") {
			this.__hide();
		} else {
			mj.delView("mj-window");
			this.__destroy();
		}
		if ($.isFunction(options.afterClose)) {
			options.afterClose();
		}
	};

	/**
	 * 显示方法
	 */
	this.open = function() {
		var index = this.__inner.mash.css("z-index");
		if (index != "-100" && index != -100) {
			return;
		}
		this.__inner.mash.css({
			"z-index" : mj.getIndex()
		});
		this.__inner.view.css({
			"z-index" : mj.getIndex()
		});
	};

}

mj.view.window.prototype = {
	__id : mj.key(),
	__inner : {},
	__build : function() {
		this.__buildOption();
		this.__buildMask();
		this.__inner.view = $(mj.templates.mjWindow);
		this.__inner.head = this.__inner.view.find(".mj-window-head").first();
		this.__inner.body = this.__inner.view.find(".mj-window-content").first();
		this.__buildHead();
		this.__buildInclude();
		mj.compile(this.__inner.view);
		mj.getBody().append(this.__inner.view);
		this.__buildView();
	},
	__buildOption:function(){
		this.__opts = {
			"id" : mj.key(),
			"title" : "窗口",
			"width" : "50%",
			"height" : "50%",
			"icon" : "fa fa-window-maximize mj-icon",
			"position" : "c",
			"scroll" : true,
			"resizable" : false,
			"closable" : true,
			"closeModel" : "destroy",
			"view" : "",
			"controller" : null,
			"param" : null,
			"afterClose" : null,
			"beforeClose" : null,
			"load" : ""
		};
		$.extend(true, this.__opts, this.options);
		delete this.options;
	},
	__hide : function() {
		this.__inner.mash.css({
			"z-index" : "-100"
		});
		this.__inner.view.css({
			"z-index" : "-100"
		});
	},
	__buildView : function() {
		this.__inner.view.css({
			"width" : this.__opts.width,
			"height" : this.__opts.height
		});

		var h = (mj.getBody().height() - this.__inner.view.height()) / 2;
		var w = (mj.getBody().width() - this.__inner.view.width()) / 2;
		this.__inner.view.css({
			"top" : h,
			"left" : w
		});

		this.__inner.body.css({
			"height" : this.__inner.body.parent().innerHeight(),
			"width" : this.__inner.body.parent().innerWidth()
		})
	},
	__buildHead : function() {
		var title = $("<span></span>");
		title.text(this.__opts.title);
		var icon = $("<span></span>");
		icon.addClass(this.__opts.icon);

		this.__buildClose();
		this.__inner.head.append(icon);
		this.__inner.head.append(title);
	},

	__buildClose : function() {
		if (this.__opts.closable == true) {
			var _this = this;
			var close = $("<span></span>");
			close.addClass("fa fa-close mj-window-close");
			this.__inner.head.append(close);
			close.on("click", function() {
				_this.close();
			});
		}
	},

	__buildInclude : function() {
		var iview = mj.buildInclude({
			"id" : this.__id,
			"view" : this.__opts.view,
			"controller" : this.__opts.controller,
			"param" : this.__opts.param,
			"load" : this.__opts.load
		});
		this.__inner.body.append(iview);
	},

	__buildMask : function() {
		this.__inner.mash = $(mj.templates.mjMash);
		$(document.body).append(this.__inner.mash);
	},

	__getParam : function() {
		return this.__opts.param;
	},
	__destroy : function() {
		var children = this.__inner.view.find("*[data-tag*='mj']");
		for (var i = children.length - 1; i >= 0; i--) {
			var view = mj.getView($(children[i]).attr("id"));
			if (!mj.isEmpty(view)) {
				if ($.isFunction(view.destroy)) {
					view.destroy();
				}
			}
		}
		this.__inner.view.remove();
		this.__inner.mash.remove();
		delete this;
	}
};

mj.buildWindow = function(options) {
	if (mj.checkView("mj-window")) {
		return;
	}
	var win = new mj.view.window(options);
	win.__build();
	return win;
}