/**
 * The al-toggle custom element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
const QueryBuilder = Function.inherits('Alchemy.Element.Form.Base', 'QueryBuilder');

/**
 * The template code
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilder.setTemplate(`<al-query-builder-group></al-query-builder-group>`, {plain_html: true, render_immediate: true});

/**
 * The dataprovider used to get the variables
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilder.setAssignedProperty('dataprovider');

/**
 * Getter for the header element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilder.addElementGetter('root_group', ':scope > al-query-builder-group');

/**
 * Get/set the value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilder.setProperty(function value() {
	return this.root_group.value;
}, function setValue(value) {
	this.assigned_data.value = value;

	if (Blast.isBrowser && this.has_rendered) {
		this.applyValue(value);
	}
});

/**
 * Apply the given value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilder.setMethod(function applyValue(value) {

	if (!value) {
		return;
	}

	this.root_group.value = value;
});

/**
 * Added to the dom
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
QueryBuilder.setMethod(function introduced() {
	if (this.assigned_data.value) {
		this.applyValue(this.assigned_data.value);
	}
});