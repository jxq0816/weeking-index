/**
 * 
 */
mj.module.directive('mjToolbar', function($compile) {
	return mj.buildDirective({
		name : "mjToolbar",
		template : function($element, $attrs) {
			return mj.templates.mjToolbar;
		},
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.row = $element.find(".mj-toolbar-row").first();
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
						if (mj.isNumber($attrs.height)) {
							$element.css({
								"height" : $attrs.height
							});
						}
						if (mj.isNumber($attrs.width)) {
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
					 * 外部方法：添加子元素
					 */
					$scope.$outer.addChild = function(opt) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						var iview = $scope.$inner.buildToolbarItem(opt);
						var _dom = $compile(iview)($scope.$new());
						$scope.$inner.row.append(_dom);
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
					$scope.$inner.buildToolbarItem = function(opts) {
						var tag = $("<mj-toolbar-item>");
						$.each(opts, function(key, value) {
							tag.attr("data-" + key, value);
						});
						return tag;
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

mj.module.directive('mjToolbarItem', function($compile) {
	return mj.buildDirective({
		name : "mjToolbarItem",
		require : [ '^?mjToolbar' ],
		template : function($element, $attrs) {
			return mj.templates.mjToolbarItem;
		},
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
						if (mj.isNumber($attrs.width)) {
							$element.css({
								"width" : $attrs.width
							});
						}
						if (!mj.isEmpty($attrs.horizontal)) {
							$element.css({
								"text-align" : $attrs.horizontal
							});
						}
						if (!mj.isEmpty($attrs.vertical)) {
							$element.css({
								"vertical-align" : $attrs.vertical
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

/**
 * 动态构建控件
 */
mj.buildToolbar = function(opts) {
	var tag = $("<mj-toolbar>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildToolbarItem = function(opts) {
	var tag = $("<mj-toolbar-item>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};