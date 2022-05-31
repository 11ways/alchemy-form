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
 * @version  0.1.6
 *
 * @param    {Object}        config
 * @param    {HTMLElement}   element
 */
QueryBuilderField.setMethod(function loadData(config, element) {

	if (element) {
		let form = element.queryParents('alchemy-form');

		if (form) {
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

			return element.hawkejs_helpers.Alchemy.getResource({
				name  : 'FormApi#queryBuilderData',
				post  : true,
				body  : {
					model        : model_name,
					$pk          : $pk,
					config       : config,
				}
			});
		}
	}

	return [];
});