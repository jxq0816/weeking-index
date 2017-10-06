/**
 * 
 */

mj.module.directive('mjGrid', function($compile) {
	return mj.buildDirective({
		name : "mjGrid",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.children = [];
					$scope.$inner.addChild = function(sc, el, rs) {
						rs.opts = $scope.$inner.child_opts;
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
						$element.parent().css({
							"text-align" : "center"
						});
						if ($attrs.border == "false" || $attrs.border == false) {
							$element.css({
								"border" : "none"
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
						$scope.$inner.getColumnWidth();
					};
					$scope.$inner.getColumnWidth = function() {
						switch (parseInt($attrs.column, 10)) {
						case 1:
							$scope.$inner.columnWidth = 100;
							break;
						case 2:
							$scope.$inner.columnWidth = 50;
							break;
						case 3:
							$scope.$inner.columnWidth = 33.33;
							break;
						case 4:
							$scope.$inner.columnWidth = 25;
							break;
						case 5:
							$scope.$inner.columnWidth = 20;
							break;
						case 6:
							$scope.$inner.columnWidth = 16.66;
							break;
						case 7:
							$scope.$inner.columnWidth = 14.28;
							break;
						case 8:
							$scope.$inner.columnWidth = 12.5;
							break;
						case 9:
							$scope.$inner.columnWidth = 11.11;
							break;
						case 10:
							$scope.$inner.columnWidth = 10;
							break;
						case 11:
							$scope.$inner.columnWidth = 9.09;
							break;
						case 12:
							$scope.$inner.columnWidth = 8.33;
							break;
						default:
							$scope.$inner.columnWidth = 100;
						}
						return $scope.$inner.columnWidth;
					};
					$scope.$inner.getColumn = function() {
						if ($.isNumeric($attrs.column)) {
							return $attrs.column;
						} else {
							return 1;
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					$scope.$inner.build = function() {
						$.each($scope.$inner.children, function(index, child) {
							child.el.addClass();
						});
					};

					$scope.$outer.layout = function() {
						// $scope.$inner.layoutItem();
					};

					/**
					 * 布局子项
					 */
					$scope.$inner.layoutItem = function() {
						$.each($scope.$inner.children, function(index, child) {
							var width = $scope.$inner.columnWidth * parseInt(child.rs.colspan, 10) + "%";
							child.el.width(width);
						});
					};

					/**
					 * 添加子元素
					 */
					$scope.$outer.addChild = function(opt, layoutFlag) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						$scope.$inner.child_opts = opt;
						var iview = $scope.$inner.buildGridItem(opt);
						var _dom = $compile(iview)($scope.$new());
						$element.append(_dom);
						$scope.$outer.layout();
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
					 * 批量添加子元素
					 */
					$scope.$outer.addChildren = function(opts) {
						if (!$.isArray(opts)) {
							throw "非Array对象，请检查...";
							return;
						}
						$.each(opts, function(index, opt) {
							$scope.$outer.addChild(opt, false);
						});
						$scope.$outer.layout();
					};

					/**
					 * 动态构建控件
					 */
					$scope.$inner.buildGridItem = function(opts) {
						var tag = $("<mj-grid-item>");
						$.each(opts, function(key, value) {
							if (!$.isFunction(value)) {
								tag.attr("data-" + key, value);
							}
						});
						return tag;
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
					 * 获取子元素
					 */
					$scope.$outer.getChildren = function() {
						var children = [];
						$.each($scope.$inner.children, function(index, child) {
							children.push(child.sc.$outer);
						});
						return children;
					};

					/**
					 * 根据索引获取子元素
					 */
					$scope.$outer.getChildByIndex = function(index) {
						$scope.$inner.children[index].sc.$outer;
					};

					/**
					 * 根据主键获取子元素
					 */
					$scope.$outer.getChildById = function(id) {
						var _child = null;
						$.each($scope.$inner.children, function(index, child) {
							if (child.rs.id == id) {
								_child = child.sc.$outer;
								return false;
							}
						});
						return _child;
					};

					/**
					 * 根据主键删除子元素
					 */
					$scope.$outer.removeChildById = function(id) {
						var _child = null;
						var _index = -1;
						$.each($scope.$inner.children, function(index, child) {
							if (child.rs.id == id) {
								_child = child;
								_index = index;
								return false;
							}
						});
						if (mj.isNotEmpty(_child)) {
							$scope.$inner.children.splice(_index, 1);
							_child.sc.$outer.destroy();
						}
						$scope.$outer.layout();
					};

					/**
					 * 删除所有元素
					 */
					$scope.$outer.removeChildren = function() {
						$.each($scope.$inner.children, function(index, child) {
							child.sc.$outer.destroy();
						});
						if ($scope.$inner.children.length > 0) {
							$scope.$inner.children.splice(0, $scope.$inner.children.length);
						}
						$scope.$outer.layout();
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : color
							});
						}
					};
				}
			}
		}
	});
});

mj.module.directive('mjGridItem', function($compile) {
	return mj.buildDirective({
		name : "mjGridItem",
		require : [ '^?mjGrid' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNumber($attrs.height)) {
							$element.css({
								"height" : $attrs.height
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var gridScope = $scope.$parent.$parent;
					gridScope.$inner.addChild($scope, $element, $attrs);
					$scope.$inner.build = function() {
						if (mj.isEmpty($attrs.colspan)) {
							$attrs.colspan = 1;
						}
						if ($attrs.colspan < 1) {
							$attrs.colspan = 1;
						}
						if ($attrs.colspan > gridScope.$inner.getColumn()) {
							$attrs.colspan = gridScope.$inner.getColumn();
						}
						var width = gridScope.$inner.getColumnWidth() * parseInt($attrs.colspan, 10) + "%";
						$element.width(width);

						if (!mj.isEmpty($attrs.opts)) {
							if (!mj.isEmpty($attrs.opts.render)) {
								if ($.isFunction($attrs.opts.render)) {
									var iview = $attrs.opts.render($attrs.opts.dataset);
									var _dom = $compile(iview)($scope.$new());
									$element.append(iview);
								}
							}
						}
					};
					$scope.$inner.build();

					/**
					 * 添加子元素
					 */
					$scope.$outer.addChild = function(child) {
						if (!mj.isEmpty(child)) {
							var _dom = $compile(child)($scope.$new());
							$element.append(_dom);
						}
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
								"background-color" : color
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
mj.buildGrid = function(opts) {
	var tag = $("<mj-grid>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

/**
 * 动态构建控件
 */
mj.buildGridItem = function(opts) {
	var tag = $("<mj-grid-item>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};