Plugin.addRoute({
	name       : 'FormApi#related',
	methods    : 'post',
	paths      : '/api/form/data/related',
	policy     : 'logged_in',
	cache      : true,
	is_system_route : true,
});

Plugin.addRoute({
	name       : 'FormApi#queryBuilderData',
	methods    : 'post',
	paths      : '/api/form/data/qbdata',
	policy     : 'logged_in',
	cache      : true,
	is_system_route : true,
});

Plugin.addRoute({
	name            : 'FormApi#recompute',
	methods         : 'post',
	paths           : '/api/form/data/recompute/{model_name}/{field}',
	policy          : 'logged_in',
	is_system_route : true,
	permission      : 'model.{model_name}.recompute.{field}',
});