/**
 * The number-input custom element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.9
 * @version  0.1.9
 */
const PasswordInput = Function.inherits('Alchemy.Element.Form.StringInput', 'PasswordInput');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.9
 * @version  0.1.9
 */
PasswordInput.setTemplateFile('form/elements/password_input');

/**
 * Reference to the repeat input element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.9
 * @version  0.1.9
 */
PasswordInput.addElementGetter('repeat_el', '.repeat-input');

/**
 * Reference to the repeat label element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.9
 * @version  0.1.9
 */
PasswordInput.addElementGetter('repeat_label', '.repeat-input-label');

/**
 * The value property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.9
 * @version  0.1.9
 */
PasswordInput.setProperty(function value() {

	let val;

	if (this.input_el) {
		val = this.input_el.value;
	}

	if (!val) {
		return undefined;
	}

	if (!this.valuesAreEqual()) {
		return undefined;
	}

	return val;
});

/**
 * Are both inputs the same?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.9
 * @version  0.1.9
 */
PasswordInput.setMethod(function valuesAreEqual() {

	let first_value = this.input_el?.value,
	    repeat_value = this.repeat_el?.value;
	
	return first_value == repeat_value;
});

/**
 * Revalidate the value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.9
 * @version  0.1.9
 */
PasswordInput.setMethod(async function revalidate() {

	let first_value = this.input_el?.value,
	    repeat_value = this.repeat_el.value;

	if (first_value) {
		this.repeat_label.hidden = false;
	} else {
		this.repeat_el.value = '';
		this.repeat_label.hidden = true;
	}

	this.removeErrors();

	if (!first_value && !repeat_value) {
		return;
	}

	if (first_value != repeat_value) {
		return this.addError(this.__('does-not-match'), true);
	}

	return revalidate.super.call(this);
});

/**
 * Actions to perform when this element
 * has been added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.9
 * @version  0.1.9
 */
PasswordInput.setMethod(function introduced() {

	const that = this;

	introduced.super.call(this);

	this.repeat_el.addEventListener('focus', function onFocus(e) {
		that.inputbox_el.classList.add('focus');
	});

	this.repeat_el.addEventListener('blur', function onBlur(e) {
		that.inputbox_el.classList.remove('focus');
	});

	this.repeat_el.addEventListener('keyup', Fn.throttle(function onKeyup(e) {
		that.revalidate();
		that.emit('changing');
	}, {
		minimum_wait  : 350,
		immediate     : false,
		reset_on_call : true
	}));

});