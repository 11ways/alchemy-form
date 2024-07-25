/**
 * The al-field-array element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
const FieldArray = Function.inherits('Alchemy.Element.Form.FieldCustom', 'FieldArray');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
FieldArray.setTemplateFile('form/elements/alchemy_field_array');

/**
 * Minimum amount of values (in case of an array)
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
FieldArray.setAttribute('min-entry-count', {type: 'number'});

/**
 * Maximum amount of values (in case of an array)
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
FieldArray.setAttribute('max-entry-count', {type: 'number'});

/**
 * Get the live value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
FieldArray.setProperty(function value() {

	let entries = this.queryAllNotNested('al-field-array-entry'),
	    result = [],
	    entry,
	    i;

	for (i = 0; i < entries.length; i++) {
		entry = entries[i];
		result.push(entry.value);
	}

	return result;

}, function setValue(value) {

	throw new Error('Unable to set value of translatable field');
});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
FieldArray.setMethod(function introduced() {

	const that = this;

	if (this.max_entry_count === 1) {
		return;
	}

	this.onEventSelector('click', '.remove', function onClick(e) {

		e.preventDefault();

		let entry = e.target.queryUp('al-field-array-entry');

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
				throw new Error('Unable to add new entry for field "' + alchemy_field.field_title + '", no view files found');
			}

			let new_entry = that.createElement('al-field-array-entry');

			new_entry.alchemy_field_array = that;

			that.entries_element.append(new_entry);
		});
	}

});

