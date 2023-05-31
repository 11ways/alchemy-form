/**
 * The base abstract query builder custom element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.7
 * @version  0.1.7
 */
const QueryBuilderData = Function.inherits('Alchemy.Element.Form.QueryBuilderBase', 'QueryBuilderData');

/**
 * Don't register this as a custom element,
 * but don't let child classes inherit this
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.7
 * @version  0.2.0
 */
QueryBuilderData.makeAbstractClass();

/**
 * Check a filter
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.7
 */
QueryBuilderData.setMethod(function checkFilterType(filter_type, entry) {

	if (!entry) {
		return false;
	}

	let whitelist = this[filter_type];

	if (!whitelist) {
		return true;
	}

	let type = entry.type_name || entry.type || entry.id || entry.name;

	if (!type) {
		return false;
	}

	let entries = whitelist.split(',');

	return entries.indexOf(type) > -1;
});

/**
 * Load data for a specific element
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderData.setMethod(async function loadData(config, element) {

	if (!element) {
		return;
	}

	if (!config) {
		config = {};
	}

	let filter_type,
	    result = [],
	    items;

	if (element.classList.contains('qb-source-type')) {
		items = await this.loadSourceTypeData(config);
		filter_type = 'source-types';
	} else if (element.classList.contains('qb-value-variable') || element.classList.contains('qb-variable')) {
		items = await this.loadVariableData(config);
		filter_type = 'variable-types';
	}

	if (items && items.length) {

		let entry;

		for (entry of items) {
			if (!entry) {
				continue;
			}

			if (filter_type && !this.checkFilterType(filter_type, entry)) {
				continue;
			}

			result.push(entry);
		}
	}

	return {
		items: result,
	};
});

/**
 * Load variable data
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.7
 */
QueryBuilderData.setMethod(async function loadVariableData(config) {

	let dataprovider = this.dataprovider;

	if (!config) {
		config = {};
	}

	config.source_type = 'variable';

	let variables = [];

	if (dataprovider) {
		variables = await dataprovider.loadData(config, this);
	}

	let result = [];

	if (variables && variables.length) {
		let entry;

		for (entry of variables) {
			if (entry) {
				result.push(entry);
			}
		}
	}

	return result;
});