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
 * The allowed activatable states
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Button.setAttribute('activatable-states', {type: 'token_list'});

/**
 * Preconfigured behaviours
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.1
 * @version  0.2.1
 */
Button.setAttribute('behaviour', {type: 'token_list'});

/**
 * Action instances
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Button.setAssignedProperty('action_instance');

/**
 * The last error
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
Button.setProperty('last_error', null);

/**
 * Emit the activate event
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.3.0
 */
Button.setMethod(function activate() {

	let allowed_states = this.activatable_states;

	if (!allowed_states.length) {
		allowed_states = ['default', 'ready', 'idle'];
	} else {
		allowed_states = allowed_states.values();
	}

	if (allowed_states.indexOf(this.state) == -1) {
		return;
	}

	let event = this.emit('activate', {cancelable: true});

	if (event.defaultPrevented) {
		return;
	}

	if (this.action_instance) {
		this.action_instance.execute(event);
	} else if (this.behaviour.contains('submit')) {
		let form = this.queryUp('al-form, form');

		if (form) {
			let pledge = form.submit();

			if (Pledge.isThenable(pledge)) {
				let old_state = this.state;
				this.setState('busy');

				Pledge.done(pledge, err => {

					let temp_state,
					    duration;

					this.last_error = err;

					if (err) {
						temp_state = 'error';
						duration = 2500;
					} else {
						temp_state = 'done';
						duration = 1000;
					}

					this.setState(temp_state, duration, old_state);
				});
			} else {
				this.setState('busy', 1000);
			}
		}
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