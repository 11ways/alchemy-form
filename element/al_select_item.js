/**
 * The al-select-item element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
const Item = Function.inherits('Alchemy.Element.Form.Base', 'SelectItem');

/**
 * Set the default inner template
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Item.setTemplateFile('form/elements/alchemy_select_item');

/**
 * The type of this item: "value" or "option"
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Item.setAttribute('type');

/**
 * The type of this item: "value" or "option"
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Item.setAttribute('tabindex', {default: -1});

/**
 * Is this item selected?
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Item.setAttribute('selected', {boolean: true});

/**
 * Should a custom template be used?
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
Item.setAttribute('custom-template');

/**
 * The value of this item
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Item.setAssignedProperty('value');

/**
 * The data the value is referring to
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Item.setAssignedProperty('data');

/**
 * The parent al-select item
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.5
 * @version  0.2.0
 */
Item.enforceProperty(function alchemy_select(new_value) {

	if (new_value == null) {
		new_value = this.closest('al-select');
	}

	return new_value;
});

/**
 * The display item
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.5
 * @version  0.1.12
 */
Item.setProperty(function display_title() {

	let result;

	if (this.data) {
		const model = this.data.$model;

		if (model) {
			result = model.getDisplayTitle(this.data, ['title', 'name']);
		}
	}

	if (!result) {
		if (this.data) {
			result = this.data.title || this.data.name || this.data.$pk || this.value;
		} else {
			result = this.value;
		}
	}

	return result || '';
});