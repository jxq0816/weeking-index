/**
 * 
 */

mj.module.directive('mjSlider', function($compile) {
	return mj.buildFieldDirective({
		name : "mjSlider",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.moveFlag = false;
					$scope.$inner.moveLeft = 0;
					$scope.$inner.oldValue = 0;
					$scope.$inner.ruler = $element.find(".mj-input-field-slider-ruler").first();
					$scope.$inner.pointer = $element.find(".mj-input-field-slider-pointer").first();
					$scope.$inner.init = function() {
						if (mj.isEmpty($attrs.format)) {
							$attrs.format = "p";
						} else {
							if ($attrs.format != "p" && $attrs.format != "n") {
								$attrs.format = "p";
							}
						}
						if ($attrs.format == "n") {
							if (mj.isEmpty($attrs.from)) {
								$attrs.from = 0;
							}
							if (mj.isEmpty($attrs.to)) {
								$attrs.from = 100;
							}
							if (parseInt($attrs.from, 10) - parseInt($attrs.to, 10) >= 0) {
								throw "最小值应大于最大值，请检查...";
							}
							$scope.$inner.size = parseInt($attrs.to, 10) - parseInt($attrs.from, 10);
							$scope.$inner.pointer.text($attrs.from);
						} else {
							$scope.$inner.pointer.text("0");
						}
					}
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);

					$scope.$inner.mouseup = function() {
						$scope.$inner.moveFlag = false;
						$(document.body).unbind("mouseup", $scope.$inner.mouseup);
						$scope.$inner.setStep();
						if ($.isFunction(mj.findCtrlScope($scope)[$attrs.finish])) {
							mj.findCtrlScope($scope)[$attrs.finish]($scope.$outer);
						}
					}

					$scope.$inner.setStep = function() {
						if (mj.isNumber($attrs.step)) {
							var step = parseInt($attrs.step);
							var newValue = parseInt($scope.$outer.getValue());
							var length = newValue - $scope.$inner.oldValue;
							if (length == 0) {
								return;
							}
							if (newValue >= $attrs.to) {
								$scope.$outer.setValue($attrs.to);
								return;
							}
							if (newValue <= $attrs.from) {
								$scope.$outer.setValue($attrs.from);
								return;
							}
							if (length > 0) {
								var mod = length % step;
								if (mod >= step / 2) {
									var move = parseInt(newValue) - mod + step;
									$scope.$outer.setValue(move);
								} else {
									$scope.$outer.setValue(parseInt(newValue) - mod);
								}
							} else {
								length = $scope.$inner.oldValue - newValue;
								var mod = length % step;
								if (mod >= step / 2) {
									var move = parseInt(newValue) - (step - mod);
									$scope.$outer.setValue(move);
								} else {
									$scope.$outer.setValue(parseInt(newValue) + mod);
								}
							}
						}

					};

					$scope.$inner.move = function(eventLeft) {
						if ($scope.$inner.moveFlag == true) {
							$attrs.valueFlag = false;
							var left = eventLeft - $scope.$inner.ruler.position().left;
							if (left <= 0) {
								$scope.$inner.moveLeft = 0;
							} else if (left >= $scope.$inner.ruler.width() - $scope.$inner.pointer.width()) {
								$scope.$inner.moveLeft = $scope.$inner.ruler.width() - $scope.$inner.pointer.width();
							} else {
								$scope.$inner.moveLeft = eventLeft - $scope.$inner.ruler.position().left;
							}
							var rater = ($scope.$inner.moveLeft / $scope.$inner.ruler.width());
							$scope.$inner.pointer.css({
								"left" : rater * 100 + "%"
							});
							$scope.$inner.pointer.attr({
								"data-left" : rater * 100
							});
							var _rater = (($scope.$inner.moveLeft) / ($scope.$inner.ruler.width() - $scope.$inner.pointer.width())).toFixed(2)
							$scope.$outer.getDisplay(_rater);
						}
					}

					$scope.$inner.buildPointer = function() {
						$scope.$inner.field.css({
							"padding-left" : "0px",
							"padding-right" : "0px",
						});
						$scope.$inner.pointer.on("mousedown", function(event) {
							event.preventDefault();
							if (mj.isFalse($attrs.editable)){
								return;
							}
							$scope.$inner.moveFlag = true;
							$scope.$inner.oldValue = $scope.$outer.getValue();
							$(document.body).on("mouseup", $scope.$inner.mouseup);
						});
						$scope.$inner.pointer.on("mousemove", function(event) {
							$scope.$inner.move(event.pageX);
						});
						$scope.$inner.ruler.on("mousemove", function(event) {
							$scope.$inner.move(event.pageX);
						});
						$element.on("mousemove", function(event) {
							$scope.$inner.move(event.pageX);
						});

					}

					$scope.$outer.getDisplay = function(rater) {
						var p = parseInt(rater * 100, 10);
						if ($attrs.format == "p") {
							$scope.$inner.pointer.text(p + "%");
						} else {
							var value=parseInt($attrs.from, 10) + ($scope.$inner.size * p / 100);
							$scope.$inner.pointer.text(value);
						}
						$scope.$inner.pointer.attr({
							"data-value" : $scope.$inner.pointer.text()
						});
					};

					$scope.$outer.getValue = function() {
						return $scope.$inner.pointer.attr("data-value");
					};

					$scope.$outer.setValue = function(val) {
						$attrs.valueFlag = true;
						$attrs.value = val;
						if ($attrs.format == "n") {
							$scope.$inner.pointer.text(val);
						} else {
							$scope.$inner.pointer.text(val + "%");
						}
						$scope.$inner.pointer.attr({
							"data-value" : $scope.$inner.pointer.text()
						});
						$scope.$outer.layout();
					};
					
					$scope.$outer.setFrom = function(val) {
						$scope.$inner.pointer.attr({
							"data-from" : val
						});
						$attrs.from = val;
					};
					
					$scope.$outer.setTo = function(val) {
						$scope.$inner.pointer.attr({
							"data-to" : val
						});
						$attrs.to = val;
					};
					
					$scope.$outer.setSize = function() {
						$scope.$inner.size = parseInt($attrs.to, 10) - parseInt($attrs.from, 10);
					}

					$scope.$outer.layout = function() {
						var p = 0;
						var value=$scope.$inner.pointer.attr("data-value");
						if ($attrs.format == "n") {
							p = (((parseInt(value, 10) - parseInt($attrs.from, 10)) / $scope.$inner.size) * 100);
						} else {
							p = parseInt(value);
						}
						var v = $scope.$inner.pointer.width() * 100 / $scope.$inner.ruler.width();
						var x = ((p) / (100 + v)) * 100;
						if (x > (100 - v)) {
							x = (100 - v);
						}
						$scope.$inner.pointer.css({
							"left" : x.toFixed(1) + "%"
						});
						$scope.$inner.pointer.attr({
							"data-left" : x.toFixed(1)
						});
					};
					$scope.$inner.buildPointer();
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
	var tag = $("<mj-slider>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};