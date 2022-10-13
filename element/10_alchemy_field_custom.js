/**
 * The basis for alchemy-field-array and such element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
const FieldCustom = Function.inherits('Alchemy.Element.Form.Base', 'FieldCustom');

/**
 * Don't register this as a custom element,
 * but don't let child classes inherit this
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
FieldCustom.makeAbstractClass();

/**
 * Get a reference to the al-field parent
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
FieldCustom.enforceProperty(function alchemy_field(new_value, old_value) {

	if (!new_value) {
		new_value = this.queryUp('al-field');
	}

	return new_value;
});

/**
 * Get a reference to the al-field or al-field-translatable parent
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
FieldCustom.enforceProperty(function field_context(new_value, old_value) {

	if (!new_value) {
		let translatable = this.queryUp('al-field-translatable-entry'),
		    field = this.queryUp('al-field');

		if (translatable && translatable != this && field.contains(translatable)) {
			new_value = translatable;
		} else {
			new_value = field;
		}
	}

	if (!new_value) {
		new_value = this.alchemy_field;
	}

	return new_value;
});

/**
 * Is this field an array?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
FieldCustom.setProperty(function is_array() {

	let field = this.queryUp('al-field');

	if (field) {
		return field.is_array;
	}

	return false;
});

/**
 * Get the entries field
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldCustom.setProperty(function entries_element() {
	return this.querySelector('.entries');
});

/**
 * Get the original value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldCustom.setProperty(function original_value() {
	return this.field_context.original_value;
});
