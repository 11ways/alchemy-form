/**
 * The String Value Type
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
const StringDefinition = Function.inherits('Alchemy.QueryBuilder.VariableDefinition', 'String');

/**
 * The `contains` operator
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
StringDefinition.addLogicalOperator('contains');

/**
 * The `starts_with` operator
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
StringDefinition.addLogicalOperator('starts_with');

/**
 * The `ends_with` operator
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
StringDefinition.addLogicalOperator('ends_with');

/**
 * The `append` assignment operator adds text
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
StringDefinition.addAssignmentOperator('append');