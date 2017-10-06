mj.ctrls.verticalFormCtrl = function($rootScope, $scope, $compile) {

	$scope.loadFunc = function(params) {

		$scope.form = mj.getView("form-vertical-form");
		$scope.form.getField("form-text").on("change", $scope.textChangeFunc);
		var file = $scope.form.getField("form-file");
		action = "http://106.14.57.124/filemarket.server/services/file/upload";
		var param = {
			"condition" : {
				"usrId" : "usrId123",
				"usrName" : "滤镜天"
			}
		}
		file.load(param, action);

		var select = $scope.form.getField("form-select");
		var action = "http://106.14.57.124/manjusaka/services/mselect/selection/list";
		select.load(null, action, null);

		var checkbox = $scope.form.getField("form-checkbox");
		action = "http://106.14.57.124/manjusaka/services/mcheckbox/selection/list";
		checkbox.load(null, action, null);
		
	};

	$scope.textChangeFunc = function() {
		alert(11);
	}
	
	$scope.setUpload = function() {
		alert(11);
		var file=$scope.form.getField("form-file");
		file.upload();
	}
};
