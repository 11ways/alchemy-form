Router.add({
	name       : 'FormApi#related',
	methods    : 'post',
	paths      : '/api/form/data/related',
	policy     : 'logged_in',
});

Router.add({
	name       : 'FormApi#queryBuilderData',
	methods    : 'post',
	paths      : '/api/form/data/qbdata',
	policy     : 'logged_in',
});