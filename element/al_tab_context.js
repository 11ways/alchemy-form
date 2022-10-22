/**
 * The al-tab-context element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
const TabContext = Function.inherits('Alchemy.Element.Form.TabBase', 'TabContext');

/**
 * The "value", or active tab
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @return   {AlchemyTabButton[]}
 */
TabContext.setAttribute('value', function getValue(value) {

	let all_buttons = this.getAllTabButtons();

	if (all_buttons.length) {
		value = '';

		for (let entry of all_buttons) {
			if (entry.active) {
				value = entry.tab_name;
				break;
			}
		}
	}

	return value;
	
}, function setValue(value) {

	let all_buttons = this.getAllTabButtons(),
	    activated = false;

	if (all_buttons.length) {
		for (let entry of all_buttons) {
			if (entry.tab_name == value) {
				entry.active = true;
				activated = true;
			} else {
				entry.active = false;
			}
		}

		// If nothing was activated, activate the first one
		if (!activated) {
			all_buttons[0].active = true;
			value = all_buttons[0].tab_name;
		}
	}

	return value;
});

/**
 * Do something when this element is retained
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
TabContext.setMethod(function retained() {

	let value = this.value;

	if (!value) {
		// Trigger setValue, which will select the first tab
		this.value = '';
	}
});

/**
 * Get all the tab buttons
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @return   {AlchemyTabButton[]}
 */
TabContext.setMethod(function getAllTabButtons() {
	return this.queryAllNotNested('al-tab-button');
});

/**
 * Get all the tab contents
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @return   {AlchemyTabButton[]}
 */
TabContext.setMethod(function getAllTabContents() {
	return this.queryAllNotNested('al-tab-panel');
});