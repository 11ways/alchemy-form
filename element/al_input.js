/**
 * The base alchemy-input element
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var AlInput = Function.inherits('Alchemy.Element.AlFormBase', function AlInput() {
	AlInput.super.call(this);
});

/**
 * The original value of this field
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInput.setAssignedProperty('original_value');
AlInput.setAssignedProperty('value');
AlInput.setAssignedProperty('al_validation');

/**
 * The path of this field
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInput.setProperty(function path() {
	return this.options.name;
});

/**
 * The action of this field
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInput.setProperty(function action() {
	return this.options.action || 'edit';
});

/**
 * The model field, if any
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInput.setProperty(function model_field() {

	var result;

	if (!this.form || !this.options.name) {
		return null;
	}

	result = this.form.getModelField(this.options.name);

	return result;
});

/**
 * Set an error message
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String|Object}   message
 */
AlInput.setMethod(function setError(message) {

	if (!this.al_validation) {
		throw new Error('Unable to find linked validation element');
	}

	this.al_validation.setError(message);
});

/**
 * Get the viewname
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInput.setMethod(function getViewName() {

	var result = [],
	    path = 'form/inputs/';

	if (this.options && this.options.type) {
		path += this.options.type;
	} else {
		path += 'default';
	}

	path += '_' + this.action;

	result = [
		path,
		'form/inputs/default_' + this.action
	];

	return result;
});

/**
 * Get the value
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInput.setMethod(function getData() {
	return this.value;
});

/**
 * Validate this value
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInput.setMethod(function validate() {

	if (!this.field_config) {
		return true;
	}

	let data = this.getData();

	if (this.field_config.required && (!data && data !== 0 && data !== false)) {
		return false;
	}

	return true;
});

/**
 * Wait for the given element
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInput.setMethod(function delayGetContentFor(element) {

	if (!this.delay_for_elements) {
		this.delay_for_elements = [];
	}

	this.delay_for_elements.push(element);
});

/**
 * Make hawkejs wait for this element
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInput.setMethod(function whenFinishedOrTimeout(callback) {

	var that = this,
	    id;

	callback = Function.regulate(callback);

	// If there is a pledge available, wait for that
	if (this.get_content_pledge) {
		return this.get_content_pledge.handleCallback(callback);
	}

	if (!this.waiting_for_pledge) {
		this.waiting_for_pledge = [];
	}

	this.waiting_for_pledge.push(callback);

	// Timeout after 5s
	id = setTimeout(function onTimeout() {

		if (callback.call_count === 0) {
			console.error(that.constructor.namespace + '.' + that.constructor.name, '#' + that.hawkejs_id, 'timed out after 5 seconds!');
		}

		callback();
	}, 5000);
});

/**
 * This element has been inserted in the DOM
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInput.setMethod(function introduced() {

	var that = this;

	if (!this.innerHTML) {
		this.getContent();
	}

	// Event listener for basic input fields (like textinput)
	this.addEventListener('change', function onChange(e) {

		var property_name = e.target.dataset.valueProperty || 'value';

		that.value = e.target[property_name];
	});
});

/**
 * Make the content, should only be called by getContent
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInput.setMethod(function makeContent(callback) {

	var that = this,
	    placeholder,
	    variables,
	    view_name,
	    options;

	options = {
		wrap  : this,
		print : false
	};

	variables = {
		al_input : this,
		field    : this.field,
		options  : this.options,
		value    : this.original_value,
		form_id  : this.form.options.id,
		path     : this.path
	};

	view_name = this.getViewName();

	placeholder = this.view.print_element(view_name, variables, options);

	placeholder.getContent(function gotResult(err, html) {

		if (err) {
			return callback(err);
		}

		that.innerHTML = html;
		callback(null);
	});
});