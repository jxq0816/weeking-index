mj.ctrls.form2Ctrl = function($rootScope, $scope, $compile) {
	$scope.name = "Peter22";
	$scope.userName1 = "2122";
	$scope.condition = {
			"usrId" : "usrId123"
		};
	$scope.example = {
		text : 'guest',
		word : /^\s*\w*\s*$/
	};
	$scope.user = {};
	$scope.testFunc = function() {
		$scope.btn = "lvjt";
		$scope.names = [ 'morpheus', 'neo', 'trinity' ];
		$rootScope.v1 = false;
		$rootScope.v2 = true;
	};
	$scope.loadFunc = function() {
		var button = mj.getView("tooltip-123");
//		var opts = {
//				"position" : "bottom",
//				"top" : "10",
//				"title" : "文本输入框不能为空！！！测试测试"
//		};
		var text = mj.getView("mj-popup-123456");
		var opts = {
				"position" : "top",
				"content" : '<mj-button data-text="取消" data-icon="fa fa-home" data-id="mj-btn222"></mj-button>'
		};	
		$scope.popup = mj.buildPopup(text.getElement(),opts);
		
		var btn222 = mj.getView("mj-btn222");
		btn222.on("click", function(){
			alert(123);
		})
//		var opts = {
//				"position" : "left",
//				"left" : "-8",
//				"title" : "文本输入框不能为空！！！测试测试"
//		};
//		var opts = {
//				"position" : "right",
//				"left" : "18",
//				"title" : "文本输入框不能为空！！！测试测试"
//		};
		//var tooltip = mj.buildTooltip(text.getElement(),opts);
		
		
//		var popup1 = mj.buildPopup(button.getElement(),opts);
		//$scope.initpopup(popup);
//		tooltip.setTitle("文本输入框不能为空！！！测试测试");
//		var text_001 = mj.getView("mj-text-0023");
//
//		text_001.setValue("3");
//		text_001.validity();
		//		
		// tree.render = function(item) {
		// debugger;
		// };
//		var text = mj.getView("mj-text-123456");
//		var opts = {
//				"position" : "bottom",
//				"title" : "文本输入框不能为空！！！测试测试"
//		};
//		mj.buildTooltip(text,opts);
	};
	$scope.clickFun = function() {
		// var viewport = mj.getView("viewport");
		// viewport.switchView({
		// "view" : "view/vbox/vbox.xml",
		// "controller" : "MyCtrl4",
		// "param" : "name2",
		// "onload" : "loadFunc()"
		// });
//		var tree = mj.getView("tree001");
//		tree.expand();
		
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
		var ops = {
			"id" : mj.key(),
			"title" : "窗口",
			"width" : "50%",
			"height" : "50%",
			"scroll" : "true",
			"view" : "view/hbox/hbox.xml",
			"close" : true,
			"closeModel" : "destroy",
			"controller" : "hboxCtrl",
			"param" : {
				"sex" : "1"
			},
			"afterClose" : $scope.close
		};
		var win = mj.buildWindow(ops);
	};
	$scope.close = function() {debugger;
		alert(123);
	}
	$scope.initpopup = function() {
		
		
		$scope.popup.open();
	}

	$scope.test = function() {

		debugger;
		var myRadio = mj.getView("mj-text-0099");
		alert(myRadio.getValue())
		var v = myRadio.getItem();
		myRadio.addItem({
			"value" : "4"
		});
		myRadio.setValue("4");
		myRadio.delItem("1");
		/*
		 * var vvv = myRadio.getValue(); alert(vvv.label+vvv.value)
		 * myRadio.setValue(1); vvv = myRadio.getLabel(); alert(vvv)
		 * myRadio.setLabel("性别1111"); myRadio.setDisabled(true);
		 */
	}

	$scope.test1 = function() {

		var myCheckbox = mj.getView("mj-text-00991");
		var aaa = myCheckbox.getValue();
		alert(222)
		myCheckbox.setValue("3,4");
		var bbb = myCheckbox.getCheckedItems();
		myCheckbox.addItem({
			"value" : "5"
		});
		myCheckbox.delItem("1");
		/*
		 * var vvv = myRadio.getValue(); alert(vvv.label+vvv.value)
		 * myRadio.setValue(1); vvv = myRadio.getLabel(); alert(vvv)
		 * myRadio.setLabel("性别1111"); myRadio.setDisabled(true);
		 */
	}

	$scope.test2 = function() {
		var myCheckbox = mj.getView("mj-text-00991");
		myCheckbox.selectAll();
	}

	$scope.test3 = function() {
		var myCheckbox = mj.getView("mj-text-00991");
		myCheckbox.selectCancel();
	}

	$scope.aaa = function(obj) {
		debugger;

	}

	$scope.setReadOnly = function() {
		var myCheckbox = mj.getView("mj-text-00991");
		myCheckbox.setDisabled(true)
		debugger;

	}
	$scope.success = function(evt) {
		alert("上传文件成功code：" + evt.target.status);
	}
	$scope.error = function(evt) {
		alert("上传文件发生了错误尝试");
	}
	$scope.abort = function(evt) {
		alert("上传被用户取消或者浏览器断开连接");
	}
	$scope.onChange = function(val) {
		alert("触发绑定事件");
	}
	$scope.clearItem = function() {
		// var aaa = mj.getView("mj-radio111");
		// aaa.clearItem();
		// var bbb = mj.getView("mj-checkbox111");
		// bbb.clearItem();
		var aaa = mj.getView("mj-select11");
		aaa.clearItem();
	}
	$scope.load = function() {
		var aaa = mj.getView("mj-select11");
		var data = [ {
			"value" : "1",
			"label" : "一"
		}, {
			"value" : "1",
			"label" : "二"
		}, {
			"value" : "3",
			"label" : "三"
		} ];
		aaa.load(data);
	}

};
