/**
 * The al-field-translatable element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
const FieldTranslatable = Function.inherits('Alchemy.Element.Form.FieldCustom', 'FieldTranslatable');

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
 * @since    0.1.0
 * @version  0.2.0
 */
FieldTranslatable.setProperty(function value() {

	let entries = this.queryAllNotNested('al-field-translatable-entry'),
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
 * @since    0.1.0
 * @version  0.2.0
 */
FieldTranslatable.setMethod(function showPrefix(prefix) {

	let buttons = this.queryAllNotNested('.prefix-buttons button'),
	    entries = this.queryAllNotNested('al-field-translatable-entry'),
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
 * Check the translation contents
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.4
 * @version  0.2.4
 */
FieldTranslatable.setMethod(function checkTranslationContents() {

	let field = this.field_context?.config;

	let has_content,
	    buttons = this.querySelectorAll('button[data-has-content][data-prefix]'),
	    button,
	    prefix,
	    values = this.value,
	    value,
	    i;
	
	for (i = 0; i < buttons.length; i++) {
		button = buttons[i];
		prefix = button.dataset.prefix;
		value = values?.[prefix];

		if (field) {
			has_content = field.valueHasContent(value);
		} else {
			has_content = value != null && value !== '';
		}

		if (has_content) {
			button.dataset.hasContent = 'true';
		} else {
			button.dataset.hasContent = 'false';
		}
	}
});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.4
 */
FieldTranslatable.setMethod(function introduced() {

	const that = this,
	      field = this.field_context;

	let doTranslationCheck = Function.throttle(() => {

		if (field?.purpose == 'view') {
			return;
		}

		that.checkTranslationContents();
	}, 500, true, true);

	this.onEventSelector('click', '.prefix-buttons button[data-prefix]', function onClick(e) {

		e.preventDefault();

		let button = this.closest('[data-prefix]');

		if (!button) {
			return;
		}

		that.showPrefix(button.dataset.prefix);
		doTranslationCheck();
	});

	this.addEventListener('change', doTranslationCheck);
	this.addEventListener('keyup', doTranslationCheck);
	this.addEventListener('click', doTranslationCheck);
});