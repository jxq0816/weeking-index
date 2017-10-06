/**
 * 
 */

mj.module.directive('mjButton', function($compile) {
	return mj.buildDirective({
		name : "mjButton",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.children = [];
					$scope.$inner.addChild = function(sc, el, rs) {
						$scope.$inner.children.push({
							"sc" : sc,
							"el" : el,
							"rs" : rs
						});
					};
					$scope.$inner.selectedItem = null;
					$scope.$inner.button = $element.find(".mj-button-button").first();
					$scope.$inner.text = null;
					$scope.$inner.skinJson = {
						"default" : "mj-button-default",
						"matter" : "mj-button-matter"
					};

					$scope.$inner.setSkin = function() {
						var skin = $scope.$inner.skinJson["default"];
						if (mj.isNotEmpty($scope.$inner.skinJson[$attrs.skin])) {
							skin = $scope.$inner.skinJson[$attrs.skin];
						}
						$element.addClass(skin);
					};

					$scope.$inner.init = function() {
						$scope.$inner.setSkin();
						if (mj.isTrue($attrs.disabled)) {
							$element.addClass("mj-button-disabled");
						}
						if (mj.isTrue($attrs.hidden)) {
							$element.hide();
						}
						if (mj.isNotEmpty($attrs.width)) {
							$element.css({
								"width" : $attrs.width
							});
						}
						
						if (mj.isNotEmpty($attrs.icon)) {
							var icon = $("<span>");
							icon.addClass("mj-button-button-icon");
							icon.addClass($attrs.icon);
							$scope.$inner.button.append(icon);
						}

						$scope.$inner.text = $('<a href="#"></a>');
						$scope.$inner.text.addClass("mj-button-button-text");
						$scope.$inner.text.text($attrs.text);
						$scope.$inner.button.append($scope.$inner.text);
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					$scope.$inner.build = function() {
						/**
						 * 绑定on事件，传入事件名和方法名，调用任意事件
						 */
						$scope.$inner.on = function(eventName, func) {
							$scope.$inner.button.on(eventName, function(event) {
								if (!$element.hasClass("mj-button-disabled")) {
									if ($.isFunction(func)) {
										$scope.$outer.getEvent = function() {
											return event;
										};
										func($scope.$outer);
									}
								}
								// event.stopPropagation();
							});
						};

						$scope.$inner.button.on("click", function(event) {
							if ($scope.$inner.text != null) {
								$scope.$inner.text.focus();
							}
							if (!$element.hasClass("mj-button-disabled")) {
								if (!mj.isEmpty($attrs.click)) {
									if ($.isFunction(mj.findCtrlScope($scope)[$attrs.click])) {
										$scope.$outer.getEvent = function() {
											return event;
										};
										mj.findCtrlScope($scope)[$attrs.click]($scope.$outer);
									}
								}
							}
						});
					};
					$scope.$inner.build();

					/**
					 * 设置是否可用
					 */
					$scope.$outer.setDisabled = function(flag) {
						if (flag == "true" || flag == true) {
							$element.addClass("mj-button-disabled");
						} else {
							$element.removeClass("mj-button-disabled");
						}
					};

					// 隐藏
					$scope.$outer.hide = function() {
						$element.hide();
					};

					// 显示
					$scope.$outer.show = function(flag) {
						$element.show();
					};

					/**
					 * 设置button显示的文字
					 */
					$scope.$outer.getButton = function() {
						return $scope.$inner.button;
					}

					/**
					 * 设置button显示的文字
					 */
					$scope.$outer.getSelectedItem = function() {
						return $scope.$inner.selectedItem;
					}

					/**
					 * 设置button显示的文字
					 */
					$scope.$outer.setText = function(text) {
						if (mj.isNotEmpty($scope.$inner.text)) {
							$scope.$inner.text.text(text);
						}
					}

					/**
					 * 获得button显示的文字
					 */
					$scope.$outer.getText = function() {
						if (mj.isNotEmpty($scope.$inner.text)) {
							return $scope.$inner.text.text();
						} else {
							return null;
						}
					};

					$scope.$outer.destroy = function() {
						$.each($scope.$inner.children, function(index, child) {
							child.sc.$outer.destroy();
						});
						mj.delView($attrs.id);
						$scope.$destroy();
						delete $scope;
					};

					/**
					 * 获取菜单
					 */
					$scope.$outer.getMenu = function() {
						if ($scope.$inner.children.length > 0) {
							var menu = $scope.$inner.children[0];
							return menu.sc.$outer;
						} else {
							return null;
						}
					};

					$scope.$outer.layout = function() {
						if ($scope.$inner.getParentScope().$outer.tagName == "mjFieldLeft" || $scope.$inner.getParentScope().$outer.tagName == "mjFieldRight") {
							$attrs.height = "100%";
							$attrs.width = "100%";
							$element.parent().css({
								"line-height" : "normal"
							});
						}
						// if (mj.isNotEmpty($attrs.height)) {
						// if (mj.endWith($attrs.height, "%")) {
						// $scope.$inner.button.css({
						// "height" : (($element.parent().innerHeight() *
						// parseInt($attrs.height, 10)) / 100) + "px"
						// });
						// } else {
						// $scope.$inner.button.css({
						// "height" : $attrs.height + "px"
						// });
						// }
						// }
					};

				}
			}
		}
	});
});

