mj.ctrls.remotetable1Ctrl = function($scope) {
	$scope.name = "xxx";
	$scope.user = {};
	$scope.loadFunc = function() {
		var table1 = mj.getView("rtable1-001");
		table1.load({
			"condition" : {
				
			}
		});
	};
	$scope.change = function(data) {
		return "1"
	}
};