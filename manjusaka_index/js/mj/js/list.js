/**
 * 
 */
mj.module.directive('mjList', function($compile) {
	return mj.buildDirective({
		name : "mjList",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.children = [];

					/**
					 * 添加元素
					 */
					$scope.$inner.addChild = function(sc, el, rs) {
						rs.opts = $scope.$inner.child_opts;
						$scope.$inner.children.splice($scope.$inner.childIndex, 0, {
							"sc" : sc,
							"el" : el,
							"rs" : rs
						});
					};

					/**
					 * 删除元素
					 */
					$scope.$inner.delChild = function(id) {
						$.each($scope.$inner.children, function(index, child) {
							if (child.rs.id == id) {
								$scope.$inner.children.splice(index, 1);
							}
						});
					};

					$scope.$inner.table = $element.find(".mj-list-table").first();
					$scope.$inner.scroll = $element.find(".mj-list-scroll").first();
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
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
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.build = function() {

					};

					$scope.$outer.layout = function() {
						$scope.$inner.scroll.css({
							"display" : "none"
						});
						if ($attrs.height != "auto") {
							$scope.$inner.scroll.css({
								"height" : $scope.$inner.scroll.parent().innerHeight()
							});
						}
						$scope.$inner.scroll.css({
							"display" : "block"
						});
					};

					/**
					 * 添加子元素
					 */
					$scope.$outer.addChild = function(opt) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						$scope.$inner.child_opts = opt;
						var iview = $scope.$inner.buildListItem(opt);
						var _dom = $compile(iview)($scope.$new());
						$scope.$inner.table.append(_dom);
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 添加子元素
					 */
					$scope.$outer.insertChild = function(opt, index) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						$scope.$inner.child_opts = opt;
						$scope.$inner.childIndex = $scope.$inner.children.length;
						var iview = $scope.$inner.buildListItem(opt);
						var _dom = $compile(iview)($scope.$new());
						if (index < 1) {
							$scope.$inner.childIndex = 0;
							_dom.insertBefore($scope.$inner.table.children()[0]);
						} else if (index >= $scope.$inner.children.length) {
							$scope.$inner.childIndex = $scope.$inner.children.length;
							$scope.$inner.table.append(_dom);
						} else {
							$scope.$inner.childIndex = index - 1;
							_dom.insertBefore($scope.$inner.table.children()[index - 1]);
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
							$scope.$outer.addChild(opt);
						});
					};

					/**
					 * 动态构建控件
					 */
					$scope.$inner.buildListItem = function(opts) {
						var tag = $("<mj-list-item>");
						$.each(opts, function(key, value) {
							if (key != "render") {
								tag.attr("data-" + key, value);
							}
						});
						return tag;
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
						var field = null;
						$.each($scope.$inner.children, function(index, child) {
							if (child.rs.id == id) {
								field = child.sc.$outer;
								return false;
							}
						});
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

mj.module.directive('mjListItem', function($compile) {
	return mj.buildDirective({
		name : "mjListItem",
		require : [ '^?mjList' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.cell = $element.find(".mj-list-table-cell").first();
					$scope.$inner.init = function() {
						if (mj.isNumber($attrs.height)) {
							$scope.$inner.cell.css({
								"height" : $attrs.height
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var pScope = $scope.$parent.$parent;
					pScope.$inner.addChild($scope, $element, $attrs);
					$scope.$inner.build = function() {
						if (!mj.isEmpty($attrs.opts)) {
							if (!mj.isEmpty($attrs.opts.render)) {
								if ($.isFunction($attrs.opts.render)) {
									var iview = $attrs.opts.render($attrs.opts.dataset);
									var _dom = $compile(iview)($scope.$new());
									$scope.$inner.cell.append(_dom);
								}
							}
						}
					};
					$scope.$inner.build();

					/**
					 * 隐藏
					 */
					$scope.$outer.getIndex = function() {
						$.each(pScope.$inner.children, function(index, child) {
							if (child.rs.id == $attrs.id) {
								return index;
							}
						});
					};

					/**
					 * 隐藏
					 */
					$scope.$outer.hide = function() {
						$element.hide();
					};

					/**
					 * 显示
					 */
					$scope.$outer.show = function() {
						$element.show();
					};

					/**
					 * 删除
					 */
					$scope.$outer.remove = function() {
						$element.remove();
						$scope.$inner.delChild($attrs.id);
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
					 * 设置高度
					 */
					$scope.$outer.setHeight = function(height) {
						if ($.isNumeric(height)) {
							$scope.$inner.cell.height(height);
						}
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
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildList = function(opts) {
	var tag = $("<mj-list>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildListItem = function(opts) {
	var tag = $("<mj-list-item>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};