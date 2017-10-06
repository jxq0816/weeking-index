/**
 * 
 */
mj.module.directive('mjLayout', function($compile) {
	return mj.buildDirective({
		name : "mjLayout",
		transclude : {
			'north' : '?mjLayoutNorth',
			'south' : '?mjLayoutSouth',
			'center' : 'mjLayoutCenter',
			'east' : '?mjLayoutEast',
			'west' : '?mjLayoutWest'
		},
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.children = {};
					$scope.$inner.addNorth = function(el, rs, sc) {
						$scope.$inner.children.north = {
							"el" : el,
							"rs" : rs,
							"sc" : sc
						};
					};
					$scope.$inner.addSouth = function(el, rs, sc) {
						$scope.$inner.children.south = {
							"el" : el,
							"rs" : rs,
							"sc" : sc
						};
					};
					$scope.$inner.addCenter = function(el, rs, sc) {
						$scope.$inner.children.center = {
							"el" : el,
							"rs" : rs,
							"sc" : sc
						};
					};
					$scope.$inner.addEast = function(el, rs, sc) {
						$scope.$inner.children.east = {
							"el" : el,
							"rs" : rs,
							"sc" : sc
						};
					};
					$scope.$inner.addWest = function(el, rs, sc) {
						$scope.$inner.children.west = {
							"el" : el,
							"rs" : rs,
							"sc" : sc
						};
					};
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
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
					mj.buildPost($scope.$outer, $scope, $element, $attrs);
					$scope.$inner.north = $scope.$inner.children.north;
					$scope.$inner.south = $scope.$inner.children.south;
					$scope.$inner.west = $scope.$inner.children.west;
					$scope.$inner.east = $scope.$inner.children.east;
					$scope.$inner.center = $scope.$inner.children.center;

					if ($.isEmptyObject($scope.$inner.center)) {
						throw "[mjLayoutCenter]：不能为空，请检查...";
					}

					/**
					 * 内部隐藏视图函数
					 */
					$scope.$inner.hideView = function(node) {
						if (!$.isEmptyObject(node)) {
							if (mj.isTrue(node.sc.$inner.hidden)) {
								return;
							}
							node.el.css({
								"display" : "none"
							});
						}
					};

					/**
					 * 内部显示视图函数
					 */
					$scope.$inner.showView = function(node, name) {
						if (!$.isEmptyObject(node)) {
							if (mj.isTrue(node.sc.$inner.hidden)) {
								return;
							}
							node.el.css({
								"height" : node.el.parent().innerHeight()
							});
							node.el.css({
								"display" : "block"
							});
						}
					};

					/**
					 * 布局函数
					 */
					$scope.$outer.layout = function() {
						$.each($scope.$inner.children, function(key, value) {
							$scope.$inner.hideView(value);
						});
						$scope.$inner.center.el.parent().height(0);
						var body = $element.find(".mj-layout-body").first();
						body.css({
							"display" : "none"
						});
						$scope.$inner.showView($scope.$inner.north, "north");
						$scope.$inner.showView($scope.$inner.south, "south");
						body.css({
							"display" : "table-cell",
						});
						var height = body.innerHeight();
						$scope.$inner.center.el.parent().height(height);
						$scope.$inner.showView($scope.$inner.east, "east");
						$scope.$inner.showView($scope.$inner.west, "west");
						$scope.$inner.showView($scope.$inner.center, "center");
						mj.layoutView($attrs.id);
					};

					$scope.$inner.switcher = function() {
						$.each($scope.$inner.children, function(key, child) {
							if (mj.isFalse(child.rs.showable)) {
								if (key != "center") {
									var _switch = null;
									if (key == "west" || key == "east") {
										_switch = child.el.next().find(".mj-layout-split-v-switch").first();
									} else {
										_switch = child.el.next().find(".mj-layout-split-h-switch").first();
									}
									if (mj.isNotEmpty(_switch)) {
										_switch.click();
									}
								}

							}
						});
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
					 * 获取north对象
					 */
					$scope.$outer.getNorth = function() {
						if (mj.isEmpty($scope.$inner.north)) {
							return null;
						} else {
							return $scope.$inner.north.sc.$outer;
						}
					};

					/**
					 * 获取south对象
					 */
					$scope.$outer.getSouth = function() {
						if (mj.isEmpty($scope.$inner.south)) {
							return null;
						} else {
							return $scope.$inner.south.sc.$outer;
						}
					};

					/**
					 * 获取east对象
					 */
					$scope.$outer.getEast = function() {
						if (mj.isEmpty($scope.$inner.east)) {
							return null;
						} else {
							return $scope.$inner.east.sc.$outer;
						}
					};

					/**
					 * 获取west对象
					 */
					$scope.$outer.getWest = function() {
						if (mj.isEmpty($scope.$inner.west)) {
							return null;
						} else {
							return $scope.$inner.west.sc.$outer;
						}
					};

					/**
					 * 获取center对象
					 */
					$scope.$outer.getCenter = function() {
						if (mj.isEmpty($scope.$inner.center)) {
							return null;
						} else {
							return $scope.$inner.center.sc.$outer;
						}
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

mj.module.directive('mjLayoutNorth', function($compile) {
	return mj.buildDirective({
		name : "mjLayoutNorth",
		require : [ '^?mjLayout' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.hArray = [ "left", "right", "center" ];
					$scope.$inner.vArray = [ "top", "bottom", "middle" ];
					$scope.$inner.cell = $element.parent();
					$scope.$inner.row = $element.parent().parent();
					$scope.$inner.switcher = $scope.$inner.row.next().find(".mj-layout-switch").first();
					$scope.$inner.hidden = false;
					$scope.$inner.init = function() {

						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$scope.$inner.cell.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.padding)) {
							$scope.$inner.cell.css({
								"padding" : $attrs.padding
							});
						}
						if ($attrs.border == "false") {
							$scope.$inner.cell.css({
								"border" : "none"
							});
						}
						if (mj.isNumber($attrs.height)) {
							$scope.$inner.cell.css({
								"height" : $attrs.height
							});
						}

						$element.css({
							"height" : $scope.$inner.cell.innerHeight()
						});
						if (mj.isNotEmpty($attrs.splitShowable) && mj.isFalse($attrs.splitShowable)) {
							$scope.$inner.row.next().css({
								"display" : "none"
							});
						}else{
							$scope.$inner.row.next().css({
								"display" : "table-row"
							});
						}

						if (mj.isTrue($attrs.hidable) || mj.isTrue($attrs.hidden)) {
							$scope.$inner.hidden = true;
							$scope.$inner.switcher.removeClass("fa-caret-up");
							$scope.$inner.switcher.addClass("fa-caret-down");
						} else {
							$scope.$inner.hidden = false;
							$scope.$inner.row.css({
								"display" : "table-row"
							});
						}

						if ($.inArray($attrs.horizontal, $scope.$inner.hArray) > -1) {
							$scope.$inner.cell.css({
								"text-align" : $attrs.horizontal
							});
						}
						if ($.inArray($attrs.vertical, $scope.$inner.vArray) > -1) {
							$scope.$inner.cell.css({
								"vertical-align" : $attrs.vertical
							});
						}
						if (mj.isTrue($attrs["switch"])) {
							$scope.$inner.switcher.css({
								"display" : "inline-block"
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var layoutScope = $scope.$inner.getParentScope();
					layoutScope.$inner.addNorth($element, $attrs, $scope);

					$scope.$inner.build = function() {
						$scope.$inner.buildSwitcher();
					};

					$scope.$inner.buildSwitcher = function() {
						$scope.$inner.switcher.on("click", function() {
							if (mj.isTrue($scope.$inner.hidden)) {
								$scope.$inner.row.css({
									"display" : "table-row"
								});
								$scope.$inner.switcher.removeClass("fa-caret-down");
								$scope.$inner.switcher.addClass("fa-caret-up");
								$scope.$inner.hidden = false;
							} else {
								$scope.$inner.row.css({
									"display" : "none"
								});
								$scope.$inner.switcher.removeClass("fa-caret-up");
								$scope.$inner.switcher.addClass("fa-caret-down");
								$scope.$inner.hidden = true;
							}
							layoutScope.$outer.layout();
						});
					}

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
					 * 显示
					 */
					$scope.$outer.show = function() {
						if (mj.isTrue($scope.$inner.hidden)) {
							$scope.$inner.switcher.click();
						}
					};

					/**
					 * 隐藏
					 */
					$scope.$outer.hide = function() {
						if (mj.isFalse($scope.$inner.hidden)) {
							$scope.$inner.switcher.click();
						}
					};
					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$scope.$inner.cell.css({
								"background-color" : color
							});
						}
					};

					$scope.$inner.build();
				}
			}
		}
	});
});

mj.module.directive('mjLayoutSouth', function($compile) {
	return mj.buildDirective({
		name : "mjLayoutSouth",
		require : [ '^?mjLayout' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.hArray = [ "left", "right", "center" ];
					$scope.$inner.vArray = [ "top", "bottom", "middle" ];
					$scope.$inner.cell = $element.parent();
					$scope.$inner.row = $element.parent().parent();
					$scope.$inner.switcher = $scope.$inner.row.prev().find(".mj-layout-switch").first();
					$scope.$inner.hidden = false;
					$scope.$inner.init = function() {

						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$scope.$inner.cell.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.padding)) {
							$scope.$inner.cell.css({
								"padding" : $attrs.padding
							});
						}
						if ($attrs.border == "false") {
							$scope.$inner.cell.css({
								"border" : "none"
							});
						}
						if (mj.isNumber($attrs.height)) {
							$scope.$inner.cell.css({
								"height" : $attrs.height
							});
						}

						$element.css({
							"height" : $scope.$inner.cell.innerHeight()
						});
						if (mj.isNotEmpty($attrs.splitShowable) && mj.isFalse($attrs.splitShowable)) {
							$scope.$inner.row.prev().css({
								"display" : "none"
							});
						}else{
							$scope.$inner.row.prev().css({
								"display" : "table-row"
							});
						}

						if (mj.isTrue($attrs.hidable) || mj.isTrue($attrs.hidden)) {
							$scope.$inner.hidden = true;
							$scope.$inner.switcher.removeClass("fa-caret-up");
							$scope.$inner.switcher.addClass("fa-caret-down");
						} else {
							$scope.$inner.hidden = false;
							$scope.$inner.row.css({
								"display" : "table-row"
							});
						}

						if ($.inArray($attrs.horizontal, $scope.$inner.hArray) > -1) {
							$scope.$inner.cell.css({
								"text-align" : $attrs.horizontal
							});
						}
						if ($.inArray($attrs.vertical, $scope.$inner.vArray) > -1) {
							$scope.$inner.cell.css({
								"vertical-align" : $attrs.vertical
							});
						}
						if (mj.isTrue($attrs["switch"])) {
							$scope.$inner.switcher.css({
								"display" : "inline-block"
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var layoutScope = $scope.$inner.getParentScope();
					layoutScope.$inner.addSouth($element, $attrs, $scope);

					$scope.$inner.build = function() {
						$scope.$inner.buildSwitcher();
					};

					$scope.$inner.buildSwitcher = function() {
						$scope.$inner.switcher.on("click", function() {
							if (mj.isTrue($scope.$inner.hidden)) {
								$scope.$inner.row.css({
									"display" : "table-row"
								});
								$scope.$inner.switcher.removeClass("fa-caret-up");
								$scope.$inner.switcher.addClass("fa-caret-down");
								$scope.$inner.hidden = false;
							} else {
								$scope.$inner.row.css({
									"display" : "none"
								});
								$scope.$inner.switcher.removeClass("fa-caret-down");
								$scope.$inner.switcher.addClass("fa-caret-up");
								$scope.$inner.hidden = true;
							}
							layoutScope.$outer.layout();
						});
					}

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
					 * 显示
					 */
					$scope.$outer.show = function() {
						if (mj.isTrue($scope.$inner.hidden)) {
							$scope.$inner.switcher.click();
						}
					};

					/**
					 * 隐藏
					 */
					$scope.$outer.hide = function() {
						if (mj.isFalse($scope.$inner.hidden)) {
							$scope.$inner.switcher.click();
						}
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$scope.$inner.cell.css({
								"background-color" : color
							});
						}
					};

					$scope.$inner.build();
				}
			}
		}
	});
});

mj.module.directive('mjLayoutEast', function($compile) {
	return mj.buildDirective({
		name : "mjLayoutEast",
		require : [ '^?mjLayout' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.hArray = [ "left", "right", "center" ];
					$scope.$inner.vArray = [ "top", "bottom", "middle" ];
					$scope.$inner.cell = $element.parent();
					$scope.$inner.switcher = $scope.$inner.cell.prev().find(".mj-layout-switch").first();
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$scope.$inner.cell.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.padding)) {
							$scope.$inner.cell.css({
								"padding" : $attrs.padding
							});
						}
						if ($attrs.border == "false") {
							$scope.$inner.cell.css({
								"border" : "none"
							});
						}
						if (mj.isNumber($attrs.width)) {
							$scope.$inner.cell.css({
								"width" : $attrs.width
							});
						}
						$element.css({
							"height" : $scope.$inner.cell.innerHeight()
						});

						if ($.inArray($attrs.horizontal, $scope.$inner.hArray) > -1) {
							$scope.$inner.cell.css({
								"text-align" : $attrs.horizontal
							});
						}
						if ($.inArray($attrs.vertical, $scope.$inner.vArray) > -1) {
							$scope.$inner.cell.css({
								"vertical-align" : $attrs.vertical
							});
						}
						
						if (mj.isNotEmpty($attrs.splitShowable) && mj.isFalse($attrs.splitShowable)) {
							$scope.$inner.cell.prev().css({
								"display" : "none"
							});
						}else{
							$scope.$inner.cell.prev().css({
								"display" : "table-cell"
							});
						}						

						if (mj.isTrue($attrs.hidable) || mj.isTrue($attrs.hidden)) {
							$scope.$inner.hidden = true;
							$scope.$inner.switcher.removeClass("fa-caret-right");
							$scope.$inner.switcher.addClass("fa-caret-left");
						} else {
							$scope.$inner.hidden = false;
							$scope.$inner.cell.css({
								"display" : "table-cell"
							});
						}

						if (mj.isTrue($attrs["switch"])) {
							$scope.$inner.switcher.css({
								"display" : "inline-block"
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var layoutScope = $scope.$inner.getParentScope();
					layoutScope.$inner.addEast($element, $attrs, $scope);

					$scope.$inner.build = function() {
						$scope.$inner.buildSwitcher();
					};

					$scope.$inner.buildSwitcher = function() {
						$scope.$inner.switcher.on("click", function() {
							if (mj.isTrue($scope.$inner.hidden)) {
								$scope.$inner.cell.css({
									"display" : "table-cell"
								});
								$scope.$inner.switcher.removeClass("fa-caret-left");
								$scope.$inner.switcher.addClass("fa-caret-right");
								$scope.$inner.hidden = false;
							} else {
								$scope.$inner.cell.css({
									"display" : "none"
								});
								$scope.$inner.switcher.removeClass("fa-caret-right");
								$scope.$inner.switcher.addClass("fa-caret-left");
								$scope.$inner.hidden = true;
							}
							layoutScope.$outer.layout();
						});
					}

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
					 * 显示
					 */
					$scope.$outer.show = function() {
						if (mj.isTrue($scope.$inner.hidden)) {
							$scope.$inner.switcher.click();
						}
					};

					/**
					 * 隐藏
					 */
					$scope.$outer.hide = function() {
						if (mj.isFalse($scope.$inner.hidden)) {
							$scope.$inner.switcher.click();
						}
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$scope.$inner.cell.css({
								"background-color" : color
							});
						}
					};

					$scope.$inner.build();
				}
			}
		}
	});
});

mj.module.directive('mjLayoutWest', function($compile) {
	return mj.buildDirective({
		name : "mjLayoutWest",
		require : [ '^?mjLayout' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.hArray = [ "left", "right", "center" ];
					$scope.$inner.vArray = [ "top", "bottom", "middle" ];
					$scope.$inner.cell = $element.parent();
					$scope.$inner.switcher = $scope.$inner.cell.next().find(".mj-layout-switch").first();
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$scope.$inner.cell.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.padding)) {
							$scope.$inner.cell.css({
								"padding" : $attrs.padding
							});
						}
						if ($attrs.border == "false") {
							$scope.$inner.cell.css({
								"border" : "none"
							});
						}
						if (mj.isNumber($attrs.width)) {
							$scope.$inner.cell.css({
								"width" : $attrs.width
							});
						}
						$element.css({
							"height" : $scope.$inner.cell.innerHeight()
						});

						if ($.inArray($attrs.horizontal, $scope.$inner.hArray) > -1) {
							$scope.$inner.cell.css({
								"text-align" : $attrs.horizontal
							});
						}
						if ($.inArray($attrs.vertical, $scope.$inner.vArray) > -1) {
							$scope.$inner.cell.css({
								"vertical-align" : $attrs.vertical
							});
						}
						if (mj.isNotEmpty($attrs.splitShowable) && mj.isFalse($attrs.splitShowable)) {
							$scope.$inner.cell.next().css({
								"display" : "none"
							});
						}else{
							$scope.$inner.cell.next().css({
								"display" : "table-cell"
							});
						}						

						if (mj.isTrue($attrs.hidable) || mj.isTrue($attrs.hidden)) {
							$scope.$inner.hidden = true;
							$scope.$inner.switcher.removeClass("fa-caret-right");
							$scope.$inner.switcher.addClass("fa-caret-left");
						} else {
							$scope.$inner.hidden = false;
							$scope.$inner.cell.css({
								"display" : "table-cell"
							});
						}

						if (mj.isTrue($attrs["switch"])) {
							$scope.$inner.switcher.css({
								"display" : "inline-block"
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var layoutScope = $scope.$inner.getParentScope();
					layoutScope.$inner.addWest($element, $attrs, $scope);

					$scope.$inner.build = function() {
						$scope.$inner.buildSwitcher();
					};

					$scope.$inner.buildSwitcher = function() {
						$scope.$inner.switcher.on("click", function() {
							if (mj.isTrue($scope.$inner.hidden)) {
								$scope.$inner.cell.css({
									"display" : "table-cell"
								});
								$scope.$inner.switcher.removeClass("fa-caret-right");
								$scope.$inner.switcher.addClass("fa-caret-left");
								$scope.$inner.hidden = false;
							} else {
								$scope.$inner.cell.css({
									"display" : "none"
								});
								$scope.$inner.switcher.removeClass("fa-caret-left");
								$scope.$inner.switcher.addClass("fa-caret-right");
								$scope.$inner.hidden = true;
							}
							layoutScope.$outer.layout();
						});
					}

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
					 * 显示
					 */
					$scope.$outer.show = function() {
						if (mj.isTrue($scope.$inner.hidden)) {
							$scope.$inner.switcher.click();
						}
					};

					/**
					 * 隐藏
					 */
					$scope.$outer.hide = function() {
						if (mj.isFalse($scope.$inner.hidden)) {
							$scope.$inner.switcher.click();
						}
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$scope.$inner.cell.css({
								"background-color" : color
							});
						}
					};

					$scope.$inner.build();
				}
			}
		}
	});
});

