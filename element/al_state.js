/**
 * The al-state element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
const State = Function.inherits('Alchemy.Element.Form.Stateful', 'State');

/**
 * The name of the state this element represents
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
State.setAttribute('state-name');

/**
 * Is this state active?
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
State.setAttribute('active', {boolean: true});
