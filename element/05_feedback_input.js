const VALUE = Symbol('value');

/**
 * Abstract element with errors & success elements
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var FeedbackInput = Function.inherits('Alchemy.Element.Form', function FeedbackInput() {
	FeedbackInput.super.call(this);
});

/**
 * Don't register this as a custom element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FeedbackInput.setStatic('is_abstract_class', true, false);

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
