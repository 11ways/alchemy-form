const QueryBuilder = Fn.getNamespace('Alchemy.QueryBuilder');

/**
 * Apply query builder settings to a criteria
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.12
 * @version  0.1.12
 *
 * @param    {Object}     conditions
 * @param    {Criteria}   criteria
 * @param    {Boolean}    inverted
 */
QueryBuilder.applyToCriteria = function applyToCriteria(conditions, criteria, inverted) {

	if (!conditions || !conditions.rules?.length) {
		return;
	}

	let group;

	if (conditions.condition == 'or') {
		group = criteria.or();
	} else {
		group = criteria.and();
	}

	if (inverted == null) {
		inverted = false;
	}

	if (conditions.inverted) {
		inverted = !inverted;
	}

	for (let rule of conditions.rules) {
		applyRule(rule, criteria, inverted);
	}
};

/**
 * Apply a single rule to a criteria
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.12
 * @version  0.1.12
 *
 * @param    {Object}     rule
 * @param    {Criteria}   criteria
 * @param    {Boolean}    inverted
 */
function applyRule(rule, criteria, inverted) {

	if (rule.type == 'group') {
		return QueryBuilder.applyToCriteria(rule, criteria, inverted);
	}

	if (rule.type != 'qb_entry') {
		return;
	}

	// Referencing other fields is not supported
	if (rule.value_variable) {
		return;
	}

	let context = criteria.where(rule.field);

	if (inverted) {
		context = context.not();
	}

	if (rule.operator == 'is_empty') {
		context.isEmpty();
		return;
	}

	if (rule.operator == 'is_null') {
		context.isNull();
		return;
	}

	let value = rule.value_explicit.value;

	let method;

	switch (rule.operator) {
		case 'ne':
		case 'not_equals':
			method = 'ne';
			break;
		
		case 'starts_with':
			value = RegExp.interpret('^' + value);
			method = 'equals';
			break;
		
		case 'ends_with':
			value = RegExp.interpret(value + '$');
			method = 'equals';
			break;
		
		default:
			method = rule.operator;
	}

	context[method](value);
}