mj.ctrls.viewCtrl = function($rootScope, $scope) {
	$scope.name = "Peter22";
	$scope.user = {};
	$scope.testFunc = function() {
		$scope.btn = "lvjt";
		$scope.names = [ 'morpheus', 'neo', 'trinity' ];
		$rootScope.v1 = false;
		$rootScope.v2 = true;
	};
	$scope.loadFunc = function(params) {
		var s = $scope;
		var table = mj.getView("table-001");
		table.load({
			"name" : "123"
		});
		//		
		// tree.render = function(item) {
		// debugger;
		// };

	};
	$scope.clickFun = function() {
		// var viewport = mj.getView("viewport");
		// viewport.switchView({
		// "view" : "view/vbox/vbox.xml",
		// "controller" : "MyCtrl4",
		// "param" : "name2",
		// "onload" : "loadFunc()"
		// });
		var tree = mj.getView("tree001");
		tree.expand();
	};
	$scope.collapse = function() {
		var tree = mj.getView("tree001");
		tree.collapse();
	};
	$scope.expand = function() {
		var tree = mj.getView("tree001");
		tree.expand();
	};
	$scope.insert = function(param) {
		debugger;
	};
};