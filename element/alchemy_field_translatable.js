/**
 * The alchemy-field-translatable element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
var FieldTranslatable = Function.inherits('Alchemy.Element.Form.FieldCustom', function FieldTranslatable() {
	FieldTranslatable.super.call(this);
});

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldTranslatable.setTemplateFile('form/elements/alchemy_field_translatable');

/**
 * Get the live value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
FieldTranslatable.setProperty(function value() {

	let entries = this.queryAllNotNested('alchemy-field-translatable-entry'),
	    result = {},
	    entry,
	    i;

	for (i = 0; i < entries.length; i++) {
		entry = entries[i];
		result[entry.prefix] = entry.value;
	}

	return result;

}, function setValue(value) {

	throw new Error('Unable to set value of translatable field');
});
