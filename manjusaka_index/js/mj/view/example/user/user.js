mj.ctrls.userCtrl = function($rootScope, $scope) {
	$scope.testId="123";
	$scope.loadFunc = function(params) {
		debugger;
		$scope.param=params;
	};
	
	$scope.panelOpenFun = function(params) {
		alert($scope.param);
	};
	
	$scope.panelCloseFun = function(params) {
		alert($scope.param);
	};
	
};
