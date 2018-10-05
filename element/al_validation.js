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
 * Listen for field assignments
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String|Object}   message
 */
AlValidation.setMethod(function setError(message) {
	this.innerText = message;
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