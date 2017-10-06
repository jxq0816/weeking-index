/**
 * 
 */

mj.module.directive('mjHbox', function($compile) {
	return mj.buildDirective({
		name : "mjHbox",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.children = [];
					$scope.$inner.addChild = function(sc, el, rs) {
						$scope.$inner.children.push({
							"sc" : sc,
							"el" : el,
							"rs" : rs
						});
					};
					$scope.$inner.init = function() {
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
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					/**
					 * 内部方法：构建函数
					 */
					$scope.$inner.build = function() {
						if ($.isNumeric($attrs.split)) {
							$.each($scope.$inner.children, function(index, item) {
								var split = $(mj.templates.mjHboxSplit);
								split.css({
									"width" : $attrs.split
								});
								if (index != $scope.$inner.children.length - 1) {
									split.insertAfter(item.el);
								}
								if (mj.isTrue(item.rs.hidden)) {
									split.css({
										"display" : "none"
									});
								}
							});
						}
					};

					/**
					 * 内部方法：获取滚动内容
					 */
					$scope.$inner.getScroll = function(item) {
						return item.el.find(".mj-hbox-scroll").first();
					};

					/**
					 * 外部布局：布局方法
					 */
					$scope.$outer.layout = function() {
						$.each($scope.$inner.children, function(index, item) {
							var scroll = $scope.$inner.getScroll(item);
							scroll.css({
								"display" : "none"
							});
						});
						$.each($scope.$inner.children, function(index, item) {
							if (mj.isFalse(item.rs.hiddenFlag)) {
								if (mj.isNotEmpty(item.rs.width)) {
									item.el.width(item.rs.width);
								}
								var scroll = $scope.$inner.getScroll(item);
								if ($attrs.height != "auto") {
									scroll.css({
										"height" : scroll.parent().innerHeight(),
									});
								}
								scroll.css({
									"display" : "block"
								});
							}
						});
						mj.layoutView($attrs.id);
					};

					$scope.$inner.build();

					/**
					 * 外部方法：添加子元素
					 */
					$scope.$outer.addChild = function(opt) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						var iview = mj.buildHboxItem(opt);
						var _dom = $compile(iview)($scope.$new());
						$element.append(_dom);
						$scope.$outer.layout();
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 外部方法：批量添加子元素
					 */
					$scope.$outer.addChildren = function(opts) {
						if (!$.isArray(opts)) {
							throw "非Array对象，请检查...";
							return;
						}
						$.each(opts, function(index, opt) {
							$scope.$outer.addChild(opt);
						});
						$scope.$outer.layout();
					};

					/**
					 * 外部方法：获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 外部方法：获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 外部方法：添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$element.addClass(cls);
					};

					/**
					 * 外部方法：删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$element.removeClass(cls);
					};

					/**
					 * 外部方法：获取子元素
					 */
					$scope.$outer.getChildren = function() {
						var children = [];
						$.each($scope.$inner.children, function(index, child) {
							children.push(child.sc.$outer);
						});
						return children;
					};

					/**
					 * 外部方法：根据索引获取子元素
					 */
					$scope.$outer.getChildByIndex = function(index) {
						if ($scope.$inner.children[index - 1]) {
							return $scope.$inner.children[index - 1].sc.$outer;
						} else {
							return null;
						}
					};

					/**
					 * 外部方法：根据id获取子元素
					 */
					$scope.$outer.getChildById = function(id) {
						var _$outer = null;
						$.each($scope.$inner.children, function(index, child) {
							if (child.rs.id == id) {
								_$outer = child.sc.$outer;
								return false;
							}
						});
						return _$outer;
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

mj.module.directive('mjHboxItem', function($compile) {
	return mj.buildDirective({
		name : "mjHboxItem",
		require : [ '^?mjHbox' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$attrs.hiddenFlag = false;
					$scope.$inner.scroll = $element.find(".mj-hbox-scroll").first();
					var pScope = $scope.$inner.getParentScope();
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

						if (mj.isTrue($attrs.hidden) || mj.isTrue($attrs.hidable)) {
							$attrs.hiddenFlag = true;
							$element.css({
								"display" : "none"
							});
						}
						
						if (mj.isFalse(pScope.$outer.getAttrs().border)) {
							$element.css({
								"border" : "none"
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var pScope = $scope.$inner.getParentScope();
					pScope.$inner.addChild($scope, $element, $attrs);

					/**
					 * 外部方法：添加子元素
					 */
					$scope.$outer.addChild = function(child) {
						if (!mj.isEmpty(child)) {
							var _dom = $compile(child)($scope.$new());
							$scope.$inner.body.append(_dom);
						}
						pScope.$outer.layout();
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 外部方法：隐藏函数
					 */
					$scope.$outer.hide = function() {
						if (mj.isTrue($attrs.hiddenFlag)) {
							return;
						}
						$attrs.hiddenFlag = true;
						$element.hide();
						if (mj.isNumber(pScope.$outer.getAttrs().split)) {
							if (mj.isNotEmpty($element.next())) {
								$element.next().css({
									"display" : "none"
								});
							} else {
								$element.prev().css({
									"display" : "none"
								});
							}
						}
						pScope.$outer.layout();
					};

					/**
					 * 外部方法：显示函数
					 */
					$scope.$outer.show = function() {
						if (mj.isFalse($attrs.hiddenFlag)) {
							return;
						}
						$attrs.hiddenFlag = false;
						$element.show();
						if (mj.isNumber(pScope.$outer.getAttrs().split)) {
							if (mj.isNotEmpty($element.next())) {
								$element.next().css({
									"display" : "table-cell"
								});
							} else {
								$element.prev().css({
									"display" : "table-cell"
								});
							}
						}
						pScope.$outer.layout();
					};

					/**
					 * 外部方法：获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $scope.$inner.scroll.width();
					};
					/**
					 * 外部方法：获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $scope.$inner.scroll.height();
					};

					/**
					 * 外部方法：添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$element.addClass(cls);
					};

					/**
					 * 外部方法：删除样式
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

/**
 * 动态构建控件
 */
mj.buildHbox = function(opts) {
	var tag = $("<mj-hbox>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildHboxItem = function(opts) {
	var tag = $("<mj-hbox-item>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};