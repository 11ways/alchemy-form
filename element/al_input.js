/**
 * The base alchemy-input element
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var AlInput = Function.inherits('Alchemy.Element', function AlInput() {
	AlInput.super.call(this);
});

/**
 * The options property (will be stored in assigned_data)
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInput.setAssignedProperty('options', function get_options(options) {

	// Make sure "options" is an object
	if (!options) {
		options = {};
		this.assigned_data.options = options;
	}

	return options;
});

/**
 * The form it belongs to
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInput.setAssignedProperty('form');

/**
 * The optional field this input belongs to
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInput.setAssignedProperty('field');

/**
 * The original value of this field
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInput.setAssignedProperty('original_value');
AlInput.setAssignedProperty('value');

/**
 * The view
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInput.setProperty(function view() {
	return this.form.view || hawkejs.scene.generalView;
});

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
 * Get the content for hawkejs
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInput.setMethod(function getContent(callback) {

	var that = this;

	if (!callback) {
		callback = Function.thrower;
	}

	if (!this.get_content_pledge) {
		this.get_content_pledge = new Blast.Classes.Pledge();
	}

	this.makeContent(function madeContent(err) {

		if (err) {
			callback(err);
			that.get_content_pledge.reject(err);
			return;
		}

		callback(null);
		that.get_content_pledge.resolve();
	});

	if (this.waiting_for_pledge) {
		while (this.waiting_for_pledge.length) {
			this.get_content_pledge.handleCallback(this.waiting_for_pledge.pop());
		}
	}
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
	    options;

	options = {
		wrap  : this,
		print : false
	};

	variables = {
		options : this.options,
		value   : this.original_value,
		form_id : this.form.options.id,
		path    : this.path
	};

	placeholder = this.view.print_element(this.getViewName(), variables, options);

	placeholder.getContent(function gotResult(err, html) {

		if (err) {
			return callback(err);
		}

		that.innerHTML = html;
		callback(null);
	});
});