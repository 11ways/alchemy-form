/**
 * The base class for all other alchemy-form elements
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var Base = Function.inherits('Alchemy.Element', 'Alchemy.Element.Form', function Base() {
	Base.super.call(this);
});

/**
 * Set the custom element prefix
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Base.setStatic('custom_element_prefix', 'alchemy');

/**
 * Don't register this as a custom element,
 * but don't let child classes inherit this
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Base.setStatic('is_abstract_class', true, false);

/**
 * Add a getter that looks for a parent of a specific type
 * (This also works on the server)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Base.setStatic(function addParentTypeGetter(name, type) {

	if (type.indexOf(' ') > -1 || type.indexOf('.') > -1) {
		throw new Error('Only a node name is allowed!');
	}

	type = type.toUpperCase();

	this.setProperty(name, function performLookup() {

		var current = this;

		while (current) {
			if (current.nodeName == type) {
				return current;
			}

			current = current.parentElement;
		}
	});
});

/**
 * The view-type determines which type of wrapper/field to use,
 * e.g.: view, list, edit, ...
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Base.setProperty(function view_type() {

	var value = this.getAttribute('view-type');

	if (!value && this.alchemy_form) {
		value = this.alchemy_form.view_type;
	}

	if (!value) {
		value = 'edit';
	}

	return value;

}, function setViewType(value) {

	if (value == null) {
		this.removeAttribute('view-type');
	} else {
		this.setAttribute('view-type', value);
	}

});

/**
 * Which type of wrapper to use
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Base.setProperty(function wrapper_type() {

	var value = this.getAttribute('wrapper-type');

	if (!value && this.alchemy_form) {
		value = this.alchemy_form.wrapper_type;
	}

	if (value == 'false') {
		return false;
	}

	if (!value) {
		return value;
	}

	return 'default';

}, function setWrapperType(value) {

	if (value == null) {
		this.removeAttribute('wrapper-type');
	} else {
		this.setAttribute('wrapper-type', value);
	}

});