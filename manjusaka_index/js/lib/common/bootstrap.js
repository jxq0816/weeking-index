var $app = {
	"module" : mj.module,
	"method" : {},
	"plug" : {},
	"ctrls" : {}
};
// mj.ctrls=$app.ctrls;
/**
 * 服务地址
 */
$app.services = [ {
	"name" : "manjusaka",
	"path" : "http://localhost:8086/services",
	"desc" : "st服务",
	"modules" : [ {
		"name" : "table",
		"desc" : '表格管理模块',
		"methods" : [ {
			"name" : 'page',
			"type" : 'get',
			"path" : '/mTable/selection/page',
			"desc" : '表格分页查询'
		} ]
	}, {
		"name" : "tree",
		"desc" : '树管理模块',
		"methods" : [ {
			"name" : 'list',
			"type" : 'get',
			"path" : '/mTree/selection/list',
			"desc" : '树查询'
		}, {
			"name" : 'insert',
			"type" : 'post',
			"path" : '/mTree/insertion/single',
			"desc" : '树查询'
		} ]
	}, {
		"name" : "select",
		"desc" : '树管理模块',
		"methods" : [ {
			"name" : 'list',
			"type" : 'get',
			"path" : '/mselect/selection/list',
			"desc" : '树查询'
		} ]
	}, {
		"name" : "checkbox",
		"desc" : '树管理模块',
		"methods" : [ {
			"name" : 'list',
			"type" : 'get',
			"path" : '/mcheckbox/selection/list',
			"desc" : '树查询'
		} ]
	} ]
}, {
	"name" : "filemarket",
	"path" : "http://106.14.57.124/filemarket.server/services",
	"desc" : "文件服务器",
	"modules" : [ {
		"name" : "file",
		"desc" : '附件管理模块',
		"methods" : [ {
			"name" : 'upload',
			"type" : 'post',
			"path" : '/file/upload',
			"desc" : '附件上传'
		}, {
			"name" : 'select',
			"type" : 'get',
			"path" : '/mTable/selection/page',
			"desc" : '表格分页查询'
		} ]
	} ]
} ];

/**
 * 公共服务
 */
mj.module.factory('$appService', function($http) {
	var serviceObj = {};
	// services
	$.each($app.services, function(index, service) {
		serviceObj[service.name] = {};
		// modules
		$.each(service.modules, function(index, module) {
			serviceObj[service.name][module.name] = {};
			// methods
			$.each(module.methods, function(index, method) {
				serviceObj[service.name][module.name][method.name] = {};
				serviceObj[service.name][module.name][method.name]["action"] = service.path + method.path;
				serviceObj[service.name][module.name][method.name]["method"] = function(params, succFunc, failFunc) {
					$http({
						url : service.path + method.path,
						method : method.type,
						params : params,
						timeout : 60000
					}).then(function successCallback(response) {
						if (response.data.code == 0) {
							if (angular.isFunction(succFunc)) {
								succFunc(response.data);
							}
						} else {
							if (angular.isFunction(failFunc)) {
								failFunc(response.data);
							}
						}
					}, function errorCallback(response) {
						if (failFunc) {
							failFunc(response.data);
						}
					});
				};
			});
		});
	});
	return serviceObj;
});
