/**
 * 
 */

mj.module.directive('mjView', function($compile) {
	return mj.buildDirective({
		name : "mjView",
		compile : function($element, $attrs, $transclude) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.padding)) {
							$element.css({
								"padding" : $attrs.padding
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
					}
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
					 * 添加子元素
					 */
					$scope.$outer.addChild = function(child) {
						if (mj.isNotEmpty(child)) {
							var _dom = $compile(child)($scope.$new());
							$element.append(_dom);
						}
						mj.layoutView($attrs.id);
						return mj.getView(_dom.attr("id"));
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
mj.buildView = function(opts) {
	var tag = $("<mj-view>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};