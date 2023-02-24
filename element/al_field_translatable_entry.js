/**
 * The al-field-translatable-entry element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
const FieldTranslatableEntry = Function.inherits('Alchemy.Element.Form.FieldEntry', 'FieldTranslatableEntry');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldTranslatableEntry.setTemplateFile('form/elements/alchemy_field_translatable_entry');

/**
 * The prefix of this translation
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldTranslatableEntry.setAttribute('prefix');

/**
 * Does this translation entry have a valid value?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.4
 * @version  0.2.4
 */
FieldTranslatableEntry.setProperty(function has_content() {

	let field_translatable_el = this.field_context,
	    field_el = field_translatable_el.field_context,
	    field = field_el.config;

	field.valueHasContent(this.value);
});

/**
 * Get the original value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldTranslatableEntry.setProperty(function original_value() {

	let field_translatable_el = this.field_context;

	let context_value = field_translatable_el.original_value;

	if (context_value) {
		return context_value[this.prefix];
	}
});
