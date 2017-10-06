/**
 * 
 */

mj.module.directive('mjCard', function() {
	return mj.buildDirective({
		"name" : "mjCard",
		template : function($element, $attrs) {
			return mj.templates.mjCard;
		},
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre($ctrl, $scope, $element, $attrs);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost($scope.$$ctrl, $scope, $element,
							$attrs);			
					var card = $($element.find(".mj-card-row"));
					card.addClass($attrs.row);
					var card_image = $($element.find(".mj-card-image"));	
					if (!$.isEmptyObject($attrs.imageHeight)) {
						card_image.css({
							"height" : $attrs.imageHeight
						});
					} else {
						card_image.css({
							"height" : 150
						});
					}
					card_image.attr('src',$attrs.src); 
					var card_caption = $element.find(".caption");
					var card_h = $('<h3></h3>');
					card_h.text($attrs.title);
					card_h.appendTo(card_caption);
					var card_p = $('<p></p>');
					card_p.text($attrs.content);
					card_p.appendTo(card_caption);
					$scope.$outer.setTitle = function(title) {
						$attrs.title = title;
						card_h.text($attrs.title);					
					}
					$scope.$outer.setContent = function(content) {
						$attrs.content = content;
						card_p.text($attrs.content);					
					}				
					$scope.$outer.setImage = function(src) {
						$attrs.src = src;
						card_image.attr('src',$attrs.src); 				
					}
				}
			}
		}
	});
});