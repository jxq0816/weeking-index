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
	"mjSelect" : '<div data-tag="mjSelect" class="mj-input"><div class="mj-input-label"></div><div class="mj-input-body"><div class="mj-input-table"><div class="mj-input-row"><div class="mj-input-field-left" ng-transclude="left"></div><div class="mj-input-field-body mj-input-cell"><input type="text" class="mj-input-field" readonly="readonly"></input></div><div class="mj-input-cell mj-input-field-select-arrow"><i class="fa fa-chevron-down" aria-hidden="true"></i></div><div class="mj-input-field-right" ng-transclude="right"></div></div></div></div></div>',
	"mjSelectItem" : '<li data-tag="mjSelectItem" class="mj-input-field-select-item"><span class="mj-input-field-select-item-icon fa"></span><span class="mj-input-field-select-item-text"></span></li>',
	"mjSelectTree" : '<div data-tag="mjSelectTree" class="mj-input"><div class="mj-input-label"></div><div class="mj-input-body"><div class="mj-input-table"><div class="mj-input-row"><div class="mj-input-field-left" ng-transclude="left"></div><div class="mj-input-field-body mj-input-cell"><input type="text" class="mj-input-field"  readonly="readonly"></input></div><div class="mj-input-cell mj-input-field-select-arrow"><i class="fa fa-chevron-down" aria-hidden="true"></i></div><div class="mj-input-field-right" ng-transclude="right"></div></div></div></div></div>',
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


