
mj.ctrls.charCtrl = function($rootScope, $scope) {
	$scope.loadFunc = function() {
		var chart = mj.getView('charMain');
		var dataList = [
			{"name":"x1","amount":"1500","total":"2500"},
			{"name":"x2","amount":"2500","total":"1833"},
			{"name":"x3","amount":"2992","total":"1622"},
			{"name":"x4","amount":"4994","total":"1022"},
			{"name":"x5","amount":"6994","total":"2022"}
		]	
		var json = [{"legend":"销量","axis":"name","series":"total","formatter":"辆"},{"legend":"金额","axis":"name","series":"amount","formatter":"万元"}];
		
		chart.layout(dataList,json);
	};
	

};
