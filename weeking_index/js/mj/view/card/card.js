mj.ctrls.cardCtrl = function($rootScope, $scope, $compile) {
	$scope.loadFunc = function(params) {
		var card2 = mj.getView("card2");
		card2.setTitle('title');
		card2.setContent('content');
		card2.setImage('img/default_portrait.png');

		var card3 = mj.getView("card3");
		card3.setTitle('title');
		card3.setContent('content');
		card3.setImage('img/default_portrait.png');
	}

};
