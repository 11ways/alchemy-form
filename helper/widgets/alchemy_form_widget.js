/**
 * The Form Widget class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   data
 */
const AlchemyForm = Function.inherits('Alchemy.Widget', 'AlchemyForm');

/**
 * Populate the widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {HTMLElement}   widget
 */
AlchemyForm.setMethod(function populateWidget(widget) {

	let config = this.config,
	    form = this.createElement('alchemy-form');

	let col_el = this.createElement('alchemy-widgets-column'),
	    col = col_el.instance;

	col.parent_instance = this;

	form.classList.add('alchemy-widgets-container');

	if (this.config && this.config.widgets) {
		col.widget.value = this.config.widgets;
	}

	let record = widget.getContextVariable('record');

	console.log('Setting form record:', record, this.config.widgets);
	console.log('On form', form)

	if (record) {
		form.document = record;
	}

	if (config.model) {
		form.model = config.model;
	}

	form.view_type = config.view_type || 'edit';

	form.append(col.widget);

	widget.append(form);
});

/**
 * Get the nested column
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlchemyForm.setMethod(function getNestedColumn(widget) {

	if (!widget) {
		widget = this.widget;
	}

	if (!widget) {
		return;
	}

	let col = widget.querySelector('alchemy-form > alchemy-widgets-column');

	return col;
});

/**
 * Start the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlchemyForm.setMethod(function _startEditor() {

	let col = this.getNestedColumn();

	if (!col) {
		return;
	}

	col.startEditor();
});

/**
 * Stop the editor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlchemyForm.setMethod(function _stopEditor() {

	let col = this.getNestedColumn();

	if (!col) {
		return;
	}

	col.stopEditor();
});

/**
 * Get the config of this widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Object}
 */
AlchemyForm.setMethod(function syncConfig() {

	let config = this.config;

	if (!config) {
		config = this.config = {};
	}

	let col = this.getNestedColumn();

	if (col) {
		config.widgets = col.instance.syncConfig();
	} else {
		config.widgets = [];
	}

	return this.config;
});