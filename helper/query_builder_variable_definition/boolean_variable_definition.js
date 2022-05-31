/**
 * The Boolean Value Type
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
const BooleanDefinition = Function.inherits('Alchemy.QueryBuilder.VariableDefinition', 'Boolean');

/**
 * Create a value input element
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @param    {Hawkejs.Renderer}
 */
BooleanDefinition.setMethod(function createValueInput(renderer) {
	let toggle = renderer.createElement('alchemy-toggle');
	return toggle;
});