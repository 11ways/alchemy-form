/**
 * The al-field-schema element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var FieldSchema = Function.inherits('Alchemy.Element.Form.FieldCustom', 'FieldSchema');

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
 * @version  0.3.0
 */
FieldSchema.setProperty(function schema() {

	const field_element = this.alchemy_field;
	const field = field_element?.config;

	if (field?.options) {

		let schema = field.options.schema;

		// If the schema is a string, it's actually a reference to another field
		// that *should* contain the schema.
		if (typeof schema == 'string') {

			let parent_schema_value;

			let parent_schema = field_element.queryParents('al-field[field-type="schema"]');

			if (parent_schema) {
				parent_schema_value = parent_schema.value;
			} else {

				const form = field_element.alchemy_form;

				if (form) {
					let record_value = form.getMainValue();
					parent_schema_value = record_value;
				} else {
					parent_schema_value = field_element.original_value_container;
				}
			}

			// If this field is inside an array, get the index
			let array_entry_element = field_element.queryParents('al-field-array-entry');
			if (array_entry_element) {
				let index = array_entry_element.index;

				// If it has an index, get the value at that index
				if (index != null && Array.isArray(parent_schema_value)) {
					parent_schema_value = parent_schema_value[index];
				}
			}

			return field.getSubschema(parent_schema_value, schema)
		}

		return schema;
	}
});

/**
 * Get the actual subschema fields
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.3.0
 */
FieldSchema.setProperty(function sub_fields() {

	let schema = this.schema,
	    result;

	if (schema) {

		if (typeof schema != 'object') {
			throw new Error('Expected a schema object, but found "' + typeof schema + '" instead');
		}

		if (schema) {
			// Don't show meta fields by default
			result = schema.getSorted().filter(field => !field.is_meta_field);
		}
	}

	return result || [];
});

/**
 * Get the live value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
FieldSchema.setProperty(function value() {

	let entries = this.queryAllNotNested('al-field'),
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

/**
 * Get the optional field that is supplying the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.3.0
 */
FieldSchema.setMethod(function getSchemaSupplierField() {

	if (!this.alchemy_field || !this.alchemy_field.config || !this.alchemy_field.config.options) {
		return;
	}

	let schema = this.alchemy_field.config.options.schema;

	if (typeof schema == 'string') {
		let other_field_path = this.resolvePathToArray(schema),
		    schema_path;

		if (schema.includes('.')) {
			schema_path = other_field_path.pop();
		}

		schema = null;
	
		let form = this.alchemy_field.alchemy_form;

		if (form) {
			return form.findFieldByPath(other_field_path);
		}
	}
});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
FieldSchema.setMethod(function introduced() {

	let supplier_field = this.getSchemaSupplierField();

	if (supplier_field) {
		supplier_field.addEventListener('change', e => {
			this.rerender();
		});

		this.rerender();
	} else {
		console.warn('Failed to find supplier field for', this);
	}
});

/**
 * Get the original value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.4
 * @version  0.3.0
 */
FieldSchema.setProperty(function original_value() {

	let field = this.alchemy_field,
	    path = this.field_path_in_record;

	if (field && path) {
		let form = field.alchemy_form || this.alchemy_form || this.field_context.alchemy_form,
		    value_container;

		if (form) {
			value_container = form.document;
		} else {
			value_container = field.original_value_container;
		}

		if (value_container) {
			return Object.path(value_container, path);
		}
	}

	let context = this.field_context.alchemy_field_schema,
	    data;

	if (context) {
		data = context.original_value;
	} else {
		context = this.field_context.alchemy_form || this.alchemy_field.alchemy_form;
		data = context.document;
	}

	path = this.field_path_in_current_schema;

	let result = Object.path(data, path);

	return result;
});
