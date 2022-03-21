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
 * @version  0.1.5
 *
 * @param    {Conduit}   conduit
 */
FormApi.setAction(async function related(conduit) {

	const body = conduit.body;

	const model = this.getModel(body.assoc_model);
	let crit = model.find();
	crit.limit(50);

	if (body.config && body.config.search) {
		let display_fields = Array.cast(model.displayField);

		let or = crit.or();
		let rx = RegExp.interpretWildcard('*' + body.config.search + '*', 'i');

		for (let field of display_fields) {
			if (!field) {
				continue;
			}

			crit.where(field).equals(rx);
		}
	}

	let records = await model.find('all', crit);

	let result = {
		available : records.available,
		records   : records
	};

	conduit.end(result);
});
