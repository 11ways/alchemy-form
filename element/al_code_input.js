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
 * Is the value an object?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
CodeInput.setAttribute('value-is-object', {type: 'boolean'});

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
 * @version  0.3.0
 */
CodeInput.setProperty(function value() {

	let result;

	if (this._editor) {
		result = this._editor.getValue();
	} else {
		let editor_el = this.querySelector('.code-editor');

		if (editor_el) {
			result = editor_el.textContent;
		} else {
			if (this.assigned_data.value) {
				return this.assigned_data.value;
			}

			return;
		}
	}

	if (result) {
		result = JSON.safeParse(result);
	}

	return result;

}, function setValue(original_value) {

	let value;

	if (this.value_is_object) {
		value = JSON.stringify(value, null, '\t');
	} else {
		value = original_value;
	}

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

	this.assigned_data.value = original_value;

	this.hawkejs_renderer.registerElementInstance(this);
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

		let value = this.assigned_data.value;

		if (this.value_is_object) {
			value = JSON.stringify(value, null, '\t');
		}

		editor.setValue(value, -1);
	}

	if (this.language_mode) {
		try {
			editor.session.setMode('ace/mode/' + this.language_mode);
		} catch (err) {
			// Ignore
		}
	}

	this.style.height = null;

	this._editor = editor;
});