const STATE_COUNT = Symbol('state_count');

/**
 * The base stateful element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
const Stateful = Function.inherits('Alchemy.Element.Form.Base', 'Stateful');

/**
 * The current state
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Stateful.setAttribute('state');

/**
 * Add a state listener to all child classes
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Stateful.addObservedAttribute('state', function onChange(state) {
	this.refresh();
});

/**
 * The current state counter
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Stateful.setProperty(STATE_COUNT, 0);

/**
 * Set the state of the state (for a specific time)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {String}   state_name
 * @param    {Number}   duration_in_ms
 * @param    {String}   final_state
 */
Stateful.setMethod(function setState(state_name, duration_in_ms, final_state) {

	let old_state = this.state,
	    state_count = ++this[STATE_COUNT];
	
	this.state = state_name;

	if (duration_in_ms > 0 && Blast.isBrowser) {

		if (final_state == null) {
			final_state = old_state;
		}

		setTimeout(() => {
			if (this[STATE_COUNT] != state_count) {
				return;
			}

			this.state = final_state;
		}, duration_in_ms);
	}
});

/**
 * Refresh all the children
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Stateful.setMethod(function refresh() {

	let current_state = this.state,
	    children = this.queryAllNotNested('[state-name]'),
	    child,
	    i;

	for (i = 0; i < children.length; i++) {
		child = children[i];
		child.active = child.state_name == current_state;
	}
});