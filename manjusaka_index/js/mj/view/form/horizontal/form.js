mj.ctrls.horizontalFormCtrl = function($rootScope, $scope, $compile, $appService) {

	$scope.loadFunc = function(params) {

		$scope.form = mj.getView("form-horizontal-form");
		$scope.form.getField("form-text").on("change", $scope.textChangeFunc);
		
		$scope.form.getField("form-text").on("keydown", $scope.textChangeFunc);
		

		var file = $scope.form.getField("form-file");
		action = $appService.filemarket.file.upload.action;
		var param = {
			"condition" : {
				"usrId" : "usrId123",
				"usrName" : "滤镜天"
			}
		}
		file.load(param, action);

		var select_single = $scope.form.getField("form-select-single");
		var action = $appService.manjusaka.select.list.action;
		select_single.load(null, action, function(){
			//alert(select_single.getValue());
		});
		var leftObj=select_single.addLeft({"width":"50"});
		leftObj.addChild(mj.buildButton({"text":"1233"}));
		
		var leftObj=select_single.addRight({"width":"50"});
		leftObj.addChild(mj.buildButton({"text":"1233"}));
		
		var select_multiple = $scope.form.getField("form-select-multiple");
		var action = $appService.manjusaka.select.list.action;
		select_multiple.load(null, action, function(){select_multiple.setValue(["1","2"]);
		//alert(select_multiple.getValue());
		});		
		var leftObj=select_multiple.addLeft({"width":"50"});
		leftObj.addChild(mj.buildButton({"text":"1233"}));
		
		var leftObj=select_multiple.addRight({"width":"50"});
		leftObj.addChild(mj.buildButton({"text":"1233"}));

		var checkbox = $scope.form.getField("form-checkbox");
		action = $appService.manjusaka.checkbox.list.action;
		checkbox.load(null, action, null);
	};

	$scope.textChangeFunc = function(obj) {
		debugger;
		var current = obj.getCurrentItem();
		var ch = current.isChecked();
	}
	
	$scope.sliderChangeFunc = function(obj) {
		var current = obj.getValue();
//		debugger;
	}
	
	$scope.deleteFunc=function(){
		var slider = $scope.form.getField("form-text");
//		$scope.form.removeChildByName("form-text");
		$scope.form.removeChild(slider);
	}
	
	$scope.setFormViewFunc=function(){
		$scope.form.setEditable(false);
	}
	
	$scope.setFormEditFunc=function(){
		$scope.form.setEditable(true);
	}

};
