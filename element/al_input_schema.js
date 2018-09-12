/**
 * The schema alchemy-input element
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var Schema = Function.inherits('Alchemy.Element.AlInput', function AlInputSchema() {
	AlInputSchema.super.call(this);
});

/**
 * This element has been inserted in the DOM
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Schema.setMethod(function introduced() {

	var that = this;

	console.log('Introduced schema', this);

});