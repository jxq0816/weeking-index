/**
 * 
 */

mj.module.directive('mjRater', function($compile) {
	return mj.buildFieldDirective({
		name : "mjRater",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.rater = $element.find(".mj-input-field-rater").first();
					$scope.$inner.starShowCls = "mj-input-field-rater-star-show";
					$scope.$inner.init = function() {
						if (!mj.isNumber($attrs.count) || $attrs.count < 1) {
							throw "[count]：必须为大于1的数字，请检查...";
						}
					}
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);
					$scope.$inner.buildStars = function() {
						if (mj.isNumber($attrs.count)) {
							for (var i = 0; i < $attrs.count; i++) {
								$scope.$inner.buildStar(i);
							}
						}
					}
					$scope.$inner.buildStar = function(index) {
						var star = $('<span class="fa fa-star mj-input-field-rater-star"></span>');
						star.appendTo($scope.$inner.field);
						star.attr("data-index", index);
						star.on("mouseover", function() {
							var indx = $(this).attr("data-index");
							if (indx == 0) {
								if ($(this).hasClass($scope.$inner.starShowCls)) {
									$.each($scope.$inner.field.children(), function(index, child) {
										$(child).removeClass($scope.$inner.starShowCls);
									});
								} else {
									$(this).addClass($scope.$inner.starShowCls);
								}
							} else {
								$.each($scope.$inner.field.children(), function(index, child) {
									var _indx = $(child).attr("data-index");
									if (_indx <= indx) {
										$(child).addClass($scope.$inner.starShowCls);
									} else {
										$(child).removeClass($scope.$inner.starShowCls);
									}
								});
							}
						});
					}
					$scope.$outer.getValue = function() {
						var count = 0;
						$.each($scope.$inner.field.children(), function(index, child) {
							if ($(child).hasClass($scope.$inner.starShowCls)) {
								count++;
							}
						});
						return count;
					};

					$scope.$outer.setValue = function(val) {
						if (!mj.isNumber(val)) {
							throw "[count]：必须为大于1的数字，请检查...";
						}
						if (val < 0) {
							val = 0;
						}
						if (val > $attrs.count) {
							val = $attrs.count;
						}
						$.each($scope.$inner.field.children(), function(index, child) {
							$(child).removeClass($scope.$inner.starShowCls);
						});
						for (var i = 0; i < val; i++) {
							var $star = $($scope.$inner.field.children()[i]);
							$star.addClass($scope.$inner.starShowCls);
						}
					};
					$scope.$inner.buildStars();
					$scope.$inner.build();
				}
			}
		}
	});
});

/**
 * 动态添加控件
 */
mj.buildRater = function(opts) {
	var tag = $("<mj-rater>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};