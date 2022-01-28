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
}, function setValue(value) {

	if (this._editor) {
		this._editor.setValue(value);

		// Go to the last line
		this._editor.gotoLine(this._editor.session.getLength());

		return value;
	}

	let editor_el = this.querySelector('.code-editor');

	if (editor_el) {
		return editor_el.textContent = value;
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

	let parent_field = this.queryParents('alchemy-field');

	if (parent_field && parent_field.widget_settings && parent_field.widget_settings.language_mode) {

		let mode = parent_field.widget_settings.language_mode;

		// Even though it correctly downloads the language mode file without it,
		// it still requires the `ace/mode/` prefix
		if (mode.indexOf('/') == -1) {
			mode = 'ace/mode/' + mode;
		}

		editor.session.setMode(mode);
	}

	this._editor = editor;
});