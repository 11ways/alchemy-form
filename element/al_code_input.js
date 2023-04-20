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
 * Line number info
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.5
 * @version  0.2.5
 */
CodeInput.setAttribute('show-line-numbers', {type: 'boolean', default: true});

/**
 * The ace mode to use
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.5
 * @version  0.2.5
 */
CodeInput.setAttribute('language-mode');

/**
 * The theme to use
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.5
 * @version  0.2.5
 */
CodeInput.setAttribute('color-theme');

/**
 * The minimum number of lines to show (height)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.5
 * @version  0.2.5
 */
CodeInput.setAttribute('min-lines', {type: 'number'});

/**
 * The maximum number of lines to show (height)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.5
 * @version  0.2.5
 */
CodeInput.setAttribute('max-lines', {type: 'number'});

/**
 * Get/set the value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.5
 */
CodeInput.setProperty(function value(value) {

	if (this._editor) {
		return this._editor.getValue();
	}

	let editor_el = this.querySelector('.code-editor');

	if (editor_el) {
		return editor_el.textContent;
	}

	if (this.assigned_data.value) {
		return this.assigned_data.value;
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

	this.assigned_data.value = value;
});

/**
 * Added to the dom
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.5
 */
CodeInput.setMethod(async function introduced() {

	await hawkejs.require('ace1.4/ace');

	let editor_el = this.querySelector('.code-editor');

	editor_el.hidden = false;

	let theme = this.color_theme || 'ace/theme/tomorrow_night_eighties';

	if (!theme.startsWith('ace/theme')) {
		theme = 'ace/theme/' + theme;
	}

	let options = {
		showLineNumbers : this.show_line_numbers,
		minLines        : this.minLines || 4,
		maxLines        : this.maxLines || 50,
		theme           : theme,
	};

	let editor = ace.edit(editor_el, options);

	editor.session.setUseWrapMode(true);
	editor.setFontSize(16);

	let parent_field = this.queryParents('al-field');

	if (parent_field && parent_field.widget_settings && parent_field.widget_settings.language_mode) {

		let mode = parent_field.widget_settings.language_mode;

		// Even though it correctly downloads the language mode file without it,
		// it still requires the `ace/mode/` prefix
		if (mode.indexOf('/') == -1) {
			mode = 'ace/mode/' + mode;
		}

		editor.session.setMode(mode);
	}

	if (this.assigned_data.value) {
		editor.setValue(this.assigned_data.value, -1);
	}

	if (this.language_mode) {
		try {
			editor.session.setMode('ace/mode/' + this.language_mode);
		} catch (err) {
			// Ignore
		}
	}

	this._editor = editor;
});