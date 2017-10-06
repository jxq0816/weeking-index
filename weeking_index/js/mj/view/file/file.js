mj.ctrls.fileCtrl = function($rootScope, $scope, $http) {	
	$scope.loadFunc = function(params) {
		var file = mj.getView("file123");
		action = "http://localhost/filemarket.server/services/file/upload";
		var para = {
				"condition":{
					"usrId" : "usrId123"
				}
		}
		var ops = {
				"auto":"false",
				"multi":"true",
				"removeTimeout":"9999999",
				"url":action,
				"para":para,
				onUploadStart:function(){
					alert('开始上传');
				},
				onInit:function(){
					alert('初始化');
				},
				onUploadComplete:function(){
					alert('上传完成');
				}
			}
		file.load(ops);
	};
	
};