mj.module.directive('mjLayoutCenter', function($compile) {
	return mj.buildDirective({
		name : "mjLayoutCenter",
		require : [ '^?mjLayout' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.hArray = [ "left", "right", "center" ];
					$scope.$inner.vArray = [ "top", "bottom", "middle" ];
					$scope.$inner.cell = $element.parent();
					/**
					 * 初始化函数
					 */
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$scope.$inner.cell.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.padding)) {
							$scope.$inner.cell.css({
								"padding" : $attrs.padding
							});
						}
						if (mj.isFalse($attrs.border)) {
							$scope.$inner.cell.css({
								"border" : "none"
							});
						}
						$element.css({
							"height" : $scope.$inner.cell.innerHeight()
						});
						if ($.inArray($attrs.horizontal, $scope.$inner.hArray) > -1) {
							$scope.$inner.cell.css({
								"text-align" : $attrs.horizontal
							});
						}
						if ($.inArray($attrs.vertical, $scope.$inner.vArray) > -1) {
							$scope.$inner.cell.css({
								"vertical-align" : $attrs.vertical
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var layoutScope = $scope.$inner.getParentScope();
					layoutScope.$inner.addCenter($element, $attrs, $scope);

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
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : color
							});
						}
					};
				}
			}
		}
	});
});

mj.buildLayout = function(opts) {
	var tag = $("<mj-layout>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildLayoutNorth = function(opts) {
	var tag = $("<mj-layout-north>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildLayoutSouth = function(opts) {
	var tag = $("<mj-layout-south>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildLayoutEast = function(opts) {
	var tag = $("<mj-layout-east>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildLayoutWest = function(opts) {
	var tag = $("<mj-layout-west>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildLayoutCenter = function(opts) {
	var tag = $("<mj-layout-center>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};
