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
 *
 * @param    {HTMLElement}   widget
 */
AlchemyField.setMethod(function populateWidget(widget) {

	let config = this.config;

	console.log('Should populate Alchemy-Field', config);

	console.log('Creating alchemy-field ...')

	let field_el = this.createElement('alchemy-field');
	console.log('... setting field');
	field_el.field_name = config.field;

	console.log('... Created alchemy-field:', field_el);

	widget.append(field_el);
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

	console.log('Should sync Alchemy-Field:', config);

	return this.config;
});