mj.ctrls.marqueeCtrl = function($rootScope, $scope) {
	
	$scope.loadFunc = function(params) {
		var meq=mj.getView("marquee-001");
		var child=meq.addChild({});
		child.addChild($('<img style="width:100%;height:100%;" src="img/banner01.png"></img>'))
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
