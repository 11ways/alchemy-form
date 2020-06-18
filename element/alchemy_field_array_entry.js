/**
 * The alchemy-field-array-entry element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
var FieldArrayEntry = Function.inherits('Alchemy.Element.Form.FieldEntry', function FieldArrayEntry() {
	FieldArrayEntry.super.call(this);
});

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldArrayEntry.setTemplateFile('form/elements/alchemy_field_array_entry');

/**
 * The prefix of this translation
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
FieldArrayEntry.setAttribute('index');

/**
 * Get a reference to the alchemy-field-array parent
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
FieldArrayEntry.enforceProperty(function alchemy_field_array(new_value, old_value) {

	if (!new_value) {
		new_value = this.queryUp('alchemy-field-array');
	}

	return new_value;
});

/**
 * Get the original value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
FieldArrayEntry.setProperty(function original_value() {

	let context_value = this.field_context.original_value;

	if (context_value) {
		return context_value[this.index];
	}
});
