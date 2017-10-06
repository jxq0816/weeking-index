mj.ctrls.fitVboxCtrl = function($scope) {
	$scope.loadFunc = function() {
		$scope.vbox=mj.getView("vbox-fit-main");
		debugger;
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