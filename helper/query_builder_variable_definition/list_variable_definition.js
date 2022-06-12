/**
 * The List Value Type:
 * Can contain other value types.
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.7
 * @version  0.1.7
 */
const ListDefinition = Function.inherits('Alchemy.QueryBuilder.VariableDefinition', 'List');

/**
 * The optional type this list holds
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.7
 * @version  0.1.7
 */
ListDefinition.setProperty('content_type');

/**
 * The `contains` operator
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.7
 * @version  0.1.7
 */
ListDefinition.addLogicalOperator('contains');

/**
 * The `add` assignment operator adds an entry
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.7
 * @version  0.1.7
 */
ListDefinition.addAssignmentOperator('add');