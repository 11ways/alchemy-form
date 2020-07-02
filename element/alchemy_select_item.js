/**
 * The alchemy-select-item element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
const Item = Function.inherits('Alchemy.Element.Form.Base', function SelectItem() {
	SelectItem.super.call(this);
	this.setAttribute('tabindex', '-1');
});

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
 * Is this item selected?
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Item.setAttribute('selected', {boolean: true});

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