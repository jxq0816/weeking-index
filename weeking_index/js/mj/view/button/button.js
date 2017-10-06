mj.ctrls.buttonCtrl = function($scope) {
	$scope.loadFunc = function() {
		$("#btn_tt").click(function(event){
			alert(1);
			event.stopPropagation();
		});
		$("#btn_cc").click(function(event){
			alert(2);
		});
	};
	
	$scope.clickFunc=function(obj){
		var item=obj.getSelectedItem();
		var text=item.getText();
		var button=item.getButton();
		debugger;
	}
};