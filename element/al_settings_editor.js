/**
 * The settings editor
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
const SettingsEditor = Function.inherits('Alchemy.Element.Form.Base', 'SettingsEditor');

/**
 * The template to use for the content of this element
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
SettingsEditor.setTemplateFile('form/elements/al_settings_editor');

/**
 * The actual settings and their values
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
SettingsEditor.setAssignedProperty('settings_config');

/**
 * Address to send updates t
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.3.0
 * @version  0.3.0
 */
SettingsEditor.setAttribute('src');

/**
 * Populate the settings container
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    1.3.0
 * @version  1.3.0
 */
SettingsEditor.setMethod(function populateSettingsContainer(container) {

	if (!container) {
		container = this.querySelector('.al-settings-container');
	}

	Hawkejs.removeChildren(container);

	this._addGroupToContainer(container, this.settings_config);
});

/**
 * Create an id
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    1.3.0
 * @version  1.3.0
 *
 * @param    {string}   suffix
 *
 * @return   {string}
 */
SettingsEditor.setMethod(function createId(suffix) {

	let id = this.id;

	if (!id) {
		id = 'settings-editor';
	}

	id += '-' + suffix.slug().underscore();

	return id;
});

/**
 * Add the given group to the container
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    1.3.0
 * @version  1.3.0
 *
 * @param    {HTMLElement}   container
 * @param    {Object}        group
 */
SettingsEditor.setMethod(function _addGroupToContainer(container, group) {

	if (!group) {
		return;
	}

	if (!container) {
		throw new Error('No container given');
	}

	let group_element = this.createElement('div');
	group_element.classList.add('al-settings-group');
	group_element.dataset.id = group.group_id;
	group_element.id = this.createId(group.group_id);

	let header_element = this.createElement('header');
	header_element.classList.add('al-settings-group-header');

	let title_element = this.createElement('div');
	title_element.classList.add('al-settings-group-title');
	title_element.dataset.toc_level = group.group_id.count('.');

	let group_title_microcopy = this.createElement('micro-copy');
	group_title_microcopy.key = 'settings.title.group:' + group.group_id;
	group_title_microcopy.fallback = group.name.titleize();

	title_element.append(group_title_microcopy);
	header_element.append(title_element);
	group_element.append(header_element);

	let settings_container = this.createElement('div');
	settings_container.classList.add('al-settings-settings-container');

	for (let setting of group.settings) {
		this._addSettingToGroupElement(settings_container, setting);
	}

	group_element.append(settings_container);
	container.append(group_element);

	for (let child_group of group.children) {
		this._addGroupToContainer(container, child_group);
	}
});

/**
 * Add the given setting to the container
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    1.3.0
 * @version  1.3.0
 *
 * @param    {HTMLElement}   settings_container_element
 * @param    {Object}        setting
 */
SettingsEditor.setMethod(function _addSettingToGroupElement(settings_container_element, setting) {

	if (!setting?.schema) {
		return;
	}

	let value_field = setting.schema.get('value');

	if (!value_field) {
		return;
	}

	let settings_element = this.createElement('div');

	let id = this.createId(setting.setting_id);

	// Set the IDs
	settings_element.dataset.id = setting.setting_id;
	settings_element.id = id;

	// Add the CSS class
	settings_element.classList.add('al-settings-setting');

	// Create the title element
	let header_element = this.createElement('header');
	header_element.classList.add('al-settings-setting-header');

	let title_element = this.createElement('div');
	title_element.classList.add('al-settings-setting-title');

	let title_microcopy = this.createElement('micro-copy');
	title_microcopy.key = 'settings.title:' + setting.setting_id;
	title_microcopy.fallback = setting.name.titleize();

	header_element.append(title_element);
	title_element.append(title_microcopy);

	if (setting.show_description !== false) {
		let description_element = this.createElement('div');
		description_element.classList.add('al-settings-setting-description');

		let description_microcopy = this.createElement('micro-copy');
		description_microcopy.key = 'settings.description:' + setting.setting_id;
		description_microcopy.fallback = setting.description || '';

		header_element.append(description_element);
		description_element.append(description_microcopy);
	}

	settings_element.append(header_element);

	let input_wrapper = this.createElement('div');
	
	let al_field = this.createElement('al-field');
	al_field.id = 'af-' + id;
	al_field.config = value_field;
	al_field.value = setting.current_value;
	al_field.mode = 'inline';

	this.hawkejs_view.registerElementInstance(al_field);

	if (setting.locked) {
		al_field.readonly = true;
	}

	input_wrapper.append(al_field);

	settings_element.append(input_wrapper);

	settings_container_element.append(settings_element);
});

/**
 * This element has been added to the DOM for the first time
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    1.3.0
 * @version  1.3.0
 */
SettingsEditor.setMethod(function introduced() {

	let save_button = this.querySelector('.save-changes');

	save_button.addEventListener('activate', e => {
		this.save();
	});
});

/**
 * Get the changes
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    1.3.0
 * @version  1.3.0
 */
SettingsEditor.setMethod(function getChanges() {

	let result = {};

	let new_value,
	    original_value,
	    elements = this.querySelectorAll('.al-settings-setting'),
	    element,
	    field,
	    i;

	for (i = 0; i < elements.length; i++) {
		element = elements[i];

		field = element.querySelector('al-field');

		if (!field) {
			continue;
		}

		new_value = field.value;
		original_value = field.original_value;

		if (Object.alike(new_value, original_value) || new_value == original_value) {
			continue;
		}

		// Ignore empty values that were not set before
		if (new_value === '' && original_value == null) {
			continue;
		}

		// Ignore empty values that were not set before
		if (new_value === false && original_value == null) {
			continue;
		}

		result[element.dataset.id] = new_value;
	}

	return result;
});

/**
 * Save the changes
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    1.3.0
 * @version  1.3.0
 */
SettingsEditor.setMethod(async function save() {

	if (!this.src) {
		return;
	}

	let changes = this.getChanges();

	let result;

	try {
		result = await alchemy.fetch(this.src, {post: changes});
	} catch (err) {
		throw err;
	}
});