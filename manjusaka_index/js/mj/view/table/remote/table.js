mj.ctrls.tableRemoteCtrl = function($scope, $appService) {
	$scope.pageAction = $appService.manjusaka.table.page.action;
	$scope.loadFunc = function() {
		$scope.table = mj.getView("tableRemote-table");
		$scope.table.addColumns([{
			"title" : "id",
			"field" : "id",
			"align" : "center",
			"sort" : "true"
		},{
			"title" : "name",
			"field" : "name",
			"align" : "center",
			"sort" : "true"
		},{
			"title" : "desc",
			"field" : "desc",
			"align" : "center",
			"sort" : "true"
		},{
			"title" : "remark",
			"field" : "remark",
			"align" : "center",
			"sort" : "true"
		},{
			"title" : "操作",
			"field" : "id",
			"width" : "120",
			"render" : $scope.opreatorRender
		}]);
		$scope.table.load({
			"condition" : {

			}
		});
	};
	
	$scope.clearFunc = function() {
		$scope.table.clear();
	}
	
	$scope.refreshFunc = function() {
		$scope.table.load({
			"condition" : {

			}
		});
	}
	
	$scope.change = function(data) {
		return "1"
	}

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

	$scope.opreatorRender = function(data) {
		// var str = "<mj-button data-text='资源分配'></mj-button>&nbsp;<mj-button
		// data-text='人员分配'></mj-button>";
		// return str;
		var str = '<mj-button data-text="center1" data-skin="matter" data-icon="fa fa-user-o">' + '<mj-button-menu data-hide="false" data-click="test3" data-text="菜单按钮">'
				+ '<mj-button-menu-item data-text="菜单九"></mj-button-menu-item>' + '</mj-button-menu>' + '</mj-button>';
		return str;
	};
};