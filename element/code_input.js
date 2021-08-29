/**
 * The code-input custom element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
const CodeInput = Function.inherits('Alchemy.Element.Form.Base', 'CodeInput');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
CodeInput.setTemplateFile('form/elements/code_input');

/**
 * The stylesheet to load for this element
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
CodeInput.setStylesheetFile('form/alchemy_code_input');

/**
 * Get/set the value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
CodeInput.setProperty(function value(value) {

	if (this._editor) {
		return this._editor.getValue();
	}

	let editor_el = this.querySelector('.code-editor');

	if (editor_el) {
		return editor_el.textContent;
	}
});

/**
 * Added to the dom
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
CodeInput.setMethod(async function introduced() {

	await hawkejs.require('ace1.4/ace');

	let editor_el = this.querySelector('.code-editor');

	let editor = ace.edit(editor_el);

	editor.session.setUseWrapMode(true);
	editor.setFontSize(16);

	this._editor = editor;

	console.log(editor_el, 'EDITOR:', editor);

});