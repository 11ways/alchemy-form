/**
 * The query-builder-entry custom element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
const QueryBuilderEntry = Function.inherits('Alchemy.Element.Form.QueryBuilderBase', 'QueryBuilderEntry');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderEntry.setTemplateFile('form/elements/query_builder_entry');

/**
 * The type of entry
 * (can change the operators used)
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderEntry.setAttribute('type');

/**
 * Getter for the field selector
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderEntry.addElementGetter('field_select', '.qb-field');

/**
 * Getter for the operator selector
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderEntry.addElementGetter('operator_select', '.qb-operator');

/**
 * Getter for the value type selector
 * (variable, value)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderEntry.addElementGetter('value_type_select', '.qb-value-type');

/**
 * Getter for the value input wrapper
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderEntry.addElementGetter('value_input_wrapper', '.qb-value-input-wrapper');

/**
 * Getter for the delete button
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderEntry.addElementGetter('delete_button', '.qb-delete-entry');

/**
 * Get/set the value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderEntry.setProperty(function value() {

	if (!this.field_select.value) {
		return;
	}

	let result = {
		type         : 'qb_entry',
		field        : this.field_select.value,
		operator     : this.operator_select.value,
		source_type  : this.value_type_select.value,
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
			};

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
 * Load data for a specific element
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.12
 */
QueryBuilderEntry.setMethod(async function loadData(config, element) {

	if (!element) {
		return;
	}

	if (!config) {
		config = {};
	}

	let items;

	if (element.classList.contains('qb-field') || element.classList.contains('qb-value-variable')) {
		items = await this.loadVariableData(config);
	} else if (element.classList.contains('qb-operator')) {
		items = await this.loadOperatorData(config);
	} else if (element.classList.contains('qb-value-type')) {
		items = await this.loadValueTypeData(config);
	}

	if (items) {
		items.clean(null);
		items.clean(undefined);
		items.clean(false);
	}

	return {
		items: items,
	};
});

/**
 * Load value type data
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderEntry.setMethod(async function loadValueTypeData(config) {

	let items = [];

	items.push({id: 'variable', title: 'Other variable'});
	items.push({id: 'value', title: 'Value'});

	return items;
});

/**
 * Load variable data
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderEntry.setMethod(async function loadVariableData(config) {

	config.value_type = 'variable';

	let dataprovider = this.dataprovider;

	if (!config) {
		config = {};
	}

	config.type = this.type || 'logical';

	let variables = [];

	if (dataprovider) {
		variables = await dataprovider.loadData(config, this);
	}

	let result = [];

	if (variables && variables.length) {
		let allow_readonly = true,
		    entry;

		if (config.type != 'logical') {
			allow_readonly = false;
		}

		for (entry of variables) {
			if (entry) {
				if (allow_readonly || !entry.readonly) {
					result.push(entry);
				}
			}
		}
	}

	// Example
	// items.push({
	// 	id    : 'id',
	// 	title : 'ID',
	// 	type  : 'number'
	// });

	return result;
});

/**
 * Load operator data
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderEntry.setMethod(async function loadOperatorData(config) {

	let type = this.field_select.value;

	if (!type) {
		return;
	}

	let variable_def = this.field_select.getValueData(type);

	let items = [];

	if (variable_def) {

		if (!this.type || this.type == 'logical') {
			items.include(variable_def.getLogicalOperators());
		} else if (this.type == 'assignment') {
			items.include(variable_def.getAssignmentOperators());
		}
	}

	return items;
});

/**
 * Show the correct value input
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderEntry.setMethod(async function showValueInput() {

	let variable_name = this.field_select.value;

	if (!variable_name) {
		return;
	}

	let entry = this.field_select.getValueData(variable_name);

	if (!entry) {
		await this.field_select.waitForTasks();

		entry = this.field_select.getValueData(variable_name);
	}

	if (!entry) {
		return;
	}

	let element = entry.createValueInput(this.hawkejs_renderer);

	element.classList.add('qb-value-input');

	this.value_input_wrapper.append(element);
});

/**
 * Apply the given value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderEntry.setMethod(async function applyValue(value) {

	if (!value) {
		return;
	}

	this.field_select.value = value.field;
	this.operator_select.value = value.operator;
	this.value_type_select.value = value.source_type;

	await this.applyValueTypeChanges();

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
 * Apply value type changes
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.2.0
 */
QueryBuilderEntry.setMethod(async function applyValueTypeChanges() {

	Hawkejs.removeChildren(this.value_input_wrapper);

	let type = this.value_type_select.value;

	if (type == 'variable') {
		let select = this.createElement('al-select');
		select.value_item_template = 'form/select/qb_item';
		select.option_item_template = 'form/select/qb_item';

		select.dataprovider = this;
		select.classList.add('qb-value-variable');
		this.value_input_wrapper.append(select);
	} else if (type == 'value') {
		await this.showValueInput();
	}
});

/**
 * Added to the dom
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderEntry.setMethod(function introduced() {

	this.field_select.addEventListener('change', e => {
		e.preventDefault();

		this.operator_select.value = null;
		this.value_type_select.value = null;
		Hawkejs.removeChildren(this.value_input_wrapper);
	});

	this.delete_button.addEventListener('click', e => {
		e.preventDefault();
		this.remove();
	});

	this.value_type_select.addEventListener('change', e => {
		e.preventDefault();
		this.applyValueTypeChanges();
	});

	if (this.assigned_data.value) {
		this.applyValue(this.assigned_data.value);
	}
});