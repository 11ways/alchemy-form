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
 * @version  0.1.4
 */
AlchemyForm.setMethod(function populateWidget() {

	let config = this.config,
	    form = this.createElement('alchemy-form');

	let col_el = this.createElement('alchemy-widgets-column'),
	    col = col_el.instance;

	col.parent_instance = this;

	form.classList.add('alchemy-widgets-container');

	if (this.config && this.config.widgets) {
		let widgets = this.config.widgets.slice(0),
		    widget,
			i;
		
		for (i = 0; i < widgets.length; i++) {
			widget = widgets[i];

			if (widget.type == 'alchemy_field') {
				widget = Object.assign({}, widget);
				widget.config = Object.assign({}, widget.config);
				widget.config.alchemy_form = form;
				widgets[i] = widget;
			}
		}

		col.widget.value = widgets;
	}

	let record = this.element.getContextVariable('record');

	if (record) {
		form.document = record;
	}

	if (config.model) {
		form.model = config.model;
	}

	form.view_type = config.view_type || 'edit';

	form.append(col.widget);

	this.element.append(form);

	let violations = this.element.getContextVariable('form_violations');

	if (violations) {
		form.showError(violations);
	}
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