/**
 * 
 */
mj.module.directive('mjCheckbox', function($http, $compile) {
	return mj.buildFieldDirective({
		name : "mjCheckbox",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					var group = $element.find(".mj-input-field").first();
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs);
					$scope.$inner.buildOtherAttr = function() {

					};

					/**
					 * 获取当前选中项的value
					 */
					$scope.$outer.getValue = function() {
						var items = $element.find("input[name='" + $attrs.name + "']:checked");
						var vals = new Array();
						var i = 0;
						$.each(items, function(index, item) {
							vals[i] = item.value;
							i++;
						});
						return vals;
					};
					/**
					 * 设置当前选中项的value
					 */
					$scope.$outer.setValue = function(val) {
						var items = val.split(",");
						$.each(items, function(index, item) {
							var input = $element.find("input[name='" + $attrs.name + "'][value='" + item + "']");
							input.prop("checked", true);
						});
					};

					$scope.$outer.setChange = function(func) {
						$attrs.change = func;
					};

					/**
					 * 清空控件输入，如果有默认值就赋给默认值，没有默认值则设置为null
					 */
					$scope.$outer.reset = function() {
						$scope.$outer.selectCancel();
						if (!mj.isEmpty($attrs.value)) {
							$scope.$outer.setValue($attrs.value);
						} else {
							$scope.$outer.setValue("");
						}
						$scope.$inner.field.removeAttr("title");
						$scope.$inner.field.removeClass("mj-input-validity-error");
					}
					/**
					 * 获得当前选中项，返回格式{"label" :"label","value" :"value"}
					 */
					$scope.$outer.getSelect = function() {
						var items = $element.find("input[name='" + $attrs.name + "']:checked");
						var vals = new Array();
						var i = 0;
						$.each(items, function(index, item) {
							vals[i] = {
								"label" : $(item).parent().text(),
								"value" : item.value
							};
							i++;
						});
						return vals;
					};
					/**
					 * 添加选项,格式{"value" :"value","label" :"label"}
					 */
					$scope.$outer.addChild = function(item) {
						var label;
						var value;
						// 通过属性data-label-field和data-value-field来确定data的数据列，如果未设置就是按照label和value获取数据
						if ((!$.isEmptyObject($attrs.labelField)) && (!$.isEmptyObject($attrs.valueField))) {
							label = item[$attrs.labelField];
							value = item[$attrs.valueField];
						} else {
							label = item.label;
							value = item.value;
						}
						if ($.isEmptyObject(value)) {
							throw "属性value不能为空";
						}
						var checkbox = $(mj.templates.mjCheckboxItem);
						var input = $(checkbox.children()[0]);
						input.attr({
							"value" : value,
							"name" : $attrs.name
						});
						if ($attrs.disabled == "true") {
							input.attr("disabled", "disabled");
						}
						if ($attrs.value.indexOf(value) > -1) {
							input.prop("checked", true);
							input.parent().attr("data-checked", true);
						}
						if (!$.isEmptyObject(label)) {
							checkbox.append(label);
						} else {
							checkbox.append("&nbsp;");
						}
						group.append(checkbox);
						$scope.$inner.buildCurrentItem(checkbox);
					};

					/**
					 * 构建当前子项
					 */
					$scope.$inner.buildCurrentItem = function(checkbox) {
						var input = checkbox.find("input").first();
						var current = {
							"getElement" : function() {
								return input;
							},
							"getLabel" : function() {
								checkbox.text();
							},
							"getValue" : function() {
								return input.val();
							},
							"getName" : function() {
								return input.attr("name");
							},
							"isChecked" : function() {
								if (mj.isTrue(input.prop("checked"))) {
									return true;
								} else {
									return false;
								}
							},
							"setChecked" : function(flag) {
								input.prop("checked", flag);
								input.parent().attr("data-checked", flag);
							}
						};

						if (!mj.isEmpty($attrs.change)) {
							if ($.isFunction(mj.findCtrlScope($scope)[$attrs.change])) {
								input.on("change", function() {
									var opts = $.extend(true, {}, $scope.$outer);
									opts.getCurrentItem = function() {
										return current;
									};
									mj.findCtrlScope($scope)[$attrs.change](opts);
								});
							}
						}
					};

					/**
					 * 根据选择项value删除选择项
					 */
					$scope.$outer.removeChild = function(val) {
						var input = $element.find("input[name='" + $attrs.name + "'][value='" + val + "']").first();
						var parent = input.parent();
						parent.remove();
					}
					/**
					 * 删除所有选择项
					 */
					$scope.$outer.removeChildren = function() {
						group.empty();
					}
					/**
					 * 全选
					 */
					$scope.$outer.selectAll = function() {
						var items = $element.find("input[name='" + $attrs.name + "']");
						$.each(items, function(index, item) {
							var input = $(item);
							input.prop("checked", true);
							input.parent().attr("data-checked", "true");
						});
					}

					/**
					 * 全取消
					 */
					$scope.$outer.unselectAll = function() {
						var items = $element.find("input[name='" + $attrs.name + "']");
						$.each(items, function(index, item) {
							var input = $(item);
							input.prop("checked", false);
							input.parent().attr("data-checked", "false");
						});
					}

					$scope.$inner.init = function(data) {
						if ($.isEmptyObject(data)) {
							if ($.isEmptyObject($attrs.data)) {
								throw "参数为空，请设置选择框的参数!";
							} else {
								data = $attrs.data;
							}

						}
						$scope.$outer.removeChildren();
						if (!$.isEmptyObject(data)) {
							var items = new Array();
							if (typeof (data) === "string") {
								try {
									items = $.parseJSON(data);
								} catch (e) {
									throw "参数格式错误，必须为JSON数组"
								}
							} else if (mj.isJson(data)) {
								items[0] = data;
							} else if ($.isArray(data)) {
								items = data;
							} else {
								throw "参数格式错误，必须为JSON数组"
							}
							$.each(items, function(index, item) {
								$scope.$outer.addChild(item);
							});
						}
					}
					/**
					 * 加载现有数据到下拉框中，数据可通过方法传参和控件属性传参两种
					 */
					$scope.$outer.loadData = function(data, succFun) {
						$scope.$inner.init(data);
						if ($.isFunction(succFun)) {
							succFun(data);
						}
					};
					$scope.$inner.data = function() {
						var method;
						var succFun = $scope.$inner.succFun;
						if ($.isEmptyObject($attrs.method)) {
							method = "get";
						} else {
							method = $attrs.method
						}
						$http({
							method : method,
							url : $scope.$inner.action,
							params : {
								"condition" : $scope.$inner.param
							}
						}).then(function successCallback(response) {
							if (response.data.code == 0) {
								data = response.data.data;
								$scope.$inner.init(data);
								if ($.isFunction(succFun)) {
									succFun(response.data);
								}
							}
						}, function errorCallback(response) {
						});
					}
					/**
					 * 后台数据加载,后台访问路径可通过方法传参和控件属性传参两种
					 */
					$scope.$outer.load = function(param, action, succFun) {
						if (mj.isEmpty(action)) {
							action = mj.findAttr($attrs.action, $scope);
						}
						$scope.$inner.param = param;
						$scope.$inner.action = action;
						$scope.$inner.succFun = succFun;
						$scope.$inner.data();
					};
					if (!$.isEmptyObject($attrs.data)) {
						$scope.$inner.init($attrs.data);
					}
					$scope.$inner.build();
				}
			}
		}
	});
});
/**
 * 动态添加控件
 */
mj.buildCheckbox = function(opts) {
	var tag = $("<mj-checkbox>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};