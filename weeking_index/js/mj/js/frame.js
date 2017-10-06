/**
 * 
 */

mj.module.directive('mjFrame', function($compile) {
	return mj.buildDirective({
		name : "mjFrame",
		compile : function($element, $attrs, $transclude) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.height)) {
							$element.attr({
								"height" : $attrs.height
							});
						}
						if (mj.isNotEmpty($attrs.width)) {
							$element.attr({
								"width" : $attrs.width
							});
						}

						$scope.$outer.setScrollable();

					}

					$scope.$outer.setScrollable = function() {
						if (mj.isNotEmpty($attrs.scrollable)) {
							if (mj.isTrue($attrs.scrollable)) {
								$element.attr({
									"scrolling" : "yes"
								});
							} else if (mj.isFalse($attrs.scrollable)) {
								$element.attr({
									"scrolling" : "no"
								});
							} else {
								$element.attr({
									"scrolling" : "auto"
								});
							}
						}
					};

					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					$scope.$inner.build = function() {
						$scope.$outer.setAction($attrs.view, $attrs.cachable, $attrs.load);
					};

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					

					/**
					 * 设置宽度
					 */
					$scope.$outer.setWidth = function(width) {
						$element.attr({
							"width" : width
						});
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
						$element.attr({
							"height" : height
						});
					};
					
					/**
					 * 设置滚动条
					 */
					$scope.$outer.setScrollable = function(scroll) {
						$element.attr({
							"scrolling" : scroll
						});
					};


					/**
					 * 设置ACTION
					 */
					$scope.$outer.setAction = function(view, cachable, loadFunc) {
						if (mj.isNotEmpty(view)) {
							if (mj.isTrue(cachable)) {
								if (view.indexOf("?") > -1) {
									var date = new Date();
									$element.attr({
										"src" : view + "&_timestamp=" + date.getTime()
									});
								} else {
									$element.attr({
										"src" : view
									});
								}
							} else {
								$element.attr({
									"src" : view
								});
							}
							if (mj.isNotEmpty(loadFunc)) {
								var func = null;
								if ($.isFunction(loadFunc)) {
									func = loadFunc;
								} else if ($.isFunction(mj.findCtrlScope($scope)[loadFunc])) {
									func = mj.findCtrlScope($scope)[loadFunc];
								}
								if ($.isFunction(func)) {
									$element.on("load", function() {
										func($scope.$outer);
									});
								}
							}
						}
					};

					$scope.$inner.build();
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildFrame = function(opts) {
	var tag = $("<mj-frame>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};