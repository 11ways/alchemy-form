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
 * @version  0.3.0
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

	if (body.constraints) {
		crit.applyConditions(body.constraints);
	}

	if (config.value) {
		crit.where(model.primary_key).equals(config.value);
	} else if (config.search) {
		let display_fields = Array.cast(model.display_field),
		    search_fields = [];

		let or = crit.or();
		let rx = RegExp.interpretWildcard('*' + body.config.search + '*', 'i');

		for (let field of display_fields) {
			if (!field || !model.getField(field)) {
				continue;
			}
			search_fields.push(field);
		}

		if (!search_fields.length) {
			if (model.getField('title')) {
				search_fields.push('title');
			}

			if (model.getField('name')) {
				search_fields.push('name');
			}

			if (model.getField('slug')) {
				search_fields.push('slug');
			}
		}

		for (let field of search_fields) {
			or.where(field).equals(rx);
		}
	}

	if (config.page) {
		crit.page(config.page);
	}

	if (model.display_field_select) {
		crit.select(model.display_field_select);
	}

	let records = await model.find('all', crit);

	let result = {
		available : records.available,
		records   : records
	};

	conduit.end(result);
});

/**
 * The enum info action:
 * Return information about a record for use in an enum element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @param    {Conduit}   conduit
 */
FormApi.setAction(async function enumInfo(conduit, model_name, id) {

	const model = this.getModel(model_name);
	let record = await model.findByPk(id);

	if (!record) {
		return conduit.notFound();
	}

	let result = {
		title : record.getDisplayFieldValue(),
		icon  : record.enum_icon || record.icon,
		color : record.enum_color || record.color,
	};

	conduit.end(result);
});

/**
 * The action to recompute field values
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 *
 * @param    {Conduit}   conduit
 * @param    {String}    model_name
 * @param    {String}    field
 */
FormApi.setAction(async function recompute(conduit, model_name, field) {

	const body = conduit.body || {};

	const model = this.getModel(model_name);

	if (!model) {
		return conduit.error(new Error('Model "' + model_name + '" not found'));
	}

	let doc = model.createDocument(body);

	await doc.recomputeFieldIfNecessary(field, true);

	conduit.end({
		result : doc[field],
	});
});

/**
 * The related action
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.2.1
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
				if (typeof doc.loadQueryBuilderData != 'function') {
					throw new Error('The document class of "' + body.model + '" has no loadQueryBuilderData(config) method');
				} else {
					result = await doc.loadQueryBuilderData(config);
				}
			}
		}
	}

	conduit.end(result);
});