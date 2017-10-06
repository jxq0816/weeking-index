mj.ctrls.panelCtrl = function($rootScope, $scope) {
	$scope.loadFunc = function(params) {
		$scope.mainPanel=mj.getView("panel-main");
	};
	
	$scope.panelOpenFun = function(params) {
		$scope.mainPanel.expand();
	};
	
	$scope.panelCloseFun = function(params) {
		$scope.mainPanel.collapse();
	};
	
};
