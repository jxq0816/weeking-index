/**
 * 
 */

mj.module.directive('mjVbox', function($compile) {
	return mj.buildDirective({
		name : "mjVbox",
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
								var split = $(mj.templates.mjVboxSplit);
								var cell = split.find(".mj-vbox-split").first();
								cell.css({
									"height" : $attrs.split
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
						return item.el.find(".mj-vbox-scroll").first();
					};

					/**
					 * 内部方法：获取内容
					 */
					$scope.$inner.getCell = function(item) {
						return item.el.find(".mj-vbox-cell").first();
					};

					/**
					 * 内部方法：获取高度
					 */
					$scope.$inner.getHeight = function(showChildren) {
						var height = 0;
						if (showChildren.length > 0) {
							var splitHeight = 0;
							if (mj.isNumber($attrs.split)) {
								var splitHeight = (showChildren.length - 1) * $attrs.split;
							}
							height = ($element.innerHeight() - splitHeight);
						}
						return height;
					};

					/**
					 * 外部布局：布局方法
					 */
					$scope.$outer.layout = function() {
						$.each($scope.$inner.children, function(index, item) {
							var col = $scope.$inner.getCell(item);
							var scroll = $scope.$inner.getScroll(item);
							scroll.css({
								"display" : "none"
							});
							col.height("auto");
						});
						var showChildren = [];
						$.each($scope.$inner.children, function(index, item) {
							if (mj.isFalse(item.rs.hiddenFlag)) {
								showChildren.push(item);
							}
						});

						if ($attrs.model == "average") {
							$scope.$inner.buildAverage(showChildren);
						} else if ($attrs.model == "auto") {
							$scope.$inner.buildAuto(showChildren);
						} else {
							$scope.$inner.buildFit(showChildren);
						}
						mj.layoutView($attrs.id);
					};

					/**
					 * 内部方法：平均布局
					 */
					$scope.$inner.buildAverage = function(showChildren) {
						var height = 0;
						if (showChildren.length > 0) {
							height = $scope.$inner.getHeight(showChildren) / showChildren.length;
						}
						$.each(showChildren, function(index, item) {
							var col = $scope.$inner.getCell(item);
							if (index == showChildren.length - 1) {
							} else {
								col.css({
									"height" : height
								});
							}
						});
						$.each(showChildren, function(index, item) {
							var scroll = $scope.$inner.getScroll(item);
							scroll.height(scroll.parent().innerHeight());
							scroll.css({
								"display" : "block"
							});
						});
					};

					/**
					 * 内部方法：自动布局
					 */
					$scope.$inner.buildAuto = function(showChildren) {
						$element.height("auto");
						var height = $element.parent().innerHeight();
						$.each(showChildren, function(index, item) {
							var col = $scope.$inner.getCell(item);
							var scroll = $scope.$inner.getScroll(item);
							if (mj.isNotEmpty(item.rs.height)) {
								if (mj.endWith(item.rs.height, "%")) {
									var s = (height * parseInt(item.rs.height, 10)) / 100;
									col.height(s);
								} else {
									col.height(item.rs.height);
								}
								scroll.height(scroll.parent().innerHeight());
							}
							scroll.css({
								"display" : "block"
							});
						});
					};

					/**
					 * 内部方法：适应布局
					 */
					$scope.$inner.buildFit = function(showChildren) {
						$.each(showChildren, function(index, item) {
							var col = $scope.$inner.getCell(item);
							var scroll = $scope.$inner.getScroll(item);
							if (index == showChildren.length - 1) {
								scroll.height(col.innerHeight());
							} else {
								if (mj.isNotEmpty(item.rs.height)) {
									col.css({
										"height" : item.rs.height
									});
									scroll.height(col.innerHeight());
								}else{
									col.height(scroll.outerHeight(true));
								}
							}
							scroll.css({
								"display" : "block"
							});
						});
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
						var iview = $scope.$inner.buildVboxItem(opt);
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
					 * 内部方法：动态构建控件
					 */
					$scope.$inner.buildVboxItem = function(opts) {
						var tag = $("<mj-vbox-item>");
						$.each(opts, function(key, value) {
							tag.attr("data-" + key, value);
						});
						return tag;
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

mj.module.directive('mjVboxItem', function($compile, $timeout) {

	return mj.buildDirective({
		"name" : "mjVboxItem",
		require : [ '^?mjVbox' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$attrs.hiddenFlag = false;
					$scope.$inner.cell = $element.find(".mj-vbox-cell").first();
					$scope.$inner.scroll = $element.find(".mj-vbox-scroll").first();
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
						if (mj.isTrue($attrs.hidden)) {
							$attrs.hiddenFlag = true;
							$element.css({
								"display" : "none"
							});
						}
						
						if (mj.isNotEmpty(pScope.$outer.getAttrs().border) && mj.isFalse(pScope.$outer.getAttrs().border)) {
							$scope.$inner.cell.css({
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
					 * 外部方法：隐藏
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
					 * 外部方法：显示
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
									"display" : "table-row"
								});
							} else {
								$element.prev().css({
									"display" : "table-row"
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
mj.buildVbox = function(opts) {
	var tag = $("<mj-vbox>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildVboxItem = function(opts) {
	var tag = $("<mj-vbox-item>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};