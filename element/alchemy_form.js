/**
 * The alchemy-form element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
var Form = Function.inherits('Alchemy.Element.Form.Base', function Form() {
	Form.super.call(this);
});

/**
 * The attribute to use for the route
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Form.setProperty('url_attribute', 'action');

/**
 * The method to use for submitting the data
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Form.setAttribute('method');

/**
 * The name of the model
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Form.setAttribute('model');

/**
 * The document that is being edited
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Form.setAssignedProperty('document');

/**
 * Get the live value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Form.setProperty(function value() {

	let fields = this.queryAllNotNested('alchemy-field'),
	    result = {},
	    field,
	    key,
	    i;

	if (this.document && this.document.$pk) {
		result[this.document.$model.primary_key] = this.document.$pk;
	}

	for (i = 0; i < fields.length; i++) {
		field = fields[i];

		result[field.field_name] = field.value;
	}

	return result;
});

/**
 * Get the formdata
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @return   {FormData}
 */
Form.setMethod(Hawkejs.GET_FORM_DATA, function getFormData() {
	// We prefer regular json requests for now
	return null;
});

/**
 * Get the serialized form data
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @return   {Object}
 */
Form.setMethod(Hawkejs.SERIALIZE_FORM, function serializeForm() {
	return this.value;
});

/**
 * Submit this form
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Form.setMethod(async function submit() {

	let result;

	try {
		result = await hawkejs.scene.onFormSubmit(this);
	} catch (err) {
		if (err instanceof Classes.Alchemy.Error.Validation) {
			this.showError(err);
		} else {
			console.log('Got submit error:', err);
			throw err;
		}
	}

	console.log('Result?', result);
});

/**
 * Show the given error
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Form.setMethod(function showError(err) {

	console.log('Showing error:', err);

});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Form.setMethod(function introduced() {

	const that = this;

	this.onEventSelector('click', '[type="submit"]', function onSubmit(e) {
		that.emit('submit');
	});

	this.addEventListener('submit', function onSubmit(e) {
		e.preventDefault();
		that.submit();
	});

});