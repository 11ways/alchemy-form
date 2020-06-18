/**
 * The alchemy-field element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
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
 * @since    0.2.0
 * @version  0.2.0
 */
Field.setAttribute('field-name');

/**
 * Get the parent alchemy-form element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Field.addParentTypeGetter('alchemy_form', 'alchemy-form');

/**
 * Get the optional alchemy-field-schema it belongs to
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
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
 * @since    0.2.0
 * @version  0.2.0
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
 * @since    0.2.0
 * @version  0.2.0
 */
Field.enforceProperty(function schema(new_value, old_value) {

	if (!new_value) {
		// See if this is in a schema field
		if (this.alchemy_field_schema) {
			new_value = this.alchemy_field_schema.schema;
		}
	}

	if (!new_value) {

		let model_name = this.model;

		if (model_name) {
			// @TODO: Always get the Client-side model here
			let model = alchemy.getModel(model_name);

			if (model) {
				new_value = model.schema;
			}
		}

	}

	return new_value;
});

/**
 * Is this an array field?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Field.setProperty(function is_array() {

	let config = this.config;

	if (config) {
		return config.is_array;
	}

	return false;
});

/**
 * Is this a translatable field?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
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
 * @since    0.2.0
 * @version  0.2.0
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
 * @since    0.2.0
 * @version  0.2.0
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
 * Get the name of the model this field belongs to
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
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
 * @since    0.2.0
 * @version  0.2.0
 */
Field.enforceProperty(function view_file(new_value, old_value) {

	if (!new_value) {

		let config = this.config,
		    view_type = this.view_type;

		if (config) {
			let field_type = config.constructor.type_name;
			return 'form/inputs/' + view_type + '/' + field_type;
		}
	}

	return new_value;
});


/**
 * Get the wrapper to use for this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
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
 * @since    0.2.0
 * @version  0.2.0
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

	return result;
});

/**
 * Get the wrapper files to use for this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
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
 * @since    0.2.0
 * @version  0.2.0
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
 * @since    0.2.0
 * @version  0.2.0
 */
Field.setProperty(function value_element() {

	let input;

	if (this.is_array) {
		input = this.querySelector('alchemy-field-array');
	} else {
		input = this.querySelector('.alchemy-field-value');
	}

	return input;
});

/**
 * Get the live value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Field.setProperty(function value() {

	let element = this.value_element;

	if (element) {
		return element.value;
	}

}, function setValue(value) {

	let element = this.value_element;

	if (element) {
		element.value = value;
	}

});
