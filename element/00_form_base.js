/**
 * The base class for all other al-form elements
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
const Base = Function.inherits('Alchemy.Element', 'Alchemy.Element.Form', 'Base');

/**
 * Set the custom element prefix
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Base.setStatic('custom_element_prefix', 'al');

/**
 * This is a static class (so it won't be registered)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Base.makeAbstractClass();

/**
 * The stylesheet to load for this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Base.setStylesheetFile('form/alchemy_form');

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
 * The purpose determines what the goal of the field is.
 * Is it for editing or viewing?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.11
 * @version  0.1.11
 */
Base.setAttribute('purpose', function getPurpose(value) {

	if (value) {
		return value;
	}

	value = this.getAttribute('view-type');

	if (!value && this.alchemy_form) {
		value = this.alchemy_form.view_type;
	}

	// Fallback to the "edit" type
	if (!value) {
		value = 'edit';
	}

	return value;
});

/**
 * The mode is used as a hint to how this element should be rendered.
 * Could be "inline", "standalone", ...
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.11
 * @version  0.1.11
 */
Base.setAttribute('mode');

/**
 * The view-type determines which type of wrapper/field to use,
 * e.g.: view, list, edit, ...
 * 
 * @deprecated   You should use `purpose` for this
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.11
 */
Base.setProperty(function view_type() {

	if (this.hasAttribute('view-type')) {
		return this.getAttribute('view-type');
	}

	let purpose = this.purpose,
	    mode = this.mode;
	
	if (mode) {
		purpose += '_' + mode;
	}

	return purpose;
}, function setViewType(value) {

	if (value == null) {
		this.removeAttribute('view-type');
	} else {
		this.setAttribute('view-type', value);
	}

	return value;
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

/**
 * Get the path of this field value in the current (sub)schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.4
 * @version  0.1.4
 */
Base.setProperty(function field_path_in_current_schema() {

	let result = [],
	    parent = this.getParentField(),
		name;

	name = this.getPathEntryName();

	if (name) {
		result.push(name);
	}

	while (parent && !(parent instanceof Classes.Alchemy.Element.Form.FieldSchema)) {
		name = parent.getPathEntryName();

		if (name) {
			result.unshift(name);
		}

		parent = parent.getParentField();
	}

	return result.join('.');
});

/**
 * Get the path of this field value in the current record
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 */
Base.setProperty(function field_path_in_record() {

	let result = [],
	    parent = this.getParentField(),
		name;

	name = this.getPathEntryName();

	if (name) {
		result.push(name);
	}

	while (parent) {
		name = parent.getPathEntryName();

		if (name) {
			result.unshift(name);
		}

		parent = parent.getParentField();
	}

	return result.join('.');
});

/**
 * Get the parent field/field-entry element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.4
 *
 * @return   {Alchemy.Element.Form.Base}
 */
Base.setMethod(function getParentField() {

	let parent = this.parentElement;

	while (parent) {

		if (parent instanceof Classes.Alchemy.Element.Form.Base) {
			return parent;
		}

		parent = parent.parentElement;
	}

	if (this.field_context) {
		return this.field_context;
	}

	return false;
});

/**
 * Get the name of this thing in a record path
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 *
 * @return   {String}
 */
Base.setMethod(function getPathEntryName() {
	return '';
});

/**
 * Get this entry's path origin
 * (The path to the container it's in)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 *
 * @return   {String}
 */
Base.setMethod(function getPathOrigin() {

	let current = this,
	    origin;

	while (current) {
		origin = current.field_path_in_record;

		if (origin) {
			return origin;
		}

		current = current.getParentField();
	}
});

/**
 * Resolve the given path
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.3
 * @version  0.1.3
 * 
 * @param    {String}   name   The name to resolve
 * @param    {String}   origin The origin to use (optional)
 *
 * @return   {String}
 */
Base.setMethod(function resolvePath(name, origin) {

	if (origin == null) {
		origin = this.getPathOrigin();
	}

	if (!origin) {
		return name;
	}

	if (!Array.isArray(origin)) {
		origin = origin.split('.');
	} else {
		origin = origin.slice(0);
	}

	if (!origin.length) {
		return name;
	}

	origin.pop();
	origin.push(name);
	
	return origin.join('.');
});