var VALUE = Symbol('value');

/**
 * The alchemy-field-entry element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var FieldEntry = Function.inherits('Alchemy.Element.Form.FieldCustom', function FieldEntry() {
	FieldEntry.super.call(this);
});

/**
 * Don't register this as a custom element,
 * but don't let child classes inherit this
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldEntry.setStatic('is_abstract_class', true, false);

/**
 * Get the live value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldEntry.setProperty(function value() {

	let element = this.value_element;

	if (element) {
		return element.value;
	} else {
		return this[VALUE];
	}

}, function setValue(value) {

	let element = this.value_element;

	if (element) {
		element.value = value;
	} else {
		this[VALUE] = value;
	}

});

/**
 * Get the main field value element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldEntry.setProperty(function value_element() {

	let input;

	if (this.is_array && this.tagName != 'ALCHEMY-FIELD-ARRAY' && this.tagName != 'ALCHEMY-FIELD-ARRAY-ENTRY') {
		input = this.querySelector('alchemy-field-array');
	} else {
		input = this.querySelector('alchemy-field-schema, .alchemy-field-value');
	}

	return input;
});
