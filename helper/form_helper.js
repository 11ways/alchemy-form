/**
 * Create a new form record
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   options   Options passed to the Form object
 */
Blast.Classes.Alchemy.Helper.Alchemy.setMethod(function createForm(options) {
	return new Form(this.view, options);
});

/**
 * The FormRecord class
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {ViewRender}   view
 * @param    {Object}       options
 */
var Form = Function.inherits('Informer', function FormRecord(view, options) {

	var model_name;

	// Create reference to the view render
	this.view = view;

	if (typeof options == 'string') {
		model_name = options;
		options = {};
	}

	// Store the options
	this.options = options || {};

	// The inputs
	this.inputs = [];

	if (model_name) {
		this.setDocument(model_name);
	}
});

/**
 * Default input options
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Object}
 */
Form.setProperty('default_input_options', {
	
});

/**
 * Reference to the view
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Object}
 */
Form.setProperty(function view() {

	if (this._view) {
		return this._view;
	}

	if (Blast.isBrowser) {
		return hawkejs.scene.generalView;
	}
}, function setView(view) {
	return this._view = view;
});

/**
 * Set the URL to use
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {String}
 */
Form.setProperty(function url() {
	return this.options.url;
}, function set_url(url) {
	this.options.url = url;
	return url;
});

/**
 * Revive this object
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    1.1.0
 * @version  1.1.0
 */
Form.setStatic(function unDry(obj, force) {

	var result = new this(null, obj.options);

	result.inputs = obj.inputs || [];
	result.document = obj.document;

	return result;
});

/**
 * Dry this object
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    1.1.0
 * @version  1.1.0
 */
Form.setMethod(function toDry() {
	return {
		value: {
			options   : this.options,
			inputs    : this.inputs,
			document  : this.document
		}
	};
});

/**
 * Return the open tag
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Form.setMethod(function openTag(options) {

	var that = this,
	    id,
	    element;

	if (!options) {
		options = {};
	}

	element = this.view.createElement('form', options);

	if (this.options.id) {
		id = this.options.id;
	}

	if (options.id) {
		id = options.id;
	}

	if (!id) {
		id = this.view.getId('form');
	}

	this.options.id = id;

	return this.view.placeholder(function formResolver(callback) {

		var html;

		html = '<form id="' + that.options.id + '">';

		if (!that._closed) {
			html += '</form>';
		}

		callback(null, html);
	});
});

/**
 * Return the close tag tag
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Form.setMethod(function closeTag() {
	this._closed = true;
	return '</form>';
});

/**
 * Set the Alchemy route to use
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   name
 * @param    {Object}   parameters
 * @param    {Object}   options
 */
Form.setMethod(function setRoute(name, parameters, options) {
	var url = this.view.helpers.Router.routeUrl(name, parameters, options);

	this.url = String(url);
	return this.url;
});

/**
 * The FormRecord class
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Document}   document
 */
Form.setMethod(function setDocument(document) {

	// If document is a string, it's the name of a model
	if (typeof document == 'string') {
		let constructor = Blast.Classes.Alchemy.Client.Document[document];

		if (!constructor) {
			throw new Error('Invalid model name given: "' + document + '"');
		}

		document = new constructor();
	}

	this.document = document;
});

/**
 * Actually submit the form
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Form.setMethod(function submit(callback) {

	var options,
	    data,
	    url;

	if (!callback) {
		callback = Function.thrower;
	}

	// If no url is given, use the current url
	if (this.url) {
		url = this.url;
	} else {
		url = String(window.location);
	}

	// Data to eventually send to the server
	data = {};

	// Store the form data under the record name
	data[this.document.$model.name] = this.getData();

	console.log('Form data:', data);

	// Construct the options object
	options = {};
	options[this.method || 'post'] = {data: data};

	console.log('Opening url', url, 'with options', options);

	hawkejs.scene.openUrl(url, options, function done(err, result) {

		if (err) {
			return callback(err);
		}

		callback(null, result);
	});
});

/**
 * Get the input tag name
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   options
 *
 * @return   {String}
 */
