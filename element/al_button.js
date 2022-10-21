/**
 * The al-button element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
const Button = Function.inherits('Alchemy.Element.Form.Stateful', 'Button');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Button.setTemplateFile('form/elements/alchemy_button');

/**
 * Set the ARIA role of the element
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Button.setRole('button');

/**
 * Make it tabable
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Button.setAttribute('tabindex', {default: 0});

/**
 * Action instances
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Button.setAssignedProperty('action_instance');

/**
 * Emit the activate event
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Button.setMethod(function activate() {

	let event = this.emit('activate');

	if (event.defaultPrevented) {
		return;
	}

	if (this.action_instance) {
		this.action_instance.execute(event);
	}
});

/**
 * The element has been added to the dom for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Button.setMethod(function introduced() {

	this.addEventListener('click', e => {
		this.activate();
	});

	this.addEventListener('keyup', e => {

		switch (e.key) {
			case ' ':
			case 'Enter':
				this.activate();
				break;
		}
	});
});