mj.ctrls.averageVboxCtrl = function($scope) {
	$scope.loadFunc = function() {
		$scope.vbox=mj.getView("vbox-average-main");
	};
	$scope.hideFunc = function() {
		var item=$scope.vbox.getChildByIndex(1);
		item.hide();
	};
	$scope.showFunc = function() {
		var item=$scope.vbox.getChildByIndex(1);
		item.show();
	};
};