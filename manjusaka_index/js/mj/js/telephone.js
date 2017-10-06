/**
 * 
 */

mj.module.directive('mjTelephone', function($compile) {
	return mj.buildFieldDirective({
		name : "mjTelephone",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);
					$scope.$inner.checkType = function() {
						var flag = true;
						var isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
						var isPhone = /^(?:(?:0\d{2,3})-)?(?:\d{7,8})(-(?:\d{3,}))?$/;
						if ((!$scope.$inner.field.val().match(isMobile)) && (!$scope.$inner.field.val().match(isPhone))) {
							$scope.$inner.field.addClass("mj-input-validity-error");
							$scope.$inner.tooltip.setTitle( $attrs.label + " 格式错误");
//							$scope.$inner.field.attr("title", $attrs.label + " telephone格式错误");
							flag = false;
						}
						return flag;
					};
					$scope.$inner.build();
				}
			}
		}
	});
});

/**
 * 动态添加控件
 */
mj.buildTelephone = function(opts) {
	var tag = $("<mj-telephone>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};