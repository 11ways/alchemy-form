/**
 * The alchemy-query-builder-value custom element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
const QueryBuilderValue = Function.inherits('Alchemy.Element.Form.QueryBuilderBase', 'QueryBuilderValue');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderValue.setTemplateFile('form/elements/query_builder_value');

/**
 * Does this use a single source type?
 * (Set automatically, based on source-types attribute)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderValue.setAttribute('single-source-type');

/**
 * Does this use a single variable type?
 * (Set automatically, based on variable-types attribute)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderValue.setAttribute('single-variable-type');

/**
 * A filter of variable definition types
 * (number, string, ...)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderValue.setAttribute('variable-types');

/**
 * A filter of source types
 * (variable, value)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderValue.setAttribute('source-types');

/**
 * Getter for the source type selector
 * (variable, value)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderValue.addElementGetter('source_type_select', '.qb-source-type');

/**
 * Getter for the value input wrapper
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderValue.addElementGetter('value_input_wrapper', '.qb-value-input-wrapper');

/**
 * Get/set the value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderValue.setProperty(function value() {

	if (!this.source_type_select.value) {
		return;
	}

	let result = {
		type         : 'qb_value',
		source_type  : this.source_type_select.value,
	};

	if (result.source_type == 'variable') {
		let select = this.value_input_wrapper.querySelector('.qb-value-variable');

		if (select) {
			result.value_variable = select.value;
		}
	} else if (result.source_type == 'value') {
		let input = this.value_input_wrapper.querySelector('.qb-value-input');

		if (input) {

			let value_explicit = {
				type  : this.getValueType(input),
				value : null,
			}

			if (value_explicit.type == 'number' && typeof input.valueAsNumber != 'undefined') {
				value_explicit.value = input.valueAsNumber;
			} else {
				value_explicit.value = input.value;
			}

			result.value_explicit = value_explicit;
		}
	}

	return result;
}, function setValue(value) {
	this.assigned_data.value = value;
});

/**
 * Check a filter
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderValue.setMethod(function checkFilterType(filter_type, entry) {

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
QueryBuilderValue.setMethod(async function loadData(config, element) {

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
	} else if (element.classList.contains('qb-value-variable')) {
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
 * @version  0.1.6
 */
QueryBuilderValue.setMethod(async function loadVariableData(config) {

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

/**
 * Load value type data
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderValue.setMethod(async function loadSourceTypeData(config) {

	let items = [];

	items.push({id: 'variable', title: 'Variable'});
	items.push({id: 'value', title: 'Value'});

	return items;
});

/**
 * Show the correct value input
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderValue.setMethod(async function showValueInput() {

	let variable_type = this.single_variable_type;

	if (!variable_type) {
		return;
	}

	let constructor = Blast.Classes.Alchemy.QueryBuilder.VariableDefinition.VariableDefinition.getMember(variable_type);

	if (!constructor) {
		return;
	}

	let instance = new constructor();

	let element = instance.createValueInput(this.hawkejs_renderer);

	element.classList.add('qb-value-input');

	this.value_input_wrapper.append(element);
});


/**
 * Apply source type changes
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderValue.setMethod(async function applySourceTypeChanges() {

	Hawkejs.removeChildren(this.value_input_wrapper);

	let type = this.source_type_select.value;

	if (type == 'variable') {
		let select = this.createElement('alchemy-select');
		select.dataprovider = this;
		select.classList.add('qb-value-variable');
		this.value_input_wrapper.append(select);
	} else if (type == 'value') {
		await this.showValueInput();
	}
});

/**
 * Apply the given value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderValue.setMethod(async function applyValue(value) {

	if (!value) {
		return;
	}

	this.source_type_select.value = value.source_type;

	await this.applySourceTypeChanges();

	if (value.source_type == 'variable') {
		let select = this.value_input_wrapper.querySelector('.qb-value-variable');

		if (select) {
			select.value = value.value_variable;
		}
	} else if (value.source_type == 'value') {
		let input = this.value_input_wrapper.querySelector('.qb-value-input');

		if (input && value.value_explicit) {
			input.value = value.value_explicit.value;
		}
	}
});

/**
 * Set the source type selector visibility
 * (It should be hidden if there is only 1 possible value)
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderValue.setMethod(function checkTypeConfig() {

	// Don't hide the source type select by default
	let single_source_type,
	    hide_source_type = false;

	// Check the variable types first
	let variable_types = this.variable_types,
	    single_variable_type;

	if (variable_types) {
		let pieces = variable_types.split(',');

		if (pieces && pieces.length == 1) {
			single_variable_type = pieces[0];
		} else {
			// There are NO or MULTIPLE variable types, so we can't use the "value" source type
			single_source_type = 'variable';
		}
	}

	if (single_variable_type) {
		this.single_variable_type = single_variable_type;
	} else {
		this.removeAttribute('single-variable-type');
	}
	
	// If we don't have to hide the source type yet
	if (!single_source_type) {
		let source_types = this.source_types;

		if (source_types) {
			let pieces = source_types.split(',');

			if (pieces && pieces.length == 1) {
				single_source_type = pieces[0];
			}
		}
	}

	// If we have a single source type, apply it now
	if (single_source_type) {
		if (this.source_type_select.value != single_source_type) {
			this.source_type_select.value = single_source_type;
			this.applySourceTypeChanges();
		}

		hide_source_type = true;
	}

	this.source_type_select.hidden = hide_source_type;

	if (single_source_type) {
		this.single_source_type = single_source_type;
	} else {
		this.removeAttribute('single-source-type');
	}
});

/**
 * Added to the dom
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderValue.setMethod(async function introduced() {

	this.source_type_select.addEventListener('change', e => {
		e.preventDefault();
		this.applySourceTypeChanges();
	});

	this.checkTypeConfig();

	if (this.assigned_data.value) {
		await this.applyValue(this.assigned_data.value);
	}
});