const VALUE = Symbol('value');

/**
 * Abstract element with errors & success elements
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var FeedbackInput = Function.inherits('Alchemy.Element.Form.Base', 'FeedbackInput');

/**
 * Don't register this as a custom element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
FeedbackInput.makeAbstractClass();

/**
 * The readonly attribute
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
FeedbackInput.setAttribute('readonly', {boolean: true});

/**
 * Reference to the errors element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
FeedbackInput.addElementGetter('errors_el', '.errors');

/**
 * Reference to the success element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
FeedbackInput.addElementGetter('success_el', '.success');

/**
 * Reference to the inputbox element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
FeedbackInput.addElementGetter('inputbox_el', '.inputbox');

/**
 * Reference to the input element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
FeedbackInput.addElementGetter('input_el', '.input');

/**
 * The last validated value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
FeedbackInput.setProperty('last_validated_value', null);

/**
 * The validation counter
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
FeedbackInput.setProperty('validation_counter', 0);

/**
 * Was this input valid after the last revalidation?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
FeedbackInput.setProperty(function is_valid() {

	if (this.classList.contains('error')) {
		return false;
	}

	if (this.classList.contains('valid')) {
		return true;
	}

	// Default to true
	return true;
});

/**
 * The value property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FeedbackInput.setProperty(function value() {

	if (this.input_el) {
		return this.input_el.value;
	}

	if (this[VALUE] === undefined) {
		this[VALUE] = this.getAttribute('value');
	}

	return this[VALUE];

}, function setValue(value) {

	var input = this.input_el;

	if (input) {
		if (value == null || value === '') {
			input.value = '';
		} else {
			input.value = value;
		}
	}

	if (Blast.isNode) {
		this.setAttribute('value', value);
	}

	this[VALUE] = value;
});

/**
 * Remove all errors
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
FeedbackInput.setMethod(function removeErrors() {
	this.classList.remove('valid');
	this.classList.remove('error');
	this.inputbox_el.classList.remove('valid');
	this.inputbox_el.classList.remove('error');
	Hawkejs.removeChildren(this.errors_el);
	Hawkejs.removeChildren(this.success_el);
});

/**
 * Get a message stirng or a microcopy object
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.2.0
 *
 * @return   {<micro-copy>|String}
 */
FeedbackInput.setMethod(function convertMessage(message, parameters) {

	if (!message) {
		return '';
	}

	let microcopy;

	if (typeof message == 'string') {
		if (!message.startsWith('microcopy:')) {
			return message;
		}

		microcopy = this.createElement('al-microcopy');
		microcopy.key = message.after('microcopy:');

		if (!parameters) {
			parameters = {};
		}

		microcopy.parameters = parameters;
	} else if (typeof message == 'object')  {

		if (message instanceof Classes.Alchemy.Microcopy) {
			microcopy = message.toElement();
		} else {
			microcopy = message;
		}

		if (parameters) {
			microcopy.parameters = parameters;
		} else {
			parameters = microcopy.parameters;
		}

		if (!parameters) {
			microcopy.parameters = parameters = {};
		}
	}

	if (!parameters.field) {
		parameters.field = this.getAttribute('input-name');
	}

	let friendly = this.dataset.friendly;

	if (!friendly) {
		let label = this.querySelector('[slot="label"]');

		if (label) {
			friendly = label.textContent;
		}
	}
	
	if (friendly) {
		parameters.field = friendly;
	}

	return microcopy;
});

/**
 * Add an error
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
FeedbackInput.setMethod(function addError(message, parameters, clear_first, add_friendly) {

	var p = this.createElement('p'),
	    i = this.createElement('i'),
	    span = this.createElement('span'),
	    friendly = this.dataset.friendly,
	    strong = this.createElement('strong');

	if (typeof parameters == 'boolean') {
		add_friendly = clear_first;
		clear_first = parameters;
		parameters = null;
	}

	if (clear_first) {
		this.removeErrors();
	}

	p.classList.add('errorlabel');
	i.classList.add('erroricon');
	span.classList.add('text');

	p.append(i);
	p.append(span);

	// Try getting a microcopy
	message = this.convertMessage(message, parameters);

	strong.append(message);
	span.append(strong);

	this.errors_el.append(p);

	if (this.external_element) {
		this.external_element.disabled = true;
	}

	if (this.show_element) {
		this.show_element.hidden = true;
	}

	this.classList.add('error');
	this.inputbox_el.classList.add('error');

	if (this.activate_el) {
		this.activate_el.classList.remove(this.activate_class);
	}
});

/**
 * Add a success message
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
FeedbackInput.setMethod(function addSuccess(message, parameters, clear_first, add_friendly) {

	var p = this.createElement('p');

	message = this.convertMessage(message, parameters);

	p.classList.add('successlabel');
	p.append(message);

	this.success_el.append(p);

	this.classList.add('valid');
	this.inputbox_el.classList.add('valid');

	if (this.activate_el) {
		this.activate_el.classList.add(this.activate_class);
	}
});