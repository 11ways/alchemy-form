/**
 * The alchemy-form element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var Form = Function.inherits('Alchemy.Element.Form.Base', function Form() {
	Form.super.call(this);
});

/**
 * The stylesheet to load for this element
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Form.setStylesheetFile('form/form');

/**
 * The stylesheet to load for this element
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Form.setStylesheetFile('form/alchemy_form');

/**
 * The attribute to use for the route
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Form.setProperty('url_attribute', 'action');

/**
 * The method to use for submitting the data
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Form.setAttribute('method');

/**
 * The name of the model
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Form.setAttribute('model');

/**
 * The document that is being edited
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Form.setAssignedProperty('document');

/**
 * A specific schema to edit
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Form.setAssignedProperty('schema');

/**
 * Pre-set violations
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Form.setAssignedProperty('violations');

/**
 * Get the main error-area
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Form.setProperty(function main_error_area() {

	let element = this.queryAllNotNested('.main-error-area')[0];

	if (!element) {
		element = this.createElement('div');
		element.classList.add('error-area', 'main-error-area');
		this.prepend(element);
	}

	element.setAttribute('aria-role', 'alert');

	return element;
});

/**
 * Get the live value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.2
 */
Form.setProperty(function value() {

	let fields = this.queryAllNotNested('alchemy-field'),
	    result = {},
	    field,
	    key,
	    i;

	if (this.document && this.document.$pk) {
		result[this.document.$model.primary_key] = this.document.$pk;
	}

	for (i = 0; i < fields.length; i++) {
		field = fields[i];

		if (field && field.readonly) {
			continue;
		}

		result[field.field_name] = field.value;
	}

	if (this.model) {
		result = {
			[this.model] : result
		};
	}

	return result;
});

/**
 * Get the formdata
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {FormData}
 */
Form.setMethod(Hawkejs.GET_FORM_DATA, function getFormData() {
	// We prefer regular json requests for now
	return null;
});

/**
 * Get the serialized form data
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Object}
 */
Form.setMethod(Hawkejs.SERIALIZE_FORM, function serializeForm() {
	return this.value;
});

/**
 * Submit this form
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Form.setMethod(async function submit() {

	let result;

	if (false && this.model) {
		let model = alchemy.getModel(this.model);

		if (model) {
			let doc = model.createDocument(this.value);

			let violations = await doc.getViolations();

			if (violations) {
				this.showError(violations);
				throw violations;
			}
		}
	}

	try {
		result = await hawkejs.scene.onFormSubmit(this, null, {render_error: false});
	} catch (err) {
		if (err instanceof Classes.Alchemy.Error.Validation) {
			this.showError(err);
		} else {
			throw err;
		}
	}
});

/**
 * Clear all errors
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Form.setMethod(function clearErrors() {

	let error_areas = this.querySelectorAll('.error-area');

	Hawkejs.removeChildren(error_areas);
});

/**
 * Show the given error
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Form.setMethod(function showError(err) {

	this.clearErrors();

	// Also show the errors inline
	if (err instanceof Classes.Alchemy.Error.Validation) {
		this.showViolations(err);
	} else {
		this.main_error_area.textContent = String(err);
	}
});

/**
 * Print inline violations
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Form.setMethod(async function showViolations(err) {

	let violation,
	    field,
	    lis = [],
	    el,
	    li;

	for (violation of err.violations) {
		field = this.findFieldByPath(violation.path) || false;

		li = this.createElement('li');
		lis.push(li);

		if (violation.microcopy) {
			let microcopy = this.hawkejs_renderer.t(violation.microcopy, {
				field : field.field_title,
			});

			el = microcopy.toElement();
		} else {
			el = this.createElement('span');
			el.textContent = violation.message;
		}

		if (field && field.id) {
			let anchor = this.createElement('a');
			anchor.append(el);
			anchor.href = '#' + field.id;
			li.append(anchor);
		} else {
			li.append(el);
			continue;
		}

		field.showError(violation);
	}

	let ul = this.createElement('ul');
	Hawkejs.replaceChildren(ul, lis);
	Hawkejs.replaceChildren(this.main_error_area, ul);
});

/**
 * Get a specific field instance
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   path
 *
 * @return   {AlchemyField}
 */
Form.setMethod(function findFieldByPath(path) {

	let current = this,
	    result,
	    pieces = path.split('.'),
	    piece,
	    query,
	    temp;

	for (piece of pieces) {

		if (!current) {
			return null;
		}

		if (current.config && current.config.is_array) {
			query = 'alchemy-field-array-entry:nth-child(' + (Number(piece) + 1) + ') .field > *';
		} else {
			query = 'alchemy-field[field-name="' + piece + '"]';
		}

		current = current.queryAllNotNested(query)[0];
	}

	return current;

});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Form.setMethod(function introduced() {

	const that = this;

	if (this.violations) {
		this.showError(this.violations);
	}

	this.onEventSelector('click', '[type="submit"]', function onSubmit(e) {
		that.emit('submit');
	});

	this.addEventListener('submit', function onSubmit(e) {
		e.preventDefault();
		that.submit();
	});

});

/**
 * The element is being assembled by hawkejs
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Form.setMethod(function retained() {

	if (!this.id) {

		let parent = this.queryParents('[data-he-template]'),
		    id = 'f-';

		if (parent) {
			id = parent.dataset.heTemplate.slug() + '-';
		}

		if (this.model) {
			id += this.model.slug();
		}

		this.id = id;
	}

});