/**
 * 
 */

mj.module.directive('mjPanel', function($compile) {
	return mj.buildDirective({
		name : "mjPanel",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.head = null;
					$scope.$inner.body = null;
					$scope.$inner.foot = null;
					$scope.$inner.addHead = function(sc, el, rs) {
						$scope.$inner.head = {
							"sc" : sc,
							"el" : el,
							"rs" : rs
						};
					};
					$scope.$inner.addBody = function(sc, el, rs) {
						$scope.$inner.body = {
							"sc" : sc,
							"el" : el,
							"rs" : rs
						};
					};
					$scope.$inner.addFoot = function(sc, el, rs) {
						$scope.$inner.foot = {
							"sc" : sc,
							"el" : el,
							"rs" : rs
						};
					};
					$scope.$inner.init = function() {
						if (mj.isFalse($attrs.border)) {
							$element.css({
								"border" : "none"
							});
						}
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.height)) {
							$element.css({
								"height" : $attrs.height
							});
						}
						if (mj.isNotEmpty($attrs.width)) {
							$element.css({
								"width" : $attrs.width
							});
						}

						if (mj.isTrue($attrs.hidden)) {
							$element.hide();
						}
					}
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.build = function() {
						if (mj.isNotEmpty($scope.$inner.head) && mj.isTrue($scope.$inner.head.rs.collapsed)) {
							$scope.$outer.collapse();
						}
					};

					$scope.$outer.collapse = function() {
						$scope.$inner.head.sc.$inner.collapse();
					};

					$scope.$outer.expand = function() {
						$scope.$inner.head.sc.$inner.expand();
					};

					$scope.$outer.layout = function() {
						if(mj.isNotEmpty($scope.$inner.body)){
							$scope.$inner.body.sc.$inner.layout();
						}
					};

					/**
					 * 添加头部
					 */
					$scope.$outer.addHead = function(opt) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						if ($scope.$inner.head != null) {
							throw "head对象已存在，请检查...";
							return;
						}
						var iview = $scope.$inner.buildPanelHead(opt);
						return $scope.$inner.addChild(iview);
					};

					/**
					 * 添加内容
					 */
					$scope.$outer.addBody = function(opt) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						if ($scope.$inner.body != null) {
							throw "body对象已存在，请检查...";
							return;
						}
						var iview = $scope.$inner.buildPanelBody(opt);
						return $scope.$inner.addChild(iview);
					};

					/**
					 * 添加头部
					 */
					$scope.$outer.addFoot = function(opt) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						if ($scope.$inner.foot != null) {
							throw "foot对象已存在，请检查...";
							return;
						}
						var iview = $scope.$inner.buildPanelFoot(opt);
						return $scope.$inner.addChild(iview);
					};

					/**
					 * 添加子元素
					 */
					$scope.$inner.addChild = function(opt) {
						var _dom = $compile(opt)($scope.$new());
						$element.append(_dom);
						$scope.$inner.layout();
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 动态构建控件
					 */
					$scope.$inner.buildPanelHead = function(opts) {
						var tag = $("<mj-panel-head>");
						$.each(opts, function(key, value) {
							tag.attr("data-" + key, value);
						});
						return tag;
					};

					/**
					 * 动态构建控件
					 */
					$scope.$inner.buildPanelBody = function(opts) {
						var tag = $("<mj-panel-body>");
						$.each(opts, function(key, value) {
							tag.attr("data-" + key, value);
						});
						return tag;
					};

					/**
					 * 动态构建控件
					 */
					$scope.$inner.buildPanelFoot = function(opts) {
						var tag = $("<mj-panel-foot>");
						$.each(opts, function(key, value) {
							tag.attr("data-" + key, value);
						});
						return tag;
					};

					/**
					 * 内部布局
					 */
					$scope.$inner.layout = function() {
						var parent = $scope.$parent;
						while (parent != null) {
							if (mj.isNotEmpty(parent.$outer) && $.isFunction(parent.$outer.layout)) {
								parent.$outer.layout();
								return;
							} else {
								parent = parent.$parent;
							}
						}
					};

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$element.addClass(cls);
					};

					/**
					 * 删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$element.removeClass(cls);
					};

					/**
					 * 获取头部
					 */
					$scope.$outer.getHead = function() {
						return $scope.$inner.head.sc.$outer;
					};

					/**
					 * 获取内容
					 */
					$scope.$outer.getBody = function() {
						return $scope.$inner.body.sc.$outer;
					};

					/**
					 * 获取底部
					 */
					$scope.$outer.getFoot = function() {
						return $scope.$inner.foot.sc.$outer;
					};

					/**
					 * 显示
					 */
					$scope.$outer.show = function() {
						return $element.show();
					};

					/**
					 * 隐藏
					 */
					$scope.$outer.hide = function() {
						return $element.hide();
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
					
					$scope.$inner.build();
				}
			}
		}
	});
});

