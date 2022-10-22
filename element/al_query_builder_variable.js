/**
 * The al-query-builder-value custom element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.7
 * @version  0.1.7
 */
const QueryBuilderVariable = Function.inherits('Alchemy.Element.Form.QueryBuilderData', 'QueryBuilderVariable');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.7
 * @version  0.1.7
 */
QueryBuilderVariable.setTemplateFile('form/elements/query_builder_variable');

/**
 * A filter of variable definition types
 * (number, string, ...)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.7
 * @version  0.1.7
 */
QueryBuilderVariable.setAttribute('variable-types');

/**
 * Getter for the value input wrapper
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.7
 * @version  0.1.7
 */
QueryBuilderVariable.addElementGetter('variable_select', '.qb-variable');

/**
 * Get/set the value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.7
 * @version  0.1.7
 */
QueryBuilderVariable.setProperty(function value() {

	let result = {
		type          : 'qb_variable',
		variable_type : null,
	};

	let select = this.variable_select;

	if (select) {
		result.variable = select.value;

		if (select.values) {
			let value_def = select.values[result.variable];

			if (value_def) {
				result.variable_type = value_def.type_name;
			}
		}
	}

	return result;
}, function setValue(value) {
	this.assigned_data.value = value;
});

/**
 * Apply the given value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.7
 * @version  0.1.7
 */
QueryBuilderVariable.setMethod(async function applyValue(value) {

	if (!value) {
		return;
	}

	let select = this.variable_select;

	if (select) {
		select.value = value.variable;
	}
});

/**
 * Added to the dom
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.7
 * @version  0.1.7
 */
QueryBuilderVariable.setMethod(async function introduced() {

	if (this.assigned_data.value) {
		await this.applyValue(this.assigned_data.value);
	}
});