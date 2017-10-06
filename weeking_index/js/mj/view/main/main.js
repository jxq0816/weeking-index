mj.ctrls.mainCtrl = function($rootScope, $scope) {
	$scope.skin = {
		"default" : "#0d918c",
		"green" : "#0d918c",
		"sea" : "#5B9BD5",
		"red" : "#b6294c",
	};
	$scope.loadFunc = function(param) {
		$scope.tree = mj.getView("main-tree");
		$scope.tree.loadAfter = $scope.treeAfterLoadFunc;
		$scope.tab = mj.getView("main-tab");
		$scope.skin = mj.getView("main-skin");
		$scope.skin.setText("skin->" + $rootScope.skin);
		mj.getView("main-logo").addClass("main-logo-" + $rootScope.skin);
	};
	$scope.switchSkin = function(obj) {
		var skin = obj.getAttrs().skin;
		var href = window.location.href;
		href = href.replace(window.location.search, "") + "?skin=" + skin;
		window.location.replace(href);
	};

	$scope.treeClickFunc = function(node) {
		var data = node.getData();
		if (mj.isTrue(data.isLeaf)) {
			window.idArray = {};
			window.idArray.testId = data.param;
			var child = $scope.tab.addChild({
				"id" : data.id,
				"title" : data.text,
				"active" : 'true',
				"closable" : 'true',
				"view" : data.view,
				"icon" : data.icon,
				"controller" : data.ctrl,
				"load" : "loadFunc",
				"controllerAlias" : data.ctrlAlias,
				"param" : data.param,
				"closeAfter" : $scope.tabCloseAfterFunc,
				"closeBefore" : $scope.tabCloseBeforeFunc
			});
		}
	};

	$scope.treeCheckFunc = function(node) {
		var data = node.getData();
	};

	$scope.treeAfterLoadFunc = function(obj) {
	};

	$scope.collapse = function() {
		$scope.tree.collapse();
	};
	$scope.expand = function() {
		var child = $scope.tab.getChildById("tree-yl-ygwh");
		var item = child.getChildren();
		var cc = item[0].getChildren();
	};
	$scope.insert = function(param) {
	};
	$scope.testFunc = function(params) {
		var view = mj.getView("abc123");
		var panelTag = mj.buildPanel({
			"height" : "100%"
		});
		var gridTag = mj.buildGrid({
			"column" : "3"
		});

		var panel = view.addChild(panelTag);
		var panelHead = panel.addHead({});
		var panelBody = panel.addBody({});
		var panelFoot = panel.addFoot({});
		panelHead.addChild($("<span>abc</span>"));
		var grid = panelBody.addChild(gridTag);
		var items = new Array();
		for (var i = 0; i < 100; i++) {
			grid.addChild({
				"colspan" : "1",
				"height" : "30",
				"render" : $scope.render,
				"dataset" : {
					"name" : "abc" + i
				}
			});
		}
	};

	$scope.render = function(data) {
		return $('<div style="height:100%;padding:5px;border:1px solid blue;">' + data.name + '</div>');
	};

	$scope.tabCloseAfterFunc = function(obj) {
		var id = obj.getId();
	};

	$scope.tabCloseBeforeFunc = function(obj) {
		var id = obj.getId();
		return true;
	};

	$scope.tabOpenAfterFunc = function(obj) {
		var id = obj.getId();
		return true;
	};
	
	$scope.tabOpenBeforeFunc = function(obj) {
		var id = obj.getId();
	};
	
	$scope.frameLoad=function(){
		alert(123);
	};
	
	$scope.clickA=function(){
		var a=$("#mainId");
		a.click();
	}
};
