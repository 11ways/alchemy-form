/**
 * The alchemy-string-input custom element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var StringInput = Function.inherits('Alchemy.Element.Form.FeedbackInput', function StringInput() {
	StringInput.super.call(this);
});

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
StringInput.setTemplateFile('form/elements/string_input');