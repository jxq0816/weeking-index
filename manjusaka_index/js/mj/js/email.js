/**
 * 
 */

mj.module.directive('mjEmail', function($compile) {
	return mj.buildFieldDirective({
		name : "mjEmail",
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
						var Expression = /\w+[@]{1}\w+[.]\w+/;
						var objExp = new RegExp(Expression);
						if (!objExp.test($scope.$inner.field.val())) {
							$scope.$inner.field.addClass("mj-input-validity-error");
							$scope.$inner.tooltip.setTitle( $attrs.label + " 格式错误");
							//$scope.$inner.field.attr("title", $attrs.label + " email格式错误");
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
mj.buildEmail = function(opts) {
	var tag = $("<mj-email>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};