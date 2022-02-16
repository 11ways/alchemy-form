/**
 * The alchemy-field-array-entry element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
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
 * Get a reference to the alchemy-field-array parent
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldArrayEntry.enforceProperty(function alchemy_field_array(new_value, old_value) {

	if (!new_value) {
		new_value = this.queryUp('alchemy-field-array');
	}

	return new_value;
});

/**
 * Get the index of this entry
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
FieldArrayEntry.setProperty(function index() {

	let defined_index = this.getAttribute('index'),
	    index;

	let container = this.alchemy_field_array;

	if (!container || !container.entries_element) {
		if (defined_index) {
			index = +defined_index;
		}
	} else {
		let counter = -1,
		    child;

		for (let i = 0; i < container.entries_element.children.length; i++) {
			child = container.entries_element.children[i];

			if (child.tagName == 'ALCHEMY-FIELD-ARRAY-ENTRY') {
				counter++;
			}

			if (child == this) {
				break;
			}
		}

		index = counter;
	}

	return index;
});

/**
 * Get the original value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldArrayEntry.setProperty(function original_value() {

	let context_value = this.field_context.original_value;

	if (context_value) {
		return context_value[this.index];
	}
});

/**
 * Get the name of this entry for use in a record path
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 *
 * @return   {String}
 */
FieldArrayEntry.setMethod(function getPathEntryName() {
	return '' + this.index;
});