mj.module.directive('mjPanelHead', function($compile) {
	return mj.buildDirective({
		name : "mjPanelHead",
		require : [ '^?mjPanel' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.head = $element.find(".mj-panel-head").first();
					$scope.$inner.cls = {
						"open" : "fa-chevron-up",
						"close" : "fa-chevron-down"
					};
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$scope.$inner.head.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.height)) {
							$scope.$inner.head.css({
								"height" : $attrs.height
							});
						}
						if (!mj.isEmpty($attrs.icon)) {
							var icon = $("<span class='" + $attrs.icon + "'></span>");
							$scope.$inner.head.prepend(icon);
						}
					}
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var pscope = $scope.$inner.getParentScope();
					pscope.$inner.addHead($scope, $element, $attrs);

					$scope.$inner.bulid = function() {
						if (mj.isTrue($attrs.collapsable)) {
							$scope.$inner.shrink = $("<span class='mj-panel-head-btn fa'></span>");
							$scope.$inner.shrink.addClass($scope.$inner.cls.open);
							$scope.$inner.shrink.appendTo($scope.$inner.head);
							$scope.$inner.shrink.on('click', function() {
								if ($(this).hasClass($scope.$inner.cls.open)) { // 收起
									$scope.$inner.collapse();
								} else if ($(this).hasClass($scope.$inner.cls.close)) { // 展开
									$scope.$inner.expand();
								}
							});
						}
					}

					$scope.$inner.collapse = function() {
						if (mj.isTrue($attrs.collapsable)) {
							$scope.$inner.shrink.removeClass($scope.$inner.cls.open);
							$scope.$inner.shrink.addClass($scope.$inner.cls.close);
						}
						pscope.$outer.getElement().css({
							"height" : "auto"
						});
						pscope.$inner.body.el.css({
							"display" : "none"
						});
						if (!mj.isEmpty(pscope.$inner.foot)) {
							pscope.$inner.foot.el.css({
								"display" : "none"
							});
						}
						$scope.$inner.layout();
					}

					$scope.$inner.expand = function() {
						if (mj.isTrue($attrs.collapsable)) {
							$scope.$inner.shrink.removeClass($scope.$inner.cls.close);
							$scope.$inner.shrink.addClass($scope.$inner.cls.open);
						}
						pscope.$inner.body.el.css({
							"display" : ""
						});
						if (!mj.isEmpty(pscope.$inner.foot)) {
							pscope.$inner.foot.el.css({
								"display" : ""
							});
						}
						if (mj.isEmpty(pscope.$outer.getAttrs().height)) {
							pscope.$outer.getElement().css({
								"height" : "auto"
							});
						} else {
							pscope.$outer.getElement().css({
								"height" : pscope.$outer.getAttrs().height
							});
						}
						$scope.$inner.layout();
					}

					/**
					 * 添加子元素
					 */
					$scope.$outer.addChild = function(child) {
						if (!mj.isEmpty(child)) {
							var _dom = $compile(child)($scope.$new());
							$scope.$inner.head.append(_dom);
						}
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 内部布局
					 */
					$scope.$inner.layout = function() {
						var parent = pscope.$parent;
						while (!mj.isEmpty(parent)) {
							if (mj.isNotEmpty(parent.$outer) && $.isFunction(parent.$outer.layout)) {
								mj.layoutView(parent.$outer.getId());
								break;
							}
							parent = parent.$parent;
						}
					};

					$scope.$inner.bulid();
					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $scope.$inner.head.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $scope.$inner.head.height();
					};

					/**
					 * 添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$scope.$inner.head.addClass(cls);
					};

					/**
					 * 删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$scope.$inner.head.removeClass(cls);
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$scope.$inner.head.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
				}
			}
		}
	});
});

mj.module.directive('mjPanelBody', function($compile) {
	return mj.buildDirective({
		name : "mjPanelBody",
		require : [ '^?mjPanel' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.scroll = $element.find(".mj-panel-body-scroll").first();
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.padding)) {
							$scope.$inner.scroll.css({
								"padding" : $attrs.padding
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var pscope = $scope.$inner.getParentScope();
					pscope.$inner.addBody($scope, $element, $attrs);
					$scope.$inner.layout = function() {
						var pattrs=pscope.$outer.getAttrs();
						if(mj.isNotEmpty(pattrs.height) && pattrs.height!="auto"){
							$scope.$inner.scroll.css({
								"display" : "none"
							});
							var height=$scope.$inner.scroll.parent().innerHeight();
							$scope.$inner.scroll.css({
								"height" : height
							});
							$scope.$inner.scroll.css({
								"display" : "block"
							});
						}
					}

					/**
					 * 添加子元素
					 */
					$scope.$outer.addChild = function(child) {
						if (!mj.isEmpty(child)) {
							var _dom = $compile(child)($scope.$new());
							$scope.$inner.scroll.append(_dom);
						}
						$scope.$inner.layout();
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$element.addClass(cls);
					};

					/**
					 * 删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$element.removeClass(cls);
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
				}
			}
		}
	});
});

mj.module.directive('mjPanelFoot', function($compile) {
	return mj.buildDirective({
		name : "mjPanelFoot",
		require : [ '^?mjPanel' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.body = $element.find(".mj-panel-foot").first();
					$scope.$inner.getParentScope().$inner.addFoot($scope, $element, $attrs);
					$scope.$inner.hArray = [ "left", "right", "center" ];
					$scope.$inner.vArray = [ "top", "bottom", "middle" ];
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$scope.$inner.body.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isFalse($attrs.border)) {
							$scope.$inner.body.css({
								"border" : "none"
							});
						}
						if (mj.isNotEmpty($attrs.height)) {
							$scope.$inner.body.css({
								"height" : $attrs.height
							});
						}
						if ($.inArray($attrs.horizontal, $scope.$inner.hArray)) {
							$element.css({
								"align" : $attrs.horizontal
							});
						}
						if ($.inArray($attrs.vertical, $scope.$inner.vArray)) {
							$element.css({
								"vertical-align" : $attrs.vertical
							});
						}
					}
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					/**
					 * 添加子元素
					 */
					$scope.$outer.addChild = function(child) {
						if (!mj.isEmpty(child)) {
							var _dom = $compile(child)($scope.$new());
							$scope.$inner.body.append(_dom);
						}
						$scope.$inner.layout();
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 内部布局
					 */
					$scope.$inner.layout = function() {
						var parent = $scope.$parent;
						while (parent != null) {
							if ($.isFunction(parent.$outer.layout)) {
								parent.$outer.layout();
								return;
							} else {
								parent = parent.$parent;
							}
						}
					};

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $scope.$inner.body.width();
					};

					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $scope.$inner.body.height();
					};

					/**
					 * 添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$scope.$inner.body.addClass(cls);
					};

					/**
					 * 删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$scope.$inner.body.removeClass(cls);
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$scope.$inner.body.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildPanel = function(opts) {
	var tag = $("<mj-panel>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildPanelHead = function(opts) {
	var tag = $("<mj-panel-head>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildPanelBody = function(opts) {
	var tag = $("<mj-panel-body>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildPanelFoot = function(opts) {
	var tag = $("<mj-panel-foot>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};
