/**
 * The alchemy-tab-list element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
const TabList = Function.inherits('Alchemy.Element.Form.TabBase', 'TabList');

/**
 * Set the ARIA role of the element
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
TabList.setRole('tablist');

/**
 * Move the current selection
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {Number}   direction
 */
TabList.setMethod(function moveSelection(direction) {

	let active_tab = this.querySelector('al-tab-button[active]'),
	    all_tabs = Array.cast(this.querySelectorAll('al-tab-button')),
	    index = all_tabs.indexOf(active_tab);
	
	index += direction;

	let new_tab = all_tabs.atLoop(index);

	if (new_tab) {
		new_tab.active = true;
		new_tab.focus();
	}
});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
TabList.setMethod(function introduced() {

	// Arrows are only detected on keydown
	this.addEventListener('keydown', e => {

		let direction = 0;

		if (e.key == 'ArrowLeft') {
			direction = -1;
		} else if (e.key == 'ArrowRight') {
			direction = 1;
		}

		this.moveSelection(direction);
	});
});