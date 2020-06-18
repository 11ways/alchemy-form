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

	for (i = 0; i < fields.length; i++) {
		field = fields[i];

		result[field.field_name] = field.value;
	}

	return result;
});
