/**
 * Form actions
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @param    {Object}   config
 */
const FormAction = Function.inherits('Alchemy.Base', 'Alchemy.Form.Action', function Action(config) {
	this.extra_config = {};
	this.applyConfig(config);
});

/**
 * Make this an abtract class
 */
FormAction.makeAbstractClass();

/**
 * This class starts a new group
 */
FormAction.startNewGroup('alchemy_form_actions');

/**
 * Add a configuration property
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
FormAction.setStatic(function addConfigProperty(name) {

	this.constitute(function addProperty() {

		if (!this.config_properties) {
			this.config_properties = [];
		}

		this.config_properties.push(name);

		this.setProperty(name, function getConfigValue() {
			return this.extra_config[name];
		}, function setConfigValue(value) {
			return this.extra_config[name] = value;
		});
	});
});

/**
 * The machine-readable name of the action
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
FormAction.setProperty('name');

/**
 * The icon to use for this action
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
FormAction.setProperty('icon');

/**
 * The description of the action
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
FormAction.setProperty('description');

/**
 * The placement of the action
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
FormAction.enforceProperty(function placement(new_value) {

	if (!new_value) {
		new_value = [];
	}

	return new_value;
});

/**
 * The human-readable title of this action
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
FormAction.enforceProperty(function title(new_value) {

	if (!new_value && this.name) {
		new_value = this.name.titleize();
	}

	return new_value;
});

/**
 * Get the type_name from the constructor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
FormAction.setProperty(function type_name() {
	return this.constructor.type_name;
});

/**
 * Apply configuration
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
FormAction.setMethod(function applyConfig(config) {
	Object.assign(this, config);
});

/**
 * Is this action allowed to appear in the given placement?
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @param    {String}   placement
 *
 * @return   {Boolean}
 */
FormAction.setMethod(function isAllowedIn(placement) {
	return this.placement.indexOf(placement) > -1;
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
FormAction.setMethod(function toJSON() {

	let result = {
		type        : this.type_name,
		name        : this.name,
		title       : this.title,
		description : this.description,
		placement   : this.placement,
		icon        : this.icon,
	};

	if (this.constructor.config_properties && this.constructor.config_properties.length) {

		let key;

		for (key of this.constructor.config_properties) {
			result[key] = this[key];
		}
	}

	return result;
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
FormAction.setMethod(function toDry() {
	return {
		value : this.toJSON(),
	};
});

/**
 * Get an element representation
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @param    {Renderer|Element}
 *
 * @return   {HTMLElement}
 */
FormAction.setMethod(function constructElement(renderer) {

	if (renderer && renderer instanceof Blast.Classes.Hawkejs.Element.Element) {
		renderer = renderer.hawkejs_renderer;
	}

	if (!renderer && typeof hawkejs != 'undefined') {
		renderer = hawkejs.scene.general_renderer;
	}

	if (!renderer) {
		return;
	}

	return this._constructElement(renderer);
});

/**
 * Get an element representation
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.2.0
 *
 * @return   {HTMLElement}
 */
FormAction.setMethod(function _constructElement(renderer) {

	let button = renderer.createElement('al-button');
	button.action_instance = this;

	if (this.icon) {
		let icon = renderer.createElement('al-icon');
		icon.icon_name = this.icon;
		button.append(icon);
	}

	if (this.title) {
		button.append(this.title);
	}

	return button;
});

/**
 * Execute this action programatically
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @param    {Event}   event   Optional event
 */
FormAction.setMethod(function execute(event) {
	console.log('Should perform', this.type, 'event');
});

/**
 * Add this action to a context menu
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @param    {HeContextMenu}   menu   The menu to add this action to
 *
 * @return   {HTMLElement}
 */
FormAction.setMethod(function addToContextMenu(menu) {

	if (!menu) {
		return;
	}

	let config = {
		name  : this.name,
		title : this.title,
		icon  : this.icon,
	};

	menu.addEntry(config, click_event => {
		this.execute(click_event);
	});	
});

/**
 * Create the correct action instance
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 */
FormAction.setStatic(function cast(entry) {

	if (!entry) {
		return null;
	}

	if (entry instanceof FormAction) {
		return entry;
	}

	if (!entry.type) {
		return null;
	}

	let constructor = FormAction.getMember(entry.type);

	if (!constructor && entry.type == 'action') {
		constructor = this;
	}

	if (!constructor) {
		return null;
	}

	let result = new constructor(entry);

	return result;
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
FormAction.setStatic(function unDry(obj) {
	return new this(obj);
});