Form.setMethod(function getInputTagName(options) {

	var input_class,
	    tag_name;

	if (!options) {
		options = {};
	}

	if (!options.element) {

		if (options.type) {
			input_class = 'AlInput' + options.type.classify();

			if (typeof Blast.Classes.Alchemy.Element[input_class] != 'undefined') {
				tag_name = 'al-input-' + options.type;
			}
		}

		if (!tag_name) {
			tag_name = 'al-input';
		}
	}

	return tag_name;
});

/**
 * Normalize input options
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   custom_options
 *
 * @return   {Object}
 */
Form.setMethod(function normalizeInputOptions(custom_options) {

	var options;

	// Apply default options
	options = Object.assign({}, this.default_input_options, custom_options);

	// Give it the form id
	options.form_id = this.options.id;

	return options;
});

/**
 * Print an input
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   options
 */
Form.setMethod(function input(options) {

	var that = this,
	    tag_name,
	    element,
	    value;

	// Apply default options
	options = this.normalizeInputOptions(options);

	// Get the tag name to use
	tag_name = this.getInputTagName(options);

	// Create the element
	element = this.view.create_element(tag_name);

	// Set the form
	element.form = this;

	// Set the options
	element.options = options;

	if (options.value != null) {
		value = options.value;
	} else if (options.name && this.document && typeof this.document[options.name] != 'undefined') {
		value = this.document[options.name];
	}

	// Set the original value
	if (value != null) {
		element.original_value = value;
		element.value = value;
	}

	if (options.register_input !== false) {
		this.inputs.push(element);
	}

	return element;
});

/**
 * Print a field
 * (this can contain multiple inputs)
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   name
 * @param    {Object}   options
 */
Form.setMethod(function field(name, options) {

	var element,
	    config;

	if (typeof name == 'object') {
		options = name;
		name = options.name;
	}

	// Get the field configuration
	config = this.getModelField(name);

	// Create the field element
	element = this.view.create_element('alchemy-field');

	// Set the field name
	element.setAttribute('data-field-name', name);

	// Set the form
	element.form = this;

	// Set the field configuration data & options
	element.setFieldConfig(config, options);

	// Add it as an input
	this.inputs.push(element);

	return element;
});

/**
 * Get the data
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Boolean}  changes_only
 *
 * @return   {Object}
 */
Form.setMethod(function getData(changes_only) {

	var that = this,
	    result = {};

	this.inputs.forEach(function eachInput(input) {

		var value;

		if (!input.path) {
			return;
		}

		value = input.getData();

		if (changes_only && Object.alike(value, input.originalValue)) {
			// If the field is an array, we will have to return everything
			// otherwise things can get screwed up
			if (!that.isArray) {
				return;
			}
		}

		Object.setPath(result, input.path, value);
	});

	return result;
});

/**
 * Get a certain model instance
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}    name     The name of the model
 *
 * @return   {Model}
 */
Form.setMethod(function getModel(name) {

	var ModelClass = Hawkejs.Model.getClass(name),
	    instance;

	// Create a new instance of the model
	instance = new ModelClass();

	// Attach the view
	instance.hawkejs_view = this.view;

	return instance;
});

/**
 * Get a field instance from the current record's model
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}    name     The name of the field
 *
 * @return   {Field}
 */
Form.setMethod(function getModelField(name) {

	var result;

	if (!name) {
		throw new Error('No field name given');
	}

	if (!this.document || !this.document.$model) {
		throw new Error('Unable to get field "' + name + '", form has no document');
	}

	result = this.document.$model.getField(name);

	if (!result) {
		throw new Error('Unable to find field "' + name + '" in "' + this.document.$model.name + '" model');
	}

	return result;
});