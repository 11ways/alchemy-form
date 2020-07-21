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

/**
 * Show the wanted prefix
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
FieldTranslatable.setMethod(function showPrefix(prefix) {

	let buttons = this.queryAllNotNested('.prefix-buttons button'),
	    entries = this.queryAllNotNested('alchemy-field-translatable-entry'),
	    element,
	    i;

	for (i = 0; i < buttons.length; i++) {
		element = buttons[i];

		if (element.dataset.prefix == prefix) {
			element.classList.add('active');
		} else {
			element.classList.remove('active');
		}
	}

	for (i = 0; i < entries.length; i++) {
		element = entries[i];

		if (element.prefix == prefix) {
			element.hidden = false;
		} else {
			element.hidden = true;
		}
	}

});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
FieldTranslatable.setMethod(function introduced() {

	const that = this;

	this.onEventSelector('click', '.prefix-buttons button[data-prefix]', function onClick(e) {
		e.preventDefault();
		console.log('Clicked', this.dataset.prefix, this)
		that.showPrefix(this.dataset.prefix);
	});

});