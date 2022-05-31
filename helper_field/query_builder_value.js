/**
 * A QueryBuilderValue field lets you get variable values
 * using the QueryBuilder logic
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
const QueryBuilderValue = Function.inherits('Alchemy.Field.QueryBuilder', 'QueryBuilderValue');

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
QueryBuilderValue.setMethod(function loadData(config, element) {

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