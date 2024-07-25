/**
 * The al-enum-badge class:
 * Shows a selected enum value as a badge.
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
const EnumBadge = Function.inherits('Alchemy.Element.Form.Base', 'EnumBadge');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.3.0
 * @version  0.3.0
 */
EnumBadge.setTemplateFile('form/elements/al_enum_badge');

/**
 * The ID of the enum value to show.
 * Can be a string, a number, an ObjectId representation.
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
EnumBadge.setAttribute('enum-id');

/**
 * The optional Model to get the info from,
 * in case the source is a Model.
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
EnumBadge.setAttribute('model');

/**
 * The optional enum-class to use (if the source is not just a model)
 * This class has to be available on the client-side!
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
EnumBadge.setAttribute('enum-class');

/**
 * See if we need to prepare any render variables
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
EnumBadge.setMethod(function prepareRenderVariables() {

	let enum_id = this.enum_id;

	if (!enum_id) {
		return;
	}

	let enum_class = this.enum_class;

	if (!enum_class) {

		if (this.model) {
			return this.prepareRenderVariablesFromModel();
		}

		return;
	}

	let constructor,
	    parent = Object.path(Classes, enum_class);

	if (parent?.is_namespace) {
		parent = parent[parent.name];
	}

	if (!parent) {
		return;
	}

	// Not sure this will always be correct.
	// Might have to loop over all the children.
	// Or use `getDescendantsDict()` or `getDescendantsMap()`
	constructor = parent.getDescendant(enum_id);

	if (!constructor) {
		return;
	}

	let title = constructor.title,
	    color,
	    index,
	    icon;

	let enum_info = constructor.enum_info;

	if (enum_info) {
		if (enum_info.title) {
			title = enum_info.title;
		}

		if (enum_info.icon) {
			icon = enum_info.icon;
		}

		if (enum_info.index) {
			index = enum_info.index;
		}

		if (enum_info.color) {
			color = enum_info.color;
		}
	}

	return {title, color, index, icon};
});

/**
 * Get render variables from a model
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
EnumBadge.setMethod(async function prepareRenderVariablesFromModel() {

	let enum_id = this.enum_id,
	    model = this.model;

	if (!enum_id || !model) {
		return;
	}

	let resource_options = {
		name   : 'FormApi#enumInfo',
		params : {
			model_name : model,
			id         : enum_id
		}
	};

	let result;

	try {
		result = await this.hawkejs_helpers.Alchemy.getResource(resource_options);
	} catch (err) {
		console.error('Failed to get enum info:', err);
	}

	return result;
});