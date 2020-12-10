/**
 * The alchemy-field-array element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var FieldCustom = Function.inherits('Alchemy.Element.Form.Base', function FieldCustom() {
	FieldCustom.super.call(this);
});

/**
 * Don't register this as a custom element,
 * but don't let child classes inherit this
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldCustom.setStatic('is_abstract_class', true, false);

/**
 * Get a reference to the alchemy-field parent
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldCustom.enforceProperty(function alchemy_field(new_value, old_value) {

	if (!new_value) {
		new_value = this.queryUp('alchemy-field');
	}

	return new_value;
});

/**
 * Get a reference to the alchemy-field or alchemy-field-translatable parent
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldCustom.enforceProperty(function field_context(new_value, old_value) {

	if (!new_value) {
		let translatable = this.queryUp('alchemy-field-translatable-entry'),
		    field = this.queryUp('alchemy-field');

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
