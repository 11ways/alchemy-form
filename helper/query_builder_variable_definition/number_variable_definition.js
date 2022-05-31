/**
 * The Number Value Type
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
const NumberDefinition = Function.inherits('Alchemy.QueryBuilder.VariableDefinition', 'Number');

/**
 * The `<` operator
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
NumberDefinition.addLogicalOperator('lt', 'Is Less Than');

/**
 * The `<=` operator
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
NumberDefinition.addLogicalOperator('lte', 'Is Less Or Equal Than');

/**
 * The `>` operator
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
NumberDefinition.addLogicalOperator('gt', 'Is Greater Than');

/**
 * The `>=` operator
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
NumberDefinition.addLogicalOperator('gte', 'Is Greater Or Equal Than');

/**
 * The `add` assignment operator adds a value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
NumberDefinition.addAssignmentOperator('add');

/**
 * The `subtract` assignment operator subtracts a value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
NumberDefinition.addAssignmentOperator('subtract');

/**
 * The `multiply` assignment operator multiplies a value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
NumberDefinition.addAssignmentOperator('multiply');

/**
 * The `divide` assignment operator divides a value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
NumberDefinition.addAssignmentOperator('divide');

/**
 * The `module` assignment operator leaves the rest
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
NumberDefinition.addAssignmentOperator('modulo');

/**
 * Create a value input element
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
NumberDefinition.setMethod(function createValueInput(renderer, value_data) {

	let input = renderer.createElement('input');
	input.setAttribute('type', 'number');

	return input;
});