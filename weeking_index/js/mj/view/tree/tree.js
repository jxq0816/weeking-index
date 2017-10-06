mj.ctrls.treeCtrl = function($scope) {
	$scope.loadFunc = function() {
		$scope.tree = mj.getView("tree-tree");
	};
	$scope.onTreeClick = function(obj) {
	}
	$scope.expandFunc = function() {
		$scope.tree.expandAll();
	}
	$scope.collapseFunc = function() {
		$scope.tree.collapseAll();
	}
};