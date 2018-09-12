/**
 * The submit alchemy-input element
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var Submit = Function.inherits('Alchemy.Element.AlInput', function AlInputSubmit() {
	AlInputSubmit.super.call(this);
});

/**
 * This element has been inserted in the DOM
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Submit.setMethod(function introduced() {

	var that = this,
	    button = this.querySelector('button');

	console.log('Introduced?', this, button);

	button.addEventListener('click', function onClick(e) {
		e.preventDefault();
		that.form.submit();
	});
});