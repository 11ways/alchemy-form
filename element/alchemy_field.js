/**
 * The alchemy field element
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var AlField = Function.inherits('Alchemy.Element.AlFormBase', function AlchemyField() {
	return AlchemyField.super.call(this);
});

AlField.setAssignedProperty('al_validation');

/**
 * A reference to the view
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlField.setProperty(function view() {
	if (this.form) {
		return this.form.view;
	}
});

/**
 * A place to put the entires
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlField.setProperty(function entries_element() {

	if (this._entries_element) {
		return this._entries_element;
	}

	if (Blast.isNode) {
		return null;
	}

	this._entries_element = this.querySelector('.field-entries');
	return this._entries_element;
});

/**
 * The actual field configuration
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlField.setAssignedProperty('field_config');

/**
 * The entries
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlField.setAssignedProperty('field_entries');

/**
 * A reference to the document
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlField.setProperty(function document() {
	return this.form.document;
});

/**
 * The path of this field
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlField.setProperty(function path() {
	return this.field_config.name;
});

/**
 * The original value of this field
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlField.setProperty(function original_value() {

	if (!this.options || !this.options.name || !this.form || !this.form.document) {
		return;
	}

	return this.form.document[this.options.name];
});

/**
 * Create an input
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   options
 * @param    {Number}   index
 *
 * @return   {HTMLElement}
 */
AlField.setMethod(function input(options, index) {

	var original_value,
	    tag_name,
	    element;

	// Get the normalized options
	options = this.form.normalizeInputOptions(options);

	if (options.register_input == null) {
		options.register_input = false;
	}

	// Get the name of the element to create
	tag_name = this.form.getInputTagName(options);

	// Create the element
	element = this.view.create_element(tag_name);

	// Set the form
	element.form = this.form;

	// Set the field
	element.field = this;

	// Set the options
	element.options = options;

	// Set the original value
	if (options.name && this.document && typeof this.document[options.name] != 'undefined') {
		original_value = this.document[options.name];

		if (this.field_config.array) {
			index = index || 0;

			if (Array.isArray(original_value)) {
				element.original_value = original_value[index];
			}
		} else {
			element.original_value = original_value;
		}

		element.value = element.original_value;
	}

	return element;
});

/**
 * Apply the field config
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlField.setMethod(function setFieldConfig(field_config, options) {

	var default_options = {},
	    type;

	this.field_config = Object.assign({}, field_config);

	// Clear out any children
	this.childNodes.length = 0;

	if (field_config.type == 'HasAndBelongsToMany') {
		type = 'select';
		default_options.multiple = true;
	} else if (field_config.type == 'BelongsTo') {
		type = 'select';
	} else {
		type = field_config.type_name;
	}

	default_options.name = field_config.name;
	default_options.type = type;

	options = Object.assign(default_options, options);
	this.options = options;

	if (options.hidden === true) {
		this.setAttribute('hidden', 'hidden');
	} else if (options.hidden === false) {
		this.removeAttribute('hidden');
	}
});

/**
 * Add a field entry
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlField.setMethod(function addFieldEntry(index) {

	var entry;

	if (!this.field_entries) {
		this.field_entries = [];
	}

	if (index == null) {
		// The index this field will get
		index = this.field_entries.length;
	}

	// Create a new entry
	entry = this.view.create_element('alchemy-field-entry');

	// Set the index
	entry.index = index;

	// Create a link to this field
	entry.field = this;

	// Append it as a childnode
	this.field_entries.push(entry);

	if (this.entries_element) {
		this.entries_element.appendChild(entry);
	}

	return entry;
});

/**
 * Get the viewname
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlField.setMethod(function getViewName() {

	if (this.options) {
		if (this.options.type) {
			return 'form/' + this.options.type;
		}
	}

	return 'form/default_edit';
});

/**
 * Get the value of this field
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlField.setMethod(function getData() {

	var is_array = this.field_config.array,
	    result,
	    entry,
	    i;

	if (is_array) {
		result = [];

		for (i = 0; i < this.field_entries.length; i++) {
			result[i] = this.field_entries[i].getData();
		}
	} else if (this.field_entries && this.field_entries.length) {
		result = this.field_entries[0].getData();
	}

	return result;
});

/**
 * Validate this field
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlField.setMethod(function validate() {

	var is_array = this.field_config.array,
	    result,
	    entry,
	    i;

	if (is_array) {
		console.log('@TODO: implement validating array fields');
		result = [];

		for (i = 0; i < this.field_entries.length; i++) {
			result[i] = this.field_entries[i].validate();
		}
	} else if (this.field_entries && this.field_entries.length) {
		result = this.field_entries[0].validate();
	}

	return result;
});

/**
 * The element has been introduced to the dom
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlField.setMethod(function introduced() {

	var that = this,
	    add_entry;

	if (!this.innerHTML) {
		this.getContent();
	}

	add_entry = this.querySelector('.add-field-entry');

	if (add_entry) {
		add_entry.addEventListener('click', function onClick(e) {
			e.preventDefault();
			that.addFieldEntry();
		});
	}

});

/**
 * Get the content for hawkejs
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlField.setMethod(function makeContent(callback) {

	var that = this,
	    tasks = [],
	    placeholder,
	    variables,
	    view_name,
	    options,
	    i;

	view_name = 'form/field_wrappers/default_edit';

	variables = {
		form  : this.form,
		field : this
	};

	options = {
		wrap : this
	};

	placeholder = this.view.print_element(view_name, variables, options);

	placeholder.getContent(function gotResult(err, html) {

		if (err) {
			return callback(err);
		}

		that.innerHTML = html;
		callback(null);
	});
});