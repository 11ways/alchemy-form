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
 * Get the parent "schema" al-field element.
 * This is NOT the `al-field[field-type="schema"]` element this
 * `al-field-schema` is part of, but the one that is part of!
 *
 * It is possible this does not use the "schema" type in the HTML attribute.
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
FieldSchema.setProperty(function parent_schema_field() {

	// Start looking from the parent element of our own `al-field` element
	let current = this.alchemy_field?.parentElement;

	while (current) {

		if (current.nodeName != 'AL-FIELD') {
			current = current.parentElement;
			continue;
		}

		// If it is using the explicit schema type, return it
		if (current.field_type == 'schema') {
			return current;
		}

		let field = current.config;

		if (field && field instanceof Classes.Alchemy.Field.Schema) {
			return current;
		}
	}

	return false;
});

/**
 * Get the parent schema value this field is part of
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
FieldSchema.setProperty(function parent_schema_value() {

	const field_element = this.alchemy_field;

	if (!field_element) {
		return;
	}

	let parent_schema_value,
	    parent_schema = this.parent_schema_field;

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

	return parent_schema_value;
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
 * Get the actual schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.3.0
 *
 * @return   {Alchemy.Schema|Pledge<Alchemy.Schema>}
 */
FieldSchema.setMethod(function getSchema() {

	const field_element = this.alchemy_field,
	      field = field_element?.config;

	if (!field) {
		return;
	}

	if (Classes.Alchemy.Client.Schema.isSchema(field)) {
		return field;
	}

	if (field?.options) {

		let schema = field.options.schema;

		// If the schema is a string, it's actually a reference to another field
		// that *should* contain the schema.
		if (typeof schema == 'string') {

			let parent_schema_value = this.parent_schema_value;

			let schema_context = new Classes.Alchemy.OperationalContext.Schema();
			schema_context.setHolder(parent_schema_value);
			schema_context.setSchema(field.schema);

			return field.getSubSchema(schema_context);
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
FieldSchema.setMethod(function getSubFields() {

	let schema = this.getSchema();

	if (Pledge.isThenable(schema)) {
		let pledge = new Swift();

		Swift.done(schema, (err, result) => {

			if (err) {
				return pledge.reject(err);
			}

			pledge.resolve(this.getFieldsFromSchema(result));
		});

		return pledge;
	}

	return this.getFieldsFromSchema(schema);
});

/**
 * Get the fields from the given schema 
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.3.0
 */
FieldSchema.setMethod(function getFieldsFromSchema(schema) {

	if (!schema) {
		return [];
	}

	if (typeof schema != 'object') {
		throw new Error('Expected a schema object, but found "' + typeof schema + '" instead');
	}

	// Don't show meta fields by default
	return schema.getSorted().filter(field => !field.is_meta_field);
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
 * Prepare variables
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
FieldSchema.setMethod(function prepareRenderVariables() {

	let schema = this.getSchema();

	if (Pledge.isThenable(schema)) {
		let pledge = new Pledge.Swift();

		Pledge.Swift.done(schema, (err, schema) => {

			if (err) {
				return pledge.reject(err);
			}

			pledge.resolve({
				sub_fields: this.getFieldsFromSchema(schema),
				sub_schema: schema,
			});
		});

		return pledge;
	}

	return {
		sub_fields: this.getFieldsFromSchema(schema),
		sub_schema: schema,
	};
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
		// @TODO: Some fields seem to get added to the DOM for a second
		// before being removed.
		//console.warn('Failed to find supplier field for', this, this.parentElement);
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

	let array_entry = this.queryUp('al-field-array-entry'),
	    original_value_context = field;

	if (array_entry) {
		if (!array_entry.isConnected || (field && field.contains(array_entry))) {
			original_value_context = array_entry;
		}
	}

	// This is needed for SemanticWiki's metadata fields.
	// They use al-field-schema elements, but they refer to the main
	// `al-form` element, and that is not where it can find the original value...
	if (original_value_context && original_value_context.original_value) {
		return original_value_context.original_value;
	}

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
		data = context?.document;
	}

	path = this.field_path_in_current_schema;

	let result = Object.path(data, path);

	return result;
});