mj.module.directive('mjButtonMenu', function($compile) {
	return mj.buildDirective({
		name : "mjButtonMenu",
		require : [ '^?mjButton' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.children = [];
					$scope.$inner.addChild = function(sc, el, rs) {
						$scope.$inner.children.push({
							"sc" : sc,
							"el" : el,
							"rs" : rs
						});
					};
					$scope.$inner.scrollFlag = false;
					$scope.$inner.init = function() {
					}
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var buttonScope = $scope.$inner.getParentScope();
					buttonScope.$inner.addChild($scope, $element, $attrs);
					$scope.$inner.button = buttonScope.$outer.getElement();

					$scope.$inner.arrow = null;

					$scope.$inner.build = function() {
						$scope.$inner.buildArrow();

						$(document.body).append($element);

						$(document.body).on("click", function(event) {
							var obj = $(event.target);
							if (!obj.is($scope.$inner.arrow) && !obj.parent().is($scope.$inner.arrow)) {
								var ul = obj.closest("ul[id='" + $attrs.id + "']");
								if (ul.length == 0) {
									$scope.$inner.hide();
								}
							}
						});

						$($element).on("mouseover", function(event) {
							$scope.$inner.scrollFlag = true;
						});
						$($element).on("mouseout", function(event) {
							$scope.$inner.scrollFlag = false;
						});

						$(window).resize(function() {
							$scope.$inner.hide();
						});
						$(window).mousewheel(function(event) {
							if (mj.isFalse($scope.$inner.scrollFlag)) {
								$scope.$inner.hide();
							}
						});
					}

					/**
					 * 构建下拉按钮
					 */
					$scope.$inner.buildArrow = function() {
						var arrow = $('<div class="mj-button-arrow"><span class="fa fa-caret-down"></span></div>');
						$scope.$inner.button.append(arrow);
						$scope.$inner.arrow = arrow;
						$scope.$inner.arrow.on('click', function(event) {
							var menus = $(document.body).find("ul[data-tag='mjButtonMenu']");
							$.each(menus, function(index, menu) {
								$(menu).css({
									"display" : "none"
								});
							});
							if (!$scope.$inner.button.hasClass("mj-button-disabled")) {
								$scope.$inner.show();
							}
							// event.stopPropagation();
						});
					};

					/**
					 * 添加子元素
					 */
					$scope.$outer.addChild = function(opt) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						var iview = null;
						if (opt.type == "splitter") {
							iview = $scope.$inner.buildButtonMenuSplitter(opt);
						} else {
							iview = $scope.$inner.buildButtonMenuItem(opt);
						}
						var _dom = $compile(iview)($scope.$new());
						$element.append(_dom);
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
					$scope.$inner.buildButtonMenuItem = function(opts) {
						var tag = $("<mj-button-menu-item>");
						$.each(opts, function(key, value) {
							tag.attr("data-" + key, value);
						});
						return tag;
					};

					/**
					 * 动态构建控件
					 */
					$scope.$inner.buildButtonMenuSplitter = function(opts) {
						var tag = $("<mj-button-menu-splitter>");
						$.each(opts, function(key, value) {
							tag.attr("data-" + key, value);
						});
						return tag;
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

					/**
					 * 删除菜单
					 */
					$scope.$outer.removeChildren = function() {
						if ($scope.$inner.children.length > 0) {
							$scope.$inner.children.splice(0, $scope.$inner.children.length);
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
						}
					};

					$scope.$inner.show = function() {
						if ($element.css("display") == "blcok") {
							return;
						}
						var datel = $scope.$inner.button.offset().left;
						var datet = $scope.$inner.button.offset().top + $scope.$inner.button.outerHeight(true);
						// 自适应下边框控件对齐出现
						var windowHeight = $(window).height();
						if (datet + $element.height() > windowHeight) {
							datet = $scope.$inner.button.offset().top - $element.outerHeight(true);
						}
						// 自适应右边框控件对齐出现
						var windowWidth = $(window).width();
						if (datel + $element.width() > windowWidth) {
							datel = $scope.$inner.button.offset().left - $element.width() + $scope.$inner.button.width();
						}
						$element.css({
							"left" : datel + "px",
							"top" : datet + "px",
							"display" : "block"
						});
					}

					$scope.$inner.hide = function() {
						$element.css({
							"display" : "none"
						});
					};

					$scope.$outer.destroy = function() {
						$.each($scope.$inner.children, function(index, child) {
							child.sc.$outer.destroy();
						});
						mj.delView($attrs.id);
						$scope.$destroy();
						delete $scope;
						$element.remove();
					}

					$scope.$inner.build();

				}
			}
		}
	});
});

