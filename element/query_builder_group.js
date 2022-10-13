/**
 * The alchemy-toggle custom element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
const QueryBuilderGroup = Function.inherits('Alchemy.Element.Form.QueryBuilderBase', 'QueryBuilderGroup');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
QueryBuilderGroup.setTemplateFile('form/elements/query_builder_group');

/**
 * Should the result be inverted?
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderGroup.setAttribute('not', {boolean: true});

/**
 * Is this the root group?
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderGroup.setProperty(function is_root_group() {
	return (this.root_query_builder == this.parentElement);
});

/**
 * Getter for the header element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderGroup.addElementGetter('header', ':scope > .qb-group-header');

/**
 * Getter for the body element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderGroup.addElementGetter('body', ':scope > .qb-group-body');

/**
 * Getter for the body element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderGroup.addElementGetter('rules_list', ':scope > .qb-group-body > .qb-rules-list');

/**
 * Get the group type
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilderGroup.setProperty(function group_type() {

	let input = this.header.querySelector('.qb-group-type input:checked'),
	    result;

	if (input) {
		result = input.value;
	}

	if (!result) {
		result = 'and';
	}

	return result;
}, function setType(value) {

	if (!value) {
		value = 'and';
	} else {
		value = String(value).toLowerCase();
	}

	let input = this.header.querySelector('.qb-group-type input[value="' + value + '"]');

	if (input) {
		input.checked = true;
	}
});

/**
 * Is this group inverted/not?
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.7
 */
QueryBuilderGroup.setProperty(function inverted() {

	let input = this.header.querySelector('.qb-group-invert input:checked');

	if (input) {
		return true;
	}

	return false;
}, function setInverted(value) {

	if (!this.assigned_data.value) {
		this.assigned_data.value = {};
	}

	this.assigned_data.value.inverted = value;

	if (this.header) {
		let input = this.header.querySelector('.qb-group-invert input');
		input.checked = value;
	}
});

/**
 * Get/set the value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.7
 */
QueryBuilderGroup.setProperty(function value() {

	let result = {
		type      : 'group',
		condition : this.group_type,
		inverted  : this.inverted,
		rules     : [],
	};

	let rules_elements = this.rules_list.children;

	for (let i = 0; i < rules_elements.length; i++) {
		let element = rules_elements[i],
		    value = element.value;

		if (value) {
			result.rules.push(element.value);
		}
	}

	return result;
}, function setValue(value) {

	this.assigned_data.value = value;

	if (this.has_rendered) {
		this.applyValue(value);
	}
});

/**
 * Apply the given value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.2.0
 */
QueryBuilderGroup.setMethod(function applyValue(value) {

	if (!value) {
		return;
	}

	// Keep track of how many time a value has been applied
	// (needed for the initial value setter)
	if (!this.applied_value_counter) {
		this.applied_value_counter = 0;
	}

	this.applied_value_counter++;

	this.inverted = value.inverted;
	this.group_type = value.condition;

	Hawkejs.removeChildren(this.rules_list);

	if (value.rules && value.rules.length) {
		let element,
		    rule;

		for (rule of value.rules) {
			if (rule.type == 'qb_entry') {
				element = this.createElement('al-query-builder-entry');
			} else {
				element = this.createElement('al-query-builder-group');
			}

			element.assigned_data.value = rule;
			this.rules_list.append(element);
		}
	}
});

/**
 * Added to the dom
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.2.0
 */
QueryBuilderGroup.setMethod(function introduced() {

	let add_rule = this.header.querySelector('.qb-add-rule'),
	    add_group = this.header.querySelector('.qb-add-group'),
		delete_group = this.header.querySelector('.qb-delete-group');
	
	add_rule.addEventListener('click', e => {
		e.preventDefault();
		
		let new_rule = this.createElement('al-query-builder-entry');
		this.rules_list.append(new_rule);
	});

	add_group.addEventListener('click', e => {
		e.preventDefault();

		let new_group = this.createElement('al-query-builder-group');
		this.rules_list.append(new_group);
	});

	delete_group.addEventListener('click', e => {
		e.preventDefault();
		this.remove();
	});

	// Apply the value if it hasn't been done already
	if (this.assigned_data.value && !this.applied_value_counter) {
		this.applyValue(this.assigned_data.value);
	}
});