/**
 * 
 */

mj.module.directive('mjTable', function($http, $compile) {
	return mj.buildDirective({
		name : "mjTable",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.hd_checkbox = null;
					$scope.$inner.rowClick = false;
					$scope.$inner.columns = [];
					$scope.$inner.footBuilded = false;
					$scope.$inner.pageFun = null;
					$scope.$inner.loading = null;

					$scope.$inner.buildLoading = function() {
						var $body = $(document.body);
						if ($body.find(".mj-table-loading").length > 0) {
							$scope.$inner.loading = $body.find(".mj-table-loading").first();
						} else {
							$scope.$inner.loading = $(mj.templates.mjTableLoading);
						}
						$(document.body).append($scope.$inner.loading);
					};

					$scope.$inner.addColumn = function(col) {
						$scope.$inner.columns.push(col);
					};

					$scope.$inner.setPage = function() {
						var pagesize = 15;
						if (!mj.isEmpty($attrs.pagesize)) {
							pagesize = mj.number($attrs.pagesize);
							if (pagesize == 0) {
								pagesize = 15;
							}
						}
						$scope.$inner.page = {
							"pageStart" : 1,
							"pageSize" : pagesize,
							"pageTotal" : 0,
							"total" : 0
						};
					};

					$scope.$inner.doInit = function() {
						$scope.$inner.setPage();
						if (mj.isEmpty($attrs.border)) {
							$attrs.border = true;
						}
						if (!$.isEmptyObject($attrs.height)) {
							$element.css({
								"height" : $attrs.height
							});
						}
						if (!$.isEmptyObject($attrs.width)) {
							$element.css({
								"width" : $attrs.width
							});
						}
						if (mj.isEmpty($attrs.totalEnable) || mj.isTrue($attrs.totalEnable)) {
							$attrs.totalEnable = true;
							$attrs.homeShowable = true;
							$attrs.lastShowable = true;
						} else {
							$attrs.homeShowable = false;
							$attrs.lastShowable = false;
						}
						if (mj.isEmpty($attrs.prevShowable) || mj.isTrue($attrs.prevShowable)) {
							$attrs.prevShowable = true;
						} else {
							$attrs.prevShowable = false;
						}
						if (mj.isEmpty($attrs.nextShowable) || mj.isTrue($attrs.nextShowable)) {
							$attrs.nextShowable = true;
						} else {
							$attrs.nextShowable = false;
						}
						if (mj.isTrue($attrs.loadingEnable)) {
							$scope.$inner.buildLoading();
						}
					};

					$scope.$inner.doInit();

				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var tableData = [];
					var selectData = [];
					var tableTr = [];
					var _height = 0;
					$element.append($(mj.templates.mjTableHead));
					$element.append($(mj.templates.mjTableBody));
					if ($attrs.page == "true") {
						$element.append($(mj.templates.mjTableFoot));
					}
					var body_content = $element.find(".mj-table-body-content:first-child");
					var head_content = $element.find(".mj-table-head-content:first-child");
					var body_tbody = $element.find(".mj-table-bd-tbody:first-child");
					var head_tbody = $element.find(".mj-table-hd-tbody:first-child");
					var element_foot = $element.find(".mj-table-foot:first-child");
					if (mj.isFalse($attrs.border)) {
						element_foot.css({
							"border" : "none"
						});
					}

					/**
					 * 显示加载
					 */
					$scope.$inner.showLoading = function() {
						if (mj.isNotEmpty($scope.$inner.loading)) {
							var offset = $element.offset();
							$scope.$inner.loading.css({
								"left" : offset.left + "px",
								"top" : offset.top + "px",
								"width" : $element.width() + "px",
								"height" : $element.height() + "px",
								"line-height" : $element.height() + "px",
								"display" : "block"
							});
						}
					};

					$scope.$inner.hideLoading = function() {
						if (mj.isNotEmpty($scope.$inner.loading)) {
							$scope.$inner.loading.css({
								"display" : "none"
							});
						}
					};

					$scope.$inner.pageTotal = function() {
						if (mj.isTrue($attrs.totalEnable)) {
							var _size = $scope.$inner.page.total % $scope.$inner.page.pageSize;
							var _page = parseInt($scope.$inner.page.total / $scope.$inner.page.pageSize);
							var pageTotal = (_size == 0) ? (_page) : (_page + 1);
							return pageTotal;
						} else {
							return 0;
						}
					}

					/**
					 * 判断数据是否全选
					 */
					$scope.$inner.isAllCheck = function() {
						if (!$.isEmptyObject(tableData)) {
							for (var i = 0; i < tableData.length; i++) {
								if (tableData[i].checked == 0) {
									return false;
								}
							}
							return true;
						}
						return false;
					}

					/**
					 * 初始化
					 */
					$scope.$inner.init = function() {
						if ($scope.$inner.columns.length != 0) {
							$scope.$inner.buildHead();
						}
						if ($attrs.page == "true") {
							if (mj.isFalse($scope.$inner.footBuilded)) {
								$scope.$inner.footBuilded = true;
								$scope.$inner.buildFoot();
							}
						}
					}

					/**
					 * 表头
					 */
					$scope.$inner.buildHead = function() {
						var head_tr = $scope.$inner.buildTr("mj-table-hd-row", head_tbody);
						if ($scope.$inner.columnAttrs.model == "multiple") {
							var head_td = $scope.$inner.buildTd("mj-table-hd-work", head_tr);
							$scope.$inner.buildHdCheckbox(head_td);
							head_td.width(30);
						}
						if ($scope.$inner.columnAttrs.model == "single") {
							var head_td = $scope.$inner.buildTd("mj-table-hd-work", head_tr);
							head_td.text("选择");
							head_td.width(30);
						}
						if ($scope.$inner.columnAttrs.index == "true") {
							var head_td = $scope.$inner.buildTd("mj-table-hd-index", head_tr);
							head_td.text("序号");
							head_td.width(30);
						}
						$.each($scope.$inner.columns, function(index, item) {
							var head_td = $scope.$inner.buildTd("mj-table-hd-cell", head_tr);
							var head_td_div = $("<div class=\"mj-table-hd-cell-div\"></div>");
							head_td_div.appendTo(head_td);
							if (item.sort) {
								$scope.$inner.buildHdSort(head_td, head_td_div, item);
							} else {
								head_td_div.html('<span class="mj-table-hd-text">' + item.title + '</span>');
							}
						});
					};

					/**
					 * 排序
					 */
					$scope.$inner.buildHdSort = function(head_td, head_td_div, item) {
						head_td_div.html('<span class="mj-table-hd-text">' + item.title + '</span><span class="mj-table-hd-sort fa fa-chevron-down"></span>');
						head_td_div.on("click", function() {
							if (mj.isEmpty(tableData)) {
								return;
							}
							var sort = '';
							var head_sort = head_td.find(".mj-table-hd-sort").first();
							if (head_sort.hasClass('fa-chevron-down')) {
								head_sort.removeClass('fa-chevron-down');
								head_sort.addClass('fa-chevron-up');
								sort = 'ASC';

							} else {
								head_sort.removeClass('fa-chevron-up');
								head_sort.addClass('fa-chevron-down');
								sort = 'DESC';
							}

							if (sort == 'ASC') {
								tableData.sort($scope.$inner.sortBy(item.field, true, String));

							} else {
								tableData.sort($scope.$inner.sortBy(item.field, false, String));
							}
							body_tbody.empty();
							$scope.$inner.buildBody(tableData);

						})
					}

					/**
					 * 排序规则
					 */
					$scope.$inner.sortBy = function(filed, rev, primer) {
						rev = (rev) ? -1 : 1;
						return function(a, b) {
							a = a[filed];
							b = b[filed];
							if (typeof (primer) != 'undefined') {
								a = primer(a);
								b = primer(b);
							}
							if (a < b) {
								return rev * -1;
							}
							if (a > b) {
								return rev * 1;
							}
							return 1;
						}
					}

					/**
					 * 表尾
					 */
					$scope.$inner.buildFoot = function() {
						var disabled = "mj-button-disabled";
						$scope.$inner.pb = {};
						var btnGroup = element_foot.find(".mj-button-group");
						$scope.$inner.pb.home = $scope.$inner.buildPageButton($attrs.homeShowable, $attrs.homeText, "fa-angle-double-left", true);
						if (mj.isNotEmpty($scope.$inner.pb.home)) {
							btnGroup.append($scope.$inner.pb.home);
							$scope.$inner.pb.home.on("click", function() {
								if ($(this).hasClass(disabled)) {
									return;
								}
								if ($scope.$inner.page.pageStart != 1) {
									$scope.$inner.page.pageStart = 1;
									$scope.$inner.loadPage();
								}
							});
						}

						$scope.$inner.pb.prev = $scope.$inner.buildPageButton($attrs.prevShowable, $attrs.prevText, "fa-angle-left", true);
						if (mj.isNotEmpty($scope.$inner.pb.prev)) {
							btnGroup.append($scope.$inner.pb.prev);
							$scope.$inner.pb.prev.on("click", function() {
								if ($(this).hasClass(disabled)) {
									return;
								}
								if ($scope.$inner.page.pageStart != 1) {
									if ($scope.$inner.page.pageStart - 1 > 0) {
										$scope.$inner.page.pageStart = $scope.$inner.page.pageStart - 1;
									}
									$scope.$inner.loadPage();
								}
							});
						}

						$scope.$inner.pb.input = $scope.$inner.buildPageButton(true, "0/0", null, false);
						if (mj.isNotEmpty($scope.$inner.pb.input)) {
							$scope.$inner.pb.input.width(80);
							btnGroup.append($scope.$inner.pb.input);
						}

						$scope.$inner.pb.next = $scope.$inner.buildPageButton($attrs.nextShowable, $attrs.nextText, "fa-angle-right", true);
						if (mj.isNotEmpty($scope.$inner.pb.next)) {
							btnGroup.append($scope.$inner.pb.next);
							$scope.$inner.pb.next.on("click", function() {
								if ($(this).hasClass(disabled)) {
									return;
								}
								if (mj.isTrue($attrs.totalEnable)) {
									if ($scope.$inner.page.pageTotal != $scope.$inner.page.pageStart) {
										$scope.$inner.page.pageStart = $scope.$inner.page.pageStart + 1;
										$scope.$inner.loadPage();
									}
								} else {
									$scope.$inner.page.pageStart = $scope.$inner.page.pageStart + 1;
									$scope.$inner.loadPage();
								}
							});
						}

						$scope.$inner.pb.last = $scope.$inner.buildPageButton($attrs.lastShowable, $attrs.lastText, "fa-angle-double-right", true);
						if (mj.isNotEmpty($scope.$inner.pb.last)) {
							btnGroup.append($scope.$inner.pb.last);
							$scope.$inner.pb.last.on("click", function() {
								if ($(this).hasClass(disabled)) {
									return;
								}
								if ($scope.$inner.page.pageTotal != $scope.$inner.page.pageStart) {
									$scope.$inner.page.pageStart = $scope.$inner.page.pageTotal;
									$scope.$inner.loadPage();
								}
							});
						}
					};

					$scope.$inner.buildPageButton = function(showable, text, icon, disable) {
						if (mj.isTrue(showable)) {
							var $button = $('<div class="mj-button mj-button-default"><div class="mj-button-button"></div></div>');
							if (mj.isTrue(disable)) {
								$button.addClass("mj-button-disabled");
							}
							var $body = $button.find(".mj-button-button").first();
							if (mj.isNotEmpty(icon)) {
								var $icon = $('<span class="mj-button-button-icon fa"></span>');
								$icon.addClass(icon);
								$body.append($icon);
							}
							if (mj.isNotEmpty(text)) {
								var $text = $('<span class="mj-button-button-text"></span>');
								$text.text(text);
								$body.append($text);
							}
							return $button;
						} else {
							return null;
						}
					};

					$scope.$inner.setPaging = function() {
						var input = $scope.$inner.pb.input.find(".mj-button-button-text").first();
						if (mj.isTrue($attrs.totalEnable)) {
							input.text($scope.$inner.page.pageStart + "/" + $scope.$inner.page.pageTotal);
						} else {
							input.text($scope.$inner.page.pageStart);
						}
					};

					$scope.$inner.switchButton = function(flag) {
						var disabled = "mj-button-disabled";
						var disabledFind = ".mj-button-disabled";
						if (mj.isTrue($attrs.totalEnable)) {
							if ($scope.$inner.page.pageTotal <= 1) {
								if (mj.isNotEmpty($scope.$inner.pb.home)) {
									$scope.$inner.pb.home.addClass(disabled);
								}
								if (mj.isNotEmpty($scope.$inner.pb.prev)) {
									$scope.$inner.pb.prev.addClass(disabled);
								}
								if (mj.isNotEmpty($scope.$inner.pb.next)) {
									$scope.$inner.pb.next.addClass(disabled);
								}
								if (mj.isNotEmpty($scope.$inner.pb.last)) {
									$scope.$inner.pb.last.addClass(disabled);
								}
							} else {
								if ($scope.$inner.page.pageStart == 1) {
									if (mj.isNotEmpty($scope.$inner.pb.home)) {
										$scope.$inner.pb.home.addClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.prev)) {
										$scope.$inner.pb.prev.addClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.next)) {
										$scope.$inner.pb.next.removeClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.last)) {
										$scope.$inner.pb.last.removeClass(disabled);
									}
								} else if ($scope.$inner.page.pageStart == $scope.$inner.page.pageTotal) {
									if (mj.isNotEmpty($scope.$inner.pb.home)) {
										$scope.$inner.pb.home.removeClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.prev)) {
										$scope.$inner.pb.prev.removeClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.next)) {
										$scope.$inner.pb.next.addClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.last)) {
										$scope.$inner.pb.last.addClass(disabled);
									}
								} else {
									if (mj.isNotEmpty($scope.$inner.pb.home)) {
										$scope.$inner.pb.home.removeClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.prev)) {
										$scope.$inner.pb.prev.removeClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.next)) {
										$scope.$inner.pb.next.removeClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.last)) {
										$scope.$inner.pb.last.removeClass(disabled);
									}
								}
							}
						} else {
							if ($scope.$inner.page.pageStart == 1) {
								if (mj.isNotEmpty($scope.$inner.pb.home)) {
									$scope.$inner.pb.home.addClass(disabled);
								}
								if (mj.isNotEmpty($scope.$inner.pb.prev)) {
									$scope.$inner.pb.prev.addClass(disabled);
								}
								if (tableData.length < $scope.$inner.page.pageSize) {
									if (mj.isNotEmpty($scope.$inner.pb.next)) {
										$scope.$inner.pb.next.addClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.last)) {
										$scope.$inner.pb.last.addClass(disabled);
									}
								} else {
									if (mj.isNotEmpty($scope.$inner.pb.next)) {
										$scope.$inner.pb.next.removeClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.last)) {
										$scope.$inner.pb.last.removeClass(disabled);
									}
								}
							} else {
								if (mj.isNotEmpty($scope.$inner.pb.home)) {
									$scope.$inner.pb.home.removeClass(disabled);
								}
								if (mj.isNotEmpty($scope.$inner.pb.prev)) {
									$scope.$inner.pb.prev.removeClass(disabled);
								}
								if (tableData.length < $scope.$inner.page.pageSize) {
									if (mj.isNotEmpty($scope.$inner.pb.next)) {
										$scope.$inner.pb.next.addClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.last)) {
										$scope.$inner.pb.last.addClass(disabled);
									}
								} else {
									if (mj.isNotEmpty($scope.$inner.pb.next)) {
										$scope.$inner.pb.next.removeClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.last)) {
										$scope.$inner.pb.last.removeClass(disabled);
									}
								}
							}
							if (mj.isTrue(flag)) {
								if (mj.isNotEmpty($scope.$inner.pb.next)) {
									$scope.$inner.pb.next.addClass(disabled);
								}
								if (mj.isNotEmpty($scope.$inner.pb.last)) {
									$scope.$inner.pb.last.addClass(disabled);
								}
								$scope.$inner.page.pageStart = $scope.$inner.page.pageStart - 1;
							}
						}
					};

					/**
					 * 表尾数据
					 */
					$scope.$inner.buildFootPage = function(page) {
						if ($attrs.page == "true") {
							$scope.$inner.page = page;
							$scope.$inner.page.pageTotal = $scope.$inner.pageTotal();
							$scope.$inner.setPaging();
							$scope.$inner.switchButton();
							$scope.$inner.buildTotal();
						}
					}
					
					/**
					 * 构建total
					 */
					$scope.$inner.buildTotal = function() {
						if(mj.isFalse($attrs.totalEnable)){
							return;
						}
						if(mj.isTrue($attrs.totalShow)){
							var total=element_foot.find(".mj-table-total").first();
							total.text("");
							var text="[";
							text+="总共"+$scope.$inner.page.total+"条记录，";
							text+="每页显示"+$scope.$inner.page.pageSize+"条记录，";
							text+="共"+$scope.$inner.page.pageTotal+"页，"
							text+="当前为第"+$scope.$inner.page.pageStart+"页";
							text+="]";
							total.text(text);
						}
					};
					
					/**
					 * 创建tr
					 */
					$scope.$inner.buildTr = function(t_class, t_body) {
						var head_tr = $("<tr></tr>");
						head_tr.addClass(t_class);
						head_tr.appendTo(t_body);
						return head_tr;
					}

					/**
					 * 创建td
					 */
					$scope.$inner.buildTd = function(t_class, t_body) {
						var i_td = $("<td></td>");
						i_td.attr({});
						i_td.addClass(t_class);
						var i_div = $("<div></div>");
						i_div.addClass(t_class + "-div");
						i_div.appendTo(i_td);
						i_td.appendTo(t_body);
						return i_div;
					}

					/**
					 * 创建表头全选checkbox
					 */
					$scope.$inner.buildHdCheckbox = function(t_body) {
						var checkbox = $('<input type="checkbox" name="mj-table-modle-switch">');
						checkbox.appendTo(t_body);
						checkbox.on("change", function() {
							var items = body_content.find("[name='mj-table-modle']");
							if ($(this).prop("checked")) {
								$.each(items, function(index, item) {
									if (!$(item).prop("checked")) {
										$(item).click();
									}
								});
							} else {
								$.each(items, function(index, item) {
									if ($(item).prop("checked")) {
										$(item).click();
									}
								});
							}
							if (!mj.isEmpty($attrs.allclick)) {
								if ($.isFunction(mj.findCtrlScope($scope)[$attrs.allclick])) {
									mj.findCtrlScope($scope)[$attrs.allclick]($scope.$outer);
								}
							}
						});
						$scope.$inner.hd_checkbox = checkbox;

					}

					/**
					 * 创建body checkbox
					 */
					$scope.$inner.buildBdCheckbox = function(body_tr, t_body, data) {
						var checkbox = $('<input type="checkbox" name="mj-table-modle">');
						checkbox.appendTo(t_body);
						checkbox.on("click", function(event) {
							if ($(this).prop("checked")) {
								var idx = selectData.indexOf(data);
								if (idx < 1) {
									selectData.push(data);
								}
								data.checked = 1;
								if (body_tr.hasClass("mj-table-bd-row-move-odd")) {
									body_tr.removeClass("mj-table-bd-row-move-odd");
								} else {
									body_tr.removeClass("mj-table-bd-row-move-even");
								}
								body_tr.addClass("mj-table-bd-row-selected");
								if ($scope.$inner.isAllCheck()) {
									$scope.$inner.hd_checkbox.prop("checked", true);
								}
							} else {
								var idx = selectData.indexOf(data);
								selectData.splice(idx, 1);
								data.checked = 0;
								if (body_tr.hasClass("mj-table-bd-row-selected")) {
									body_tr.removeClass("mj-table-bd-row-selected");
								}
								$scope.$inner.hd_checkbox.prop("checked", false);
							}
							if ($scope.$inner.rowClick) {
								$scope.$inner.rowClick = false;
								event.stopPropagation();
							}
						});
						if (data.checked == 1) {
							$(checkbox).click();
						}
						return checkbox;
					}

					/**
					 * 创建body rodio
					 */
					$scope.$inner.buildBdRadio = function(body_tr, t_body, data) {
						var radio = $('<input type="radio" name="mj-table-modle">');
						radio.appendTo(t_body);
						radio.on("change", function() {
							if ($(this).prop("checked")) {
								selectData = data;
								$scope.$inner.buildBdTrSelect(body_tr);
							}
						});
						return radio;
					}

					/**
					 * 行选中样式变化
					 */
					$scope.$inner.buildBdTrSelect = function(body_tr) {
						$.each(body_tr.parent().children(), function(ind, tr) {
							var $tr = $(tr);
							if ($tr.hasClass("mj-table-bd-row-selected")) {
								$tr.removeClass("mj-table-bd-row-selected");
							}
						});
						if (body_tr.hasClass("mj-table-bd-row-move-odd")) {
							body_tr.removeClass("mj-table-bd-row-move-odd");
						} else {
							body_tr.removeClass("mj-table-bd-row-move-even");
						}
						body_tr.addClass("mj-table-bd-row-selected");
					}

					/**
					 * 创建body 默认第一行
					 */
					$scope.$inner.buildFirstBody = function() {
						var first_tr = $scope.$inner.buildTr("mj-table-bd-first", body_tbody);
						if ($scope.$inner.columnAttrs.model == "multiple" || $scope.$inner.columnAttrs.model == "single") {
							$scope.$inner.buildTd("mj-table-bd-first-cell", first_tr);
						}
						if ($scope.$inner.columnAttrs.index == "true") {
							$scope.$inner.buildTd("mj-table-bd-first-cell", first_tr);
						}
						$.each($scope.$inner.columns, function(index, item) {
							var first_td = $scope.$inner.buildTd("mj-table-bd-first-cell", first_tr);
							if (item.sort == 'true') {
								first_td.text(item.title + 'sort');
							} else {
								first_td.text(item.title);
							}
						});
					}

					/**
					 * 创建body
					 */
					$scope.$inner.buildBody = function(dataList) {
						$scope.$inner.buildFirstBody();
						body_content.scroll(function() {
							var size = body_content.scrollLeft();
							head_content.scrollLeft(size);
						});
						_height = 0;
						$.each(dataList, function(index, data) {
							data.rowindex = index + 1;
							_height += 30;
							var body_tr = $("<tr></tr>");
							if (index % 2 == 0) {
								body_tr.addClass("mj-table-bd-row-odd");
							} else {
								body_tr.addClass("mj-table-bd-row-even");
							}

							body_tr.appendTo(body_tbody);
							var checkbox;
							var radio;
							if ($scope.$inner.columnAttrs.model == "multiple") {
								var body_td = $scope.$inner.buildTd("mj-table-bd-work", body_tr);
								if (!data.checked) {
									data.checked = 0;
								}
								checkbox = $scope.$inner.buildBdCheckbox(body_tr, body_td, data);
								body_td.width(30);
							}
							if ($scope.$inner.columnAttrs.model == "single") {
								var body_td = $scope.$inner.buildTd("mj-table-bd-work", body_tr);
								radio = $scope.$inner.buildBdRadio(body_tr, body_td, data);
								body_td.width(30);
							}
							if ($scope.$inner.columnAttrs.index == "true") {
								var body_td = $scope.$inner.buildTd("mj-table-bd-index", body_tr);
								body_td.text(index + 1);
								body_td.width(30);
							}
							$.each($scope.$inner.columns, function(index, item) {
								var body_td = $scope.$inner.buildTd("mj-table-bd-cell", body_tr);
								if (mj.isNotEmpty(item.render)) {
									if ($.isFunction(item.render)) {
										var text = item.render(data);
										var _dom = $compile(text)($scope.$new());
										body_td.append(_dom);
									} else if ($.isFunction(mj.findCtrlScope($scope)[item.render])) {
										var text = mj.findCtrlScope($scope)[item.render](data);
										var _dom = $compile(text)($scope.$new());
										body_td.append(_dom);
									} else {
										body_td.text($scope.$inner.format(item, data));
									}
								} else {
									body_td.text($scope.$inner.format(item, data));
								}
								if (!$.isEmptyObject(item.width)) {
									body_td.css({
										"width" : item.width
									});
									body_td.parent().css({
										"width" : item.width
									});
								}
								$scope.$inner.buildTooltip(item,body_td, data);
							});

							body_tr.on("mousemove", function() {
								if (body_tr.hasClass("mj-table-bd-row-odd")) {
									body_tr.addClass("mj-table-bd-row-move-odd");
								} else {
									body_tr.addClass("mj-table-bd-row-move-even");
								}

							})
							body_tr.on("mouseout", function() {
								if (body_tr.hasClass("mj-table-bd-row-odd")) {
									body_tr.removeClass("mj-table-bd-row-move-odd");
								} else {
									body_tr.removeClass("mj-table-bd-row-move-even");
								}
							})

							body_tr.on("click", function(event) {
								if (radio) {
									$(radio).prop('checked', true).trigger('change');
								} else if (checkbox) {
									if (event.target.type != 'checkbox') {
										$scope.$inner.rowClick = true;
										$(checkbox).click();
									}
								} else {
									selectData = data;
									$scope.$inner.buildBdTrSelect(body_tr);
								}
								if (!mj.isEmpty($attrs.rowclick)) {
									if ($.isFunction(mj.findCtrlScope($scope)[$attrs.rowclick])) {
										mj.findCtrlScope($scope)[$attrs.rowclick](data, $scope.$outer);
									}
								}

							})

							body_tr.on("dblclick", function() {
								if (!mj.isEmpty($attrs.rowdblclick)) {
									if ($.isFunction(mj.findCtrlScope($scope)[$attrs.rowdblclick])) {
										mj.findCtrlScope($scope)[$attrs.rowdblclick](data, $scope.$outer);
									}
								}
							})
							tableTr[index] = body_tr;
							// body_tr.on("focus", function() {
							// mj.findCtrlScope($scope)[$attrs.rowfocus](data,index
							// + 1);
							// })
						});
						body_tbody.parent().css({
							"width" : "100%"
						});
					};
					/**
					 * 单元格添加提示信息
					 */
					$scope.$inner.buildTooltip = function(item,body_td,data) {	
						if (mj.isNotEmpty(item.tooltipShowable) && mj.isTrue(item.tooltipShowable)) {	
							var title=data[item.field];
							var opts={
									"field":item.field,
									"value" :data[item.field],
									"formatValue":$scope.$inner.format(item,data)
							};
							if ($.isFunction(item.tooltipRender)) {
								title = item.tooltipRender(opts,data);	
							} else if ($.isFunction(mj.findCtrlScope($scope)[item.tooltipRender])) {
								title  = mj.findCtrlScope($scope)[item.tooltipRender](opts,data);							
							} 
							body_td.attr("title",title);
							
						}
					}
					/**
					 * 格式转换
					 */
					$scope.$inner.format = function(item, data) {
						if (!mj.isEmpty(item.type) && !mj.isEmpty(item.format) && !mj.isEmpty(data[item.field])) {
							if (item.type == 'date') {
								return mj.formatData(data[item.field], item.format);
							} else if (item.type = "number") {
								if ($.isNumeric(data[item.field])) {
									return mj.formatNumber(data[item.field], item.format);
								} else {
									return data[item.field];
								}
							} else {
								return data[item.field];
							}
						} else {
							return data[item.field];
						}
					}

					/**
					 * 清理变量
					 */
					$scope.$inner.clear = function() {
						tableData = [];
						selectData = [];
						tableTr = [];
						_height = 0;
						body_tbody.empty();
						if (!mj.isEmpty($scope.$inner.hd_checkbox)) {
							$scope.$inner.hd_checkbox.prop("checked", false);
						}
					}

					/**
					 * 外部方法：清除表格
					 */
					$scope.$outer.clear = function() {
						tableData = [];
						selectData = [];
						tableTr = [];
						_height = 0;
						head_tbody.empty();
						$scope.$inner.setPage();
						var input = $scope.$inner.pb.input.find(".mj-button-button-text").first();
						input.text("0/0");
						var children = body_tbody.find("*[data-tag*='mj']");
						for (var i = children.length - 1; i >= 0; i--) {
							var view = mj.getView($(children[i]).attr("id"));
							if (!mj.isEmpty(view)) {
								if ($.isFunction(view.destroy)) {
									view.destroy();
								}
							}
						}
						body_tbody.empty();
					}
					
					/**
					 * 外部方法：清除表格
					 */
					$scope.$outer.clearData = function() {
						tableData = [];
						selectData = [];
						tableTr = [];
						_height = 0;
						$scope.$inner.setPage();
						var input = $scope.$inner.pb.input.find(".mj-button-button-text").first();
						input.text("0/0");
						var children = body_tbody.find("*[data-tag*='mj']");
						for (var i = children.length - 1; i >= 0; i--) {
							var view = mj.getView($(children[i]).attr("id"));
							if (!mj.isEmpty(view)) {
								if ($.isFunction(view.destroy)) {
									view.destroy();
								}
							}
						}
						body_tbody.empty();
					}

					$scope.$inner.loadPage = function() {
						$scope.$inner.showLoading();
						// 静态分页
						if ($scope.$inner.staticPage) {						
							if (!mj.isEmpty($scope.$inner.pageFun)) {// 调用外部分页请求
								$scope.$inner.pageFun();
							} else {
								$scope.$inner.static_data();
							}
						} else {
							$scope.$inner.data(false);
						}

					}

					$scope.$inner.data = function(deleteFlag) {
						var method = "GET";
						if (!mj.isEmpty($attrs.method)) {
							method = $attrs.method
						}
						var succFun = $scope.$inner.succFun;
						var _param = {
							"page" : $scope.$inner.page
						};
						$.extend(true, _param, $scope.$inner.param);
						$http({
							method : method,
							url : $scope.$inner.action,
							params : _param
						}).then(function successCallback(response) {
							if (response.data.code == 0) {
								var dataset = response.data.data;
								if (dataset != null && dataset.length > 0) {
									$scope.$inner.clear();
									tableData = dataset;
									$scope.$inner.buildBody(tableData);
									$scope.$inner.buildFootPage(response.data.page);
									$scope.$outer.layout();
								} else {
									if(mj.isTrue($attrs.totalEnable)){
										$scope.$outer.clearData();
									}
									$scope.$inner.switchButton(true);
								}
							}
							$scope.$inner.hideLoading();
							if ($.isFunction(succFun)) {
								succFun(response.data);
							}
						}, function errorCallback(response) {
							$scope.$inner.hideLoading();
							if ($.isFunction(succFun)) {
								succFun(response);
							}
						});
					}

					/**
					 * 静态分页数据处理
					 */
					$scope.$inner.static_data = function() {
						$scope.$inner.showLoading();
						$scope.$inner.clear();
						var start = ($scope.$inner.page.pageStart - 1) * $scope.$inner.page.pageSize;
						var end = $scope.$inner.page.pageStart * $scope.$inner.page.pageSize;
						var m = 0;
						for (var i = start; i < end; i++) {
							if (i < $scope.$inner.staticData.length) {
								tableData[m] = $scope.$inner.staticData[i];
								m++;
							}
						}
						$scope.$inner.buildBody(tableData);
						$scope.$outer.layout();
						$scope.$inner.hideLoading();
					}

					/**
					 * 加载已经存在数据
					 */
					$scope.$outer.loadData = function(dataList, succFun) {
						$scope.$inner.showLoading();
						$scope.$inner.clear();
						$scope.$inner.init();
						$scope.$inner.staticData = dataList;
						$scope.$inner.staticPage = true;
						
						if ($attrs.page == 'true') {
							// $scope.$inner.setPage();
							$scope.$inner.page.total = dataList.length;
							for (var i = 0; i < $scope.$inner.page.pageSize; i++) {
								if (i < dataList.length) {
									tableData[i] = dataList[i];
								}
							}
							$scope.$inner.buildFootPage($scope.$inner.page);
						} else {
							tableData = dataList;
						}
						$scope.$inner.buildBody(tableData);
						$scope.$outer.layout();
						$scope.$inner.hideLoading();
						if ($.isFunction(succFun)) {
							succFun(dataList);
						}
					};

					$scope.$outer.loadPage = function(pageFun) {
						$scope.$inner.pageFun = pageFun;
					}

					/**
					 * 后台数据加载
					 */
					$scope.$outer.load = function(param, action, succFun) {
						$scope.$inner.showLoading();
						$scope.$inner.init();
						$scope.$inner.setPage();
						if (mj.isEmpty(action)) {
							action = mj.findAttr($attrs.action, $scope);
						}
						$scope.$inner.param = param;
						$scope.$inner.action = action;
						$scope.$inner.succFun = succFun;
						$scope.$inner.data(true);
					};

					/**
					 * 刷新
					 */
					$scope.$outer.reload = function() {
						$scope.$inner.data(true);
					}

					/**
					 * 获取选中行
					 */
					$scope.$outer.getSelected = $scope.$outer.select = function() {
						return selectData;
					}

					$scope.$outer.getRow = function(index) {
						return tableTr[index - 1];
					}

					$scope.$outer.getPage = function() {
						return $scope.$inner.page;
					}
					/**
					 * 获取返回数据
					 */
					$scope.$outer.getData = $scope.$outer.selectAll = function() {
						return tableData;
					}

					$scope.$outer.layout = function() {
						body_content.css({
							"display" : "none"
						});

						body_content.parent().css({
							"height" : "100%"
						});

						body_content.css({
							"height" : body_content.parent().height()
						});

						body_content.css({
							"display" : "block"
						});

						$scope.$inner.buildLayout();

					};

					$scope.$inner.buildLayout = function() {
						var head_table = head_tbody.parent();
						var body_table = body_tbody.parent();
						var body_tr = $(body_tbody.children()[0]);
						var width = [];
						$.each(body_tr.children(), function(index, item) {
							width[index] = $(item).width();
						});
						var head_tr = $(head_tbody.children()[0]);
						$.each(head_tr.children(), function(index, item) {
							$(item).width(width[index]);

						});

						if (body_table.width() == 0 || body_tbody.children().length < 2) {
							head_table.width("100%");
						} else {
							head_table.width(body_table.width());
						}

						if (body_content.height() != 0 && (body_content.height() < _height)) {
							var pp = body_content.parent();
							var _last = head_tr.find("td").last();
							var _w = _last.width();
							_last.width(_last.width() + 18);
							head_table.width(head_table.width() + 18);
						}
					}

					$scope.$inner.init();

					/**
					 * 动态添加列
					 */
					$scope.$outer.addColumns = function(columns) {
						$.each(columns, function(index, column) {
							$scope.$inner.columns.push(column);
						});
					};

					/**
					 * 外部方法：删除所有列
					 */
					$scope.$outer.removeColumns = function() {
						if ($scope.$inner.columns.length > 0) {
							$scope.$inner.columns.splice(0, $scope.$inner.columns.length);
						}
					};

					/**
					 * 外部方法：根据名字删除列
					 */
					$scope.$outer.removeColumnByName = function(name) {
						var _index = -1;
						var _column = null;
						$.each(columns, function(index, column) {
							if (column.name == name) {
								_index = index;
								_column = column;
								return false;
							}
						});
						if (_index > -1) {
							$scope.$inner.columns.splice(_index, 1);
						}
					};

					/**
					 * 外部方法：动态添加列
					 */
					$scope.$outer.addColumn = function(column) {
						$scope.$inner.columns.push(column);
					};

					/**
					 * 外部方法：获取列
					 */
					$scope.$outer.getColumns = function() {
						return $scope.$inner.columns;
					};
				}
			}
		}
	});
});

mj.module.directive('mjTableToolbar', function($compile) {
	return mj.buildDirective({
		name : "mjTableToolbar",
		require : [ '^mjTable' ],
		scope : {
			'title' : '@',
			'icon' : '@',
		},
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

mj.module.directive('mjTableColumns', function($compile) {
	return mj.buildDirective({
		name : "mjTableColumns",
		require : [ '^mjTable' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var tableScope = $scope.$inner.getParentScope();
					tableScope.$inner.columnAttrs = $attrs;
				}
			}
		}
	});
});

mj.module.directive('mjTableColumn', function($compile) {
	return mj.buildDirective({
		name : "mjTableColumn",
		require : [ '^mjTable', '^mjTableColumns' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var tableScope = $scope.$parent.$parent.$parent.$parent;
					tableScope.$inner.addColumn($attrs);
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildTable = function(opts) {
	var tag = $("<mj-table>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

/**
 * 动态构建控件
 */
mj.buildTableToolbar = function(opts) {
	var tag = $("<mj-table-toolbar>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildTableColumns = function(opts) {
	var tag = $("<mj-table-columns>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildTableColumn = function(opts) {
	var tag = $("<mj-table-column>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};