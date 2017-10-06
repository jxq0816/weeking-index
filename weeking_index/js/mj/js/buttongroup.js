/**
 * 
 */

mj.module.directive('mjButtonGroup', function($compile) {
	return mj.buildDirective({
		name : "mjButtonGroup",
		template : function($element, $attrs) {
			return mj.templates.mjButtonGroup;
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
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					/**
					 * 删除空格
					 */
					$scope.$inner.build = function() {
						$element.contents().filter(function() {
							return this.nodeType === 3;
						}).remove();
					}

					$scope.$inner.build();

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

					/**
					 * 添加button
					 */
					$scope.$outer.addChild = function(opt) {
						var buttonName = "mj-button";
						var dom = null;
						if ((opt instanceof $) && opt.is(buttonName)) {
							dom = opt;
						} else if (mj.isJson(opt)) {
							dom = mj.buildButton(opt);
						} else {
							dom = null;
						}
						if (dom == null) {
							return null;
						}
						var view = $compile(dom)($scope.$new());
						$element.append(view);
						return view;
					}

					/**
					 * 添加多个button
					 */
					$scope.$outer.addChildren = function(opts) {
						var children = [];
						if (!$.isArray(opts)) {
							throw "非Array对象，请检查...";
							return;
						}
						$.each(opts, function(index, opt) {
							children.push($scope.$outer.addChild(opt));
						});
						return children;
					};

					/**
					 * 获取子元素
					 */
					$scope.$inner.getChild = function(child) {
						if (mj.isNotEmpty(child)) {
							var view = mj.getView(child.attr("data-id"));
							if (mj.isNotEmpty(view)) {
								return view;
							} else {
								return null;
							}
						} else {
							return null;
						}
					}

					/**
					 * 根据所有子元素
					 */
					$scope.$outer.getChildren = function() {
						var children = $element.find("div[data-tag='mjButton']");
						var _children = [];
						$.each(children, function(_index, _child) {
							_children.push($scope.$inner.getChild(child));
						});
					};

					/**
					 * 根据索引获取button
					 */
					$scope.$outer.getChildByIndex = function(index) {
						var children = $element.find("div[data-tag='mjButton']");
						var child = null;
						$.each(children, function(_index, _child) {
							if (_index == index) {
								child = _child;
								return false;
							}
						});
						return $scope.$inner.getChild(child);
					};

					/**
					 * 根据id获取button
					 */
					$scope.$outer.getChildById = function(id) {
						var children = $element.find("div[data-tag='mjButton']");
						var child = null;
						$.each(children, function(_index, _child) {
							if (_child.attr("data-id") == id) {
								child = _child;
								return false;
							}
						});
						return $scope.$inner.getChild(child);
					};

					/**
					 * 删除所有button
					 */
					$scope.$outer.removeChildren = function() {
						var children = $element.find("div[data-tag='mjButton']");
						$.each(children, function(_index, _child) {
							var child = $scope.$outer.getChildByIndex(index);
							if (mj.isNotEmpty(view)) {
								view.destroy();
							}
						});
					};

					/**
					 * 根据索引删除button
					 */
					$scope.$outer.removeChildByIndex = function(index) {
						var child = $scope.$outer.getChildByIndex(index);
						if (mj.isNotEmpty(view)) {
							view.destroy();
						}
					};

					/**
					 * 根据id删除button
					 */
					$scope.$outer.removeChildById = function(id) {
						var child = $scope.$outer.getChildByIndex(index);
						if (mj.isNotEmpty(view)) {
							view.destroy();
						}
					};
				}
			}
		}
	});
});
/**
 * 动态添加控件
 */
mj.buildButtonGroup = function(opts) {
	var tag = $("<mj-button-group>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};