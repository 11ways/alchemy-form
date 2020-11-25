/**
 * The FormApi Controller class
 *
 * @extends  Alchemy.Controller
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Conduit}   conduit
 * @param    {Object}    options
 */
const FormApi = Function.inherits('Alchemy.Controller', 'FormApi');

/**
 * The related action
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Conduit}   conduit
 */
FormApi.setAction(async function related(conduit) {

	const body = conduit.body;

	console.log('Getting related for:', body);

	const model = this.getModel(body.assoc_model);

	let records = await model.find('all');

	let result = {
		available : records.available,
		records   : records
	};

	console.log('Responding with:', result);

	conduit.end(result);
});
