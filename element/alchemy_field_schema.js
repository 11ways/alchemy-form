/**
 * The alchemy-field-schema element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var FieldSchema = Function.inherits('Alchemy.Element.Form.FieldCustom', function FieldSchema() {
	FieldSchema.super.call(this);
});

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldSchema.setTemplateFile('form/elements/alchemy_field_schema');

/**
 * Get the actual schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldSchema.setProperty(function schema() {

	if (this.alchemy_field && this.alchemy_field.config.options) {
		return this.alchemy_field.config.options.schema;
	}
});

/**
 * Get the actual subschema fields
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldSchema.setProperty(function sub_fields() {

	if (this.schema) {
		return this.schema.getSorted();
	}

	return [];
});

/**
 * Get the live value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldSchema.setProperty(function value() {

	let entries = this.queryAllNotNested('alchemy-field'),
	    result = {},
	    entry,
	    i;

	for (i = 0; i < entries.length; i++) {
		entry = entries[i];
		result[entry.field_name] = entry.value;
	}

	return result;

}, function setValue(value) {
	throw new Error('Unable to set value of schema field');
});

return;






/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldArray.setMethod(function introduced() {

	const that = this;

	this.onEventSelector('click', '.remove', function onClick(e) {

		e.preventDefault();

		let entry = e.target.queryUp('alchemy-field-array-entry');

		entry.remove();
	});

	let add_entry = this.querySelector('.add-entry');

	if (add_entry) {
		add_entry.addEventListener('click', function onClick(e) {

			let field_context = that.field_context,
			    alchemy_field = that.alchemy_field;

			e.preventDefault();

			let view_files = alchemy_field.view_files;

			if (!view_files || !view_files.length) {
				throw new Error('Unable to add new entry for ' + alchemy_field.field_title);
			}

			let new_entry = that.createElement('alchemy-field-array-entry');

			new_entry.alchemy_field_array = that;

			that.entries_element.append(new_entry);
		});
	}

});

