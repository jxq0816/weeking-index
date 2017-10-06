/**
 * 
 */

mj.module.directive('mjMarquee', function($compile) {
	return mj.buildDirective({
		name : "mjMarquee",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.index = 0;
					$scope.$inner.interval = 3000;
					$scope.$inner.left = $element.find(".mj-marquee-left").first();
					$scope.$inner.right = $element.find(".mj-marquee-right").first();
					$scope.$inner.center = $element.find(".mj-marquee-center").first();
					$scope.$inner.bottom = $element.find(".mj-marquee-bottom").first();
					$scope.$inner.children = [];
					$scope.$inner.addChild = function(sc, el, rs) {
						$scope.$inner.children.push({
							"sc" : sc,
							"el" : el,
							"rs" : rs
						});
						if (mj.isNumber($attrs.interval)) {
							if ($attrs.interval < 3) {
								$attrs.interval = 3;
							}
							$scope.$inner.interval = $attrs.interval * 1000;
						}
					};
					$scope.$inner.init = function() {
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
					$scope.$inner.build = function() {
						$scope.$inner.buildButton();
						$scope.$inner.buildLeft();
						$scope.$inner.buildRight();
						$scope.$outer.run();
					};
					$scope.$inner.buildLeft = function() {
						$scope.$inner.left.on("click", function() {
							$scope.$outer.stop();
							$scope.$inner.buildPrev();
							var button = $scope.$inner.getButton();
							$scope.$inner.switcher(button);
							$scope.$outer.run();
						});
					};

					$scope.$inner.buildRight = function() {
						$scope.$inner.right.on("click", function() {
							$scope.$outer.stop();
							$scope.$inner.buildNext();
							var button = $scope.$inner.getButton();
							$scope.$inner.switcher(button);
							$scope.$outer.run();
						});
					};

					$scope.$inner.getButton = function() {
						return $scope.$inner.bottom.find(".mj-marquee-button:eq(" + $scope.$inner.index + ")");
					};

					$scope.$inner.buildButton = function() {
						$.each($scope.$inner.children, function(index, child) {
							var _buttons = $scope.$inner.bottom.find("[data-pid='" + child.rs.id + "']").first();
							if (_buttons.length == 0) {
								var btn = $('<i class="fa fa-circle"></i>');
								btn.appendTo($scope.$inner.bottom);
								btn.addClass("mj-marquee-button");
								btn.attr({
									"data-pid" : child.rs.id
								});
								btn.on("click", function() {
									$scope.$outer.stop();
									$scope.$inner.switcher($(this));
									$scope.$outer.run();
								});
							}
						});
					};

					$scope.$outer.run = function() {
						if (mj.isNotEmpty($scope.$inner.intervalObj)) {
							return;
						}
						$scope.$inner.intervalObj = window.setInterval(function() {
							if ($scope.$inner.children.length == 0) {
								return;
							}
							$scope.$inner.buildNext();
							var button = $scope.$inner.getButton();
							$scope.$inner.switcher(button);
						}, $scope.$inner.interval);
					};

					$scope.$outer.stop = function() {
						if (mj.isNotEmpty($scope.$inner.intervalObj)) {
							window.clearInterval($scope.$inner.intervalObj);
							$scope.$inner.intervalObj = null;
						}
					};

					$scope.$inner.switcher = function(button) {
						$.each($scope.$inner.children, function(index, child) {
							var _button = $scope.$inner.bottom.find("[data-pid='" + child.rs.id + "']").first();
							if (button.attr("data-pid") == _button.attr("data-pid")) {
								button.addClass("mj-marquee-button-show");
								child.el.css({
									"display" : "block"
								});
								$scope.$inner.index = index;
							} else {
								child.el.css({
									"display" : "none"
								});
								_button.removeClass("mj-marquee-button-show");
							}
						});

					};

					$scope.$inner.buildNext = function() {
						if ($scope.$inner.index + 1 == $scope.$inner.children.length) {
							$scope.$inner.index = 0;
						} else {
							$scope.$inner.index++;
						}
					};

					$scope.$inner.buildPrev = function() {
						if ($scope.$inner.index == 0) {
							$scope.$inner.index = $scope.$inner.children.length - 1;
						} else {
							$scope.$inner.index--;
						}
					};

					/**
					 * 添加子元素
					 */
					$scope.$outer.addChild = function(opt) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						var iview = $scope.$inner.buildMarqueeItem(opt);
						var _dom = $compile(iview)($scope.$new());
						$scope.$inner.center.append(_dom);
						$scope.$inner.buildButton();
						return mj.getView(_dom.attr("id"));
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
					$scope.$inner.buildMarqueeItem = function(opts) {
						var tag = $("<mj-marquee-item>");
						$.each(opts, function(key, value) {
							tag.attr("data-" + key, value);
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
					 * 根据索引获取子元素
					 */
					$scope.$outer.getChildById = function(id) {
						$.each($scope.$inner.children, function(index, child) {
							if (child.rs.id == id) {
								return child.sc.$outer;
							}
						});
					};

					$scope.$inner.build();
				}
			}
		}
	});
});

mj.module.directive('mjMarqueeItem', function($compile) {

	return mj.buildDirective({
		"name" : "mjMarqueeItem",
		require : [ '^?mjMarquee' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.init = function() {

					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var pScope = $scope.$inner.getParentScope();
					pScope.$inner.addChild($scope, $element, $attrs);
					$scope.$inner.build = function() {
						$element.on("click", function() {
							if (!mj.isEmpty($attrs.click)) {
								if ($.isFunction(mj.findCtrlScope($scope)[$attrs.click])) {
									mj.findCtrlScope($scope)[$attrs.click]($scope.$outer);
								}
							}
						});
					};
					$scope.$inner.build();

					$scope.$outer.addChild = function(obj) {
						if (mj.isEmpty(obj)) {
							return;
						}
						var _dom = $compile(obj)($scope.$new());
						$element.append(_dom);
						return mj.getView(_dom.attr("id"));
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
mj.buildMarquee = function(opts) {
	var tag = $("<mj-marquee>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};