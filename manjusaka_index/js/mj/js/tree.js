/**
 * 
 */

mj.module.directive('mjTree', function($compile, $http) {
	return mj.buildDirective({
		name : "mjTree",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.root = {
						"id" : "-1",
						"text" : "根节点",
						"checked" : "-1",
						"expanded" : "true",
						"isExpand" : "true",
						"isLeaf" : "false",
						"parent" : null,
						"showed" : "true"
					};

					$scope.$inner.defaultRoot = {
						"id" : "-1",
						"text" : "根节点",
						"checked" : "-1",
						"expanded" : "true",
						"isExpand" : "true",
						"isLeaf" : "false",
						"parent" : null,
						"showed" : "true"
					};
					$scope.$inner.action = "";
					$scope.$inner.param = {};
					$scope.$inner.selectNode = null;
					$scope.$inner.rootNode = null;
					$scope.$inner.cls = {
						"onAll" : "fa-check-square",
						"onPart" : "fa-check-square-o",
						"off" : "fa-square-o",
						"checked" : "mj-tree-box-checked",
						"eblowClose" : "fa-plus-square-o",
						"eblowOpen" : "fa-minus-square-o",
						"eblowLoad" : "fa-spinner",
						"iconClose" : "fa-folder",
						"iconOpen" : "fa-folder-open",
						"iconLeaf" : "fa-file-text",
						"rowSelect" : "mj-tree-row-select",
						"textSelect" : "mj-tree-text-select",
						"iconSelect" : "mj-tree-icon-select",
						"treeBox" : "mj-tree-box",
						"treeRow" : "mj-tree-row",
						"treeText" : "mj-tree-text",
						"treeCell" : "mj-tree-cell",
						"treeIcon" : "mj-tree-icon",
						"treeElbow" : "mj-tree-elbow",
						"treeIconLeaf" : "mj-tree-icon-leaf"
					};
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isEmpty($attrs.loadChanged)) {
							$attrs.loadChanged = false;
						}
						if (mj.isNotEmpty($attrs.iconOpen)) {
							$scope.$inner.cls.iconOpen = $attrs.iconOpen;
						}
						if (mj.isNotEmpty($attrs.iconClose)) {
							$scope.$inner.cls.iconClose = $attrs.iconClose;
						}
						if (mj.isNotEmpty($attrs.iconLeaf)) {
							$scope.$inner.cls.iconLeaf = $attrs.iconLeaf;
						}
						if (mj.isFalse($attrs.rootShowed) || mj.isFalse($attrs.rootShowable)) {
							$scope.$inner.root.showed = false;
						}
						if (mj.isNotEmpty($attrs.rootText)) {
							$scope.$inner.root.text = $attrs.rootText;
						}
						if (mj.isNotEmpty($attrs.rootId)) {
							$scope.$inner.root.id = $attrs.rootId;
						}
					};

					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var timer = null;

					$scope.$inner.build = function() {
					}

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
					 * 外部方法：构建根节点
					 */
					$scope.$outer.buildRootNode = function(opt) {
						$.extend(true, $scope.$inner.root, opt);
					};

					/**
					 * 内部方法：构建根节点
					 */
					$scope.$inner.buildRoot = function() {
						var array = [];
						array.push($scope.$inner.root);
						$scope.$inner.buildNode(null, array, $scope.$inner.root.parentId);
						$scope.$inner.rootNode = $element.find("div[data-id='" + $scope.$inner.root.id + "']");
						if (mj.isFalse($scope.$inner.root.showed)) {
							$scope.$inner.rootNode.hide();
						}
					}

					/**
					 * 外部方法：加载
					 */
					$scope.$outer.load = function(param, action, succFun) {
						$scope.$inner.param = param;
						$scope.$inner.action = action;
						$scope.$outer.loadAfter = succFun;
						$scope.$inner.buildRoot();
						$scope.$inner.buildLoadAfter();
					}

					/**
					 * 外部方法：重新加载
					 */
					$scope.$outer.reload = function() {
						if ($scope.$inner.rootNode == null) {
							return;
						} else {
							$scope.$outer.getRootNode().refresh(null,true);
						}
					}

					/**
					 * 外部方法：清空树
					 */
					$scope.$outer.clear = function() {
						$element.empty();
						$scope.$inner.rootNode = null;
						$.extend(true, $scope.$inner.root, $scope.$inner.defaultRoot);
						$scope.$inner.init();
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
							},
							error : function(xhr, textStatus) {
								throw textStatus;
							}
						})
					};

					/**
					 * 外部方法：设置是否完全展开
					 */
					$scope.$outer.setExpanded = function(flag) {
						$attrs.expanded = flag;
					}

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
					 * 内部方法：初始化方法
					 */
					$scope.$inner.initTree = function() {
						$scope.$inner.load($scope.$inner.rootNode, $scope.$inner.root.id);
					};

					/**
					 * 内部方法：构建节点方法
					 */
					$scope.$inner.buildNode = function(parent, nodes, parentId) {
						if (parent == null) {
							parent = $element;
						}
						$.each(nodes, function(index, node) {
							if (node.parentId == parentId) {
								if (mj.isTrue($attrs.expanded)) {
									node.isExpand = true;
								}
								$scope.$inner.addChild(parent, parentId, node);
							}
						});
					};

					/**
					 * 内部方法：内部判断是否是叶子节点
					 */
					$scope.$inner.isLeaf = function(isLeaf) {
						if (isLeaf == "1" || isLeaf == 1 || isLeaf == "true" || isLeaf == true) {
							return true;
						} else {
							return false;
						}
					};

					/**
					 * 内部方法：内部构建标题方法
					 */
					$scope.$inner.buildText = function(item, elbow, icon, text, data) {
						item.on("click", function(event) {
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
								if (mj.isNotEmpty($attrs.click)) {
									if ($.isFunction(mj.findCtrlScope($scope)[$attrs.click])) {
										mj.findCtrlScope($scope)[$attrs.click]($scope.$inner.buildParam(item));
									}
								}
								if($.isFunction($scope.$inner.clickFunc)){
									$scope.$inner.clickFunc($scope.$inner.buildParam(item));
								}
							}, mj.delayedTime);
							event.stopPropagation();
						});

						item.on("dblclick", function(event) {
							clearTimeout(timer);
							elbow.click();
							event.stopPropagation();
						});
					};
					
					$scope.$outer.setClick = function(func) {
						$scope.$inner.clickFunc=func;
					};
					
					$scope.$outer.setCheck = function(func) {
						$scope.$inner.checkFunc=func;
					};

					/**
					 * 内部方法：构建节点对象
					 */
					$scope.$inner.buildParam = function(item) {
						var data = item.data("data-data");
						return {
							getId : function() {
								return data.id;
							},
							getText : function() {
								return data.text;
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
							getTree : function() {
								return $scope.$outer;
							},
							expand : function() {
								$scope.$outer.expand(item);
							},
							collapse : function() {
								$scope.$inner.collapse(item);
							},
							isChecked : function() {
								var box = item.find("." + $scope.$inner.cls.treeBox).first();
								if (box.hasClass($scope.$inner.cls.checked)) {
									return true;
								} else {
									return false;
								}
							},
							checkChildren : function() {
								$scope.$inner.checkChildren(item);
							},
							uncheckChildren : function() {
								$scope.$inner.uncheckChildren(item);
							},
							getChildren : function() {
								var children = [];
								$.each($scope.$inner.getChildren(item), function(index, child) {
									children.push($scope.$inner.buildParam($(child)));
								});
								return children;
							},
							getParent : function() {
								var parent = $scope.$inner.getParent(item);
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
									if (parent.length > 0) {
										parent.data("data-data").isLeaf = true;
										$scope.$inner.switchStatus(parent, "2");
									}
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
					};

					/**
					 * 内部方法：构建icon
					 */
					$scope.$inner.buildIcon = function(item, elbow, icon, text, id) {
						elbow.on("click", function(event) {
							if (elbow.hasClass($scope.$inner.cls.eblowClose)) {
								$scope.$inner.expandChildren(item, false);
							} else if (elbow.hasClass($scope.$inner.cls.eblowOpen)) {
								$scope.$inner.collapse(item);
							}
							event.stopPropagation();
						});
					};

					/**
					 * 内部方法：构建box
					 */
					$scope.$inner.buildCheckbox = function(item, elbow, icon, text, data) {
						var box = $('<a>');
						box.addClass($scope.$inner.cls.treeBox);
						box.addClass("fa");
						box.addClass($scope.$inner.cls.off);
						box.insertBefore(text);
						box.on("click", function(event) {
							$scope.$inner.boxClickFunc(item, box, event, true);
						});
						if (mj.isTrue(data.checked)) {
							$scope.$inner.boxClickFunc(item, box, window.event, $attrs.loadChanged);
						}
					};

					/**
					 * 内部方法：box点击事件
					 */
					$scope.$inner.boxClickFunc = function(item, box, event, changeFlag) {
						if (box.hasClass($scope.$inner.cls.off)) {
							$scope.$inner.checkChildren(item);
							$scope.$inner.checkParent(item);
						} else {
							$scope.$inner.uncheckChildren(item);
							$scope.$inner.uncheckParent(item);
						}
						if (mj.isTrue(changeFlag)) {
							if (mj.isNotEmpty($attrs.check)) {
								if ($.isFunction(mj.findCtrlScope($scope)[$attrs.check])) {
									mj.findCtrlScope($scope)[$attrs.check]($scope.$inner.buildParam(item));
								}
							}
							if($.isFunction($scope.$inner.checkFunc)){
								$scope.$inner.checkFunc($scope.$inner.buildParam(item));
							}
						}
						if (mj.isNotEmpty(event)) {
//							alert(event.stopPropagation);
//							event.stopPropagation();
						}
					};

					/**
					 * 内部方法：取消选择子节点
					 */
					$scope.$inner.uncheckParent = function(item) {
						var parent = $scope.$inner.getParent(item);
						while (parent.length > 0) {
							var pbox = parent.first().find("." + $scope.$inner.cls.treeBox).first();
							var allFlag = true;
							var nodes = $scope.$inner.getChildren(parent);
							if (nodes.length > 0) {
								$.each(nodes, function(index, node) {
									var sbox = $(node).find("." + $scope.$inner.cls.treeBox).first();
									if (!sbox.hasClass($scope.$inner.cls.off)) {
										allFlag = false;
									}
								});
							}
							pbox.removeClass($scope.$inner.cls.onAll);
							pbox.removeClass($scope.$inner.cls.onPart);
							pbox.removeClass($scope.$inner.cls.off);
							if (allFlag) {
								pbox.removeClass($scope.$inner.cls.checked);
								pbox.addClass($scope.$inner.cls.off);
							} else {
								pbox.addClass($scope.$inner.cls.checked);
								pbox.addClass($scope.$inner.cls.onPart);
							}
							parent = $scope.$inner.getParent(parent.first());
						}
					};

					/**
					 * 内部方法：选择父节点
					 */
					$scope.$inner.checkParent = function(item) {
						var parent = $scope.$inner.getParent(item);
						while (parent.length > 0) {
							var pbox = parent.first().find("." + $scope.$inner.cls.treeBox).first();
							var allFlag = true;
							var nodes = $scope.$inner.getChildren(parent);
							if (nodes.length > 0) {
								$.each(nodes, function(index, node) {
									var sbox = $(node).find("." + $scope.$inner.cls.treeBox).first();
									if (!sbox.hasClass($scope.$inner.cls.onAll)) {
										allFlag = false;
									}
								});
							}
							pbox.removeClass($scope.$inner.cls.onAll);
							pbox.removeClass($scope.$inner.cls.onPart);
							pbox.removeClass($scope.$inner.cls.off);
							pbox.addClass($scope.$inner.cls.checked);
							if (allFlag) {
								pbox.addClass($scope.$inner.cls.onAll);
							} else {
								pbox.addClass($scope.$inner.cls.onPart);
							}
							parent = $scope.$inner.getParent(parent.first());
						}
					};

					/**
					 * 内部方法：选择子节点
					 */
					$scope.$inner.checkChildren = function(item) {
						var box = item.find("." + $scope.$inner.cls.treeBox).first();
						box.removeClass($scope.$inner.cls.off);
						box.addClass($scope.$inner.cls.checked);
						box.addClass($scope.$inner.cls.onAll);
						var nodes = $scope.$inner.getChildren(item);
						if (nodes.length > 0) {
							$.each(nodes, function(index, node) {
								$scope.$inner.checkChildren($(node));
							});
						}
					};

					/**
					 * 内部方法：取消选择子节点
					 */
					$scope.$inner.uncheckChildren = function(item) {
						var box = item.find("." + $scope.$inner.cls.treeBox).first();
						box.removeClass($scope.$inner.cls.onAll);
						box.addClass($scope.$inner.cls.off);
						box.removeClass($scope.$inner.cls.checked);
						var nodes = $scope.$inner.getChildren(item);
						if (nodes.length > 0) {
							$.each(nodes, function(index, node) {
								$scope.$inner.uncheckChildren($(node));
							});
						}
					};

					/**
					 * 外部方法：获取所有选择节点
					 */
					$scope.$outer.getChildren = function() {
						var children = $element.find("." + $scope.$inner.cls.treeRow);
						var list = new Array();
						$.each(children, function(index, child) {
							list.push($scope.$inner.buildParam($(child)));
						});
						return list;
					},

					/**
					 * 外部方法：获取所有选择节点
					 */
					$scope.$outer.getChildById = function(id) {
						var child = $element.find("[data-id='" + id + "']");
						if (child.length > 0) {
							return $scope.$inner.buildParam(child.first());
						} else {
							return null;
						}
					},

					/**
					 * 外部方法：获取所有选择节点
					 */
					$scope.$outer.getCheckedChildren = function() {
						var children = $element.find("." + $scope.$inner.cls.treeRow);
						var list = new Array();
						$.each(children, function(index, child) {
							var box = $(child).find("." + $scope.$inner.cls.treeBox).first();
							if (!box.hasClass($scope.$inner.cls.off)) {
								list.push($scope.$inner.buildParam($(child)));
							}
						});
						return list;
					},

					/**
					 * 外部方法：获取所有未选择节点
					 */
					$scope.$outer.getUncheckedChildren = function() {
						var children = $element.find("." + $scope.$inner.cls.treeRow);
						var list = new Array();
						$.each(children, function(index, child) {
							var box = $(child).find("." + $scope.$inner.cls.treeBox).first();
							if (box.hasClass($scope.$inner.cls.off)) {
								list.push($scope.$inner.buildParam($(child)));
							}
						});
						return list;
					},

					/**
					 * 内部方法：增加节点
					 */
					$scope.$inner.addChild = function(parent, parentId, data) {
						var item = $(mj.templates.mjTreeItem);
						var elbow = $scope.$inner.getSwitch(item);
						var icon = $scope.$inner.getIcon(item);
						var text = item.find("." + $scope.$inner.cls.treeText).first();
						var cell = item.find("." + $scope.$inner.cls.treeCell).first();
						if(mj.isNotEmpty(data.iconLeaf)){
							$scope.$inner.cls.iconLeaf=data.iconLeaf;
						}
						if(mj.isNotEmpty(data.iconOpen)){
							$scope.$inner.cls.iconOpen=data.iconOpen;
						}
						if(mj.isNotEmpty(data.iconClose)){
							$scope.$inner.cls.iconClose=data.iconClose;
						}
						text.text(data.text);
						item.attr({
							"data-id" : data.id,
							"data-pid" : parentId
						});

						item.data("data-data", data);

						$scope.$inner.buildText(item, elbow, icon, text, data);
						$scope.$inner.buildIcon(item, elbow, icon, text, data.id);
						if (mj.isTrue($attrs.checkable)) {
							$scope.$inner.buildCheckbox(item, elbow, icon, text, data);
						}

						if (parent == $element) {
							if (mj.isTrue($scope.$inner.root.showed)) {
								cell.css({
									"padding-left" : "15px"
								});
							}
							$element.append(item);
						} else {
							var pleft = parent.find("." + $scope.$inner.cls.treeCell).first().css("paddingLeft");
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
						if (mj.isTrue($scope.$inner.root.showed)) {
							$scope.$inner.collapse($scope.$inner.rootNode);
						} else {
							var nodes = $scope.$inner.getChildren($scope.$inner.rootNode);
							$.each(nodes, function(index, node) {
								$scope.$inner.collapse($(node));
							});
						}
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
						return item.find("." + $scope.$inner.cls.treeElbow).first();
					}

					/**
					 * 内部方法：获取图标
					 */
					$scope.$inner.getIcon = function(item) {
						return item.find("." + $scope.$inner.cls.treeIcon).first();
					}

					/**
					 * 内部方法：获取图标
					 */
					$scope.$inner.getText = function(item) {
						return item.find("." + $scope.$inner.cls.treeText).first();
					}

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
					 * 内部方法：内部递归展开函数
					 */
					$scope.$inner.expandFor = function(item, allFlag) {
						var nodes = $scope.$inner.getChildren(item);
						$.each(nodes, function(index, node) {
							$(node).css({
								"display" : "table-row"
							});
							if (allFlag == true) {
								$scope.$inner.expandChildren($(node), allFlag);
							}
						});
					}

					/**
					 * 内部方法：获取子节点
					 */
					$scope.$inner.getChildren = function(node) {
						return $element.find("[data-pid='" + node.attr("data-id") + "']");
					};

					/**
					 * 内部方法：获取所有父节点
					 */
					$scope.$inner.getAllParent = function(node, plist) {
						var parent = $scope.$inner.getParent(node);
						while (parent.length > 0) {
							plist.push(parent);
							parent = $scope.$inner.getParent(parent);
						}
					};

					/**
					 * 内部方法：获取父节点
					 */
					$scope.$inner.getParent = function(node) {
						return $element.find("[data-id='" + node.attr("data-pid") + "']");
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
						$attrs.expanded = true;
						if (mj.isTrue($scope.$inner.root.showed)) {
							$scope.$inner.expandChildren($scope.$inner.rootNode, true);
						} else {
							var nodes = $scope.$inner.getChildren($scope.$inner.rootNode);
							$.each(nodes, function(index, node) {
								$scope.$inner.expandChildren($(node), true);
							});
						}
						$attrs.expanded = false;
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
					 * 外部方法：获取当前选中的节点
					 */
					$scope.$outer.getSelectNode = function() {
						if (mj.isEmpty($scope.$inner.selectNode)) {
							return null;
						}
						return $scope.$inner.buildParam($scope.$inner.selectNode);
					}

					/**
					 * 是否自动加载
					 */
					if (mj.isTrue($attrs.autoload)) {
						$scope.$inner.buildRoot();
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
					$scope.$inner.build();
				}
			}

		}
	});
});

/**
 * 动态构建控件
 */
mj.buildTree = function(opts) {
	var tag = $("<mj-tree>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};