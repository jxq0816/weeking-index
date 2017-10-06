/**
 * 
 */

mj.module.directive('mjForm', function($compile) {
	return mj.buildDirective({
		name : "mjForm",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.children = [];
					$scope.$inner.addChild = function(child) {
						$scope.$inner.children.push(child);
					};
					$scope.$inner.body = $element.find(".mj-form-body").first();
					$scope.$inner.columnWidth = "100%";
					$scope.$inner.init = function() {
						if (mj.isEmpty($attrs.layout)) {
							$attrs.layout = "horizontal";
						}
						if (mj.isEmpty($attrs.column)) {
							$attrs.column = 1;
						}
						$element.parent().css({
							"text-align" : "center"
						});
						if ($attrs.border == "false" || $attrs.border == false) {
							$scope.$inner.body.css({
								"border" : "none"
							});
						}

						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$scope.$inner.body.css({
								"background-color" : $attrs.backgroundColor
							});
						}

						if (!$.isEmptyObject($attrs.height)) {
							$scope.$inner.body.css({
								"height" : $attrs.height
							});
						}

						if (!$.isEmptyObject($attrs.width)) {
							$scope.$inner.body.css({
								"width" : $attrs.width
							});
						}

						$element.attr({
							"name" : $attrs.name,
							"enctype" : $attrs.enctype,
							"target" : $attrs.target
						});

						$scope.$inner.getColumnWidth();

					};
					$scope.$inner.getColumn = function() {
						if (mj.isEmpty($attrs.column)) {
							$attrs.column = 1;
						}
						return $attrs.column;
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
					$scope.$inner.init();

				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					$scope.$outer.setEditable = function(flag) {
						if (mj.isBoolean(flag)) {
							$.each($scope.$inner.children, function(index, item) {
								item.setEditable(flag);
							});
							$scope.$outer.layout();
						}
					};

					$scope.$inner.build = function() {
						$scope.$outer.setEditable($attrs.editable);
					}

					// 获得form对象中所有控件的value，返回json，键为控件name，值为控件输入值
					$scope.$outer.getValue = function() {
						var json = {};
						$.each($scope.$inner.children, function(index, item) {
							json[item.getName()] = item.getValue();
						});
						return json;
					}

					// 对form下面所有控件进行校验认证，全部通过返回true，有一项不通过返回false
					$scope.$outer.getValidate = function() {
						var flag = true;
						var cun = 0;
						$.each($scope.$inner.children, function(index, item) {
							flag = item.validity();
							if (!flag) {
								cun++;
							}
						});
						if (cun > 0) {
							return false;
						} else {
							return true;
						}
					}
					// 设置form对象中所有控件的value，参数为json，键为控件name，值为控件输入值
					$scope.$outer.setValue = function(json) {
						$.each($scope.$inner.children, function(index, item) {
							var name = item.getName();
							item.setValue(json[name]);
						});
					}
					// 通过form下面某个控件的name返回当前控件
					$scope.$outer.getField = function(name) {
						var field = null;
						$.each($scope.$inner.children, function(index, item) {
							if (item.getName() == name) {
								field = item;
								return false;
							}
						});
						return field;
					}
					// 重置form下面所有控件
					$scope.$outer.reset = function() {
						$.each($scope.$inner.children, function(index, item) {
							if ($.isFunction(item.reset)) {
								item.reset();
							}
						});
					}
					// 在form下面添加控件
					$scope.$outer.addChild = function(item) {
						item.attr({
							"data-form" : "true"
						});
						var _dom = $compile(item)($scope.$new());
						$scope.$inner.body.append(_dom);
						$scope.$outer.layout();
						return $scope.$inner.children[$scope.$inner.children.length - 1];
					}

					/**
					 * 根据元素删除子元素
					 */
					$scope.$outer.removeChild = function(field) {
						var indx = -1;
						$.each($scope.$inner.children, function(index, item) {
							if (item.getId() == field.getId()) {
								indx = index;
								return false;
							}
						});
						if (indx > -1) {
							$scope.$inner.children.splice(indx, 1);
						}
						field.destroy();
						$scope.$outer.layout();
					};

					/**
					 * 根据id删除子元素
					 */
					$scope.$outer.removeChildById = function(id) {
						var indx = -1;
						var field = null;
						$.each($scope.$inner.children, function(index, item) {
							if (item.getId() == id) {
								indx = index;
								field = item;
								return false;
							}
						});
						if (indx > -1) {
							$scope.$inner.children.splice(indx, 1);
							field.destroy();
						}
						$scope.$outer.layout();
					};

					/**
					 * 根据name删除子元素
					 */
					$scope.$outer.removeChildByName = function(name) {
						var indx = -1;
						var field = null;
						$.each($scope.$inner.children, function(index, item) {
							if (item.getName() == name) {
								indx = index;
								field = item;
								return false;
							}
						});
						if (indx > -1) {
							$scope.$inner.children.splice(indx, 1);
							field.destroy();
						}
						$scope.$outer.layout();
					};

					/**
					 * 删除所有元素
					 */
					$scope.$outer.removeChildren = function() {
						$.each($scope.$inner.children, function(index, item) {
							item.destroy();
						});
						$scope.$inner.children.splice(0, $scope.$inner.children.length);
						$scope.$outer.layout();
					};

					$scope.$outer.layout = function() {
						// $scope.$inner.layoutItem();
					};

					/**
					 * 布局子项
					 */
					$scope.$inner.layoutItem = function() {
						var children = $scope.$inner.body.find(".mj-input");
						$.each(children, function(index, child) {
							var item = $(child);
							item.css({
								"width" : $scope.$inner.getColumnWidth() * parseInt(item.attr("data-colspan"), 10)
							});
						});
					};

					$scope.$inner.build();
				}
			}
		}
	});
});

/**
 * 动态添加控件
 */
mj.buildForm = function(opts) {
	var tag = $("<mj-form>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};