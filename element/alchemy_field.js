/**
 * The alchemy-field element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var Field = Function.inherits('Alchemy.Element.Form.Base', function Field() {
	Field.super.call(this);
});

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setTemplateFile('form/elements/alchemy_field');

/**
 * The stylesheet to load for this element
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setStylesheetFile('form/alchemy_field');

/**
 * Use a new Renderer scope for the contents
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setStatic('use_new_renderer_scope', true);

/**
 * The name of the field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setAttribute('field-name');

/**
 * The view override
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setAttribute('field-view');

/**
 * Is this a read only field?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.1.2
 */
Field.setAttribute('readonly', {boolean: true});

/**
 * Widget settings for use in the views
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.1.2
 */
Field.setAssignedProperty('widget_settings');

/**
 * Get the parent alchemy-form element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.addParentTypeGetter('alchemy_form', 'alchemy-form');

/**
 * Get the error area
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.addElementGetter('error_area', '.error-area');

/**
 * Get the optional alchemy-field-schema it belongs to
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.enforceProperty(function alchemy_field_schema(new_value, old_value) {

	if (!new_value) {
		new_value = this.queryUp('alchemy-field-schema');
	}

	return new_value;
});

/**
 * Get the field info
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.enforceProperty(function config(new_value, old_value) {

	if (!new_value && this.field_name) {

		let schema = this.schema;

		if (schema) {
			new_value = schema.getField(this.field_name);
		}
	}

	return new_value;
});

/**
 * Get the schema this field belongs to
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.enforceProperty(function schema(new_value, old_value) {

	if (!new_value) {
		// See if this is in a schema field
		if (this.alchemy_field_schema) {
			new_value = this.alchemy_field_schema.schema;
		}
	}

	// See if the alchemy-form element has an explicit schema instance
	if (!new_value && this.alchemy_form) {
		new_value = this.alchemy_form.schema;
	}

	if (!new_value) {

		let model_name = this.model;

		if (model_name) {
			// @TODO: Always get the Client-side model here
			let model = alchemy.getModel(model_name);

			if (model) {
				new_value = model.schema;

				if (Blast.isNode) {
					new_value = JSON.clone(new_value, 'toHawkejs');
				}
			}
		}
	}

	return new_value;
});

/**
 * Is this an array field?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setProperty(function is_array() {

	let config = this.config;

	if (config) {
		return config.is_array;
	}

	return false;
});

/**
 * Is this a schema field?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
 Field.setProperty(function contains_schema() {

	let config = this.config;

	if (config) {
		return config instanceof Classes.Alchemy.Field.Schema;
	}

	return false;
});

/**
 * Is this a translatable field?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setProperty(function is_translatable() {

	let config = this.config;

	if (config) {
		return config.is_translatable;
	}

	return false;
});

/**
 * Get the title of this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setProperty(function field_title() {

	let config = this.config,
	    result;

	if (config) {
		result = config.title;
	}

	if (!result && this.field_name) {
		result = this.field_name.titleize();
	}

	return result;
});

/**
 * Get the description of this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setProperty(function field_description() {

	let config = this.config,
	    result;

	if (config && config.options) {
		result = config.options.description;
	}

	return result;
});

/**
 * Get the path of this field in the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
Field.setProperty(function field_path_in_schema() {
	return this.config && this.config.getPath();
});

/**
 * Get the name of this entry for use in a record path
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 *
 * @return   {String}
 */
 Field.setMethod(function getPathEntryName() {

	if (this.config && this.config.name) {
		return this.config.name;
	}

	return '';
});

