/**
 * 
 */

mj.module.directive('mjSelectTree', function($http, $compile) {
	return mj.buildFieldDirective({
		name : "mjSelectTree",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.cls = {
						"arrow" : "mj-input-field-select-arrow",
						"arrowFind" : ".mj-input-field-select-arrow",
						"arrowDisabled" : "mj-input-field-select-arrow-disabled",
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
						$attrs.checkable = "true";
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
						$scope.$inner.fieldTop = offset.top;
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
						$scope.$inner.layer = $('<div class="mj-input-field-select-layer"><div class="mj-input-field-select-layer-body"></div></div>');
						$scope.$inner.itemBody = $scope.$inner.layer.find(".mj-input-field-select-layer-body").first();
						$scope.$inner.layer.attr({
							"id" : $attrs.id + "-layer"
						});
						$(document.body).append($scope.$inner.layer);
						$(document.body).on({
							"click" : function(event) {
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
							$scope.$inner.scrollFlag = true;
						});
						$($scope.$inner.itemBody).on("mouseout", function(event) {
							$scope.$inner.scrollFlag = false;
						});

						$(window).resize(function() {
							$scope.$inner.hide();
						});

						$(window).mousewheel(function(event) {
							var offset = $scope.$inner.field.offset();
							if ($scope.$inner.fieldTop != offset.top) {
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

					$scope.$inner.buildTree = function() {
						var opts = {
							"id" : $attrs.id + "-tree",
							"action" : $attrs.action,
							"idField" : $attrs.idField,
							"textField" : $attrs.textField,
							"autoload" : "true",
							"method" : $attrs.method,
							"checkable" : $attrs.checkable
						};
						var treeTag = mj.buildTree(opts);
						$scope.$inner.itemBody.append($compile(treeTag)($scope.$new()));
						$scope.$inner.tree = mj.getView(opts.id);
						$scope.$inner.tree.setClick(function(node) {
							var item = $scope.$inner.tree.getSelectNode();
							if ($attrs.model == "single") {
								item = $scope.$inner.tree.getSelectNode();
								$scope.$outer.setValue({
									"id" : item.getId(),
									"text" : item.getText()
								});
							} else {
								item = $scope.$inner.tree.getCheckedChildren();
								var valueArray = [];
								$.each(item, function(index, child) {
									valueArray.push({
										"id" : child.getId(),
										"text" : child.getText()
									});
								});
								$scope.$outer.setValue(valueArray);
							}
						});

					};

					/**
					 * 获取当前选中项的value
					 */
					$scope.$outer.getValue = function() {
						var children = null;
						if ($attrs.model == "single") {
							children = $scope.$inner.tree.getSelectNode();
							if(mj.isNotEmpty(children)){
								return children.getId();
							}else{
								return null;
							}
						} else {
							var valueArray = [];
							children = $scope.$inner.tree.getCheckedChildren();
							$.each(children, function(index, child) {
								valueArray.push(child.getId());
							});
							return valueArray.join(",");
						}
					};

					/**
					 * 设置当前选中项的value
					 */
					$scope.$outer.setValue = function(value) {
						$scope.$inner.oldValue = $scope.$inner.field.val();
						if ($attrs.model == "single") {
							$scope.$inner.field.val(value.text);
						} else {
							var valueArray = [];
							$.each(value, function(index, child) {
								valueArray.push(child.text);
							});
							$scope.$inner.field.val(valueArray.join(","));
						}
						if (!mj.isEmpty($attrs.change)) {
							if ($.isFunction(mj.findCtrlScope($scope)[$attrs.change])) {
								mj.findCtrlScope($scope)[$attrs.change]($scope.$outer);
							}
						}
						$scope.$outer.validity();
					};

					$scope.$outer.load = function(param, action, succFun) {
						$scope.$inner.tree.load(param, action, succFun);
					};

					$scope.$outer.getTree = function(param, action, succFun) {
						return $scope.$inner.tree;
					};

					/**
					 * 设置当前选中项的value
					 */
					$scope.$outer.changeValue = function() {
						if ($scope.$inner.oldValue == $scope.$inner.field.val()) {
							return;
						}
						
						if (mj.isEmpty($attrs.editable) || mj.isTrue($attrs.editable)){
							$scope.$outer.validity();
						}
						
						if (!mj.isEmpty($attrs.change)) {
							if ($.isFunction(mj.findCtrlScope($scope)[$attrs.change])) {
								mj.findCtrlScope($scope)[$attrs.change]($scope.$outer);
							}
						}
					};

					$scope.$inner.buildArrow();
					$scope.$inner.buildLayer();
					$scope.$inner.buildTree();
					$scope.$inner.build();
				}

			}
		}
	});
});

/**
 * 动态添加控件
 */
mj.buildSelectTree = function(opts) {
	var tag = $("<mj-select-tree>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};
