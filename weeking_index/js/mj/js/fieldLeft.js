/**
 * 
 */

mj.module.directive('mjFieldLeft', function($compile) {
	return mj.buildDirective({
		name : "mjFieldLeft",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.init = function() {
						$element.parent().attr({
							"data-show-always" : $attrs.showAlways
						});
						$element.parent().addClass("mj-input-cell");
						$element.parent().addClass("mj-input-field-right-show");
						if (mj.isNumber($attrs.width)) {
							$element.parent().css({
								"width" : $attrs.width
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					/**
					 * 外部方法：添加子元素
					 */
					$scope.$outer.addChild = function(obj) {
						var _dom = $compile(obj)($scope.$new());
						$element.append(_dom);
						return mj.getView(_dom.attr("id"));
					};
					
					$scope.$outer.layout=function(){
						var pel=$scope.$parent.$parent.$outer.getElement();
						var input=pel.find(".mj-input-field").first();
						var border=input.css("borderTopWidth");
						var w=0;
						if(mj.isEmpty(border)){
							w=0;
						}else{
							w=parseInt(border,10)*2;
						}
						var height=($element.parent().innerHeight()-w)+"px";
						$element.css({
							"height" : height,
							"line-height" : height
						});
					}
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildFieldLeft = function(opts) {
	var tag = $("<mj-field-left>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};