mj.module.directive('mjButtonMenuItem', function($compile) {
	return mj.buildDirective({
		"name" : "mjButtonMenuItem",
		require : [ '^?mjButtonMenu' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.text = $element.find(".mj-button-menu-text").first();
					$scope.$inner.icon = $element.find(".mj-button-menu-icon").first();
					$scope.$inner.cls = {
						"disabled" : "mj-button-menu-item-disabled",
						"select" : "mj-button-menu-item-select"
					};
					$scope.$inner.init = function() {
						if (mj.isTrue($attrs.disabled)) {
							$element.addClass($scope.$inner.cls.disabled);
						}
						if (mj.isTrue($attrs.hidden)) {
							$element.hide();
						}
						if (!$.isEmptyObject($attrs.icon)) {
							$scope.$inner.icon.addClass($attrs.icon);
						}
						$scope.$inner.text.append($attrs.text);
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var pscope = $scope.$inner.getParentScope();
					pscope.$inner.addChild($scope, $element, $attrs);
					$scope.$inner.build = function() {
						$scope.$inner.buildClick();
					};

					/**
					 * 设置菜单项是否禁用
					 */
					$scope.$outer.setDisabled = function(flag) {
						if (flag == true) {
							$element.addClass($scope.$inner.cls.disabled);
						} else {
							$element.removeClass($scope.$inner.cls.disabled);
						}
					};

					/**
					 * 获取菜单项是否禁用状态
					 */
					$scope.$outer.getDisabled = function() {
						return $element.hasClass($scope.$inner.cls.disabled);
					};

					/**
					 * 设置text
					 */
					$scope.$outer.setText = function(text) {
						$attrs.text = text;
						$scope.$inner.text(text);
					};

					/**
					 * 获取text
					 */
					$scope.$outer.getText = function() {
						return $attrs.text;
					};

					// 隐藏
					$scope.$outer.hide = function() {
						$element.hide();
					};

					// 显示
					$scope.$outer.show = function(flag) {
						$element.show();
					};

					// 显示
					$scope.$outer.getButton = function() {
						return pscope.$parent.$parent.$outer;
					};

					// 设置菜单项click事件
					$scope.$inner.buildClick = function() {
						if (mj.isNotEmpty(pscope.$outer.getAttrs().click)) {
							$element.on("click", function() {
								if ($element.hasClass($scope.$inner.cls.disabled)) {
									return;
								}
								pscope.$inner.hide();
								$.each(pscope.$inner.children, function(index, child) {
									if (child.el.hasClass($scope.$inner.cls.select)) {
										child.el.removeClass($scope.$inner.cls.select);
									}
								});
								$element.addClass($scope.$inner.cls.select);
								pscope.$parent.$parent.$inner.selectedItem = $scope.$outer;
								if ($.isFunction(mj.findCtrlScope($scope)[pscope.$outer.getAttrs().click])) {
									mj.findCtrlScope($scope)[pscope.$outer.getAttrs().click]($scope.$outer);
								}
							});
						}
					};

					$scope.$inner.build();
				}
			}
		}
	});
});

mj.module.directive('mjButtonMenuSplitter', function() {
	return mj.buildDirective({
		"name" : "mjButtonMenuSplitter",
		require : [ '^?mjButtonMenu' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
				}
			}
		}
	});
});

/**
 * 动态添加控件
 */
mj.buildButton = function(opts) {
	var tag = $("<mj-button>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildButtonMenu = function(opts) {
	var tag = $("<mj-button-menu>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildButtonMenuItem = function(opts) {
	var tag = $("<mj-button-menu-item>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildButtonMenuSplitter = function(opts) {
	var tag = $("<mj-button-menu-splitter>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};
