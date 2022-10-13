/**
 * Schema fields are nested schema's
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
const QueryBuilderField = Function.inherits('Alchemy.Field', function QueryBuilder(schema, name, options) {

	if (!options) {
		options = {};
	}

	QueryBuilder.super.call(this, schema, name, options);
});

/**
 * Set the datatype name
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderField.setDatatype('object');

/**
 * This field value is self-contained
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderField.setSelfContained(true);

/**
 * Cast the given value to this field's type
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderField.setMethod(function cast(value, to_datasource) {
	return value;
});

/**
 * Load remote data
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.2.0
 *
 * @param    {Object}        config
 * @param    {HTMLElement}   element
 */
QueryBuilderField.setMethod(function loadData(config, element) {

	const options = this.options || {},
	      source_type = options.variable_data || 'document',
	      add_form_value = options.add_form_value || false;

	let api_route,
	    form;

	let body = {
		source_type,
		config,
	};

	if (element) {
		form = element.queryParents('al-form');

		if (add_form_value && form) {
			body.form_value = form.value;
		}
	}

	// Use the current document data to get the variable data
	if (form && source_type == 'document') {

		let doc = form.document;

		if (doc && doc.root_document) {
			doc = doc.root_document;
		}

		let model_name,
			$pk;
		
		if (doc) {
			model_name = doc.$model_name;
			$pk = doc.$pk;
		}

		body.model = model_name;
		body.$pk = $pk;
	}

	if (options.route) {
		api_route = options.route;
	} else {
		api_route = 'FormApi#queryBuilderData';
	}

	return element.hawkejs_helpers.Alchemy.getResource({
		name  : api_route,
		post  : true,
		body,
	});
});