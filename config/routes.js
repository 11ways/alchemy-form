// Link to the dashboard
Router.add({
	name       : 'FormClientConfig',
	methods    : 'get',
	paths      : '/_form_client_config',
	handler    : 'AlchemyForm#clientConfig'
});