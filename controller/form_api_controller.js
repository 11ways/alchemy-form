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
 * @version  0.1.8
 *
 * @param    {Conduit}   conduit
 */
FormApi.setAction(async function related(conduit) {

	const body = conduit.body || {},
	      config = body.config || {};

	const model = this.getModel(body.assoc_model);
	let crit = model.find();
	crit.limit(50);
	crit.setOption('scenario', 'related_data');

	if (config.value) {
		crit.where(model.primary_key).equals(config.value);
	} else if (config.search) {
		let display_fields = Array.cast(model.displayField);

		let or = crit.or();
		let rx = RegExp.interpretWildcard('*' + body.config.search + '*', 'i');

		for (let field of display_fields) {
			if (!field) {
				continue;
			}

			or.where(field).equals(rx);
		}
	}

	if (config.page) {
		crit.page(config.page);
	}

	let records = await model.find('all', crit);

	let result = {
		available : records.available,
		records   : records
	};

	conduit.end(result);
});


/**
 * The related action
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @param    {Conduit}   conduit
 */
FormApi.setAction(async function queryBuilderData(conduit) {

	const body = conduit.body;
	const config = body.config || {};
	let result;

	if (body && body.model) {
		const model = this.getModel(body.model);

		if (body.$pk) {
			const doc = await model.findByPk(body.$pk);

			if (doc) {
				result = await doc.loadQueryBuilderData(config);
			}
		}
	}

	conduit.end(result);
});