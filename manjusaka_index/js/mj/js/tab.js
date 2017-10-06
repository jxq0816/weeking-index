/**
 * 
 */

mj.module.directive('mjTab', function($compile) {
	return mj.buildDirective({
		name : "mjTab",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.children = [];
					$scope.$inner.activateItem = null;
					$scope.$inner.modelArray = [ "default", "card", "button" ];
					$scope.$inner.addChild = function(sc, el, rs) {
						$scope.$inner.children.push({
							"sc" : sc,
							"el" : el,
							"rs" : rs
						});
					};
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.height)) {
							$element.css({
								"height" : $attrs.height
							});
						}
						if (mj.isNotEmpty($attrs.width)) {
							$element.css({
								"width" : $attrs.width
							});
						}
						if (mj.isEmpty($attrs.model) || !$.inArray($attrs.model, $scope.$inner.modelArray)) {
							$attrs.model = "default";
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var head = $element.find(".mj-tab-head-content").first();
					head.parent().parent().parent().addClass("mj-tab-head-table" + "-" + $attrs.model);
					var body = $element.find(".mj-tab-body").first();
					var left = $element.find(".mj-tab-switch-left").first();
					var right = $element.find(".mj-tab-switch-right").first();
					$scope.$inner.stepsize = 10;
					$scope.$inner.scrollLength = $scope.$inner.stepsize;

					$scope.$outer.addChild = function(opts) {
						if (mj.checkView(opts.id)) {
							$scope.$inner.checkView(head, body, opts.id);
							return;
						}
						var tabItem = $scope.$inner.buildTabItem({
							"id" : opts.id,
							"title" : opts.title,
							"icon" : opts.icon,
							"model" : opts.model || "dynamic",
							"closable" : opts.closable,
							"active" : opts.active,
							"delay" : "false",
							"view" : opts.view,
							"param" : opts.param,
							"switch-flag" : "true",
							"controller" : opts.controller,
							"controller-alias" : opts.controllerAlias,
						});
						var _dom = $compile(tabItem)($scope.$new());
						body.append(_dom);
						var current = $scope.$inner.children[$scope.$inner.children.length - 1];
						current.rs.param = opts.param;
						current.rs.load = opts.load;
						current.rs.content = opts.content;
						current.rs.closeAfter = opts.closeAfter;
						current.rs.closeBefore = opts.closeBefore;
						current.rs.activateAfter = opts.activateAfter;
						current.rs.activateBefore = opts.activateBefore;

						$scope.$inner.buildItem(current);
						$scope.$inner.showScroll("addItem");
						var item = head.children("span:last-child");
						head.scrollLeft(item.offset().left);
						$scope.$outer.layout();
						return current.sc.$outer;
					};

					$scope.$inner.buildTabItem = function(opts) {
						var tag = $("<mj-tab-item>");
						$.each(opts, function(key, value) {
							tag.attr("data-" + key, value);
						});
						return tag;
					}
					// 通过tab的id获得tab对象，并且返回index属性和close和select方法，可直接调用。
					$scope.$outer.getChildById = function(id) {
						var obj = null;
						$.each($scope.$inner.children, function(index, child) {
							if (child.rs.id == id) {
								obj = $scope.$inner.buildItemAttrs(child);
								return false;
							}
						});
						return obj;
					};
					// 获取全部tab页签对象返回json格式，键为tab的下标，值为对象，并且返回id、title、index属性和close和select方法，可直接调用。
					$scope.$outer.getChildren = function() {
						var list = {};
						$.each($scope.$inner.children, function(index, child) {
							list[index] = $scope.$inner.buildItemAttrs(child);
							;
						});
						return list;
					};

					// 通过tab的id获得tab对象，调用close事件
					$scope.$outer.close = function(id) {
						$.each($scope.$inner.children, function(index, sub) {
							if (sub.rs.id == id) {
								var item = head.find("span[data-key=" + id + "]");
								var close = item.find(".mj-tab-head-item-close").first();
								if (sub.rs.closable == "true") {
									close.click();
								}
							}
						});
					};
					// 获取全部tab页签对象并且调用关闭事件
					$scope.$outer.closeAll = function() {
						var tabs = $scope.$inner.children;
						for (j = tabs.length - 1; j >= 0; --j) {
							var sub = tabs[j];
							var item = head.find("span[data-key=" + sub.rs.id + "]");
							var close = item.find(".mj-tab-head-item-close").first();
							if (sub.rs.closable == "true") {
								close.click();
							}
						}
					};
					// 获得选中的tab对象，并且返回id、title、index属性和close和select方法，可直接调用。
					$scope.$outer.getSelected = function() {
						return $scope.$inner.activateItem;
					};
					// 通过tab的下标（从1开始）获得tab对象，调用选中事件
					$scope.$outer.selectByIndex = function(index) {
						var tabs = $scope.$inner.children;
						var sub = tabs[index - 1];
						var item = head.find("span[data-key=" + sub.rs.id + "]");
						if (item.length == 0) {
							return null;
						}
						item.click();
						$scope.$inner.showScroll();
						if (head.scrollLeft() > 0) {
							head.scrollLeft(item.offset().left);
						}
					};

					$scope.$outer.selectById = function(id) {
						var item = head.find("span[data-key=" + id + "]");
						if (item.length == 0) {
							return null;
						}
						item.click();
						$scope.$inner.showScroll();
						if (head.scrollLeft() > 0) {
							head.scrollLeft(item.offset().left);
						}
					};

					$scope.$inner.checkView = function(head, body, id) {
						$.each(head.children(), function(index, sub) {
							var _sub = $(sub);
							if (_sub.attr("data-key") == id) {
								head.scrollLeft(_sub.offset().left);
							}
						});
						var item = head.find("span[data-key=" + id + "]");
						item.click();

					}
					$scope.$inner.leftClick = function() {
						var sl = head.scrollLeft();
						if (sl != 0) {
							$scope.$inner.scrollLength = sl;
						}
						head.scrollLeft($scope.$inner.scrollLength - $scope.$inner.stepsize);
						$scope.$inner.scrollLength -= $scope.$inner.stepsize;
						if (($scope.$inner.scrollLength + $scope.$inner.stepsize) < $scope.$inner.stepsize) {
							$scope.$inner.scrollLength = $scope.$inner.stepsize;
							left.attr("disabled", "true");
							clearInterval($scope.$inner.time);
						} else {
							right.removeAttr("disabled");
						}
					}
					$scope.$inner.rightClick = function() {
						head.scrollLeft($scope.$inner.scrollLength);
						$scope.$inner.scrollLength += $scope.$inner.stepsize;
						if ($scope.$inner.scrollLength == (head.scrollLeft() + $scope.$inner.stepsize)) {
							left.removeAttr("disabled");
							$scope.$inner.scrollLength = head.scrollLeft() + $scope.$inner.stepsize;
						} else if ($scope.$inner.scrollLength > (head.scrollLeft() + $scope.$inner.stepsize)) {
							right.attr("disabled", "true");
							$scope.$inner.scrollLength = head.scrollLeft() + $scope.$inner.stepsize;
							clearInterval($scope.$inner.time);
						}
					}
					$scope.$inner.time;
					$scope.$inner.onMouse = function(type) {
						if (type == "left") {
							$scope.$inner.leftClick();
						} else {
							$scope.$inner.rightClick();
						}
					}

					$scope.$inner.build = function() {
						$.each($scope.$inner.children, function(index, child) {
							$scope.$inner.buildItem(child);
						});
						right.on("mousedown", function() {
							$scope.$inner.time = setInterval(function() {
								$scope.$inner.onMouse("right");
							}, 20);
						});
						right.on("mouseup", function() {
							clearInterval($scope.$inner.time);
						});
						left.on("mousedown", function() {
							$scope.$inner.time = setInterval(function() {
								$scope.$inner.onMouse("left");
							}, 20);
						});
						left.on("mouseup", function() {
							clearInterval($scope.$inner.time);
						});
					};

					$scope.$inner.buildItem = function(child) {
						var item = $('<span></span>');
						item.attr({
							"class" : "mj-tab-head-item",
							"data-key" : child.rs.id,
							"data-include-id" : child.rs.includeId,
							"data-load-flag" : child.rs.delay
						});
						var include = null;
						if (child.rs.model == "dynamic" && mj.endWith(child.rs.view, ".xml")) {
							include = mj.buildInclude({
								"view" : child.rs.view,
								"controller" : child.rs.controller,
								"param" : child.rs.param,
								"switch-flag" : "true",
								"delay" : child.rs.delay,
								"controller-alias" : child.rs.controllerAlias,
								"load" : child.rs.load
							});
						} else if (child.rs.model == "static") {
							include = child.rs.view;
						}

						if (child.rs.model == "dynamic") {
							if (mj.isTrue(child.rs.delay)) {
								child.el.append(include);
							} else {
								child.el.append($compile(include)(child.sc.$new()));
							}
						} else if (child.rs.model == "static") {
							child.el.append($compile(include)(child.sc.$new()));
						}

						item.attr({
							"class" : "mj-tab-head-item",
							"data-key" : child.rs.id,
							"data-include-id" : child.rs.includeId,
							"data-load-flag" : child.rs.delay
						});
						item.addClass("mj-tab-head-item" + "-" + $attrs.model);
						item.appendTo(head);
						$scope.$inner.buildTitle(child, item);
					};

					$scope.$inner.buildTitle = function(child, item) {
						item.on("click", function() {
							if (mj.isNotEmpty($scope.$inner.activateItem)) {
								if ($scope.$inner.activateItem.getId() == item.attr("data-key")) {
									return;
								}
							}
							if (mj.isNotEmpty(child.rs.activateBefore)) {
								if ($.isFunction(child.rs.activateBefore)) {
									var flag = child.rs.activateBefore($scope.$inner.buildItemAttrs(child));
									if (flag == false) {
										return;
									}
								} else if ($.isFunction(mj.findCtrlScope($scope)[child.rs.activateBefore])) {
									var flag = mj.findCtrlScope($scope)[child.rs.activateBefore]($scope.$inner.buildItemAttrs(child));
									if (flag == false) {
										return;
									}
								}
							}
							if (mj.isTrue(item.attr("data-load-flag"))) {
								item.attr("data-load-flag", "false");
								var _body = body.find("div[id='" + item.attr("data-key") + "']").first();
								$compile(_body.children()[0])(child.sc.$new());
							}
							$scope.$inner.activateItem = $scope.$inner.buildItemAttrs(child);

							$.each(head.children(), function(index, sub) {
								var _sub = $(sub);
								if (_sub.attr("data-key") == item.attr("data-key")) {
									_sub.addClass("mj-tab-head-item-show");
									_sub.addClass("mj-tab-head-item-show" + "-" + $attrs.model);
								} else {
									_sub.removeClass("mj-tab-head-item-show");
									_sub.removeClass("mj-tab-head-item-show" + "-" + $attrs.model);
								}
							});
							$.each(body.children(), function(index, sub) {
								var _sub = $(sub);
								_sub.css({
									"display" : "none"
								});
								_sub.removeClass("mj-tab-body-active");

							});
							var _body = body.find("div[id='" + item.attr("data-key") + "']").first();
							_body.css({
								"display" : "block"
							});
							_body.addClass("mj-tab-body-active");

							// if (mj.isTrue(item.attr("data-layout-flag"))) {
							// return;
							// } else {
							// item.attr("data-layout-flag", "true");
							// mj.layoutView(item.attr("data-key"));
							// }
							mj.layoutView(item.attr("data-key"));
							if (mj.isNotEmpty(child.rs.activateAfter)) {
								if ($.isFunction(child.rs.activateAfter)) {
									child.rs.activateAfter($scope.$inner.buildItemAttrs(child));
								} else if ($.isFunction(mj.findCtrlScope($scope)[child.rs.activateAfter])) {
									mj.findCtrlScope($scope)[child.rs.activateAfter]($scope.$inner.buildItemAttrs(child));
								}
							}
						});
						if (!$.isEmptyObject(child.rs.icon)) {
							var icon = $('<i class="mj-tab-head-item-icon"></i>');
							icon.addClass(child.rs.icon);
							icon.appendTo(item);
						}
						item.append('<span class="mj-tab-title">' + child.rs.title + '</span>');
						$scope.$inner.buildClose(child, item);
						if (mj.isTrue(child.rs.active)) {
							item.click();
						} else {
							if (head.children().length == 1) {
								item.click();
							}
						}
					};

					/**
					 * 外部方法：获取激活对象
					 */
					$scope.$outer.getActivateChild = function() {
						return $scope.$inner.activateItem;
					};

					/**
					 * 内部方法：构建tabitem对象的返回对象
					 */
					$scope.$inner.buildItemAttrs = function(child) {
						return {
							"getId" : function() {
								return child.sc.$outer.getId();
							},
							"getText" : function() {
								return child.sc.$outer.getText();
							},
							"close" : function() {
								$scope.$outer.close(child.sc.$outer.getId());
							},
							"select" : function() {
								$scope.$outer.selectById(child.sc.$outer.getId());
							},
							"refresh" : function() {
								$scope.$inner.refreshItem(child);
							},
							"layout" : function() {
								mj.layoutView(child.rs.id);
							}
						};
					}

					/**
					 * 内部方法：刷新节点
					 */
					$scope.$inner.refreshItem = function(child) {
						var item = head.find("span[data-key=" + child.rs.id + "]");
						if (item.length > 0) {
							$scope.$inner.clearBody(child.el);
							child.el.empty();
							var include = null;
							if (child.rs.model == "dynamic") {
								include = mj.buildInclude({
									"view" : child.rs.view,
									"controller" : child.rs.controller,
									"param" : child.rs.param,
									"switch-flag" : "true",
									"delay" : child.rs.delay,
									"controller-alias" : child.rs.controllerAlias,
									"load" : child.rs.load
								});
								child.el.append(include);
								item.attr({
									"data-layout-flag" : "false",
									"data-load-flag" : "true"
								});
								$scope.$inner.activateItem = null;
								item.click();
							}
						}
					};

					$scope.$inner.showScroll = function(operation) {
						var sl = head.scrollLeft();
						if (sl == 0) {
							head.scrollLeft($scope.$inner.stepsize);
							sl = head.scrollLeft();
							if (sl > 0) {
								head.scrollLeft(0);
								left.parent().css({
									"display" : "table-cell"
								});
								if (operation == "addItem") {
									$scope.$inner.time = setInterval(function() {
										$scope.$inner.onMouse("right");
									}, 1);
								}
							} else if (sl == 0) {
								left.parent().css({
									"display" : "none"
								});
							}
						} else {
							left.parent().css({
								"display" : "table-cell"
							});
						}
					}
					$scope.$inner.buildClose = function(child, item) {
						if (child.rs.closable == "true") {
							var close = $('<i class="fa fa-close mj-tab-head-item-close"></i>');
							close.appendTo(item);
							close.on("click", function(event) {
								event.stopPropagation();
								var _child = child;
								if (mj.isNotEmpty(child.rs.closeBefore)) {
									if ($.isFunction(child.rs.closeBefore)) {
										var flag = child.rs.closeBefore($scope.$inner.buildItemAttrs(child));
										if (flag == false) {
											return;
										}
									} else if ($.isFunction(mj.findCtrlScope($scope)[child.rs.closeBefore])) {
										var flag = mj.findCtrlScope($scope)[child.rs.closeBefore]($scope.$inner.buildItemAttrs(child));
										if (flag == false) {
											return;
										}
									}
								}
								for (var index = head.children().length - 1; index >= 0; index--) {
									var _sub = $(head.children()[index]);
									if (_sub.attr("data-key") == item.attr("data-key")) {
										var nextItem = null;
										if (_sub.hasClass("mj-tab-head-item-show")) {
											nextItem = item.next();
											if (mj.isEmpty(nextItem.attr("data-key"))) {
												nextItem = item.prev();
											}
										}
										child = null;
										$scope.$inner.children.splice($.inArray(child, $scope.$inner.children), 1);
										_sub.remove();
										var _bt = $(body.children()[index]);
										$scope.$inner.clearBody(_bt);
										_bt.remove();
										mj.delView(_sub.attr("data-key"));
										if (nextItem.length > 0) {
											nextItem.click();
										} else {
											$scope.$inner.activateItem = null;
										}
										$scope.$inner.showScroll();
									}
								}
								if (mj.isNotEmpty(_child.rs.closeAfter)) {
									if ($.isFunction(_child.rs.closeAfter)) {
										_child.rs.closeAfter($scope.$inner.buildItemAttrs(_child));
									} else if ($.isFunction(mj.findCtrlScope($scope)[_child.rs.closeAfter])) {
										mj.findCtrlScope($scope)[_child.rs.closeAfter]($scope.$inner.buildItemAttrs(_child));
									}
								}
							});
						}
					};

					/**
					 * 内部方法：清楚body内容
					 */
					$scope.$inner.clearBody = function(body) {
						var _body = $(body).find("*[data-tag*='mj']");
						for (var i = _body.length - 1; i >= 0; i--) {
							var view = mj.getView($(_body[i]).attr("id"));
							if (!mj.isEmpty(view)) {
								if ($.isFunction(view.destroy)) {
									view.destroy();
								}
							}
						}
						_body.remove();
					}

					$scope.$outer.layout = function() {
						var target = null;
						$.each(body.children(), function(index, sub) {
							var _sub = $(sub);
							if (_sub.hasClass("mj-tab-body-active")) {
								target = _sub;
							}
							_sub.css({
								"display" : "none"
							});
						});
						$.each(body.children(), function(index, sub) {
							$(sub).css({
								"height" : body.innerHeight()
							});
						});
						if (!mj.isEmpty(target)) {
							target.css({
								"display" : "block"
							});
						}
						$scope.$inner.showScroll();
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

					$scope.$inner.build();

				}
			}
		}
	});
});

