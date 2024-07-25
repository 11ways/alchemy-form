const LAST_SET_VALUE = Symbol('last_set_value');

/**
 * The al-field element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.4
 */
const Field = Function.inherits('Alchemy.Element.Form.Base', 'Field');

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
 * The data source url/route to use
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.9
 * @version  0.1.9
 */
Field.setAttribute('data-src');

/**
 * The name of the field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setAttribute('field-name');

/**
 * The type of the field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.4
 * @version  0.1.4
 */
Field.setAttribute('field-type');

/**
 * The view override
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.setAttribute('field-view');

/**
 * The wrapper view override
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.12
 * @version  0.1.12
 */
Field.setAttribute('wrapper-view');

/**
 * Minimum amount of values (in case of an array)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.12
 * @version  0.1.12
 */
Field.setAttribute('min-entry-count', {type: 'number'});

/**
 * Maximum amount of values (in case of an array)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.12
 * @version  0.1.12
 */
Field.setAttribute('max-entry-count', {type: 'number'});

/**
 * Is this a read only field?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.3.0
 */
Field.setAttribute('readonly', function getReadonlyValue(current_value) {

	if (current_value == null) {
		current_value = this.alchemy_form?.readonly;
	}

	return current_value;

}, {boolean: true});

/**
 * Widget settings for use in the views
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.2
 * @version  0.1.2
 */
Field.setAssignedProperty('widget_settings');

/**
 * Applied options
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.7
 * @version  0.2.7
 */
Field.setAssignedProperty('applied_options');

/**
 * The placeholder
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.2
 * @version  0.2.2
 */
Field.setAttribute('placeholder');

/**
 * Get the parent al-form element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Field.enforceProperty(function alchemy_form(new_value) {

	if (new_value == null) {
		new_value = this.queryUp('al-form');

		if (!new_value && this.field_context) {
			new_value = this.field_context.queryUp('al-form');
		}

		if (!new_value && this.alchemy_field_schema && this.alchemy_field_schema.alchemy_field) {
			new_value = this.alchemy_field_schema.alchemy_field.alchemy_form;
		}
	}
	
	return new_value;
});

/**
 * Get the error area
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Field.addElementGetter('error_area', '.error-area');

/**
 * Get the optional al-field-schema it belongs to
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Field.enforceProperty(function alchemy_field_schema(new_value, old_value) {

	if (!new_value) {
		new_value = this.queryUp('al-field-schema');
	}

	return new_value;
});

/**
 * Get the field info
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.7
 */
Field.enforceProperty(function config(new_value, old_value) {

	// If an explicit field is set without a schema,
	// we need to remember it for serializing purposes
	if (new_value && (!new_value.schema || new_value == new_value.schema)) {
		this.assigned_data.field_config = new_value;
	}

	// See if there is a rememberd field available
	if (!new_value && this.assigned_data?.field_config) {
		new_value = this.assigned_data.field_config;
	}

	// There is no remembered field, so check the schema
	if (!new_value && this.field_name) {

		let schema = this.schema;

		if (schema) {
			new_value = schema.getField(this.field_name);
		}
	}

	if (new_value && new_value.constructor && new_value.constructor.type_name) {
		this.field_type = new_value.constructor.type_path || new_value.constructor.type_name;
	} else if (new_value) {
		this.field_type = null;
	}

	return new_value;
});

/**
 * Get the schema this field belongs to
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.3.0
 */
Field.enforceProperty(function schema(new_value, old_value) {

	let forced_value = !!new_value;

	if (!new_value && this.assigned_data?.schema) {
		new_value = this.assigned_data.schema;
	}

	if (!new_value) {
		// See if this is in a schema field
		if (this.alchemy_field_schema) {
			new_value = this.alchemy_field_schema.schema;
		}
	}

	// See if the al-form element has an explicit schema instance
	if (!new_value && this.alchemy_form) {
		new_value = this.alchemy_form.schema;
	}

	if (!new_value) {

		let model_name = this.model;

		if (model_name) {
			let model = alchemy.getClientModel(model_name);

			if (model) {
				new_value = model.schema;
			}
		}
	}

	if (forced_value) {
		this.assignData('schema', new_value);
	}

	return new_value;
});

/**
 * Is this an array field?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.3.0
 */
Field.setProperty(function is_array() {

	if (this.assigned_data?.is_array != null) {
		return this.assigned_data.is_array;
	}

	let config = this.config;

	if (config) {
		return config.is_array;
	}

	return false;
}, function setValue(value) {
	this.assignData('is_array', value);
});

/**
 * Is this a schema field?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.3.0
 */
