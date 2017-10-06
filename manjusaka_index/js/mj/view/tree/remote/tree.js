mj.ctrls.remoteTreeCtrl = function($rootScope, $scope, $appService) {
	$scope.selectNode = null;
	$scope.loadFunc = function() {
		$scope.tree = mj.getView("tree-remote-tree");
		var param = {
			"condition" : {
				"aa" : "11",
				"bb" : "22"
			}

		}
//		$scope.tree.setExpanded(true);
		$scope.tree.load(param, $appService.manjusaka.tree.list.action,function(){
			$scope.tree.expandAll();
		});
	};
	$scope.onTreeClick = function(obj) {
		$scope.selectNode = obj;
	}
	$scope.expandFunc = function() {
		$scope.tree.expandAll();
	}
	$scope.collapseFunc = function() {
		$scope.tree.collapseAll();
	}
	$scope.treeCheckFunc = function(node) {
		var data = node.getData();
	};
	$scope.addChildFunc = function() {
		if ($scope.selectNode == null) {
			var ops = {
				"title" : "系统提示",
				"content" : "请选择父节点...",
				"close" : true
			};
			var win = mj.buildAlert(ops);
			return;
		}
		$rootScope.insertWin=null;
		var ops = {
			"id" : mj.key(),
			"title" : "新增窗口",
			"height" : "360",
			"scroll" : "true",
			"view" : "js/mj/view/tree/remote/insert/insert.xml",
			"close" : true,
			"closeModel" : "hide",
			"load" : "loadFunc",
			"param" : $scope.selectNode.getData(),
			"controller" : "treeRemoteInsertFormCtrl"
		};
		$rootScope.insertWin = mj.buildWindow(ops);
		$rootScope.insertWin.open();
	};
	$scope.removeChildFunc = function(node) {
		var selectNode = $scope.tree.getSelectNode();
		if (selectNode == null) {
			var ops = {
				"title" : "系统提示",
				"content" : "请选择要删除的节点...",
				"close" : true
			};
			var win = mj.buildAlert(ops);
			return;
		}
		selectNode.remove();
	};
	$scope.refreshRootNodeFunc = function() {
		var selectNode = $scope.tree.getRootNode();
		selectNode.refresh();
	};
	$scope.refreshSelectNodeFunc = function() {
		var selectNode = $scope.tree.getSelectNode();
		if (selectNode == null) {
			var ops = {
				"title" : "系统提示",
				"content" : "请选择要刷新的节点...",
				"close" : true
			};
			var win = mj.buildAlert(ops);
			return;
		}
		selectNode.refresh();
	};
};