mj.module.directive('mjTabItem', function($compile) {
	return mj.buildDirective({
		"name" : "mjTabItem",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.include = null;
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
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var tabScope = $scope.$inner.getParentScope();
					tabScope.$inner.addChild($scope, $element, $attrs);
					$scope.$inner.build = function() {
						if (mj.isNotEmpty($attrs.padding)) {
							$element.css({
								"padding" : $attrs.padding
							});
						}
					};

					$scope.$inner.build();

					$scope.$outer.getText = function() {
						return $attrs.title;
					};
					$scope.$outer.getIcon = function() {
						return $attrs.icon;
					};
					$scope.$outer.getName = function() {
						return $attrs.name;
					};
					$scope.$outer.getId = function() {
						return $attrs.id;
					};
					$scope.$outer.close = function() {
						tabScope.$outer.close($attrs.id);
					};
					/**
					 * 外部节点：获取include
					 */
					$scope.$outer.getInclude = function() {
						return mj.getView($attrs.includeId);
					};
					/**
					 * 外部节点：获取子元素
					 */
					$scope.$outer.getChildren = function() {
						var include = $scope.$outer.getInclude();
						return include.getChildren();
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
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildTab = function(opts) {
	var tag = $("<mj-tab>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildTabItem = function(opts) {
	var tag = $("<mj-tab-item>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};