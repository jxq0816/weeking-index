mj.ctrls.messageCtrl = function($scope) {
	$scope.loadFunc = function() {
		var messagePopup = mj.getView("message-popup");
		$scope.popup = mj.popup(messagePopup.getButton(), {
			"position" : "bottom",
			"content" : "test"
		});
	};

	$scope.windowFunc = function() {
		var ops = {
			"id" : mj.key(),
			"title" : "窗口",
			"scroll" : "true",
			"view" : "js/mj/view/message/table/table.xml",
			"close" : true,
			"closeModel" : "destroy",
			"controller" : "messageTableCtrl"
		};
		var win = mj.buildWindow(ops);
		win.open();
	};
	$scope.alertFunc = function() {
		var ops = {
			"id" : mj.key(),
			"title" : "系统提示",
			"content" : "操作有误，请检查...",
			"close" : true
		};
		var win = mj.buildAlert(ops);
	};

	$scope.confirmFunc = function() {
		var ops = {
			"id" : mj.key(),
			"title" : "系统提示",
			"content" : "确认要进行此操作吗？",
			"handler" : function(type) {
				alert("button-type:" + type);
			},
			"close" : true
		};
		var win = mj.buildConfirm(ops);
	};

	$scope.loadingFunc = function() {
		var ops = {
			"id" : mj.key(),
			"title" : "系统提示",
			"content" : "正在加载数据，请稍等...",
			"close" : true
		};
		var win = mj.buildLoading(ops);
		setTimeout(function() {
			win.close()
		}, 3000);
	};
};