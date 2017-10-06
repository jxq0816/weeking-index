/**
 * 
 */
window.onresize=function(){
	mj.layoutView();
};
$ng = angular;
var mj = {
	delayedTime : 240,	
	scope:null,
	view : {},
	params : {
		"transclude" : true,
		"replace" : true
	},
	includeMap:{},
	module : $ng.module('app', []),
	ctrls:{},
	scrollbarWidth : -1,
	viewMap : new Array(),
	__key : [],
	__body : null,
	__zindex:100,
	getIndex:function(){
		return mj.__zindex++;
	},
	addView : function(id, view,scope) {
		mj.viewMap.push({
			"id" : id,
			"view" : view,
			"scope" : scope
		});
	},
	checkView : function(id) {
		for (var i = 0; i < mj.viewMap.length; i++) {
			var map = mj.viewMap[i];
			if (map.id == id) {
				return true;
			}
		}
	},
	delView : function(id) {
		for (var i = 0; i < mj.viewMap.length; i++) {
			var map = mj.viewMap[i];
			if (map.id == id) {
				mj.viewMap.splice(i, 1);
				break;
			}
		}
	},
	getViewMap : function() {
		return mj.viewMap;
	},
	getView : function(id) {
		var map = null;
		for (var i = 0; i < mj.viewMap.length; i++) {
			map = mj.viewMap[i];
			if (map.id == id) {
				break;
			} else {
				map = null;
			}
		}
		if (map == null) {
			return null;
		} else {
			return map.view;
		}
	},
	key : function(){
		if(mj.__key.length>50){
			return "mj-key-"+mj.__key.shift();
		}else{
			var start=mj.__key[mj.__key.length-1];
			for(var i=start+1;i<=start+100;i++){
				mj.__key.push(i);
			}
			return "mj-key-"+mj.__key.shift();
		}
	},
	number : function(number) {
		var n = parseInt(number, 10);
		if ($.isNumeric(n)) {
			return n;
		} else {
			return 0;
		}
	},
	getHtml : function($element) {
		return $element.prop("outerHTML");
	},
	loadResource : function(view,ctrl,ctrlAlias) {
		var style = view.replace("xml", "css");
		var script = view.replace("xml", "js");
		var head=$(document.getElementsByTagName('head')[0]);
		var _script=head.find("script[src='"+script+"']");
		if(_script.length>0){
			if(!mj.isEmpty(mj.ctrls[ctrl])){
				if(mj.isEmpty(ctrlAlias)){
					mj.provider.controller(ctrl,mj.ctrls[ctrl]);
				}else{
					mj.provider.controller(ctrlAlias,mj.ctrls[ctrl]);
				}
			}
			return;
		}
		
		 var link = document.createElement("link");
         link.type = "text/css";
         link.rel = "stylesheet";
         link.href = style;
         link.onload = link.onreadystatechange = function() {
             if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
            	 
             }
           }
         document.getElementsByTagName("head")[0].appendChild(link);
         head.append('<script src="' + script + '"></script>');
		var start=(new Date()).getTime();
		while(true){
			if(!mj.isEmpty(mj.ctrls[ctrl])){
				if(mj.isEmpty(ctrlAlias)){
					mj.provider.controller(ctrl,mj.ctrls[ctrl]);
				}else{
					mj.provider.controller(ctrlAlias,mj.ctrls[ctrl]);
				}
				break;
			}
			var end=(new Date()).getTime();
			if(end-start>=10000){
				throw "["+script+"]:脚本加载异常，请检查...";
			}
		}
	},
	isEmpty : function(str) {
		if (str == null || typeof str == "undefined" || str == "" || $.trim(str) == "") {
			return true;
		}
		return false;
	},
	isNotEmpty : function(str) {
		if (str != null && typeof str != "undefined" && str != "" && $.trim(str) != "") {
			return true;
		}
		return false;
	},
	isBoolean:function(flag){
		if(typeof flag =="boolean"){
			return true;
		}else{
			if(flag=="true" || flag=="false"){
				return true;
			}else{
				return false;
			}
		}
	},
	isTrue : function(flag) {
		if (flag == "true" || flag == true) {
			return true;
		}
		return false;
	},
	isFalse : function(flag) {
		if (flag == "false" || flag == false) {
			return true;
		}
		return false;
	},
	isPercentage:function(val){
		var reg=/^([1-9]{1}[0-9]{0,1}|0|100)(.d{1,2}){0,1}%$/;
		return reg.test(val);
	},
	isNumber:function(val){
		return ($.isNumeric(val) || mj.isPercentage(val));
	},
	getLength : function(str) {
		if (str == null)
			return 0;
		if (typeof str != "string") {
			str += "";
		}
		return str.replace(/[^\x00-\xff]/g, "01").length;
	},
	findAttr:function(param,$scope){
		if(mj.isEmpty(param)){
			return param;
		}else{
			if (param.indexOf("#") == 0) {
				return window.eval(param.replace("#", ""));
			} else if (param.indexOf("@") == 0) {
				return mj.findCtrlScope($scope)[param.replace("@", "")];
			}else{
				return param;
			}
		}
	},
	findCtrlScope : function($scope) {
		var indexScope=null;
		var parent = $scope;
		while (parent != null) {
			if(parent.$id==2 || parent.$id=="2"){
				indexScope=parent;
			}
			if(mj.isNotEmpty(parent.$ctrlName) || mj.isNotEmpty(parent.loadFunc)){
				break;
			}
			parent = parent.$parent;
		}
		if(mj.isEmpty(parent)){
			parent=indexScope;
		}
		return parent;
	},
	layoutView : function(id) {
		var view = mj.getView(id);
		var el=null;
		if(mj.isEmpty(view)){
			el=$(document.body);
		}else{
			el=view.getElement();
		}
		var children=el.find("*[data-tag*='mj']");
		$.each(children, function(index, child) {
			var item=mj.getView($(child).attr("data-id"));
			if (mj.isNotEmpty(item)) {
				if ($.isFunction(item.layout)) {
					item.layout();
				}
			}
		});
	},

	getFirstChild : function($el, rs) {
		return $el.find(rs + ":first-child");
	},

	switchClass : function($element, oldClass, newClass) {
		$element.removeClass(oldClass);
		$element.addClass(newClass);
	},

	getBody : function() {
		if(mj.__body==null){
			mj.__body=$(document.body);
		}
		return mj.__body;
	},

	buildPre : function($target, $scope, $element, $attrs, $ctrl,$compile) {	
		$attrs.id=mj.findAttr($attrs.id,$scope);
		if (mj.isEmpty($attrs.id) || $attrs.id == "") {
			$attrs.id = mj.key();
		}
		if (mj.checkView($attrs.id)) {
			throw "[" + $attrs.id + "]：已存在，id不能重复，请检查...";
		}
		$element.attr("id", $attrs.id);
		$element.attr("data-id", $attrs.id);
		if(mj.isNotEmpty($attrs["class"])){
			var cls=$element.attr("class").split(" ");
			cls.reverse();
			$element.removeAttr("class");
			$.each(cls,function(index,item){
				$element.addClass(item);
			});
		}
		if(mj.isNotEmpty($attrs.style)){
			var sel=$element.find("[ng-transclude]");
			if(sel.length>0){
				sel.first().get(0).style.cssText=$attrs.style;
			}else{
				$element.get(0).style.cssText=$attrs.style;
			}
		}
		$scope.$inner = {
			getParentScope : function() {
				var version=angular.version;
				if(version.major==1 && version.minor==2){
					return $scope.$parent.$parent.$$childHead;
				}else{
					return $scope.$parent.$parent;
				}
			}
		};
		$scope.$outer = {
			tagName : $target.name,
			isTag : function() {
				return true;
			},
			getScope : function() {
				return $scope;
			},
			getElement : function() {
				return $element;
			},
			getAttrs : function() {
				return $attrs;
			},
			getId : function() {
				return $attrs.id;
			},
			getTagName : function() {
				return $target.name;
			},
			addChild : function(str) {
				$element.html(str);
			},
			layout :null,
			destroy : function() {
				var children = $element.find("*[data-tag*='mj']");
				for (var i = children.length - 1; i >= 0; i--) {
					var view = mj.getView($(children[i]).attr("id"));
					if (!mj.isEmpty(view)) {
						if ($.isFunction(view.destroy)) {
							view.destroy();
						}
					}
				}
				$element.remove();
				mj.delView($attrs.id);
				$scope.$destroy();
				delete $scope;
			}
		};
		$scope.$outer.attrs={};
		$.each($attrs,function(key,value){
			if(key.indexOf("$")<0){
				$scope.$outer.attrs[key]=value;
			}
		});
		mj.addView($attrs.id, $scope.$outer);
	},

	buildPost : function($target, $scope, $element, $attrs, $ctrl,$compile) {
		$scope.$outer.getParent = function() {
			return $scope.$parent.$parent.$outer;
		};
		
		/**
		 * 外部方法：获取子节点
		 */
		$scope.$outer.getChildren = function() {
			var children=[];
			if($scope.$$childHead!=null && $scope.$$childHead.$$childHead!=null){
				children.push($scope.$$childHead.$$childHead.$outer);
				var next=$scope.$$childHead.$$childHead.$$nextSibling;
				while(next!=null){
					children.push(next.$outer);
					next=next.$$nextSibling;
				}
			}
			return children;
		};
		
		$scope.$outer.compile=function(tag){
			var _dom = $compile(tag)($scope.$new());
			$element.append(_dom);
		};
	},

	buildField : function($scope, $element, $attrs,$compile) {
		$scope.$inner.label = $element.find(".mj-input-label").first();
		$scope.$inner.field = $element.find(".mj-input-field").first();
		$scope.$inner.left = $element.find(".mj-input-field-left").first();
		$scope.$inner.right = $element.find(".mj-input-field-right").first();
		$scope.$inner.tooltip;		
		$scope.$inner.tooltipOpts = {
				"position" : "bottom",
				"title" : ""
		};		
		$scope.$inner.events = {
			"blur" : {
				"before" : function() {
					$scope.$outer.validity();
			}},
			"change" : {},
			"focus" : {},
			"dblclick" : {},
			"click" : {},
			"keydown" : {},
			"keypress" : {},
			"keyup" : {},
			"mousedown" : {},
			"mouseenter" : {},
			"mouseup" : {},
			"mouseover" : {},
			"mouseout" : {},
			"mousemove" : {},
			"mouseleave" : {}
		};
		
		$scope.$outer.on = function(eventName, func) {
			$element.on(eventName, function(event) {
				if(mj.isNotEmpty($attrs.readonly) || mj.isNotEmpty($attrs.disabled)){
					return;
				}
				if ($.isFunction(func)) {
					$scope.$outer.getEvent=function(){
						return event;
					}
					func($scope.$outer);
				}
			});
		};
		/**
		 * 清空控件输入，如果有默认值就赋给默认值，没有默认值则设置为null
		 */
		$scope.$outer.reset = function(){
			if(!mj.isEmpty($attrs.value)){
				$scope.$outer.setValue($attrs.value);
			}else{
				$scope.$outer.setValue("");
			}	
			if (!mj.isEmpty($scope.$inner.tooltip)){
				$scope.$inner.tooltip.setTitle("");
			}
			$scope.$inner.field.removeClass("mj-input-validity-error");
		}
		$scope.$inner.buildOtherAttr = function() {
			
		};

		$scope.$inner.buildAttr = function() {
			if($.isEmptyObject($attrs.name)) {
				throw "name不能为空" ;
			}			
			var parent = $scope.$parent.$parent;
			var pAttrs = null;
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
				var w=parent.$inner.getColumnWidth()*parseInt($attrs.colspan,10)+"%";
				$element.css({"width":w,"float":"left"});
			} else {
				pAttrs = $attrs;
			}
			if(mj.isEmpty($attrs.label)){
				$scope.$inner.label.hide();
			}else{
				if ($attrs.required == "true"){
					$scope.$inner.label.html('&nbsp;<span class="mj-input-required">∗</span>'+$attrs.label+"：");
				}else{
					$scope.$inner.label.html($attrs.label+"：");
				}
				
				if (!mj.isEmpty(pAttrs["labelAlign"])) {
					if($attrs.layout=="horizontal"){
						$scope.$inner.label.css({
							"text-align" : pAttrs["labelAlign"]
						});
					}
				}
				if (!mj.isEmpty(pAttrs["labelWidth"])) {
					if($attrs.layout=="horizontal"){
						$scope.$inner.label.css({
							"width" : pAttrs["labelWidth"]
						});
					}
				}
			}
			if (!mj.isEmpty($attrs.placeholder)) {
				$scope.$inner.field.attr("placeholder", $attrs.placeholder);
			}			
			if (mj.isTrue($attrs.disabled)) {
				$scope.$inner.field.attr("disabled", $attrs.disabled);
			}
			if (mj.isTrue($attrs.readonly)) {
				$scope.$inner.field.attr("readonly", $attrs.readonly);
				$scope.$inner.field.addClass("mj-input-field-readonly");
			}
		
			if (mj.isTrue($attrs.hide) || mj.isTrue($attrs.hidden)) {
				$element.hide();
			}
			if(mj.isNotEmpty($attrs.height)){
				$scope.$inner.field.height($attrs.height);
			}
			if(mj.isNotEmpty($attrs.value)){
				$scope.$outer.setValue($attrs.value);
			}
			
			if(mj.isNotEmpty($attrs.border)){
				$scope.$outer.setBorder($attrs.border);
			}
			
			if(mj.isNotEmpty($attrs.labelClass)){
				$scope.$inner.label.addClass($attrs.labelClass);
			}
			
			if(mj.isNotEmpty($attrs.fieldClass)){
				$scope.$inner.field.addClass($attrs.fieldClass);
			}
			
			if(mj.isNotEmpty($attrs.editable)){
				$scope.$outer.setEditable($attrs.editable);
			}
			
			if($.isFunction($scope.$inner.buildOtherAttr)){
				$scope.$inner.buildOtherAttr();
			}
			
		};
		
		$scope.$outer.setBorder = function(flag) {
			var body=$element.find(".mj-input-body").first();
			if(mj.isTrue(flag)){
				body.removeClass("mj-input-border-none");
				$scope.$inner.label.removeClass("mj-input-border-none");
				$scope.$inner.field.removeClass("mj-input-border-none");
				$scope.$inner.left.removeClass("mj-input-border-none");
				$scope.$inner.right.removeClass("mj-input-border-none");
			}else{
				body.addClass("mj-input-border-none");
				$scope.$inner.label.addClass("mj-input-border-none");
				$scope.$inner.field.addClass("mj-input-border-none");
				$scope.$inner.left.addClass("mj-input-border-none");
				$scope.$inner.right.addClass("mj-input-border-none");
			}
		};
		

		$scope.$inner.buildEvent = function() {
			var ps = mj.findCtrlScope($scope);
			$.each($scope.$inner.events, function(key, value) {
				$scope.$inner.field.on(key, function() {
					if ($.isFunction(value.before)) {
						value.before();
					}
					if ($.isFunction($attrs[key])) {
						ps[$attrs[key]]($scope.$outer);
					}
					if ($.isFunction(value.after)) {
						value.after();
					}
				});
			});
		};

		$scope.$inner.build = function() {
			$scope.$inner.buildAttr();
			$scope.$inner.buildEvent();
		};

		$scope.$outer.getValue = function() {
			return $scope.$inner.field.val();
		};
		
		$scope.$outer.setValue = function(val) {
			$scope.$inner.field.val(val);
			$scope.$outer.validity();
		};

		$scope.$outer.getName = function() {
			return $attrs.name;
		};
		
		$scope.$outer.hide = function() {
			$element.hide();
		};

		$scope.$outer.show = function() {
			$element.show();
		};

		$scope.$outer.getType = function() {
			return $scope.$inner.field.attr("type");
		};
		
		$scope.$outer.setHeight = function(height) {
			 $scope.$inner.field.height(height);
			 $scope.$outer.layout();
		};

		$scope.$outer.getId = function() {
			return $attrs.id;
		};

		$scope.$outer.setDisabled = function(flag) {
			$attrs.disabled=flag;
			if (flag == true) {
				$scope.$inner.field.attr("disabled", "disabled");
			} else {
				$scope.$inner.field.removeAttr("disabled");
			}
			$scope.$outer.setDisabledAfter(flag);
		};
		
		$scope.$outer.setDisabledAfter = function(flag) {
			
		};

		$scope.$outer.setReadonly = function(flag) {
			$attrs.readonly=flag;
			if(mj.isTrue($attrs.disabled)){
				return;
			}
			if (flag == true) {
				$scope.$inner.field.attr("disabled", "disabled");
				$scope.$inner.field.addClass("mj-input-field-readonly");
			} else {
				$scope.$inner.field.removeAttr("disabled");
				$scope.$inner.field.removeClass("mj-input-field-readonly");
			}
			$scope.$outer.setReadonlyAfter(flag);
		};
		
		$scope.$outer.setReadonlyAfter = function(flag) {
			
		};
		
		$scope.$inner.buildEditable=function(){};
		
		$scope.$outer.setEditable = function(editable) {
			$attrs.editable=editable;
			if(mj.isFalse(editable)){
				$scope.$outer.setBorder(false);
				$scope.$outer.setReadonly(true);
				$element.removeClass("mj-input-model-view");
				$element.addClass("mj-input-model-view");
				$scope.$inner.field.removeClass("mj-input-validity-error");
			}else{
				$scope.$outer.setBorder(true);
				$scope.$outer.setReadonly(false);
				$element.removeClass("mj-input-model-view");
			}
			$scope.$inner.buildEditable(editable);
			mj.layoutView($attrs.id);
		};
		
		$scope.$outer.layout = function() {
		};
		

		$scope.$outer.validity = function() {
			if(mj.isTrue($attrs.readonly) && mj.isTrue($attrs.disabled)){
				return true;
			}
			var flag = true;
			if (mj.isEmpty($scope.$inner.tooltip)){
				$scope.$inner.tooltip = mj.buildTooltip($scope.$inner.field,$scope.$inner.tooltipOpts);
			}
			flag = $scope.$inner.checkEmpty();			
			if (flag) {
				flag = $scope.$inner.checkFormat();
				if (flag) {
					flag = $scope.$inner.checkMin();
					if (flag) {
						flag = $scope.$inner.checkMax();
					}
				}
			}
			if (flag) {
				if (!mj.isEmpty($scope.$inner.tooltip)){
					$scope.$inner.tooltip.setTitle("");
				}
				$scope.$inner.field.removeAttr("title");
				$scope.$inner.field.removeClass("mj-input-validity-error");
			}
			return flag;
		};

		$scope.$inner.checkEmpty = function() {
			var flag = true;
			if ($attrs.required == "true") {
				var value=$scope.$outer.getValue();
				if (mj.isEmpty($scope.$outer.getValue())) {
					$scope.$inner.field.addClass("mj-input-validity-error");
					var label = "";
					if(mj.isNotEmpty($attrs.label)){
						label = $attrs.label;
					}
					$scope.$inner.tooltip.setTitle(label + "不能为空");
					flag = false;
				}
			}
			return flag;
		};
		
		$scope.$inner.checkType = function() {
			return true;
		};
		
		$scope.$inner.checkPattern = function() {
			var flag = true;
			if (!mj.isEmpty($attrs.pattern)) {
				var pattern = new RegExp($attrs.pattern);
				if (!pattern.test($scope.$outer.getValue())) {
					$scope.$inner.field.addClass("mj-input-validity-error");
					var label = "";
					if(mj.isNotEmpty($attrs.label)){
						label = $attrs.label;
					}
					$scope.$inner.tooltip.setTitle(label + " 格式错误");
					flag = false;
				}
			}
			return flag;
		};


		$scope.$inner.checkFormat = function() {
			var flag = $scope.$inner.checkPattern();
			if (flag) {
				if($.isFunction($scope.$inner.checkType)){
					flag =$scope.$inner.checkType();
				}
			}
			return flag;
		};

		$scope.$inner.checkMin = function() {
			var flag = true;
			if ($.isNumeric($attrs.min)) {
				if (mj.getLength($scope.$outer.getValue()) < $attrs.min) {
					$scope.$inner.field.addClass("mj-input-validity-error");
					var label = "";
					if(mj.isNotEmpty($attrs.label)){
						label = $attrs.label;
					}
					$scope.$inner.tooltip.setTitle(label + " 长度不能小于" + $attrs.min);
					flag = false;
				}
			}
			return flag;
		};

		$scope.$inner.checkMax = function() {
			var flag = true;
			if ($.isNumeric($attrs.max)) {
				if (mj.getLength($scope.$outer.getValue()) > $attrs.max) {
					$scope.$inner.field.addClass("mj-input-validity-error");
					var label = "";
					if(mj.isNotEmpty($attrs.label)){
						label = $attrs.label;
					}
					$scope.$inner.tooltip.setTitle(label + " 长度不能大于" + $attrs.max);
					flag = false;
				}
			}
			return flag;
		};
		
		/**
		 * 外部方法：增加左侧标签
		 */
		$scope.$outer.addLeft = function(opt) {
			var tag=mj.buildFieldLeft(opt);
			$scope.$inner.left.append(tag);
			var _dom = $compile(tag)($scope.$new());
			return mj.getView(_dom.attr("id"));
		};
		
		/**
		 * 外部方法：增加右侧标签
		 */
		$scope.$outer.addRight = function(opt) {
			var tag=mj.buildFieldRight(opt);
			$scope.$inner.right.append(tag);
			var _dom = $compile(tag)($scope.$new());
			return mj.getView(_dom.attr("id"));
		};
	},


	buildDirective : function(opts) {
		return $.extend(true, {
			restrict : 'E',
			replace : mj.params.replace,
			transclude : mj.params.transclude,
			// bindToController : true,
			scope : {

			},
			// template : cfg.template,
			template : function($element, $attrs) {
				return mj.templates[opts.name];
			},
			controllerAs : "$$ctrl",
			controller : function($scope, $element, $attrs, $transclude) {
			},
		}, opts);
	},
	
	buildFieldDirective : function(opts) {
		return $.extend(true, {
			restrict : 'E',
			replace : mj.params.replace,
			transclude: {
	            'left': '?mjFieldLeft',
	            'right': '?mjFieldRight'
	        },
			template : function($element, $attrs) {
				var parent = $element.parent();
				var template=$(mj.templates[opts.name]);
				if (parent.is("mj-form") || $attrs.form == "true" || $attrs.form == true) {
					if(parent.attr("data-layout")!="vertical"){
						$attrs.layout="horizontal";
						template.attr("data-layout","horizontal");
						$element.attr("data-layout","horizontal");
					}
				}
				if($attrs.layout=="horizontal"){
					var vlable=template.find(".mj-input-label").first();
					vlable.remove();
					var label=$("<div></div>");
					label.addClass("mj-input-cell");
					label.addClass("mj-input-label");
					label.addClass("mj-input-label-h");
					template.find(".mj-input-row").first().prepend(label);
				}
				return mj.getHtml(template);
			},
			scope : {

			},
			controllerAs : "$$ctrl",
			controller : function($scope, $element, $attrs, $transclude) {
			},
		}, opts);
	},
	
	isJson : function(obj) {  
	    var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;   
	    return isjson;  
	},
	startWith:function(source,str){ 
		var reg=new RegExp("^"+str); 
		return reg.test(source); 
	} ,
	endWith:function(source,str){ 
		var reg=new RegExp(str+"$"); 
		return reg.test(source); 
	},
	isTag:function(tagName,obj){
		if(!mj.startWith(tagName,"mj-")){
			return false;
		}
		if ((obj instanceof $) && obj.is(buttonName)) {
			return true;
		}else{
			return false;
		}
	}
};

for(var i=1;i<=100;i++){
	mj.__key.push(i);
};

mj.module.config(function($controllerProvider, $compileProvider, $filterProvider, $provide) {
	mj.provider = {
	    controller: $controllerProvider.register,
	    directive: $compileProvider.directive,
	    filter: $filterProvider.register,
	    factory: $provide.factory,
	    service: $provide.service
	  };
});


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
Date.prototype.format = function (fmt) { // author: meizz
var o = {
  "M+": this.getMonth() + 1, // 月份
  "d+": this.getDate(), // 日
  "h+": this.getHours(), // 小时
  "m+": this.getMinutes(), // 分
  "s+": this.getSeconds(), // 秒
  "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
  "S": this.getMilliseconds() // 毫秒
};
if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
for (var k in o)
if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
return fmt;
}
String.prototype.toDate = function (fmt) {  
 if (fmt == null) fmt = 'yyyy-MM-dd hh:mm:ss';  
 var str = this;  
 if(fmt == "yyyyMMdd") {
 	return new Date(str.substr(0,4),str.substr(4,2)-1,str.substr(6,2));
 }
 // fmt为日期格式,str为日期字符串
 var reg = /([yMdhmsS]+)/g;// 日期格式中的字符
 var key = {};  
 var tmpkeys = fmt.match(reg);  
 for (var i = 0 ; i < tmpkeys.length; i++) {  
     key[tmpkeys[i].substr(0, 1)] = i + 1;  
 }
 var r = str.match(fmt.replace(reg, "(\\d+)"));  
 var ddd = new Date(r[key["y"]], r[key["M"]] - 1, r[key["d"]], r[key["h"]]==null?0:r[key["h"]], r[key["m"]]==null?0:r[key["m"]], r[key["s"]]==null?0:r[key["s"]]);
 return ddd;  
}
/*
 * replaceAll
 */
String.prototype.replaceAll = function(s1,s2){     
 return this.replace(new RegExp(s1,"gm"),s2);     
}
// 给数字字符串补零，不支持负数
String.prototype.lpad = function(fill) {
	var str = this;
 var len = ('' + str).length;
 return (Array(
     fill > len ? fill - len + 1 || 0 : 0
 ).join(0) + str);
}


mj.formatNumber = function(num, pattern) {
	var strarr = num ? num.toString().split('.') : [ '0' ];
	var fmtarr = pattern ? pattern.split('.') : [ '' ];
	var retstr = '';

	// 整数部分
	var str = strarr[0];
	var fmt = fmtarr[0];
	var i = str.length - 1;
	var comma = false;
	for (var f = fmt.length - 1; f >= 0; f--) {
		switch (fmt.substr(f, 1)) {
		case '#':
			if (i >= 0)
				retstr = str.substr(i--, 1) + retstr;
			break;
		case '0':
			if (i >= 0)
				retstr = str.substr(i--, 1) + retstr;
			else
				retstr = '0' + retstr;
			break;
		case ',':
			comma = true;
			retstr = ',' + retstr;
			break;
		}
	}
	if (i >= 0) {
		if (comma) {
			var l = str.length;
			for (; i >= 0; i--) {
				retstr = str.substr(i, 1) + retstr;
				if (i > 0 && ((l - i) % 3) == 0)
					retstr = ',' + retstr;
			}
		} else
			retstr = str.substr(0, i + 1) + retstr;
	}

	retstr = retstr + '.';
	// 处理小数部分
	str = strarr.length > 1 ? strarr[1] : '';
	fmt = fmtarr.length > 1 ? fmtarr[1] : '';
	i = 0;
	for (var f = 0; f < fmt.length; f++) {
		switch (fmt.substr(f, 1)) {
		case '#':
			if (i < str.length)
				retstr += str.substr(i++, 1);
			break;
		case '0':
			if (i < str.length)
				retstr += str.substr(i++, 1);
			else
				retstr += '0';
			break;
		}
	}
	return retstr.replace(/^,+/, '').replace(/\.$/, '');
}

mj.formatData = function(strTime,pattern) {
	var reg = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))(\s(([01]\d{1})|(2[0123])):([0-5]\d):([0-5]\d))?$/;
	var dataStr = "";
	try {					
		if ($.isNumeric(strTime)) {
			var newDate = new Date();
			newDate.setTime(strTime);
			dataStr = newDate.format(pattern);
		} else {
			dataStr = strTime.toDate(pattern).format(pattern);	
		}			
	} catch(e){				
	}	
	if (!reg.test(dataStr)) {
		return strTime
	} else {
		return dataStr;
	}
}

$.fn.extend({
 mousewheel: function( fn ){
     // judge the brower's mousewheel event, bind the event to element
     var toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
             ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];
        var el = this[0];            // this[0]; jquery对象 转
										// JS对象(因addEventListener是JS对象的监听事件)
     if( el.addEventListener ){    
        for( var i = toBind.length; i; ){
            el.addEventListener(toBind[--i],handleFun,false);
        }
     }
     else {
         el.onmousewheel = handleFun;
     }

     // deal with the mousewheel
     function handleFun(e){
        var driect = 0, delta=0;    // driect:滚动方向 delta:各浏览器监听滚动事件的属性值
        var e = e || window.event;
        if ( e.wheelDelta ){ delta = e.wheelDelta }
        else if ( e.deltaY     ){ delta = e.deltaY * -1 }
        else if( e.wheelDeltaY ) { delta = e.wheelDeltaY }
        else { 
                console.log('get delta,have somethings wrong...');
        }
        delta==0 ? console.log('get delta,have somethings wrong...') :
        delta>0     ? driect=1 : driect=-1;    

        typeof fn==='function' ? fn( $(el) ,driect ) : '';
     }
 }

});

mj.templates = {
	"mjViewport" : '<div data-tag="mjViewport" class="mj-viewport" ng-transclude></div>',
	"mjInclude" : '<div data-tag="mjInclude" class="mj-include"></div>',
	"mjMash" : '<div data-tag="mjMash" class="mj-mash"></div>',
	"mjView" : '<div data-tag="mjView" class="mj-view" ng-transclude></div>',
	"mjVbox" : '<div data-tag="mjVbox" class="mj-vbox" ng-transclude></div>',
	"mjVboxItem" : '<div data-tag="mjVboxItem" class="mj-vbox-row"><div class="mj-vbox-cell"><div class="mj-vbox-scroll" ng-transclude></div></div></div>',
	"mjVboxSplit" : '<div data-tag="mjVboxSplit" class="mj-vbox-row"><div class="mj-vbox-split">&nbsp;</div></div>',
	"mjHbox" : '<div data-tag="mjHbox" class="mj-hbox"><div class="mj-hbox-row" ng-transclude></div></div>',
	"mjHboxItem" : '<div data-tag="mjHboxItem" class="mj-hbox-cell"><div class="mj-hbox-scroll" ng-transclude></div></div>',
	"mjHboxSplit" : '<div data-tag="mjHboxSplit" class="mj-hbox-split">&nbsp;</div>',
	"mjPanel" : '<div data-tag="mjPanel" class="mj-panel" ng-transclude></div>',
	"mjPanelHead" : '<div data-tag="mjPanelHead" class="mj-panel-row"><div class="mj-panel-head" ng-transclude></div></div>',
	"mjPanelBody" : '<div data-tag="mjPanelBody" class="mj-panel-row"><div class="mj-panel-body"><div class="mj-panel-body-scroll" ng-transclude></div></div></div>',
	"mjPanelFoot" : '<div data-tag="mjPanelFoot" class="mj-panel-row"><div class="mj-panel-foot" ng-transclude></div></div>',
	"mjPopup" : '<div data-tag="mjPopup" class="mj-popup mj-popup-in"><div class="mj-popup-body"></div></div>',
	"mjForm" : '<form data-tag="mjForm" class="mj-form"><div class="mj-form-body" ng-transclude></div></form>',
	"mjFieldLeft" : '<div data-tag="mjFieldLeft" class="mj-field-left" ng-transclude></div>',
	"mjFieldRight" : '<div data-tag="mjFieldRight" class="mj-field-right" ng-transclude></div>',
	"mjText" : '<div data-tag="mjText" class="mj-input"><div class="mj-input-label"></div><div class="mj-input-body"><div class="mj-input-table"><div class="mj-input-row"><div class="mj-input-field-left" ng-transclude="left"></div><div class="mj-input-field-body mj-input-cell"><input class="mj-input-field" type="text"></input></div><div class="mj-input-field-right" ng-transclude="right"></div></div></div></div></div>',
	"mjUrl" : '<div data-tag="mjUrl" class="mj-input"><div class="mj-input-label"></div><div class="mj-input-body"><div class="mj-input-table"><div class="mj-input-row"><div class="mj-input-field-left" ng-transclude="left"></div><div class="mj-input-field-body mj-input-cell"><input class=" mj-input-field" type="text" data-role="show"></input></div><div class="mj-input-field-right" ng-transclude="right"></div></div></div></div></div>',
	"mjEmail" : '<div data-tag="mjEmail" class="mj-input"><div class="mj-input-label"></div><div class="mj-input-body"><div class="mj-input-table"><div class="mj-input-row"><div class="mj-input-field-left" ng-transclude="left"></div><div class="mj-input-field-body mj-input-cell"><input class="mj-input-field" type="text" ></input></div><div class="mj-input-field-right" ng-transclude="right"></div></div></div></div></div>',
	"mjTelephone" : '<div data-tag="mjTelephone" class="mj-input"><div class="mj-input-label"></div><div class="mj-input-body"><div class="mj-input-table"><div class="mj-input-row"><div class="mj-input-field-left" ng-transclude="left"></div><div class="mj-input-field-body mj-input-cell"><input class="mj-input-field" type="text"></input></div><div class="mj-input-field-right" ng-transclude="right"></div></div></div></div></div>',
	"mjNumber" : '<div data-tag="mjNumber" class="mj-input"><div class="mj-input-label"></div><div class="mj-input-body"><div class="mj-input-table"><div class="mj-input-row"><div class="mj-input-field-left" ng-transclude="left"></div><div class="mj-input-field-body mj-input-cell"><input class="mj-input-field mj-input-field-number" type="text"></input></div><div class="mj-input-cell mj-input-field-number-minus"><i class="fa fa-plus"></i></div><div class="mj-input-cell mj-input-field-number-plus"><i class="fa fa-minus"></i></div><div class="mj-input-field-right" ng-transclude="right"></div></div></div></div></div>',
	"mjFile" : '<div data-tag="mjFile" class="mj-input"><div class="mj-input-label"></div><div class="mj-input-body"><div class="mj-input-table"><div class="mj-input-row"><div class="mj-input-field-left" ng-transclude="left"></div><div class="mj-input-field-body mj-input-cell"><input type="file" class="mj-input-field-file-display"></input><input readonly="readonly" class="mj-input-field" placeholder="请点击选择上传文件"></input></div><div class="mj-input-cell mj-input-field-file-progress">未选择文件</div><div class="mj-input-cell mj-input-field-file-button"><i class="fa fa-upload"></i></div><div class="mj-input-field-right" ng-transclude="right"></div></div></div></div></div>',
	"mjPassword" : '<div data-tag="mjPassword" class="mj-input"><div class="mj-input-label"></div><div class="mj-input-body"><div class="mj-input-table"><div class="mj-input-row"><div class="mj-input-field-left" ng-transclude="left"></div><div class="mj-input-field-body mj-input-cell"><input class="mj-input-field" type="password"></input></div><div class="mj-input-field-right" ng-transclude="right"></div></div></div></div></div>',
	"mjTextarea" : '<div data-tag="mjTextarea" class="mj-input"><div class="mj-input-label"></div><div class="mj-input-body"><div class="mj-input-table"><div class="mj-input-row"><div class="mj-input-field-left" ng-transclude="left"></div><div class="mj-input-field-body mj-input-cell"><textarea type="textarea" class="mj-input-field mj-input-field-textarea"></textarea></div><div class="mj-input-field-right" ng-transclude="right"></div></div></div></div></div>',
	"mjSelect" : '<div data-tag="mjSelect" class="mj-input" data-readonly="true"><div class="mj-input-label"></div><div class="mj-input-body"><div class="mj-input-table"><div class="mj-input-row"><div class="mj-input-field-left" ng-transclude="left"></div><div class="mj-input-field-body mj-input-cell"><input type="text" class="mj-input-field"></input></div><div class="mj-input-cell mj-input-field-select-arrow"><i class="fa fa-chevron-down" aria-hidden="true"></i></div><div class="mj-input-field-right" ng-transclude="right"></div></div></div></div></div>',
	"mjSelectItem" : '<li data-tag="mjSelectItem" class="mj-input-field-select-item"><span class="mj-input-field-select-item-icon fa"></span><span class="mj-input-field-select-item-text"></span></li>',
	"mjSelectTree" : '<div data-tag="mjSelectTree" class="mj-input" data-readonly="true"><div class="mj-input-label"></div><div class="mj-input-body"><div class="mj-input-table"><div class="mj-input-row"><div class="mj-input-field-left" ng-transclude="left"></div><div class="mj-input-field-body mj-input-cell"><input type="text" class="mj-input-field"></input></div><div class="mj-input-cell mj-input-field-select-arrow"><i class="fa fa-chevron-down" aria-hidden="true"></i></div><div class="mj-input-field-right" ng-transclude="right"></div></div></div></div></div>',
	"mjCheckbox" : '<div data-tag="mjCheckbox" class="mj-input"><div class="mj-input-label"></div><div class="mj-input-body"><div class="mj-input-table"><div class="mj-input-row"><div class="mj-input-field-left" ng-transclude="left"></div><div class="mj-input-field-body mj-input-cell"><div class="mj-input-field">&nbsp;</div></div><div class="mj-input-field-right" ng-transclude="right"></div></div></div></div></div>',
	"mjCheckboxItem" : '<label class="mj-input-field-box"><input type="checkbox"></label>',
	"mjRadio" : '<div data-tag="mjRadio" class="mj-input"><div class="mj-input-label"></div><div class="mj-input-body"><div class="mj-input-table"><div class="mj-input-row"><div class="mj-input-field-left" ng-transclude="left"></div><div class="mj-input-field-body mj-input-cell"><div class="mj-input-field">&nbsp;</div></div><div class="mj-input-field-right" ng-transclude="right"></div></div></div></div></div>',
	"mjRadioItem" : '<label class="mj-input-field-box"><input type="radio"></label>',
	"mjDate" : '<div data-tag="mjDate" class="mj-input"><div class="mj-input-label"></div><div class="mj-input-body"><div class="mj-input-table"><div class="mj-input-row"><div class="mj-input-field-left" ng-transclude="left"></div><div class="mj-input-field-body mj-input-cell"><input class="mj-input-field" type="text"></input></div><div class="mj-input-field-right" ng-transclude="right"></div></div></div></div></div>',
	"mjDateBox" : '<div data-tag="mjDateBox" class="mj-date-box"><div class="mj-date-title"><div class="mj-date-prevyear"><i class="fa fa-angle-double-left"></i></div><div class="mj-date-prevmonth"><i class="fa fa-angle-left"></i></div><div class="mj-date-month"></div><div class="mj-date-year"></div><div class="mj-date-nextmonth"><i class="fa fa-angle-right"></i></div><div class="mj-date-nextyear"><i class="fa fa-angle-double-right"></i></div></div><div class="mj-date-week"><div class="mj-date-wdate">日</div><div class="mj-date-wdate">一</div><div class="mj-date-wdate">二</div><div class="mj-date-wdate">三</div><div class="mj-date-wdate">四</div><div class="mj-date-wdate">五</div><div class="mj-date-wdate">六</div></div><div class="mj-date-con mj-date-clearfix"></div><div class="mj-date-btns"></div></div>',
	"mjRater" : '<div data-tag="mjRater" class="mj-input"><div class="mj-input-label"></div><div class="mj-input-body"><div class="mj-input-table"><div class="mj-input-row"><div class="mj-input-field-left" ng-transclude="left"></div><div class="mj-input-field-body mj-input-cell"><div class="mj-input-field"></div></div><div class="mj-input-field-right" ng-transclude="right"></div></div></div></div></div>',
	"mjSlider" : '<div data-tag="mjSlider" class="mj-input"><div class="mj-input-label"></div><div class="mj-input-body"><div class="mj-input-table"><div class="mj-input-row"><div class="mj-input-field-left" ng-transclude="left"></div><div class="mj-input-field-body mj-input-cell"><div class="mj-input-field mj-input-field-slider"><div class="mj-input-field-slider-ruler"><div class="mj-input-field-slider-pointer"></div></div></div></div><div class="mj-input-field-right" ng-transclude="right"></div></div></div></div></div>',
	
	"mjButton" : '<div data-tag="mjButton" type="button" class="mj-button"><div class="mj-button-button"></div><div class="mj-button-child" ng-transclude></div></div>',
	"mjButtonGroup" : '<div data-tag="mjButtonGroup" class="mj-button-group" ng-transclude></div>',
	"mjButtonMenu" : '<ul data-tag="mjButtonMenu" class="mj-button-menu" ng-transclude></ul>',
	"mjButtonMenuItem" : '<li data-tag="mjButtonMenuItem" class="mj-button-menu-item"><span class="mj-button-menu-icon"></span><span class="mj-button-menu-text"></span></li>',
	"mjButtonMenuSplitter" : '<li role="separator" class="divider"></li>',
	"mjTab" : '<div data-tag="mjTab" class="mj-tab"><div data-tag="mjTabHead" class="mj-tab-row"><div class="mj-tab-head"><div class="mj-tab-head-table"><div class="mj-tab-row"><div class="mj-tab-head-table-left"><div class="mj-tab-head-content"></div></div><div class="mj-tab-head-table-right"><button class="mj-tab-title-button mj-tab-switch-left fa fa-chevron-left"></button><button class="mj-tab-title-button mj-tab-switch-right fa fa-chevron-right"></button></div></div></div></div></div><div data-tag="mjTabBody" class="mj-tab-row"><div class="mj-tab-body"  ng-transclude></div></div></div>',
	"mjTabItem" : '<div data-tag="mjTabItem" class="mj-tab-item" ng-transclude></div>',
	"mjTree" : '<div data-tag="mjTree" class="mj-tree"></div>',
	"mjTreeItem" : '<div data-tag="mjTreeItem" class="mj-tree-row"><div class="mj-tree-cell"><span class="mj-tree-elbow fa"></span><span class="mj-tree-icon fa"></span><span class="mj-tree-text"></span></div></div>',
	"mjTable" : '<div data-tag="mjTable" class="mj-table" ng-transclude></div>',
	"mjTableToolbar" : '<div data-tag="mjTableToolbar" class="mj-table-row"><div class="mj-table-toolbar" ng-transclude></div></div>',
	"mjTableColumns" : '<div data-tag="mjTableColumns" class="mj-table-columns" ng-transclude></div>',
	"mjTableColumn" : '<div data-tag="mjTableColumn"></div>',
	"mjTableHead" : '<div data-tag="mjTableHead" class="mj-table-row"><div class="mj-table-head"><div class="mj-table-head-content"><table class="mj-table-hd-table"><tbody class="mj-table-hd-tbody"></tbody></table></div></div></div>',
	"mjTableFoot" : '<div data-tag="mjTableFoot" class="mj-table-row"><div class="mj-table-foot"><div class="mj-button-group" style="float:left;"></div><span class="mj-table-total"></span></div></div>',
	"mjTableBody" : '<div data-tag="mjTableBody" class="mj-table-row"><div class="mj-table-body"><div class="mj-table-body-content"><table class="mj-table-bd-table"><tbody class="mj-table-bd-tbody"></tbody></table></div></div></div>',
	"mjTableButton" : '<button type="button" class="btn btn-default"></button>',
	"mjTableLoading":'<div class="mj-table-loading"><span class="mj-table-loading-content fa fa-spinner">&nbsp;数据加载中...</span></div>',
	"mjLayout" : '<div data-tag="mjLayout" class="mj-layout"><div class="mj-layout-row" style="display:none;"><div class="mj-layout-north" ng-transclude="north"></div></div><div class="mj-layout-row" style="display:none;"><div class="mj-layout-split mj-layout-split-h"><span class="mj-layout-switch mj-layout-split-h-switch fa fa-caret-up"></span></div></div><div class="mj-layout-row"><div class="mj-layout-body"><div class="mj-layout"><div class="mj-layout-row mj-layout-body-row"><div class="mj-layout-west" style="display:none;" ng-transclude="west"></div><div class="mj-layout-split mj-layout-split-v" style="display:none;"><span class="mj-layout-switch mj-layout-split-v-switch fa fa-caret-left"></span></div><div class="mj-layout-center" ng-transclude="center"></div><div class="mj-layout-split mj-layout-split-v" style="display:none;"><span class="mj-layout-switch mj-layout-split-v-switch fa fa-caret-right" style="display:none;"></span></div><div class="mj-layout-east" ng-transclude="east" style="display:none;"></div></div></div></div></div><div class="mj-layout-row" style="display:none;"><div class="mj-layout-split mj-layout-split-h"><span class="mj-layout-switch mj-layout-split-h-switch fa fa-caret-down"></span></div></div><div class="mj-layout-row" style="display:none;"><div class="mj-layout-south" ng-transclude="south"></div></div></div>',
	"mjLayoutNorth" : '<div data-tag="mjLayoutNorth" class="mj-layout-scroll" ng-transclude></div>',
	"mjLayoutSouth" : '<div data-tag="mjLayoutSouth" class="mj-layout-scroll" ng-transclude></div>',
	"mjLayoutEast" : '<div data-tag="mjLayoutEast" class="mj-layout-scroll" ng-transclude></div>',
	"mjLayoutWest" : '<div data-tag="mjLayoutWest" class="mj-layout-scroll" ng-transclude></div>',
	"mjLayoutCenter" : '<div data-tag="mjLayoutCenter" class="mj-layout-scroll" ng-transclude></div>',
	"mjAlert" : '<div data-tag="mjAlert" class="mj-alert"><div data-tag="mjAlertHead" class="mj-alert-row"><div class="mj-alert-head"></div></div><div data-tag="mjAlertBody" class="mj-alert-row"><div class="mj-alert-body"></div></div><div data-tag="mjAlertFoot" class="mj-alert-row"><div class="mj-alert-foot"><div class="mj-button mj-button-default mj-alert-button"><div class="mj-button-button"><span class="mj-button-button-icon fa fa-check"></span><a href="#" class="mj-button-button-text">确定</a></div></div></div></div></div>',
	"mjConfirm" : '<div data-tag="mjConfirm" class="mj-confirm"><div data-tag="mjConfirmHead" class="mj-confirm-row"><div class="mj-confirm-head"></div></div><div data-tag="mjConfirmBody" class="mj-confirm-row"><div class="mj-confirm-body"></div></div><div data-tag="mjConfrimFoot" class="mj-confirm-row"><div class="mj-confirm-foot"><div class="mj-button mj-button-default mj-confirm-button mj-confirm-yes"><div class="mj-button-button"><span class="mj-button-button-icon fa fa-check"></span><a href="#" class="mj-button-button-text">确定</a></div></div><div class="mj-button mj-button-default mj-confirm-button mj-confirm-no"><div class="mj-button-button"><span class="mj-button-button-icon fa fa-close"></span><a href="#" class="mj-button-button-text">取消</a></div></div></div></div></div>',
	"mjLoading" : '<div data-tag="mjLoading" class="mj-loading"><div data-tag="mjLoadingHead" class="mj-loading-row"><div class="mj-loading-head"></div></div><div data-tag="mjLoadingBody" class="mj-loading-row"><div class="mj-loading-body"></div></div></div>',
	"mjWindowInclude" : '<div data-tag="mjInclude" class="mj-include"></div>',
	"mjWindow" : '<div data-tag="mjWindow" class="mj-window"><div data-tag="mjWindowHead" class="mj-window-row"><div class="mj-window-head"></div></div><div data-tag="mjWindowBody" class="mj-window-row"><div class="mj-window-body"><div class="mj-window-content"></div></div></div></div>',
	"mjToolbar" : '<div data-tag="mjToolbar" class="mj-toolbar"><div class="mj-toolbar-row" ng-transclude></div></div>',
	"mjToolbarItem" : '<div data-tag="mjToolbarItem" class="mj-toolbar-item" ng-transclude></div>',
	"mjMenu" : '<div data-tag="mjMenu" class="mj-menu"></div>',
	"mjMenuItem" : '<div data-tag="mjMenuItem" class="mj-menu-row"><div class="mj-menu-cell"><span class="mj-menu-elbow fa"></span><span class="mj-menu-icon fa"></span><span class="mj-menu-fa fa"></span><span class="mj-menu-text"></span></div></div>',
	"mjCard" : '<div class="mj-card"><div class="mj-card-row"><div class="mj-card-thumbnail"><img class="mj-card-image"/><div class="caption"></div></div></div></div>',
	"mjChart" : '<div class="mj-chart"></div>',
	"mjGrid" : '<div data-tag="mjGrid" class="mj-grid" ng-transclude></div>',
	"mjGridItem" : '<div data-tag="mjGridItem" class="mj-grid-item" ng-transclude></div>',
	"mjTooltip"	 : '<div data-tag="mjTooltip" class="mj-tooltip mj-tooltip-fade mj-tooltip-in"><div class="mj-tooltip-arrow"></div><div class="mj-tooltip-inner"></div></div>',
	"mjList" : '<div data-tag="mjList" class="mj-list"><div class="mj-list-body"><div class="mj-list-scroll"><div class="mj-list-table" ng-transclude></div></div></div></div>',
	"mjListItem" : '<div data-tag="mjListItem" class="mj-list-table-row"><div class="mj-list-table-cell" ng-transclude></div></div>',
	"mjMarquee" : '<div data-tag="mjMarquee" class="mj-marquee"><div class="mj-marquee-center" ng-transclude></div><div class="mj-marquee-left"><span class="fa fa-chevron-left"></span></div><div class="mj-marquee-right"><span class="fa fa-chevron-right"></span></div><div class="mj-marquee-bottom"></div></div>',
	"mjMarqueeItem" : '<div data-tag="mjMarqueeItem" class="mj-marquee-item" ng-transclude></div>',
	"mjFrame" : '<iframe data-tag="mjFrame" marginheight="0" marginwidth ="0" scrolling="no" frameborder="0" width="100%" height="100%" src="" align="middle"></iframe>'
};


/**
 * 
 */
mj.view.alert = function(options) {
	mj.addView("mj-alert", this);
	this.options = options;
	this.close = function() {
		this.__inner.view.remove();
		this.__inner.mash.remove();
		mj.delView("mj-alert");
	}
};
mj.view.alert.prototype = {
	__inner : {},
	__build : function() {
		this.__buildOption();
		this.__buildMask();
		this.__inner.view = $(mj.templates.mjAlert);
		this.__inner.head = this.__inner.view.find(".mj-alert-head:first-child");
		this.__inner.body = this.__inner.view.find(".mj-alert-body:first-child");
		this.__inner.foot = this.__inner.view.find(".mj-alert-foot:first-child");
		this.__buildView();
	},
	__buildOption : function() {
		this.__opts = {
			"title" : "系统提示",
			"width" : "300px",
			"height" : "120px",
			"level" : "info",
			"icon" : "",
			"horizontal" : "left",
			"vertical" : "middle",
			"content" : "...",
			"handler" : null,
			"closable" : true
		};
		$.extend(true, this.__opts, this.options);
		delete this.options;
	},
	__buildView : function() {
		var dom = mj.getBody();
		dom.append(this.__inner.view);
		this.__inner.view.css({
			"width" : this.__opts.width,
			"height" : this.__opts.height
		});

		var h = (dom.height() - this.__inner.view.height()) / 2;
		var w = (dom.width() - this.__inner.view.width()) / 2;
		this.__inner.view.css({
			"top" : h,
			"left" : w,
			"z-index" : mj.getIndex()
		});
		this.__buildHead();
		this.__buildBody();
		this.__buildFoot();
	},

	__buildHead : function() {
		var title = $('<span class="mj-alert-head-text"></span>');
		title.text(this.__opts.title);
		this.__inner.head.append(this.__buildLevel());
		this.__inner.head.append(title);
	},

	__buildFoot : function() {
		var _this = this;
		var button = $(".mj-alert-button:first-child");
		button.on("click", function() {
			_this.close();
			if ($.isFunction(_this.__opts.handler)) {
				_this.__opts.handler();
			}
		});
		button.focus();
	},

	__buildBody : function() {
		this.__inner.body.html(this.__opts.content);
		this.__inner.body.css({
			"text-align" : this.__opts.horizontal,
			"vertical-align" : this.__opts.vertical
		});
	},

	__buildLevel : function() {
		var level = $('<span class="mj-alert-head-icon"></span>');
		switch (this.__opts.level) {
		case "help":
			level.addClass("fa fa-question-circle-o mj-color-help");
			break;
		case "info":
			level.addClass("fa fa-info-circle mj-color-info");
			break;
		case "warn":
			level.addClass("fa fa-exclamation-triangle mj-color-warn");
			break;
		case "error":
			level.addClass("fa fa-times mj-color-error");
			break;
		default:
			level.addClass("fa fa-info-circle mj-color-info");
		}
		return level;
	},

	__buildMask : function() {
		this.__inner.mash = $(mj.templates.mjMash);
		this.__inner.mash.css({
			"z-index" : mj.getIndex()
		});
		mj.getBody().append(this.__inner.mash);
	},
	__open : function() {
		this.__inner.view.remove();
		this.__inner.mash.remove();
		mj.delView(this.__opts.id);
	}
};

mj.buildAlert = function(options) {
	if (mj.checkView("mj-alert")) {
		return;
	}
	var win = new mj.view.alert(options);
	win.__build();
	return win;
}/**
 * 
 */

mj.module.directive('mjButton', function($compile) {
	return mj.buildDirective({
		name : "mjButton",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.children = [];
					$scope.$inner.addChild = function(sc, el, rs) {
						$scope.$inner.children.push({
							"sc" : sc,
							"el" : el,
							"rs" : rs
						});
					};
					$scope.$inner.selectedItem = null;
					$scope.$inner.button = $element.find(".mj-button-button").first();
					$scope.$inner.text = null;
					$scope.$inner.skinJson = {
						"default" : "mj-button-default",
						"matter" : "mj-button-matter"
					};

					$scope.$inner.setSkin = function() {
						var skin = $scope.$inner.skinJson["default"];
						if (mj.isNotEmpty($scope.$inner.skinJson[$attrs.skin])) {
							skin = $scope.$inner.skinJson[$attrs.skin];
						}
						$element.addClass(skin);
					};

					$scope.$inner.init = function() {
						$scope.$inner.setSkin();
						if (mj.isTrue($attrs.disabled)) {
							$element.addClass("mj-button-disabled");
						}
						if (mj.isTrue($attrs.hidden)) {
							$element.hide();
						}
						if (mj.isNotEmpty($attrs.width)) {
							$element.css({
								"width" : $attrs.width
							});
						}
						
						if (mj.isNotEmpty($attrs.icon)) {
							var icon = $("<span>");
							icon.addClass("mj-button-button-icon");
							icon.addClass($attrs.icon);
							$scope.$inner.button.append(icon);
						}

						$scope.$inner.text = $('<a href="#"></a>');
						$scope.$inner.text.addClass("mj-button-button-text");
						$scope.$inner.text.text($attrs.text);
						$scope.$inner.button.append($scope.$inner.text);
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					$scope.$inner.build = function() {
						/**
						 * 绑定on事件，传入事件名和方法名，调用任意事件
						 */
						$scope.$inner.on = function(eventName, func) {
							$scope.$inner.button.on(eventName, function(event) {
								if (!$element.hasClass("mj-button-disabled")) {
									if ($.isFunction(func)) {
										$scope.$outer.getEvent = function() {
											return event;
										};
										func($scope.$outer);
									}
								}
								// event.stopPropagation();
							});
						};

						$scope.$inner.button.on("click", function(event) {
							if ($scope.$inner.text != null) {
								$scope.$inner.text.focus();
							}
							if (!$element.hasClass("mj-button-disabled")) {
								if (!mj.isEmpty($attrs.click)) {
									if ($.isFunction(mj.findCtrlScope($scope)[$attrs.click])) {
										$scope.$outer.getEvent = function() {
											return event;
										};
										mj.findCtrlScope($scope)[$attrs.click]($scope.$outer);
									}
								}
							}
						});
					};
					$scope.$inner.build();

					/**
					 * 设置是否可用
					 */
					$scope.$outer.setDisabled = function(flag) {
						if (flag == "true" || flag == true) {
							$element.addClass("mj-button-disabled");
						} else {
							$element.removeClass("mj-button-disabled");
						}
					};

					// 隐藏
					$scope.$outer.hide = function() {
						$element.hide();
					};

					// 显示
					$scope.$outer.show = function(flag) {
						$element.show();
					};

					/**
					 * 设置button显示的文字
					 */
					$scope.$outer.getButton = function() {
						return $scope.$inner.button;
					}

					/**
					 * 设置button显示的文字
					 */
					$scope.$outer.getSelectedItem = function() {
						return $scope.$inner.selectedItem;
					}

					/**
					 * 设置button显示的文字
					 */
					$scope.$outer.setText = function(text) {
						if (mj.isNotEmpty($scope.$inner.text)) {
							$scope.$inner.text.text(text);
						}
					}

					/**
					 * 获得button显示的文字
					 */
					$scope.$outer.getText = function() {
						if (mj.isNotEmpty($scope.$inner.text)) {
							return $scope.$inner.text.text();
						} else {
							return null;
						}
					};

					$scope.$outer.destroy = function() {
						$.each($scope.$inner.children, function(index, child) {
							child.sc.$outer.destroy();
						});
						mj.delView($attrs.id);
						$scope.$destroy();
						delete $scope;
					};

					/**
					 * 获取菜单
					 */
					$scope.$outer.getMenu = function() {
						if ($scope.$inner.children.length > 0) {
							var menu = $scope.$inner.children[0];
							return menu.sc.$outer;
						} else {
							return null;
						}
					};

					$scope.$outer.layout = function() {
						if ($scope.$inner.getParentScope().$outer.tagName == "mjFieldLeft" || $scope.$inner.getParentScope().$outer.tagName == "mjFieldRight") {
							$attrs.height = "100%";
							$attrs.width = "100%";
							$element.parent().css({
								"line-height" : "normal"
							});
						}
						// if (mj.isNotEmpty($attrs.height)) {
						// if (mj.endWith($attrs.height, "%")) {
						// $scope.$inner.button.css({
						// "height" : (($element.parent().innerHeight() *
						// parseInt($attrs.height, 10)) / 100) + "px"
						// });
						// } else {
						// $scope.$inner.button.css({
						// "height" : $attrs.height + "px"
						// });
						// }
						// }
					};

				}
			}
		}
	});
});

mj.module.directive('mjButtonMenu', function($compile) {
	return mj.buildDirective({
		name : "mjButtonMenu",
		require : [ '^?mjButton' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.children = [];
					$scope.$inner.addChild = function(sc, el, rs) {
						$scope.$inner.children.push({
							"sc" : sc,
							"el" : el,
							"rs" : rs
						});
					};
					$scope.$inner.scrollFlag = false;
					$scope.$inner.init = function() {
					}
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var buttonScope = $scope.$inner.getParentScope();
					buttonScope.$inner.addChild($scope, $element, $attrs);
					$scope.$inner.button = buttonScope.$outer.getElement();

					$scope.$inner.arrow = null;

					$scope.$inner.build = function() {
						$scope.$inner.buildArrow();

						$(document.body).append($element);

						$(document.body).on("click", function(event) {
							var obj = $(event.target);
							if (!obj.is($scope.$inner.arrow) && !obj.parent().is($scope.$inner.arrow)) {
								var ul = obj.closest("ul[id='" + $attrs.id + "']");
								if (ul.length == 0) {
									$scope.$inner.hide();
								}
							}
						});

						$($element).on("mouseover", function(event) {
							$scope.$inner.scrollFlag = true;
						});
						$($element).on("mouseout", function(event) {
							$scope.$inner.scrollFlag = false;
						});

						$(window).resize(function() {
							$scope.$inner.hide();
						});
						$(window).mousewheel(function(event) {
							if (mj.isFalse($scope.$inner.scrollFlag)) {
								$scope.$inner.hide();
							}
						});
					}

					/**
					 * 构建下拉按钮
					 */
					$scope.$inner.buildArrow = function() {
						var arrow = $('<div class="mj-button-arrow"><span class="fa fa-caret-down"></span></div>');
						$scope.$inner.button.append(arrow);
						$scope.$inner.arrow = arrow;
						$scope.$inner.arrow.on('click', function(event) {
							var menus = $(document.body).find("ul[data-tag='mjButtonMenu']");
							$.each(menus, function(index, menu) {
								$(menu).css({
									"display" : "none"
								});
							});
							if (!$scope.$inner.button.hasClass("mj-button-disabled")) {
								$scope.$inner.show();
							}
							// event.stopPropagation();
						});
					};

					/**
					 * 添加子元素
					 */
					$scope.$outer.addChild = function(opt) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						var iview = null;
						if (opt.type == "splitter") {
							iview = $scope.$inner.buildButtonMenuSplitter(opt);
						} else {
							iview = $scope.$inner.buildButtonMenuItem(opt);
						}
						var _dom = $compile(iview)($scope.$new());
						$element.append(_dom);
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 批量添加子元素
					 */
					$scope.$outer.addChildren = function(opts) {
						if (!$.isArray(opts)) {
							throw "非Array对象，请检查...";
							return;
						}
						$.each(opts, function(index, opt) {
							$scope.$outer.addChild(opt);
						});
					};

					/**
					 * 动态构建控件
					 */
					$scope.$inner.buildButtonMenuItem = function(opts) {
						var tag = $("<mj-button-menu-item>");
						$.each(opts, function(key, value) {
							tag.attr("data-" + key, value);
						});
						return tag;
					};

					/**
					 * 动态构建控件
					 */
					$scope.$inner.buildButtonMenuSplitter = function(opts) {
						var tag = $("<mj-button-menu-splitter>");
						$.each(opts, function(key, value) {
							tag.attr("data-" + key, value);
						});
						return tag;
					};

					/**
					 * 获取子元素
					 */
					$scope.$outer.getChildren = function() {
						var children = [];
						$.each($scope.$inner.children, function(index, child) {
							children.push(child.sc.$outer);
						});
						return children;
					};

					/**
					 * 根据索引获取子元素
					 */
					$scope.$outer.getChildByIndex = function(index) {
						$scope.$inner.children[index].sc.$outer;
					};

					/**
					 * 根据索引获取子元素
					 */
					$scope.$outer.getChildById = function(id) {
						$.each($scope.$inner.children, function(index, child) {
							if (child.rs.id == id) {
								return child.sc.$outer;
							}
						});
					};

					/**
					 * 删除菜单
					 */
					$scope.$outer.removeChildren = function() {
						if ($scope.$inner.children.length > 0) {
							$scope.$inner.children.splice(0, $scope.$inner.children.length);
							var children = $element.find("*[data-tag*='mj']");
							for (var i = children.length - 1; i >= 0; i--) {
								var view = mj.getView($(children[i]).attr("id"));
								if (!mj.isEmpty(view)) {
									if ($.isFunction(view.destroy)) {
										view.destroy();
									}
								}
							}
							$element.empty();
						}
					};

					$scope.$inner.show = function() {
						if ($element.css("display") == "blcok") {
							return;
						}
						var datel = $scope.$inner.button.offset().left;
						var datet = $scope.$inner.button.offset().top + $scope.$inner.button.outerHeight(true);
						// 自适应下边框控件对齐出现
						var windowHeight = $(window).height();
						if (datet + $element.height() > windowHeight) {
							datet = $scope.$inner.button.offset().top - $element.outerHeight(true);
						}
						// 自适应右边框控件对齐出现
						var windowWidth = $(window).width();
						if (datel + $element.width() > windowWidth) {
							datel = $scope.$inner.button.offset().left - $element.width() + $scope.$inner.button.width();
						}
						$element.css({
							"left" : datel + "px",
							"top" : datet + "px",
							"display" : "block"
						});
					}

					$scope.$inner.hide = function() {
						$element.css({
							"display" : "none"
						});
					};

					$scope.$outer.destroy = function() {
						$.each($scope.$inner.children, function(index, child) {
							child.sc.$outer.destroy();
						});
						mj.delView($attrs.id);
						$scope.$destroy();
						delete $scope;
						$element.remove();
					}

					$scope.$inner.build();

				}
			}
		}
	});
});

mj.module.directive('mjButtonMenuItem', function($compile) {
	return mj.buildDirective({
		"name" : "mjButtonMenuItem",
		require : [ '^?mjButtonMenu' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.text = $element.find(".mj-button-menu-text").first();
					$scope.$inner.icon = $element.find(".mj-button-menu-icon").first();
					$scope.$inner.cls = {
						"disabled" : "mj-button-menu-item-disabled",
						"select" : "mj-button-menu-item-select"
					};
					$scope.$inner.init = function() {
						if (mj.isTrue($attrs.disabled)) {
							$element.addClass($scope.$inner.cls.disabled);
						}
						if (mj.isTrue($attrs.hidden)) {
							$element.hide();
						}
						if (!$.isEmptyObject($attrs.icon)) {
							$scope.$inner.icon.addClass($attrs.icon);
						}
						$scope.$inner.text.append($attrs.text);
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var pscope = $scope.$inner.getParentScope();
					pscope.$inner.addChild($scope, $element, $attrs);
					$scope.$inner.build = function() {
						$scope.$inner.buildClick();
					};

					/**
					 * 设置菜单项是否禁用
					 */
					$scope.$outer.setDisabled = function(flag) {
						if (flag == true) {
							$element.addClass($scope.$inner.cls.disabled);
						} else {
							$element.removeClass($scope.$inner.cls.disabled);
						}
					};

					/**
					 * 获取菜单项是否禁用状态
					 */
					$scope.$outer.getDisabled = function() {
						return $element.hasClass($scope.$inner.cls.disabled);
					};

					/**
					 * 设置text
					 */
					$scope.$outer.setText = function(text) {
						$attrs.text = text;
						$scope.$inner.text(text);
					};

					/**
					 * 获取text
					 */
					$scope.$outer.getText = function() {
						return $attrs.text;
					};

					// 隐藏
					$scope.$outer.hide = function() {
						$element.hide();
					};

					// 显示
					$scope.$outer.show = function(flag) {
						$element.show();
					};

					// 显示
					$scope.$outer.getButton = function() {
						return pscope.$parent.$parent.$outer;
					};

					// 设置菜单项click事件
					$scope.$inner.buildClick = function() {
						if (mj.isNotEmpty(pscope.$outer.getAttrs().click)) {
							$element.on("click", function() {
								if ($element.hasClass($scope.$inner.cls.disabled)) {
									return;
								}
								pscope.$inner.hide();
								$.each(pscope.$inner.children, function(index, child) {
									if (child.el.hasClass($scope.$inner.cls.select)) {
										child.el.removeClass($scope.$inner.cls.select);
									}
								});
								$element.addClass($scope.$inner.cls.select);
								pscope.$parent.$parent.$inner.selectedItem = $scope.$outer;
								if ($.isFunction(mj.findCtrlScope($scope)[pscope.$outer.getAttrs().click])) {
									mj.findCtrlScope($scope)[pscope.$outer.getAttrs().click]($scope.$outer);
								}
							});
						}
					};

					$scope.$inner.build();
				}
			}
		}
	});
});

mj.module.directive('mjButtonMenuSplitter', function() {
	return mj.buildDirective({
		"name" : "mjButtonMenuSplitter",
		require : [ '^?mjButtonMenu' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
				}
			}
		}
	});
});

/**
 * 动态添加控件
 */
mj.buildButton = function(opts) {
	var tag = $("<mj-button>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildButtonMenu = function(opts) {
	var tag = $("<mj-button-menu>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildButtonMenuItem = function(opts) {
	var tag = $("<mj-button-menu-item>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildButtonMenuSplitter = function(opts) {
	var tag = $("<mj-button-menu-splitter>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};
/**
 * 
 */

mj.module.directive('mjButtonGroup', function($compile) {
	return mj.buildDirective({
		name : "mjButtonGroup",
		template : function($element, $attrs) {
			return mj.templates.mjButtonGroup;
		},
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					/**
					 * 删除空格
					 */
					$scope.$inner.build = function() {
						$element.contents().filter(function() {
							return this.nodeType === 3;
						}).remove();
					}

					$scope.$inner.build();

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};

					/**
					 * 添加button
					 */
					$scope.$outer.addChild = function(opt) {
						var buttonName = "mj-button";
						var dom = null;
						if ((opt instanceof $) && opt.is(buttonName)) {
							dom = opt;
						} else if (mj.isJson(opt)) {
							dom = mj.buildButton(opt);
						} else {
							dom = null;
						}
						if (dom == null) {
							return null;
						}
						var view = $compile(dom)($scope.$new());
						$element.append(view);
						return view;
					}

					/**
					 * 添加多个button
					 */
					$scope.$outer.addChildren = function(opts) {
						var children = [];
						if (!$.isArray(opts)) {
							throw "非Array对象，请检查...";
							return;
						}
						$.each(opts, function(index, opt) {
							children.push($scope.$outer.addChild(opt));
						});
						return children;
					};

					/**
					 * 获取子元素
					 */
					$scope.$inner.getChild = function(child) {
						if (mj.isNotEmpty(child)) {
							var view = mj.getView(child.attr("data-id"));
							if (mj.isNotEmpty(view)) {
								return view;
							} else {
								return null;
							}
						} else {
							return null;
						}
					}

					/**
					 * 根据所有子元素
					 */
					$scope.$outer.getChildren = function() {
						var children = $element.find("div[data-tag='mjButton']");
						var _children = [];
						$.each(children, function(_index, _child) {
							_children.push($scope.$inner.getChild(child));
						});
					};

					/**
					 * 根据索引获取button
					 */
					$scope.$outer.getChildByIndex = function(index) {
						var children = $element.find("div[data-tag='mjButton']");
						var child = null;
						$.each(children, function(_index, _child) {
							if (_index == index) {
								child = _child;
								return false;
							}
						});
						return $scope.$inner.getChild(child);
					};

					/**
					 * 根据id获取button
					 */
					$scope.$outer.getChildById = function(id) {
						var children = $element.find("div[data-tag='mjButton']");
						var child = null;
						$.each(children, function(_index, _child) {
							if (_child.attr("data-id") == id) {
								child = _child;
								return false;
							}
						});
						return $scope.$inner.getChild(child);
					};

					/**
					 * 删除所有button
					 */
					$scope.$outer.removeChildren = function() {
						var children = $element.find("div[data-tag='mjButton']");
						$.each(children, function(_index, _child) {
							var child = $scope.$outer.getChildByIndex(index);
							if (mj.isNotEmpty(view)) {
								view.destroy();
							}
						});
					};

					/**
					 * 根据索引删除button
					 */
					$scope.$outer.removeChildByIndex = function(index) {
						var child = $scope.$outer.getChildByIndex(index);
						if (mj.isNotEmpty(view)) {
							view.destroy();
						}
					};

					/**
					 * 根据id删除button
					 */
					$scope.$outer.removeChildById = function(id) {
						var child = $scope.$outer.getChildByIndex(index);
						if (mj.isNotEmpty(view)) {
							view.destroy();
						}
					};
				}
			}
		}
	});
});
/**
 * 动态添加控件
 */
mj.buildButtonGroup = function(opts) {
	var tag = $("<mj-button-group>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
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
});mj.module.directive('mjChart', function() {
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
})/**
 * 
 */
mj.module.directive('mjCheckbox', function($http, $compile) {
	return mj.buildFieldDirective({
		name : "mjCheckbox",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					var group = $element.find(".mj-input-field").first();
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs);
					$scope.$inner.buildOtherAttr = function() {

					};

					/**
					 * 获取当前选中项的value
					 */
					$scope.$outer.getValue = function() {
						var items = $element.find("input[name='" + $attrs.name + "']:checked");
						var vals = new Array();
						var i = 0;
						$.each(items, function(index, item) {
							vals[i] = item.value;
							i++;
						});
						return vals;
					};
					/**
					 * 设置当前选中项的value
					 */
					$scope.$outer.setValue = function(val) {
						var items = val.split(",");
						$.each(items, function(index, item) {
							var input = $element.find("input[name='" + $attrs.name + "'][value='" + item + "']");
							input.prop("checked", true);
						});
					};

					$scope.$outer.setChange = function(func) {
						$attrs.change = func;
					};

					/**
					 * 清空控件输入，如果有默认值就赋给默认值，没有默认值则设置为null
					 */
					$scope.$outer.reset = function() {
						$scope.$outer.selectCancel();
						if (!mj.isEmpty($attrs.value)) {
							$scope.$outer.setValue($attrs.value);
						} else {
							$scope.$outer.setValue("");
						}
						$scope.$inner.field.removeAttr("title");
						$scope.$inner.field.removeClass("mj-input-validity-error");
					}
					/**
					 * 获得当前选中项，返回格式{"label" :"label","value" :"value"}
					 */
					$scope.$outer.getSelect = function() {
						var items = $element.find("input[name='" + $attrs.name + "']:checked");
						var vals = new Array();
						var i = 0;
						$.each(items, function(index, item) {
							vals[i] = {
								"label" : $(item).parent().text(),
								"value" : item.value
							};
							i++;
						});
						return vals;
					};
					/**
					 * 添加选项,格式{"value" :"value","label" :"label"}
					 */
					$scope.$outer.addChild = function(item) {
						var label;
						var value;
						// 通过属性data-label-field和data-value-field来确定data的数据列，如果未设置就是按照label和value获取数据
						if ((!$.isEmptyObject($attrs.labelField)) && (!$.isEmptyObject($attrs.valueField))) {
							label = item[$attrs.labelField];
							value = item[$attrs.valueField];
						} else {
							label = item.label;
							value = item.value;
						}
						if ($.isEmptyObject(value)) {
							throw "属性value不能为空";
						}
						var checkbox = $(mj.templates.mjCheckboxItem);
						var input = $(checkbox.children()[0]);
						input.attr({
							"value" : value,
							"name" : $attrs.name
						});
						if ($attrs.disabled == "true") {
							input.attr("disabled", "disabled");
						}
						if ($attrs.value.indexOf(value) > -1) {
							input.prop("checked", true);
							input.parent().attr("data-checked", true);
						}
						if (!$.isEmptyObject(label)) {
							checkbox.append(label);
						} else {
							checkbox.append("&nbsp;");
						}
						group.append(checkbox);
						$scope.$inner.buildCurrentItem(checkbox);
					};

					/**
					 * 构建当前子项
					 */
					$scope.$inner.buildCurrentItem = function(checkbox) {
						var input = checkbox.find("input").first();
						var current = {
							"getElement" : function() {
								return input;
							},
							"getLabel" : function() {
								checkbox.text();
							},
							"getValue" : function() {
								return input.val();
							},
							"getName" : function() {
								return input.attr("name");
							},
							"isChecked" : function() {
								if (mj.isTrue(input.prop("checked"))) {
									return true;
								} else {
									return false;
								}
							},
							"setChecked" : function(flag) {
								input.prop("checked", flag);
								input.parent().attr("data-checked", flag);
							}
						};

						if (!mj.isEmpty($attrs.change)) {
							if ($.isFunction(mj.findCtrlScope($scope)[$attrs.change])) {
								input.on("change", function() {
									var opts = $.extend(true, {}, $scope.$outer);
									opts.getCurrentItem = function() {
										return current;
									};
									mj.findCtrlScope($scope)[$attrs.change](opts);
								});
							}
						}
					};

					/**
					 * 根据选择项value删除选择项
					 */
					$scope.$outer.removeChild = function(val) {
						var input = $element.find("input[name='" + $attrs.name + "'][value='" + val + "']").first();
						var parent = input.parent();
						parent.remove();
					}
					/**
					 * 删除所有选择项
					 */
					$scope.$outer.removeChildren = function() {
						group.empty();
					}
					/**
					 * 全选
					 */
					$scope.$outer.selectAll = function() {
						var items = $element.find("input[name='" + $attrs.name + "']");
						$.each(items, function(index, item) {
							var input = $(item);
							input.prop("checked", true);
							input.parent().attr("data-checked", "true");
						});
					}

					/**
					 * 全取消
					 */
					$scope.$outer.unselectAll = function() {
						var items = $element.find("input[name='" + $attrs.name + "']");
						$.each(items, function(index, item) {
							var input = $(item);
							input.prop("checked", false);
							input.parent().attr("data-checked", "false");
						});
					}

					$scope.$inner.init = function(data) {
						if ($.isEmptyObject(data)) {
							if ($.isEmptyObject($attrs.data)) {
								throw "参数为空，请设置选择框的参数!";
							} else {
								data = $attrs.data;
							}

						}
						$scope.$outer.removeChildren();
						if (!$.isEmptyObject(data)) {
							var items = new Array();
							if (typeof (data) === "string") {
								try {
									items = $.parseJSON(data);
								} catch (e) {
									throw "参数格式错误，必须为JSON数组"
								}
							} else if (mj.isJson(data)) {
								items[0] = data;
							} else if ($.isArray(data)) {
								items = data;
							} else {
								throw "参数格式错误，必须为JSON数组"
							}
							$.each(items, function(index, item) {
								$scope.$outer.addChild(item);
							});
						}
					}
					/**
					 * 加载现有数据到下拉框中，数据可通过方法传参和控件属性传参两种
					 */
					$scope.$outer.loadData = function(data, succFun) {
						$scope.$inner.init(data);
						if ($.isFunction(succFun)) {
							succFun(data);
						}
					};
					$scope.$inner.data = function() {
						var method;
						var succFun = $scope.$inner.succFun;
						if ($.isEmptyObject($attrs.method)) {
							method = "get";
						} else {
							method = $attrs.method
						}
						$http({
							method : method,
							url : $scope.$inner.action,
							params : {
								"condition" : $scope.$inner.param
							}
						}).then(function successCallback(response) {
							if (response.data.code == 0) {
								data = response.data.data;
								$scope.$inner.init(data);
								if ($.isFunction(succFun)) {
									succFun(response.data);
								}
							}
						}, function errorCallback(response) {
						});
					}
					/**
					 * 后台数据加载,后台访问路径可通过方法传参和控件属性传参两种
					 */
					$scope.$outer.load = function(param, action, succFun) {
						if (mj.isEmpty(action)) {
							action = mj.findAttr($attrs.action, $scope);
						}
						$scope.$inner.param = param;
						$scope.$inner.action = action;
						$scope.$inner.succFun = succFun;
						$scope.$inner.data();
					};
					if (!$.isEmptyObject($attrs.data)) {
						$scope.$inner.init($attrs.data);
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
mj.buildCheckbox = function(opts) {
	var tag = $("<mj-checkbox>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */

mj.view.confirm = function(options) {
	mj.addView("mj-confirm", this);
	this.options = options;
	this.close = function() {
		this.__inner.view.remove();
		this.__inner.mash.remove();
		mj.delView("mj-confirm");
	}
};

mj.view.confirm.prototype = {
	__inner : {},
	__build : function() {
		this.__buildOption();
		this.__buildMask();
		this.__inner.view = $(mj.templates.mjConfirm);
		this.__inner.head = this.__inner.view.find(".mj-confirm-head:first-child");
		this.__inner.body = this.__inner.view.find(".mj-confirm-body:first-child");
		this.__inner.foot = this.__inner.view.find(".mj-confirm-foot:first-child");
		this.__buildView();
	},
	__buildOption : function() {
		this.__opts = {
			"id" : mj.key(),
			"title" : "系统提示",
			"width" : "300px",
			"height" : "120px",
			"level" : "info",
			"horizontal" : "left",
			"vertical" : "middle",
			"icon" : "",
			"content" : "...",
			"handler" : null
		};
		$.extend(true, this.__opts, this.options);
		delete this.options;
	},
	__buildView : function() {
		var dom = $(document.body);
		dom.append(this.__inner.view);
		this.__inner.view.css({
			"width" : this.__opts.width,
			"height" : this.__opts.height
		});

		var h = (dom.height() - this.__inner.view.height()) / 2;
		var w = (dom.width() - this.__inner.view.width()) / 2;
		this.__inner.view.css({
			"top" : h,
			"left" : w,
			"z-index" : mj.getIndex()
		});
		this.__buildHead();
		this.__buildBody();
		this.__buildFoot();
	},

	__buildHead : function() {
		var title = $('<span class="mj-confirm-head-text"></span>');
		title.text(this.__opts.title);
		this.__inner.head.append(this.__buildLevel());
		this.__inner.head.append(title);
	},

	__buildFoot : function() {
		var _this = this;
		var btns = this.__inner.foot.children();
		var ok_button = $(btns[0]);
		ok_button.on("click", function() {
			_this.close();
			if ($.isFunction(_this.__opts.handler)) {
				_this.__opts.handler('yes');
			}
		});

		var cancel_button = $(btns[1]);
		cancel_button.on("click", function() {
			_this.close();
			if ($.isFunction(_this.__opts.handler)) {
				_this.__opts.handler("no");
			}

		});
	},

	__buildBody : function() {
		this.__inner.body.html(this.__opts.content);
		this.__inner.body.css({
			"text-align" : this.__opts.horizontal,
			"vertical-align" : this.__opts.vertical
		});
	},

	__buildLevel : function() {
		var level = $('<span class="mj-alert-head-icon"></span>');
		switch (this.__opts.level) {
		case "help":
			level.addClass("glyphicon glyphicon-question-sign mj-color-help");
			break;
		case "info":
			level.addClass("glyphicon glyphicon-info-sign mj-color-info");
			break;
		case "warn":
			level.addClass("glyphicon glyphicon-exclamation-sign mj-color-warn");
			break;
		case "error":
			level.addClass("glyphicon glyphicon-remove-circle mj-color-error");
			break;
		default:
			level.addClass("glyphicon glyphicon-info-sign mj-color-info");
		}
		return level;
	},

	__buildMask : function() {
		this.__inner.mash = $(mj.templates.mjMash);
		this.__inner.mash.css({
			"z-index" : mj.getIndex()
		});
		$(document.body).append(this.__inner.mash);
	},

	__open : function() {
		this.__inner.view.remove();
		this.__inner.mash.remove();
		mj.delView(this.__opts.id);
	}

};

mj.buildConfirm = function(options) {
	if (mj.checkView("mj-confirm")) {
		return;
	}
	var win = new mj.view.confirm(options);
	win.__build();
	return win;
}/**
 * 
 */

mj.module.directive('mjDate', function($compile) {
	return mj.buildFieldDirective({
		name : "mjDate",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs);
					var obody = document.body;
					var dateObj = new Date();
					var dbox;
					$scope.$inner.buildOtherAttr = function() {
						if (mj.isEmpty($attrs.format)) {
							$attrs.format = "yyyy-MM-dd";
						}
						if (!mj.isEmpty($attrs.value)) {
							if ($attrs.value == "today") {
								$scope.$inner.field.attr("value", dateObj.format($attrs.format));
							} else {
								$scope.$inner.field.attr("value", mj.formatData($attrs.value, $attrs.format));
								$scope.$inner.field.val(mj.formatData($attrs.value, $attrs.format));
							}
						}
						/**
						 * 清空控件输入，如果有默认值就赋给默认值，没有默认值则设置为null
						 */
						$scope.$outer.reset = function() {
							if (!mj.isEmpty($attrs.value)) {
								if ($attrs.value == "today") {
									$scope.$inner.field.attr("value", dateObj.format($attrs.format));
								} else {
									$scope.$inner.field.attr("value", mj.formatData($attrs.value, $attrs.format));
									$scope.$inner.field.val(mj.formatData($attrs.value, $attrs.format));
								}
							} else {
								$scope.$inner.field.val("");
							}
						}
						$scope.$outer.setValue = function(val) {
							return $scope.$inner.field.val(mj.formatData(val, $attrs.format));
						};
						$scope.$inner.field.on("change", function() {
							$scope.$inner.checkEmpty();
							if (mj.isNotEmpty($attrs.change)) {
								if ($.isFunction(mj.findCtrlScope($scope)[$attrs.change])) {
									mj.findCtrlScope($scope)[$attrs.change]($scope.$outer);
								}
							}
						});

						$scope.$inner.field.on("blur", function() {
							$scope.$inner.checkEmpty();
						});

						$scope.$inner.field.on('click', function() {
							$scope.$inner.createbox();
							$(obody).find('.mj-date-box').css({
								"display" : "none"
							});
							var datel = $(this).offset().left;
							var datet = $(this).offset().top + $(this).parent().height() + 2;
							var windowHeight = $(window).height();
							if (datet + dbox.height() > windowHeight) {
								datet = $(this).offset().top - dbox.height() - 4;
							}
							dbox.css({
								"left" : datel + "px",
								"top" : datet + "px",
								"display" : "block"
							});
						});

						$(document.body).on("click", function(event) {
							var className = event.target.className;
							if (event.target.tagName == "INPUT" && className.indexOf("mj-input-field") > -1) {
								return;
							} else if (event.target.tagName == "DIV" && className.indexOf("mj-date") > -1) {
								return;
							} else if (event.target.tagName == "I" && $(event.target).parent().attr("class").indexOf("mj-date") > -1) {
								return;
							} else {
								if (typeof (dbox) != "undefined") {
									dbox.css({
										"display" : "none"
									});
								}
							}
						});

						$(window).resize(function() {
							if (mj.isNotEmpty(dbox)) {
								dbox.css({
									"display" : "none"
								});
							}
						});
						$(window).mousewheel(function() {
							if (mj.isNotEmpty(dbox)) {
								dbox.css({
									"display" : "none"
								});
							}
						});
					};

					$scope.$inner.createbox = function() {
						if (typeof (dbox) != "undefined") {
							return;
						}
						dbox = $(mj.templates.mjDateBox);
						dbox.attr("id", "dbox-" + $attrs.id)
						dbox.css({
							"z-index" : mj.getIndex()
						});
						$(obody).append(dbox);

						// 年月获取
						var year = dateObj.getFullYear();
						var month = $scope.$inner.toyear(dateObj);// 0是12月

						// 月年的显示
						$(dbox).find(".mj-date-month").first().html(month + "月");
						$(dbox).find(".mj-date-year").first().html(year + "年");

						// ===================set
						// day===============================
						// 获取本月1号的周值
						var oneweek = $scope.$inner.oneyearoneday(dateObj);
						// 本月总日数
						var alld = $scope.$inner.alldays(dateObj);
						// 当前是几
						var nowd = $scope.$inner.nowday(dateObj);
						// 初始化显示本月信息
						$scope.$inner.init(oneweek, alld, nowd);
						$(dbox).find(".mj-date-con").first().on("click", function(event) {
							if (event.target.tagName == "DIV" && event.target.nodeType == "1") {
								if (event.target.className.indexOf("mj-date-edate") > -1) {
									var dddate = new Date(dateObj.getFullYear(), $scope.$inner.toyear(dateObj) - 1, $(event.target).text());
									$scope.$inner.field.val(dddate.format($attrs.format)).trigger('change');
									dbox.css({
										"display" : "none"
									});

									$(dbox).find(".mj-date-select").first().removeClass("mj-date-select");
									$(event.target).addClass("mj-date-select");
								} else if (event.target.className.indexOf("mj-date-ldate") > -1) {
									var dddate = new Date(dateObj.getFullYear(), $scope.$inner.toyear(dateObj) - 2, $(event.target).text());
									$scope.$inner.field.val(dddate.format($attrs.format)).trigger('change');
									var ddm = null, ddy = null;
									if ((dateObj.getMonth() - 1) == -1) {
										ddm = 11;
										ddy = dateObj.getFullYear() - 1;
									} else {
										ddm = dateObj.getMonth() - 1;
										ddy = dateObj.getFullYear();
									}
									;
									dateObj.setDate(1);
									dateObj.setFullYear(ddy);
									dateObj.setMonth(ddm);
									dateObj.setDate($(event.target).text());
									$(dbox).find(".mj-date-month").first().html($scope.$inner.toyear(dateObj) + "月");
									$(dbox).find(".mj-date-year").first().html(dateObj.getFullYear() + "年");
									oneweek = $scope.$inner.oneyearoneday(dateObj);
									alld = $scope.$inner.alldays(dateObj);
									nowd = $scope.$inner.nowday(dateObj);
									$scope.$inner.init(oneweek, alld, nowd);
								} else if (event.target.className.indexOf("mj-date-ndate") > -1) {
									var dddate = new Date(dateObj.getFullYear(), $scope.$inner.toyear(dateObj), $(event.target).text());
									$scope.$inner.field.val(dddate.format($attrs.format)).trigger('change');
									var ddm = null, ddy = null;
									if ((dateObj.getMonth() + 1) == 12) {
										ddm = 0;
										ddy = dateObj.getFullYear() + 1;
									} else {
										ddm = dateObj.getMonth() + 1;
										ddy = dateObj.getFullYear();
									}
									;
									dateObj.setDate(1);
									dateObj.setFullYear(ddy);
									dateObj.setMonth(ddm);
									dateObj.setDate($(event.target).text());
									$(dbox).find(".mj-date-month").first().html($scope.$inner.toyear(dateObj) + "月");
									$(dbox).find(".mj-date-year").first().html(dateObj.getFullYear() + "年");
									oneweek = $scope.$inner.oneyearoneday(dateObj);
									alld = $scope.$inner.alldays(dateObj);
									nowd = $scope.$inner.nowday(dateObj);
									$scope.$inner.init(oneweek, alld, nowd);
								}
							}
						});

						$(dbox).find(".mj-date-prevmonth").first().on("click", function() { // 上一月
							var ddm = null, ddy = null;
							if ((dateObj.getMonth() - 1) == -1) {
								ddm = 11;
								ddy = dateObj.getFullYear() - 1;
							} else {
								ddm = dateObj.getMonth() - 1;
								ddy = dateObj.getFullYear();
							}
							;
							dateObj.setFullYear(ddy);
							dateObj.setMonth(ddm);
							$(dbox).find(".mj-date-month").first().html($scope.$inner.toyear(dateObj) + "月");
							$(dbox).find(".mj-date-year").first().html(dateObj.getFullYear() + "年");
							oneweek = $scope.$inner.oneyearoneday(dateObj);
							alld = $scope.$inner.alldays(dateObj);
							nowd = $scope.$inner.nowday(dateObj);
							$scope.$inner.init(oneweek, alld, nowd);
						});
						$(dbox).find(".mj-date-nextmonth").first().on("click", function() { // 下一月
							var ddm = null, ddy = null;
							if ((dateObj.getMonth() + 1) == 12) {
								ddm = 0;
								ddy = dateObj.getFullYear() + 1;
							} else {
								ddm = dateObj.getMonth() + 1;
								ddy = dateObj.getFullYear();
							}
							;
							dateObj.setFullYear(ddy);
							dateObj.setMonth(ddm);
							$(dbox).find(".mj-date-month").first().html($scope.$inner.toyear(dateObj) + "月");
							$(dbox).find(".mj-date-year").first().html(dateObj.getFullYear() + "年");
							oneweek = $scope.$inner.oneyearoneday(dateObj);
							alld = $scope.$inner.alldays(dateObj);
							nowd = $scope.$inner.nowday(dateObj);
							$scope.$inner.init(oneweek, alld, nowd);
						});
						$(dbox).find(".mj-date-prevyear").first().on("click", function() { // 上一年
							var ddy = dateObj.getFullYear() - 1;
							dateObj.setFullYear(ddy);
							$(dbox).find(".mj-date-year").first().html(dateObj.getFullYear() + "年");
							oneweek = $scope.$inner.oneyearoneday(dateObj);
							alld = $scope.$inner.alldays(dateObj);
							nowd = $scope.$inner.nowday(dateObj);
							$scope.$inner.init(oneweek, alld, nowd);
						});
						$(dbox).find(".mj-date-nextyear").first().on("click", function() { // 下一月
							var ddy = dateObj.getFullYear() + 1;
							dateObj.setFullYear(ddy);
							$(dbox).find(".mj-date-year").first().html(dateObj.getFullYear() + "年");
							oneweek = $scope.$inner.oneyearoneday(dateObj);
							alld = $scope.$inner.alldays(dateObj);
							nowd = $scope.$inner.nowday(dateObj);
							$scope.$inner.init(oneweek, alld, nowd);
						});
						$(dbox).find(".mj-date-nowtime").first().on("click", function() {
							var dddate = new Date();
							var ddm = dddate.getMonth();
							var ddy = dddate.getFullYear();
							dateObj.setFullYear(ddy);
							dateObj.setMonth(ddm);
							$(dbox).find(".mj-date-month").first().html($scope.$inner.toyear(dateObj) + "月");
							$(dbox).find(".mj-date-year").first().html(dateObj.getFullYear() + "年");
							oneweek = $scope.$inner.oneyearoneday(dateObj);
							alld = $scope.$inner.alldays(dateObj);
							nowd = $scope.$inner.nowday(dateObj);
							$scope.$inner.init(oneweek, alld, nowd);
						});
						$(dbox).find(".mj-date-cleartime").first().on("click", function() {
							$scope.$inner.field.val("").trigger('change');
							$(dbox).find(".mj-date-select").first().removeClass("mj-date-select");
							dbox.css({
								"display" : "none"
							});
						});
					};

					$scope.$inner.init = function(oneweek, alld, nowd) {
						var inputdate = $scope.$inner.field.val();
						var con = $(dbox).find(".mj-date-con").first();
						con.empty();
						var daycount = 0; // 月日历天数
						// 上月天数
						var ldt = nowd.toDate("yyyyMMdd");
						ldt.setDate(1);
						ldt.setMonth(ldt.getMonth() - 1);
						var lalld = $scope.$inner.alldays(ldt);
						if (oneweek == 0) {
							oneweek = 7;
						}
						for (var i = oneweek - 1; i >= 0; i--) {// 上月结余
							var eday = document.createElement("div");
							eday.innerHTML = lalld - i;
							eday.className = "mj-date-ldate";
							con.append($(eday));
							daycount++;
						}
						;
						for (var i = 1; i <= alld; i++) {// 本月
							var eday = document.createElement("div");
							var day = i.toString().lpad(2);
							if (!mj.isEmpty(inputdate) && nowd.substr(0, 6) + day == inputdate.toDate($attrs.format).format("yyyyMMdd")) {

								eday.innerHTML = i;
								eday.className = "mj-date-select mj-date-edate";
								con.append($(eday));
							} else {
								if (nowd.substr(0, 6) + day == new Date().format("yyyyMMdd")) {
									eday.innerHTML = i;
									eday.className = "mj-date-now mj-date-edate";
									con.append($(eday));
								} else {
									eday.innerHTML = i;
									eday.className = "mj-date-edate";
									con.append($(eday));
								}
							}
							daycount++;
						}
						;
						var syd = (42 - daycount);
						for (var i = 1; i <= syd; i++) {// 下月结余
							var eday = document.createElement("div");
							eday.innerHTML = i;
							eday.className = "mj-date-ndate";
							con.append($(eday));
							daycount++;
						}
					}

					$scope.$inner.toyear = function(dateObj) {
						var month = dateObj.getMonth();
						switch (month) {
						case 0:
							return "1";
							break;
						case 1:
							return "2";
							break;
						case 2:
							return "3";
							break;
						case 3:
							return "4";
							break;
						case 4:
							return "5";
							break;
						case 5:
							return "6";
							break;
						case 6:
							return "7";
							break;
						case 7:
							return "8";
							break;
						case 8:
							return "9";
							break;
						case 9:
							return "10";
							break;
						case 10:
							return "11";
							break;
						case 11:
							return "12";
							break;
						default:
						}
						;
					};

					// 获取本月总日数方法
					$scope.$inner.alldays = function(dateObj) {
						var year = dateObj.getFullYear();
						var month = dateObj.getMonth();
						if ($scope.$inner.isLeapYear(year)) {// 闰年
							switch (month) {
							case 0:
								return "31";
								break;
							case 1:
								return "29";
								break; // 2月
							case 2:
								return "31";
								break;
							case 3:
								return "30";
								break;
							case 4:
								return "31";
								break;
							case 5:
								return "30";
								break;
							case 6:
								return "31";
								break;
							case 7:
								return "31";
								break;
							case 8:
								return "30";
								break;
							case 9:
								return "31";
								break;
							case 10:
								return "30";
								break;
							case 11:
								return "31";
								break;
							default:
							}
							;
						} else {// 平年
							switch (month) {
							case 0:
								return "31";
								break;
							case 1:
								return "28";
								break; // 2月
							case 2:
								return "31";
								break;
							case 3:
								return "30";
								break;
							case 4:
								return "31";
								break;
							case 5:
								return "30";
								break;
							case 6:
								return "31";
								break;
							case 7:
								return "31";
								break;
							case 8:
								return "30";
								break;
							case 9:
								return "31";
								break;
							case 10:
								return "30";
								break;
							case 11:
								return "31";
								break;
							default:
							}
							;
						}
						;
					};

					$scope.$inner.nowday = function(dateObj) {
						return dateObj.format("yyyyMMdd");
					};

					// 获取本月1号的周值
					$scope.$inner.oneyearoneday = function(dateObj) {
						var oneyear = new Date();
						var year = dateObj.getFullYear();
						var month = dateObj.getMonth();// 0是12月
						oneyear.setFullYear(year);
						oneyear.setMonth(month);// 0是12月
						oneyear.setDate(1);
						return oneyear.getDay();
					};

					// 闰年判断函数
					$scope.$inner.isLeapYear = function(year) {
						if ((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) {
							return true;
						} else {
							return false;
						}
						;
					};

					$scope.$inner.checkEmpty = function() {
						var flag = true;
						if ($attrs.required == "true") {
							if (mj.isEmpty($scope.$inner.field.val())) {
								$scope.$inner.field.addClass("mj-input-validity-error");
								$scope.$inner.tooltip.setTitle($attrs.label + " 不能为空");
								// $scope.$inner.field.attr("title",
								// $attrs.label + " 不能为空");
								flag = false;
							} else {
								if (!mj.isEmpty($scope.$inner.tooltip)) {
									$scope.$inner.tooltip.setTitle("");
								}
								// $scope.$inner.field.removeAttr("title");
								$scope.$inner.field.removeClass("mj-input-validity-error");
							}
						}
						return flag;
					};

					$scope.$outer.destroy = function() {
						mj.delView($attrs.id);
						$scope.$destroy();
						var div = $(obody).find("div[id='dbox-" + $attrs.id + "']").first();
						div.remove();
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
mj.buildDate = function(opts) {
	var tag = $("<mj-date>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */

mj.module.directive('mjEmail', function($compile) {
	return mj.buildFieldDirective({
		name : "mjEmail",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);
					$scope.$inner.checkType = function() {
						var flag = true;
						var Expression = /\w+[@]{1}\w+[.]\w+/;
						var objExp = new RegExp(Expression);
						if (!objExp.test($scope.$inner.field.val())) {
							$scope.$inner.field.addClass("mj-input-validity-error");
							$scope.$inner.tooltip.setTitle( $attrs.label + " 格式错误");
							//$scope.$inner.field.attr("title", $attrs.label + " email格式错误");
							flag = false;
						}
						return flag;
					};					
					$scope.$inner.build();
				}
			}
		}

	});
});
/**
 * 动态添加控件
 */
mj.buildEmail = function(opts) {
	var tag = $("<mj-email>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */

mj.module.directive('mjFieldLeft', function($compile) {
	return mj.buildDirective({
		name : "mjFieldLeft",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.init = function() {
						$element.parent().attr({
							"data-show-always" : $attrs.showAlways
						});
						$element.parent().addClass("mj-input-cell");
						$element.parent().addClass("mj-input-field-right-show");
						if (mj.isNumber($attrs.width)) {
							$element.parent().css({
								"width" : $attrs.width
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					/**
					 * 外部方法：添加子元素
					 */
					$scope.$outer.addChild = function(obj) {
						var _dom = $compile(obj)($scope.$new());
						$element.append(_dom);
						return mj.getView(_dom.attr("id"));
					};
					
					$scope.$outer.layout=function(){
						var pel=$scope.$parent.$parent.$outer.getElement();
						var input=pel.find(".mj-input-field").first();
						var border=input.css("borderTopWidth");
						var w=0;
						if(mj.isEmpty(border)){
							w=0;
						}else{
							w=parseInt(border,10)*2;
						}
						var height=($element.parent().innerHeight()-w)+"px";
						$element.css({
							"height" : height,
							"line-height" : height
						});
					}
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildFieldLeft = function(opts) {
	var tag = $("<mj-field-left>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */

mj.module.directive('mjFieldRight', function($compile) {
	return mj.buildDirective({
		name : "mjFieldRight",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.init = function() {
						$element.parent().attr({
							"data-show-always" : $attrs.showAlways
						});
						$element.parent().addClass("mj-input-cell");
						$element.parent().addClass("mj-input-field-right-show");
						$element.parent().attr({
							"data-role" : "show"
						});
						if (mj.isNumber($attrs.width)) {
							$element.parent().css({
								"width" : $attrs.width
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					/**
					 * 外部方法：添加子元素
					 */
					$scope.$outer.addChild = function(obj) {
						var _dom = $compile(obj)($scope.$new());
						$element.append(_dom);
						return mj.getView(_dom.attr("id"));
					};

					$scope.$outer.layout=function(){
						var pel=$scope.$parent.$parent.$outer.getElement();
						var input=pel.find(".mj-input-field").first();
						var border=input.css("borderTopWidth");
						var w=0;
						if(mj.isEmpty(border)){
							w=0;
						}else{
							w=parseInt(border,10)*2;
						}
						var height=($element.parent().innerHeight()-w)+"px";
						$element.css({
							"height" : height,
							"line-height" : height
						});
					}
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildFieldRight = function(opts) {
	var tag = $("<mj-field-right>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 *//**
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
					if($attrs.uploadModel=="manual"){
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
};/**
 * 
 */

mj.module.directive('mjForm', function($compile) {
	return mj.buildDirective({
		name : "mjForm",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.children = [];
					$scope.$inner.addChild = function(child) {
						$scope.$inner.children.push(child);
					};
					$scope.$inner.body = $element.find(".mj-form-body").first();
					$scope.$inner.columnWidth = "100%";
					$scope.$inner.init = function() {
						if (mj.isEmpty($attrs.layout)) {
							$attrs.layout = "horizontal";
						}
						if (mj.isEmpty($attrs.column)) {
							$attrs.column = 1;
						}
						$element.parent().css({
							"text-align" : "center"
						});
						if ($attrs.border == "false" || $attrs.border == false) {
							$scope.$inner.body.css({
								"border" : "none"
							});
						}

						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$scope.$inner.body.css({
								"background-color" : $attrs.backgroundColor
							});
						}

						if (!$.isEmptyObject($attrs.height)) {
							$scope.$inner.body.css({
								"height" : $attrs.height
							});
						}

						if (!$.isEmptyObject($attrs.width)) {
							$scope.$inner.body.css({
								"width" : $attrs.width
							});
						}

						$element.attr({
							"name" : $attrs.name,
							"enctype" : $attrs.enctype,
							"target" : $attrs.target
						});

						$scope.$inner.getColumnWidth();

					};
					$scope.$inner.getColumn = function() {
						if (mj.isEmpty($attrs.column)) {
							$attrs.column = 1;
						}
						return $attrs.column;
					};
					$scope.$inner.getColumnWidth = function() {
						switch (parseInt($attrs.column, 10)) {
						case 1:
							$scope.$inner.columnWidth = 100;
							break;
						case 2:
							$scope.$inner.columnWidth = 50;
							break;
						case 3:
							$scope.$inner.columnWidth = 33.33;
							break;
						case 4:
							$scope.$inner.columnWidth = 25;
							break;
						case 5:
							$scope.$inner.columnWidth = 20;
							break;
						case 6:
							$scope.$inner.columnWidth = 16.66;
							break;
						case 7:
							$scope.$inner.columnWidth = 14.28;
							break;
						case 8:
							$scope.$inner.columnWidth = 12.5;
							break;
						case 9:
							$scope.$inner.columnWidth = 11.11;
							break;
						case 10:
							$scope.$inner.columnWidth = 10;
							break;
						case 11:
							$scope.$inner.columnWidth = 9.09;
							break;
						case 12:
							$scope.$inner.columnWidth = 8.33;
							break;
						default:
							$scope.$inner.columnWidth = 100;
						}
						return $scope.$inner.columnWidth;
					};
					$scope.$inner.init();

				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					$scope.$outer.setEditable = function(flag) {
						if (mj.isBoolean(flag)) {
							$.each($scope.$inner.children, function(index, item) {
								item.setEditable(flag);
							});
							$scope.$outer.layout();
						}
					};

					$scope.$inner.build = function() {
						$scope.$outer.setEditable($attrs.editable);
					}

					// 获得form对象中所有控件的value，返回json，键为控件name，值为控件输入值
					$scope.$outer.getValue = function() {
						var json = {};
						$.each($scope.$inner.children, function(index, item) {
							json[item.getName()] = item.getValue();
						});
						return json;
					}

					// 对form下面所有控件进行校验认证，全部通过返回true，有一项不通过返回false
					$scope.$outer.getValidate = function() {
						var flag = true;
						var cun = 0;
						$.each($scope.$inner.children, function(index, item) {
							flag = item.validity();
							if (!flag) {
								cun++;
							}
						});
						if (cun > 0) {
							return false;
						} else {
							return true;
						}
					}
					// 设置form对象中所有控件的value，参数为json，键为控件name，值为控件输入值
					$scope.$outer.setValue = function(json) {
						$.each($scope.$inner.children, function(index, item) {
							var name = item.getName();
							item.setValue(json[name]);
						});
					}
					// 通过form下面某个控件的name返回当前控件
					$scope.$outer.getField = function(name) {
						var field = null;
						$.each($scope.$inner.children, function(index, item) {
							if (item.getName() == name) {
								field = item;
								return false;
							}
						});
						return field;
					}
					// 重置form下面所有控件
					$scope.$outer.reset = function() {
						$.each($scope.$inner.children, function(index, item) {
							if ($.isFunction(item.reset)) {
								item.reset();
							}
						});
					}
					// 在form下面添加控件
					$scope.$outer.addChild = function(item) {
						item.attr({
							"data-form" : "true"
						});
						var _dom = $compile(item)($scope.$new());
						$scope.$inner.body.append(_dom);
						$scope.$outer.layout();
						return $scope.$inner.children[$scope.$inner.children.length - 1];
					}

					/**
					 * 根据元素删除子元素
					 */
					$scope.$outer.removeChild = function(field) {
						var indx = -1;
						$.each($scope.$inner.children, function(index, item) {
							if (item.getId() == field.getId()) {
								indx = index;
								return false;
							}
						});
						if (indx > -1) {
							$scope.$inner.children.splice(indx, 1);
						}
						field.destroy();
						$scope.$outer.layout();
					};

					/**
					 * 根据id删除子元素
					 */
					$scope.$outer.removeChildById = function(id) {
						var indx = -1;
						var field = null;
						$.each($scope.$inner.children, function(index, item) {
							if (item.getId() == id) {
								indx = index;
								field = item;
								return false;
							}
						});
						if (indx > -1) {
							$scope.$inner.children.splice(indx, 1);
							field.destroy();
						}
						$scope.$outer.layout();
					};

					/**
					 * 根据name删除子元素
					 */
					$scope.$outer.removeChildByName = function(name) {
						var indx = -1;
						var field = null;
						$.each($scope.$inner.children, function(index, item) {
							if (item.getName() == name) {
								indx = index;
								field = item;
								return false;
							}
						});
						if (indx > -1) {
							$scope.$inner.children.splice(indx, 1);
							field.destroy();
						}
						$scope.$outer.layout();
					};

					/**
					 * 删除所有元素
					 */
					$scope.$outer.removeChildren = function() {
						$.each($scope.$inner.children, function(index, item) {
							item.destroy();
						});
						$scope.$inner.children.splice(0, $scope.$inner.children.length);
						$scope.$outer.layout();
					};

					$scope.$outer.layout = function() {
						// $scope.$inner.layoutItem();
					};

					/**
					 * 布局子项
					 */
					$scope.$inner.layoutItem = function() {
						var children = $scope.$inner.body.find(".mj-input");
						$.each(children, function(index, child) {
							var item = $(child);
							item.css({
								"width" : $scope.$inner.getColumnWidth() * parseInt(item.attr("data-colspan"), 10)
							});
						});
					};

					$scope.$inner.build();
				}
			}
		}
	});
});

/**
 * 动态添加控件
 */
mj.buildForm = function(opts) {
	var tag = $("<mj-form>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */

mj.module.directive('mjFrame', function($compile) {
	return mj.buildDirective({
		name : "mjFrame",
		compile : function($element, $attrs, $transclude) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.height)) {
							$element.attr({
								"height" : $attrs.height
							});
						}
						if (mj.isNotEmpty($attrs.width)) {
							$element.attr({
								"width" : $attrs.width
							});
						}

						$scope.$outer.setScrollable();

					}

					$scope.$outer.setScrollable = function() {
						if (mj.isNotEmpty($attrs.scrollable)) {
							if (mj.isTrue($attrs.scrollable)) {
								$element.attr({
									"scrolling" : "yes"
								});
							} else if (mj.isFalse($attrs.scrollable)) {
								$element.attr({
									"scrolling" : "no"
								});
							} else {
								$element.attr({
									"scrolling" : "auto"
								});
							}
						}
					};

					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					$scope.$inner.build = function() {
						$scope.$outer.setAction($attrs.view, $attrs.cachable, $attrs.load);
					};

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					

					/**
					 * 设置宽度
					 */
					$scope.$outer.setWidth = function(width) {
						$element.attr({
							"width" : width
						});
					};

					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};
					
					/**
					 * 设置高度
					 */
					$scope.$outer.setHeight = function(height) {
						$element.attr({
							"height" : height
						});
					};
					
					/**
					 * 设置滚动条
					 */
					$scope.$outer.setScrollable = function(scroll) {
						$element.attr({
							"scrolling" : scroll
						});
					};


					/**
					 * 设置ACTION
					 */
					$scope.$outer.setAction = function(view, cachable, loadFunc) {
						if (mj.isNotEmpty(view)) {
							if (mj.isTrue(cachable)) {
								if (view.indexOf("?") > -1) {
									var date = new Date();
									$element.attr({
										"src" : view + "&_timestamp=" + date.getTime()
									});
								} else {
									$element.attr({
										"src" : view
									});
								}
							} else {
								$element.attr({
									"src" : view
								});
							}
							if (mj.isNotEmpty(loadFunc)) {
								var func = null;
								if ($.isFunction(loadFunc)) {
									func = loadFunc;
								} else if ($.isFunction(mj.findCtrlScope($scope)[loadFunc])) {
									func = mj.findCtrlScope($scope)[loadFunc];
								}
								if ($.isFunction(func)) {
									$element.on("load", function() {
										func($scope.$outer);
									});
								}
							}
						}
					};

					$scope.$inner.build();
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildFrame = function(opts) {
	var tag = $("<mj-frame>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */

mj.module.directive('mjGrid', function($compile) {
	return mj.buildDirective({
		name : "mjGrid",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.children = [];
					$scope.$inner.addChild = function(sc, el, rs) {
						rs.opts = $scope.$inner.child_opts;
						$scope.$inner.children.push({
							"sc" : sc,
							"el" : el,
							"rs" : rs
						});
					};

					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						$element.parent().css({
							"text-align" : "center"
						});
						if ($attrs.border == "false" || $attrs.border == false) {
							$element.css({
								"border" : "none"
							});
						}
						if (mj.isNotEmpty($attrs.height)) {
							$element.css({
								"height" : $attrs.height
							});
						}
						if (mj.isNotEmpty($attrs.width)) {
							$element.css({
								"width" : $attrs.width
							});
						}
						$scope.$inner.getColumnWidth();
					};
					$scope.$inner.getColumnWidth = function() {
						switch (parseInt($attrs.column, 10)) {
						case 1:
							$scope.$inner.columnWidth = 100;
							break;
						case 2:
							$scope.$inner.columnWidth = 50;
							break;
						case 3:
							$scope.$inner.columnWidth = 33.33;
							break;
						case 4:
							$scope.$inner.columnWidth = 25;
							break;
						case 5:
							$scope.$inner.columnWidth = 20;
							break;
						case 6:
							$scope.$inner.columnWidth = 16.66;
							break;
						case 7:
							$scope.$inner.columnWidth = 14.28;
							break;
						case 8:
							$scope.$inner.columnWidth = 12.5;
							break;
						case 9:
							$scope.$inner.columnWidth = 11.11;
							break;
						case 10:
							$scope.$inner.columnWidth = 10;
							break;
						case 11:
							$scope.$inner.columnWidth = 9.09;
							break;
						case 12:
							$scope.$inner.columnWidth = 8.33;
							break;
						default:
							$scope.$inner.columnWidth = 100;
						}
						return $scope.$inner.columnWidth;
					};
					$scope.$inner.getColumn = function() {
						if ($.isNumeric($attrs.column)) {
							return $attrs.column;
						} else {
							return 1;
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					$scope.$inner.build = function() {
						$.each($scope.$inner.children, function(index, child) {
							child.el.addClass();
						});
					};

					$scope.$outer.layout = function() {
						// $scope.$inner.layoutItem();
					};

					/**
					 * 布局子项
					 */
					$scope.$inner.layoutItem = function() {
						$.each($scope.$inner.children, function(index, child) {
							var width = $scope.$inner.columnWidth * parseInt(child.rs.colspan, 10) + "%";
							child.el.width(width);
						});
					};

					/**
					 * 添加子元素
					 */
					$scope.$outer.addChild = function(opt, layoutFlag) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						$scope.$inner.child_opts = opt;
						var iview = $scope.$inner.buildGridItem(opt);
						var _dom = $compile(iview)($scope.$new());
						$element.append(_dom);
						$scope.$outer.layout();
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 内部布局
					 */
					$scope.$inner.layout = function() {
						var parent = $scope.$parent;
						while (parent != null) {
							if ($.isFunction(parent.$outer.layout)) {
								parent.$outer.layout();
								return;
							} else {
								parent = parent.$parent;
							}
						}
					};

					/**
					 * 批量添加子元素
					 */
					$scope.$outer.addChildren = function(opts) {
						if (!$.isArray(opts)) {
							throw "非Array对象，请检查...";
							return;
						}
						$.each(opts, function(index, opt) {
							$scope.$outer.addChild(opt, false);
						});
						$scope.$outer.layout();
					};

					/**
					 * 动态构建控件
					 */
					$scope.$inner.buildGridItem = function(opts) {
						var tag = $("<mj-grid-item>");
						$.each(opts, function(key, value) {
							if (!$.isFunction(value)) {
								tag.attr("data-" + key, value);
							}
						});
						return tag;
					};

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$element.addClass(cls);
					};

					/**
					 * 删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$element.removeClass(cls);
					};

					/**
					 * 获取子元素
					 */
					$scope.$outer.getChildren = function() {
						var children = [];
						$.each($scope.$inner.children, function(index, child) {
							children.push(child.sc.$outer);
						});
						return children;
					};

					/**
					 * 根据索引获取子元素
					 */
					$scope.$outer.getChildByIndex = function(index) {
						$scope.$inner.children[index].sc.$outer;
					};

					/**
					 * 根据主键获取子元素
					 */
					$scope.$outer.getChildById = function(id) {
						var _child = null;
						$.each($scope.$inner.children, function(index, child) {
							if (child.rs.id == id) {
								_child = child.sc.$outer;
								return false;
							}
						});
						return _child;
					};

					/**
					 * 根据主键删除子元素
					 */
					$scope.$outer.removeChildById = function(id) {
						var _child = null;
						var _index = -1;
						$.each($scope.$inner.children, function(index, child) {
							if (child.rs.id == id) {
								_child = child;
								_index = index;
								return false;
							}
						});
						if (mj.isNotEmpty(_child)) {
							$scope.$inner.children.splice(_index, 1);
							_child.sc.$outer.destroy();
						}
						$scope.$outer.layout();
					};

					/**
					 * 删除所有元素
					 */
					$scope.$outer.removeChildren = function() {
						$.each($scope.$inner.children, function(index, child) {
							child.sc.$outer.destroy();
						});
						if ($scope.$inner.children.length > 0) {
							$scope.$inner.children.splice(0, $scope.$inner.children.length);
						}
						$scope.$outer.layout();
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : color
							});
						}
					};
				}
			}
		}
	});
});

mj.module.directive('mjGridItem', function($compile) {
	return mj.buildDirective({
		name : "mjGridItem",
		require : [ '^?mjGrid' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNumber($attrs.height)) {
							$element.css({
								"height" : $attrs.height
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var gridScope = $scope.$parent.$parent;
					gridScope.$inner.addChild($scope, $element, $attrs);
					$scope.$inner.build = function() {
						if (mj.isEmpty($attrs.colspan)) {
							$attrs.colspan = 1;
						}
						if ($attrs.colspan < 1) {
							$attrs.colspan = 1;
						}
						if ($attrs.colspan > gridScope.$inner.getColumn()) {
							$attrs.colspan = gridScope.$inner.getColumn();
						}
						var width = gridScope.$inner.getColumnWidth() * parseInt($attrs.colspan, 10) + "%";
						$element.width(width);

						if (!mj.isEmpty($attrs.opts)) {
							if (!mj.isEmpty($attrs.opts.render)) {
								if ($.isFunction($attrs.opts.render)) {
									var iview = $attrs.opts.render($attrs.opts.dataset);
									var _dom = $compile(iview)($scope.$new());
									$element.append(iview);
								}
							}
						}
					};
					$scope.$inner.build();

					/**
					 * 添加子元素
					 */
					$scope.$outer.addChild = function(child) {
						if (!mj.isEmpty(child)) {
							var _dom = $compile(child)($scope.$new());
							$element.append(_dom);
						}
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 内部布局
					 */
					$scope.$inner.layout = function() {
						var parent = $scope.$parent;
						while (parent != null) {
							if ($.isFunction(parent.$outer.layout)) {
								parent.$outer.layout();
								return;
							} else {
								parent = parent.$parent;
							}
						}
					};

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$element.addClass(cls);
					};

					/**
					 * 删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$element.removeClass(cls);
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : color
							});
						}
					};
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildGrid = function(opts) {
	var tag = $("<mj-grid>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

/**
 * 动态构建控件
 */
mj.buildGridItem = function(opts) {
	var tag = $("<mj-grid-item>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */

mj.module.directive('mjHbox', function($compile) {
	return mj.buildDirective({
		name : "mjHbox",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.children = [];
					$scope.$inner.addChild = function(sc, el, rs) {
						$scope.$inner.children.push({
							"sc" : sc,
							"el" : el,
							"rs" : rs
						});
					};
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.height)) {
							$element.css({
								"height" : $attrs.height
							});
						}
						if (mj.isNotEmpty($attrs.width)) {
							$element.css({
								"width" : $attrs.width
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					/**
					 * 内部方法：构建函数
					 */
					$scope.$inner.build = function() {
						if ($.isNumeric($attrs.split)) {
							$.each($scope.$inner.children, function(index, item) {
								var split = $(mj.templates.mjHboxSplit);
								split.css({
									"width" : $attrs.split
								});
								if (index != $scope.$inner.children.length - 1) {
									split.insertAfter(item.el);
								}
								if (mj.isTrue(item.rs.hidden)) {
									split.css({
										"display" : "none"
									});
								}
							});
						}
					};

					/**
					 * 内部方法：获取滚动内容
					 */
					$scope.$inner.getScroll = function(item) {
						return item.el.find(".mj-hbox-scroll").first();
					};

					/**
					 * 外部布局：布局方法
					 */
					$scope.$outer.layout = function() {
						$.each($scope.$inner.children, function(index, item) {
							var scroll = $scope.$inner.getScroll(item);
							scroll.css({
								"display" : "none"
							});
						});
						$.each($scope.$inner.children, function(index, item) {
							if (mj.isFalse(item.rs.hiddenFlag)) {
								if (mj.isNotEmpty(item.rs.width)) {
									item.el.width(item.rs.width);
								}
								var scroll = $scope.$inner.getScroll(item);
								if ($attrs.height != "auto") {
									scroll.css({
										"height" : scroll.parent().innerHeight(),
									});
								}
								scroll.css({
									"display" : "block"
								});
							}
						});
						mj.layoutView($attrs.id);
					};

					$scope.$inner.build();

					/**
					 * 外部方法：添加子元素
					 */
					$scope.$outer.addChild = function(opt) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						var iview = mj.buildHboxItem(opt);
						var _dom = $compile(iview)($scope.$new());
						$element.append(_dom);
						$scope.$outer.layout();
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 外部方法：批量添加子元素
					 */
					$scope.$outer.addChildren = function(opts) {
						if (!$.isArray(opts)) {
							throw "非Array对象，请检查...";
							return;
						}
						$.each(opts, function(index, opt) {
							$scope.$outer.addChild(opt);
						});
						$scope.$outer.layout();
					};

					/**
					 * 外部方法：获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 外部方法：获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 外部方法：添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$element.addClass(cls);
					};

					/**
					 * 外部方法：删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$element.removeClass(cls);
					};

					/**
					 * 外部方法：获取子元素
					 */
					$scope.$outer.getChildren = function() {
						var children = [];
						$.each($scope.$inner.children, function(index, child) {
							children.push(child.sc.$outer);
						});
						return children;
					};

					/**
					 * 外部方法：根据索引获取子元素
					 */
					$scope.$outer.getChildByIndex = function(index) {
						if ($scope.$inner.children[index - 1]) {
							return $scope.$inner.children[index - 1].sc.$outer;
						} else {
							return null;
						}
					};

					/**
					 * 外部方法：根据id获取子元素
					 */
					$scope.$outer.getChildById = function(id) {
						var _$outer = null;
						$.each($scope.$inner.children, function(index, child) {
							if (child.rs.id == id) {
								_$outer = child.sc.$outer;
								return false;
							}
						});
						return _$outer;
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
				}
			}
		}
	});
});

mj.module.directive('mjHboxItem', function($compile) {
	return mj.buildDirective({
		name : "mjHboxItem",
		require : [ '^?mjHbox' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$attrs.hiddenFlag = false;
					$scope.$inner.scroll = $element.find(".mj-hbox-scroll").first();
					var pScope = $scope.$inner.getParentScope();
					$scope.$inner.init = function() {

						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}

						if (mj.isNotEmpty($attrs.padding)) {
							$scope.$inner.scroll.css({
								"padding" : $attrs.padding
							});
						}

						if (mj.isTrue($attrs.hidden) || mj.isTrue($attrs.hidable)) {
							$attrs.hiddenFlag = true;
							$element.css({
								"display" : "none"
							});
						}
						
						if (mj.isFalse(pScope.$outer.getAttrs().border)) {
							$element.css({
								"border" : "none"
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var pScope = $scope.$inner.getParentScope();
					pScope.$inner.addChild($scope, $element, $attrs);

					/**
					 * 外部方法：添加子元素
					 */
					$scope.$outer.addChild = function(child) {
						if (!mj.isEmpty(child)) {
							var _dom = $compile(child)($scope.$new());
							$scope.$inner.body.append(_dom);
						}
						pScope.$outer.layout();
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 外部方法：隐藏函数
					 */
					$scope.$outer.hide = function() {
						if (mj.isTrue($attrs.hiddenFlag)) {
							return;
						}
						$attrs.hiddenFlag = true;
						$element.hide();
						if (mj.isNumber(pScope.$outer.getAttrs().split)) {
							if (mj.isNotEmpty($element.next())) {
								$element.next().css({
									"display" : "none"
								});
							} else {
								$element.prev().css({
									"display" : "none"
								});
							}
						}
						pScope.$outer.layout();
					};

					/**
					 * 外部方法：显示函数
					 */
					$scope.$outer.show = function() {
						if (mj.isFalse($attrs.hiddenFlag)) {
							return;
						}
						$attrs.hiddenFlag = false;
						$element.show();
						if (mj.isNumber(pScope.$outer.getAttrs().split)) {
							if (mj.isNotEmpty($element.next())) {
								$element.next().css({
									"display" : "table-cell"
								});
							} else {
								$element.prev().css({
									"display" : "table-cell"
								});
							}
						}
						pScope.$outer.layout();
					};

					/**
					 * 外部方法：获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $scope.$inner.scroll.width();
					};
					/**
					 * 外部方法：获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $scope.$inner.scroll.height();
					};

					/**
					 * 外部方法：添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$element.addClass(cls);
					};

					/**
					 * 外部方法：删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$element.removeClass(cls);
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildHbox = function(opts) {
	var tag = $("<mj-hbox>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildHboxItem = function(opts) {
	var tag = $("<mj-hbox-item>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};mj.module.directive('mjInclude', function($compile, $templateRequest) {
	return mj.buildDirective({
		name : "mjInclude",
		compile : function($element, $attrs, $transclude) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);

					/**
					 * 加载相关文件
					 */
					$scope.$inner.loadResource = function() {
						// 加载相关文件
						if (!mj.isEmpty($attrs.view) && !mj.isEmpty($attrs.controller)) {
							mj.loadResource($attrs.view, $attrs.controller, $attrs.controllerAlias);
						}
					};
					$scope.$inner.loadResource();
					/**
					 * 初始化函数
					 */
					$scope.$inner.init = function() {
						if ($attrs.switchFlag == true || $attrs.switchFlag == "true") {
							$scope.$inner.switchFlag = true;
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					/**
					 * 判断是否有控制器
					 */
					$scope.$outer.hasController = function() {
						if (mj.isEmpty($attrs.view) || mj.isEmpty($attrs.controller)) {
							return false;
						} else {
							return true;
						}
					};

					/**
					 * 布局函数
					 */
					$scope.$outer.layout = function() {
						var body = $element.find(".mj-include-body:first-child");
						if ($.isEmptyObject($attrs.height)) {
							body.css({
								"display" : "none"
							});
							body.css({
								"display" : "block"
							});
						}
					};

					/**
					 * 内部构建函数
					 */
					$scope.$inner.build = function() {
						$templateRequest($attrs.view).then(function(html) {
							var body = $('<div class="mj-include-body"></div>');
							if ($scope.$outer.hasController()) {
								if (mj.isEmpty($attrs.controllerAlias)) {
									body.attr("ng-controller", $attrs.controller);
								} else {
									body.attr("ng-controller", $attrs.controllerAlias);
								}
							}
							body.html(html);
							var _dom = $compile(body)($scope.$new());
							$element.append(_dom);
							$scope.$inner.buildParam();
							mj.layoutView($attrs.id);
						});
					};

					/**
					 * 内部参数构建函数
					 */
					$scope.$inner.buildParam = function() {
						if ($scope.$outer.hasController()) {
							var childScope = $scope.$$childHead.$$childHead;
							childScope.$ctrlName = $attrs.controller;
							if (!mj.isEmpty($attrs.load)) {
								var func = childScope[$attrs.load];
								if (!mj.isEmpty($attrs.param)) {
									var parentScope = mj.findCtrlScope($scope);
									if ($scope.$inner.switchFlag) {
										var _p = mj.includeMap[$attrs.id];
										if (!mj.isEmpty(_p)) {
											delete mj.includeMap[$attrs.id];
										}
										if ($.isFunction(func)) {
											func(_p);
										}
									} else {// 切换时候传参
										if ($.isFunction(func)) {
											func(parentScope[$attrs.param]);
										}
									}
								} else {
									if ($.isFunction(func)) {
										func();
									}
								}
							}
						}
					};

					/**
					 * 切换视图函数
					 */
					$scope.$outer.switchView = function(opts) {
						$scope.$inner.switchFlag = true;
						$attrs.view = opts.view;
						$attrs.controller = opts.controller;
						$attrs.load = opts.load;
						$attrs.param = opts.param;
						mj.includeMap[$attrs.id] = opts.param;
						var children = $element.find("*[data-tag*='mj']");
						for (var i = children.length - 1; i >= 0; i--) {
							var view = mj.getView($(children[i]).attr("id"));
							if (!mj.isEmpty(view)) {
								if ($.isFunction(view.destroy)) {
									view.destroy();
								}
							}
						}
						$element.empty();
						delete $scope.$$childHead;
						if ($scope.$$childHead) {
							$scope.$$childHead = null;
						}
						$scope.$inner.loadResource();
						$scope.$inner.build();
					};
					$scope.$inner.build();

					/**
					 * 外部方法：获取子节点
					 */
					$scope.$outer.getChildren = function() {
						return [ $scope.$$childHead.$$childHead.$$childHead.$outer ];
					};
				}
			}
		}
	});
});

mj.buildInclude = function(opts) {
	var tag = $("<mj-include>");
	if (mj.isEmpty(opts.id)) {
		opts.id = mj.key();
	}
	if (mj.checkView(opts.id)) {
		throw "[" + opts.id + "]：已存在，id不能重复，请检查...";
	}
	if (!mj.isEmpty(opts.param)) {
		mj.includeMap[opts.id] = opts.param;
	}
	// delete opts.param;
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	tag.attr("data-switch-flag", "true");
	return tag;
};/**
 * 
 */
mj.module.directive('mjLayout', function($compile) {
	return mj.buildDirective({
		name : "mjLayout",
		transclude : {
			'north' : '?mjLayoutNorth',
			'south' : '?mjLayoutSouth',
			'center' : 'mjLayoutCenter',
			'east' : '?mjLayoutEast',
			'west' : '?mjLayoutWest'
		},
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.children = {};
					$scope.$inner.addNorth = function(el, rs, sc) {
						$scope.$inner.children.north = {
							"el" : el,
							"rs" : rs,
							"sc" : sc
						};
					};
					$scope.$inner.addSouth = function(el, rs, sc) {
						$scope.$inner.children.south = {
							"el" : el,
							"rs" : rs,
							"sc" : sc
						};
					};
					$scope.$inner.addCenter = function(el, rs, sc) {
						$scope.$inner.children.center = {
							"el" : el,
							"rs" : rs,
							"sc" : sc
						};
					};
					$scope.$inner.addEast = function(el, rs, sc) {
						$scope.$inner.children.east = {
							"el" : el,
							"rs" : rs,
							"sc" : sc
						};
					};
					$scope.$inner.addWest = function(el, rs, sc) {
						$scope.$inner.children.west = {
							"el" : el,
							"rs" : rs,
							"sc" : sc
						};
					};
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNumber($attrs.height)) {
							$element.css({
								"height" : $attrs.height
							});
						}
						if (mj.isNumber($attrs.width)) {
							$element.css({
								"width" : $attrs.width
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost($scope.$outer, $scope, $element, $attrs);
					$scope.$inner.north = $scope.$inner.children.north;
					$scope.$inner.south = $scope.$inner.children.south;
					$scope.$inner.west = $scope.$inner.children.west;
					$scope.$inner.east = $scope.$inner.children.east;
					$scope.$inner.center = $scope.$inner.children.center;

					if ($.isEmptyObject($scope.$inner.center)) {
						throw "[mjLayoutCenter]：不能为空，请检查...";
					}

					/**
					 * 内部隐藏视图函数
					 */
					$scope.$inner.hideView = function(node) {
						if (!$.isEmptyObject(node)) {
							if (mj.isTrue(node.sc.$inner.hidden)) {
								return;
							}
							node.el.css({
								"display" : "none"
							});
						}
					};

					/**
					 * 内部显示视图函数
					 */
					$scope.$inner.showView = function(node, name) {
						if (!$.isEmptyObject(node)) {
							if (mj.isTrue(node.sc.$inner.hidden)) {
								return;
							}
							node.el.css({
								"height" : node.el.parent().innerHeight()
							});
							node.el.css({
								"display" : "block"
							});
						}
					};

					/**
					 * 布局函数
					 */
					$scope.$outer.layout = function() {
						$.each($scope.$inner.children, function(key, value) {
							$scope.$inner.hideView(value);
						});
						$scope.$inner.center.el.parent().height(0);
						var body = $element.find(".mj-layout-body").first();
						body.css({
							"display" : "none"
						});
						$scope.$inner.showView($scope.$inner.north, "north");
						$scope.$inner.showView($scope.$inner.south, "south");
						body.css({
							"display" : "table-cell",
						});
						var height = body.innerHeight();
						$scope.$inner.center.el.parent().height(height);
						$scope.$inner.showView($scope.$inner.east, "east");
						$scope.$inner.showView($scope.$inner.west, "west");
						$scope.$inner.showView($scope.$inner.center, "center");
						mj.layoutView($attrs.id);
					};

					$scope.$inner.switcher = function() {
						$.each($scope.$inner.children, function(key, child) {
							if (mj.isFalse(child.rs.showable)) {
								if (key != "center") {
									var _switch = null;
									if (key == "west" || key == "east") {
										_switch = child.el.next().find(".mj-layout-split-v-switch").first();
									} else {
										_switch = child.el.next().find(".mj-layout-split-h-switch").first();
									}
									if (mj.isNotEmpty(_switch)) {
										_switch.click();
									}
								}

							}
						});
					};

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 获取north对象
					 */
					$scope.$outer.getNorth = function() {
						if (mj.isEmpty($scope.$inner.north)) {
							return null;
						} else {
							return $scope.$inner.north.sc.$outer;
						}
					};

					/**
					 * 获取south对象
					 */
					$scope.$outer.getSouth = function() {
						if (mj.isEmpty($scope.$inner.south)) {
							return null;
						} else {
							return $scope.$inner.south.sc.$outer;
						}
					};

					/**
					 * 获取east对象
					 */
					$scope.$outer.getEast = function() {
						if (mj.isEmpty($scope.$inner.east)) {
							return null;
						} else {
							return $scope.$inner.east.sc.$outer;
						}
					};

					/**
					 * 获取west对象
					 */
					$scope.$outer.getWest = function() {
						if (mj.isEmpty($scope.$inner.west)) {
							return null;
						} else {
							return $scope.$inner.west.sc.$outer;
						}
					};

					/**
					 * 获取center对象
					 */
					$scope.$outer.getCenter = function() {
						if (mj.isEmpty($scope.$inner.center)) {
							return null;
						} else {
							return $scope.$inner.center.sc.$outer;
						}
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
				}
			}
		}
	});
});

mj.module.directive('mjLayoutNorth', function($compile) {
	return mj.buildDirective({
		name : "mjLayoutNorth",
		require : [ '^?mjLayout' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.hArray = [ "left", "right", "center" ];
					$scope.$inner.vArray = [ "top", "bottom", "middle" ];
					$scope.$inner.cell = $element.parent();
					$scope.$inner.row = $element.parent().parent();
					$scope.$inner.switcher = $scope.$inner.row.next().find(".mj-layout-switch").first();
					$scope.$inner.hidden = false;
					$scope.$inner.init = function() {

						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$scope.$inner.cell.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.padding)) {
							$scope.$inner.cell.css({
								"padding" : $attrs.padding
							});
						}
						if ($attrs.border == "false") {
							$scope.$inner.cell.css({
								"border" : "none"
							});
						}
						if (mj.isNumber($attrs.height)) {
							$scope.$inner.cell.css({
								"height" : $attrs.height
							});
						}

						$element.css({
							"height" : $scope.$inner.cell.innerHeight()
						});

						$scope.$inner.row.next().css({
							"display" : "table-row"
						});

						if (mj.isTrue($attrs.hidable) || mj.isTrue($attrs.hidden)) {
							$scope.$inner.hidden = true;
							$scope.$inner.switcher.removeClass("fa-caret-up");
							$scope.$inner.switcher.addClass("fa-caret-down");
						} else {
							$scope.$inner.hidden = false;
							$scope.$inner.row.css({
								"display" : "table-row"
							});
						}

						if ($.inArray($attrs.horizontal, $scope.$inner.hArray) > -1) {
							$scope.$inner.cell.css({
								"text-align" : $attrs.horizontal
							});
						}
						if ($.inArray($attrs.vertical, $scope.$inner.vArray) > -1) {
							$scope.$inner.cell.css({
								"vertical-align" : $attrs.vertical
							});
						}
						if (mj.isTrue($attrs["switch"])) {
							$scope.$inner.switcher.css({
								"display" : "inline-block"
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var layoutScope = $scope.$inner.getParentScope();
					layoutScope.$inner.addNorth($element, $attrs, $scope);

					$scope.$inner.build = function() {
						$scope.$inner.buildSwitcher();
					};

					$scope.$inner.buildSwitcher = function() {
						$scope.$inner.switcher.on("click", function() {
							if (mj.isTrue($scope.$inner.hidden)) {
								$scope.$inner.row.css({
									"display" : "table-row"
								});
								$scope.$inner.switcher.removeClass("fa-caret-down");
								$scope.$inner.switcher.addClass("fa-caret-up");
								$scope.$inner.hidden = false;
							} else {
								$scope.$inner.row.css({
									"display" : "none"
								});
								$scope.$inner.switcher.removeClass("fa-caret-up");
								$scope.$inner.switcher.addClass("fa-caret-down");
								$scope.$inner.hidden = true;
							}
							layoutScope.$outer.layout();
						});
					}

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};
					/**
					 * 显示
					 */
					$scope.$outer.show = function() {
						if (mj.isTrue($scope.$inner.hidden)) {
							$scope.$inner.switcher.click();
						}
					};

					/**
					 * 隐藏
					 */
					$scope.$outer.hide = function() {
						if (mj.isFalse($scope.$inner.hidden)) {
							$scope.$inner.switcher.click();
						}
					};
					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$scope.$inner.cell.css({
								"background-color" : color
							});
						}
					};

					$scope.$inner.build();
				}
			}
		}
	});
});

mj.module.directive('mjLayoutSouth', function($compile) {
	return mj.buildDirective({
		name : "mjLayoutSouth",
		require : [ '^?mjLayout' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.hArray = [ "left", "right", "center" ];
					$scope.$inner.vArray = [ "top", "bottom", "middle" ];
					$scope.$inner.cell = $element.parent();
					$scope.$inner.row = $element.parent().parent();
					$scope.$inner.switcher = $scope.$inner.row.prev().find(".mj-layout-switch").first();
					$scope.$inner.hidden = false;
					$scope.$inner.init = function() {

						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$scope.$inner.cell.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.padding)) {
							$scope.$inner.cell.css({
								"padding" : $attrs.padding
							});
						}
						if ($attrs.border == "false") {
							$scope.$inner.cell.css({
								"border" : "none"
							});
						}
						if (mj.isNumber($attrs.height)) {
							$scope.$inner.cell.css({
								"height" : $attrs.height
							});
						}

						$element.css({
							"height" : $scope.$inner.cell.innerHeight()
						});

						$scope.$inner.row.prev().css({
							"display" : "table-row"
						});

						if (mj.isTrue($attrs.hidable) || mj.isTrue($attrs.hidden)) {
							$scope.$inner.hidden = true;
							$scope.$inner.switcher.removeClass("fa-caret-up");
							$scope.$inner.switcher.addClass("fa-caret-down");
						} else {
							$scope.$inner.hidden = false;
							$scope.$inner.row.css({
								"display" : "table-row"
							});
						}

						if ($.inArray($attrs.horizontal, $scope.$inner.hArray) > -1) {
							$scope.$inner.cell.css({
								"text-align" : $attrs.horizontal
							});
						}
						if ($.inArray($attrs.vertical, $scope.$inner.vArray) > -1) {
							$scope.$inner.cell.css({
								"vertical-align" : $attrs.vertical
							});
						}
						if (mj.isTrue($attrs["switch"])) {
							$scope.$inner.switcher.css({
								"display" : "inline-block"
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var layoutScope = $scope.$inner.getParentScope();
					layoutScope.$inner.addSouth($element, $attrs, $scope);

					$scope.$inner.build = function() {
						$scope.$inner.buildSwitcher();
					};

					$scope.$inner.buildSwitcher = function() {
						$scope.$inner.switcher.on("click", function() {
							if (mj.isTrue($scope.$inner.hidden)) {
								$scope.$inner.row.css({
									"display" : "table-row"
								});
								$scope.$inner.switcher.removeClass("fa-caret-up");
								$scope.$inner.switcher.addClass("fa-caret-down");
								$scope.$inner.hidden = false;
							} else {
								$scope.$inner.row.css({
									"display" : "none"
								});
								$scope.$inner.switcher.removeClass("fa-caret-down");
								$scope.$inner.switcher.addClass("fa-caret-up");
								$scope.$inner.hidden = true;
							}
							layoutScope.$outer.layout();
						});
					}

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 显示
					 */
					$scope.$outer.show = function() {
						if (mj.isTrue($scope.$inner.hidden)) {
							$scope.$inner.switcher.click();
						}
					};

					/**
					 * 隐藏
					 */
					$scope.$outer.hide = function() {
						if (mj.isFalse($scope.$inner.hidden)) {
							$scope.$inner.switcher.click();
						}
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$scope.$inner.cell.css({
								"background-color" : color
							});
						}
					};

					$scope.$inner.build();
				}
			}
		}
	});
});

mj.module.directive('mjLayoutEast', function($compile) {
	return mj.buildDirective({
		name : "mjLayoutEast",
		require : [ '^?mjLayout' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.hArray = [ "left", "right", "center" ];
					$scope.$inner.vArray = [ "top", "bottom", "middle" ];
					$scope.$inner.cell = $element.parent();
					$scope.$inner.switcher = $scope.$inner.cell.prev().find(".mj-layout-switch").first();
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$scope.$inner.cell.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.padding)) {
							$scope.$inner.cell.css({
								"padding" : $attrs.padding
							});
						}
						if ($attrs.border == "false") {
							$scope.$inner.cell.css({
								"border" : "none"
							});
						}
						if (mj.isNumber($attrs.width)) {
							$scope.$inner.cell.css({
								"width" : $attrs.width
							});
						}
						$element.css({
							"height" : $scope.$inner.cell.innerHeight()
						});

						if ($.inArray($attrs.horizontal, $scope.$inner.hArray) > -1) {
							$scope.$inner.cell.css({
								"text-align" : $attrs.horizontal
							});
						}
						if ($.inArray($attrs.vertical, $scope.$inner.vArray) > -1) {
							$scope.$inner.cell.css({
								"vertical-align" : $attrs.vertical
							});
						}

						$scope.$inner.cell.prev().css({
							"display" : "table-cell"
						});

						if (mj.isTrue($attrs.hidable) || mj.isTrue($attrs.hidden)) {
							$scope.$inner.hidden = true;
							$scope.$inner.switcher.removeClass("fa-caret-right");
							$scope.$inner.switcher.addClass("fa-caret-left");
						} else {
							$scope.$inner.hidden = false;
							$scope.$inner.cell.css({
								"display" : "table-cell"
							});
						}

						if (mj.isTrue($attrs["switch"])) {
							$scope.$inner.switcher.css({
								"display" : "inline-block"
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var layoutScope = $scope.$inner.getParentScope();
					layoutScope.$inner.addEast($element, $attrs, $scope);

					$scope.$inner.build = function() {
						$scope.$inner.buildSwitcher();
					};

					$scope.$inner.buildSwitcher = function() {
						$scope.$inner.switcher.on("click", function() {
							if (mj.isTrue($scope.$inner.hidden)) {
								$scope.$inner.cell.css({
									"display" : "table-cell"
								});
								$scope.$inner.switcher.removeClass("fa-caret-left");
								$scope.$inner.switcher.addClass("fa-caret-right");
								$scope.$inner.hidden = false;
							} else {
								$scope.$inner.cell.css({
									"display" : "none"
								});
								$scope.$inner.switcher.removeClass("fa-caret-right");
								$scope.$inner.switcher.addClass("fa-caret-left");
								$scope.$inner.hidden = true;
							}
							layoutScope.$outer.layout();
						});
					}

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 显示
					 */
					$scope.$outer.show = function() {
						if (mj.isTrue($scope.$inner.hidden)) {
							$scope.$inner.switcher.click();
						}
					};

					/**
					 * 隐藏
					 */
					$scope.$outer.hide = function() {
						if (mj.isFalse($scope.$inner.hidden)) {
							$scope.$inner.switcher.click();
						}
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$scope.$inner.cell.css({
								"background-color" : color
							});
						}
					};

					$scope.$inner.build();
				}
			}
		}
	});
});

mj.module.directive('mjLayoutWest', function($compile) {
	return mj.buildDirective({
		name : "mjLayoutWest",
		require : [ '^?mjLayout' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.hArray = [ "left", "right", "center" ];
					$scope.$inner.vArray = [ "top", "bottom", "middle" ];
					$scope.$inner.cell = $element.parent();
					$scope.$inner.switcher = $scope.$inner.cell.next().find(".mj-layout-switch").first();
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$scope.$inner.cell.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.padding)) {
							$scope.$inner.cell.css({
								"padding" : $attrs.padding
							});
						}
						if ($attrs.border == "false") {
							$scope.$inner.cell.css({
								"border" : "none"
							});
						}
						if (mj.isNumber($attrs.width)) {
							$scope.$inner.cell.css({
								"width" : $attrs.width
							});
						}
						$element.css({
							"height" : $scope.$inner.cell.innerHeight()
						});

						if ($.inArray($attrs.horizontal, $scope.$inner.hArray) > -1) {
							$scope.$inner.cell.css({
								"text-align" : $attrs.horizontal
							});
						}
						if ($.inArray($attrs.vertical, $scope.$inner.vArray) > -1) {
							$scope.$inner.cell.css({
								"vertical-align" : $attrs.vertical
							});
						}

						$scope.$inner.cell.next().css({
							"display" : "table-cell"
						});

						if (mj.isTrue($attrs.hidable) || mj.isTrue($attrs.hidden)) {
							$scope.$inner.hidden = true;
							$scope.$inner.switcher.removeClass("fa-caret-right");
							$scope.$inner.switcher.addClass("fa-caret-left");
						} else {
							$scope.$inner.hidden = false;
							$scope.$inner.cell.css({
								"display" : "table-cell"
							});
						}

						if (mj.isTrue($attrs["switch"])) {
							$scope.$inner.switcher.css({
								"display" : "inline-block"
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var layoutScope = $scope.$inner.getParentScope();
					layoutScope.$inner.addWest($element, $attrs, $scope);

					$scope.$inner.build = function() {
						$scope.$inner.buildSwitcher();
					};

					$scope.$inner.buildSwitcher = function() {
						$scope.$inner.switcher.on("click", function() {
							if (mj.isTrue($scope.$inner.hidden)) {
								$scope.$inner.cell.css({
									"display" : "table-cell"
								});
								$scope.$inner.switcher.removeClass("fa-caret-right");
								$scope.$inner.switcher.addClass("fa-caret-left");
								$scope.$inner.hidden = false;
							} else {
								$scope.$inner.cell.css({
									"display" : "none"
								});
								$scope.$inner.switcher.removeClass("fa-caret-left");
								$scope.$inner.switcher.addClass("fa-caret-right");
								$scope.$inner.hidden = true;
							}
							layoutScope.$outer.layout();
						});
					}

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 显示
					 */
					$scope.$outer.show = function() {
						if (mj.isTrue($scope.$inner.hidden)) {
							$scope.$inner.switcher.click();
						}
					};

					/**
					 * 隐藏
					 */
					$scope.$outer.hide = function() {
						if (mj.isFalse($scope.$inner.hidden)) {
							$scope.$inner.switcher.click();
						}
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$scope.$inner.cell.css({
								"background-color" : color
							});
						}
					};

					$scope.$inner.build();
				}
			}
		}
	});
});

mj.module.directive('mjLayoutCenter', function($compile) {
	return mj.buildDirective({
		name : "mjLayoutCenter",
		require : [ '^?mjLayout' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.hArray = [ "left", "right", "center" ];
					$scope.$inner.vArray = [ "top", "bottom", "middle" ];
					$scope.$inner.cell = $element.parent();
					/**
					 * 初始化函数
					 */
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$scope.$inner.cell.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.padding)) {
							$scope.$inner.cell.css({
								"padding" : $attrs.padding
							});
						}
						if (mj.isFalse($attrs.border)) {
							$scope.$inner.cell.css({
								"border" : "none"
							});
						}
						$element.css({
							"height" : $scope.$inner.cell.innerHeight()
						});
						if ($.inArray($attrs.horizontal, $scope.$inner.hArray) > -1) {
							$scope.$inner.cell.css({
								"text-align" : $attrs.horizontal
							});
						}
						if ($.inArray($attrs.vertical, $scope.$inner.vArray) > -1) {
							$scope.$inner.cell.css({
								"vertical-align" : $attrs.vertical
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var layoutScope = $scope.$inner.getParentScope();
					layoutScope.$inner.addCenter($element, $attrs, $scope);

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : color
							});
						}
					};
				}
			}
		}
	});
});

mj.buildLayout = function(opts) {
	var tag = $("<mj-layout>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildLayoutNorth = function(opts) {
	var tag = $("<mj-layout-north>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildLayoutSouth = function(opts) {
	var tag = $("<mj-layout-south>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildLayoutEast = function(opts) {
	var tag = $("<mj-layout-east>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildLayoutWest = function(opts) {
	var tag = $("<mj-layout-west>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildLayoutCenter = function(opts) {
	var tag = $("<mj-layout-center>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};
/**
 * 
 */
mj.module.directive('mjList', function($compile) {
	return mj.buildDirective({
		name : "mjList",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.children = [];

					/**
					 * 添加元素
					 */
					$scope.$inner.addChild = function(sc, el, rs) {
						rs.opts = $scope.$inner.child_opts;
						$scope.$inner.children.splice($scope.$inner.childIndex, 0, {
							"sc" : sc,
							"el" : el,
							"rs" : rs
						});
					};

					/**
					 * 删除元素
					 */
					$scope.$inner.delChild = function(id) {
						$.each($scope.$inner.children, function(index, child) {
							if (child.rs.id == id) {
								$scope.$inner.children.splice(index, 1);
							}
						});
					};

					$scope.$inner.table = $element.find(".mj-list-table").first();
					$scope.$inner.scroll = $element.find(".mj-list-scroll").first();
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if ($attrs.border == "false" || $attrs.border == false) {
							$element.css({
								"border" : "none"
							});
						}
						if (mj.isNotEmpty($attrs.height)) {
							$element.css({
								"height" : $attrs.height
							});
						}
						if (mj.isNotEmpty($attrs.width)) {
							$element.css({
								"width" : $attrs.width
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.build = function() {

					};

					$scope.$outer.layout = function() {
						$scope.$inner.scroll.css({
							"display" : "none"
						});
						if ($attrs.height != "auto") {
							$scope.$inner.scroll.css({
								"height" : $scope.$inner.scroll.parent().innerHeight()
							});
						}
						$scope.$inner.scroll.css({
							"display" : "block"
						});
					};

					/**
					 * 添加子元素
					 */
					$scope.$outer.addChild = function(opt) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						$scope.$inner.child_opts = opt;
						var iview = $scope.$inner.buildListItem(opt);
						var _dom = $compile(iview)($scope.$new());
						$scope.$inner.table.append(_dom);
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 添加子元素
					 */
					$scope.$outer.insertChild = function(opt, index) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						$scope.$inner.child_opts = opt;
						$scope.$inner.childIndex = $scope.$inner.children.length;
						var iview = $scope.$inner.buildListItem(opt);
						var _dom = $compile(iview)($scope.$new());
						if (index < 1) {
							$scope.$inner.childIndex = 0;
							_dom.insertBefore($scope.$inner.table.children()[0]);
						} else if (index >= $scope.$inner.children.length) {
							$scope.$inner.childIndex = $scope.$inner.children.length;
							$scope.$inner.table.append(_dom);
						} else {
							$scope.$inner.childIndex = index - 1;
							_dom.insertBefore($scope.$inner.table.children()[index - 1]);
						}
					};

					/**
					 * 批量添加子元素
					 */
					$scope.$outer.addChildren = function(opts) {
						if (!$.isArray(opts)) {
							throw "非Array对象，请检查...";
							return;
						}
						$.each(opts, function(index, opt) {
							$scope.$outer.addChild(opt);
						});
					};

					/**
					 * 动态构建控件
					 */
					$scope.$inner.buildListItem = function(opts) {
						var tag = $("<mj-list-item>");
						$.each(opts, function(key, value) {
							if (key != "render") {
								tag.attr("data-" + key, value);
							}
						});
						return tag;
					};

					/**
					 * 获取子元素
					 */
					$scope.$outer.getChildren = function() {
						var children = [];
						$.each($scope.$inner.children, function(index, child) {
							children.push(child.sc.$outer);
						});
						return children;
					};

					/**
					 * 根据索引获取子元素
					 */
					$scope.$outer.getChildByIndex = function(index) {
						$scope.$inner.children[index].sc.$outer;
					};

					/**
					 * 根据主键获取子元素
					 */
					$scope.$outer.getChildById = function(id) {
						var field = null;
						$.each($scope.$inner.children, function(index, child) {
							if (child.rs.id == id) {
								field = child.sc.$outer;
								return false;
							}
						});
					};

					/**
					 * 根据主键删除子元素
					 */
					$scope.$outer.removeChildById = function(id) {
						var _child = null;
						var _index = -1;
						$.each($scope.$inner.children, function(index, child) {
							if (child.rs.id == id) {
								_child = child;
								_index = index;
								return false;
							}
						});
						if (mj.isNotEmpty(_child)) {
							$scope.$inner.children.splice(_index, 1);
							_child.sc.$outer.destroy();
						}
					};

					/**
					 * 删除所有元素
					 */
					$scope.$outer.removeChildren = function() {
						$.each($scope.$inner.children, function(index, child) {
							child.sc.$outer.destroy();
						});
						if ($scope.$inner.children.length > 0) {
							$scope.$inner.children.splice(0, $scope.$inner.children.length);
						}
					};

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$element.addClass(cls);
					};

					/**
					 * 删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$element.removeClass(cls);
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};

				}
			}
		}
	});
});

mj.module.directive('mjListItem', function($compile) {
	return mj.buildDirective({
		name : "mjListItem",
		require : [ '^?mjList' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.cell = $element.find(".mj-list-table-cell").first();
					$scope.$inner.init = function() {
						if (mj.isNumber($attrs.height)) {
							$scope.$inner.cell.css({
								"height" : $attrs.height
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var pScope = $scope.$parent.$parent;
					pScope.$inner.addChild($scope, $element, $attrs);
					$scope.$inner.build = function() {
						if (!mj.isEmpty($attrs.opts)) {
							if (!mj.isEmpty($attrs.opts.render)) {
								if ($.isFunction($attrs.opts.render)) {
									var iview = $attrs.opts.render($attrs.opts.dataset);
									var _dom = $compile(iview)($scope.$new());
									$scope.$inner.cell.append(_dom);
								}
							}
						}
					};
					$scope.$inner.build();

					/**
					 * 隐藏
					 */
					$scope.$outer.getIndex = function() {
						$.each(pScope.$inner.children, function(index, child) {
							if (child.rs.id == $attrs.id) {
								return index;
							}
						});
					};

					/**
					 * 隐藏
					 */
					$scope.$outer.hide = function() {
						$element.hide();
					};

					/**
					 * 显示
					 */
					$scope.$outer.show = function() {
						$element.show();
					};

					/**
					 * 删除
					 */
					$scope.$outer.remove = function() {
						$element.remove();
						$scope.$inner.delChild($attrs.id);
					};

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};

					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 设置高度
					 */
					$scope.$outer.setHeight = function(height) {
						if ($.isNumeric(height)) {
							$scope.$inner.cell.height(height);
						}
					};

					/**
					 * 添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$element.addClass(cls);
					};

					/**
					 * 删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$element.removeClass(cls);
					};
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildList = function(opts) {
	var tag = $("<mj-list>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildListItem = function(opts) {
	var tag = $("<mj-list-item>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */

mj.view.loading = function(options) {
	mj.addView("mj-loading", this);
	this.options = options;
	this.close = function() {
		this.__inner.view.remove();
		this.__inner.mash.remove();
		mj.delView("mj-loading");
	}
};
mj.view.loading.prototype = {
	__opts : {
		"id" : mj.key(),
		"title" : "系统提示",
		"width" : "300px",
		"height" : "120px",
		"icon" : "",
		"content" : "正在加载..."
	},
	__inner : {},
	__build : function() {
		this.__buildOption();
		this.__buildMask();
		this.__inner.view = $(mj.templates.mjLoading);
		this.__inner.head = this.__inner.view.find(".mj-loading-head:first-child");
		this.__inner.body = this.__inner.view.find(".mj-loading-body:first-child");
		this.__buildView();
	},
	__buildOption:function(){
		this.__opts = {
				"id" : mj.key(),
				"title" : "系统提示",
				"width" : "300px",
				"height" : "120px",
				"icon" : "",
				"horizontal" : "left",
				"vertical" : "middle",
				"content" : "正在加载..."
		};
		$.extend(true, this.__opts, this.options);
		delete this.options;
	},
	__buildView : function() {
		var dom = $(document.body);
		dom.append(this.__inner.view);
		this.__inner.view.css({
			"width" : this.__opts.width,
			"height" : this.__opts.height
		});

		var h = (dom.height() - this.__inner.view.height()) / 2;
		var w = (dom.width() - this.__inner.view.width()) / 2;
		this.__inner.view.css({
			"top" : h,
			"left" : w,
			"z-index" : mj.getIndex()
		});
		this.__buildHead();
		this.__buildBody();
	},

	__buildHead : function() {
		var title = $('<span class="mj-loading-head-text"></span>');
		title.text(this.__opts.title);
		this.__inner.head.append(this.__buildLevel());
		this.__inner.head.append(title);
	},

	__buildBody : function() {
		this.__inner.body.html(this.__opts.content);
		this.__inner.body.css({
			"text-align" : this.__opts.horizontal,
			"vertical-align" : this.__opts.vertical
		});
	},

	__buildLevel : function() {
		var level = $('<span class="mj-loading-head-icon"></span>');
		level.addClass("fa fa-spinner fa-spin");
		return level;
	},

	__buildMask : function() {
		this.__inner.mash = $(mj.templates.mjMash);
		this.__inner.mash.css({
			"z-index" : mj.getIndex()
		});
		$(document.body).append(this.__inner.mash);
	}

};

mj.buildLoading = function(options) {
	if (mj.checkView("mj-loading")) {
		return;
	}
	var win = new mj.view.loading(options);
	win.__build();
	return win;
}
/**
 * 
 */

mj.module.directive('mjMarquee', function($compile) {
	return mj.buildDirective({
		name : "mjMarquee",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.index = 0;
					$scope.$inner.interval = 3000;
					$scope.$inner.left = $element.find(".mj-marquee-left").first();
					$scope.$inner.right = $element.find(".mj-marquee-right").first();
					$scope.$inner.center = $element.find(".mj-marquee-center").first();
					$scope.$inner.bottom = $element.find(".mj-marquee-bottom").first();
					$scope.$inner.children = [];
					$scope.$inner.addChild = function(sc, el, rs) {
						$scope.$inner.children.push({
							"sc" : sc,
							"el" : el,
							"rs" : rs
						});
						if (mj.isNumber($attrs.interval)) {
							if ($attrs.interval < 3) {
								$attrs.interval = 3;
							}
							$scope.$inner.interval = $attrs.interval * 1000;
						}
					};
					$scope.$inner.init = function() {
						if (mj.isNumber($attrs.height)) {
							$element.css({
								"height" : $attrs.height
							});
						}
						if (mj.isNumber($attrs.width)) {
							$element.css({
								"width" : $attrs.width
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.build = function() {
						$scope.$inner.buildButton();
						$scope.$inner.buildLeft();
						$scope.$inner.buildRight();
						$scope.$outer.run();
					};
					$scope.$inner.buildLeft = function() {
						$scope.$inner.left.on("click", function() {
							$scope.$outer.stop();
							$scope.$inner.buildPrev();
							var button = $scope.$inner.getButton();
							$scope.$inner.switcher(button);
							$scope.$outer.run();
						});
					};

					$scope.$inner.buildRight = function() {
						$scope.$inner.right.on("click", function() {
							$scope.$outer.stop();
							$scope.$inner.buildNext();
							var button = $scope.$inner.getButton();
							$scope.$inner.switcher(button);
							$scope.$outer.run();
						});
					};

					$scope.$inner.getButton = function() {
						return $scope.$inner.bottom.find(".mj-marquee-button:eq(" + $scope.$inner.index + ")");
					};

					$scope.$inner.buildButton = function() {
						$.each($scope.$inner.children, function(index, child) {
							var _buttons = $scope.$inner.bottom.find("[data-pid='" + child.rs.id + "']").first();
							if (_buttons.length == 0) {
								var btn = $('<i class="fa fa-circle"></i>');
								btn.appendTo($scope.$inner.bottom);
								btn.addClass("mj-marquee-button");
								btn.attr({
									"data-pid" : child.rs.id
								});
								btn.on("click", function() {
									$scope.$outer.stop();
									$scope.$inner.switcher($(this));
									$scope.$outer.run();
								});
							}
						});
					};

					$scope.$outer.run = function() {
						if (mj.isNotEmpty($scope.$inner.intervalObj)) {
							return;
						}
						$scope.$inner.intervalObj = window.setInterval(function() {
							if ($scope.$inner.children.length == 0) {
								return;
							}
							$scope.$inner.buildNext();
							var button = $scope.$inner.getButton();
							$scope.$inner.switcher(button);
						}, $scope.$inner.interval);
					};

					$scope.$outer.stop = function() {
						if (mj.isNotEmpty($scope.$inner.intervalObj)) {
							window.clearInterval($scope.$inner.intervalObj);
							$scope.$inner.intervalObj = null;
						}
					};

					$scope.$inner.switcher = function(button) {
						$.each($scope.$inner.children, function(index, child) {
							var _button = $scope.$inner.bottom.find("[data-pid='" + child.rs.id + "']").first();
							if (button.attr("data-pid") == _button.attr("data-pid")) {
								button.addClass("mj-marquee-button-show");
								child.el.css({
									"display" : "block"
								});
								$scope.$inner.index = index;
							} else {
								child.el.css({
									"display" : "none"
								});
								_button.removeClass("mj-marquee-button-show");
							}
						});

					};

					$scope.$inner.buildNext = function() {
						if ($scope.$inner.index + 1 == $scope.$inner.children.length) {
							$scope.$inner.index = 0;
						} else {
							$scope.$inner.index++;
						}
					};

					$scope.$inner.buildPrev = function() {
						if ($scope.$inner.index == 0) {
							$scope.$inner.index = $scope.$inner.children.length - 1;
						} else {
							$scope.$inner.index--;
						}
					};

					/**
					 * 添加子元素
					 */
					$scope.$outer.addChild = function(opt) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						var iview = $scope.$inner.buildMarqueeItem(opt);
						var _dom = $compile(iview)($scope.$new());
						$scope.$inner.center.append(_dom);
						$scope.$inner.buildButton();
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 批量添加子元素
					 */
					$scope.$outer.addChildren = function(opts) {
						if (!$.isArray(opts)) {
							throw "非Array对象，请检查...";
							return;
						}
						$.each(opts, function(index, opt) {
							$scope.$outer.addChild(opt);
						});
					};

					/**
					 * 动态构建控件
					 */
					$scope.$inner.buildMarqueeItem = function(opts) {
						var tag = $("<mj-marquee-item>");
						$.each(opts, function(key, value) {
							tag.attr("data-" + key, value);
						});
						return tag;
					};

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$element.addClass(cls);
					};

					/**
					 * 删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$element.removeClass(cls);
					};

					/**
					 * 获取子元素
					 */
					$scope.$outer.getChildren = function() {
						var children = [];
						$.each($scope.$inner.children, function(index, child) {
							children.push(child.sc.$outer);
						});
						return children;
					};

					/**
					 * 根据索引获取子元素
					 */
					$scope.$outer.getChildByIndex = function(index) {
						$scope.$inner.children[index].sc.$outer;
					};

					/**
					 * 根据索引获取子元素
					 */
					$scope.$outer.getChildById = function(id) {
						$.each($scope.$inner.children, function(index, child) {
							if (child.rs.id == id) {
								return child.sc.$outer;
							}
						});
					};

					$scope.$inner.build();
				}
			}
		}
	});
});

mj.module.directive('mjMarqueeItem', function($compile) {

	return mj.buildDirective({
		"name" : "mjMarqueeItem",
		require : [ '^?mjMarquee' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.init = function() {

					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var pScope = $scope.$inner.getParentScope();
					pScope.$inner.addChild($scope, $element, $attrs);
					$scope.$inner.build = function() {
						$element.on("click", function() {
							if (!mj.isEmpty($attrs.click)) {
								if ($.isFunction(mj.findCtrlScope($scope)[$attrs.click])) {
									mj.findCtrlScope($scope)[$attrs.click]($scope.$outer);
								}
							}
						});
					};
					$scope.$inner.build();

					$scope.$outer.addChild = function(obj) {
						if (mj.isEmpty(obj)) {
							return;
						}
						var _dom = $compile(obj)($scope.$new());
						$element.append(_dom);
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $scope.$inner.body.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $scope.$inner.body.height();
					};

					/**
					 * 添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$element.addClass(cls);
					};

					/**
					 * 删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$element.removeClass(cls);
					};
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildMarquee = function(opts) {
	var tag = $("<mj-marquee>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */

mj.module.directive('mjMenu', function($compile, $http) {
	return mj.buildDirective({
		name : "mjMenu",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.rootId = "-1";
					$scope.$inner.action = "";
					$scope.$inner.param = {};
					$scope.$inner.selectNode = null;
					$scope.$inner.allNode = [];
					$scope.$inner.cls = {
						"eblowClose" : "fa-plus-square-o",
						"eblowOpen" : "fa-minus-square-o",
						"eblowLoad" : "fa-spinner",
						"iconClose" : "fa-folder",
						"iconOpen" : "fa-folder-open",
						"iconLeaf" : "fa-file-text",
						"rowSelect" : "mj-menu-row-select",
						"textSelect" : "mj-menu-text-select",
						"iconSelect" : "mj-menu-icon-select",
						"menuRow" : "mj-menu-row",
						"menuText" : "mj-menu-text",
						"menuCell" : "mj-menu-cell",
						"menuIcon" : "mj-menu-icon",
						"menuElbow" : "mj-menu-elbow",
						"menuIconLeaf" : "mj-menu-icon-leaf"
					};
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var timer = null;

					/**
					 * 内部方法：清除节点
					 */
					$scope.$inner.clearChild = function(id) {
						var children = $element.find("[data-pid='" + id + "']");
						$.each(children, function(index, sub) {
							$scope.$inner.clearChild($(sub).attr("data-id"));
							$(sub).remove();
						});
					};

					/**
					 * 外部方法：加载
					 */
					$scope.$outer.load = function(param, action, parentId) {
						if (mj.isEmpty(parentId)) {
							parentId = $scope.$inner.rootId;
						}
						$scope.$inner.clearChild(parentId);
						$scope.$inner.param = param;
						$scope.$inner.action = action;
						$scope.$inner.load(null, $scope.$inner.rootId);
					}

					/**
					 * 内部方法：加载方法
					 */
					$scope.$inner.load = function(parent, parentId, succFun) {
						var method = "GET";
						if (!mj.isEmpty($attrs.method)) {
							method = $attrs.method
						}
						if (mj.isEmpty($scope.$inner.action)) {
							var _action = mj.findAttr($attrs.action, $scope);
							$scope.$inner.action = _action;
						}
						var _param = {};
						var condName = "condition";
						if (mj.isNotEmpty($scope.$inner.param)) {
							for ( var cond in $scope.$inner.param) {
								condName = cond;
							}
						} else {
							$scope.$inner.param = {};
						}
						if (parent == null) {
							_param[condName] = {
								"parentId" : parentId,
								"id" : parentId
							};
						} else {
							_param[condName] = parent.data("data-data");
						}
						$.extend(true, $scope.$inner.param, _param);
						$scope.$inner.http(parent, parentId, succFun, method, $scope.$inner.param, condName);
					};

					/**
					 * 内部方法：http请求
					 */
					$scope.$inner.http = function(parent, parentId, succFun, method, param, condName) {
						var _param = {};
						_param[condName] = JSON.stringify(param[condName]);
						$.ajax({
							url : $scope.$inner.action,
							type : method,
							async : true,
							data : _param,
							contentType : "application/json",
							dataType : 'json',
							success : function(data, textStatus, jqXHR) {
								if (data.code == 0) {
									$scope.$inner.buildNode(parent, data.data, parentId);
									if ($.isFunction(succFun)) {
										succFun();
									}
								}
								$scope.$inner.buildLoadAfter();
							},
							error : function(xhr, textStatus) {
								throw xhr;
							},
							complete : function() {

							}
						})
					};

					/**
					 * 加载后执行
					 */
					$scope.$outer.loadAfter = $attrs.loadAfter;

					/**
					 * 内部方法：构建加载后事件
					 */
					$scope.$inner.buildLoadAfter = function() {
						if (mj.isNotEmpty($scope.$outer.loadAfter)) {
							if ($.isFunction($scope.$outer.loadAfter)) {
								$scope.$outer.loadAfter($scope.$outer);
							} else {
								if ($.isFunction(mj.findCtrlScope($scope)[$scope.$outer.loadAfter])) {
									mj.findCtrlScope($scope)[$scope.$outer.loadAfter]($scope.$outer);
								}
							}
						}
					};

					/**
					 * 内部构建节点方法
					 */
					$scope.$inner.buildNode = function(parent, nodes, parentId) {
						if (parent == null) {
							parent = $element;
						}
						$.each(nodes, function(index, node) {
							if (node.parentId == parentId) {
								$scope.$inner.addChild(parent, parentId, node);
							}
						});
					};

					/**
					 * 内部方法：初始化方法
					 */
					$scope.$inner.isLeaf = function(isLeaf) {
						if (isLeaf == "1" || isLeaf == 1 || isLeaf == "true" || isLeaf == true) {
							return true;
						} else {
							return false;
						}
					};

					/**
					 * 内部方法：构建节点方法
					 */
					$scope.$inner.buildText = function(item, elbow, icon, text, data) {
						item.on("click", function() {
							clearTimeout(timer);
							timer = setTimeout(function() {
								if ($scope.$inner.selectNode != null) {
									$scope.$inner.getText($scope.$inner.selectNode).removeClass($scope.$inner.cls.textSelect);
									$scope.$inner.getIcon($scope.$inner.selectNode).removeClass($scope.$inner.cls.iconSelect);
									$scope.$inner.selectNode.removeClass($scope.$inner.cls.rowSelect);
								}
								$scope.$inner.selectNode = item;
								$scope.$inner.getText(item).addClass($scope.$inner.cls.textSelect);
								$scope.$inner.getIcon(item).addClass($scope.$inner.cls.iconSelect);
								item.addClass($scope.$inner.cls.rowSelect);
								if (!$.isEmptyObject($attrs.click)) {
									if ($.isFunction(mj.findCtrlScope($scope)[$attrs.click])) {
										mj.findCtrlScope($scope)[$attrs.click]($scope.$inner.buildParam(item));
									}
								}
							}, mj.delayedTime);
						});

						item.on("dblclick", function() {
							clearTimeout(timer);
							elbow.click();
						});
					};

					/**
					 * 内部方法：构建节点对象
					 */
					$scope.$inner.buildParam = function(item) {
						var data = item.data("data-data");
						var nodeObj = {
							getId : function() {
								return data.id;
							},
							isLeaf : function() {
								return $scope.$inner.isLeaf(data.isLeaf);
							},
							getData : function() {
								return data;
							},
							getNode : function() {
								return item;
							},
							getMenu : function() {
								return $scope.$outer;
							},
							expand : function() {
								$scope.$outer.expand(item);
							},
							collapse : function() {
								$scope.$inner.collapse(item);
							},
							getChildren : function() {
								var children = [];
								$.each($scope.$inner.getChildren(item), function(index, child) {
									children.push($scope.$inner.buildParam($(child)));
								});
								return children;
							},
							getParent : function() {
								var parent = $element.find("div[data-id='" + item.attr("data-pid") + "']");
								if (parent.length > 0) {
									return $scope.$inner.buildParam($(parent.first()));
								} else {
									return null;
								}
							},
							addChild : function(option) {
								if ($scope.$inner.isLeaf(data.isLeaf)) {
									data.isLeaf = false;
									$scope.$inner.switchStatus(item, "1");
								} else {
									$scope.$outer.expand(item);
								}
								$scope.$inner.addChild(item, item.attr("data-id"), option);
								var self = $element.find("div[data-id='" + option.id + "']");
								return $scope.$inner.buildParam(self.first());
							},
							addChildren : function(options) {
								if ($scope.$inner.isLeaf(data.isLeaf)) {
									data.isLeaf = false;
									$scope.$inner.switchStatus(item, "1");
								} else {
									$scope.$outer.expand(item);
								}
								var children = [];
								$.each(options, function(index, option) {
									$scope.$inner.addChild(item, item.attr("data-id"), option);
									var self = $element.find("div[data-id='" + option.id + "']");
									children.push($scope.$inner.buildParam(self.first()));
								});
								return children;
							},
							refresh : function(opt, refreshChildren) {
								if (mj.isNotEmpty(opt)) {
									if (mj.isNotEmpty(opt.text)) {
										data.text = opt.text;
										var text = item.find("." + $scope.$inner.cls.treeText).first();
										text.text(opt.text);
									}
								}
								if (mj.isTrue(refreshChildren)) {
									$scope.$inner.clearChild(item.attr("data-id"));
									$scope.$inner.switchStatus(item, "1");
									$scope.$outer.expand(item);
								}
							},
							remove : function() {
								var parent = $scope.$inner.getParent(item);
								$scope.$inner.clearChild(item.attr("data-id"));
								item.remove();
								var children = $scope.$inner.getChildren(parent);
								if (children.length == 0) {
									parent.data("data-data").isLeaf = true;
									$scope.$inner.switchStatus(parent, "2");
								}
							},
							removeChildren : function() {
								if (!$scope.$inner.isLeaf(data.isLeaf)) {
									$scope.$inner.collapse(item);
									$scope.$inner.clearChild(item.attr("data-id"));
									data.isLeaf = true;
									$scope.$inner.switchStatus(item, "2");
								}
							},
							removeChild : function(id) {
								var self = $element.find("div[data-id='" + id + "']");
								if (self.length > 0) {
									self.first().remove();
								}
								var children = $scope.$inner.getChildren(item);
								if (children.length == 0) {
									data.isLeaf = true;
									$scope.$inner.switchStatus(item, "2");
								}
							}
						};
						return nodeObj;
					};

					/**
					 * 内部方法：切换节点状态：是否叶子节点
					 */
					$scope.$inner.switchStatus = function(item, switchType) {
						var switcher = $scope.$inner.getSwitch(item);
						var icon = $scope.$inner.getIcon(item);
						switch (switchType) {
						case "1":// 由叶子节点变为非叶子结点
							icon.removeClass($scope.$inner.cls.iconLeaf);
							icon.addClass($scope.$inner.cls.iconClose);
							switcher.show();
							break;
						case "2":// 由非叶子结点转为叶子节点
							icon.removeClass($scope.$inner.cls.iconClose);
							icon.removeClass($scope.$inner.cls.iconOpen);
							icon.addClass($scope.$inner.cls.iconLeaf);
							switcher.hide();
						case "3":// 由关闭状态转为加载状态
							switcher.removeClass($scope.$inner.cls.eblowClose);
							switcher.addClass($scope.$inner.cls.eblowLoad);
							break;
						case "4":// 由加载或关闭状态转为打开状态
							if (!icon.hasClass($scope.$inner.cls.iconLeaf)) {
								if (icon.hasClass($scope.$inner.cls.iconClose)) {
									switcher.removeClass($scope.$inner.cls.eblowLoad);
									switcher.addClass($scope.$inner.cls.eblowOpen);
									icon.removeClass($scope.$inner.cls.iconClose);
									icon.addClass($scope.$inner.cls.iconOpen);
								}
							}
							break;
						}
					};

					/**
					 * 内部方法：构建icon
					 */
					$scope.$inner.buildIcon = function(item, elbow, icon, text, id) {
						elbow.on("click", function(event) {
							event.stopPropagation();
							if (elbow.hasClass($scope.$inner.cls.eblowClose)) {
								$scope.$inner.expandChildren(item, false);
								if ($attrs.collapse) {
									$scope.$inner.collapseOther(item);
								}
							} else if (elbow.hasClass($scope.$inner.cls.eblowOpen)) {
								$scope.$inner.collapse(item);
							}
						});
					};

					/**
					 * 内部方法：增加节点
					 */
					$scope.$inner.addChild = function(parent, parentId, data) {
						var item = $(mj.templates.mjMenuItem);
						var elbow = $scope.$inner.getSwitch(item);
						var icon = $scope.$inner.getIcon(item);
						var fa = item.find(".mj-menu-fa").first();
						var text = item.find("." + $scope.$inner.cls.menuText).first();
						var cell = item.find("." + $scope.$inner.cls.menuCell).first();

						text.text(data.text);
						item.attr({
							"data-id" : data.id,
							"data-pid" : parentId
						});

						item.data("data-data", data);

						$scope.$inner.buildText(item, elbow, icon, text, data);
						$scope.$inner.buildIcon(item, elbow, icon, text, data.id);

						if (parent == $element) {
							cell.css({
								"padding-left" : "15px"
							});
							$element.append(item);
						} else {
							var pleft = parent.find("." + $scope.$inner.cls.menuCell).first().css("paddingLeft");
							cell.css({
								"padding-left" : mj.number(pleft) + 18
							});
							var children = $scope.$inner.getChildren(parent);
							if (children.length > 0) {
								item.insertAfter($(children[children.length - 1]));
							} else {
								item.insertAfter(parent);
							}
						}
						fa.addClass(data.icon);
						if ($scope.$inner.isLeaf(data.isLeaf)) {
							icon.addClass($scope.$inner.cls.iconLeaf);
							elbow.css({
								"display" : 'none'
							});
						} else {
							icon.addClass($scope.$inner.cls.iconClose);
							elbow.addClass($scope.$inner.cls.eblowClose);
							if (mj.isTrue($attrs.expanded)) {
								elbow.click();
							} else if (mj.isTrue(data.isExpand)) {
								elbow.click();
							}
						}
						$scope.$inner.allNode.push(item);
					};

					/**
					 * 外部方法：收起某个节点
					 */
					$scope.$outer.collapse = function(node) {
						if (mj.isEmpty(node)) {
							return;
						} else {
							$scope.$inner.collapse(node);
						}
					};

					/**
					 * 外部方法：收起所有节点
					 */
					$scope.$outer.collapseAll = function() {
						var nodes = $element.find("[data-pid='" + $scope.$inner.rootId + "']");
						$.each(nodes, function(index, node) {
							$scope.$inner.collapse($(node));
						});
					};

					/**
					 * 内部方法：内部收起方法
					 */
					$scope.$inner.collapseOther = function(item) {
						var nodes = $element.find("[data-pid='" + item.attr("data-pid") + "']");
						$.each(nodes, function(index, node) {
							if ($(node).attr("data-id") != item.attr("data-id")) {
								$scope.$inner.collapse($(node));
							}

						});
					};

					/**
					 * 内部方法：内部收起方法
					 */
					$scope.$inner.collapse = function(item) {
						var elbow = $scope.$inner.getSwitch(item);
						var icon = $scope.$inner.getIcon(item);
						if (icon.hasClass($scope.$inner.cls.iconLeaf)) {
							return;
						}
						if (icon.hasClass($scope.$inner.cls.iconClose)) {
							return;
						} else if (icon.hasClass($scope.$inner.cls.iconOpen)) {
							elbow.removeClass($scope.$inner.cls.eblowOpen);
							elbow.addClass($scope.$inner.cls.eblowClose);
							icon.removeClass($scope.$inner.cls.iconOpen);
							icon.addClass($scope.$inner.cls.iconClose);
						}
						var children = $scope.$inner.getChildren(item);
						if (children.length > 0) {
							$.each(children, function(index, subItem) {
								$(subItem).css({
									"display" : "none"
								});
								$scope.$inner.collapse($(subItem));
							});
						}
					};

					/**
					 * 内部方法：获取开关
					 */
					$scope.$inner.getSwitch = function(item) {
						return item.find("." + $scope.$inner.cls.menuElbow).first();
					}

					/**
					 * 内部方法：获取图标
					 */
					$scope.$inner.getIcon = function(item) {
						return item.find("." + $scope.$inner.cls.menuIcon).first();
					}

					/**
					 * 内部方法：获取图标
					 */
					$scope.$inner.getText = function(item) {
						return item.find("." + $scope.$inner.cls.menuText).first();
					}

					/**
					 * 内部方法：展开子节点
					 */
					$scope.$inner.expandChildren = function(item, allFlag) {
						$scope.$inner.switchStatus(item, "3");
						var children = $scope.$inner.getChildren(item);
						if (children.length == 0) {
							$scope.$inner.load(item, item.attr("data-id"), function() {
								var children = $scope.$inner.getChildren(item);
								var data = item.data("data-data");
								if (children.length == 0) {
									data.isLeaf = true;
									$scope.$inner.switchStatus(item, "2");
								} else {
									data.isLeaf = false;
									$scope.$inner.switchStatus(item, "4");
									$scope.$inner.expandFor(item, allFlag);
								}
							});
						} else {
							$scope.$inner.switchStatus(item, "4");
							$scope.$inner.expandFor(item, allFlag);
						}
					};

					/**
					 * 内部递归展开函数
					 */
					$scope.$inner.expandFor = function(item, allFlag) {
						var nodes = $scope.$inner.getChildren(item);
						$.each(nodes, function(index, node) {
							$(node).css({
								"display" : "table-row"
							});
							if (allFlag == true) {
								$scope.$inner.expandChildren($(node));
							}
						});
					}

					/**
					 * 内部方法：获取第一级子节点
					 */
					$scope.$inner.getChildren = function(node) {
						return $element.find("[data-pid='" + node.attr("data-id") + "']");
					};

					/**
					 * 外部方法：展开节点
					 */
					$scope.$outer.expand = function(node) {
						var id = "";
						if (mj.isEmpty(node)) {
							return;
						} else {
							$scope.$inner.expandChildren(node, false);
						}
					};

					/**
					 * 外部方法：展开所有节点
					 */
					$scope.$outer.expandAll = function() {
						var nodes = $element.find("[data-pid='" + $scope.$inner.rootId + "']");
						$.each(nodes, function(index, node) {
							$scope.$inner.expandChildren($(node), true);
						});
					};

					/**
					 * 外部方法：获取根节点
					 */
					$scope.$outer.getRootNode = function() {
						if (mj.isEmpty($scope.$inner.rootNode)) {
							return null;
						}
						return $scope.$inner.buildParam($scope.$inner.rootNode);
					};
					
					/**
					 * 外部方法：获取所有节点
					 */
					$scope.$outer.getAllNode = function() {
						return $scope.$inner.allNode;
					}
					
					/**
					 * 外部方法：获取当前选中的节点
					 */
					$scope.$outer.getSelectNode = function() {
						if (mj.isEmpty($scope.$inner.selectNode)) {
							return null;
						}
						return $scope.$inner.buildParam($scope.$inner.selectNode);
					}

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};

					/**
					 * 是否自动加载
					 */
					if (mj.isTrue($attrs.autoload)) {
						$scope.$inner.load(null, $scope.$inner.rootId);
					}
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildMenu = function(opts) {
	var tag = $("<mj-menu>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};
/**
 * 
 */

mj.module.directive('mjNumber', function($compile) {
	return mj.buildFieldDirective( {
		name : "mjNumber",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);
					$scope.$inner.buttonadd = $element.find(".mj-input-field-number-minus");
					$scope.$inner.buttondel = $element.find(".mj-input-field-number-plus");
					$scope.$inner.opts = 	{"step" : 0.1, "min" : 0, "max" : 99, "digit" : 1};
					$scope.$inner.buildOtherAttr = function() {
						if (!mj.isEmpty($attrs.digit)) {
							$scope.$inner.opts.digit  =  parseFloat($attrs.digit).toFixed(0);
						}
						if (!mj.isEmpty($attrs.step)) {
							$scope.$inner.opts.step = parseFloat($attrs.step);
						}
						if (!mj.isEmpty($attrs.min)) {
							$scope.$inner.opts.min = parseFloat($attrs.min);
						}
						if (!mj.isEmpty($attrs.max)) {
							$scope.$inner.opts.max = parseFloat($attrs.max);
						}
					};
					$scope.$inner.buttonadd.on("click",function(){
						//if($scope.$outer.validity()){
							$scope.$inner.execute(false);
						//}
					});
					$scope.$inner.buttondel.on("click",function(){
						//if($scope.$outer.validity()){
							$scope.$inner.execute(true);
						//}
					});					
					$scope.$inner.execute = function(_do) {
						var val = null;
						if (!mj.isEmpty($scope.$inner.field.val())) {							
							val = parseFloat($scope.$inner.format($scope.$inner.field.val(), $scope.$inner.opts.digit));
						}else{
							val = parseFloat($scope.$inner.format(0, $scope.$inner.opts.digit));
						}
						var ori = val;
						if(_do) val -= $scope.$inner.opts.step;
						if(!_do) val += $scope.$inner.opts.step;
						if(val<$scope.$inner.opts.min){
							if(!mj.isEmpty($attrs.min)){
								val  =  $scope.$inner.opts.min;
							}
						}else if(val>$scope.$inner.opts.max){
							if(!mj.isEmpty($attrs.max)){
								val  =  $scope.$inner.opts.max;
							}
						}
						$scope.$inner.field.val($scope.$inner.format(val, $scope.$inner.opts.digit));
					};					
					$scope.$inner.checkType = function() {
						var flag = true;
						if (isNaN(Number($scope.$inner.field.val()))) {
							$scope.$inner.field.addClass("mj-input-validity-error");
							$scope.$inner.tooltip.setTitle($attrs.label + " 不是数值类型");
							//$scope.$inner.field.attr("title", $attrs.label + " 不是数值类型");
							flag = false;
						}						
						return flag;
					};
					$scope.$inner.format = function(val, digit){
						if(isNaN(val)){ 
							val = 0;
						}
						return parseFloat(val).toFixed(digit);	
					}
					$scope.$inner.checkMin = function() {
						var flag = true;
						if ($.isNumeric($attrs.min)) {	
							if (parseFloat($scope.$inner.field.val()) < parseFloat($attrs.min)) {
								$scope.$inner.field.addClass("mj-input-validity-error");
								$scope.$inner.tooltip.setTitle($attrs.label + " 数值不能小于" + $attrs.min);
								//$scope.$inner.field.attr("title", $attrs.label + " 数值不能小于" + $attrs.min);
								flag = false;
							}
						}
						return flag;
					};

					$scope.$inner.checkMax = function() {
						var flag = true;
						if ($.isNumeric($attrs.max)) {
							if (parseFloat($scope.$inner.field.val()) > parseFloat($attrs.max)) {
								$scope.$inner.field.addClass("mj-input-validity-error");
								$scope.$inner.tooltip.setTitle($attrs.label + " 数值不能大于" + $attrs.max);
								//$scope.$inner.field.attr("title", $attrs.label + " 数值不能大于" + $attrs.max);
								flag = false;
							}
						}
						return flag;
					};
					
					
					$scope.$inner.build();
				}
			}
		}
	});
});
/**
 * 动态添加控件
 */
mj.buildNumber = function(opts) {
	var tag = $("<mj-number>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */

mj.module.directive('mjPanel', function($compile) {
	return mj.buildDirective({
		name : "mjPanel",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.head = null;
					$scope.$inner.body = null;
					$scope.$inner.foot = null;
					$scope.$inner.addHead = function(sc, el, rs) {
						$scope.$inner.head = {
							"sc" : sc,
							"el" : el,
							"rs" : rs
						};
					};
					$scope.$inner.addBody = function(sc, el, rs) {
						$scope.$inner.body = {
							"sc" : sc,
							"el" : el,
							"rs" : rs
						};
					};
					$scope.$inner.addFoot = function(sc, el, rs) {
						$scope.$inner.foot = {
							"sc" : sc,
							"el" : el,
							"rs" : rs
						};
					};
					$scope.$inner.init = function() {
						if (mj.isFalse($attrs.border)) {
							$element.css({
								"border" : "none"
							});
						}
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.height)) {
							$element.css({
								"height" : $attrs.height
							});
						}
						if (mj.isNotEmpty($attrs.width)) {
							$element.css({
								"width" : $attrs.width
							});
						}

						if (mj.isTrue($attrs.hidden)) {
							$element.hide();
						}
					}
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.build = function() {
						if (mj.isNotEmpty($scope.$inner.head) && mj.isTrue($scope.$inner.head.rs.collapsed)) {
							$scope.$outer.collapse();
						}
					};

					$scope.$outer.collapse = function() {
						$scope.$inner.head.sc.$inner.collapse();
					};

					$scope.$outer.expand = function() {
						$scope.$inner.head.sc.$inner.expand();
					};

					$scope.$outer.layout = function() {
						if(mj.isNotEmpty($scope.$inner.body)){
							$scope.$inner.body.sc.$inner.layout();
						}
					};

					/**
					 * 添加头部
					 */
					$scope.$outer.addHead = function(opt) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						if ($scope.$inner.head != null) {
							throw "head对象已存在，请检查...";
							return;
						}
						var iview = $scope.$inner.buildPanelHead(opt);
						return $scope.$inner.addChild(iview);
					};

					/**
					 * 添加内容
					 */
					$scope.$outer.addBody = function(opt) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						if ($scope.$inner.body != null) {
							throw "body对象已存在，请检查...";
							return;
						}
						var iview = $scope.$inner.buildPanelBody(opt);
						return $scope.$inner.addChild(iview);
					};

					/**
					 * 添加头部
					 */
					$scope.$outer.addFoot = function(opt) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						if ($scope.$inner.foot != null) {
							throw "foot对象已存在，请检查...";
							return;
						}
						var iview = $scope.$inner.buildPanelFoot(opt);
						return $scope.$inner.addChild(iview);
					};

					/**
					 * 添加子元素
					 */
					$scope.$inner.addChild = function(opt) {
						var _dom = $compile(opt)($scope.$new());
						$element.append(_dom);
						$scope.$inner.layout();
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 动态构建控件
					 */
					$scope.$inner.buildPanelHead = function(opts) {
						var tag = $("<mj-panel-head>");
						$.each(opts, function(key, value) {
							tag.attr("data-" + key, value);
						});
						return tag;
					};

					/**
					 * 动态构建控件
					 */
					$scope.$inner.buildPanelBody = function(opts) {
						var tag = $("<mj-panel-body>");
						$.each(opts, function(key, value) {
							tag.attr("data-" + key, value);
						});
						return tag;
					};

					/**
					 * 动态构建控件
					 */
					$scope.$inner.buildPanelFoot = function(opts) {
						var tag = $("<mj-panel-foot>");
						$.each(opts, function(key, value) {
							tag.attr("data-" + key, value);
						});
						return tag;
					};

					/**
					 * 内部布局
					 */
					$scope.$inner.layout = function() {
						var parent = $scope.$parent;
						while (parent != null) {
							if (mj.isNotEmpty(parent.$outer) && $.isFunction(parent.$outer.layout)) {
								parent.$outer.layout();
								return;
							} else {
								parent = parent.$parent;
							}
						}
					};

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$element.addClass(cls);
					};

					/**
					 * 删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$element.removeClass(cls);
					};

					/**
					 * 获取头部
					 */
					$scope.$outer.getHead = function() {
						return $scope.$inner.head.sc.$outer;
					};

					/**
					 * 获取内容
					 */
					$scope.$outer.getBody = function() {
						return $scope.$inner.body.sc.$outer;
					};

					/**
					 * 获取底部
					 */
					$scope.$outer.getFoot = function() {
						return $scope.$inner.foot.sc.$outer;
					};

					/**
					 * 显示
					 */
					$scope.$outer.show = function() {
						return $element.show();
					};

					/**
					 * 隐藏
					 */
					$scope.$outer.hide = function() {
						return $element.hide();
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
					
					$scope.$inner.build();
				}
			}
		}
	});
});

mj.module.directive('mjPanelHead', function($compile) {
	return mj.buildDirective({
		name : "mjPanelHead",
		require : [ '^?mjPanel' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.head = $element.find(".mj-panel-head").first();
					$scope.$inner.cls = {
						"open" : "fa-chevron-up",
						"close" : "fa-chevron-down"
					};
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$scope.$inner.head.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.height)) {
							$scope.$inner.head.css({
								"height" : $attrs.height
							});
						}
						if (!mj.isEmpty($attrs.icon)) {
							var icon = $("<span class='" + $attrs.icon + "'></span>");
							$scope.$inner.head.prepend(icon);
						}
					}
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var pscope = $scope.$inner.getParentScope();
					pscope.$inner.addHead($scope, $element, $attrs);

					$scope.$inner.bulid = function() {
						if (mj.isTrue($attrs.collapsable)) {
							$scope.$inner.shrink = $("<span class='mj-panel-head-btn fa'></span>");
							$scope.$inner.shrink.addClass($scope.$inner.cls.open);
							$scope.$inner.shrink.appendTo($scope.$inner.head);
							$scope.$inner.shrink.on('click', function() {
								if ($(this).hasClass($scope.$inner.cls.open)) { // 收起
									$scope.$inner.collapse();
								} else if ($(this).hasClass($scope.$inner.cls.close)) { // 展开
									$scope.$inner.expand();
								}
							});
						}
					}

					$scope.$inner.collapse = function() {
						if (mj.isTrue($attrs.collapsable)) {
							$scope.$inner.shrink.removeClass($scope.$inner.cls.open);
							$scope.$inner.shrink.addClass($scope.$inner.cls.close);
						}
						pscope.$outer.getElement().css({
							"height" : "auto"
						});
						pscope.$inner.body.el.css({
							"display" : "none"
						});
						if (!mj.isEmpty(pscope.$inner.foot)) {
							pscope.$inner.foot.el.css({
								"display" : "none"
							});
						}
						$scope.$inner.layout();
					}

					$scope.$inner.expand = function() {
						if (mj.isTrue($attrs.collapsable)) {
							$scope.$inner.shrink.removeClass($scope.$inner.cls.close);
							$scope.$inner.shrink.addClass($scope.$inner.cls.open);
						}
						pscope.$inner.body.el.css({
							"display" : ""
						});
						if (!mj.isEmpty(pscope.$inner.foot)) {
							pscope.$inner.foot.el.css({
								"display" : ""
							});
						}
						if (mj.isEmpty(pscope.$outer.getAttrs().height)) {
							pscope.$outer.getElement().css({
								"height" : "auto"
							});
						} else {
							pscope.$outer.getElement().css({
								"height" : pscope.$outer.getAttrs().height
							});
						}
						$scope.$inner.layout();
					}

					/**
					 * 添加子元素
					 */
					$scope.$outer.addChild = function(child) {
						if (!mj.isEmpty(child)) {
							var _dom = $compile(child)($scope.$new());
							$scope.$inner.head.append(_dom);
						}
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 内部布局
					 */
					$scope.$inner.layout = function() {
						var parent = pscope.$parent;
						while (!mj.isEmpty(parent)) {
							if (mj.isNotEmpty(parent.$outer) && $.isFunction(parent.$outer.layout)) {
								mj.layoutView(parent.$outer.getId());
								break;
							}
							parent = parent.$parent;
						}
					};

					$scope.$inner.bulid();
					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $scope.$inner.head.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $scope.$inner.head.height();
					};

					/**
					 * 添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$scope.$inner.head.addClass(cls);
					};

					/**
					 * 删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$scope.$inner.head.removeClass(cls);
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$scope.$inner.head.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
				}
			}
		}
	});
});

mj.module.directive('mjPanelBody', function($compile) {
	return mj.buildDirective({
		name : "mjPanelBody",
		require : [ '^?mjPanel' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.scroll = $element.find(".mj-panel-body-scroll").first();
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.padding)) {
							$scope.$inner.scroll.css({
								"padding" : $attrs.padding
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var pscope = $scope.$inner.getParentScope();
					pscope.$inner.addBody($scope, $element, $attrs);
					$scope.$inner.layout = function() {
						var pattrs=pscope.$outer.getAttrs();
						if(mj.isNotEmpty(pattrs.height) && pattrs.height!="auto"){
							$scope.$inner.scroll.css({
								"display" : "none"
							});
							var height=$scope.$inner.scroll.parent().innerHeight();
							$scope.$inner.scroll.css({
								"height" : height
							});
							$scope.$inner.scroll.css({
								"display" : "block"
							});
						}
					}

					/**
					 * 添加子元素
					 */
					$scope.$outer.addChild = function(child) {
						if (!mj.isEmpty(child)) {
							var _dom = $compile(child)($scope.$new());
							$scope.$inner.scroll.append(_dom);
						}
						$scope.$inner.layout();
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$element.addClass(cls);
					};

					/**
					 * 删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$element.removeClass(cls);
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
				}
			}
		}
	});
});

mj.module.directive('mjPanelFoot', function($compile) {
	return mj.buildDirective({
		name : "mjPanelFoot",
		require : [ '^?mjPanel' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.body = $element.find(".mj-panel-foot").first();
					$scope.$inner.getParentScope().$inner.addFoot($scope, $element, $attrs);
					$scope.$inner.hArray = [ "left", "right", "center" ];
					$scope.$inner.vArray = [ "top", "bottom", "middle" ];
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$scope.$inner.body.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isFalse($attrs.border)) {
							$scope.$inner.body.css({
								"border" : "none"
							});
						}
						if (mj.isNotEmpty($attrs.height)) {
							$scope.$inner.body.css({
								"height" : $attrs.height
							});
						}
						if ($.inArray($attrs.horizontal, $scope.$inner.hArray)) {
							$element.css({
								"align" : $attrs.horizontal
							});
						}
						if ($.inArray($attrs.vertical, $scope.$inner.vArray)) {
							$element.css({
								"vertical-align" : $attrs.vertical
							});
						}
					}
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					/**
					 * 添加子元素
					 */
					$scope.$outer.addChild = function(child) {
						if (!mj.isEmpty(child)) {
							var _dom = $compile(child)($scope.$new());
							$scope.$inner.body.append(_dom);
						}
						$scope.$inner.layout();
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 内部布局
					 */
					$scope.$inner.layout = function() {
						var parent = $scope.$parent;
						while (parent != null) {
							if ($.isFunction(parent.$outer.layout)) {
								parent.$outer.layout();
								return;
							} else {
								parent = parent.$parent;
							}
						}
					};

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $scope.$inner.body.width();
					};

					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $scope.$inner.body.height();
					};

					/**
					 * 添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$scope.$inner.body.addClass(cls);
					};

					/**
					 * 删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$scope.$inner.body.removeClass(cls);
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$scope.$inner.body.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildPanel = function(opts) {
	var tag = $("<mj-panel>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildPanelHead = function(opts) {
	var tag = $("<mj-panel-head>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildPanelBody = function(opts) {
	var tag = $("<mj-panel-body>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildPanelFoot = function(opts) {
	var tag = $("<mj-panel-foot>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};
/**
 * 
 */

mj.module.directive('mjPassword', function($compile) {
	return mj.buildFieldDirective({
		name : "mjPassword",		
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);			
					$scope.$inner.build();
				}
			}
		}
	});
});
/**
 * 动态添加控件
 */
mj.buildPassword = function(opts) {
	var tag = $("<mj-password>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */
mj.view.popup = function(target, options) {
	mj.addView("mj-popup", this);
	this.target = target;
	var _this = this;
	this.options = {
		"top" : "0",// 提示框偏移上下水平像素
		"left" : "0",// 提示框偏移左右水平像素
		"position" : "bottom",// 默认提示框出现位置为底部
		"content" : "",// 提示框显示内容
		"width" : "100",
		"height" : "200",
		"bgColor" : "#FFF"
	};
	$.extend(true, this.options, options);
	this.destroy = function() {
		_this.destroy();
	};
	this.setContent = function(content) {
		_this.options.content = content;
		_this.$inner.buildBody();
	};
	this.setTarget = function(target) {
		_this.target = target;
	};
	this.close = function() {
		_this.$inner.close();
	}
	this.open = function() {
		_this.$inner.isOpen = true;// 设置open打开层的标示
		_this.$inner.buildView();
		_this.$inner.open();
	}
	_this.$inner = {

	};

	_this.$inner.build = function() {
		_this.$inner.popup = $(mj.templates.mjPopup);
		_this.$inner.body = this.popup.find(".mj-popup-body").first();
		_this.$inner.isOpen = false;// 是否通过open方法打开提示层
		_this.$inner.buildTarget();
		_this.$inner.buildBody();
		var dom = mj.getBody();
		dom.append(_this.$inner.popup);
		_this.$inner.body.css({
			"background-color" : _this.options.bgColor,
			"width" : _this.options.width,
			"height" : _this.options.height,
			"display" : "block"
		});
	}, _this.$inner.buildTarget = function() {
		_this.target.on("click", function(event) {
			event.stopPropagation();
			_this.$inner.buildView();
			_this.$inner.open();
		});
		var dom = mj.getBody();
		$(document.body).on("click", function(event) {
			if (!_this.$inner.isOpen) {// 通过正常方式打开提示层，点击提示层和控件以外部分就关闭页面
				event.stopPropagation();
				var ss = $(event.target).closest("div[data-tag='mjPopup']");
				if (ss.length == 0) {
					_this.$inner.close();
				}
			} else {// 通过open方式打开提示层后，再点击提示层和控件以外部分就关闭页面
				_this.$inner.isOpen = false;// 还原open打开层的标示
			}
		})
	}, _this.$inner.buildBody = function() {
		var children = _this.$inner.body.find("*[data-tag*='mj']");
		for (var i = children.length - 1; i >= 0; i--) {
			var view = mj.getView($(children[i]).attr("id"));
			if (!mj.isEmpty(view)) {
				if ($.isFunction(view.destroy)) {
					view.destroy();
				}
			}
		}
		_this.$inner.body.empty();
		_this.$inner.body.append(_this.options.content);
		mj.compile(_this.$inner.body);
	}, _this.$inner.buildView = function() {
		var targetTop = _this.options.top;
		var targetLeft = _this.options.left;
		var h;
		var w;
		var p = _this.target.offset();
		var _t = 2;
		if (_this.options.position == "bottom") {
			h = p.top + _this.target.outerHeight(true) + targetTop * 1 + _t;
			w = p.left + targetLeft * 1;
		} else if (_this.options.position == "top") {
			h = p.top - _this.$inner.popup.outerHeight(true) + targetTop * 1 - _t;
			w = p.left + targetLeft * 1;
		} else if (_this.options.position == "left") {
			h = p.top + targetTop * 1 + _t;
			w = p.left - _this.$inner.popup.width() + targetLeft * 1;
		} else if (_this.options.position == "right") {
			h = p.top + targetTop * 1 + _t;
			w = p.left + _this.target.width() + targetLeft * 1;
		}
		_this.$inner.popup.css({
			"top" : h + "px",
			"left" : w + "px",
			"z-index" : mj.getIndex()
		});

	},
	/**
	 * 显示方法
	 */
	_this.$inner.open = function() {
		_this.$inner.popup.css({
			"display" : "block"
		});
	},

	/**
	 * 关闭方法
	 */
	_this.$inner.close = function() {
		_this.$inner.hide();
	},

	_this.$inner.hide = function() {
		_this.$inner.popup.css({
			"display" : "none"
		});
	}, _this.$inner.destroy = function() {
		var children = this.__inner.popup.find("*[data-tag*='mj']");
		for (var i = children.length - 1; i >= 0; i--) {
			var view = mj.getView($(children[i]).attr("id"));
			if (!mj.isEmpty(view)) {
				if ($.isFunction(view.destroy)) {
					view.destroy();
				}
			}
		}
		_this.$inner.body.remove();
		_this.$inner.popup.remove();
		delete _this;
	}
};
mj.buildPopup = function(target, opts) {
	var popup = new mj.view.popup(target, opts);
	popup.$inner.build();
	return popup;
}
mj.popup = function(target, opts) {
	var popup = new mj.view.popup(target, opts);
	popup.$inner.build();
	return popup;
}
/**
 * 
 */

mj.module.directive('mjRadio', function($http,$compile) {
	return mj.buildFieldDirective({
		name : "mjRadio",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					var group = $element.find(".mj-input-field").first();
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);
					$scope.$inner.buildOtherAttr = function() {
						if(!$.isEmptyObject($attrs.data)) {
							$scope.$inner.init($attrs.data);
						}else{
							if(!$.isEmptyObject($attrs.action)) {
								$scope.$outer.load();
							}	
						}						
								
					};
					/**
					 * 获取当前选中项的value
					 */
					$scope.$outer.getValue = function() {
						return $element.find("input[name='"+$attrs.name+"']:checked").first().val();
					};
					/**
					 * 设置当前选中项的value
					 */
					$scope.$outer.setValue = function(val) {
						$scope.$inner.clearSelected();
						var input = $element.find("input[name='"+$attrs.name+"'][value='"+val+"']");
					     input.prop("checked", true);
					     input.parent().attr("data-checked", "true");
					};
					$scope.$inner.clearSelected = function() {
						var _radio=$element.find("input[name='"+$attrs.name+"']");
						_radio.prop("checked", false);
						_radio.parent().attr("data-checked", "false");
					}						
					/**
					 * 获得当前选中项，返回格式{"label" :"label","value" :"value"}
					 */
					$scope.$outer.getSelect = function() {
						var item = 
						{
							"label" : $element.find("input[name='"+$attrs.name+"']:checked").first().parent().text(),
							"value" : $element.find("input[name='"+$attrs.name+"']:checked").first().val()
						};
						return item;
					};
					/**
					 * 添加选项,格式{"value" :"value","label" :"label"}
					 */
					$scope.$outer.addChild = function(item) {
						var label;
						var value;
						//通过属性data-label-field和data-value-field来确定data的数据列，如果未设置就是按照label和value获取数据
						if((!$.isEmptyObject($attrs.labelField))&&(!$.isEmptyObject($attrs.valueField))){
							label = item[$attrs.labelField];
							value = item[$attrs.valueField];
						}else{
							label = item.label;
							value = item.value;
						}	
						if ($.isEmptyObject(value)) {
							throw "属性value不能为空";
						}
						var radio = $(mj.templates.mjRadioItem);
						var input = $(radio.children()[0]);
						input.attr({"value":value,"name":$attrs.name});
						if ($attrs.disabled == "true") {
							input.attr("disabled", "disabled");
						}
						if ($attrs.value == value) {
							input.prop("checked", true);
							input.parent().attr("data-checked", "true");
						}
						if(!$.isEmptyObject(label)){
							radio.append(label);
						}else{
							radio.append("&nbsp;");
						}
						group.append(radio);
						$scope.$inner.buildCurrentItem(radio);
					};
					
					/**
					 * 构建当前子项
					 */
					$scope.$inner.buildCurrentItem = function(radio) {
						var input = radio.find("input").first();
						var current = {
							"getElement" : function() {
								return input;
							},
							"getLabel" : function() {
								radio.text();
							},
							"getValue" : function() {
								return input.val();
							},
							"getName" : function() {
								return input.attr("name");
							},
							"isChecked" : function() {
								if (mj.isTrue(input.prop("checked"))) {
									return true;
								} else {
									return false;
								}
							},
							"setChecked" : function(flag) {
								input.prop("checked", flag);
								input.parent().attr("data-checked", flag);
							}
						};

						if (!mj.isEmpty($attrs.change)) {
							if ($.isFunction(mj.findCtrlScope($scope)[$attrs.change])) {
								input.on("change", function() {
									var opts = $.extend(true, {}, $scope.$outer);
									opts.getCurrentItem = function() {
										return current;
									};
									mj.findCtrlScope($scope)[$attrs.change](opts);
								});
							}
						}
					};
					
					
					/**
					 * 根据选择项value删除选择项
					 */
					$scope.$outer.removeChild = function(val) {
						var input = $element.find("input[name='"+$attrs.name+"'][value='"+val+"']").first();
						var parent = input.parent();
						parent.remove();
					}
					/**
					 * 删除所有选择项
					 */
					$scope.$outer.removeChildren = function(val) {
						group.empty();
					}
					
					$scope.$inner.init = function(data) {
						$scope.$outer.removeChildren();
						if(!$.isEmptyObject(data)) {
							var items = new Array();
							if(typeof(data) === "string" ) {
								try {
									items = $.parseJSON(data);
							    } catch(e){
							        throw "参数格式错误，必须为JSON数组"
							    }
							} else if ( mj.isJson(data) ){
								items[0] = data;
							} else if ( $.isArray(data) ) {
								items = data;
							} else {
								throw "参数格式错误，必须为JSON数组"
							}							
							$.each(items,function(index,item){
								$scope.$outer.addChild(item);
							});
						}
					}
					/**
					 * 加载现有数据到下拉框中，数据可通过方法传参和控件属性传参两种
					 */
					$scope.$outer.loadData = function(data) {						
						$scope.$inner.init(data);
					};
					$scope.$inner.data = function() {
						var method;
						var succFun = $scope.$inner.succFun;
						if($.isEmptyObject($attrs.method)){
							method = "get";
						}else{
							method = $attrs.method
						}
						$http({
							method : method,
							url : $scope.$inner.action,
							params : {
								"condition" : $scope.$inner.param
							}
						}).then(function successCallback(response) {
							if (response.data.code == 0) {
								data = response.data.data;		
								$scope.$inner.init(data);
								if ($.isFunction(succFun)) {
									succFun(response.data);
								}
							}
						}, function errorCallback(response) {
						});
					}
					/**
					 * 后台数据加载,后台访问路径可通过方法传参和控件属性传参两种
					 */
					$scope.$outer.load = function(param,action,succFun) {
						if (mj.isEmpty(action)) {
							action = mj.findAttr($attrs.action,$scope);
						}
						$scope.$inner.param=param;
						$scope.$inner.action=action;
						$scope.$inner.succFun = succFun;
						$scope.$inner.data();
					};
					$scope.$inner.build();
				}
			}
		}
	});
});
/**
 * 动态添加控件
 */
mj.buildRadio = function(opts) {
	var tag = $("<mj-radio>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};
/**
 * 
 */

mj.module.directive('mjRater', function($compile) {
	return mj.buildFieldDirective({
		name : "mjRater",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.rater = $element.find(".mj-input-field-rater").first();
					$scope.$inner.starShowCls = "mj-input-field-rater-star-show";
					$scope.$inner.init = function() {
						if (!mj.isNumber($attrs.count) || $attrs.count < 1) {
							throw "[count]：必须为大于1的数字，请检查...";
						}
					}
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);
					$scope.$inner.buildStars = function() {
						if (mj.isNumber($attrs.count)) {
							for (var i = 0; i < $attrs.count; i++) {
								$scope.$inner.buildStar(i);
							}
						}
					}
					$scope.$inner.buildStar = function(index) {
						var star = $('<span class="fa fa-star mj-input-field-rater-star"></span>');
						star.appendTo($scope.$inner.field);
						star.attr("data-index", index);
						star.on("mouseover", function() {
							var indx = $(this).attr("data-index");
							if (indx == 0) {
								if ($(this).hasClass($scope.$inner.starShowCls)) {
									$.each($scope.$inner.field.children(), function(index, child) {
										$(child).removeClass($scope.$inner.starShowCls);
									});
								} else {
									$(this).addClass($scope.$inner.starShowCls);
								}
							} else {
								$.each($scope.$inner.field.children(), function(index, child) {
									var _indx = $(child).attr("data-index");
									if (_indx <= indx) {
										$(child).addClass($scope.$inner.starShowCls);
									} else {
										$(child).removeClass($scope.$inner.starShowCls);
									}
								});
							}
						});
					}
					$scope.$outer.getValue = function() {
						var count = 0;
						$.each($scope.$inner.field.children(), function(index, child) {
							if ($(child).hasClass($scope.$inner.starShowCls)) {
								count++;
							}
						});
						return count;
					};

					$scope.$outer.setValue = function(val) {
						if (!mj.isNumber(val)) {
							throw "[count]：必须为大于1的数字，请检查...";
						}
						if (val < 0) {
							val = 0;
						}
						if (val > $attrs.count) {
							val = $attrs.count;
						}
						$.each($scope.$inner.field.children(), function(index, child) {
							$(child).removeClass($scope.$inner.starShowCls);
						});
						for (var i = 0; i < val; i++) {
							var $star = $($scope.$inner.field.children()[i]);
							$star.addClass($scope.$inner.starShowCls);
						}
					};
					$scope.$inner.buildStars();
					$scope.$inner.build();
				}
			}
		}
	});
});

/**
 * 动态添加控件
 */
mj.buildRater = function(opts) {
	var tag = $("<mj-rater>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 *//**
 * 
 */

mj.module.directive('mjSelect', function($http, $compile) {
	return mj.buildFieldDirective({
		name : "mjSelect",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.cls = {
						"item" : "mj-input-field-select-item",
						"itemFind" : ".mj-input-field-select-item",
						"itemDisabled" : "mj-input-field-select-item-disabled",
						"itemSelect" : "mj-input-field-select-item-select",
						"itemSelectFind" : ".mj-input-field-select-item-select",
						"arrow" : "mj-input-field-select-arrow",
						"arrowFind" : ".mj-input-field-select-arrow",
						"arrowDisabled" : "mj-input-field-select-arrow-disabled",
						"icon" : "mj-input-field-select-item-icon",
						"iconFind" : ".mj-input-field-select-item-icon",
						"text" : "mj-input-field-select-item-text",
						"textFind" : ".mj-input-field-select-item-text",
						"single" : "fa-circle-o",
						"singleFind" : ".fa-circle-o",
						"singleSelect" : "fa-dot-circle-o",
						"singleSelectFind" : ".fa-dot-circle-o",
						"multiple" : "fa-square-o",
						"multipleFind" : ".fa-square-o",
						"multipleSelect" : "fa-check-square-o",
						"multipleSelectFind" : ".fa-check-square-o",
						"model" : "fa-circle-o",
						"modelFind" : ".fa-circle-o",
						"modelSelect" : "fa-dot-circle-o",
						"modelSelectFind" : ".fa-dot-circle-o",
					};
					$scope.$inner.arrow = $element.find($scope.$inner.cls.arrowFind).first();
					$scope.$inner.layer = null;
					$scope.$inner.oldValue = null;
					$scope.$inner.scrollFlag = false;
					if (mj.isNotEmpty($attrs.width)) {
						$element.css({
							"width" : $attrs.width
						});
					}
					if (mj.isNotEmpty($attrs.height)) {
						$element.css({
							"height" : $attrs.height
						});
					}
					if ($attrs.model != "multiple") {
						$attrs.model = "single";
					} else {
						$scope.$inner.cls.model = $scope.$inner.cls.multiple;
						$scope.$inner.cls.modelFind = $scope.$inner.cls.multipleFind;
						$scope.$inner.cls.modelSelect = $scope.$inner.cls.multipleSelect;
						$scope.$inner.cls.modelSelectFind = $scope.$inner.cls.multipleSelectFind;
					}
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);
					
					$scope.$inner.buildOtherAttr=function(){
						if (mj.isTrue($attrs.disabled) || mj.isTrue($attrs.readonly)) {
							$scope.$inner.arrow.addClass($scope.$inner.cls.arrowDisabled);
						}
					};
					
					$scope.$outer.setDisabledAfter = function(flag) {
						if(mj.isTrue(flag)){
							$scope.$inner.arrow.addClass($scope.$inner.cls.arrowDisabled);
						}else{
							$scope.$inner.arrow.removeClass($scope.$inner.cls.arrowDisabled);
						}
					};
					
					$scope.$outer.setReadonlyAfter = function(flag) {
						if(mj.isTrue(flag)){
							$scope.$inner.arrow.addClass($scope.$inner.cls.arrowDisabled);
						}else{
							$scope.$inner.arrow.removeClass($scope.$inner.cls.arrowDisabled);
						}
					};

					$scope.$outer.removeChildren = function() {
						$scope.$inner.itemBody.empty();
					}

					/**
					 * 添加下拉框选项格式{"label" :"label","value" :"value"}
					 */
					$scope.$outer.addChild = function(item) {
						$scope.$inner.buildItem(item);
					};

					$scope.$inner.show = function() {
						if(mj.isTrue($attrs.disabled)){
							return;
						}
						if ($scope.$inner.layer.css("display") == "blcok") {
							return;
						}
						var width = $scope.$inner.field.outerWidth(true) + $scope.$inner.arrow.outerWidth(true)
						$scope.$inner.layer.css({
							"width" : width+2
						});
						var offset = $scope.$inner.field.offset();
						var left = offset.left-1;
						var top = offset.top + $scope.$inner.field.outerHeight(true)+1;
						// 自适应下边框控件对齐出现
						var windowHeight = $(window).height();
						if (top + $scope.$inner.layer.outerHeight(true) > windowHeight) {
							top = $scope.$inner.field.offset().top - $scope.$inner.layer.outerHeight(true)-1;
						}

						$scope.$inner.layer.css({
							"left" : left + "px",
							"top" : top + "px",
							"display" : "block"
						});
						$scope.$inner.fieldTop=offset.top;
					}

					$scope.$inner.hide = function() {
						$scope.$inner.layer.css({
							"display" : "none"
						});
					};

					/**
					 * 内部方法：构建层
					 */
					$scope.$inner.buildLayer = function() {
						$scope.$inner.layer = $('<div class="mj-input-field-select-layer"><div class="mj-input-field-select-layer-body"><ul></ul></div></div>');
						$scope.$inner.itemBody=$scope.$inner.layer.find("ul").first();
						$scope.$inner.layer.attr({
							"id" : $attrs.id + "-layer"
						});
						$(document.body).append($scope.$inner.layer);
						$(document.body).on({
							"click": function(event) {
								var obj = $(event.target);
								if (!obj.is($scope.$inner.arrow) && !obj.parent().is($scope.$inner.arrow) && !obj.is($scope.$inner.field)) {
									var ul = obj.closest("div[id='" + $attrs.id + "-layer']");
									if (ul.length == 0) {
										$scope.$inner.hide();
									}
								}
							}
						});
						
						$($scope.$inner.itemBody).on("mouseover", function(event) {
							$scope.$inner.scrollFlag=true;
						});
						$($scope.$inner.itemBody).on("mouseout", function(event) {
							$scope.$inner.scrollFlag=false;
						});
						
						$(window).resize(function() {
							$scope.$inner.hide();
						});
						
						$(window).mousewheel(function(event) {
							var offset = $scope.$inner.field.offset();
							if($scope.$inner.fieldTop!=offset.top){
								$scope.$inner.hide();
							}
						});
						
						$scope.$inner.field.on("click", function() {
							if ($scope.$inner.layer.css("display") == "block") {
								$scope.$inner.hide();
							} else {
								$scope.$inner.show();
							}
						});
					};

					/**
					 * 内部方法：构建箭头
					 */
					$scope.$inner.buildArrow = function() {
						$scope.$inner.arrow.on("click", function() {
							if ($scope.$inner.layer.css("display") == "block") {
								$scope.$inner.hide();
							} else {
								$scope.$inner.show();
							}
						});
					};

					$scope.$inner.buildItem = function(item) {
						var child = $(mj.templates.mjSelectItem);
						$scope.$inner.itemBody.append(child);
						var icon = child.find($scope.$inner.cls.iconFind).first();
						var text = child.find($scope.$inner.cls.textFind).first();
						icon.addClass($scope.$inner.cls.model);
						var label;
						var value;
						// 通过属性data-label-field和data-value-field来确定data的数据列，如果未设置就是按照label和value获取数据
						if (mj.isNotEmpty($attrs.labelField) && mj.isNotEmpty($attrs.valueField)) {
							label = item[$attrs.labelField];
							value = item[$attrs.valueField];
						} else {
							label = item.label;
							value = item.value;
						}

						text.text(label);
						child.attr("data-value", value);
						child.attr("data-text", label);

						if ($attrs.disabled == "true") {
							child.addClass($scope.$inner.cls.itemDisabled);
						}
						if (mj.isNotEmpty($attrs.value)) {
							var values = $attrs.value.split(",");
							if ($.inArray(value, values)) {
								$scope.$inner.selectItem(child);
							}
						}
						child.on("click", function() {
							var children = $scope.$inner.layer.find($scope.$inner.cls.itemFind);
							if ($attrs.model == "single") {
								$.each(children, function(index, item) {
									$scope.$inner.unselectItem($(item));
								});
								$scope.$inner.selectItem(child);
								$scope.$inner.hide();
							} else {
								if (child.hasClass($scope.$inner.cls.itemSelect)) {
									$scope.$inner.unselectItem(child);
								} else {
									$scope.$inner.selectItem(child);
								}
							}
							$scope.$outer.changeValue();
						});
					};

					$scope.$inner.buildReturn = function(item) {
						var ret = {
							"getValue" : function() {
								return item.attr("data-value");
							},
							"getLabel" : function() {
								return item.attr("data-text");
							},
							"value" : item.attr("data-value"),
							"label" : item.attr("data-text")
						};
						return ret;
					};

					/**
					 * 获得当前选中项，返回格式{"label" :"label","value" :"value"}
					 */
					$scope.$outer.getSelect = function() {
						var children = $scope.$inner.layer.find($scope.$inner.cls.itemSelectFind);
						if ($attrs.model == "single") {
							if (children.length > 0) {
								return $scope.$inner.buildReturn(children.first());
							} else {
								return null;
							}
						} else {
							var _value = [];
							$.each(children, function(index, item) {
								_value.push($scope.$inner.buildReturn($(item)));
							});
							return _value;
						}
					};

					$scope.$inner.selectItem = function(item) {
						var icon = item.find($scope.$inner.cls.iconFind).first();
						item.addClass($scope.$inner.cls.itemSelect);
						icon.removeClass($scope.$inner.cls.model);
						icon.addClass($scope.$inner.cls.modelSelect);
					};

					$scope.$inner.unselectItem = function(item) {
						var icon = item.find($scope.$inner.cls.iconFind).first();
						item.removeClass($scope.$inner.cls.itemSelect);
						icon.removeClass($scope.$inner.cls.modelSelect);
						icon.addClass($scope.$inner.cls.model);
					};

					/**
					 * 获取当前选中项的value
					 */
					$scope.$outer.getValue = function() {
						var children = $scope.$inner.layer.find($scope.$inner.cls.itemSelectFind);
						var value = [];
						$.each(children, function(index, item) {
							value.push($(item).attr("data-value"));
						});
						return value.join(",");
					};

					/**
					 * 设置当前选中项的value
					 */
					$scope.$outer.setValue = function(value) {
						$attrs.value = value;
						$scope.$inner.clearSelected();
						var children = $scope.$inner.layer.find($scope.$inner.cls.itemFind);
						if (children.length == 0) {
							return;
						}
						if ($attrs.model == "single") {
							$.each(children, function(index, child) {
								if (value + "" == $(child).attr("data-value")) {
									$scope.$inner.selectItem($(child));
								}
							});
						} else {
							$.each(children, function(index, child) {
								var _value = $(child).attr("data-value");
								if($.isArray(value)){
									if ($.inArray(_value, value)) {
										$scope.$inner.selectItem($(child));
									}
								}
							});
						}
						$scope.$outer.changeValue();
					};

					/**
					 * 设置当前选中项的value
					 */
					$scope.$outer.changeValue = function() {
						var children = $scope.$inner.layer.find($scope.$inner.cls.itemSelectFind);
						var value = [];
						$.each(children, function(index, item) {
							value.push($(item).attr("data-text"));
						});
						$scope.$inner.field.val(value.join(","));
						if ($scope.$inner.oldValue == $scope.$inner.field.val()) {
							return;
						}
						$scope.$inner.oldValue = $scope.$inner.field.val();
						if (mj.isTrue($attrs.editable)){
							$scope.$outer.validity();
						}
						if (!mj.isEmpty($attrs.change)) {
							if ($.isFunction(mj.findCtrlScope($scope)[$attrs.change])) {
								mj.findCtrlScope($scope)[$attrs.change]($scope.$outer);
							}
						}
					};

					$scope.$inner.clearSelected = function() {
						var children = $scope.$inner.layer.find($scope.$inner.cls.itemSelectFind);
						$.each(children, function(index, child) {
							$scope.$inner.unselectItem($(child));
						});
					}
					/**
					 * 根据选择项下标删除选择项，选择项下标从0开始
					 */
					$scope.$outer.removeChildByIndex = function(index) {
						var children = $element.find($scope.$inner.cls.item);
						$.each(children, function(i, child) {
							if (i == index) {
								$(child).remove();
							}
						});
						$scope.$outer.changeValue();
					}

					$scope.$inner.buildSelect = function(data) {
						$scope.$outer.removeChildren();
						if (mj.isNotEmpty(data)) {
							$scope.$inner.data = data;
							var items = new Array();
							if (typeof ($scope.$inner.data) === "string") {
								try {
									items = $.parseJSON($scope.$inner.data);
								} catch (e) {
									throw "参数格式错误，必须为JSON数组"
								}
							} else if (mj.isJson($scope.$inner.data)) {
								items[0] = $scope.$inner.data;
							} else if ($.isArray($scope.$inner.data)) {
								items = $scope.$inner.data;
							} else {
								throw "参数格式错误，必须为JSON数组"
							}

							if (mj.isTrue($attrs.empty)) {
								if (mj.isNotEmpty($attrs.labelField) && mj.isNotEmpty($attrs.valueField)) {
									var obj={};
									obj[$attrs.valueField]="";
									obj[$attrs.labelField]="请选择...";
									obj["index"]="1";
									$scope.$inner.buildItem(obj);
								} else {
									$scope.$inner.buildItem({
										"value" : "",
										"label" : "请选择...",
										"index" : "1"
									});
								}
							}

							$.each(items, function(index, item) {
								$scope.$inner.buildItem(item);
							});
							$scope.$outer.setValue($attrs.value);
						}
					}

					/**
					 * 加载现有数据到下拉框中，数据可通过方法传参和控件属性传参两种
					 */
					$scope.$outer.loadData = function(data, succFun) {
						if ($.isEmptyObject(data)) {
							if ($.isEmptyObject($attrs.data)) {
								throw "参数为空，请设置选择框的参数!";
							} else {
								data = $attrs.data;
							}
						}
						$scope.$inner.buildSelect(data);
						if ($.isFunction(succFun)) {
							succFun(data);
						}
					};
					$scope.$inner.data = function() {
						var method;
						var succFun = $scope.$inner.succFun;
						if ($.isEmptyObject($attrs.method)) {
							method = "get";
						} else {
							method = $attrs.method
						}
						$http({
							method : method,
							url : $scope.$inner.action,
							params : {
								"condition" : $scope.$inner.param
							}
						}).then(function successCallback(response) {
							if (response.data.code == 0) {
								data = response.data.data;
								$scope.$inner.buildSelect(data);
								if ($.isFunction(succFun)) {
									succFun(response.data);
								}
							}
						}, function errorCallback(response) {

						});
					}
					/**
					 * 后台数据加载,后台访问路径可通过方法传参和控件属性传参两种
					 */
					$scope.$outer.load = function(param, action, succFun) {
						if (mj.isEmpty(action)) {
							action = mj.findAttr($attrs.action, $scope);
						}
						$scope.$inner.param = param;
						$scope.$inner.action = action;
						$scope.$inner.succFun = succFun;
						$scope.$inner.data();
					};

					$scope.$outer.destroy = function() {
						$scope.$inner.layer.remove();
						mj.delView($attrs.id);
						$element.remove();
						$scope.$destroy();
						delete $scope;
					}

					if (mj.isNotEmpty($attrs.data)) {
						$scope.$inner.buildSelect($attrs.data);
					}

					$scope.$inner.buildArrow();
					$scope.$inner.buildLayer();
					$scope.$inner.build();
				}

			}
		}
	});
});

/**
 * 动态添加控件
 */
mj.buildSelect = function(opts) {
	var tag = $("<mj-select>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};
/**
 * 
 */

mj.module.directive('mjSelectTree', function($http, $compile) {
	return mj.buildFieldDirective({
		name : "mjSelectTree",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.cls = {
						"arrow" : "mj-input-field-select-arrow",
						"arrowFind" : ".mj-input-field-select-arrow",
						"arrowDisabled" : "mj-input-field-select-arrow-disabled",
					};
					$scope.$inner.arrow = $element.find($scope.$inner.cls.arrowFind).first();
					$scope.$inner.layer = null;
					$scope.$inner.oldValue = null;
					$scope.$inner.scrollFlag = false;
					if (mj.isNotEmpty($attrs.width)) {
						$element.css({
							"width" : $attrs.width
						});
					}
					if (mj.isNotEmpty($attrs.height)) {
						$element.css({
							"height" : $attrs.height
						});
					}
					if ($attrs.model != "multiple") {
						$attrs.model = "single";
					} else {
						$attrs.checkable = "true";
					}
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);

					$scope.$inner.buildOtherAttr=function(){
						if (mj.isTrue($attrs.disabled) || mj.isTrue($attrs.readonly)) {
							$scope.$inner.arrow.addClass($scope.$inner.cls.arrowDisabled);
						}
					};
					
					$scope.$outer.setDisabledAfter = function(flag) {
						if(mj.isTrue(flag)){
							$scope.$inner.arrow.addClass($scope.$inner.cls.arrowDisabled);
						}else{
							$scope.$inner.arrow.removeClass($scope.$inner.cls.arrowDisabled);
						}
					};
					
					$scope.$outer.setReadonlyAfter = function(flag) {
						if(mj.isTrue(flag)){
							$scope.$inner.arrow.addClass($scope.$inner.cls.arrowDisabled);
						}else{
							$scope.$inner.arrow.removeClass($scope.$inner.cls.arrowDisabled);
						}
					};
					
					$scope.$inner.show = function() {
						if(mj.isTrue($attrs.disabled)){
							return;
						}
						if ($scope.$inner.layer.css("display") == "blcok") {
							return;
						}
						var width = $scope.$inner.field.outerWidth(true) + $scope.$inner.arrow.outerWidth(true)
						$scope.$inner.layer.css({
							"width" : width+2
						});
						var offset = $scope.$inner.field.offset();
						var left = offset.left-1;
						var top = offset.top + $scope.$inner.field.outerHeight(true)+1;
						// 自适应下边框控件对齐出现
						var windowHeight = $(window).height();
						if (top + $scope.$inner.layer.outerHeight(true) > windowHeight) {
							top = $scope.$inner.field.offset().top - $scope.$inner.layer.outerHeight(true)-1;
						}

						$scope.$inner.layer.css({
							"left" : left + "px",
							"top" : top + "px",
							"display" : "block"
						});
						$scope.$inner.fieldTop = offset.top;
					}

					$scope.$inner.hide = function() {
						$scope.$inner.layer.css({
							"display" : "none"
						});
					};

					/**
					 * 内部方法：构建层
					 */
					$scope.$inner.buildLayer = function() {
						$scope.$inner.layer = $('<div class="mj-input-field-select-layer"><div class="mj-input-field-select-layer-body"></div></div>');
						$scope.$inner.itemBody = $scope.$inner.layer.find(".mj-input-field-select-layer-body").first();
						$scope.$inner.layer.attr({
							"id" : $attrs.id + "-layer"
						});
						$(document.body).append($scope.$inner.layer);
						$(document.body).on({
							"click" : function(event) {
								var obj = $(event.target);
								if (!obj.is($scope.$inner.arrow) && !obj.parent().is($scope.$inner.arrow) && !obj.is($scope.$inner.field)) {
									var ul = obj.closest("div[id='" + $attrs.id + "-layer']");
									if (ul.length == 0) {
										$scope.$inner.hide();
									}
								}
							}
						});

						$($scope.$inner.itemBody).on("mouseover", function(event) {
							$scope.$inner.scrollFlag = true;
						});
						$($scope.$inner.itemBody).on("mouseout", function(event) {
							$scope.$inner.scrollFlag = false;
						});

						$(window).resize(function() {
							$scope.$inner.hide();
						});

						$(window).mousewheel(function(event) {
							var offset = $scope.$inner.field.offset();
							if ($scope.$inner.fieldTop != offset.top) {
								$scope.$inner.hide();
							}
						});

						$scope.$inner.field.on("click", function() {
							if ($scope.$inner.layer.css("display") == "block") {
								$scope.$inner.hide();
							} else {
								$scope.$inner.show();
							}
						});
					};
					/**
					 * 内部方法：构建箭头
					 */
					$scope.$inner.buildArrow = function() {
						$scope.$inner.arrow.on("click", function() {
							if ($scope.$inner.layer.css("display") == "block") {
								$scope.$inner.hide();
							} else {
								$scope.$inner.show();
							}
						});
					};

					$scope.$inner.buildTree = function() {
						var opts = {
							"id" : $attrs.id + "-tree",
							"action" : $attrs.action,
							"idField" : $attrs.idField,
							"textField" : $attrs.textField,
							"autoload" : "true",
							"method" : $attrs.method,
							"checkable" : $attrs.checkable
						};
						var treeTag = mj.buildTree(opts);
						$scope.$inner.itemBody.append($compile(treeTag)($scope.$new()));
						$scope.$inner.tree = mj.getView(opts.id);
						$scope.$inner.tree.setClick(function(node) {
							var item = $scope.$inner.tree.getSelectNode();
							if ($attrs.model == "single") {
								item = $scope.$inner.tree.getSelectNode();
								$scope.$outer.setValue({
									"id" : item.getId(),
									"text" : item.getText()
								});
							} else {
								item = $scope.$inner.tree.getCheckedChildren();
								var valueArray = [];
								$.each(item, function(index, child) {
									valueArray.push({
										"id" : child.getId(),
										"text" : child.getText()
									});
								});
								$scope.$outer.setValue(valueArray);
							}
						});

					};

					/**
					 * 获取当前选中项的value
					 */
					$scope.$outer.getValue = function() {
						var children = null;
						if ($attrs.model == "single") {
							children = $scope.$inner.tree.getSelectNode();
							if(mj.isNotEmpty(children)){
								return children.getId();
							}else{
								return null;
							}
						} else {
							var valueArray = [];
							children = $scope.$inner.tree.getCheckedChildren();
							$.each(children, function(index, child) {
								valueArray.push(child.getId());
							});
							return valueArray.join(",");
						}
					};

					/**
					 * 设置当前选中项的value
					 */
					$scope.$outer.setValue = function(value) {
						$scope.$inner.oldValue = $scope.$inner.field.val();
						if ($attrs.model == "single") {
							$scope.$inner.field.val(value.text);
						} else {
							var valueArray = [];
							$.each(value, function(index, child) {
								valueArray.push(child.text);
							});
							$scope.$inner.field.val(valueArray.join(","));
						}
						if (!mj.isEmpty($attrs.change)) {
							if ($.isFunction(mj.findCtrlScope($scope)[$attrs.change])) {
								mj.findCtrlScope($scope)[$attrs.change]($scope.$outer);
							}
						}
						$scope.$outer.validity();
					};

					$scope.$outer.load = function(param, action, succFun) {
						$scope.$inner.tree.load(param, action, succFun);
					};

					$scope.$outer.getTree = function(param, action, succFun) {
						return $scope.$inner.tree;
					};

					/**
					 * 设置当前选中项的value
					 */
					$scope.$outer.changeValue = function() {
						if ($scope.$inner.oldValue == $scope.$inner.field.val()) {
							return;
						}
						$scope.$outer.validity();
						if (!mj.isEmpty($attrs.change)) {
							if ($.isFunction(mj.findCtrlScope($scope)[$attrs.change])) {
								mj.findCtrlScope($scope)[$attrs.change]($scope.$outer);
							}
						}
					};

					$scope.$inner.buildArrow();
					$scope.$inner.buildLayer();
					$scope.$inner.buildTree();
					$scope.$inner.build();
				}

			}
		}
	});
});

/**
 * 动态添加控件
 */
mj.buildSelectTree = function(opts) {
	var tag = $("<mj-select-tree>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};
/**
 * 
 */

mj.module.directive('mjSlider', function($compile) {
	return mj.buildFieldDirective({
		name : "mjSlider",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.moveFlag = false;
					$scope.$inner.moveLeft = 0;
					$scope.$inner.oldValue = 0;
					$scope.$inner.ruler = $element.find(".mj-input-field-slider-ruler").first();
					$scope.$inner.pointer = $element.find(".mj-input-field-slider-pointer").first();
					$scope.$inner.init = function() {
						if (mj.isEmpty($attrs.format)) {
							$attrs.format = "p";
						} else {
							if ($attrs.format != "p" && $attrs.format != "n") {
								$attrs.format = "p";
							}
						}
						if ($attrs.format == "n") {
							if (mj.isEmpty($attrs.from)) {
								$attrs.from = 0;
							}
							if (mj.isEmpty($attrs.to)) {
								$attrs.from = 100;
							}
							if (parseInt($attrs.from, 10) - parseInt($attrs.to, 10) >= 0) {
								throw "最小值应大于最大值，请检查...";
							}
							$scope.$inner.size = parseInt($attrs.to, 10) - parseInt($attrs.from, 10);
							$scope.$inner.pointer.text($attrs.from);
						} else {
							$scope.$inner.pointer.text("0");
						}
					}
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);

					$scope.$inner.mouseup = function() {
						$scope.$inner.moveFlag = false;
						$(document.body).unbind("mouseup", $scope.$inner.mouseup);
						$scope.$inner.setStep();
						if ($.isFunction(mj.findCtrlScope($scope)[$attrs.finish])) {
							mj.findCtrlScope($scope)[$attrs.finish]($scope.$outer);
						}
					}

					$scope.$inner.setStep = function() {
						if (mj.isNumber($attrs.step)) {
							var step = parseInt($attrs.step);
							var newValue = parseInt($scope.$outer.getValue());
							var length = newValue - $scope.$inner.oldValue;
							if (length == 0) {
								return;
							}
							if (newValue >= $attrs.to) {
								$scope.$outer.setValue($attrs.to);
								return;
							}
							if (newValue <= $attrs.from) {
								$scope.$outer.setValue($attrs.from);
								return;
							}
							if (length > 0) {
								var mod = length % step;
								if (mod >= step / 2) {
									var move = parseInt(newValue) - mod + step;
									$scope.$outer.setValue(move);
								} else {
									$scope.$outer.setValue(parseInt(newValue) - mod);
								}
							} else {
								length = $scope.$inner.oldValue - newValue;
								var mod = length % step;
								if (mod >= step / 2) {
									var move = parseInt(newValue) - (step - mod);
									$scope.$outer.setValue(move);
								} else {
									$scope.$outer.setValue(parseInt(newValue) + mod);
								}
							}
						}

					};

					$scope.$inner.move = function(eventLeft) {
						if ($scope.$inner.moveFlag == true) {
							$attrs.valueFlag = false;
							var left = eventLeft - $scope.$inner.ruler.position().left;
							if (left <= 0) {
								$scope.$inner.moveLeft = 0;
							} else if (left >= $scope.$inner.ruler.width() - $scope.$inner.pointer.width()) {
								$scope.$inner.moveLeft = $scope.$inner.ruler.width() - $scope.$inner.pointer.width();
							} else {
								$scope.$inner.moveLeft = eventLeft - $scope.$inner.ruler.position().left;
							}
							var rater = ($scope.$inner.moveLeft / $scope.$inner.ruler.width());
							$scope.$inner.pointer.css({
								"left" : rater * 100 + "%"
							});
							$scope.$inner.pointer.attr({
								"data-left" : rater * 100
							});
							var _rater = (($scope.$inner.moveLeft) / ($scope.$inner.ruler.width() - $scope.$inner.pointer.width())).toFixed(2)
							$scope.$outer.getDisplay(_rater);
						}
					}

					$scope.$inner.buildPointer = function() {
						$scope.$inner.field.css({
							"padding-left" : "0px",
							"padding-right" : "0px",
						});
						$scope.$inner.pointer.on("mousedown", function(event) {
							event.preventDefault();
							if (mj.isFalse($attrs.editable)){
								return;
							}
							$scope.$inner.moveFlag = true;
							$scope.$inner.oldValue = $scope.$outer.getValue();
							$(document.body).on("mouseup", $scope.$inner.mouseup);
						});
						$scope.$inner.pointer.on("mousemove", function(event) {
							$scope.$inner.move(event.pageX);
						});
						$scope.$inner.ruler.on("mousemove", function(event) {
							$scope.$inner.move(event.pageX);
						});
						$element.on("mousemove", function(event) {
							$scope.$inner.move(event.pageX);
						});

					}

					$scope.$outer.getDisplay = function(rater) {
						var p = parseInt(rater * 100, 10);
						if ($attrs.format == "p") {
							$scope.$inner.pointer.text(p + "%");
						} else {
							var value=parseInt($attrs.from, 10) + ($scope.$inner.size * p / 100);
							$scope.$inner.pointer.text(value);
						}
						$scope.$inner.pointer.attr({
							"data-value" : $scope.$inner.pointer.text()
						});
					};

					$scope.$outer.getValue = function() {
						return $scope.$inner.pointer.attr("data-value");
					};

					$scope.$outer.setValue = function(val) {
						$attrs.valueFlag = true;
						$attrs.value = val;
						if ($attrs.format == "n") {
							$scope.$inner.pointer.text(val);
						} else {
							$scope.$inner.pointer.text(val + "%");
						}
						$scope.$inner.pointer.attr({
							"data-value" : $scope.$inner.pointer.text()
						});
						$scope.$outer.layout();
					};
					
					$scope.$outer.setFrom = function(val) {
						$scope.$inner.pointer.attr({
							"data-from" : val
						});
						$attrs.from = val;
					};
					
					$scope.$outer.setTo = function(val) {
						$scope.$inner.pointer.attr({
							"data-to" : val
						});
						$attrs.to = val;
					};
					
					$scope.$outer.setSize = function() {
						$scope.$inner.size = parseInt($attrs.to, 10) - parseInt($attrs.from, 10);
					}

					$scope.$outer.layout = function() {
						var p = 0;
						var value=$scope.$inner.pointer.attr("data-value");
						if ($attrs.format == "n") {
							p = (((parseInt(value, 10) - parseInt($attrs.from, 10)) / $scope.$inner.size) * 100);
						} else {
							p = parseInt(value);
						}
						var v = $scope.$inner.pointer.width() * 100 / $scope.$inner.ruler.width();
						var x = ((p) / (100 + v)) * 100;
						if (x > (100 - v)) {
							x = (100 - v);
						}
						$scope.$inner.pointer.css({
							"left" : x.toFixed(1) + "%"
						});
						$scope.$inner.pointer.attr({
							"data-left" : x.toFixed(1)
						});
					};
					$scope.$inner.buildPointer();
					$scope.$inner.build();
				}
			}
		}
	});
});

/**
 * 动态添加控件
 */
mj.buildRater = function(opts) {
	var tag = $("<mj-slider>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */

mj.module.directive('mjTab', function($compile) {
	return mj.buildDirective({
		name : "mjTab",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.children = [];
					$scope.$inner.activateItem = null;
					$scope.$inner.modelArray = [ "default", "card", "button" ];
					$scope.$inner.addChild = function(sc, el, rs) {
						$scope.$inner.children.push({
							"sc" : sc,
							"el" : el,
							"rs" : rs
						});
					};
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.height)) {
							$element.css({
								"height" : $attrs.height
							});
						}
						if (mj.isNotEmpty($attrs.width)) {
							$element.css({
								"width" : $attrs.width
							});
						}
						if (mj.isEmpty($attrs.model) || !$.inArray($attrs.model, $scope.$inner.modelArray)) {
							$attrs.model = "default";
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var head = $element.find(".mj-tab-head-content").first();
					head.parent().parent().parent().addClass("mj-tab-head-table" + "-" + $attrs.model);
					var body = $element.find(".mj-tab-body").first();
					var left = $element.find(".mj-tab-switch-left").first();
					var right = $element.find(".mj-tab-switch-right").first();
					$scope.$inner.stepsize = 10;
					$scope.$inner.scrollLength = $scope.$inner.stepsize;

					$scope.$outer.addChild = function(opts) {
						if (mj.checkView(opts.id)) {
							$scope.$inner.checkView(head, body, opts.id);
							return;
						}
						var tabItem = $scope.$inner.buildTabItem({
							"id" : opts.id,
							"title" : opts.title,
							"icon" : opts.icon,
							"model" : opts.model || "dynamic",
							"closable" : opts.closable,
							"active" : opts.active,
							"delay" : "false",
							"view" : opts.view,
							"param" : opts.param,
							"switch-flag" : "true",
							"controller" : opts.controller,
							"controller-alias" : opts.controllerAlias,
						});
						var _dom = $compile(tabItem)($scope.$new());
						body.append(_dom);
						var current = $scope.$inner.children[$scope.$inner.children.length - 1];
						current.rs.param = opts.param;
						current.rs.load = opts.load;
						current.rs.content = opts.content;
						current.rs.closeAfter = opts.closeAfter;
						current.rs.closeBefore = opts.closeBefore;
						current.rs.activateAfter = opts.activateAfter;
						current.rs.activateBefore = opts.activateBefore;

						$scope.$inner.buildItem(current);
						$scope.$inner.showScroll("addItem");
						var item = head.children("span:last-child");
						head.scrollLeft(item.offset().left);
						$scope.$outer.layout();
						return current.sc.$outer;
					};

					$scope.$inner.buildTabItem = function(opts) {
						var tag = $("<mj-tab-item>");
						$.each(opts, function(key, value) {
							tag.attr("data-" + key, value);
						});
						return tag;
					}
					// 通过tab的id获得tab对象，并且返回index属性和close和select方法，可直接调用。
					$scope.$outer.getChildById = function(id) {
						var obj = null;
						$.each($scope.$inner.children, function(index, child) {
							if (child.rs.id == id) {
								obj = $scope.$inner.buildItemAttrs(child);
								return false;
							}
						});
						return obj;
					};
					// 获取全部tab页签对象返回json格式，键为tab的下标，值为对象，并且返回id、title、index属性和close和select方法，可直接调用。
					$scope.$outer.getChildren = function() {
						var list = {};
						$.each($scope.$inner.children, function(index, child) {
							list[index] = $scope.$inner.buildItemAttrs(child);
							;
						});
						return list;
					};

					// 通过tab的id获得tab对象，调用close事件
					$scope.$outer.close = function(id) {
						$.each($scope.$inner.children, function(index, sub) {
							if (sub.rs.id == id) {
								var item = head.find("span[data-key=" + id + "]");
								var close = item.find(".mj-tab-head-item-close").first();
								if (sub.rs.closable == "true") {
									close.click();
								}
							}
						});
					};
					// 获取全部tab页签对象并且调用关闭事件
					$scope.$outer.closeAll = function() {
						var tabs = $scope.$inner.children;
						for (j = tabs.length - 1; j >= 0; --j) {
							var sub = tabs[j];
							var item = head.find("span[data-key=" + sub.rs.id + "]");
							var close = item.find(".mj-tab-head-item-close").first();
							if (sub.rs.closable == "true") {
								close.click();
							}
						}
					};
					// 获得选中的tab对象，并且返回id、title、index属性和close和select方法，可直接调用。
					$scope.$outer.getSelected = function() {
						return $scope.$inner.activateItem;
					};
					// 通过tab的下标（从1开始）获得tab对象，调用选中事件
					$scope.$outer.selectByIndex = function(index) {
						var tabs = $scope.$inner.children;
						var sub = tabs[index - 1];
						var item = head.find("span[data-key=" + sub.rs.id + "]");
						if (item.length == 0) {
							return null;
						}
						item.click();
						$scope.$inner.showScroll();
						if (head.scrollLeft() > 0) {
							head.scrollLeft(item.offset().left);
						}
					};

					$scope.$outer.selectById = function(id) {
						var item = head.find("span[data-key=" + id + "]");
						if (item.length == 0) {
							return null;
						}
						item.click();
						$scope.$inner.showScroll();
						if (head.scrollLeft() > 0) {
							head.scrollLeft(item.offset().left);
						}
					};

					$scope.$inner.checkView = function(head, body, id) {
						$.each(head.children(), function(index, sub) {
							var _sub = $(sub);
							if (_sub.attr("data-key") == id) {
								head.scrollLeft(_sub.offset().left);
							}
						});
						var item = head.find("span[data-key=" + id + "]");
						item.click();

					}
					$scope.$inner.leftClick = function() {
						var sl = head.scrollLeft();
						if (sl != 0) {
							$scope.$inner.scrollLength = sl;
						}
						head.scrollLeft($scope.$inner.scrollLength - $scope.$inner.stepsize);
						$scope.$inner.scrollLength -= $scope.$inner.stepsize;
						if (($scope.$inner.scrollLength + $scope.$inner.stepsize) < $scope.$inner.stepsize) {
							$scope.$inner.scrollLength = $scope.$inner.stepsize;
							left.attr("disabled", "true");
							clearInterval($scope.$inner.time);
						} else {
							right.removeAttr("disabled");
						}
					}
					$scope.$inner.rightClick = function() {
						head.scrollLeft($scope.$inner.scrollLength);
						$scope.$inner.scrollLength += $scope.$inner.stepsize;
						if ($scope.$inner.scrollLength == (head.scrollLeft() + $scope.$inner.stepsize)) {
							left.removeAttr("disabled");
							$scope.$inner.scrollLength = head.scrollLeft() + $scope.$inner.stepsize;
						} else if ($scope.$inner.scrollLength > (head.scrollLeft() + $scope.$inner.stepsize)) {
							right.attr("disabled", "true");
							$scope.$inner.scrollLength = head.scrollLeft() + $scope.$inner.stepsize;
							clearInterval($scope.$inner.time);
						}
					}
					$scope.$inner.time;
					$scope.$inner.onMouse = function(type) {
						if (type == "left") {
							$scope.$inner.leftClick();
						} else {
							$scope.$inner.rightClick();
						}
					}

					$scope.$inner.build = function() {
						$.each($scope.$inner.children, function(index, child) {
							$scope.$inner.buildItem(child);
						});
						right.on("mousedown", function() {
							$scope.$inner.time = setInterval(function() {
								$scope.$inner.onMouse("right");
							}, 20);
						});
						right.on("mouseup", function() {
							clearInterval($scope.$inner.time);
						});
						left.on("mousedown", function() {
							$scope.$inner.time = setInterval(function() {
								$scope.$inner.onMouse("left");
							}, 20);
						});
						left.on("mouseup", function() {
							clearInterval($scope.$inner.time);
						});
					};

					$scope.$inner.buildItem = function(child) {
						var item = $('<span></span>');
						item.attr({
							"class" : "mj-tab-head-item",
							"data-key" : child.rs.id,
							"data-include-id" : child.rs.includeId,
							"data-load-flag" : child.rs.delay
						});
						var include = null;
						if (child.rs.model == "dynamic" && mj.endWith(child.rs.view, ".xml")) {
							include = mj.buildInclude({
								"view" : child.rs.view,
								"controller" : child.rs.controller,
								"param" : child.rs.param,
								"switch-flag" : "true",
								"delay" : child.rs.delay,
								"controller-alias" : child.rs.controllerAlias,
								"load" : child.rs.load
							});
						} else if (child.rs.model == "static") {
							include = child.rs.view;
						}

						if (child.rs.model == "dynamic") {
							if (mj.isTrue(child.rs.delay)) {
								child.el.append(include);
							} else {
								child.el.append($compile(include)(child.sc.$new()));
							}
						} else if (child.rs.model == "static") {
							child.el.append($compile(include)(child.sc.$new()));
						}

						item.attr({
							"class" : "mj-tab-head-item",
							"data-key" : child.rs.id,
							"data-include-id" : child.rs.includeId,
							"data-load-flag" : child.rs.delay
						});
						item.addClass("mj-tab-head-item" + "-" + $attrs.model);
						item.appendTo(head);
						$scope.$inner.buildTitle(child, item);
					};

					$scope.$inner.buildTitle = function(child, item) {
						item.on("click", function() {
							if (mj.isNotEmpty($scope.$inner.activateItem)) {
								if ($scope.$inner.activateItem.getId() == item.attr("data-key")) {
									return;
								}
							}
							if (mj.isNotEmpty(child.rs.activateBefore)) {
								if ($.isFunction(child.rs.activateBefore)) {
									var flag = child.rs.activateBefore($scope.$inner.buildItemAttrs(child));
									if (flag == false) {
										return;
									}
								} else if ($.isFunction(mj.findCtrlScope($scope)[child.rs.activateBefore])) {
									var flag = mj.findCtrlScope($scope)[child.rs.activateBefore]($scope.$inner.buildItemAttrs(child));
									if (flag == false) {
										return;
									}
								}
							}
							if (mj.isTrue(item.attr("data-load-flag"))) {
								item.attr("data-load-flag", "false");
								var _body = body.find("div[id='" + item.attr("data-key") + "']").first();
								$compile(_body.children()[0])(child.sc.$new());
							}
							$scope.$inner.activateItem = $scope.$inner.buildItemAttrs(child);

							$.each(head.children(), function(index, sub) {
								var _sub = $(sub);
								if (_sub.attr("data-key") == item.attr("data-key")) {
									_sub.addClass("mj-tab-head-item-show");
									_sub.addClass("mj-tab-head-item-show" + "-" + $attrs.model);
								} else {
									_sub.removeClass("mj-tab-head-item-show");
									_sub.removeClass("mj-tab-head-item-show" + "-" + $attrs.model);
								}
							});
							$.each(body.children(), function(index, sub) {
								var _sub = $(sub);
								_sub.css({
									"display" : "none"
								});
								_sub.removeClass("mj-tab-body-active");

							});
							var _body = body.find("div[id='" + item.attr("data-key") + "']").first();
							_body.css({
								"display" : "block"
							});
							_body.addClass("mj-tab-body-active");

							// if (mj.isTrue(item.attr("data-layout-flag"))) {
							// return;
							// } else {
							// item.attr("data-layout-flag", "true");
							// mj.layoutView(item.attr("data-key"));
							// }
							mj.layoutView(item.attr("data-key"));
							if (mj.isNotEmpty(child.rs.activateAfter)) {
								if ($.isFunction(child.rs.activateAfter)) {
									child.rs.activateAfter($scope.$inner.buildItemAttrs(child));
								} else if ($.isFunction(mj.findCtrlScope($scope)[child.rs.activateAfter])) {
									mj.findCtrlScope($scope)[child.rs.activateAfter]($scope.$inner.buildItemAttrs(child));
								}
							}
						});
						if (!$.isEmptyObject(child.rs.icon)) {
							var icon = $('<i class="mj-tab-head-item-icon"></i>');
							icon.addClass(child.rs.icon);
							icon.appendTo(item);
						}
						item.append('<span class="mj-tab-title">' + child.rs.title + '</span>');
						$scope.$inner.buildClose(child, item);
						if (mj.isTrue(child.rs.active)) {
							item.click();
						} else {
							if (head.children().length == 1) {
								item.click();
							}
						}
					};

					/**
					 * 外部方法：获取激活对象
					 */
					$scope.$outer.getActivateChild = function() {
						return $scope.$inner.activateItem;
					};

					/**
					 * 内部方法：构建tabitem对象的返回对象
					 */
					$scope.$inner.buildItemAttrs = function(child) {
						return {
							"getId" : function() {
								return child.sc.$outer.getId();
							},
							"getText" : function() {
								return child.sc.$outer.getText();
							},
							"close" : function() {
								$scope.$outer.close(child.sc.$outer.getId());
							},
							"select" : function() {
								$scope.$outer.selectById(child.sc.$outer.getId());
							},
							"refresh" : function() {
								$scope.$inner.refreshItem(child);
							},
							"layout" : function() {
								mj.layoutView(child.rs.id);
							}
						};
					}

					/**
					 * 内部方法：刷新节点
					 */
					$scope.$inner.refreshItem = function(child) {
						var item = head.find("span[data-key=" + child.rs.id + "]");
						if (item.length > 0) {
							$scope.$inner.clearBody(child.el);
							child.el.empty();
							var include = null;
							if (child.rs.model == "dynamic") {
								include = mj.buildInclude({
									"view" : child.rs.view,
									"controller" : child.rs.controller,
									"param" : child.rs.param,
									"switch-flag" : "true",
									"delay" : child.rs.delay,
									"controller-alias" : child.rs.controllerAlias,
									"load" : child.rs.load
								});
								child.el.append(include);
								item.attr({
									"data-layout-flag" : "false",
									"data-load-flag" : "true"
								});
								$scope.$inner.activateItem = null;
								item.click();
							}
						}
					};

					$scope.$inner.showScroll = function(operation) {
						var sl = head.scrollLeft();
						if (sl == 0) {
							head.scrollLeft($scope.$inner.stepsize);
							sl = head.scrollLeft();
							if (sl > 0) {
								head.scrollLeft(0);
								left.parent().css({
									"display" : "table-cell"
								});
								if (operation == "addItem") {
									$scope.$inner.time = setInterval(function() {
										$scope.$inner.onMouse("right");
									}, 1);
								}
							} else if (sl == 0) {
								left.parent().css({
									"display" : "none"
								});
							}
						} else {
							left.parent().css({
								"display" : "table-cell"
							});
						}
					}
					$scope.$inner.buildClose = function(child, item) {
						if (child.rs.closable == "true") {
							var close = $('<i class="fa fa-close mj-tab-head-item-close"></i>');
							close.appendTo(item);
							close.on("click", function(event) {
								event.stopPropagation();
								var _child = child;
								if (mj.isNotEmpty(child.rs.closeBefore)) {
									if ($.isFunction(child.rs.closeBefore)) {
										var flag = child.rs.closeBefore($scope.$inner.buildItemAttrs(child));
										if (flag == false) {
											return;
										}
									} else if ($.isFunction(mj.findCtrlScope($scope)[child.rs.closeBefore])) {
										var flag = mj.findCtrlScope($scope)[child.rs.closeBefore]($scope.$inner.buildItemAttrs(child));
										if (flag == false) {
											return;
										}
									}
								}
								for (var index = head.children().length - 1; index >= 0; index--) {
									var _sub = $(head.children()[index]);
									if (_sub.attr("data-key") == item.attr("data-key")) {
										var nextItem = null;
										if (_sub.hasClass("mj-tab-head-item-show")) {
											nextItem = item.next();
											if (mj.isEmpty(nextItem.attr("data-key"))) {
												nextItem = item.prev();
											}
										}
										child = null;
										$scope.$inner.children.splice($.inArray(child, $scope.$inner.children), 1);
										_sub.remove();
										var _bt = $(body.children()[index]);
										$scope.$inner.clearBody(_bt);
										_bt.remove();
										mj.delView(_sub.attr("data-key"));
										if (nextItem.length > 0) {
											nextItem.click();
										} else {
											$scope.$inner.activateItem = null;
										}
										$scope.$inner.showScroll();
									}
								}
								if (mj.isNotEmpty(_child.rs.closeAfter)) {
									if ($.isFunction(_child.rs.closeAfter)) {
										_child.rs.closeAfter($scope.$inner.buildItemAttrs(_child));
									} else if ($.isFunction(mj.findCtrlScope($scope)[_child.rs.closeAfter])) {
										mj.findCtrlScope($scope)[_child.rs.closeAfter]($scope.$inner.buildItemAttrs(_child));
									}
								}
							});
						}
					};

					/**
					 * 内部方法：清楚body内容
					 */
					$scope.$inner.clearBody = function(body) {
						var _body = $(body).find("*[data-tag*='mj']");
						for (var i = _body.length - 1; i >= 0; i--) {
							var view = mj.getView($(_body[i]).attr("id"));
							if (!mj.isEmpty(view)) {
								if ($.isFunction(view.destroy)) {
									view.destroy();
								}
							}
						}
						_body.remove();
					}

					$scope.$outer.layout = function() {
						var target = null;
						$.each(body.children(), function(index, sub) {
							var _sub = $(sub);
							if (_sub.hasClass("mj-tab-body-active")) {
								target = _sub;
							}
							_sub.css({
								"display" : "none"
							});
						});
						$.each(body.children(), function(index, sub) {
							$(sub).css({
								"height" : body.innerHeight()
							});
						});
						if (!mj.isEmpty(target)) {
							target.css({
								"display" : "block"
							});
						}
						$scope.$inner.showScroll();
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};

					$scope.$inner.build();

				}
			}
		}
	});
});

mj.module.directive('mjTabItem', function($compile) {
	return mj.buildDirective({
		"name" : "mjTabItem",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.include = null;
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.padding)) {
							$element.css({
								"padding" : $attrs.padding
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var tabScope = $scope.$inner.getParentScope();
					tabScope.$inner.addChild($scope, $element, $attrs);
					$scope.$inner.build = function() {
						if (mj.isNotEmpty($attrs.padding)) {
							$element.css({
								"padding" : $attrs.padding
							});
						}
					};

					$scope.$inner.build();

					$scope.$outer.getText = function() {
						return $attrs.title;
					};
					$scope.$outer.getIcon = function() {
						return $attrs.icon;
					};
					$scope.$outer.getName = function() {
						return $attrs.name;
					};
					$scope.$outer.getId = function() {
						return $attrs.id;
					};
					$scope.$outer.close = function() {
						tabScope.$outer.close($attrs.id);
					};
					/**
					 * 外部节点：获取include
					 */
					$scope.$outer.getInclude = function() {
						return mj.getView($attrs.includeId);
					};
					/**
					 * 外部节点：获取子元素
					 */
					$scope.$outer.getChildren = function() {
						var include = $scope.$outer.getInclude();
						return include.getChildren();
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildTab = function(opts) {
	var tag = $("<mj-tab>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildTabItem = function(opts) {
	var tag = $("<mj-tab-item>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */

mj.module.directive('mjTable', function($http, $compile) {
	return mj.buildDirective({
		name : "mjTable",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.hd_checkbox = null;
					$scope.$inner.rowClick = false;
					$scope.$inner.columns = [];
					$scope.$inner.footBuilded = false;
					$scope.$inner.pageFun = null;
					$scope.$inner.loading = null;

					$scope.$inner.buildLoading = function() {
						var $body = $(document.body);
						if ($body.find(".mj-table-loading").length > 0) {
							$scope.$inner.loading = $body.find(".mj-table-loading").first();
						} else {
							$scope.$inner.loading = $(mj.templates.mjTableLoading);
						}
						$(document.body).append($scope.$inner.loading);
					};

					$scope.$inner.addColumn = function(col) {
						$scope.$inner.columns.push(col);
					};

					$scope.$inner.setPage = function() {
						var pagesize = 15;
						if (!mj.isEmpty($attrs.pagesize)) {
							pagesize = mj.number($attrs.pagesize);
							if (pagesize == 0) {
								pagesize = 15;
							}
						}
						$scope.$inner.page = {
							"pageStart" : 1,
							"pageSize" : pagesize,
							"pageTotal" : 0,
							"total" : 0
						};
					};

					$scope.$inner.doInit = function() {
						$scope.$inner.setPage();
						if (mj.isEmpty($attrs.border)) {
							$attrs.border = true;
						}
						if (!$.isEmptyObject($attrs.height)) {
							$element.css({
								"height" : $attrs.height
							});
						}
						if (!$.isEmptyObject($attrs.width)) {
							$element.css({
								"width" : $attrs.width
							});
						}
						if (mj.isEmpty($attrs.totalEnable) || mj.isTrue($attrs.totalEnable)) {
							$attrs.totalEnable = true;
							$attrs.homeShowable = true;
							$attrs.lastShowable = true;
						} else {
							$attrs.homeShowable = false;
							$attrs.lastShowable = false;
						}
						if (mj.isEmpty($attrs.prevShowable) || mj.isTrue($attrs.prevShowable)) {
							$attrs.prevShowable = true;
						} else {
							$attrs.prevShowable = false;
						}
						if (mj.isEmpty($attrs.nextShowable) || mj.isTrue($attrs.nextShowable)) {
							$attrs.nextShowable = true;
						} else {
							$attrs.nextShowable = false;
						}
						if (mj.isTrue($attrs.loadingEnable)) {
							$scope.$inner.buildLoading();
						}
					};

					$scope.$inner.doInit();

				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var tableData = [];
					var selectData = [];
					var tableTr = [];
					var _height = 0;
					$element.append($(mj.templates.mjTableHead));
					$element.append($(mj.templates.mjTableBody));
					if ($attrs.page == "true") {
						$element.append($(mj.templates.mjTableFoot));
					}
					var body_content = $element.find(".mj-table-body-content:first-child");
					var head_content = $element.find(".mj-table-head-content:first-child");
					var body_tbody = $element.find(".mj-table-bd-tbody:first-child");
					var head_tbody = $element.find(".mj-table-hd-tbody:first-child");
					var element_foot = $element.find(".mj-table-foot:first-child");
					if (mj.isFalse($attrs.border)) {
						element_foot.css({
							"border" : "none"
						});
					}

					/**
					 * 显示加载
					 */
					$scope.$inner.showLoading = function() {
						if (mj.isNotEmpty($scope.$inner.loading)) {
							var offset = $element.offset();
							$scope.$inner.loading.css({
								"left" : offset.left + "px",
								"top" : offset.top + "px",
								"width" : $element.width() + "px",
								"height" : $element.height() + "px",
								"line-height" : $element.height() + "px",
								"display" : "block"
							});
						}
					};

					$scope.$inner.hideLoading = function() {
						if (mj.isNotEmpty($scope.$inner.loading)) {
							$scope.$inner.loading.css({
								"display" : "none"
							});
						}
					};

					$scope.$inner.pageTotal = function() {
						if (mj.isTrue($attrs.totalEnable)) {
							var _size = $scope.$inner.page.total % $scope.$inner.page.pageSize;
							var _page = parseInt($scope.$inner.page.total / $scope.$inner.page.pageSize);
							var pageTotal = (_size == 0) ? (_page) : (_page + 1);
							return pageTotal;
						} else {
							return 0;
						}
					}

					/**
					 * 判断数据是否全选
					 */
					$scope.$inner.isAllCheck = function() {
						if (!$.isEmptyObject(tableData)) {
							for (var i = 0; i < tableData.length; i++) {
								if (tableData[i].checked == 0) {
									return false;
								}
							}
							return true;
						}
						return false;
					}

					/**
					 * 初始化
					 */
					$scope.$inner.init = function() {
						if ($scope.$inner.columns.length != 0) {
							$scope.$inner.buildHead();
						}
						if ($attrs.page == "true") {
							if (mj.isFalse($scope.$inner.footBuilded)) {
								$scope.$inner.footBuilded = true;
								$scope.$inner.buildFoot();
							}
						}
					}

					/**
					 * 表头
					 */
					$scope.$inner.buildHead = function() {
						var head_tr = $scope.$inner.buildTr("mj-table-hd-row", head_tbody);
						if ($scope.$inner.columnAttrs.model == "multiple") {
							var head_td = $scope.$inner.buildTd("mj-table-hd-work", head_tr);
							$scope.$inner.buildHdCheckbox(head_td);
							head_td.width(30);
						}
						if ($scope.$inner.columnAttrs.model == "single") {
							var head_td = $scope.$inner.buildTd("mj-table-hd-work", head_tr);
							head_td.text("选择");
							head_td.width(30);
						}
						if ($scope.$inner.columnAttrs.index == "true") {
							var head_td = $scope.$inner.buildTd("mj-table-hd-index", head_tr);
							head_td.text("序号");
							head_td.width(30);
						}
						$.each($scope.$inner.columns, function(index, item) {
							var head_td = $scope.$inner.buildTd("mj-table-hd-cell", head_tr);
							var head_td_div = $("<div class=\"mj-table-hd-cell-div\"></div>");
							head_td_div.appendTo(head_td);
							if (item.sort) {
								$scope.$inner.buildHdSort(head_td, head_td_div, item);
							} else {
								head_td_div.html('<span class="mj-table-hd-text">' + item.title + '</span>');
							}
						});
					};

					/**
					 * 排序
					 */
					$scope.$inner.buildHdSort = function(head_td, head_td_div, item) {
						head_td_div.html('<span class="mj-table-hd-text">' + item.title + '</span><span class="mj-table-hd-sort fa fa-chevron-down"></span>');
						head_td_div.on("click", function() {
							if (mj.isEmpty(tableData)) {
								return;
							}
							var sort = '';
							var head_sort = head_td.find(".mj-table-hd-sort").first();
							if (head_sort.hasClass('fa-chevron-down')) {
								head_sort.removeClass('fa-chevron-down');
								head_sort.addClass('fa-chevron-up');
								sort = 'ASC';

							} else {
								head_sort.removeClass('fa-chevron-up');
								head_sort.addClass('fa-chevron-down');
								sort = 'DESC';
							}

							if (sort == 'ASC') {
								tableData.sort($scope.$inner.sortBy(item.field, true, String));

							} else {
								tableData.sort($scope.$inner.sortBy(item.field, false, String));
							}
							body_tbody.empty();
							$scope.$inner.buildBody(tableData);

						})
					}

					/**
					 * 排序规则
					 */
					$scope.$inner.sortBy = function(filed, rev, primer) {
						rev = (rev) ? -1 : 1;
						return function(a, b) {
							a = a[filed];
							b = b[filed];
							if (typeof (primer) != 'undefined') {
								a = primer(a);
								b = primer(b);
							}
							if (a < b) {
								return rev * -1;
							}
							if (a > b) {
								return rev * 1;
							}
							return 1;
						}
					}

					/**
					 * 表尾
					 */
					$scope.$inner.buildFoot = function() {
						var disabled = "mj-button-disabled";
						$scope.$inner.pb = {};
						var btnGroup = element_foot.find(".mj-button-group");
						$scope.$inner.pb.home = $scope.$inner.buildPageButton($attrs.homeShowable, $attrs.homeText, "fa-angle-double-left", true);
						if (mj.isNotEmpty($scope.$inner.pb.home)) {
							btnGroup.append($scope.$inner.pb.home);
							$scope.$inner.pb.home.on("click", function() {
								if ($(this).hasClass(disabled)) {
									return;
								}
								if ($scope.$inner.page.pageStart != 1) {
									$scope.$inner.page.pageStart = 1;
									$scope.$inner.loadPage();
								}
							});
						}

						$scope.$inner.pb.prev = $scope.$inner.buildPageButton($attrs.prevShowable, $attrs.prevText, "fa-angle-left", true);
						if (mj.isNotEmpty($scope.$inner.pb.prev)) {
							btnGroup.append($scope.$inner.pb.prev);
							$scope.$inner.pb.prev.on("click", function() {
								if ($(this).hasClass(disabled)) {
									return;
								}
								if ($scope.$inner.page.pageStart != 1) {
									if ($scope.$inner.page.pageStart - 1 > 0) {
										$scope.$inner.page.pageStart = $scope.$inner.page.pageStart - 1;
									}
									$scope.$inner.loadPage();
								}
							});
						}

						$scope.$inner.pb.input = $scope.$inner.buildPageButton(true, "0/0", null, false);
						if (mj.isNotEmpty($scope.$inner.pb.input)) {
							$scope.$inner.pb.input.width(80);
							btnGroup.append($scope.$inner.pb.input);
						}

						$scope.$inner.pb.next = $scope.$inner.buildPageButton($attrs.nextShowable, $attrs.nextText, "fa-angle-right", true);
						if (mj.isNotEmpty($scope.$inner.pb.next)) {
							btnGroup.append($scope.$inner.pb.next);
							$scope.$inner.pb.next.on("click", function() {
								if ($(this).hasClass(disabled)) {
									return;
								}
								if (mj.isTrue($attrs.totalEnable)) {
									if ($scope.$inner.page.pageTotal != $scope.$inner.page.pageStart) {
										$scope.$inner.page.pageStart = $scope.$inner.page.pageStart + 1;
										$scope.$inner.loadPage();
									}
								} else {
									$scope.$inner.page.pageStart = $scope.$inner.page.pageStart + 1;
									$scope.$inner.loadPage();
								}
							});
						}

						$scope.$inner.pb.last = $scope.$inner.buildPageButton($attrs.lastShowable, $attrs.lastText, "fa-angle-double-right", true);
						if (mj.isNotEmpty($scope.$inner.pb.last)) {
							btnGroup.append($scope.$inner.pb.last);
							$scope.$inner.pb.last.on("click", function() {
								if ($(this).hasClass(disabled)) {
									return;
								}
								if ($scope.$inner.page.pageTotal != $scope.$inner.page.pageStart) {
									$scope.$inner.page.pageStart = $scope.$inner.page.pageTotal;
									$scope.$inner.loadPage();
								}
							});
						}
					};

					$scope.$inner.buildPageButton = function(showable, text, icon, disable) {
						if (mj.isTrue(showable)) {
							var $button = $('<div class="mj-button mj-button-default"><div class="mj-button-button"></div></div>');
							if (mj.isTrue(disable)) {
								$button.addClass("mj-button-disabled");
							}
							var $body = $button.find(".mj-button-button").first();
							if (mj.isNotEmpty(icon)) {
								var $icon = $('<span class="mj-button-button-icon fa"></span>');
								$icon.addClass(icon);
								$body.append($icon);
							}
							if (mj.isNotEmpty(text)) {
								var $text = $('<span class="mj-button-button-text"></span>');
								$text.text(text);
								$body.append($text);
							}
							return $button;
						} else {
							return null;
						}
					};

					$scope.$inner.setPaging = function() {
						var input = $scope.$inner.pb.input.find(".mj-button-button-text").first();
						if (mj.isTrue($attrs.totalEnable)) {
							input.text($scope.$inner.page.pageStart + "/" + $scope.$inner.page.pageTotal);
						} else {
							input.text($scope.$inner.page.pageStart);
						}
					};

					$scope.$inner.switchButton = function(flag) {
						var disabled = "mj-button-disabled";
						var disabledFind = ".mj-button-disabled";
						if (mj.isTrue($attrs.totalEnable)) {
							if ($scope.$inner.page.pageTotal <= 1) {
								if (mj.isNotEmpty($scope.$inner.pb.home)) {
									$scope.$inner.pb.home.addClass(disabled);
								}
								if (mj.isNotEmpty($scope.$inner.pb.prev)) {
									$scope.$inner.pb.prev.addClass(disabled);
								}
								if (mj.isNotEmpty($scope.$inner.pb.next)) {
									$scope.$inner.pb.next.addClass(disabled);
								}
								if (mj.isNotEmpty($scope.$inner.pb.last)) {
									$scope.$inner.pb.last.addClass(disabled);
								}
							} else {
								if ($scope.$inner.page.pageStart == 1) {
									if (mj.isNotEmpty($scope.$inner.pb.home)) {
										$scope.$inner.pb.home.addClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.prev)) {
										$scope.$inner.pb.prev.addClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.next)) {
										$scope.$inner.pb.next.removeClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.last)) {
										$scope.$inner.pb.last.removeClass(disabled);
									}
								} else if ($scope.$inner.page.pageStart == $scope.$inner.page.pageTotal) {
									if (mj.isNotEmpty($scope.$inner.pb.home)) {
										$scope.$inner.pb.home.removeClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.prev)) {
										$scope.$inner.pb.prev.removeClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.next)) {
										$scope.$inner.pb.next.addClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.last)) {
										$scope.$inner.pb.last.addClass(disabled);
									}
								} else {
									if (mj.isNotEmpty($scope.$inner.pb.home)) {
										$scope.$inner.pb.home.removeClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.prev)) {
										$scope.$inner.pb.prev.removeClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.next)) {
										$scope.$inner.pb.next.removeClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.last)) {
										$scope.$inner.pb.last.removeClass(disabled);
									}
								}
							}
						} else {
							if ($scope.$inner.page.pageStart == 1) {
								if (mj.isNotEmpty($scope.$inner.pb.home)) {
									$scope.$inner.pb.home.addClass(disabled);
								}
								if (mj.isNotEmpty($scope.$inner.pb.prev)) {
									$scope.$inner.pb.prev.addClass(disabled);
								}
								if (tableData.length < $scope.$inner.page.pageSize) {
									if (mj.isNotEmpty($scope.$inner.pb.next)) {
										$scope.$inner.pb.next.addClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.last)) {
										$scope.$inner.pb.last.addClass(disabled);
									}
								} else {
									if (mj.isNotEmpty($scope.$inner.pb.next)) {
										$scope.$inner.pb.next.removeClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.last)) {
										$scope.$inner.pb.last.removeClass(disabled);
									}
								}
							} else {
								if (mj.isNotEmpty($scope.$inner.pb.home)) {
									$scope.$inner.pb.home.removeClass(disabled);
								}
								if (mj.isNotEmpty($scope.$inner.pb.prev)) {
									$scope.$inner.pb.prev.removeClass(disabled);
								}
								if (tableData.length < $scope.$inner.page.pageSize) {
									if (mj.isNotEmpty($scope.$inner.pb.next)) {
										$scope.$inner.pb.next.addClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.last)) {
										$scope.$inner.pb.last.addClass(disabled);
									}
								} else {
									if (mj.isNotEmpty($scope.$inner.pb.next)) {
										$scope.$inner.pb.next.removeClass(disabled);
									}
									if (mj.isNotEmpty($scope.$inner.pb.last)) {
										$scope.$inner.pb.last.removeClass(disabled);
									}
								}
							}
							if (mj.isTrue(flag)) {
								if (mj.isNotEmpty($scope.$inner.pb.next)) {
									$scope.$inner.pb.next.addClass(disabled);
								}
								if (mj.isNotEmpty($scope.$inner.pb.last)) {
									$scope.$inner.pb.last.addClass(disabled);
								}
								$scope.$inner.page.pageStart = $scope.$inner.page.pageStart - 1;
							}
						}
					};

					/**
					 * 表尾数据
					 */
					$scope.$inner.buildFootPage = function(page) {
						if ($attrs.page == "true") {
							$scope.$inner.page = page;
							$scope.$inner.page.pageTotal = $scope.$inner.pageTotal();
							$scope.$inner.setPaging();
							$scope.$inner.switchButton();
							$scope.$inner.buildTotal();
						}
					}
					
					/**
					 * 构建total
					 */
					$scope.$inner.buildTotal = function() {
						if(mj.isFalse($attrs.totalEnable)){
							return;
						}
						if(mj.isTrue($attrs.totalShow)){
							var total=element_foot.find(".mj-table-total").first();
							total.text("");
							var text="[";
							text+="总共"+$scope.$inner.page.total+"条记录，";
							text+="每页显示"+$scope.$inner.page.pageSize+"条记录，";
							text+="共"+$scope.$inner.page.pageTotal+"页，"
							text+="当前为第"+$scope.$inner.page.pageStart+"页";
							text+="]";
							total.text(text);
						}
					};
					
					/**
					 * 创建tr
					 */
					$scope.$inner.buildTr = function(t_class, t_body) {
						var head_tr = $("<tr></tr>");
						head_tr.addClass(t_class);
						head_tr.appendTo(t_body);
						return head_tr;
					}

					/**
					 * 创建td
					 */
					$scope.$inner.buildTd = function(t_class, t_body) {
						var i_td = $("<td></td>");
						i_td.attr({});
						i_td.addClass(t_class);
						var i_div = $("<div></div>");
						i_div.addClass(t_class + "-div");
						i_div.appendTo(i_td);
						i_td.appendTo(t_body);
						return i_div;
					}

					/**
					 * 创建表头全选checkbox
					 */
					$scope.$inner.buildHdCheckbox = function(t_body) {
						var checkbox = $('<input type="checkbox" name="mj-table-modle-switch">');
						checkbox.appendTo(t_body);
						checkbox.on("change", function() {
							var items = body_content.find("[name='mj-table-modle']");
							if ($(this).prop("checked")) {
								$.each(items, function(index, item) {
									if (!$(item).prop("checked")) {
										$(item).click();
									}
								});
							} else {
								$.each(items, function(index, item) {
									if ($(item).prop("checked")) {
										$(item).click();
									}
								});
							}
							if (!mj.isEmpty($attrs.allclick)) {
								if ($.isFunction(mj.findCtrlScope($scope)[$attrs.allclick])) {
									mj.findCtrlScope($scope)[$attrs.allclick]($scope.$outer);
								}
							}
						});
						$scope.$inner.hd_checkbox = checkbox;

					}

					/**
					 * 创建body checkbox
					 */
					$scope.$inner.buildBdCheckbox = function(body_tr, t_body, data) {
						var checkbox = $('<input type="checkbox" name="mj-table-modle">');
						checkbox.appendTo(t_body);
						checkbox.on("click", function(event) {
							if ($(this).prop("checked")) {
								var idx = selectData.indexOf(data);
								if (idx < 1) {
									selectData.push(data);
								}
								data.checked = 1;
								if (body_tr.hasClass("mj-table-bd-row-move-odd")) {
									body_tr.removeClass("mj-table-bd-row-move-odd");
								} else {
									body_tr.removeClass("mj-table-bd-row-move-even");
								}
								body_tr.addClass("mj-table-bd-row-selected");
								if ($scope.$inner.isAllCheck()) {
									$scope.$inner.hd_checkbox.prop("checked", true);
								}
							} else {
								var idx = selectData.indexOf(data);
								selectData.splice(idx, 1);
								data.checked = 0;
								if (body_tr.hasClass("mj-table-bd-row-selected")) {
									body_tr.removeClass("mj-table-bd-row-selected");
								}
								$scope.$inner.hd_checkbox.prop("checked", false);
							}
							if ($scope.$inner.rowClick) {
								$scope.$inner.rowClick = false;
								event.stopPropagation();
							}
						});
						if (data.checked == 1) {
							$(checkbox).click();
						}
						return checkbox;
					}

					/**
					 * 创建body rodio
					 */
					$scope.$inner.buildBdRadio = function(body_tr, t_body, data) {
						var radio = $('<input type="radio" name="mj-table-modle">');
						radio.appendTo(t_body);
						radio.on("change", function() {
							if ($(this).prop("checked")) {
								selectData = data;
								$scope.$inner.buildBdTrSelect(body_tr);
							}
						});
						return radio;
					}

					/**
					 * 行选中样式变化
					 */
					$scope.$inner.buildBdTrSelect = function(body_tr) {
						$.each(body_tr.parent().children(), function(ind, tr) {
							var $tr = $(tr);
							if ($tr.hasClass("mj-table-bd-row-selected")) {
								$tr.removeClass("mj-table-bd-row-selected");
							}
						});
						if (body_tr.hasClass("mj-table-bd-row-move-odd")) {
							body_tr.removeClass("mj-table-bd-row-move-odd");
						} else {
							body_tr.removeClass("mj-table-bd-row-move-even");
						}
						body_tr.addClass("mj-table-bd-row-selected");
					}

					/**
					 * 创建body 默认第一行
					 */
					$scope.$inner.buildFirstBody = function() {
						var first_tr = $scope.$inner.buildTr("mj-table-bd-first", body_tbody);
						if ($scope.$inner.columnAttrs.model == "multiple" || $scope.$inner.columnAttrs.model == "single") {
							$scope.$inner.buildTd("mj-table-bd-first-cell", first_tr);
						}
						if ($scope.$inner.columnAttrs.index == "true") {
							$scope.$inner.buildTd("mj-table-bd-first-cell", first_tr);
						}
						$.each($scope.$inner.columns, function(index, item) {
							var first_td = $scope.$inner.buildTd("mj-table-bd-first-cell", first_tr);
							if (item.sort == 'true') {
								first_td.text(item.title + 'sort');
							} else {
								first_td.text(item.title);
							}
						});
					}

					/**
					 * 创建body
					 */
					$scope.$inner.buildBody = function(dataList) {
						$scope.$inner.buildFirstBody();
						body_content.scroll(function() {
							var size = body_content.scrollLeft();
							head_content.scrollLeft(size);
						});
						_height = 0;
						$.each(dataList, function(index, data) {
							data.rowindex = index + 1;
							_height += 30;
							var body_tr = $("<tr></tr>");
							if (index % 2 == 0) {
								body_tr.addClass("mj-table-bd-row-odd");
							} else {
								body_tr.addClass("mj-table-bd-row-even");
							}

							body_tr.appendTo(body_tbody);
							var checkbox;
							var radio;
							if ($scope.$inner.columnAttrs.model == "multiple") {
								var body_td = $scope.$inner.buildTd("mj-table-bd-work", body_tr);
								if (!data.checked) {
									data.checked = 0;
								}
								checkbox = $scope.$inner.buildBdCheckbox(body_tr, body_td, data);
								body_td.width(30);
							}
							if ($scope.$inner.columnAttrs.model == "single") {
								var body_td = $scope.$inner.buildTd("mj-table-bd-work", body_tr);
								radio = $scope.$inner.buildBdRadio(body_tr, body_td, data);
								body_td.width(30);
							}
							if ($scope.$inner.columnAttrs.index == "true") {
								var body_td = $scope.$inner.buildTd("mj-table-bd-index", body_tr);
								body_td.text(index + 1);
								body_td.width(30);
							}
							$.each($scope.$inner.columns, function(index, item) {
								var body_td = $scope.$inner.buildTd("mj-table-bd-cell", body_tr);
								if (mj.isNotEmpty(item.render)) {
									if ($.isFunction(item.render)) {
										var text = item.render(data);
										var _dom = $compile(text)($scope.$new());
										body_td.append(_dom);
									} else if ($.isFunction(mj.findCtrlScope($scope)[item.render])) {
										var text = mj.findCtrlScope($scope)[item.render](data);
										var _dom = $compile(text)($scope.$new());
										body_td.append(_dom);
									} else {
										body_td.text($scope.$inner.format(item, data));
									}
								} else {
									body_td.text($scope.$inner.format(item, data));
								}
								if (!$.isEmptyObject(item.width)) {
									body_td.css({
										"width" : item.width
									});
									body_td.parent().css({
										"width" : item.width
									});
								}
							});

							body_tr.on("mousemove", function() {
								if (body_tr.hasClass("mj-table-bd-row-odd")) {
									body_tr.addClass("mj-table-bd-row-move-odd");
								} else {
									body_tr.addClass("mj-table-bd-row-move-even");
								}

							})
							body_tr.on("mouseout", function() {
								if (body_tr.hasClass("mj-table-bd-row-odd")) {
									body_tr.removeClass("mj-table-bd-row-move-odd");
								} else {
									body_tr.removeClass("mj-table-bd-row-move-even");
								}
							})

							body_tr.on("click", function(event) {
								if (radio) {
									$(radio).prop('checked', true).trigger('change');
								} else if (checkbox) {
									if (event.target.type != 'checkbox') {
										$scope.$inner.rowClick = true;
										$(checkbox).click();
									}
								} else {
									selectData = data;
									$scope.$inner.buildBdTrSelect(body_tr);
								}
								if (!mj.isEmpty($attrs.rowclick)) {
									if ($.isFunction(mj.findCtrlScope($scope)[$attrs.rowclick])) {
										mj.findCtrlScope($scope)[$attrs.rowclick](data, $scope.$outer);
									}
								}

							})

							body_tr.on("dblclick", function() {
								if (!mj.isEmpty($attrs.rowdblclick)) {
									if ($.isFunction(mj.findCtrlScope($scope)[$attrs.rowdblclick])) {
										mj.findCtrlScope($scope)[$attrs.rowdblclick](data, $scope.$outer);
									}
								}
							})
							tableTr[index] = body_tr;
							// body_tr.on("focus", function() {
							// mj.findCtrlScope($scope)[$attrs.rowfocus](data,index
							// + 1);
							// })
						});
						body_tbody.parent().css({
							"width" : "100%"
						});
					};

					/**
					 * 格式转换
					 */
					$scope.$inner.format = function(item, data) {
						if (!mj.isEmpty(item.type) && !mj.isEmpty(item.format) && !mj.isEmpty(data[item.field])) {
							if (item.type == 'date') {
								return mj.formatData(data[item.field], item.format);
							} else if (item.type = "number") {
								if ($.isNumeric(data[item.field])) {
									return mj.formatNumber(data[item.field], item.format);
								} else {
									return data[item.field];
								}
							} else {
								return data[item.field];
							}
						} else {
							return data[item.field];
						}
					}

					/**
					 * 清理变量
					 */
					$scope.$inner.clear = function() {
						tableData = [];
						selectData = [];
						tableTr = [];
						_height = 0;
						body_tbody.empty();
						if (!mj.isEmpty($scope.$inner.hd_checkbox)) {
							$scope.$inner.hd_checkbox.prop("checked", false);
						}
					}

					/**
					 * 外部方法：清除表格
					 */
					$scope.$outer.clear = function() {
						tableData = [];
						selectData = [];
						tableTr = [];
						_height = 0;
						head_tbody.empty();
						$scope.$inner.setPage();
						var input = $scope.$inner.pb.input.find(".mj-button-button-text").first();
						input.text("0/0");
						var children = body_tbody.find("*[data-tag*='mj']");
						for (var i = children.length - 1; i >= 0; i--) {
							var view = mj.getView($(children[i]).attr("id"));
							if (!mj.isEmpty(view)) {
								if ($.isFunction(view.destroy)) {
									view.destroy();
								}
							}
						}
						body_tbody.empty();
					}
					
					/**
					 * 外部方法：清除表格
					 */
					$scope.$outer.clearData = function() {
						tableData = [];
						selectData = [];
						tableTr = [];
						_height = 0;
						$scope.$inner.setPage();
						var input = $scope.$inner.pb.input.find(".mj-button-button-text").first();
						input.text("0/0");
						var children = body_tbody.find("*[data-tag*='mj']");
						for (var i = children.length - 1; i >= 0; i--) {
							var view = mj.getView($(children[i]).attr("id"));
							if (!mj.isEmpty(view)) {
								if ($.isFunction(view.destroy)) {
									view.destroy();
								}
							}
						}
						body_tbody.empty();
					}

					$scope.$inner.loadPage = function() {
						$scope.$inner.showLoading();
						// 静态分页
						if ($scope.$inner.staticPage) {						
							if (!mj.isEmpty($scope.$inner.pageFun)) {// 调用外部分页请求
								$scope.$inner.pageFun();
							} else {
								$scope.$inner.static_data();
							}
						} else {
							$scope.$inner.data(false);
						}

					}

					$scope.$inner.data = function(deleteFlag) {
						var method = "GET";
						if (!mj.isEmpty($attrs.method)) {
							method = $attrs.method
						}
						var succFun = $scope.$inner.succFun;
						var _param = {
							"page" : $scope.$inner.page
						};
						$.extend(true, _param, $scope.$inner.param);
						$http({
							method : method,
							url : $scope.$inner.action,
							params : _param
						}).then(function successCallback(response) {
							if (response.data.code == 0) {
								var dataset = response.data.data;
								if (dataset != null && dataset.length > 0) {
									$scope.$inner.clear();
									tableData = dataset;
									$scope.$inner.buildBody(tableData);
									$scope.$inner.buildFootPage(response.data.page);
									$scope.$outer.layout();
								} else {
									if(mj.isTrue($attrs.totalEnable)){
										$scope.$outer.clearData();
									}
									$scope.$inner.switchButton(true);
								}
							}
							$scope.$inner.hideLoading();
							if ($.isFunction(succFun)) {
								succFun(response.data);
							}
						}, function errorCallback(response) {
							$scope.$inner.hideLoading();
							if ($.isFunction(succFun)) {
								succFun(response);
							}
						});
					}

					/**
					 * 静态分页数据处理
					 */
					$scope.$inner.static_data = function() {
						$scope.$inner.showLoading();
						$scope.$inner.clear();
						var start = ($scope.$inner.page.pageStart - 1) * $scope.$inner.page.pageSize;
						var end = $scope.$inner.page.pageStart * $scope.$inner.page.pageSize;
						var m = 0;
						for (var i = start; i < end; i++) {
							if (i < $scope.$inner.staticData.length) {
								tableData[m] = $scope.$inner.staticData[i];
								m++;
							}
						}
						$scope.$inner.buildBody(tableData);
						$scope.$outer.layout();
						$scope.$inner.hideLoading();
					}

					/**
					 * 加载已经存在数据
					 */
					$scope.$outer.loadData = function(dataList, succFun) {
						$scope.$inner.showLoading();
						$scope.$inner.clear();
						$scope.$inner.init();
						$scope.$inner.staticData = dataList;
						$scope.$inner.staticPage = true;
						
						if ($attrs.page == 'true') {
							// $scope.$inner.setPage();
							$scope.$inner.page.total = dataList.length;
							for (var i = 0; i < $scope.$inner.page.pageSize; i++) {
								if (i < dataList.length) {
									tableData[i] = dataList[i];
								}
							}
							$scope.$inner.buildFootPage($scope.$inner.page);
						} else {
							tableData = dataList;
						}
						$scope.$inner.buildBody(tableData);
						$scope.$outer.layout();
						$scope.$inner.hideLoading();
						if ($.isFunction(succFun)) {
							succFun(dataList);
						}
					};

					$scope.$outer.loadPage = function(pageFun) {
						$scope.$inner.pageFun = pageFun;
					}

					/**
					 * 后台数据加载
					 */
					$scope.$outer.load = function(param, action, succFun) {
						$scope.$inner.showLoading();
						$scope.$inner.init();
						$scope.$inner.setPage();
						if (mj.isEmpty(action)) {
							action = mj.findAttr($attrs.action, $scope);
						}
						$scope.$inner.param = param;
						$scope.$inner.action = action;
						$scope.$inner.succFun = succFun;
						$scope.$inner.data(true);
					};

					/**
					 * 刷新
					 */
					$scope.$outer.reload = function() {
						$scope.$inner.data(true);
					}

					/**
					 * 获取选中行
					 */
					$scope.$outer.getSelected = $scope.$outer.select = function() {
						return selectData;
					}

					$scope.$outer.getRow = function(index) {
						return tableTr[index - 1];
					}

					$scope.$outer.getPage = function() {
						return $scope.$inner.page;
					}
					/**
					 * 获取返回数据
					 */
					$scope.$outer.getData = $scope.$outer.selectAll = function() {
						return tableData;
					}

					$scope.$outer.layout = function() {
						body_content.css({
							"display" : "none"
						});

						body_content.parent().css({
							"height" : "100%"
						});

						body_content.css({
							"height" : body_content.parent().height()
						});

						body_content.css({
							"display" : "block"
						});

						$scope.$inner.buildLayout();

					};

					$scope.$inner.buildLayout = function() {
						var head_table = head_tbody.parent();
						var body_table = body_tbody.parent();
						var body_tr = $(body_tbody.children()[0]);
						var width = [];
						$.each(body_tr.children(), function(index, item) {
							width[index] = $(item).width();
						});
						var head_tr = $(head_tbody.children()[0]);
						$.each(head_tr.children(), function(index, item) {
							$(item).width(width[index]);

						});

						if (body_table.width() == 0 || body_tbody.children().length < 2) {
							head_table.width("100%");
						} else {
							head_table.width(body_table.width());
						}

						if (body_content.height() != 0 && (body_content.height() < _height)) {
							var pp = body_content.parent();
							var _last = head_tr.find("td").last();
							var _w = _last.width();
							_last.width(_last.width() + 18);
							head_table.width(head_table.width() + 18);
						}
					}

					$scope.$inner.init();

					/**
					 * 动态添加列
					 */
					$scope.$outer.addColumns = function(columns) {
						$.each(columns, function(index, column) {
							$scope.$inner.columns.push(column);
						});
					};

					/**
					 * 外部方法：删除所有列
					 */
					$scope.$outer.removeColumns = function() {
						if ($scope.$inner.columns.length > 0) {
							$scope.$inner.columns.splice(0, $scope.$inner.columns.length);
						}
					};

					/**
					 * 外部方法：根据名字删除列
					 */
					$scope.$outer.removeColumnByName = function(name) {
						var _index = -1;
						var _column = null;
						$.each(columns, function(index, column) {
							if (column.name == name) {
								_index = index;
								_column = column;
								return false;
							}
						});
						if (_index > -1) {
							$scope.$inner.columns.splice(_index, 1);
						}
					};

					/**
					 * 外部方法：动态添加列
					 */
					$scope.$outer.addColumn = function(column) {
						$scope.$inner.columns.push(column);
					};

					/**
					 * 外部方法：获取列
					 */
					$scope.$outer.getColumns = function() {
						return $scope.$inner.columns;
					};
				}
			}
		}
	});
});

mj.module.directive('mjTableToolbar', function($compile) {
	return mj.buildDirective({
		name : "mjTableToolbar",
		require : [ '^mjTable' ],
		scope : {
			'title' : '@',
			'icon' : '@',
		},
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
				}
			}
		}
	});
});

mj.module.directive('mjTableColumns', function($compile) {
	return mj.buildDirective({
		name : "mjTableColumns",
		require : [ '^mjTable' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var tableScope = $scope.$inner.getParentScope();
					tableScope.$inner.columnAttrs = $attrs;
				}
			}
		}
	});
});

mj.module.directive('mjTableColumn', function($compile) {
	return mj.buildDirective({
		name : "mjTableColumn",
		require : [ '^mjTable', '^mjTableColumns' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var tableScope = $scope.$parent.$parent.$parent.$parent;
					tableScope.$inner.addColumn($attrs);
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildTable = function(opts) {
	var tag = $("<mj-table>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

/**
 * 动态构建控件
 */
mj.buildTableToolbar = function(opts) {
	var tag = $("<mj-table-toolbar>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildTableColumns = function(opts) {
	var tag = $("<mj-table-columns>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildTableColumn = function(opts) {
	var tag = $("<mj-table-column>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */

mj.module.directive('mjTelephone', function($compile) {
	return mj.buildFieldDirective({
		name : "mjTelephone",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);
					$scope.$inner.checkType = function() {
						var flag = true;
						var isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
						var isPhone = /^(?:(?:0\d{2,3})-)?(?:\d{7,8})(-(?:\d{3,}))?$/;
						if ((!$scope.$inner.field.val().match(isMobile)) && (!$scope.$inner.field.val().match(isPhone))) {
							$scope.$inner.field.addClass("mj-input-validity-error");
							$scope.$inner.tooltip.setTitle( $attrs.label + " 格式错误");
//							$scope.$inner.field.attr("title", $attrs.label + " telephone格式错误");
							flag = false;
						}
						return flag;
					};
					$scope.$inner.build();
				}
			}
		}
	});
});

/**
 * 动态添加控件
 */
mj.buildTelephone = function(opts) {
	var tag = $("<mj-telephone>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */

mj.module.directive('mjText', function($compile) {
	return mj.buildFieldDirective({
		name : "mjText",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);
					$scope.$inner.build();
				}
			}
		}
	});
});

/**
 * 动态添加控件
 */
mj.buildText = function(opts) {
	var tag = $("<mj-text>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */

mj.module.directive('mjTextarea', function($compile) {
	return mj.buildFieldDirective({
		name : "mjTextarea",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.init = function() {
//						$element.find("textarea").first().height(60);
						if(mj.isNumber($attrs.height)){
							$element.find("textarea").first().height($attrs.height);
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);
					$scope.$inner.buildOtherAttr = function() {
						if (!mj.isEmpty($attrs.rows)) {
							$scope.$inner.field.attr("rows", $attrs.rows);
						}
						if (!mj.isEmpty($attrs.cols)) {
							$scope.$inner.field.attr("cols", $attrs.cols);
						}
					};
					$scope.$inner.build();
				}
			}
		}
	});
});
/**
 * 动态添加控件
 */
mj.buildTextarea = function(opts) {
	var tag = $("<mj-textarea>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */
mj.module.directive('mjToolbar', function($compile) {
	return mj.buildDirective({
		name : "mjToolbar",
		template : function($element, $attrs) {
			return mj.templates.mjToolbar;
		},
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.row = $element.find(".mj-toolbar-row").first();
					$scope.$inner.children = [];
					$scope.$inner.addChild = function(sc, el, rs) {
						$scope.$inner.children.push({
							"sc" : sc,
							"el" : el,
							"rs" : rs
						});
					};
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNumber($attrs.height)) {
							$element.css({
								"height" : $attrs.height
							});
						}
						if (mj.isNumber($attrs.width)) {
							$element.css({
								"width" : $attrs.width
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$element.addClass(cls);
					};

					/**
					 * 删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$element.removeClass(cls);
					};

					/**
					 * 外部方法：添加子元素
					 */
					$scope.$outer.addChild = function(opt) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						var iview = $scope.$inner.buildToolbarItem(opt);
						var _dom = $compile(iview)($scope.$new());
						$scope.$inner.row.append(_dom);
						$scope.$outer.layout();
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 外部方法：批量添加子元素
					 */
					$scope.$outer.addChildren = function(opts) {
						if (!$.isArray(opts)) {
							throw "非Array对象，请检查...";
							return;
						}
						$.each(opts, function(index, opt) {
							$scope.$outer.addChild(opt);
						});
						$scope.$outer.layout();
					};

					/**
					 * 内部方法：动态构建控件
					 */
					$scope.$inner.buildToolbarItem = function(opts) {
						var tag = $("<mj-toolbar-item>");
						$.each(opts, function(key, value) {
							tag.attr("data-" + key, value);
						});
						return tag;
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
				}
			}
		}
	});
});

mj.module.directive('mjToolbarItem', function($compile) {
	return mj.buildDirective({
		name : "mjToolbarItem",
		require : [ '^?mjToolbar' ],
		template : function($element, $attrs) {
			return mj.templates.mjToolbarItem;
		},
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNumber($attrs.width)) {
							$element.css({
								"width" : $attrs.width
							});
						}
						if (!mj.isEmpty($attrs.horizontal)) {
							$element.css({
								"text-align" : $attrs.horizontal
							});
						}
						if (!mj.isEmpty($attrs.vertical)) {
							$element.css({
								"vertical-align" : $attrs.vertical
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var pScope = $scope.$inner.getParentScope();
					pScope.$inner.addChild($scope, $element, $attrs);
					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$element.addClass(cls);
					};

					/**
					 * 删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$element.removeClass(cls);
					};
					
					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildToolbar = function(opts) {
	var tag = $("<mj-toolbar>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildToolbarItem = function(opts) {
	var tag = $("<mj-toolbar-item>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */
mj.view.tooltip = function(target, options) {
	mj.addView("mj-tooltip", this);
	var _this = this;
	this.options = {
		"top" : "0",// 提示框偏移上下水平像素
		"left" : "0",// 提示框偏移左右水平像素
		"position" : "bottom",// 默认提示框出现位置为底部
		"title" : ""// 提示框显示文字
	};
	this.target = target;
	$.extend(true, this.options, options);
	this.destroy = function() {
		_this.destroy();
	};
	this.setTitle = function(title) {
		_this.options.title = title;
		_this.$inner.buildBody();
	};
	
	_this.$inner = {
		
	};
	
	_this.$inner.build = function() {
		_this.$inner.tooltip = $(mj.templates.mjTooltip);
		_this.$inner.arrow = this.tooltip.find(".mj-tooltip-arrow").first();
		_this.$inner.inner = this.tooltip.find(".mj-tooltip-inner").first();		
		_this.$inner.buildTarget();
	},
	_this.$inner.buildTarget = function() {
		_this.target.on("mouseover", function(event) {
			if (!mj.isEmpty(_this.options.title)) {
//				_this.target = $(event.target);
				_this.$inner.buildView();
				_this.$inner.open();
			}else{
				_this.$inner.close();
			}
		});
		_this.target.on("mouseout", function(event) {
			_this.$inner.close();
		});
	},
	_this.$inner.buildBody = function() {
		if (!mj.isEmpty(_this.options.title)) {
			_this.$inner.inner.text(_this.options.title);			
		}
		
	},
	_this.$inner.buildView = function() {
		var targetTop = _this.options.top;
		var targetLeft = _this.options.left;
		_this.$inner.buildBody();
		var dom = mj.getBody();
		dom.append(_this.$inner.tooltip);

		var h;
		var w;
		var _o=_this.target.offset();
		if (_this.options.position == "bottom") {
			h = _o.top + _this.target.outerHeight(true) + targetTop * 1;
			w = _o.left + targetLeft * 1;
			_this.$inner.tooltip.addClass("mj-tooltip-bottom");
			_this.$inner.arrow.addClass("mj-tooltip-bottom-arrow");
		} else if (_this.options.position == "top") {
			h = _o.top - _this.$inner.tooltip.height()  + targetTop * 1;
			w = _o.left + targetLeft * 1;
			_this.$inner.tooltip.addClass("mj-tooltip-top");
			_this.$inner.arrow.addClass("mj-tooltip-top-arrow");
		} else if (_this.options.position == "left") {
			h = _o.top + targetTop * 1;
			w = _o.left - _this.$inner.tooltip.width() + targetLeft * 1;
			_this.$inner.tooltip.addClass("mj-tooltip-left");
			_this.$inner.arrow.addClass("mj-tooltip-left-arrow");
		} else if (_this.options.position == "right") {
			h = _o.top + targetTop * 1;
			w = _o.left + _this.target.outerWidth(true) + targetLeft * 1;
			_this.$inner.tooltip.addClass("mj-tooltip-right");
			_this.$inner.arrow.addClass("mj-tooltip-right-arrow");
		}
		_this.$inner.tooltip.css({
			"top" : h,
			"left" : w,
			"z-index" : mj.getIndex(),
			"display" : "block"
		});
	},
	/**
	 * 显示方法
	 */
	_this.$inner.open = function() {
		if (!$.isEmptyObject(_this.options.title)) {
			var index = _this.$inner.tooltip.css("z-index");
			if (index != "-100" && index != -100) {
				return;
			}
			this.tooltip.css({
				"z-index" : mj.getIndex()
			});
		}
	},

	/**
	 * 关闭方法
	 */
	_this.$inner.close = function() {
		_this.$inner.hide();
	},

	_this.$inner.hide = function() {
		_this.$inner.tooltip.css({
			"z-index" : "-100"
		});
	},
	_this.$inner.destroy = function() {
		_this.$inner.arrow.remove();
		_this.$inner.inner.remove();
		_this.$inner.tooltip.remove();
		delete _this;
	}
};


mj.buildTooltip = function(target, opts) {
	var tooltip = new mj.view.tooltip(target, opts);
	tooltip.$inner.build();
	return tooltip;
}
/**
 * 
 */

mj.module.directive('mjTree', function($compile, $http) {
	return mj.buildDirective({
		name : "mjTree",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.root = {
						"id" : "-1",
						"text" : "根节点",
						"checked" : "-1",
						"expanded" : "true",
						"isExpand" : "true",
						"isLeaf" : "false",
						"parent" : null,
						"showed" : "true"
					};

					$scope.$inner.defaultRoot = {
						"id" : "-1",
						"text" : "根节点",
						"checked" : "-1",
						"expanded" : "true",
						"isExpand" : "true",
						"isLeaf" : "false",
						"parent" : null,
						"showed" : "true"
					};
					$scope.$inner.action = "";
					$scope.$inner.param = {};
					$scope.$inner.selectNode = null;
					$scope.$inner.rootNode = null;
					$scope.$inner.cls = {
						"onAll" : "fa-check-square",
						"onPart" : "fa-check-square-o",
						"off" : "fa-square-o",
						"checked" : "mj-tree-box-checked",
						"eblowClose" : "fa-plus-square-o",
						"eblowOpen" : "fa-minus-square-o",
						"eblowLoad" : "fa-spinner",
						"iconClose" : "fa-folder",
						"iconOpen" : "fa-folder-open",
						"iconLeaf" : "fa-file-text",
						"rowSelect" : "mj-tree-row-select",
						"textSelect" : "mj-tree-text-select",
						"iconSelect" : "mj-tree-icon-select",
						"treeBox" : "mj-tree-box",
						"treeRow" : "mj-tree-row",
						"treeText" : "mj-tree-text",
						"treeCell" : "mj-tree-cell",
						"treeIcon" : "mj-tree-icon",
						"treeElbow" : "mj-tree-elbow",
						"treeIconLeaf" : "mj-tree-icon-leaf"
					};
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isEmpty($attrs.loadChanged)) {
							$attrs.loadChanged = false;
						}
						if (mj.isNotEmpty($attrs.iconOpen)) {
							$scope.$inner.cls.iconOpen = $attrs.iconOpen;
						}
						if (mj.isNotEmpty($attrs.iconClose)) {
							$scope.$inner.cls.iconClose = $attrs.iconClose;
						}
						if (mj.isNotEmpty($attrs.iconLeaf)) {
							$scope.$inner.cls.iconLeaf = $attrs.iconLeaf;
						}
						if (mj.isFalse($attrs.rootShowed) || mj.isFalse($attrs.rootShowable)) {
							$scope.$inner.root.showed = false;
						}
						if (mj.isNotEmpty($attrs.rootText)) {
							$scope.$inner.root.text = $attrs.rootText;
						}
						if (mj.isNotEmpty($attrs.rootId)) {
							$scope.$inner.root.id = $attrs.rootId;
						}
					};

					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var timer = null;

					$scope.$inner.build = function() {
					}

					/**
					 * 内部方法：清除节点
					 */
					$scope.$inner.clearChild = function(id) {
						var children = $element.find("[data-pid='" + id + "']");
						$.each(children, function(index, sub) {
							$scope.$inner.clearChild($(sub).attr("data-id"));
							$(sub).remove();
						});
					};

					/**
					 * 外部方法：构建根节点
					 */
					$scope.$outer.buildRootNode = function(opt) {
						$.extend(true, $scope.$inner.root, opt);
					};

					/**
					 * 内部方法：构建根节点
					 */
					$scope.$inner.buildRoot = function() {
						var array = [];
						array.push($scope.$inner.root);
						$scope.$inner.buildNode(null, array, $scope.$inner.root.parentId);
						$scope.$inner.rootNode = $element.find("div[data-id='" + $scope.$inner.root.id + "']");
						if (mj.isFalse($scope.$inner.root.showed)) {
							$scope.$inner.rootNode.hide();
						}
					}

					/**
					 * 外部方法：加载
					 */
					$scope.$outer.load = function(param, action, succFun) {
						$scope.$inner.param = param;
						$scope.$inner.action = action;
						$scope.$outer.loadAfter = succFun;
						$scope.$inner.buildRoot();
						$scope.$inner.buildLoadAfter();
					}

					/**
					 * 外部方法：重新加载
					 */
					$scope.$outer.reload = function() {
						if ($scope.$inner.rootNode == null) {
							return;
						} else {
							$scope.$outer.getRootNode().refresh(null,true);
						}
					}

					/**
					 * 外部方法：清空树
					 */
					$scope.$outer.clear = function() {
						$element.empty();
						$scope.$inner.rootNode = null;
						$.extend(true, $scope.$inner.root, $scope.$inner.defaultRoot);
						$scope.$inner.init();
					}

					/**
					 * 内部方法：加载方法
					 */
					$scope.$inner.load = function(parent, parentId, succFun) {
						var method = "GET";
						if (!mj.isEmpty($attrs.method)) {
							method = $attrs.method
						}
						if (mj.isEmpty($scope.$inner.action)) {
							var _action = mj.findAttr($attrs.action, $scope);
							$scope.$inner.action = _action;
						}
						var _param = {};
						var condName = "condition";
						if (mj.isNotEmpty($scope.$inner.param)) {
							for ( var cond in $scope.$inner.param) {
								condName = cond;
							}
						} else {
							$scope.$inner.param = {};
						}
						if (parent == null) {
							_param[condName] = {
								"parentId" : parentId,
								"id" : parentId
							};
						} else {
							_param[condName] = parent.data("data-data");
						}
						$.extend(true, $scope.$inner.param, _param);
						$scope.$inner.http(parent, parentId, succFun, method, $scope.$inner.param, condName);
					};

					/**
					 * 内部方法：http请求
					 */
					$scope.$inner.http = function(parent, parentId, succFun, method, param, condName) {
						var _param = {};
						_param[condName] = JSON.stringify(param[condName]);
						$.ajax({
							url : $scope.$inner.action,
							type : method,
							async : true,
							data : _param,
							contentType : "application/json",
							dataType : 'json',
							success : function(data, textStatus, jqXHR) {
								if (data.code == 0) {
									$scope.$inner.buildNode(parent, data.data, parentId);
									if ($.isFunction(succFun)) {
										succFun();
									}
								}
							},
							error : function(xhr, textStatus) {
								throw textStatus;
							}
						})
					};

					/**
					 * 外部方法：设置是否完全展开
					 */
					$scope.$outer.setExpanded = function(flag) {
						$attrs.expanded = flag;
					}

					/**
					 * 加载后执行
					 */
					$scope.$outer.loadAfter = $attrs.loadAfter;

					/**
					 * 内部方法：构建加载后事件
					 */
					$scope.$inner.buildLoadAfter = function() {
						if (mj.isNotEmpty($scope.$outer.loadAfter)) {
							if ($.isFunction($scope.$outer.loadAfter)) {
								$scope.$outer.loadAfter($scope.$outer);
							} else {
								if ($.isFunction(mj.findCtrlScope($scope)[$scope.$outer.loadAfter])) {
									mj.findCtrlScope($scope)[$scope.$outer.loadAfter]($scope.$outer);
								}
							}
						}
					};

					/**
					 * 内部方法：初始化方法
					 */
					$scope.$inner.initTree = function() {
						$scope.$inner.load($scope.$inner.rootNode, $scope.$inner.root.id);
					};

					/**
					 * 内部方法：构建节点方法
					 */
					$scope.$inner.buildNode = function(parent, nodes, parentId) {
						if (parent == null) {
							parent = $element;
						}
						$.each(nodes, function(index, node) {
							if (node.parentId == parentId) {
								if (mj.isTrue($attrs.expanded)) {
									node.isExpand = true;
								}
								$scope.$inner.addChild(parent, parentId, node);
							}
						});
					};

					/**
					 * 内部方法：内部判断是否是叶子节点
					 */
					$scope.$inner.isLeaf = function(isLeaf) {
						if (isLeaf == "1" || isLeaf == 1 || isLeaf == "true" || isLeaf == true) {
							return true;
						} else {
							return false;
						}
					};

					/**
					 * 内部方法：内部构建标题方法
					 */
					$scope.$inner.buildText = function(item, elbow, icon, text, data) {
						item.on("click", function(event) {
							clearTimeout(timer);
							timer = setTimeout(function() {
								if ($scope.$inner.selectNode != null) {
									$scope.$inner.getText($scope.$inner.selectNode).removeClass($scope.$inner.cls.textSelect);
									$scope.$inner.getIcon($scope.$inner.selectNode).removeClass($scope.$inner.cls.iconSelect);
									$scope.$inner.selectNode.removeClass($scope.$inner.cls.rowSelect);
								}
								$scope.$inner.selectNode = item;
								$scope.$inner.getText(item).addClass($scope.$inner.cls.textSelect);
								$scope.$inner.getIcon(item).addClass($scope.$inner.cls.iconSelect);
								item.addClass($scope.$inner.cls.rowSelect);
								if (mj.isNotEmpty($attrs.click)) {
									if ($.isFunction(mj.findCtrlScope($scope)[$attrs.click])) {
										mj.findCtrlScope($scope)[$attrs.click]($scope.$inner.buildParam(item));
									}
								}
								if($.isFunction($scope.$inner.clickFunc)){
									$scope.$inner.clickFunc($scope.$inner.buildParam(item));
								}
							}, mj.delayedTime);
							event.stopPropagation();
						});

						item.on("dblclick", function(event) {
							clearTimeout(timer);
							elbow.click();
							event.stopPropagation();
						});
					};
					
					$scope.$outer.setClick = function(func) {
						$scope.$inner.clickFunc=func;
					};
					
					$scope.$outer.setCheck = function(func) {
						$scope.$inner.checkFunc=func;
					};

					/**
					 * 内部方法：构建节点对象
					 */
					$scope.$inner.buildParam = function(item) {
						var data = item.data("data-data");
						return {
							getId : function() {
								return data.id;
							},
							getText : function() {
								return data.text;
							},
							isLeaf : function() {
								return $scope.$inner.isLeaf(data.isLeaf);
							},
							getData : function() {
								return data;
							},
							getNode : function() {
								return item;
							},
							getTree : function() {
								return $scope.$outer;
							},
							expand : function() {
								$scope.$outer.expand(item);
							},
							collapse : function() {
								$scope.$inner.collapse(item);
							},
							isChecked : function() {
								var box = item.find("." + $scope.$inner.cls.treeBox).first();
								if (box.hasClass($scope.$inner.cls.checked)) {
									return true;
								} else {
									return false;
								}
							},
							checkChildren : function() {
								$scope.$inner.checkChildren(item);
							},
							uncheckChildren : function() {
								$scope.$inner.uncheckChildren(item);
							},
							getChildren : function() {
								var children = [];
								$.each($scope.$inner.getChildren(item), function(index, child) {
									children.push($scope.$inner.buildParam($(child)));
								});
								return children;
							},
							getParent : function() {
								var parent = $scope.$inner.getParent(item);
								if (parent.length > 0) {
									return $scope.$inner.buildParam($(parent.first()));
								} else {
									return null;
								}
							},
							addChild : function(option) {
								if ($scope.$inner.isLeaf(data.isLeaf)) {
									data.isLeaf = false;
									$scope.$inner.switchStatus(item, "1");
								} else {
									$scope.$outer.expand(item);
								}
								$scope.$inner.addChild(item, item.attr("data-id"), option);
								var self = $element.find("div[data-id='" + option.id + "']");
								return $scope.$inner.buildParam(self.first());
							},
							addChildren : function(options) {
								if ($scope.$inner.isLeaf(data.isLeaf)) {
									data.isLeaf = false;
									$scope.$inner.switchStatus(item, "1");
								} else {
									$scope.$outer.expand(item);
								}
								var children = [];
								$.each(options, function(index, option) {
									$scope.$inner.addChild(item, item.attr("data-id"), option);
									var self = $element.find("div[data-id='" + option.id + "']");
									children.push($scope.$inner.buildParam(self.first()));
								});
								return children;
							},
							refresh : function(opt, refreshChildren) {
								if (mj.isNotEmpty(opt)) {
									if (mj.isNotEmpty(opt.text)) {
										data.text = opt.text;
										var text = item.find("." + $scope.$inner.cls.treeText).first();
										text.text(opt.text);
									}
								}
								if (mj.isTrue(refreshChildren)) {
									$scope.$inner.clearChild(item.attr("data-id"));
									$scope.$inner.switchStatus(item, "1");
									$scope.$outer.expand(item);
								}
							},
							remove : function() {
								var parent = $scope.$inner.getParent(item);
								$scope.$inner.clearChild(item.attr("data-id"));
								item.remove();
								var children = $scope.$inner.getChildren(parent);
								if (children.length == 0) {
									if (parent.length > 0) {
										parent.data("data-data").isLeaf = true;
										$scope.$inner.switchStatus(parent, "2");
									}
								}
							},
							removeChildren : function() {
								if (!$scope.$inner.isLeaf(data.isLeaf)) {
									$scope.$inner.collapse(item);
									$scope.$inner.clearChild(item.attr("data-id"));
									data.isLeaf = true;
									$scope.$inner.switchStatus(item, "2");
								}
							},
							removeChild : function(id) {
								var self = $element.find("div[data-id='" + id + "']");
								if (self.length > 0) {
									self.first().remove();
								}
								var children = $scope.$inner.getChildren(item);
								if (children.length == 0) {
									data.isLeaf = true;
									$scope.$inner.switchStatus(item, "2");
								}
							}
						};
					};

					/**
					 * 内部方法：构建icon
					 */
					$scope.$inner.buildIcon = function(item, elbow, icon, text, id) {
						elbow.on("click", function(event) {
							if (elbow.hasClass($scope.$inner.cls.eblowClose)) {
								$scope.$inner.expandChildren(item, false);
							} else if (elbow.hasClass($scope.$inner.cls.eblowOpen)) {
								$scope.$inner.collapse(item);
							}
							event.stopPropagation();
						});
					};

					/**
					 * 内部方法：构建box
					 */
					$scope.$inner.buildCheckbox = function(item, elbow, icon, text, data) {
						var box = $('<a>');
						box.addClass($scope.$inner.cls.treeBox);
						box.addClass("fa");
						box.addClass($scope.$inner.cls.off);
						box.insertBefore(text);
						box.on("click", function(event) {
							$scope.$inner.boxClickFunc(item, box, event, true);
						});
						if (mj.isTrue(data.checked)) {
							$scope.$inner.boxClickFunc(item, box, window.event, $attrs.loadChanged);
						}
					};

					/**
					 * 内部方法：box点击事件
					 */
					$scope.$inner.boxClickFunc = function(item, box, event, changeFlag) {
						if (box.hasClass($scope.$inner.cls.off)) {
							$scope.$inner.checkChildren(item);
							$scope.$inner.checkParent(item);
						} else {
							$scope.$inner.uncheckChildren(item);
							$scope.$inner.uncheckParent(item);
						}
						if (mj.isTrue(changeFlag)) {
							if (mj.isNotEmpty($attrs.check)) {
								if ($.isFunction(mj.findCtrlScope($scope)[$attrs.check])) {
									mj.findCtrlScope($scope)[$attrs.check]($scope.$inner.buildParam(item));
								}
							}
							if($.isFunction($scope.$inner.checkFunc)){
								$scope.$inner.checkFunc($scope.$inner.buildParam(item));
							}
						}
						if (mj.isNotEmpty(event)) {
//							alert(event.stopPropagation);
//							event.stopPropagation();
						}
					};

					/**
					 * 内部方法：取消选择子节点
					 */
					$scope.$inner.uncheckParent = function(item) {
						var parent = $scope.$inner.getParent(item);
						while (parent.length > 0) {
							var pbox = parent.first().find("." + $scope.$inner.cls.treeBox).first();
							var allFlag = true;
							var nodes = $scope.$inner.getChildren(parent);
							if (nodes.length > 0) {
								$.each(nodes, function(index, node) {
									var sbox = $(node).find("." + $scope.$inner.cls.treeBox).first();
									if (!sbox.hasClass($scope.$inner.cls.off)) {
										allFlag = false;
									}
								});
							}
							pbox.removeClass($scope.$inner.cls.onAll);
							pbox.removeClass($scope.$inner.cls.onPart);
							pbox.removeClass($scope.$inner.cls.off);
							if (allFlag) {
								pbox.removeClass($scope.$inner.cls.checked);
								pbox.addClass($scope.$inner.cls.off);
							} else {
								pbox.addClass($scope.$inner.cls.checked);
								pbox.addClass($scope.$inner.cls.onPart);
							}
							parent = $scope.$inner.getParent(parent.first());
						}
					};

					/**
					 * 内部方法：选择父节点
					 */
					$scope.$inner.checkParent = function(item) {
						var parent = $scope.$inner.getParent(item);
						while (parent.length > 0) {
							var pbox = parent.first().find("." + $scope.$inner.cls.treeBox).first();
							var allFlag = true;
							var nodes = $scope.$inner.getChildren(parent);
							if (nodes.length > 0) {
								$.each(nodes, function(index, node) {
									var sbox = $(node).find("." + $scope.$inner.cls.treeBox).first();
									if (!sbox.hasClass($scope.$inner.cls.onAll)) {
										allFlag = false;
									}
								});
							}
							pbox.removeClass($scope.$inner.cls.onAll);
							pbox.removeClass($scope.$inner.cls.onPart);
							pbox.removeClass($scope.$inner.cls.off);
							pbox.addClass($scope.$inner.cls.checked);
							if (allFlag) {
								pbox.addClass($scope.$inner.cls.onAll);
							} else {
								pbox.addClass($scope.$inner.cls.onPart);
							}
							parent = $scope.$inner.getParent(parent.first());
						}
					};

					/**
					 * 内部方法：选择子节点
					 */
					$scope.$inner.checkChildren = function(item) {
						var box = item.find("." + $scope.$inner.cls.treeBox).first();
						box.removeClass($scope.$inner.cls.off);
						box.addClass($scope.$inner.cls.checked);
						box.addClass($scope.$inner.cls.onAll);
						var nodes = $scope.$inner.getChildren(item);
						if (nodes.length > 0) {
							$.each(nodes, function(index, node) {
								$scope.$inner.checkChildren($(node));
							});
						}
					};

					/**
					 * 内部方法：取消选择子节点
					 */
					$scope.$inner.uncheckChildren = function(item) {
						var box = item.find("." + $scope.$inner.cls.treeBox).first();
						box.removeClass($scope.$inner.cls.onAll);
						box.addClass($scope.$inner.cls.off);
						box.removeClass($scope.$inner.cls.checked);
						var nodes = $scope.$inner.getChildren(item);
						if (nodes.length > 0) {
							$.each(nodes, function(index, node) {
								$scope.$inner.uncheckChildren($(node));
							});
						}
					};

					/**
					 * 外部方法：获取所有选择节点
					 */
					$scope.$outer.getChildren = function() {
						var children = $element.find("." + $scope.$inner.cls.treeRow);
						var list = new Array();
						$.each(children, function(index, child) {
							list.push($scope.$inner.buildParam($(child)));
						});
						return list;
					},

					/**
					 * 外部方法：获取所有选择节点
					 */
					$scope.$outer.getChildById = function(id) {
						var child = $element.find("[data-id='" + id + "']");
						if (child.length > 0) {
							return $scope.$inner.buildParam(child.first());
						} else {
							return null;
						}
					},

					/**
					 * 外部方法：获取所有选择节点
					 */
					$scope.$outer.getCheckedChildren = function() {
						var children = $element.find("." + $scope.$inner.cls.treeRow);
						var list = new Array();
						$.each(children, function(index, child) {
							var box = $(child).find("." + $scope.$inner.cls.treeBox).first();
							if (!box.hasClass($scope.$inner.cls.off)) {
								list.push($scope.$inner.buildParam($(child)));
							}
						});
						return list;
					},

					/**
					 * 外部方法：获取所有未选择节点
					 */
					$scope.$outer.getUncheckedChildren = function() {
						var children = $element.find("." + $scope.$inner.cls.treeRow);
						var list = new Array();
						$.each(children, function(index, child) {
							var box = $(child).find("." + $scope.$inner.cls.treeBox).first();
							if (box.hasClass($scope.$inner.cls.off)) {
								list.push($scope.$inner.buildParam($(child)));
							}
						});
						return list;
					},

					/**
					 * 内部方法：增加节点
					 */
					$scope.$inner.addChild = function(parent, parentId, data) {
						var item = $(mj.templates.mjTreeItem);
						var elbow = $scope.$inner.getSwitch(item);
						var icon = $scope.$inner.getIcon(item);
						var text = item.find("." + $scope.$inner.cls.treeText).first();
						var cell = item.find("." + $scope.$inner.cls.treeCell).first();
						if(mj.isNotEmpty(data.iconLeaf)){
							$scope.$inner.cls.iconLeaf=data.iconLeaf;
						}
						if(mj.isNotEmpty(data.iconOpen)){
							$scope.$inner.cls.iconOpen=data.iconOpen;
						}
						if(mj.isNotEmpty(data.iconClose)){
							$scope.$inner.cls.iconClose=data.iconClose;
						}
						text.text(data.text);
						item.attr({
							"data-id" : data.id,
							"data-pid" : parentId
						});

						item.data("data-data", data);

						$scope.$inner.buildText(item, elbow, icon, text, data);
						$scope.$inner.buildIcon(item, elbow, icon, text, data.id);
						if (mj.isTrue($attrs.checkable)) {
							$scope.$inner.buildCheckbox(item, elbow, icon, text, data);
						}

						if (parent == $element) {
							if (mj.isTrue($scope.$inner.root.showed)) {
								cell.css({
									"padding-left" : "15px"
								});
							}
							$element.append(item);
						} else {
							var pleft = parent.find("." + $scope.$inner.cls.treeCell).first().css("paddingLeft");
							cell.css({
								"padding-left" : mj.number(pleft) + 18
							});
							var children = $scope.$inner.getChildren(parent);
							if (children.length > 0) {
								item.insertAfter($(children[children.length - 1]));
							} else {
								item.insertAfter(parent);
							}
						}

						if ($scope.$inner.isLeaf(data.isLeaf)) {
							icon.addClass($scope.$inner.cls.iconLeaf);
							elbow.css({
								"display" : 'none'
							});
						} else {
							icon.addClass($scope.$inner.cls.iconClose);
							elbow.addClass($scope.$inner.cls.eblowClose);
							if (mj.isTrue($attrs.expanded)) {
								elbow.click();
							} else if (mj.isTrue(data.isExpand)) {
								elbow.click();
							}
						}
					};

					/**
					 * 外部方法：收起某个节点
					 */
					$scope.$outer.collapse = function(node) {
						if (mj.isEmpty(node)) {
							return;
						} else {
							$scope.$inner.collapse(node);
						}
					};

					/**
					 * 外部方法：收起所有节点
					 */
					$scope.$outer.collapseAll = function() {
						if (mj.isTrue($scope.$inner.root.showed)) {
							$scope.$inner.collapse($scope.$inner.rootNode);
						} else {
							var nodes = $scope.$inner.getChildren($scope.$inner.rootNode);
							$.each(nodes, function(index, node) {
								$scope.$inner.collapse($(node));
							});
						}
					};

					/**
					 * 内部方法：内部收起方法
					 */
					$scope.$inner.collapse = function(item) {
						var elbow = $scope.$inner.getSwitch(item);
						var icon = $scope.$inner.getIcon(item);
						if (icon.hasClass($scope.$inner.cls.iconLeaf)) {
							return;
						}
						if (icon.hasClass($scope.$inner.cls.iconClose)) {
							return;
						} else if (icon.hasClass($scope.$inner.cls.iconOpen)) {
							elbow.removeClass($scope.$inner.cls.eblowOpen);
							elbow.addClass($scope.$inner.cls.eblowClose);
							icon.removeClass($scope.$inner.cls.iconOpen);
							icon.addClass($scope.$inner.cls.iconClose);
						}
						var children = $scope.$inner.getChildren(item);
						if (children.length > 0) {
							$.each(children, function(index, subItem) {
								$(subItem).css({
									"display" : "none"
								});
								$scope.$inner.collapse($(subItem));
							});
						}
					};

					/**
					 * 内部方法：获取开关
					 */
					$scope.$inner.getSwitch = function(item) {
						return item.find("." + $scope.$inner.cls.treeElbow).first();
					}

					/**
					 * 内部方法：获取图标
					 */
					$scope.$inner.getIcon = function(item) {
						return item.find("." + $scope.$inner.cls.treeIcon).first();
					}

					/**
					 * 内部方法：获取图标
					 */
					$scope.$inner.getText = function(item) {
						return item.find("." + $scope.$inner.cls.treeText).first();
					}

					/**
					 * 内部方法：切换节点状态：是否叶子节点
					 */
					$scope.$inner.switchStatus = function(item, switchType) {
						var switcher = $scope.$inner.getSwitch(item);
						var icon = $scope.$inner.getIcon(item);
						switch (switchType) {
						case "1":// 由叶子节点变为非叶子结点
							icon.removeClass($scope.$inner.cls.iconLeaf);
							icon.addClass($scope.$inner.cls.iconClose);
							switcher.show();
							break;
						case "2":// 由非叶子结点转为叶子节点
							icon.removeClass($scope.$inner.cls.iconClose);
							icon.removeClass($scope.$inner.cls.iconOpen);
							icon.addClass($scope.$inner.cls.iconLeaf);
							switcher.hide();
						case "3":// 由关闭状态转为加载状态
							switcher.removeClass($scope.$inner.cls.eblowClose);
							switcher.addClass($scope.$inner.cls.eblowLoad);
							break;
						case "4":// 由加载或关闭状态转为打开状态
							if (!icon.hasClass($scope.$inner.cls.iconLeaf)) {
								if (icon.hasClass($scope.$inner.cls.iconClose)) {
									switcher.removeClass($scope.$inner.cls.eblowLoad);
									switcher.addClass($scope.$inner.cls.eblowOpen);
									icon.removeClass($scope.$inner.cls.iconClose);
									icon.addClass($scope.$inner.cls.iconOpen);
								}
							}
							break;
						}
					};

					/**
					 * 内部方法：展开子节点
					 */
					$scope.$inner.expandChildren = function(item, allFlag) {
						$scope.$inner.switchStatus(item, "3");
						var children = $scope.$inner.getChildren(item);
						if (children.length == 0) {
							$scope.$inner.load(item, item.attr("data-id"), function() {
								var children = $scope.$inner.getChildren(item);
								var data = item.data("data-data");
								if (children.length == 0) {
									data.isLeaf = true;
									$scope.$inner.switchStatus(item, "2");
								} else {
									data.isLeaf = false;
									$scope.$inner.switchStatus(item, "4");
									$scope.$inner.expandFor(item, allFlag);
								}
							});
						} else {
							$scope.$inner.switchStatus(item, "4");
							$scope.$inner.expandFor(item, allFlag);
						}
					};

					/**
					 * 内部方法：内部递归展开函数
					 */
					$scope.$inner.expandFor = function(item, allFlag) {
						var nodes = $scope.$inner.getChildren(item);
						$.each(nodes, function(index, node) {
							$(node).css({
								"display" : "table-row"
							});
							if (allFlag == true) {
								$scope.$inner.expandChildren($(node), allFlag);
							}
						});
					}

					/**
					 * 内部方法：获取子节点
					 */
					$scope.$inner.getChildren = function(node) {
						return $element.find("[data-pid='" + node.attr("data-id") + "']");
					};

					/**
					 * 内部方法：获取所有父节点
					 */
					$scope.$inner.getAllParent = function(node, plist) {
						var parent = $scope.$inner.getParent(node);
						while (parent.length > 0) {
							plist.push(parent);
							parent = $scope.$inner.getParent(parent);
						}
					};

					/**
					 * 内部方法：获取父节点
					 */
					$scope.$inner.getParent = function(node) {
						return $element.find("[data-id='" + node.attr("data-pid") + "']");
					};

					/**
					 * 外部方法：展开节点
					 */
					$scope.$outer.expand = function(node) {
						var id = "";
						if (mj.isEmpty(node)) {
							return;
						} else {
							$scope.$inner.expandChildren(node, false);
						}
					};

					/**
					 * 外部方法：展开所有节点
					 */
					$scope.$outer.expandAll = function() {
						$attrs.expanded = true;
						if (mj.isTrue($scope.$inner.root.showed)) {
							$scope.$inner.expandChildren($scope.$inner.rootNode, true);
						} else {
							var nodes = $scope.$inner.getChildren($scope.$inner.rootNode);
							$.each(nodes, function(index, node) {
								$scope.$inner.expandChildren($(node), true);
							});
						}
						$attrs.expanded = false;
					};

					/**
					 * 外部方法：获取根节点
					 */
					$scope.$outer.getRootNode = function() {
						if (mj.isEmpty($scope.$inner.rootNode)) {
							return null;
						}
						return $scope.$inner.buildParam($scope.$inner.rootNode);
					};

					/**
					 * 外部方法：获取当前选中的节点
					 */
					$scope.$outer.getSelectNode = function() {
						if (mj.isEmpty($scope.$inner.selectNode)) {
							return null;
						}
						return $scope.$inner.buildParam($scope.$inner.selectNode);
					}

					/**
					 * 是否自动加载
					 */
					if (mj.isTrue($attrs.autoload)) {
						$scope.$inner.buildRoot();
					}
					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
					$scope.$inner.build();
				}
			}

		}
	});
});

/**
 * 动态构建控件
 */
mj.buildTree = function(opts) {
	var tag = $("<mj-tree>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */

mj.module.directive('mjUrl', function($compile) {
	return mj.buildFieldDirective({
		name : "mjUrl",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.buildField($scope, $element, $attrs, $compile);
					$scope.$inner.checkType = function() {
						var flag = true;
						var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
						var objExp = new RegExp(Expression);
						if (!objExp.test($scope.$inner.field.val())) {
							$scope.$inner.field.addClass("mj-input-validity-error");
							$scope.$inner.tooltip.setTitle($attrs.label + "  格式错误");
							// $scope.$inner.field.attr("title", $attrs.label +
							// " URL格式错误");
							flag = false;
						}
						return flag;
					};
					$scope.$inner.build();
				}
			}
		}
	});
});
/**
 * 动态添加控件
 */
mj.buildUrl = function(opts) {
	var tag = $("<mj-url>");
	if (mj.isEmpty(opts.name)) {
		throw "name不能为空";
	}
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */

mj.module.directive('mjVbox', function($compile) {
	return mj.buildDirective({
		name : "mjVbox",
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.children = [];
					$scope.$inner.addChild = function(sc, el, rs) {
						$scope.$inner.children.push({
							"sc" : sc,
							"el" : el,
							"rs" : rs
						});
					};
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.height)) {
							$element.css({
								"height" : $attrs.height
							});
						}
						if (mj.isNotEmpty($attrs.width)) {
							$element.css({
								"width" : $attrs.width
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					/**
					 * 内部方法：构建函数
					 */
					$scope.$inner.build = function() {
						if ($.isNumeric($attrs.split)) {
							$.each($scope.$inner.children, function(index, item) {
								var split = $(mj.templates.mjVboxSplit);
								var cell = split.find(".mj-vbox-split").first();
								cell.css({
									"height" : $attrs.split
								});
								if (index != $scope.$inner.children.length - 1) {
									split.insertAfter(item.el);
								}
								if (mj.isTrue(item.rs.hidden)) {
									split.css({
										"display" : "none"
									});
								}
							});
						}
					};

					/**
					 * 内部方法：获取滚动内容
					 */
					$scope.$inner.getScroll = function(item) {
						return item.el.find(".mj-vbox-scroll").first();
					};

					/**
					 * 内部方法：获取内容
					 */
					$scope.$inner.getCell = function(item) {
						return item.el.find(".mj-vbox-cell").first();
					};

					/**
					 * 内部方法：获取高度
					 */
					$scope.$inner.getHeight = function(showChildren) {
						var height = 0;
						if (showChildren.length > 0) {
							var splitHeight = 0;
							if (mj.isNumber($attrs.split)) {
								var splitHeight = (showChildren.length - 1) * $attrs.split;
							}
							height = ($element.innerHeight() - splitHeight);
						}
						return height;
					};

					/**
					 * 外部布局：布局方法
					 */
					$scope.$outer.layout = function() {
						$.each($scope.$inner.children, function(index, item) {
							var col = $scope.$inner.getCell(item);
							var scroll = $scope.$inner.getScroll(item);
							scroll.css({
								"display" : "none"
							});
							col.height("auto");
						});
						var showChildren = [];
						$.each($scope.$inner.children, function(index, item) {
							if (mj.isFalse(item.rs.hiddenFlag)) {
								showChildren.push(item);
							}
						});

						if ($attrs.model == "average") {
							$scope.$inner.buildAverage(showChildren);
						} else if ($attrs.model == "auto") {
							$scope.$inner.buildAuto(showChildren);
						} else {
							$scope.$inner.buildFit(showChildren);
						}
						mj.layoutView($attrs.id);
					};

					/**
					 * 内部方法：平均布局
					 */
					$scope.$inner.buildAverage = function(showChildren) {
						var height = 0;
						if (showChildren.length > 0) {
							height = $scope.$inner.getHeight(showChildren) / showChildren.length;
						}
						$.each(showChildren, function(index, item) {
							var col = $scope.$inner.getCell(item);
							if (index == showChildren.length - 1) {
							} else {
								col.css({
									"height" : height
								});
							}
						});
						$.each(showChildren, function(index, item) {
							var scroll = $scope.$inner.getScroll(item);
							scroll.height(scroll.parent().innerHeight());
							scroll.css({
								"display" : "block"
							});
						});
					};

					/**
					 * 内部方法：自动布局
					 */
					$scope.$inner.buildAuto = function(showChildren) {
						$element.height("auto");
						var height = $element.parent().innerHeight();
						$.each(showChildren, function(index, item) {
							var col = $scope.$inner.getCell(item);
							var scroll = $scope.$inner.getScroll(item);
							if (mj.isNotEmpty(item.rs.height)) {
								if (mj.endWith(item.rs.height, "%")) {
									var s = (height * parseInt(item.rs.height, 10)) / 100;
									col.height(s);
								} else {
									col.height(item.rs.height);
								}
								scroll.height(scroll.parent().innerHeight());
							}
							scroll.css({
								"display" : "block"
							});
						});
					};

					/**
					 * 内部方法：适应布局
					 */
					$scope.$inner.buildFit = function(showChildren) {
						$.each(showChildren, function(index, item) {
							var col = $scope.$inner.getCell(item);
							var scroll = $scope.$inner.getScroll(item);
							if (index == showChildren.length - 1) {
								scroll.height(col.innerHeight());
							} else {
								if (mj.isNotEmpty(item.rs.height)) {
									col.css({
										"height" : item.rs.height
									});
									scroll.height(col.innerHeight());
								}else{
									col.height(scroll.outerHeight(true));
								}
							}
							scroll.css({
								"display" : "block"
							});
						});
					};

					$scope.$inner.build();

					/**
					 * 外部方法：添加子元素
					 */
					$scope.$outer.addChild = function(opt) {
						if (!$.isPlainObject(opt)) {
							throw "非Json对象，请检查...";
							return;
						}
						var iview = $scope.$inner.buildVboxItem(opt);
						var _dom = $compile(iview)($scope.$new());
						$element.append(_dom);
						$scope.$outer.layout();
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 外部方法：批量添加子元素
					 */
					$scope.$outer.addChildren = function(opts) {
						if (!$.isArray(opts)) {
							throw "非Array对象，请检查...";
							return;
						}
						$.each(opts, function(index, opt) {
							$scope.$outer.addChild(opt);
						});
						$scope.$outer.layout();
					};

					/**
					 * 内部方法：动态构建控件
					 */
					$scope.$inner.buildVboxItem = function(opts) {
						var tag = $("<mj-vbox-item>");
						$.each(opts, function(key, value) {
							tag.attr("data-" + key, value);
						});
						return tag;
					};

					/**
					 * 外部方法：获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 外部方法：获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 外部方法：添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$element.addClass(cls);
					};

					/**
					 * 外部方法：删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$element.removeClass(cls);
					};

					/**
					 * 外部方法：获取子元素
					 */
					$scope.$outer.getChildren = function() {
						var children = [];
						$.each($scope.$inner.children, function(index, child) {
							children.push(child.sc.$outer);
						});
						return children;
					};

					/**
					 * 外部方法：根据索引获取子元素
					 */
					$scope.$outer.getChildByIndex = function(index) {
						if ($scope.$inner.children[index - 1]) {
							return $scope.$inner.children[index - 1].sc.$outer;
						} else {
							return null;
						}
					};

					/**
					 * 外部方法：根据id获取子元素
					 */
					$scope.$outer.getChildById = function(id) {
						var _$outer = null;
						$.each($scope.$inner.children, function(index, child) {
							if (child.rs.id == id) {
								_$outer = child.sc.$outer;
							}
						});
						return _$outer;
					};
					
					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
				}
			}
		}
	});
});

mj.module.directive('mjVboxItem', function($compile, $timeout) {

	return mj.buildDirective({
		"name" : "mjVboxItem",
		require : [ '^?mjVbox' ],
		compile : function($element, $attrs) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$attrs.hiddenFlag = false;
					$scope.$inner.cell = $element.find(".mj-vbox-cell").first();
					$scope.$inner.scroll = $element.find(".mj-vbox-scroll").first();
					var pScope = $scope.$inner.getParentScope();
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.padding)) {
							$scope.$inner.scroll.css({
								"padding" : $attrs.padding
							});
						}
						if (mj.isTrue($attrs.hidden)) {
							$attrs.hiddenFlag = true;
							$element.css({
								"display" : "none"
							});
						}
						
						if (mj.isNotEmpty(pScope.$outer.getAttrs().border) && mj.isFalse(pScope.$outer.getAttrs().border)) {
							$scope.$inner.cell.css({
								"border" : "none"
							});
						}
					};
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					var pScope = $scope.$inner.getParentScope();
					pScope.$inner.addChild($scope, $element, $attrs);

					/**
					 * 外部方法：添加子元素
					 */
					$scope.$outer.addChild = function(child) {
						if (!mj.isEmpty(child)) {
							var _dom = $compile(child)($scope.$new());
							$scope.$inner.body.append(_dom);
						}
						pScope.$outer.layout();
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 外部方法：隐藏
					 */
					$scope.$outer.hide = function() {
						if (mj.isTrue($attrs.hiddenFlag)) {
							return;
						}
						$attrs.hiddenFlag = true;
						$element.hide();
						if (mj.isNumber(pScope.$outer.getAttrs().split)) {
							if (mj.isNotEmpty($element.next())) {
								$element.next().css({
									"display" : "none"
								});
							} else {
								$element.prev().css({
									"display" : "none"
								});
							}
						}
						pScope.$outer.layout();
					};

					/**
					 * 外部方法：显示
					 */
					$scope.$outer.show = function() {
						if (mj.isFalse($attrs.hiddenFlag)) {
							return;
						}
						$attrs.hiddenFlag = false;
						$element.show();
						if (mj.isNumber(pScope.$outer.getAttrs().split)) {
							if (mj.isNotEmpty($element.next())) {
								$element.next().css({
									"display" : "table-row"
								});
							} else {
								$element.prev().css({
									"display" : "table-row"
								});
							}
						}
						pScope.$outer.layout();
					};

					/**
					 * 外部方法：获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $scope.$inner.scroll.width();
					};
					/**
					 * 外部方法：获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $scope.$inner.scroll.height();
					};

					/**
					 * 外部方法：添加样式
					 */
					$scope.$outer.addClass = function(cls) {
						$element.addClass(cls);
					};

					/**
					 * 外部方法：删除样式
					 */
					$scope.$outer.removeClass = function(cls) {
						$element.removeClass(cls);
					};
					
					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildVbox = function(opts) {
	var tag = $("<mj-vbox>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};

mj.buildVboxItem = function(opts) {
	var tag = $("<mj-vbox-item>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};/**
 * 
 */

mj.module.directive('mjView', function($compile) {
	return mj.buildDirective({
		name : "mjView",
		compile : function($element, $attrs, $transclude) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.padding)) {
							$element.css({
								"padding" : $attrs.padding
							});
						}
						if (mj.isNotEmpty($attrs.height)) {
							$element.css({
								"height" : $attrs.height
							});
						}
						if (mj.isNotEmpty($attrs.width)) {
							$element.css({
								"width" : $attrs.width
							});
						}
					}
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);
					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};

					/**
					 * 添加子元素
					 */
					$scope.$outer.addChild = function(child) {
						if (mj.isNotEmpty(child)) {
							var _dom = $compile(child)($scope.$new());
							$element.append(_dom);
						}
						mj.layoutView($attrs.id);
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};

				}
			}
		}
	});
});

/**
 * 动态构建控件
 */
mj.buildView = function(opts) {
	var tag = $("<mj-view>");
	$.each(opts, function(key, value) {
		tag.attr("data-" + key, value);
	});
	return tag;
};mj.module.directive('mjViewport', function($rootScope, $compile) {
	return mj.buildDirective({
		name : "mjViewport",
		compile : function($element, $attrs, $transclude) {
			return {
				pre : function($scope, $element, $attrs, $ctrl) {
					mj.buildPre(this, $scope, $element, $attrs, $ctrl, $compile);
					mj.$rootScope = $rootScope;
					mj.compile = function(html) {
						return $compile(html)($rootScope.$new());
					};
					$scope.$inner.init = function() {
						if (mj.isNotEmpty($attrs.backgroundColor)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
						if (mj.isNotEmpty($attrs.padding)) {
							$element.css({
								"padding" : $attrs.padding
							});
						}
						if ($attrs.scroll == "true") {
							$element.css({
								"height" : $(document.body).innerHeight(),
								"with" : $(document.body).innerWidth(),
								"overflow" : "auto"
							});
						}
					}
					$scope.$inner.init();
				},
				post : function($scope, $element, $attrs, $ctrl) {
					mj.buildPost(this, $scope, $element, $attrs, $ctrl, $compile);

					/**
					 * 添加子元素
					 */
					$scope.$outer.addChild = function(child) {
						if (!$.isEmpty(child)) {
							var _dom = $compile(child)($scope.$new());
							$element.append(_dom);
						}
						return mj.getView(_dom.attr("id"));
					};

					/**
					 * 获取宽度
					 */
					$scope.$outer.getWidth = function() {
						return $element.width();
					};
					/**
					 * 获取高度
					 */
					$scope.$outer.getHeight = function() {
						return $element.height();
					};
					/**
					 * 获取是否滚动
					 */
					$scope.$outer.getScroll = function() {
						if ($attrs.scroll == "true") {
							return true;
						} else {
							return false;
						}
					};

					/**
					 * 布局方法
					 */
					$scope.$outer.layout = function() {
						if ($attrs.scroll == "true") {
							$element.css({
								"height" : $(document.body).innerHeight(),
								"overflow" : "auto"
							});
						}
						mj.layoutView($attrs.id);
					};

					/**
					 * 设置背景色
					 */
					$scope.$outer.setBackgroundColor = function(color) {
						if (mj.isNotEmpty(color)) {
							$element.css({
								"background-color" : $attrs.backgroundColor
							});
						}
					};
					$scope.$outer.layout();
				}
			}
		}
	});
});/**
 * 
 */

mj.view.window = function(options) {
	mj.addView("mj-window", this);
	this.options = options;

	/**
	 * 关闭方法
	 */
	this.close = function() {
		if ($.isFunction(this.__opts.beforeClose)) {
			this.__opts.beforeClose();
		}
		if (this.__opts.closeModel == "hide") {
			this.__hide();
		} else {
			mj.delView("mj-window");
			this.__destroy();
		}
		if ($.isFunction(options.afterClose)) {
			options.afterClose();
		}
	};

	/**
	 * 显示方法
	 */
	this.open = function() {
		var index = this.__inner.mash.css("z-index");
		if (index != "-100" && index != -100) {
			return;
		}
		this.__inner.mash.css({
			"z-index" : mj.getIndex()
		});
		this.__inner.view.css({
			"z-index" : mj.getIndex()
		});
	};

}

mj.view.window.prototype = {
	__id : mj.key(),
	__inner : {},
	__build : function() {
		this.__buildOption();
		this.__buildMask();
		this.__inner.view = $(mj.templates.mjWindow);
		this.__inner.head = this.__inner.view.find(".mj-window-head").first();
		this.__inner.body = this.__inner.view.find(".mj-window-content").first();
		this.__buildHead();
		this.__buildInclude();
		mj.compile(this.__inner.view);
		mj.getBody().append(this.__inner.view);
		this.__buildView();
	},
	__buildOption:function(){
		this.__opts = {
			"id" : mj.key(),
			"title" : "窗口",
			"width" : "50%",
			"height" : "50%",
			"icon" : "fa fa-window-maximize mj-icon",
			"position" : "c",
			"scroll" : true,
			"resizable" : false,
			"closable" : true,
			"closeModel" : "destroy",
			"view" : "",
			"controller" : null,
			"param" : null,
			"afterClose" : null,
			"beforeClose" : null,
			"load" : ""
		};
		$.extend(true, this.__opts, this.options);
		delete this.options;
	},
	__hide : function() {
		this.__inner.mash.css({
			"z-index" : "-100"
		});
		this.__inner.view.css({
			"z-index" : "-100"
		});
	},
	__buildView : function() {
		this.__inner.view.css({
			"width" : this.__opts.width,
			"height" : this.__opts.height
		});

		var h = (mj.getBody().height() - this.__inner.view.height()) / 2;
		var w = (mj.getBody().width() - this.__inner.view.width()) / 2;
		this.__inner.view.css({
			"top" : h,
			"left" : w
		});

		this.__inner.body.css({
			"height" : this.__inner.body.parent().innerHeight(),
			"width" : this.__inner.body.parent().innerWidth()
		})
	},
	__buildHead : function() {
		var title = $("<span></span>");
		title.text(this.__opts.title);
		var icon = $("<span></span>");
		icon.addClass(this.__opts.icon);

		this.__buildClose();
		this.__inner.head.append(icon);
		this.__inner.head.append(title);
	},

	__buildClose : function() {
		if (this.__opts.closable == true) {
			var _this = this;
			var close = $("<span></span>");
			close.addClass("fa fa-close mj-window-close");
			this.__inner.head.append(close);
			close.on("click", function() {
				_this.close();
			});
		}
	},

	__buildInclude : function() {
		var iview = mj.buildInclude({
			"id" : this.__id,
			"view" : this.__opts.view,
			"controller" : this.__opts.controller,
			"param" : this.__opts.param,
			"load" : this.__opts.load
		});
		this.__inner.body.append(iview);
	},

	__buildMask : function() {
		this.__inner.mash = $(mj.templates.mjMash);
		$(document.body).append(this.__inner.mash);
	},

	__getParam : function() {
		return this.__opts.param;
	},
	__destroy : function() {
		var children = this.__inner.view.find("*[data-tag*='mj']");
		for (var i = children.length - 1; i >= 0; i--) {
			var view = mj.getView($(children[i]).attr("id"));
			if (!mj.isEmpty(view)) {
				if ($.isFunction(view.destroy)) {
					view.destroy();
				}
			}
		}
		this.__inner.view.remove();
		this.__inner.mash.remove();
		delete this;
	}
};

mj.buildWindow = function(options) {
	if (mj.checkView("mj-window")) {
		return;
	}
	var win = new mj.view.window(options);
	win.__build();
	return win;
}