/**
 * ValueType
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @param    {Object}   config
 */
const VariableDefinition = Function.inherits('Alchemy.Base', 'Alchemy.QueryBuilder.VariableDefinition', function VariableDefinition(config) {
	this.applyConfig(config);
});

/**
 * Make this an abtract class
 */
VariableDefinition.makeAbstractClass();

/**
 * This class starts a new group
 */
VariableDefinition.startNewGroup('qb_variable_definitions');

/**
 * The machine-readable name of the variable
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
VariableDefinition.setProperty('name');

/**
 * The human-readable title of the variable
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
VariableDefinition.setProperty('title');

/**
 * The description of the variable
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
VariableDefinition.setProperty('description');

/**
 * Is this variable readonly? (Mainly used for assignments)
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
VariableDefinition.setProperty('readonly', false);

/**
 * The flags of this variable
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
VariableDefinition.setProperty('flags');

/**
 * Get the type_name from the constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
VariableDefinition.setProperty(function type_name() {
	return this.constructor.type_name;
});

/**
 * The `id` property just refers to the `name`
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
VariableDefinition.setProperty(function id() {
	return this.name;
});

/**
 * Make sure this definition has operators
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
VariableDefinition.constitute(function prepareOperators() {
	this.logical_operators = {};
	this.assignment_operators = {};
});

/**
 * Create the correct variable definition
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
VariableDefinition.setStatic(function cast(entry) {

	if (!entry) {
		return null;
	}

	if (entry instanceof VariableDefinition) {
		return entry;
	}

	if (!entry.type) {
		return null;
	}

	let constructor = VariableDefinition.getMember(entry.type);

	if (!constructor) {
		return null;
	}

	let result = new constructor(entry);

	return result;
});

/**
 * Add a logical operator
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @param    {String}   name
 * @param    {Object}   config
 */
VariableDefinition.setStatic(function addLogicalOperator(name, config) {

	if (typeof config == 'string') {
		config = {
			title : config
		};
	} else if (!config) {
		config = {};
	}

	if(!config.title) {
		config.title = name.titleize();
	}

	config.id = name;

	this.constitute(function _addOperator() {
		this.logical_operators[name] = config;
	});
});

/**
 * Add an assignment operator
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @param    {String}   name
 * @param    {Object}   config
 */
VariableDefinition.setStatic(function addAssignmentOperator(name, config) {

	if (typeof config == 'string') {
		config = {
			title : config
		};
	} else if (!config) {
		config = {};
	}

	if(!config.title) {
		config.title = name.titleize();
	}

	config.id = name;

	this.constitute(function _addOperator() {
		this.assignment_operators[name] = config;
	});
});

/**
 * Apply configuration
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
VariableDefinition.setMethod(function applyConfig(config) {

	if (!config) {
		return;
	}

	if (config.name != null) {
		this.name = config.name;
	}

	if (config.title != null) {
		this.title = config.title;
	}

	if (config.description != null) {
		this.description = config.description;
	}
});

/**
 * Return an simple object for JSON-ifying
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @return   {Object}
 */
VariableDefinition.setMethod(function toJSON() {
	return {
		name        : this.name,
		title       : this.title,
		description : this.description,
		type        : this.type_name,
	};
});

/**
 * Return an object for json-drying this object
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @return   {Object}
 */
VariableDefinition.setMethod(function toDry() {
	return {
		value : this.toJSON(),
	};
});

/**
 * unDry an object
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @return   {VariableDefinition}
 */
VariableDefinition.setStatic(function unDry(obj) {
	return new this(obj);
});

/**
 * Get all available logical operators
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
VariableDefinition.setMethod(function getLogicalOperators(value) {
	return Object.values(this.constructor.logical_operators);
});

/**
 * Get all available logical operators
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
VariableDefinition.setMethod(function getAssignmentOperators(value) {
	return Object.values(this.constructor.assignment_operators);
});

/**
 * Create a value input element
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
VariableDefinition.setMethod(function createValueInput(renderer, value_data) {

	let input = renderer.createElement('input');
	input.setAttribute('type', 'text');

	return input;
});

/**
 * The `equals` operator
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
VariableDefinition.addLogicalOperator('equals');

/**
 * The `not_equals` operator
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
VariableDefinition.addLogicalOperator('not_equals');

/**
 * The `is_empty` operator
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
VariableDefinition.addLogicalOperator('is_empty');

/**
 * The `is_null` operator
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
VariableDefinition.addLogicalOperator('is_null');

/**
 * The `set` operator sets a value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
VariableDefinition.addAssignmentOperator('set', 'Set');