Field.setProperty(function contains_schema() {

	let config = this.config;

	if (config) {
		if (config instanceof Classes.Alchemy.Field.Schema) {
			return true;
		}

		return Classes.Alchemy.Client.Schema.isSchema(config);
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
 * @version  0.1.12
 */
Field.setProperty(function field_title() {

	let result = this._title || this.widget_settings?.title || this.config?.title;

	if (!result && this.field_name) {
		result = this.field_name.titleize();
	}

	return result;
}, function setTitle(value) {
	this._title = value;
});

/**
 * Get the description of this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.12
 */
Field.setProperty(function field_description() {

	let result = this.widget_settings?.description || this.config?.description;

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
 * @version  0.3.0
 *
 * @return   {String}
 */
Field.setMethod(function getPathEntryName() {

	if (this.config && this.config.name) {
		return this.config.name;
	}

	return this.field_name;
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
 * Get the preferred view file to use for this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.3.0
 */
Field.enforceProperty(function view_file(new_value, old_value) {

	if (!new_value) {

		let view_type = this.view_type,
		    field_view = this.field_view;

		if (!field_view) {
			field_view = this.getFieldType().replaceAll('.', '_');
		}

		new_value = this.generateTemplatePath('inputs', view_type, field_view);
	}

	return new_value;
});

/**
 * Get the preferred wrapper to use for this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.11
 */
Field.enforceProperty(function wrapper_file(new_value, old_value) {

	if (!new_value) {

		let wrapper_type = this.wrapper_type;

		if (wrapper_type === false) {
			return false;
		}

		let wrapper_view = this.wrapper_view || this.getFieldType(),
		     view_type = this.view_type;

		if (wrapper_view) {
			return this.generateTemplatePath('wrappers', view_type, wrapper_view);
		}
	}

	return new_value;
});

/**
 * Get the view files to use for this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.3.0
 */
Field.setProperty(function view_files() {

	let result = [],
	    view_file = this.view_file;

	if (view_file) {
		result.push(view_file);
	}

	let field_type = this.getFieldType(),
	    view_type = this.view_type;

	if (field_type) {
		let view = this.generateTemplatePath('inputs', view_type, field_type);
		
		result.push(view);

		let purpose = this.purpose;

		if (purpose) {	
			view = this.generateTemplatePath('inputs', purpose, field_type);
			result.push(view);
		}
	}

	if (result.length == 0) {
		return false;
	}

	// Fallback to the fallback
	result.push(this.generateTemplatePath('inputs', view_type, 'fallback'));

	// Fallback to a simple string input
	result.push(this.generateTemplatePath('inputs', view_type, 'string'));

	return result;
});

/**
 * Get the wrapper files to use for this field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.11
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

	let field_type = this.getFieldType(),
	    view_type = this.view_type;

	if (field_type) {
		let view = this.generateTemplatePath('wrappers', view_type, field_type);

		result.push(view);

		view = this.generateTemplatePath('wrappers', view_type, 'default');
		result.push(view);

		view = this.generateTemplatePath('wrappers', 'default', field_type);
		result.push(view);

		view = this.generateTemplatePath('wrappers', 'default', 'default');
		result.push(view);
	}

	if (result.length == 0) {
		return false;
	}

	return result;
});

/**
 * Get the original value container
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Field.setAssignedProperty(function original_value_container() {

	if (this.assigned_data.original_value_container != null) {
		return this.assigned_data.original_value_container;
	}

	let form = this.alchemy_form;

	if (form) {
		return form.document;
	}
});

/**
 * Get the original value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.3.0
 */
Field.setProperty(function original_value() {

	if (this.assigned_data.original_value !== undefined) {
		return this.assigned_data.original_value;
	}

	let path = this.field_path_in_current_schema;

	if (path == null) {
		return;
	}

	let alchemy_field_schema = this.alchemy_field_schema;

	if (alchemy_field_schema) {
		let original_schema_value = alchemy_field_schema.original_value;

		if (original_schema_value) {
			if (path) {
				return Object.path(original_schema_value, path);
			}
		}

		return;
	}

	let original_container = this.original_value_container;

	if (original_container) {
		return Object.path(original_container, path);
	}
}, function setOriginalValue(value) {
	return this.assignData('original_value', value);
});

/**
 * Get the main field value element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.3.0
 */
Field.setProperty(function value_element() {

	let special_input;

	// Translations always get preference
	if (this.is_translatable) {
		special_input = this.querySelector('al-field-translatable');
	} else if (this.is_array) {
		special_input = this.querySelector('al-field-array');
	} else if (this.contains_schema) {
		special_input = this.querySelector('al-field-schema');
	}

	let main_input = this.querySelector('.alchemy-field-value');

	// If there is no main input, but there is a special input, simply use that
	if (!main_input) {
		return special_input;
	}

	if (!special_input) {
		return main_input;
	}

	// Use the top level one
	if (special_input.contains(main_input)) {
		return special_input;
	}

	return main_input;
});

/**
 * Get the live value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.3.0
 */
Field.setProperty(function value() {

	let element = this.value_element;

	if (element) {
		let value = element.value;

		if (this.config?.castContainedValues) {
			value = this.config.castContainedValues(value);
		}

		return value;
	}

	return this.value_to_render;

}, function setValue(value) {

	let has_changed = !Object.alike(this[LAST_SET_VALUE], value);

	if (this.original_value === undefined) {
		this.original_value = value;
	}

	this[LAST_SET_VALUE] = value;

	if (!this.valueElementHasValuePropertySetter()) {
		// @TODO: Rerendering during a render causes a deadlock 
		if (has_changed) {
			this.rerender();
		}
	} else {
		let element = this.value_element;

		if (element) {
			element.value = value;
		}
	}
});

/**
 * Get value to use for rendering
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
Field.setProperty(function value_to_render() {
	if (this[LAST_SET_VALUE] != null) {
		return this[LAST_SET_VALUE];
	} else {
		return this.original_value;
	}
});

/**
 * Get the placeholder for empty values (if any)
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Field.setProperty(function allow_empty_value_placeholder() {
	return !!(this.applied_options?.empty_value_placeholder ?? true);
});

/**
 * Set the value container (like the `Document` instance) the value came from.
 * Will only be set if there is no `alchemy_form` available.
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Field.setMethod(function rememberOriginalValueContainer(container) {

	if (!container) {
		return;
	}

	if (this.alchemy_form) {
		return;
	}

	this.original_value_container = container;
});

/**
 * Create the empty value placeholder text
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 *
 * @return   {string|HTMLElement|Microcopy}
 */
Field.setMethod(function createEmptyValuePlaceholderText() {

	let microcopy = this.applied_options?.empty_value_placeholder;

	if (microcopy) {
		return microcopy;
	}

	microcopy = Classes.Alchemy.Microcopy('empty-value-placeholder', {
		field_name : this.field_name,
		model_name : this.model,
		field_type : this.getFieldType(),
		zone       : this.zone,
		path       : this.config?.path_in_document,
	});

	return microcopy;
});

/**
 * Get variables needed to render this
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Field.setMethod(function prepareRenderVariables() {

	let value = this.value_to_render,
	    value_is_empty = value == null || value === '' || (Array.isArray(value) ? value.length == 0 : false);

	let result = {
		alchemy_field  : this,
		field_context  : this,
		view_files     : this.view_files,
		wrapper_files  : this.wrapper_files,
		value,
		value_is_empty,
	};

	return result;
});

/**
 * Apply options
 * (Like options from a FieldConfig instance)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.12
 * @version  0.2.7
 *
 * @param    {Object}   options
 */
Field.setMethod(function applyOptions(options) {

	if (!options || typeof options != 'object') {
		return;
	}

	if (options.purpose) {
		this.purpose = options.purpose;
	}

	if (options.mode) {
		this.mode = options.mode;
	}

	if (options.view) {
		this.field_view = options.view;
	}

	if (options.wrapper) {
		this.wrapper_view = options.wrapper;
	}

	if (options.readonly) {
		this.readonly = true;
	}

	if (options.widget_settings) {
		this.widget_settings = options.widget_settings;
	}

	if (options.data_src) {
		this.data_src = options.data_src;
	}

	if (options.title) {
		this.field_title = options.title;
	}

	this.applied_options = options;
});

/**
 * Get the field type
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.11
 * @version  0.1.11
 *
 * @return   {String}
 */
Field.setMethod(function getFieldType() {

	let result = this.field_type;

	if (!result) {
		let config = this.config;

		if (config) {
			result = config.constructor.type_name;
		}
	}

	return result;
});

/**
 * Generate a template path
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.11
 * @version  0.1.11
 *
 * @param    {String}   container_type   The container (inputs/wrappers)
 * @param    {String}   view_type        The view (edit/view/edit_inline/...)
 * @param    {String}   field_type       The name of the field (and thus the view)
 *
 * @return   {String}
 */
Field.setMethod(function generateTemplatePath(container_type, view_type, field_type) {
	let result = 'form/' + container_type + '/' + view_type + '/' + field_type;
	return result;
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
 * @version  0.2.1
 */
Field.setMethod(function retained() {

	if (!this.id) {
		let id = 'field-';

		if (this.alchemy_form) {
			id += this.alchemy_form.id + '-';
		}

		if (this.field_name) {
			id += this.field_name.slug();
		}

		this.id = id;
	}

	let label = this.querySelector('.form-field-info al-label');

	if (label && this.value_element) {
		let v_id = this.id + '_fv';

		label.setAttribute('for', v_id);
		this.value_element.setAttribute('id', v_id);
	}
});

/**
 * Is this field in the given list somehow?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 *
 * @param    {string[]|Field[]}   list
 *
 * @return   boolean
 */
Field.setMethod(function isInList(list) {

	if (!list?.length) {
		return false;
	}

	for (let entry of list) {

		if (typeof entry == 'string') {
			if (entry == this.field_name) {
				return true;
			}

			continue;
		}

		if (entry == this || entry == this.config) {
			return true;
		}

		// @TODO
	}

	return false;
});

/**
 * The element has been introduced to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
Field.setMethod(function introduced() {

	let dependencies = this.getDependencyFields();

	if (!dependencies.length) {
		return;
	}

	let form = this.alchemy_form;

	if (!form) {
		return;
	}

	form.addEventListener('change', e => {

		let changed_field = e.target.closest('al-field');

		console.log('Field change', changed_field, e, this)

		// Rerender the entire field when a field we depend on changes
		// (@TODO: use something less drastic than a rerender)
		if (changed_field?.field_name && changed_field.isInList(dependencies)) {
			this.handleDependentFieldValueChange(changed_field);
		}
	});
});

/**
 * Refresh the value of this field somehow
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 *
 * @param    {Alchemy.Element.Form.Field}   changed_field
 */
Field.decorateMethod(
	Blast.Decorators.throttle({
		minimum_wait: 150,
		reset_on_call: true,
	}),
	async function handleDependentFieldValueChange(changed_field) {

	const field = this.config;

	// Unset the value
	this.value = null;

	if (field?.is_computed) {
		let doc = this.alchemy_form.getUpdatedDocument();

		if (doc) {
			let value = await doc.recomputeFieldIfNecessary(field, true);
			this.value = value;
		}
	}
});

/**
 * Get any other field names this field depends on
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 *
 * @return   {string[]}
 */
Field.setMethod(function getDependencyFields() {
	return this.config?.dependency_fields || [];
});

/**
 * Load remote data for some fields
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.9
 *
 * @param    {Object}        config
 * @param    {HTMLElement}   element
 */
Field.setMethod(async function loadData(config, element) {

	let field = this.config;

	if (field) {

		let result;

		if (typeof field.loadData == 'function') {

			try {
				result = await field.loadData(config, element);
			} catch (err) {
				// Ignore
				console.error('Error loading field data:', err);
			}

			if (result) {
				return result;
			}
		}

		const field_options = field.options || {},
		      assoc_options = field_options.options;

		let model = field.parent_schema?.model_name,
		    assoc_model = field_options.model_name || field_options.modelName;

		let body = {
			field        : field.name,
			model        : model,
			assoc_model  : assoc_model,
			config       : config,
		};

		if (assoc_options?.constraints) {
			body.constraints = this.resolveConstraintInstruction(assoc_options.constraints);
		}

		let resource_options = {
			name  : 'FormApi#related',
			post  : true,
			body  : body,
		};

		if (this.data_src) {
			resource_options.name = this.data_src;
		}

		return this.hawkejs_helpers.Alchemy.getResource(resource_options);
	}
});

/**
 * Resolve a constraint instruction
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.3.0
 *
 * @param    {Criteria|Object}   constraints
 *
 * @param    {Object}
 */
Field.setMethod(function resolveConstraintInstruction(constraints) {

	let context = {$0: this.alchemy_form.getValueAsDocument()};

	constraints = Classes.Alchemy.Criteria.Criteria.cast(constraints);

	let result = constraints.compileToConditions(context);

	return result;
});

/**
 * Does this field require a re-render when a related field changes?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
Field.setMethod(function requiresRerenderOnRelatedFieldChange() {

	if (!this.valueElementHasValuePropertySetter()) {
		return true;
	}

	return false;
});

/**
 * Can the value element of this field be updated by its value property?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
Field.setMethod(function valueElementHasValuePropertySetter() {

	let element = this.value_element;

	if (!element) {
		return false;
	}

	let descriptor = Object.getPropertyDescriptor(element, 'value');

	if (typeof descriptor?.set == 'function') {
		return true;
	}

	return false;
});

/**
 * Get a certain field option.
 * This might be defined in the Field instance itself, or on this element.
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
Field.setMethod(function getFieldOption(name) {

	if (!name) {
		return;
	}

	let dasherized = name.dasherize();
	let attribute_name = 'data-' + dasherized;

	if (this.hasAttribute(attribute_name)) {
		let result = this.getAttribute(attribute_name);

		if (result) {
			return result;
		}
	}

	let underscored = name.underscore();

	return this.config?.options?.[underscored];
});