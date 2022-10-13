/**
 * The alchemy-tab-button element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
const TabButton = Function.inherits('Alchemy.Element.Form.TabBase', 'TabButton');

/**
 * Set the ARIA role of the element
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
TabButton.setRole('tab');

/**
 * Only the active tab should be tabable
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
TabButton.setAttribute('tabindex', {default: -1});

/**
 * The name of the tab
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
TabButton.setAttribute('tab-name');

/**
 * Is this tab active?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
TabButton.setAttribute('active', null, function setActive(value) {

	if (value != null) {
		this.activate(value);
	}

	return value;
}, {boolean: true});

/**
 * Get the corresponding tab content element
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
TabButton.setMethod(function getContentElement() {

	const tab_name = this.dataset.tabName;

	if (!tab_name) {
		return;
	}

	let context = this.tab_context;

	if (!context) {
		return;
	}

	return context.querySelector('al-tab-content[tab-name="' + tab_name + '"]');
});

/**
 * Activate this tab
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
TabButton.setMethod(function activate(value) {

	let context = this.tab_context;

	if (!context) {
		return;
	}

	if (value == null) {
		value = true;
	}

	let all_buttons = context.getAllTabButtons(),
	    all_contents = context.getAllTabContents();

	this.setAttributeSilent('active', value);

	// If this tab is activated, others have to be deactivated
	if (value) {
		for (let button of all_buttons) {
			if (button != this && button.active) {
				button.active = false;
			}
		}

		this.setAttribute('aria-selected', true);
		this.setAttribute('tabindex', 0);
	} else {
		this.removeAttribute('aria-selected');
		this.setAttribute('tabindex', -1);
	}

	for (let content of all_contents) {
		if (content.tab_name == this.tab_name) {
			content.active = value;
		} else if (value) {
			content.active = false;
		}
	}

});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
TabButton.setMethod(function introduced() {

	this.addEventListener('click', e => {
		this.activate();
	});
});