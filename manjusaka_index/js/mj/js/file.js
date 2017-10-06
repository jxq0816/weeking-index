/**
 * 
 */

mj.module.directive('mjFile', function($compile) {
	return mj.buildFieldDirective( {
		name : "mjFile",		
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.init=function(){
						
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);
					var label = $element.find(".mj-input-label").first();
					var field = $element.find(".mj-input-field-file-display").first();
					if(mj.isEmpty($attrs.label)){
						label.hide();
					}					
					var files=$element.find("input[type='file']");
					var button = $element.find(".mj-input-field-file-button").first();			
					var file=null;
					if ($attrs.hide == "true" || $attrs.hide == true) {
						$element.hide();
					}
					if($attrs.uploadmodel=="manual"){
						$element.find(".mj-input-field-file-button").first().hide();
					}
					field.next().on("click",function(){
						if(mj.isNotEmpty($attrs.readonly) || mj.isNotEmpty($attrs.disabled)){
							return;
						}	
						if (mj.isFalse($attrs.editable)){
							return;
						}
						field.click();
					});
					button.on("click",function(){
						if($scope.$outer.validity()){
							$scope.$inner.upload(file);
						}
					});
					$scope.$inner.tooltip;		
					$scope.$inner.tooltipOpts = {
							"position" : "bottom",
							"title" : ""
					};	
					$scope.$outer.upload = function() {
						if($scope.$outer.validity()){
							$scope.$inner.upload(file);
						}
					};
					field.on("change",function(){
						file = files[0].files[0];
						if($.isEmptyObject(field.val())) {
							$element.find('.mj-input-field-file-progress').html('未选择文件');	
						} else {
							field.next().val(field.val());
							if($scope.$outer.validity()) {
								$element.find('.mj-input-field-file-progress').html('格式正确');	
							} else {
								$element.find('.mj-input-field-file-progress').html('格式错误');	
							}
						}
					});
					
					$scope.$inner.build = function() {
						var parent = $scope.$parent.$parent;
						var pAttrs=null;
						if (!$.isEmptyObject(parent) && parent.$outer.getTagName() == "mjForm") {
							 pAttrs = parent.$outer.getAttrs();
							parent.$inner.addChild($scope.$outer);
							if (mj.isEmpty($attrs.colspan)) {
								$attrs.colspan = 1;
							}
							if ($attrs.colspan < 1) {
								$attrs.colspan = 1;
							}
							if ($attrs.colspan > parent.$inner.getColumn()) {
								$attrs.colspan = parent.$inner.getColumn();
							}
							$element.attr("data-colspan",$attrs.colspan);
						}else{
							pAttrs=$attrs;
						}

						label.html($attrs.label + "：");
						if (!mj.isEmpty(pAttrs["labelAlign"])) {
							label.css({
								"align" : pAttrs["labelAlign"]
							});
						}
						if (!mj.isEmpty(pAttrs["labelWidth"])) {
							label.css({
								"width" : pAttrs["labelWidth"]
							});
						}
						if ($attrs.disabled == "true") {
							field.attr("disabled", $attrs.disabled);
						}
						if ($attrs.readonly == "true") {
							field.attr("readonly", $attrs.readonly);
						}
						var row=$element.find(".mj-input-row").first();
						for(var i=0;i<row.children().length;i++){
							var child=$(row.children()[i]);
							if(child.hasClass("mj-input-cell")){
								child.addClass("mj-input-field-border-left");
								break;
							}
						}
						for(var i=row.children().length-1;i>=0;i--){
							var child=$(row.children()[i]);
							if(child.hasClass("mj-input-cell")){
								child.addClass("mj-input-field-border-right");
								break;
							}
						}
					};

					$scope.$outer.getValue = function() {
						return field.next().val();
					};
					
					$scope.$outer.getFileValue = function() {
						var reader = new FileReader();
						if (!$.isEmptyObject(file)){
							 return reader.readAsText(file);//读取文件的内容
						}
					};

					$scope.$outer.setValue = function(val) {
						return field.next().val(val);
					};
   
					$scope.$outer.getLabel = function() {
						return label;
					};

					$scope.$outer.setLabel = function(val) {
						return label.html(val + ":");
					};
					
					$scope.$outer.getName = function(val) {
						return $attrs.name;
					};

					$scope.$outer.getType = function() {
						return field.attr("type");
					};

					$scope.$outer.getId = function(val) {
						return $attrs.id;
					};

				
					$scope.$outer.success = function(evt) {
						mj.findCtrlScope($scope)[$attrs.success](evt);
					};
					$scope.$outer.error = function(evt) {
						mj.findCtrlScope($scope)[$attrs.error](evt);
					};
					$scope.$outer.abort = function(evt) {
						mj.findCtrlScope($scope)[$attrs.abort](evt);
					};
					$scope.$outer.validity = function() {
						var flag = true;	
						if ($attrs.hide == "true" || $attrs.hide == true) {
							return true;
						}
						if ($attrs.disabled == "true" || $attrs.disabled == true) {
							return true;
						}							
						if ($attrs.required == "true") {							
							if (mj.isEmpty($scope.$inner.tooltip)){
								$scope.$inner.tooltip = mj.buildTooltip(field.next(),$scope.$inner.tooltipOpts);
							}
							if(mj.isEmpty(file)){
								field.next().addClass("mj-input-validity-error");
								$scope.$inner.tooltip.setTitle("上传文件不能为空");
								//field.next().attr("title", "上传文件不能为空");
								flag = false;
							}else{
						        var fileSize = $scope.$inner.getByteToKB(file.size);					        
								flag = $scope.$inner.checkEmpty(file.name);
								if (flag) {
									flag = $scope.$inner.checkFormat($scope.$inner.getSuffix(file.name));
									if (flag) {
										flag = $scope.$inner.checkMin(fileSize);
										if (flag) {
											flag = $scope.$inner.checkMax(fileSize);
										}
									}
								}
							}
						}
						if (flag) {
							if (!mj.isEmpty($scope.$inner.tooltip)){
								$scope.$inner.tooltip.setTitle("");
							}
							field.next().removeClass("mj-input-validity-error");
						}
						return flag;
					};

					$scope.$inner.getSuffix = function(fileName) {
						var pos=fileName.lastIndexOf(".");
		    			return fileName.substring(pos+1);  
					};
					$scope.$inner.getByteToMB = function(val) {
						if (isNaN(val)){ 
							return val;
						}
					    val = (Math.round(file.size * 100 / (1024 * 1024)) / 100);
					    return val;
					};
					$scope.$inner.getByteToKB = function(val) {
						if (isNaN(val)){ 
							return val;
						}
						val = (Math.round(val * 100 / 1024) / 100);
					    return val;
					};
					/**
					 * 清空控件输入，如果有默认值就赋给默认值，没有默认值则设置为null
					 */
					$scope.$outer.reset = function(){
						if(!mj.isEmpty($attrs.value)){
							field.next().val(val);
						}else{
							field.next().val("");
						}		
						field.next().removeAttr("title");
						field.next().removeClass("mj-input-validity-error");
					}
					$scope.$inner.checkEmpty = function(fileName) {
						var flag = true;
						if ($attrs.required == "true") {							
							if (mj.isEmpty(fileName)) {
								field.next().addClass("mj-input-validity-error");
								$scope.$inner.tooltip.setTitle("上传文件不能为空");
								//field.next().attr("title", "上传文件不能为空");
								flag = false;
							}
						}
						return flag;
					};

					$scope.$inner.checkFormat = function(fileType) {
						var flag = true;						
						if (!mj.isEmpty($attrs.type)) {
							if($attrs.type=="*"){
								return true;
							}
							if (!(new RegExp(fileType.toLowerCase()).test($attrs.type.toLowerCase()))) {
								field.next().addClass("mj-input-validity-error");
								$scope.$inner.tooltip.setTitle("文件格式错误,只能上传"+$attrs.type+"格式文件！");
								//field.next().attr("title", "文件格式错误,只能上传"+$attrs.type+"格式文件！");
								flag = false;
							}
						}
						return flag;
					};

					$scope.$inner.checkMin = function(fileSize) {
						var flag = true;
						if ($.isNumeric($attrs.min)) {
							if (fileSize < $attrs.min) {
								field.next().addClass("mj-input-validity-error");
								$scope.$inner.tooltip.setTitle("文件不能小于" + $attrs.min  + "KB");
								//field.next().attr("title", "文件不能小于" + $attrs.min  + "KB");
								flag = false;
							}
						}
						return flag;
					};

					$scope.$inner.checkMax = function(fileSize) {
						var flag = true;
						if ($.isNumeric($attrs.max)) {
							if (fileSize > $attrs.max) {
								field.next().addClass("mj-input-validity-error");
								$scope.$inner.tooltip.setTitle("文件不能大于" + $attrs.max + "KB");
								//field.next().attr("title", "文件不能大于" + $attrs.max + "KB");
								flag = false;
							}
						}
						return flag;
					};					
					$scope.$inner.upload = function(file) {
						var fd = new FormData();
						fd.append("uploadFile", file);
						if (mj.isEmpty($scope.$inner.action)) {
							$scope.$inner.action = mj.findAttr($attrs.action,$scope);
						}						
						if (mj.isEmpty($scope.$inner.param)) {
							$scope.$inner.param = mj.findAttr($attrs.condition,$scope);
							if(mj.isNotEmpty($attrs.condition)){								
								if ($attrs.condition.indexOf("#") == 0) {
									fd.append($attrs.condition.replace("#", ""), JSON.stringify($scope.$inner.param));
								} else if ($attrs.condition.indexOf("@") == 0) {
									fd.append($attrs.condition.replace("@", ""), JSON.stringify($scope.$inner.param));
								}else{
									fd.append($attrs.condition, JSON.stringify($scope.$inner.param));
								}
							}
						}else{
							var obj = eval($scope.$inner.param);  
							for(i in obj){
								fd.append(i, JSON.stringify(obj[i]));
							}
						}
				        var xhr = new XMLHttpRequest();
				        $scope.$inner.uploadProgress.id=$attrs.id;
				        xhr.upload.addEventListener("progress",$scope.$inner.uploadProgress, false);
				        xhr.addEventListener("load",$scope.$inner.uploadComplete, false);
				        xhr.addEventListener("error",$scope.$inner.uploadFailed, false);
				        xhr.addEventListener("abort",$scope.$inner.uploadCanceled, false);
				        xhr.open('POST', $scope.$inner.action, true);
				        xhr.setRequestHeader("Content-Type", "application/file;charset=utf-8");
				        xhr.send(fd);				       
					};
					$scope.$outer.load = function(param,action) {
						if (mj.isEmpty(action)) {
							$scope.$inner.action = mj.findAttr($attrs.action,$scope);
						}else{
							$scope.$inner.action = action;
						}
						if (mj.isEmpty(param)) {
							$scope.$inner.param = mj.findAttr($attrs.condition,$scope);
						}else{
							$scope.$inner.param = param;
						}
					}
					$scope.$inner.uploadProgress = function (evt) {
			            if (evt.lengthComputable && evt.target.status == 200) {
			              var percentComplete = Math.round(evt.loaded * 100 / evt.total);
			              $element.find('.mj-input-field-file-progress').html(Math.round(percentComplete) + '%');
			            } else {
			              $element.find('.mj-input-field-file-progress').html('上传文件发生了错误');
			            }
			        }
					$scope.$inner.uploadComplete = function (evt) {
				        var target=evt.target.response;
				        if (evt.target.status == 200) {
				        	$element.find('.mj-input-field-file-progress').html('已完成');
				        }
				        $scope.$outer.success(evt);
					}
					$scope.$inner.uploadFailed = function (evt) {
						$scope.$outer.error(evt);
						$element.find('.mj-input-field-file-progress').html('上传文件发生了错误');
						//alert("上传文件发生了错误尝试");
					}
					$scope.$inner.uploadCanceled = function (evt) {
						$scope.$outer.abort(evt);
						$element.find('.mj-input-field-file-progress').html('上传被用户取消或者浏览器断开连接');
						//alert("上传被用户取消或者浏览器断开连接");
					} 
					$scope.$inner.build();
				}
			}
		}
	});
});
/**
 * 动态添加控件
 */
mj.buildFile = function(opts) {
	var tag = $("<mj-file>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};