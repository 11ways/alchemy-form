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

	// this.createElement('alchemy-widgets-column')
	let col = new Classes.Alchemy.Widget.Column();

	// col.config.widgets = ....

	form.classList.add('alchemy-widgets-container');

	console.log('Populating form', widget, form, 'with', this)
	console.log(' »» Col widget el:', col.widget);

	if (this.config && this.config.widgets) {
		col.widget.value = this.config.widgets;
	}

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

	console.log('Nested column?', col);

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