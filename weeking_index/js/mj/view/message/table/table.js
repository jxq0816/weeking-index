mj.ctrls.messageTableCtrl = function($scope) {
	$scope.loadFunc = function() {
		var table1 = mj.getView("messageTable-table");
		table1.load({
			"condition" : {
			
			}
		});
	};

	$scope.change = function(data) {
		return "1"
	}

	$scope.rowclick = function(data) {
		alert('rowclick:' + data.rowindex + ":" + data);
	}

	$scope.rowdblclick = function(data) {
		alert('rowdblclick:' + data.rowindex + ":" + data);
	}

	$scope.rowfocus = function(data) {
		alert('rowfocus:' + data.rowindex + ":" + data);
	}
};