mj.ctrls.remotetreeCtrl = function($scope) {
	$scope.name = "Peter22";
	$scope.user = {};
	$scope.loadFunc = function() {
		var tree = mj.getView("rtree001");
		var param = {
			"condition" : {
				"aa":"11",
				"bb":"22"
			}	
			
		}
		tree.load(param,"http://localhost/manjusaka/services/mTree/selection/list");
	};
	$scope.onTreeClick = function(obj) {
//		var tree = mj.getView("rtree001");
//		tree.loadData(null,"http://localhost/manjusaka/services/mTree/selection/list");
	}
};