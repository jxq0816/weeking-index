mj.module.directive('mjViewport', function($rootScope, $compile) {
	return mj.buildDirective({
		name : "mjViewport",
		compile : function($element, $attrs, $transclude) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.$rootScope = $rootScope;
					mj.compile = function(html) {
						return $compile(html)($rootScope.$new());
					};
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
						if ($attrs.scroll == "true") {
							$element.css({
								"height" : $(document.body).innerHeight(),
								"with" : $(document.body).innerWidth(),
								"overflow" : "auto"
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
						if (!$.isEmpty(child)) {
							var _dom = $compile(child)($scope.$new());
							$element.append(_dom);
						}
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
					 * 获取是否滚动
					 */
					$scope.$outer.getScroll = function() {
						if ($attrs.scroll == "true") {
							return true;
						} else {
							return false;
						}
					};

					/**
					 * 布局方法
					 */
					$scope.$outer.layout = function() {
						if ($attrs.scroll == "true") {
							$element.css({
								"height" : $(document.body).innerHeight(),
								"overflow" : "auto"
							});
						}
						mj.layoutView($attrs.id);
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
					$scope.$outer.layout();
				}
			}
		}
	});
});