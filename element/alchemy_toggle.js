/**
 * The al-toggle custom element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
const AlchemyToggle = Function.inherits('Alchemy.Element.Form.Base', 'Toggle');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlchemyToggle.setTemplateFile('form/elements/alchemy_toggle');

/**
 * Get/set the value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlchemyToggle.setAttribute('value', null, function setValue(value) {

	let input = this.querySelector('input');

	value = !!value;

	if (input) {
		input.checked = value;
	}

	return value;

}, {boolean: true});

/**
 * Added to the dom
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlchemyToggle.setMethod(function introduced() {

	this.addEventListener('click', e => {
		this.value = !this.value;
	});

	let input = this.querySelector('input');

	input.addEventListener('change', e => {

		e.preventDefault();
		e.stopPropagation();

		if (input.checked == this.value) {
			return;
		}

		this.value = input.checked;
	});
});