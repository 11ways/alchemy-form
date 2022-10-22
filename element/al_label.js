/**
 * The al-label custom element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
const AlchemyLabel = Function.inherits('Alchemy.Element.Form.Base', 'Label');

/**
 * The linked element
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlchemyLabel.setAttribute('for');

/**
 * Added to the dom
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.3
 */
AlchemyLabel.setMethod(function introduced() {

	this.addEventListener('click', e => {

		if (!this.for) {
			return;
		}

		let element = document.getElementById(this.for);

		if (!element) {
			return;
		}

		try {
			// Trigger a click (for buttons & checkboxes)
			element.click();

			// Focus on the element (for inputs)
			element.focus();
		} catch (err) {
			console.error('Failed to focus element:', err);
		}
	});
});