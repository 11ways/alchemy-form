/**
 * Alchemy Form controller
 *
 * @constructor
 * @extends       Alchemy.Controller
 *
 * @author        Jelle De Loecker   <jelle@develry.be>
 * @since         0.1.0
 * @version       0.1.0
 */
var Form = Function.inherits('Alchemy.AppController', function AlchemyFormController(conduit, options) {
	AlchemyFormController.super.call(this, conduit, options);
});

/**
 * Send model configuration
 *
 * @author   Jelle De Loecker       <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Form.setMethod(function clientConfig(conduit) {

	var model_name = conduit.param('model_name');

	if (!model_name) {
		return conduit.error('No model name given');
	}

	let model = this.getModel(model_name);

	if (!model) {
		return conduit.error('Model "' + model_name + '" does not exist');
	}

	let config = model.schema.getClientConfig(),
	    result = {},
	    key;

	// Filter out hidden fields
	for (key in config) {
		if (config[key].hidden) {
			continue;
		}

		result[key] = config[key];
	}

	conduit.end({
		model_name : model_name,
		config     : result
	});
});