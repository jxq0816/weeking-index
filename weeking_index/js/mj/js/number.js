/**
 * 
 */

mj.module.directive('mjNumber', function($compile) {
	return mj.buildFieldDirective( {
		name : "mjNumber",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);
					$scope.$inner.buttonadd = $element.find(".mj-input-field-number-minus");
					$scope.$inner.buttondel = $element.find(".mj-input-field-number-plus");
					$scope.$inner.opts = 	{"step" : 0.1, "min" : 0, "max" : 99, "digit" : 1};
					$scope.$inner.buildOtherAttr = function() {
						if (!mj.isEmpty($attrs.digit)) {
							$scope.$inner.opts.digit  =  parseFloat($attrs.digit).toFixed(0);
						}
						if (!mj.isEmpty($attrs.step)) {
							$scope.$inner.opts.step = parseFloat($attrs.step);
						}
						if (!mj.isEmpty($attrs.min)) {
							$scope.$inner.opts.min = parseFloat($attrs.min);
						}
						if (!mj.isEmpty($attrs.max)) {
							$scope.$inner.opts.max = parseFloat($attrs.max);
						}
					};
					$scope.$inner.buttonadd.on("click",function(){
						//if($scope.$outer.validity()){
							$scope.$inner.execute(false);
						//}
					});
					$scope.$inner.buttondel.on("click",function(){
						//if($scope.$outer.validity()){
							$scope.$inner.execute(true);
						//}
					});					
					$scope.$inner.execute = function(_do) {
						var val = null;
						if (!mj.isEmpty($scope.$inner.field.val())) {							
							val = parseFloat($scope.$inner.format($scope.$inner.field.val(), $scope.$inner.opts.digit));
						}else{
							val = parseFloat($scope.$inner.format(0, $scope.$inner.opts.digit));
						}
						var ori = val;
						if(_do) val -= $scope.$inner.opts.step;
						if(!_do) val += $scope.$inner.opts.step;
						if(val<$scope.$inner.opts.min){
							if(!mj.isEmpty($attrs.min)){
								val  =  $scope.$inner.opts.min;
							}
						}else if(val>$scope.$inner.opts.max){
							if(!mj.isEmpty($attrs.max)){
								val  =  $scope.$inner.opts.max;
							}
						}
						$scope.$inner.field.val($scope.$inner.format(val, $scope.$inner.opts.digit));
					};					
					$scope.$inner.checkType = function() {
						var flag = true;
						if (isNaN(Number($scope.$inner.field.val()))) {
							$scope.$inner.field.addClass("mj-input-validity-error");
							$scope.$inner.tooltip.setTitle($attrs.label + " 不是数值类型");
							//$scope.$inner.field.attr("title", $attrs.label + " 不是数值类型");
							flag = false;
						}						
						return flag;
					};
					$scope.$inner.format = function(val, digit){
						if(isNaN(val)){ 
							val = 0;
						}
						return parseFloat(val).toFixed(digit);	
					}
					$scope.$inner.checkMin = function() {
						var flag = true;
						if ($.isNumeric($attrs.min)) {	
							if (parseFloat($scope.$inner.field.val()) < parseFloat($attrs.min)) {
								$scope.$inner.field.addClass("mj-input-validity-error");
								$scope.$inner.tooltip.setTitle($attrs.label + " 数值不能小于" + $attrs.min);
								//$scope.$inner.field.attr("title", $attrs.label + " 数值不能小于" + $attrs.min);
								flag = false;
							}
						}
						return flag;
					};

					$scope.$inner.checkMax = function() {
						var flag = true;
						if ($.isNumeric($attrs.max)) {
							if (parseFloat($scope.$inner.field.val()) > parseFloat($attrs.max)) {
								$scope.$inner.field.addClass("mj-input-validity-error");
								$scope.$inner.tooltip.setTitle($attrs.label + " 数值不能大于" + $attrs.max);
								//$scope.$inner.field.attr("title", $attrs.label + " 数值不能大于" + $attrs.max);
								flag = false;
							}
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
mj.buildNumber = function(opts) {
	var tag = $("<mj-number>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};