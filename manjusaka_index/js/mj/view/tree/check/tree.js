mj.ctrls.treeCheckCtrl = function($scope) {
	$scope.flag=false;
	$scope.loadFunc = function() {
		$scope.tree = mj.getView("tree-check-tree");
	};
	$scope.onTreeClick = function(obj) {
	}
	$scope.expandFunc = function() {
		$scope.tree.expandAll();
	}
	$scope.collapseFunc = function() {
		$scope.tree.collapseAll();
	}
	$scope.treeCheckFunc=function(node){
		var checked=node.isChecked();
		
	};
};