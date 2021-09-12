/**
 * The Field Widget class
 *
 * @constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Object}   data
 */
const AlchemyField = Function.inherits('Alchemy.Widget', 'AlchemyField');

/**
 * Prepare the schema
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlchemyField.constitute(function prepareSchema() {

	//let widgets = this.createSchema();

	// widgets.addField('type', 'Enum', {values: alchemy.getClassGroup('widgets')});
	// widgets.addField('config', 'Schema', {schema: 'type'});

	// this.schema.addField('widgets', widgets, {array: true});
});

/**
 * Populate the widget
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlchemyField.setMethod(function populateWidget() {

	let config = this.config;

	let field_el = this.createElement('alchemy-field');
	field_el.field_name = config.field;

	if (config.view) {
		field_el.field_view = config.view;
	}

	this.element.append(field_el);
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
AlchemyField.setMethod(function syncConfig() {

	let config = this.config;

	if (!config) {
		config = this.config = {};
	}

	return this.config;
});