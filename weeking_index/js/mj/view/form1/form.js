mj.ctrls.form1Ctrl = function($rootScope, $scope, $compile) {
	$scope.name = "Peter22";
	$scope.userName1 = "2122";
	$scope.condition = {
		"usrId" : "usrId123",
		"usrName" : "滤镜天"
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
	$scope.loadFunc = function(params) {
		// var button=mj.getView("mj-button-1234");
		// button.on("mouseover",$scope.onChange);
		// var text_001 = mj.getView("mj-text-0023");
		//
		// text_001.setValue("3");
		// text_001.validity();
		//		
		// tree.render = function(item) {
		// debugger;
		// };
		var form = mj.getView("mj-form-0011");
//		form.addChild(mj.buildText({
//			"name" : "age",
//			"value" : "1",
//			"label" : "label-11"
//		}));

		var select = mj.getView("mj-select");
		var action = "http://localhost/manjusaka/services/mselect/selection/list";
		select.load(null, action,null);
		
		// data-data='[{"id":"1","label":"苹果","value":"1"},{"id":"2","label":"香蕉","value":"2"},{"id":"3","label":"桃子","value":"3"},{"id":"4","label":"梨子","value":"4"}]'
		var checkbox = mj.getView("mj-checkbox-00991");
		action = "http://localhost/manjusaka/services/mcheckbox/selection/list";
		checkbox.load(null,action,null);
		// data-action="{}"
		// data-data='[{"id":"1","label":"一","value":"1"},{"id":"2","label":"二","value":"2"},{"id":"3","label":"三","value":"3"}]'
//		 var radio = mj.getView("mj-radio");
//		 action = "http://localhost/manjusaka/services/mradio/selection/list";
//		 radio.load(null,action,null);
		var file = mj.getView("mj-file-0011");
		action = "http://localhost/filemarket.server/services/file/upload";
		var para = {
				"condition":{
					"usrId" : "usrId123",
					"usrName" : "滤镜天"
				}
		}
		file.load(para,action);
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
	$scope.close = function() {
		var select = mj.getView("mj-select");
		select.setValue("");
//		select.removeChild("2");
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
		// myCheckbox.setValue("3,4");
		// myCheckbox.delItem("1");
		var aaa = myCheckbox.getValue();
		// var bbb = myCheckbox.getCheckedItems();
		alert(aaa)
		// myCheckbox.addItem({
		// "value" : "5"
		// });

		/*
		 * var vvv = myRadio.getValue(); alert(vvv.label+vvv.value)
		 * myRadio.setValue(1); vvv = myRadio.getLabel(); alert(vvv)
		 * myRadio.setLabel("性别1111"); myRadio.setDisabled(true);
		 */
	}

	$scope.test2 = function() {
		var myCheckbox = mj.getView("mj-text-00991");
		var aaa = myCheckbox.getValue();
		alert(aaa);
	}

	$scope.test3 = function() {
		var aaa = mj.getView("mj-select");
		var data = '[{"value":"1","label":"一"},{"value":"2","label":"二"},{"value":"3","label":"三"}]';
		// var item = {"value":"5","label":"5"}
		// aaa.addItem(item);
		var bbb = aaa.setValue("");
		// aaa.delItem("2");
		// aaa.load();
	}

	$scope.aaaa = function(obj) {
		var myCheckbox = mj.getView("mj-text-00991");
		myCheckbox.selectAll();
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
		var aaa = mj.getView("mj-select");
		aaa.setValue("");
	}
	$scope.initkj = function() {
		var aaa = mj.getView("mj-radio111");
		var bbb = mj.getView("mj-checkbox111");
		var ccc = '[{"id":"1","label":"苹果1","value":"1"},{"id":"2","label":"香蕉1","value":"2"},{"id":"3","label":"桃子1","value":"3"},{"id":"4","label":"梨子1","value":"4"}]';
		// var ccc = '{"id":"1","label":"苹果1","value":"1"}';

		bbb.init($.parseJSON(ccc))
		aaa.init($.parseJSON(ccc))
	}
	$scope.submit = function() {
		var form = mj.getView("mj-form-0011");
//		var select = mj.getView("mj-select");
//		select.setValue("");
//		var select1 = mj.getView("mj-select-1");
//		select1.setValue("4");
		// var flag = form.getValidate();

		// debugger;
		// var flag = form.getField("number");
		// alert(flag.getValue());
		var radio = mj.getView("mj-radio");
//		radio.setValue("2");
//		radio.reset();
		
//		radio.clearSelected();
//		debugger
//		radio.setValue("1");
		form.reset();

		// var tab = mj.getView("tab-a");
		// var item = tab.select(3);
		// var item = tab.getSelected();
		// tab.closeAll();
		// debugger;
		// tab.close("mj-key-25");
		// var button=mj.getView("mj-button-menu-1");
		// button.setText("菜单按钮");
		// var ops = {
		// "id" : mj.key(),
		// "text" : "新菜单项",
		// "disabled" : "true"
		// };
		// button.addItem(ops);
		// button.delItem("mj-button-menu-item-22222");
	}
	$scope.setHide = function() {
		var button = mj.getView("mj-button-menu-item-11111");
		button.setHide(false);
	}
};
