/**
 * 
 */

mj.module.directive('mjSelect', function($http, $compile) {
	return mj.buildFieldDirective({
		name : "mjSelect",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.cls = {
						"item" : "mj-input-field-select-item",
						"itemFind" : ".mj-input-field-select-item",
						"itemDisabled" : "mj-input-field-select-item-disabled",
						"itemSelect" : "mj-input-field-select-item-select",
						"itemSelectFind" : ".mj-input-field-select-item-select",
						"arrow" : "mj-input-field-select-arrow",
						"arrowFind" : ".mj-input-field-select-arrow",
						"arrowDisabled" : "mj-input-field-select-arrow-disabled",
						"icon" : "mj-input-field-select-item-icon",
						"iconFind" : ".mj-input-field-select-item-icon",
						"text" : "mj-input-field-select-item-text",
						"textFind" : ".mj-input-field-select-item-text",
						"single" : "fa-circle-o",
						"singleFind" : ".fa-circle-o",
						"singleSelect" : "fa-dot-circle-o",
						"singleSelectFind" : ".fa-dot-circle-o",
						"multiple" : "fa-square-o",
						"multipleFind" : ".fa-square-o",
						"multipleSelect" : "fa-check-square-o",
						"multipleSelectFind" : ".fa-check-square-o",
						"model" : "fa-circle-o",
						"modelFind" : ".fa-circle-o",
						"modelSelect" : "fa-dot-circle-o",
						"modelSelectFind" : ".fa-dot-circle-o",
					};
					$scope.$inner.arrow = $element.find($scope.$inner.cls.arrowFind).first();
					$scope.$inner.layer = null;
					$scope.$inner.oldValue = null;
					$scope.$inner.scrollFlag = false;
					if (mj.isNotEmpty($attrs.width)) {
						$element.css({
							"width" : $attrs.width
						});
					}
					if (mj.isNotEmpty($attrs.height)) {
						$element.css({
							"height" : $attrs.height
						});
					}
					if ($attrs.model != "multiple") {
						$attrs.model = "single";
					} else {
						$scope.$inner.cls.model = $scope.$inner.cls.multiple;
						$scope.$inner.cls.modelFind = $scope.$inner.cls.multipleFind;
						$scope.$inner.cls.modelSelect = $scope.$inner.cls.multipleSelect;
						$scope.$inner.cls.modelSelectFind = $scope.$inner.cls.multipleSelectFind;
					}
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);
					
					$scope.$inner.buildOtherAttr=function(){
						if (mj.isTrue($attrs.disabled) || mj.isTrue($attrs.readonly)) {
							$scope.$inner.arrow.addClass($scope.$inner.cls.arrowDisabled);
						}
					};
					
					$scope.$outer.setDisabledAfter = function(flag) {
						if(mj.isTrue(flag)){
							$scope.$inner.arrow.addClass($scope.$inner.cls.arrowDisabled);
						}else{
							$scope.$inner.arrow.removeClass($scope.$inner.cls.arrowDisabled);
						}
					};
					
					$scope.$outer.setReadonlyAfter = function(flag) {
						if(mj.isTrue(flag)){
							$scope.$inner.arrow.addClass($scope.$inner.cls.arrowDisabled);
						}else{
							$scope.$inner.arrow.removeClass($scope.$inner.cls.arrowDisabled);
						}
					};

					$scope.$outer.removeChildren = function() {
						$scope.$inner.itemBody.empty();
					}

					/**
					 * 添加下拉框选项格式{"label" :"label","value" :"value"}
					 */
					$scope.$outer.addChild = function(item) {
						$scope.$inner.buildItem(item);
					};

					$scope.$inner.show = function() {
						if(mj.isTrue($attrs.disabled)){
							return;
						}
						if ($scope.$inner.layer.css("display") == "blcok") {
							return;
						}
						var width = $scope.$inner.field.outerWidth(true) + $scope.$inner.arrow.outerWidth(true)
						$scope.$inner.layer.css({
							"width" : width+2
						});
						var offset = $scope.$inner.field.offset();
						var left = offset.left-1;
						var top = offset.top + $scope.$inner.field.outerHeight(true)+1;
						// 自适应下边框控件对齐出现
						var windowHeight = $(window).height();
						if (top + $scope.$inner.layer.outerHeight(true) > windowHeight) {
							top = $scope.$inner.field.offset().top - $scope.$inner.layer.outerHeight(true)-1;
						}

						$scope.$inner.layer.css({
							"left" : left + "px",
							"top" : top + "px",
							"display" : "block"
						});
						$scope.$inner.fieldTop=offset.top;
					}

					$scope.$inner.hide = function() {
						$scope.$inner.layer.css({
							"display" : "none"
						});
					};

					/**
					 * 内部方法：构建层
					 */
					$scope.$inner.buildLayer = function() {
						$scope.$inner.layer = $('<div class="mj-input-field-select-layer"><div class="mj-input-field-select-layer-body"><ul></ul></div></div>');
						$scope.$inner.itemBody=$scope.$inner.layer.find("ul").first();
						$scope.$inner.layer.attr({
							"id" : $attrs.id + "-layer"
						});
						$(document.body).append($scope.$inner.layer);
						$(document.body).on({
							"click": function(event) {
								var obj = $(event.target);
								if (!obj.is($scope.$inner.arrow) && !obj.parent().is($scope.$inner.arrow) && !obj.is($scope.$inner.field)) {
									var ul = obj.closest("div[id='" + $attrs.id + "-layer']");
									if (ul.length == 0) {
										$scope.$inner.hide();
									}
								}
							}
						});
						
						$($scope.$inner.itemBody).on("mouseover", function(event) {
							$scope.$inner.scrollFlag=true;
						});
						$($scope.$inner.itemBody).on("mouseout", function(event) {
							$scope.$inner.scrollFlag=false;
						});
						
						$(window).resize(function() {
							$scope.$inner.hide();
						});
						
						$(window).mousewheel(function(event) {
							var offset = $scope.$inner.field.offset();
							if($scope.$inner.fieldTop!=offset.top){
								$scope.$inner.hide();
							}
						});
						
						$scope.$inner.field.on("click", function() {
							if ($scope.$inner.layer.css("display") == "block") {
								$scope.$inner.hide();
							} else {
								$scope.$inner.show();
							}
						});
					};

					/**
					 * 内部方法：构建箭头
					 */
					$scope.$inner.buildArrow = function() {
						$scope.$inner.arrow.on("click", function() {
							if ($scope.$inner.layer.css("display") == "block") {
								$scope.$inner.hide();
							} else {
								$scope.$inner.show();
							}
						});
					};

					$scope.$inner.buildItem = function(item) {
						var child = $(mj.templates.mjSelectItem);
						$scope.$inner.itemBody.append(child);
						var icon = child.find($scope.$inner.cls.iconFind).first();
						var text = child.find($scope.$inner.cls.textFind).first();
						icon.addClass($scope.$inner.cls.model);
						var label;
						var value;
						// 通过属性data-label-field和data-value-field来确定data的数据列，如果未设置就是按照label和value获取数据
						if (mj.isNotEmpty($attrs.labelField) && mj.isNotEmpty($attrs.valueField)) {
							label = item[$attrs.labelField];
							value = item[$attrs.valueField];
						} else {
							label = item.label;
							value = item.value;
						}

						text.text(label);
						child.attr("data-value", value);
						child.attr("data-text", label);

						if ($attrs.disabled == "true") {
							child.addClass($scope.$inner.cls.itemDisabled);
						}
						if (mj.isNotEmpty($attrs.value)) {
							var values = $attrs.value.split(",");
							if ($.inArray(value, values)) {
								$scope.$inner.selectItem(child);
							}
						}
						child.on("click", function() {
							var children = $scope.$inner.layer.find($scope.$inner.cls.itemFind);
							if ($attrs.model == "single") {
								$.each(children, function(index, item) {
									$scope.$inner.unselectItem($(item));
								});
								$scope.$inner.selectItem(child);
								$scope.$inner.hide();
							} else {
								if (child.hasClass($scope.$inner.cls.itemSelect)) {
									$scope.$inner.unselectItem(child);
								} else {
									$scope.$inner.selectItem(child);
								}
							}
							$scope.$outer.changeValue();
						});
					};

					$scope.$inner.buildReturn = function(item) {
						var ret = {
							"getValue" : function() {
								return item.attr("data-value");
							},
							"getLabel" : function() {
								return item.attr("data-text");
							},
							"value" : item.attr("data-value"),
							"label" : item.attr("data-text")
						};
						return ret;
					};

					/**
					 * 获得当前选中项，返回格式{"label" :"label","value" :"value"}
					 */
					$scope.$outer.getSelect = function() {
						var children = $scope.$inner.layer.find($scope.$inner.cls.itemSelectFind);
						if ($attrs.model == "single") {
							if (children.length > 0) {
								return $scope.$inner.buildReturn(children.first());
							} else {
								return null;
							}
						} else {
							var _value = [];
							$.each(children, function(index, item) {
								_value.push($scope.$inner.buildReturn($(item)));
							});
							return _value;
						}
					};

					$scope.$inner.selectItem = function(item) {
						var icon = item.find($scope.$inner.cls.iconFind).first();
						item.addClass($scope.$inner.cls.itemSelect);
						icon.removeClass($scope.$inner.cls.model);
						icon.addClass($scope.$inner.cls.modelSelect);
					};

					$scope.$inner.unselectItem = function(item) {
						var icon = item.find($scope.$inner.cls.iconFind).first();
						item.removeClass($scope.$inner.cls.itemSelect);
						icon.removeClass($scope.$inner.cls.modelSelect);
						icon.addClass($scope.$inner.cls.model);
					};

					/**
					 * 获取当前选中项的value
					 */
					$scope.$outer.getValue = function() {
						var children = $scope.$inner.layer.find($scope.$inner.cls.itemSelectFind);
						var value = [];
						$.each(children, function(index, item) {
							value.push($(item).attr("data-value"));
						});
						if ($attrs.model == "single") {
							if(value.length==0){
								return "";
							}else{
								return value[0];
							}							
						}else{						
							return value;
						}
					};

					/**
					 * 设置当前选中项的value
					 */
					$scope.$outer.setValue = function(value) {
						$attrs.value = value;
						$scope.$inner.clearSelected();
						var children = $scope.$inner.layer.find($scope.$inner.cls.itemFind);
						if (children.length == 0) {
							return;
						}
						if ($attrs.model == "single") {
							$.each(children, function(index, child) {
								if (value + "" == $(child).attr("data-value")) {
									$scope.$inner.selectItem($(child));
								}
							});
						} else {
							$.each(children, function(index, child) {
								var _value = $(child).attr("data-value");
								if($.isArray(value)){
									if ($.inArray(_value, value)!=-1) {
										$scope.$inner.selectItem($(child));
									}
								}
							});
						}
						$scope.$outer.changeValue();
					};

					/**
					 * 设置当前选中项的value
					 */
					$scope.$outer.changeValue = function() {
						var children = $scope.$inner.layer.find($scope.$inner.cls.itemSelectFind);
						var value = [];
						$.each(children, function(index, item) {
							value.push($(item).attr("data-text"));
						});
						$scope.$inner.field.val(value.join(","));
						if ($scope.$inner.oldValue == $scope.$inner.field.val()) {
							return;
						}
						$scope.$inner.oldValue = $scope.$inner.field.val();
						
						if (mj.isEmpty($attrs.editable) || mj.isTrue($attrs.editable)){
							$scope.$outer.validity();
						}
						if (!mj.isEmpty($attrs.change)) {
							if ($.isFunction(mj.findCtrlScope($scope)[$attrs.change])) {
								mj.findCtrlScope($scope)[$attrs.change]($scope.$outer);
							}
						}
					};

					$scope.$inner.clearSelected = function() {
						var children = $scope.$inner.layer.find($scope.$inner.cls.itemSelectFind);
						$.each(children, function(index, child) {
							$scope.$inner.unselectItem($(child));
						});
					}
					/**
					 * 根据选择项下标删除选择项，选择项下标从0开始
					 */
					$scope.$outer.removeChildByIndex = function(index) {
						var children = $element.find($scope.$inner.cls.item);
						$.each(children, function(i, child) {
							if (i == index) {
								$(child).remove();
							}
						});
						$scope.$outer.changeValue();
					}

					$scope.$inner.buildSelect = function(data) {
						$scope.$outer.removeChildren();
						if (mj.isNotEmpty(data)) {
							$scope.$inner.data = data;
							var items = new Array();
							if (typeof ($scope.$inner.data) === "string") {
								try {
									items = $.parseJSON($scope.$inner.data);
								} catch (e) {
									throw "参数格式错误，必须为JSON数组"
								}
							} else if (mj.isJson($scope.$inner.data)) {
								items[0] = $scope.$inner.data;
							} else if ($.isArray($scope.$inner.data)) {
								items = $scope.$inner.data;
							} else {
								throw "参数格式错误，必须为JSON数组"
							}

							if (mj.isTrue($attrs.empty)) {
								if (mj.isNotEmpty($attrs.labelField) && mj.isNotEmpty($attrs.valueField)) {
									var obj={};
									obj[$attrs.valueField]="";
									obj[$attrs.labelField]="请选择...";
									obj["index"]="1";
									$scope.$inner.buildItem(obj);
								} else {
									$scope.$inner.buildItem({
										"value" : "",
										"label" : "请选择...",
										"index" : "1"
									});
								}
							}

							$.each(items, function(index, item) {
								$scope.$inner.buildItem(item);
							});
							if(mj.isNotEmpty($attrs.value)){
								$scope.$outer.setValue($attrs.value);
							}
						}
					}

					/**
					 * 加载现有数据到下拉框中，数据可通过方法传参和控件属性传参两种
					 */
					$scope.$outer.loadData = function(data, succFun) {
						if ($.isEmptyObject(data)) {
							if ($.isEmptyObject($attrs.data)) {
								throw "参数为空，请设置选择框的参数!";
							} else {
								data = $attrs.data;
							}
						}
						$scope.$inner.buildSelect(data);
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
								$scope.$inner.buildSelect(data);
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

					$scope.$outer.destroy = function() {
						$scope.$inner.layer.remove();
						mj.delView($attrs.id);
						$element.remove();
						$scope.$destroy();
						delete $scope;
					}

					if (mj.isNotEmpty($attrs.data)) {
						$scope.$inner.buildSelect($attrs.data);
					}

					$scope.$inner.buildArrow();
					$scope.$inner.buildLayer();
					$scope.$inner.build();
				}

			}
		}
	});
});

/**
 * 动态添加控件
 */
mj.buildSelect = function(opts) {
	var tag = $("<mj-select>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};
