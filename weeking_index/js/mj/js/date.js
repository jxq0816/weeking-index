/**
 * 
 */

mj.module.directive('mjDate', function($compile) {
	return mj.buildFieldDirective({
		name : "mjDate",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs);
					var obody = document.body;
					var dateObj = new Date();
					var dbox;
					$scope.$inner.buildOtherAttr = function() {
						if (mj.isEmpty($attrs.format)) {
							$attrs.format = "yyyy-MM-dd";
						}
						if (!mj.isEmpty($attrs.value)) {
							if ($attrs.value == "today") {
								$scope.$inner.field.attr("value", dateObj.format($attrs.format));
							} else {
								$scope.$inner.field.attr("value", mj.formatData($attrs.value, $attrs.format));
								$scope.$inner.field.val(mj.formatData($attrs.value, $attrs.format));
							}
						}
						/**
						 * 清空控件输入，如果有默认值就赋给默认值，没有默认值则设置为null
						 */
						$scope.$outer.reset = function() {
							if (!mj.isEmpty($attrs.value)) {
								if ($attrs.value == "today") {
									$scope.$inner.field.attr("value", dateObj.format($attrs.format));
								} else {
									$scope.$inner.field.attr("value", mj.formatData($attrs.value, $attrs.format));
									$scope.$inner.field.val(mj.formatData($attrs.value, $attrs.format));
								}
							} else {
								$scope.$inner.field.val("");
							}
						}
						$scope.$outer.setValue = function(val) {
							return $scope.$inner.field.val(mj.formatData(val, $attrs.format));
						};
						$scope.$inner.field.on("change", function() {
							$scope.$inner.checkEmpty();
							if (mj.isNotEmpty($attrs.change)) {
								if ($.isFunction(mj.findCtrlScope($scope)[$attrs.change])) {
									mj.findCtrlScope($scope)[$attrs.change]($scope.$outer);
								}
							}
						});

						$scope.$inner.field.on("blur", function() {
							$scope.$inner.checkEmpty();
						});

						$scope.$inner.field.on('click', function() {
							$scope.$inner.createbox();
							$(obody).find('.mj-date-box').css({
								"display" : "none"
							});
							var datel = $(this).offset().left;
							var datet = $(this).offset().top + $(this).parent().height() + 2;
							var windowHeight = $(window).height();
							if (datet + dbox.height() > windowHeight) {
								datet = $(this).offset().top - dbox.height() - 4;
							}
							dbox.css({
								"left" : datel + "px",
								"top" : datet + "px",
								"display" : "block"
							});
						});

						$(document.body).on("click", function(event) {
							var className = event.target.className;
							if (event.target.tagName == "INPUT" && className.indexOf("mj-input-field") > -1) {
								return;
							} else if (event.target.tagName == "DIV" && className.indexOf("mj-date") > -1) {
								return;
							} else if (event.target.tagName == "I" && $(event.target).parent().attr("class").indexOf("mj-date") > -1) {
								return;
							} else {
								if (typeof (dbox) != "undefined") {
									dbox.css({
										"display" : "none"
									});
								}
							}
						});

						$(window).resize(function() {
							if (mj.isNotEmpty(dbox)) {
								dbox.css({
									"display" : "none"
								});
							}
						});
						$(window).mousewheel(function() {
							if (mj.isNotEmpty(dbox)) {
								dbox.css({
									"display" : "none"
								});
							}
						});
					};

					$scope.$inner.createbox = function() {
						if (typeof (dbox) != "undefined") {
							return;
						}
						dbox = $(mj.templates.mjDateBox);
						dbox.attr("id", "dbox-" + $attrs.id)
						dbox.css({
							"z-index" : mj.getIndex()
						});
						$(obody).append(dbox);

						// 年月获取
						var year = dateObj.getFullYear();
						var month = $scope.$inner.toyear(dateObj);// 0是12月

						// 月年的显示
						$(dbox).find(".mj-date-month").first().html(month + "月");
						$(dbox).find(".mj-date-year").first().html(year + "年");

						// ===================set
						// day===============================
						// 获取本月1号的周值
						var oneweek = $scope.$inner.oneyearoneday(dateObj);
						// 本月总日数
						var alld = $scope.$inner.alldays(dateObj);
						// 当前是几
						var nowd = $scope.$inner.nowday(dateObj);
						// 初始化显示本月信息
						$scope.$inner.init(oneweek, alld, nowd);
						$(dbox).find(".mj-date-con").first().on("click", function(event) {
							if (event.target.tagName == "DIV" && event.target.nodeType == "1") {
								if (event.target.className.indexOf("mj-date-edate") > -1) {
									var dddate = new Date(dateObj.getFullYear(), $scope.$inner.toyear(dateObj) - 1, $(event.target).text());
									$scope.$inner.field.val(dddate.format($attrs.format)).trigger('change');
									dbox.css({
										"display" : "none"
									});

									$(dbox).find(".mj-date-select").first().removeClass("mj-date-select");
									$(event.target).addClass("mj-date-select");
								} else if (event.target.className.indexOf("mj-date-ldate") > -1) {
									var dddate = new Date(dateObj.getFullYear(), $scope.$inner.toyear(dateObj) - 2, $(event.target).text());
									$scope.$inner.field.val(dddate.format($attrs.format)).trigger('change');
									var ddm = null, ddy = null;
									if ((dateObj.getMonth() - 1) == -1) {
										ddm = 11;
										ddy = dateObj.getFullYear() - 1;
									} else {
										ddm = dateObj.getMonth() - 1;
										ddy = dateObj.getFullYear();
									}
									;
									dateObj.setDate(1);
									dateObj.setFullYear(ddy);
									dateObj.setMonth(ddm);
									dateObj.setDate($(event.target).text());
									$(dbox).find(".mj-date-month").first().html($scope.$inner.toyear(dateObj) + "月");
									$(dbox).find(".mj-date-year").first().html(dateObj.getFullYear() + "年");
									oneweek = $scope.$inner.oneyearoneday(dateObj);
									alld = $scope.$inner.alldays(dateObj);
									nowd = $scope.$inner.nowday(dateObj);
									$scope.$inner.init(oneweek, alld, nowd);
								} else if (event.target.className.indexOf("mj-date-ndate") > -1) {
									var dddate = new Date(dateObj.getFullYear(), $scope.$inner.toyear(dateObj), $(event.target).text());
									$scope.$inner.field.val(dddate.format($attrs.format)).trigger('change');
									var ddm = null, ddy = null;
									if ((dateObj.getMonth() + 1) == 12) {
										ddm = 0;
										ddy = dateObj.getFullYear() + 1;
									} else {
										ddm = dateObj.getMonth() + 1;
										ddy = dateObj.getFullYear();
									}
									;
									dateObj.setDate(1);
									dateObj.setFullYear(ddy);
									dateObj.setMonth(ddm);
									dateObj.setDate($(event.target).text());
									$(dbox).find(".mj-date-month").first().html($scope.$inner.toyear(dateObj) + "月");
									$(dbox).find(".mj-date-year").first().html(dateObj.getFullYear() + "年");
									oneweek = $scope.$inner.oneyearoneday(dateObj);
									alld = $scope.$inner.alldays(dateObj);
									nowd = $scope.$inner.nowday(dateObj);
									$scope.$inner.init(oneweek, alld, nowd);
								}
							}
						});

						$(dbox).find(".mj-date-prevmonth").first().on("click", function() { // 上一月
							var ddm = null, ddy = null;
							if ((dateObj.getMonth() - 1) == -1) {
								ddm = 11;
								ddy = dateObj.getFullYear() - 1;
							} else {
								ddm = dateObj.getMonth() - 1;
								ddy = dateObj.getFullYear();
							}
							;
							dateObj.setFullYear(ddy);
							dateObj.setMonth(ddm);
							$(dbox).find(".mj-date-month").first().html($scope.$inner.toyear(dateObj) + "月");
							$(dbox).find(".mj-date-year").first().html(dateObj.getFullYear() + "年");
							oneweek = $scope.$inner.oneyearoneday(dateObj);
							alld = $scope.$inner.alldays(dateObj);
							nowd = $scope.$inner.nowday(dateObj);
							$scope.$inner.init(oneweek, alld, nowd);
						});
						$(dbox).find(".mj-date-nextmonth").first().on("click", function() { // 下一月
							var ddm = null, ddy = null;
							if ((dateObj.getMonth() + 1) == 12) {
								ddm = 0;
								ddy = dateObj.getFullYear() + 1;
							} else {
								ddm = dateObj.getMonth() + 1;
								ddy = dateObj.getFullYear();
							}
							;
							dateObj.setFullYear(ddy);
							dateObj.setMonth(ddm);
							$(dbox).find(".mj-date-month").first().html($scope.$inner.toyear(dateObj) + "月");
							$(dbox).find(".mj-date-year").first().html(dateObj.getFullYear() + "年");
							oneweek = $scope.$inner.oneyearoneday(dateObj);
							alld = $scope.$inner.alldays(dateObj);
							nowd = $scope.$inner.nowday(dateObj);
							$scope.$inner.init(oneweek, alld, nowd);
						});
						$(dbox).find(".mj-date-prevyear").first().on("click", function() { // 上一年
							var ddy = dateObj.getFullYear() - 1;
							dateObj.setFullYear(ddy);
							$(dbox).find(".mj-date-year").first().html(dateObj.getFullYear() + "年");
							oneweek = $scope.$inner.oneyearoneday(dateObj);
							alld = $scope.$inner.alldays(dateObj);
							nowd = $scope.$inner.nowday(dateObj);
							$scope.$inner.init(oneweek, alld, nowd);
						});
						$(dbox).find(".mj-date-nextyear").first().on("click", function() { // 下一月
							var ddy = dateObj.getFullYear() + 1;
							dateObj.setFullYear(ddy);
							$(dbox).find(".mj-date-year").first().html(dateObj.getFullYear() + "年");
							oneweek = $scope.$inner.oneyearoneday(dateObj);
							alld = $scope.$inner.alldays(dateObj);
							nowd = $scope.$inner.nowday(dateObj);
							$scope.$inner.init(oneweek, alld, nowd);
						});
						$(dbox).find(".mj-date-nowtime").first().on("click", function() {
							var dddate = new Date();
							var ddm = dddate.getMonth();
							var ddy = dddate.getFullYear();
							dateObj.setFullYear(ddy);
							dateObj.setMonth(ddm);
							$(dbox).find(".mj-date-month").first().html($scope.$inner.toyear(dateObj) + "月");
							$(dbox).find(".mj-date-year").first().html(dateObj.getFullYear() + "年");
							oneweek = $scope.$inner.oneyearoneday(dateObj);
							alld = $scope.$inner.alldays(dateObj);
							nowd = $scope.$inner.nowday(dateObj);
							$scope.$inner.init(oneweek, alld, nowd);
						});
						$(dbox).find(".mj-date-cleartime").first().on("click", function() {
							$scope.$inner.field.val("").trigger('change');
							$(dbox).find(".mj-date-select").first().removeClass("mj-date-select");
							dbox.css({
								"display" : "none"
							});
						});
					};

					$scope.$inner.init = function(oneweek, alld, nowd) {
						var inputdate = $scope.$inner.field.val();
						var con = $(dbox).find(".mj-date-con").first();
						con.empty();
						var daycount = 0; // 月日历天数
						// 上月天数
						var ldt = nowd.toDate("yyyyMMdd");
						ldt.setDate(1);
						ldt.setMonth(ldt.getMonth() - 1);
						var lalld = $scope.$inner.alldays(ldt);
						if (oneweek == 0) {
							oneweek = 7;
						}
						for (var i = oneweek - 1; i >= 0; i--) {// 上月结余
							var eday = document.createElement("div");
							eday.innerHTML = lalld - i;
							eday.className = "mj-date-ldate";
							con.append($(eday));
							daycount++;
						}
						;
						for (var i = 1; i <= alld; i++) {// 本月
							var eday = document.createElement("div");
							var day = i.toString().lpad(2);
							if (!mj.isEmpty(inputdate) && nowd.substr(0, 6) + day == inputdate.toDate($attrs.format).format("yyyyMMdd")) {

								eday.innerHTML = i;
								eday.className = "mj-date-select mj-date-edate";
								con.append($(eday));
							} else {
								if (nowd.substr(0, 6) + day == new Date().format("yyyyMMdd")) {
									eday.innerHTML = i;
									eday.className = "mj-date-now mj-date-edate";
									con.append($(eday));
								} else {
									eday.innerHTML = i;
									eday.className = "mj-date-edate";
									con.append($(eday));
								}
							}
							daycount++;
						}
						;
						var syd = (42 - daycount);
						for (var i = 1; i <= syd; i++) {// 下月结余
							var eday = document.createElement("div");
							eday.innerHTML = i;
							eday.className = "mj-date-ndate";
							con.append($(eday));
							daycount++;
						}
					}

					$scope.$inner.toyear = function(dateObj) {
						var month = dateObj.getMonth();
						switch (month) {
						case 0:
							return "1";
							break;
						case 1:
							return "2";
							break;
						case 2:
							return "3";
							break;
						case 3:
							return "4";
							break;
						case 4:
							return "5";
							break;
						case 5:
							return "6";
							break;
						case 6:
							return "7";
							break;
						case 7:
							return "8";
							break;
						case 8:
							return "9";
							break;
						case 9:
							return "10";
							break;
						case 10:
							return "11";
							break;
						case 11:
							return "12";
							break;
						default:
						}
						;
					};

					// 获取本月总日数方法
					$scope.$inner.alldays = function(dateObj) {
						var year = dateObj.getFullYear();
						var month = dateObj.getMonth();
						if ($scope.$inner.isLeapYear(year)) {// 闰年
							switch (month) {
							case 0:
								return "31";
								break;
							case 1:
								return "29";
								break; // 2月
							case 2:
								return "31";
								break;
							case 3:
								return "30";
								break;
							case 4:
								return "31";
								break;
							case 5:
								return "30";
								break;
							case 6:
								return "31";
								break;
							case 7:
								return "31";
								break;
							case 8:
								return "30";
								break;
							case 9:
								return "31";
								break;
							case 10:
								return "30";
								break;
							case 11:
								return "31";
								break;
							default:
							}
							;
						} else {// 平年
							switch (month) {
							case 0:
								return "31";
								break;
							case 1:
								return "28";
								break; // 2月
							case 2:
								return "31";
								break;
							case 3:
								return "30";
								break;
							case 4:
								return "31";
								break;
							case 5:
								return "30";
								break;
							case 6:
								return "31";
								break;
							case 7:
								return "31";
								break;
							case 8:
								return "30";
								break;
							case 9:
								return "31";
								break;
							case 10:
								return "30";
								break;
							case 11:
								return "31";
								break;
							default:
							}
							;
						}
						;
					};

					$scope.$inner.nowday = function(dateObj) {
						return dateObj.format("yyyyMMdd");
					};

					// 获取本月1号的周值
					$scope.$inner.oneyearoneday = function(dateObj) {
						var oneyear = new Date();
						var year = dateObj.getFullYear();
						var month = dateObj.getMonth();// 0是12月
						oneyear.setFullYear(year);
						oneyear.setMonth(month);// 0是12月
						oneyear.setDate(1);
						return oneyear.getDay();
					};

					// 闰年判断函数
					$scope.$inner.isLeapYear = function(year) {
						if ((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) {
							return true;
						} else {
							return false;
						}
						;
					};

					$scope.$inner.checkEmpty = function() {
						var flag = true;
						if ($attrs.required == "true") {
							if (mj.isEmpty($scope.$inner.field.val())) {
								$scope.$inner.field.addClass("mj-input-validity-error");
								$scope.$inner.tooltip.setTitle($attrs.label + " 不能为空");
								// $scope.$inner.field.attr("title",
								// $attrs.label + " 不能为空");
								flag = false;
							} else {
								if (!mj.isEmpty($scope.$inner.tooltip)) {
									$scope.$inner.tooltip.setTitle("");
								}
								// $scope.$inner.field.removeAttr("title");
								$scope.$inner.field.removeClass("mj-input-validity-error");
							}
						}
						return flag;
					};

					$scope.$outer.destroy = function() {
						mj.delView($attrs.id);
						$scope.$destroy();
						var div = $(obody).find("div[id='dbox-" + $attrs.id + "']").first();
						div.remove();
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
mj.buildDate = function(opts) {
	var tag = $("<mj-date>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};