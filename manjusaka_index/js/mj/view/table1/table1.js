mj.ctrls.table1Ctrl = function($scope) {
	$scope.name = "Peter22";
	$scope.user = {};
	$scope.loadFunc = function() {
		var table = mj.getView("table1-001");
		table.load({});
	};
	$scope.winFunc = function() {
		var ops = {
			"id" : mj.key(),
			"title" : "窗口",
			"scroll" : "true",
			"view" : "view/hbox/hbox.xml",
			"close" : true,
			"closeModel" : "destroy",
			"controller" : "hboxCtrl"
		};
		var win = mj.buildWindow(ops);
	};
	$scope.alertFunc = function() {
		var ops = {
			"id" : mj.key(),
			"title" : "系统提示",
			"content" : "alert",
			"close" : true
		};
		var win = mj.buildAlert(ops);
	};

	$scope.confirmFunc = function() {
		var ops = {
			"id" : mj.key(),
			"title" : "系统提示",
			"content" : "confirm",
			"handler" : function(type) {
				alert(type);
			},
			"close" : true
		};
		var win = mj.buildConfirm(ops);
	};

	$scope.loadingFunc = function() {
		var ops = {
			"id" : mj.key(),
			"title" : "系统提示",
			"content" : "loading",
			"close" : true
		};
		var win = mj.showLoading(ops);
	};
};