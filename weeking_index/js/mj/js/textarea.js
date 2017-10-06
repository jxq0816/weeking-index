/**
 * 
 */

mj.module.directive('mjTextarea', function($compile) {
	return mj.buildFieldDirective({
		name : "mjTextarea",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.init = function() {
//						$element.find("textarea").first().height(60);
						if(mj.isNumber($attrs.height)){
							$element.find("textarea").first().height($attrs.height);
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);
					$scope.$inner.buildOtherAttr = function() {
						if (!mj.isEmpty($attrs.rows)) {
							$scope.$inner.field.attr("rows", $attrs.rows);
						}
						if (!mj.isEmpty($attrs.cols)) {
							$scope.$inner.field.attr("cols", $attrs.cols);
						}
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
mj.buildTextarea = function(opts) {
	var tag = $("<mj-textarea>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};