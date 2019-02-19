/**
 * The al-validation element
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var AlValidation = Function.inherits('Alchemy.Element.AlFormBase', function AlValidation() {
	AlValidation.super.call(this);
});

/**
 * Disable getContent method
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlValidation.setProperty('getContent', null);

/**
 * Add an error message
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String|Object}   message
 */
AlValidation.setMethod(function addError(message) {

	if (!this.innerHTML.length) {
		return this.setError(message);
	}

	if (this.innerHTML.indexOf('<ul') == -1) {
		let ul = this.createElement('ul'),
		    li = this.createElement('li');

		ul.appendChild(li);
		li.innerHTML = this.innerHTML;
		this.innerHTML = '';
		this.append(ul);
	} else {
		let li = this.createElement('li'),
		    ul = this.children[0];

		ul.appendChild(li);
		li.innerHTML = message;
	}

	if (!this.field || !this.form) {
		return;
	}

	this.form.validation_elements.forEach(function eachElement(element) {
		element.addError(message);
	});
});

/**
 * Set an error message
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String|Object}   message
 */
AlValidation.setMethod(function setError(message) {

	var form = this.form || (this.field && this.field.form);

	this.innerHTML = message;

	if (!form) {
		return;
	}

	form.validation_elements.forEach(function eachElement(element) {
		element.addError(message);
	});
});

/**
 * Listen for field assignments
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlValidation.setMethod(function onFieldAssignment(field, old_field) {
	checkElementLinks(this);
});

/**
 * Listen for input assignments
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlValidation.setMethod(function onInputAssignment(field, old_field) {
	checkElementLinks(this);
});

/**
 * Check the element links
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {AlValidation}   el
 */
function checkElementLinks(el) {

	if (!el.field || !el.input) {
		return;
	}

	el.input.al_validation = el;
}