/**
 * Get the name of the model this field belongs to
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setProperty(function model() {

	if (this.hasAttribute('model')) {
		return this.getAttribute('model');
	}

	let form = this.alchemy_form;

	if (form) {
		return form.model;
	}
}, function setModel(model) {
	return this.setAttribute('model', model);
});

/**
 * Get the view to use for this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.enforceProperty(function view_file(new_value, old_value) {

	if (!new_value) {

		let config = this.config,
		    view_type = this.view_type;

		if (config) {

			let field_view;

			if (this.field_view) {
				field_view = this.field_view;
			} else {
				field_view = config.constructor.type_name;
			}

			new_value = 'form/inputs/' + view_type + '/' + field_view;
		}
	}

	return new_value;
});


/**
 * Get the wrapper to use for this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.enforceProperty(function wrapper_file(new_value, old_value) {

	if (!new_value) {

		let config = this.config,
		    view_type = this.view_type;

		let wrapper_type = this.wrapper_type;

		if (wrapper_type === false) {
			return false;
		}

		if (config) {
			let field_type = config.constructor.type_name;
			return 'form/wrappers/' + view_type + '/' + field_type;
		}
	}

	return new_value;
});

/**
 * Get the view files to use for this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setProperty(function view_files() {

	let result = [],
	    view_file = this.view_file;

	if (view_file) {
		result.push(view_file);
	}

	let config = this.config,
	    view_type = this.view_type;

	if (config) {
		let field_type = config.constructor.type_name,
		    view = 'form/inputs/' + view_type + '/' + field_type;

		result.push(view);
	}

	if (result.length == 0) {
		return false;
	}

	// Fallback to a simple string input
	result.push('form/inputs/' + view_type + '/string');

	return result;
});

/**
 * Get the wrapper files to use for this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setProperty(function wrapper_files() {

	let wrapper_file = this.wrapper_file;

	if (wrapper_file === false) {
		return false;
	}

	let result = [];

	if (wrapper_file) {
		result.push(wrapper_file);
	}

	let config = this.config,
	    view_type = this.view_type;

	if (config) {
		let field_type = config.constructor.type_name,
		    view = 'form/wrappers/' + view_type + '/' + field_type;

		result.push(view);

		view = 'form/wrappers/' + view_type + '/default';
		result.push(view);

		view = 'form/wrappers/default/' + field_type;
		result.push(view);

		view = 'form/wrappers/default/default';
		result.push(view);
	}

	if (result.length == 0) {
		return false;
	}

	return result;
});

/**
 * Get the original value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setProperty(function original_value() {

	let alchemy_field_schema = this.alchemy_field_schema;

	if (alchemy_field_schema) {
		let original_schema_value = alchemy_field_schema.original_value;

		if (original_schema_value) {
			return original_schema_value[this.field_name];
		}

		return;
	}

	let form = this.alchemy_form;

	if (form && form.document) {
		return form.document[this.field_name];
	}
});

/**
 * Get the main field value element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.3
 */
Field.setProperty(function value_element() {

	let input;

	// Translations always get preference
	if (this.is_translatable) {
		input = this.querySelector('alchemy-field-translatable');
	} else if (this.is_array) {
		input = this.querySelector('alchemy-field-array');
	} else if (this.contains_schema) {
		input = this.querySelector('alchemy-field-schema');
	} else {
		input = this.querySelector('.alchemy-field-value');
	}

	return input;
});

/**
 * Get the live value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.3
 */
Field.setProperty(function value() {

	let element = this.value_element;

	if (element) {
		return element.value;
	} else {
		return this.original_value;
	}

}, function setValue(value) {

	let element = this.value_element;

	if (element) {
		element.value = value;
	}

});

/**
 * Get the rule violations for this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Promise<Array>}
 */
Field.setMethod(async function getViolations() {

	let violations = [],
	    config = this.config;

	if (config) {

		let violation,
		    rules = config.getRules(),
		    rule;

		for (rule of rules) {
			violation = await rule.validateFieldValue(config, this.value);

			if (violation) {
				violations.push(violation);
			}
		}
	}

	return violations;
});

/**
 * Validate this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Promise<Boolean>}
 */
Field.setMethod(async function validate() {

	let violations = await this.getViolations();

	// Remove the errors AFTER the violations check
	// (Preventing a flash of empty errors)
	this.removeErrors();

	if (violations.length == 0) {
		return true;
	}

	let violation;

	for (violation of violations) {
		this.error_area.append('' + violation);
	}

	return false;
});

/**
 * Show the given error
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setMethod(function showError(err) {

	let message;

	if (err.microcopy) {

		let microcopy = this.hawkejs_renderer.t(err.microcopy, {
			field : this.field_title,
		});

		message = microcopy.toElement();
	} else {
		message = err.message;
	}

	this.error_area.append(message);
});

/**
 * Remove all errors
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setMethod(function removeErrors() {
	Hawkejs.removeChildren(this.error_area);
});

/**
 * The element is being assembled by hawkejs
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.3
 */
Field.setMethod(function retained() {

	if (!this.id) {
		let id = 'field-';

		if (this.alchemy_form) {
			id += this.alchemy_form.id + '-';
		}

		id += this.field_name.slug();

		this.id = id;
	}

	let label = this.querySelector('.form-field-info alchemy-label');

	if (label && this.value_element) {
		let v_id = this.id + '_fv';

		label.setAttribute('for', v_id);
		this.value_element.setAttribute('id', v_id);
	}

});

/**
 * Load remote data for some fields
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}        config
 * @param    {HTMLElement}   element
 */
Field.setMethod(function loadData(config, element) {

	let field = this.config;

	if (field) {
		return this.hawkejs_helpers.Alchemy.getResource({
			name  : 'FormApi#related',
			post  : true,
			body  : {
				field        : field.name,
				model        : field.parent_schema.model_name,
				assoc_model  : field.options.modelName,
				config       : config,
			}
		});
	}

});