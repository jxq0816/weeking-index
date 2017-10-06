mj.module.directive('mjInclude', function($compile, $templateRequest) {
	return mj.buildDirective({
		name : "mjInclude",
		compile : function($element, $attrs, $transclude) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);

					/**
					 * 加载相关文件
					 */
					$scope.$inner.loadResource = function() {
						// 加载相关文件
						if (!mj.isEmpty($attrs.view) && !mj.isEmpty($attrs.controller)) {
							mj.loadResource($attrs.view, $attrs.controller, $attrs.controllerAlias);
						}
					};
					$scope.$inner.loadResource();
					/**
					 * 初始化函数
					 */
					$scope.$inner.init = function() {
						if ($attrs.switchFlag == true || $attrs.switchFlag == "true") {
							$scope.$inner.switchFlag = true;
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					/**
					 * 判断是否有控制器
					 */
					$scope.$outer.hasController = function() {
						if (mj.isEmpty($attrs.view) || mj.isEmpty($attrs.controller)) {
							return false;
						} else {
							return true;
						}
					};

					/**
					 * 布局函数
					 */
					$scope.$outer.layout = function() {
						var body = $element.find(".mj-include-body:first-child");
						if ($.isEmptyObject($attrs.height)) {
							body.css({
								"display" : "none"
							});
							body.css({
								"display" : "block"
							});
						}
					};

					/**
					 * 内部构建函数
					 */
					$scope.$inner.build = function() {
						$templateRequest($attrs.view).then(function(html) {
							var body = $('<div class="mj-include-body"></div>');
							if ($scope.$outer.hasController()) {
								if (mj.isEmpty($attrs.controllerAlias)) {
									body.attr("ng-controller", $attrs.controller);
								} else {
									body.attr("ng-controller", $attrs.controllerAlias);
								}
							}
							body.html(html);
							var _dom = $compile(body)($scope.$new());
							$element.append(_dom);
							$scope.$inner.buildParam();
							mj.layoutView($attrs.id);
						});
					};

					/**
					 * 内部参数构建函数
					 */
					$scope.$inner.buildParam = function() {
						if ($scope.$outer.hasController()) {
							var childScope = $scope.$$childHead.$$childHead;
							childScope.$ctrlName = $attrs.controller;
							if (!mj.isEmpty($attrs.load)) {
								var func = childScope[$attrs.load];
								if (!mj.isEmpty($attrs.param)) {
									var parentScope = mj.findCtrlScope($scope);
									if ($scope.$inner.switchFlag) {
										var _p = mj.includeMap[$attrs.id];
										if (!mj.isEmpty(_p)) {
											delete mj.includeMap[$attrs.id];
										}
										if ($.isFunction(func)) {
											func(_p);
										}
									} else {// 切换时候传参
										if ($.isFunction(func)) {
											func(parentScope[$attrs.param]);
										}
									}
								} else {
									if ($.isFunction(func)) {
										func();
									}
								}
							}
						}
					};

					/**
					 * 切换视图函数
					 */
					$scope.$outer.switchView = function(opts) {
						$scope.$inner.switchFlag = true;
						$attrs.view = opts.view;
						$attrs.controller = opts.controller;
						$attrs.load = opts.load;
						$attrs.param = opts.param;
						mj.includeMap[$attrs.id] = opts.param;
						var children = $element.find("*[data-tag*='mj']");
						for (var i = children.length - 1; i >= 0; i--) {
							var view = mj.getView($(children[i]).attr("id"));
							if (!mj.isEmpty(view)) {
								if ($.isFunction(view.destroy)) {
									view.destroy();
								}
							}
						}
						$element.empty();
						delete $scope.$$childHead;
						if ($scope.$$childHead) {
							$scope.$$childHead = null;
						}
						$scope.$inner.loadResource();
						$scope.$inner.build();
					};
					$scope.$inner.build();

					/**
					 * 外部方法：获取子节点
					 */
					$scope.$outer.getChildren = function() {
						return [ $scope.$$childHead.$$childHead.$$childHead.$outer ];
					};
				}
			}
		}
	});
});

mj.buildInclude = function(opts) {
	var tag = $("<mj-include>");
	if (mj.isEmpty(opts.id)) {
		opts.id = mj.key();
	}
	if (mj.checkView(opts.id)) {
		throw "[" + opts.id + "]：已存在，id不能重复，请检查...";
	}
	if (!mj.isEmpty(opts.param)) {
		mj.includeMap[opts.id] = opts.param;
	}
	// delete opts.param;
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	tag.attr("data-switch-flag", "true");
	return tag;
};