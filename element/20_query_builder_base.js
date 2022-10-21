/**
 * The base abstract query builder custom element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
const QueryBuilderBase = Function.inherits('Alchemy.Element.Form.Base', 'QueryBuilderBase');

/**
 * Don't register this as a custom element,
 * but don't let child classes inherit this
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.2.0
 */
QueryBuilderBase.makeAbstractClass();

/**
 * Get the dataprovider
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderBase.enforceProperty(function dataprovider(new_value) {

	if (new_value == null) {
		if (this.assigned_data.dataprovider) {
			new_value = this.assigned_data.dataprovider;
		} else if (this.root_query_builder && this.root_query_builder.dataprovider) {
			new_value = this.root_query_builder.dataprovider;
		}
	} else {
		this.assigned_data.dataprovider = new_value;
	}

	return new_value;
});

/**
 * Getter for the rules list element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.2.0
 */
QueryBuilderBase.setProperty(function root_query_builder() {
	return this.queryParents('al-query-builder');
});

/**
 * Get the value type of the given input
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 * 
 * @param    {HTMLElement}
 * 
 * @return   {String}
 */
QueryBuilderBase.setMethod(function getValueType(element) {

	if (!element) {
		return null;
	}

	let result = element.value_type || element.type;

	return result;
});