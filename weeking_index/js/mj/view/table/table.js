mj.ctrls.tableCtrl = function($scope) {
	$scope.loadFunc = function() {
		$scope.table = mj.getView("table-table");
		$scope.table.load({});
	};
	

	$scope.rowclickFunc=function(obj){
		alert(JSON.stringify(obj));
	}
	
	
	$scope.changeCol2=function(item,data){
		return item.formatValue+"-aaa";
	}
};