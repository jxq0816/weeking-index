mj.ctrls.hboxCtrl = function($rootScope, $scope) {
	
	$scope.loadFunc = function() {
		$scope.hbox=mj.getView("hbox-main");
	};
	$scope.hideFunc = function() {
		var item=$scope.hbox.getChildByIndex(1);
		item.hide();
	};
	$scope.showFunc = function() {
		var item=$scope.hbox.getChildByIndex(1);
		item.show();
	};
	
};
