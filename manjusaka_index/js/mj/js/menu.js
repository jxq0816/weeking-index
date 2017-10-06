/**
 * 
 */

mj.module.directive('mjMenu', function($compile, $http) {
	return mj.buildDirective({
		name : "mjMenu",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.rootId = "-1";
					$scope.$inner.action = "";
					$scope.$inner.param = {};
					$scope.$inner.selectNode = null;
					$scope.$inner.allNode = [];
					$scope.$inner.cls = {
						"eblowClose" : "fa-plus-square-o",
						"eblowOpen" : "fa-minus-square-o",
						"eblowLoad" : "fa-spinner",
						"iconClose" : "fa-folder",
						"iconOpen" : "fa-folder-open",
						"iconLeaf" : "fa-file-text",
						"rowSelect" : "mj-menu-row-select",
						"textSelect" : "mj-menu-text-select",
						"iconSelect" : "mj-menu-icon-select",
						"menuRow" : "mj-menu-row",
						"menuText" : "mj-menu-text",
						"menuCell" : "mj-menu-cell",
						"menuIcon" : "mj-menu-icon",
						"menuElbow" : "mj-menu-elbow",
						"menuIconLeaf" : "mj-menu-icon-leaf"
					};
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
					var timer = null;

					/**
					 * 内部方法：清除节点
					 */
					$scope.$inner.clearChild = function(id) {
						var children = $element.find("[data-pid='" + id + "']");
						$.each(children, function(index, sub) {
							$scope.$inner.clearChild($(sub).attr("data-id"));
							$(sub).remove();
						});
					};

					/**
					 * 外部方法：加载
					 */
					$scope.$outer.load = function(param, action, parentId) {
						if (mj.isEmpty(parentId)) {
							parentId = $scope.$inner.rootId;
						}
						$scope.$inner.clearChild(parentId);
						$scope.$inner.param = param;
						$scope.$inner.action = action;
						$scope.$inner.load(null, $scope.$inner.rootId);
					}

					/**
					 * 内部方法：加载方法
					 */
					$scope.$inner.load = function(parent, parentId, succFun) {
						var method = "GET";
						if (!mj.isEmpty($attrs.method)) {
							method = $attrs.method
						}
						if (mj.isEmpty($scope.$inner.action)) {
							var _action = mj.findAttr($attrs.action, $scope);
							$scope.$inner.action = _action;
						}
						var _param = {};
						var condName = "condition";
						if (mj.isNotEmpty($scope.$inner.param)) {
							for ( var cond in $scope.$inner.param) {
								condName = cond;
							}
						} else {
							$scope.$inner.param = {};
						}
						if (parent == null) {
							_param[condName] = {
								"parentId" : parentId,
								"id" : parentId
							};
						} else {
							_param[condName] = parent.data("data-data");
						}
						$.extend(true, $scope.$inner.param, _param);
						$scope.$inner.http(parent, parentId, succFun, method, $scope.$inner.param, condName);
					};

					/**
					 * 内部方法：http请求
					 */
					$scope.$inner.http = function(parent, parentId, succFun, method, param, condName) {
						var _param = {};
						_param[condName] = JSON.stringify(param[condName]);
						$.ajax({
							url : $scope.$inner.action,
							type : method,
							async : true,
							data : _param,
							contentType : "application/json",
							dataType : 'json',
							success : function(data, textStatus, jqXHR) {
								if (data.code == 0) {
									$scope.$inner.buildNode(parent, data.data, parentId);
									if ($.isFunction(succFun)) {
										succFun();
									}
								}
								$scope.$inner.buildLoadAfter();
							},
							error : function(xhr, textStatus) {
								throw xhr;
							},
							complete : function() {

							}
						})
					};

					/**
					 * 加载后执行
					 */
					$scope.$outer.loadAfter = $attrs.loadAfter;

					/**
					 * 内部方法：构建加载后事件
					 */
					$scope.$inner.buildLoadAfter = function() {
						if (mj.isNotEmpty($scope.$outer.loadAfter)) {
							if ($.isFunction($scope.$outer.loadAfter)) {
								$scope.$outer.loadAfter($scope.$outer);
							} else {
								if ($.isFunction(mj.findCtrlScope($scope)[$scope.$outer.loadAfter])) {
									mj.findCtrlScope($scope)[$scope.$outer.loadAfter]($scope.$outer);
								}
							}
						}
					};

					/**
					 * 内部构建节点方法
					 */
					$scope.$inner.buildNode = function(parent, nodes, parentId) {
						if (parent == null) {
							parent = $element;
						}
						$.each(nodes, function(index, node) {
							if (node.parentId == parentId) {
								$scope.$inner.addChild(parent, parentId, node);
							}
						});
					};

					/**
					 * 内部方法：初始化方法
					 */
					$scope.$inner.isLeaf = function(isLeaf) {
						if (isLeaf == "1" || isLeaf == 1 || isLeaf == "true" || isLeaf == true) {
							return true;
						} else {
							return false;
						}
					};

					/**
					 * 内部方法：构建节点方法
					 */
					$scope.$inner.buildText = function(item, elbow, icon, text, data) {
						item.on("click", function() {
							clearTimeout(timer);
							timer = setTimeout(function() {
								if ($scope.$inner.selectNode != null) {
									$scope.$inner.getText($scope.$inner.selectNode).removeClass($scope.$inner.cls.textSelect);
									$scope.$inner.getIcon($scope.$inner.selectNode).removeClass($scope.$inner.cls.iconSelect);
									$scope.$inner.selectNode.removeClass($scope.$inner.cls.rowSelect);
								}
								$scope.$inner.selectNode = item;
								$scope.$inner.getText(item).addClass($scope.$inner.cls.textSelect);
								$scope.$inner.getIcon(item).addClass($scope.$inner.cls.iconSelect);
								item.addClass($scope.$inner.cls.rowSelect);
								if (!$.isEmptyObject($attrs.click)) {
									if ($.isFunction(mj.findCtrlScope($scope)[$attrs.click])) {
										mj.findCtrlScope($scope)[$attrs.click]($scope.$inner.buildParam(item));
									}
								}
							}, mj.delayedTime);
						});

						item.on("dblclick", function() {
							clearTimeout(timer);
							elbow.click();
						});
					};

					/**
					 * 内部方法：构建节点对象
					 */
					$scope.$inner.buildParam = function(item) {
						var data = item.data("data-data");
						var nodeObj = {
							getId : function() {
								return data.id;
							},
							isLeaf : function() {
								return $scope.$inner.isLeaf(data.isLeaf);
							},
							getData : function() {
								return data;
							},
							getNode : function() {
								return item;
							},
							getMenu : function() {
								return $scope.$outer;
							},
							expand : function() {
								$scope.$outer.expand(item);
							},
							collapse : function() {
								$scope.$inner.collapse(item);
							},
							getChildren : function() {
								var children = [];
								$.each($scope.$inner.getChildren(item), function(index, child) {
									children.push($scope.$inner.buildParam($(child)));
								});
								return children;
							},
							getParent : function() {
								var parent = $element.find("div[data-id='" + item.attr("data-pid") + "']");
								if (parent.length > 0) {
									return $scope.$inner.buildParam($(parent.first()));
								} else {
									return null;
								}
							},
							addChild : function(option) {
								if ($scope.$inner.isLeaf(data.isLeaf)) {
									data.isLeaf = false;
									$scope.$inner.switchStatus(item, "1");
								} else {
									$scope.$outer.expand(item);
								}
								$scope.$inner.addChild(item, item.attr("data-id"), option);
								var self = $element.find("div[data-id='" + option.id + "']");
								return $scope.$inner.buildParam(self.first());
							},
							addChildren : function(options) {
								if ($scope.$inner.isLeaf(data.isLeaf)) {
									data.isLeaf = false;
									$scope.$inner.switchStatus(item, "1");
								} else {
									$scope.$outer.expand(item);
								}
								var children = [];
								$.each(options, function(index, option) {
									$scope.$inner.addChild(item, item.attr("data-id"), option);
									var self = $element.find("div[data-id='" + option.id + "']");
									children.push($scope.$inner.buildParam(self.first()));
								});
								return children;
							},
							refresh : function(opt, refreshChildren) {
								if (mj.isNotEmpty(opt)) {
									if (mj.isNotEmpty(opt.text)) {
										data.text = opt.text;
										var text = item.find("." + $scope.$inner.cls.treeText).first();
										text.text(opt.text);
									}
								}
								if (mj.isTrue(refreshChildren)) {
									$scope.$inner.clearChild(item.attr("data-id"));
									$scope.$inner.switchStatus(item, "1");
									$scope.$outer.expand(item);
								}
							},
							remove : function() {
								var parent = $scope.$inner.getParent(item);
								$scope.$inner.clearChild(item.attr("data-id"));
								item.remove();
								var children = $scope.$inner.getChildren(parent);
								if (children.length == 0) {
									parent.data("data-data").isLeaf = true;
									$scope.$inner.switchStatus(parent, "2");
								}
							},
							removeChildren : function() {
								if (!$scope.$inner.isLeaf(data.isLeaf)) {
									$scope.$inner.collapse(item);
									$scope.$inner.clearChild(item.attr("data-id"));
									data.isLeaf = true;
									$scope.$inner.switchStatus(item, "2");
								}
							},
							removeChild : function(id) {
								var self = $element.find("div[data-id='" + id + "']");
								if (self.length > 0) {
									self.first().remove();
								}
								var children = $scope.$inner.getChildren(item);
								if (children.length == 0) {
									data.isLeaf = true;
									$scope.$inner.switchStatus(item, "2");
								}
							}
						};
						return nodeObj;
					};

					/**
					 * 内部方法：切换节点状态：是否叶子节点
					 */
					$scope.$inner.switchStatus = function(item, switchType) {
						var switcher = $scope.$inner.getSwitch(item);
						var icon = $scope.$inner.getIcon(item);
						switch (switchType) {
						case "1":// 由叶子节点变为非叶子结点
							icon.removeClass($scope.$inner.cls.iconLeaf);
							icon.addClass($scope.$inner.cls.iconClose);
							switcher.show();
							break;
						case "2":// 由非叶子结点转为叶子节点
							icon.removeClass($scope.$inner.cls.iconClose);
							icon.removeClass($scope.$inner.cls.iconOpen);
							icon.addClass($scope.$inner.cls.iconLeaf);
							switcher.hide();
						case "3":// 由关闭状态转为加载状态
							switcher.removeClass($scope.$inner.cls.eblowClose);
							switcher.addClass($scope.$inner.cls.eblowLoad);
							break;
						case "4":// 由加载或关闭状态转为打开状态
							if (!icon.hasClass($scope.$inner.cls.iconLeaf)) {
								if (icon.hasClass($scope.$inner.cls.iconClose)) {
									switcher.removeClass($scope.$inner.cls.eblowLoad);
									switcher.addClass($scope.$inner.cls.eblowOpen);
									icon.removeClass($scope.$inner.cls.iconClose);
									icon.addClass($scope.$inner.cls.iconOpen);
								}
							}
							break;
						}
					};

					/**
					 * 内部方法：构建icon
					 */
					$scope.$inner.buildIcon = function(item, elbow, icon, text, id) {
						elbow.on("click", function(event) {
							event.stopPropagation();
							if (elbow.hasClass($scope.$inner.cls.eblowClose)) {
								$scope.$inner.expandChildren(item, false);
								if ($attrs.collapse) {
									$scope.$inner.collapseOther(item);
								}
							} else if (elbow.hasClass($scope.$inner.cls.eblowOpen)) {
								$scope.$inner.collapse(item);
							}
						});
					};

					/**
					 * 内部方法：增加节点
					 */
					$scope.$inner.addChild = function(parent, parentId, data) {
						var item = $(mj.templates.mjMenuItem);
						var elbow = $scope.$inner.getSwitch(item);
						var icon = $scope.$inner.getIcon(item);
						var fa = item.find(".mj-menu-fa").first();
						var text = item.find("." + $scope.$inner.cls.menuText).first();
						var cell = item.find("." + $scope.$inner.cls.menuCell).first();

						text.text(data.text);
						item.attr({
							"data-id" : data.id,
							"data-pid" : parentId
						});

						item.data("data-data", data);

						$scope.$inner.buildText(item, elbow, icon, text, data);
						$scope.$inner.buildIcon(item, elbow, icon, text, data.id);

						if (parent == $element) {
							cell.css({
								"padding-left" : "15px"
							});
							$element.append(item);
						} else {
							var pleft = parent.find("." + $scope.$inner.cls.menuCell).first().css("paddingLeft");
							cell.css({
								"padding-left" : mj.number(pleft) + 18
							});
							var children = $scope.$inner.getChildren(parent);
							if (children.length > 0) {
								item.insertAfter($(children[children.length - 1]));
							} else {
								item.insertAfter(parent);
							}
						}
						fa.addClass(data.icon);
						if ($scope.$inner.isLeaf(data.isLeaf)) {
							icon.addClass($scope.$inner.cls.iconLeaf);
							elbow.css({
								"display" : 'none'
							});
						} else {
							icon.addClass($scope.$inner.cls.iconClose);
							elbow.addClass($scope.$inner.cls.eblowClose);
							if (mj.isTrue($attrs.expanded)) {
								elbow.click();
							} else if (mj.isTrue(data.isExpand)) {
								elbow.click();
							}
						}
						$scope.$inner.allNode.push(item);
					};

					/**
					 * 外部方法：收起某个节点
					 */
					$scope.$outer.collapse = function(node) {
						if (mj.isEmpty(node)) {
							return;
						} else {
							$scope.$inner.collapse(node);
						}
					};

					/**
					 * 外部方法：收起所有节点
					 */
					$scope.$outer.collapseAll = function() {
						var nodes = $element.find("[data-pid='" + $scope.$inner.rootId + "']");
						$.each(nodes, function(index, node) {
							$scope.$inner.collapse($(node));
						});
					};

					/**
					 * 内部方法：内部收起方法
					 */
					$scope.$inner.collapseOther = function(item) {
						var nodes = $element.find("[data-pid='" + item.attr("data-pid") + "']");
						$.each(nodes, function(index, node) {
							if ($(node).attr("data-id") != item.attr("data-id")) {
								$scope.$inner.collapse($(node));
							}

						});
					};

					/**
					 * 内部方法：内部收起方法
					 */
					$scope.$inner.collapse = function(item) {
						var elbow = $scope.$inner.getSwitch(item);
						var icon = $scope.$inner.getIcon(item);
						if (icon.hasClass($scope.$inner.cls.iconLeaf)) {
							return;
						}
						if (icon.hasClass($scope.$inner.cls.iconClose)) {
							return;
						} else if (icon.hasClass($scope.$inner.cls.iconOpen)) {
							elbow.removeClass($scope.$inner.cls.eblowOpen);
							elbow.addClass($scope.$inner.cls.eblowClose);
							icon.removeClass($scope.$inner.cls.iconOpen);
							icon.addClass($scope.$inner.cls.iconClose);
						}
						var children = $scope.$inner.getChildren(item);
						if (children.length > 0) {
							$.each(children, function(index, subItem) {
								$(subItem).css({
									"display" : "none"
								});
								$scope.$inner.collapse($(subItem));
							});
						}
					};

					/**
					 * 内部方法：获取开关
					 */
					$scope.$inner.getSwitch = function(item) {
						return item.find("." + $scope.$inner.cls.menuElbow).first();
					}

					/**
					 * 内部方法：获取图标
					 */
					$scope.$inner.getIcon = function(item) {
						return item.find("." + $scope.$inner.cls.menuIcon).first();
					}

					/**
					 * 内部方法：获取图标
					 */
					$scope.$inner.getText = function(item) {
						return item.find("." + $scope.$inner.cls.menuText).first();
					}

					/**
					 * 内部方法：展开子节点
					 */
					$scope.$inner.expandChildren = function(item, allFlag) {
						$scope.$inner.switchStatus(item, "3");
						var children = $scope.$inner.getChildren(item);
						if (children.length == 0) {
							$scope.$inner.load(item, item.attr("data-id"), function() {
								var children = $scope.$inner.getChildren(item);
								var data = item.data("data-data");
								if (children.length == 0) {
									data.isLeaf = true;
									$scope.$inner.switchStatus(item, "2");
								} else {
									data.isLeaf = false;
									$scope.$inner.switchStatus(item, "4");
									$scope.$inner.expandFor(item, allFlag);
								}
							});
						} else {
							$scope.$inner.switchStatus(item, "4");
							$scope.$inner.expandFor(item, allFlag);
						}
					};

					/**
					 * 内部递归展开函数
					 */
					$scope.$inner.expandFor = function(item, allFlag) {
						var nodes = $scope.$inner.getChildren(item);
						$.each(nodes, function(index, node) {
							$(node).css({
								"display" : "table-row"
							});
							if (allFlag == true) {
								$scope.$inner.expandChildren($(node));
							}
						});
					}

					/**
					 * 内部方法：获取第一级子节点
					 */
					$scope.$inner.getChildren = function(node) {
						return $element.find("[data-pid='" + node.attr("data-id") + "']");
					};

					/**
					 * 外部方法：展开节点
					 */
					$scope.$outer.expand = function(node) {
						var id = "";
						if (mj.isEmpty(node)) {
							return;
						} else {
							$scope.$inner.expandChildren(node, false);
						}
					};

					/**
					 * 外部方法：展开所有节点
					 */
					$scope.$outer.expandAll = function() {
						var nodes = $element.find("[data-pid='" + $scope.$inner.rootId + "']");
						$.each(nodes, function(index, node) {
							$scope.$inner.expandChildren($(node), true);
						});
					};

					/**
					 * 外部方法：获取根节点
					 */
					$scope.$outer.getRootNode = function() {
						if (mj.isEmpty($scope.$inner.rootNode)) {
							return null;
						}
						return $scope.$inner.buildParam($scope.$inner.rootNode);
					};
					
					/**
					 * 外部方法：获取所有节点
					 */
					$scope.$outer.getAllNode = function() {
						return $scope.$inner.allNode;
					}
					
					/**
					 * 外部方法：获取当前选中的节点
					 */
					$scope.$outer.getSelectNode = function() {
						if (mj.isEmpty($scope.$inner.selectNode)) {
							return null;
						}
						return $scope.$inner.buildParam($scope.$inner.selectNode);
					}

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
					 * 是否自动加载
					 */
					if (mj.isTrue($attrs.autoload)) {
						$scope.$inner.load(null, $scope.$inner.rootId);
					}
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildMenu = function(opts) {
	var tag = $("<mj-menu>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};
