mj.module.directive('mjChart', function() {
	return mj.buildDirective({
		"name" : "mjChart",
		template : function($element, $attrs) {
			return mj.templates.mjChart;
		},
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					
					var legend_data = [];
					var xAxis_data = [];
					var series_data = [];
					var formatter = '';
					var option = null;
					
					$scope.$inner.clear = function() {
						legend_data = [];
						xAxis_data = [];
						series_data = [];
						formatter = '';
						option = null;
					}
					
					/*
					 * 柱状图
					 */
					$scope.$inner.bar = function () {					
						option = {
							tooltip : {
							   trigger: 'axis',
							   axisPointer : {           
								   type : 'shadow'
							   }
							},
							legend : {
								data : legend_data
							},
							xAxis : {
								data : xAxis_data
			
							},
							yAxis : [{
								type : 'value',
								axisLabel: {
								  formatter: '{value}'+ formatter 
								}								       
							}],
							series : series_data
						};
					}
					
					/*
					 * 饼状图
					 */
					$scope.$inner.pie = function () {						
						option = {
							tooltip : {
								trigger: 'item',
							    formatter: "{a} <br/>{b} : {c} ({d}%)"
							},
							legend: {
								orient: 'vertical',
							    left: 'left',
							    data: legend_data
							},								
							series : series_data
						};
					}
					
					/*
					 * 折线图
					 */
					$scope.$inner.line = function () {						
						option = {
							tooltip : {
							   trigger: 'axis',
							},
							legend : {
								data : legend_data
							},
							grid: {
						        left: '3%',
						        right: '4%',
						        bottom: '3%',
						        containLabel: true
						    },
							xAxis : {
								type : 'category',
					            boundaryGap : false,
								data : xAxis_data
			
							},
							yAxis : [{
								type : 'value',
								axisLabel: {
								  formatter: '{value}'+ formatter 
								}								       
							}],
							series : series_data
						};
					}				
					
					/*
					 * 设置数据
					 */
					$scope.$inner.setData = function(dataList) {	
						var dataKey = $attrs.source;
						var fields = $attrs.field.split(',');
						for (var i=0; i<fields.length;i++) {							
							var dataField = fields[i];													
							legend_data.push(dataField);
							var seriesData = [];
							$.each(dataList, function(index, data) {		
								seriesData.push({"value":data[dataField],"name":dataField});
							});
							
							var series = {
								name:dataField, 
								type:$attrs.graph?$attrs.graph:'bar', 
								data:seriesData,
								label: {
						            normal: {
						            	show: true,
						                position:'top',
						                formatter: $attrs.graph=='pie'?'{b} {c}' + $attrs.formatter:'{c}' + $attrs.formatter 
						            }
						        }
							}
							series_data.push(series);
						}
					}
					
					$scope.$outer.init = function(dataList) {
						$scope.$inner.clear();
						$scope.$inner.setData(dataList);
						var panel = $element.parent();		
						var myChart = echarts.init(document.getElementById($attrs.id),theme);							
						myChart.resize({
							width :  $attrs.width?$attrs.width:panel.width(),
							height : $attrs.height?$attrs.height:panel.height(),
							silent : false
						})
						switch($attrs.graph) {
							case 'bar':
								$scope.$inner.bar();
								break;
							case 'line':
								$scope.$inner.line();
								break;	
							case 'pie':
								$scope.$inner.pie();
								break;
							default:
								$scope.$inner.bar();
						}
						
						myChart.setOption(option);
					}
					
					
				}
			}
		}
	});
})