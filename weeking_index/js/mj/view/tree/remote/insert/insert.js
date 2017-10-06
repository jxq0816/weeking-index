mj.ctrls.treeRemoteInsertFormCtrl = function($rootScope, $scope, $compile, $appService) {

	$scope.loadFunc = function(params) {
		var values = {};
		values.parentId = params.id;
		values.parentText = params.text;
		values.isLeaf = "1";
		$scope.form = mj.getView("tree-remote-insert-form");
		$scope.form.getField("isLeaf").loadData([ {
			"label" : "是",
			"value" : "1"
		}, {
			"label" : "否",
			"value" : "0"
		} ]);
		$scope.form.setValue(values);
	};

	$scope.submitFunc = function() {
		var values=$scope.form.getValue();
		$.ajax({
			url : $appService.manjusaka.tree.insert.action,
			type : "post",
			async : true,
			data : {"condition":JSON.stringify(values)},
			contentType : "application/json",
			dataType : 'json',
			success : function(data, textStatus, jqXHR) {
				if (data.code == 0) {
					$scope.tree = mj.getView("tree-remote-tree");
					var selectNode=$scope.tree.getSelectNode();
					selectNode.refresh({"isLeaf":"false"});
				}
				$scope.cancelFunc();
			},
			error : function(xhr, textStatus) {
				throw textStatus;
			}
		})
	}

	$scope.cancelFunc = function() {
		$rootScope.insertWin.close();
		$rootScope.insertWin=null;
	}

};
