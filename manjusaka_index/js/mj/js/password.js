/**
 * 
 */

mj.module.directive('mjPassword', function($compile) {
	return mj.buildFieldDirective({
		name : "mjPassword",		
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);			
					$scope.$inner.build();
				}
			}
		}
	});
});
/**
 * 动态添加控件
 */
mj.buildPassword = function(opts) {
	var tag = $("<mj-password>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};