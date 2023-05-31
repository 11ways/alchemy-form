/**
 * The al-pathway element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
const Pathway = Function.inherits('Alchemy.Element.Form.Base', 'Pathway');

/**
 * The hawkejs template to use
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
Pathway.setTemplateFile('form/elements/al_pathway');

/**
 * The root leaf property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
Pathway.setAssignedProperty('rootleaf');

/**
 * The current value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
Pathway.setAssignedProperty(function value(val) {

	let new_val = this.getValue();

	if (new_val) {
		return new_val;
	}

	return val;
}, function setValue(val) {

	let child = this.querySelector('.al-pathway-selection-root');

	if (child) {
		child.value = val;
	}

});

/**
 * Get the current value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
Pathway.setMethod(function getValue() {

	let child = this.querySelector('.al-pathway-selection-root');

	if (child) {
		return child.getValue();
	}
});

/**
 * Incoming change
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @param    {PathwaySelection}   element
 */
Pathway.setMethod(function triggerChange(element) {

	alchemy.emit('story_pathway', this, element);
});