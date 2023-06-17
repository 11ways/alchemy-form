const LEAF_DROPDOWN = 'al-pathway-leaf-dropdown';
const LEAF_TYPE_SELECT = 'al-pathway-select-leaf-type';
const LEAF_TYPE_ITEM = 'al-pathway-select-leaf-type-item';
const LEAF_VALUE_SELECT = 'al-pathway-select-leaf-value';
const LEAF_VALUE_ITEM = 'al-pathway-select-leaf-value-item';
const LEAF_CHILD = 'al-pathway-leaf-child';

/**
 * The al-pathway-selection element.
 * This represents a leaf (and its children) in the pathway
 * but also a selected value.
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
const Selection = Function.inherits('Alchemy.Element.Form.Base', 'PathwaySelection');

/**
 * The hawkejs template to use
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
Selection.setTemplateFile('form/elements/al_pathway_selection');

/**
 * The possibles leaves that can be chosen
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
Selection.setAssignedProperty('leaf_options');

/**
 * The current selected leaf
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
Selection.setAssignedProperty('selected_leaf');

/**
 * The current value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
Selection.setAssignedProperty('selected_value_id');

/**
 * The value of the selection itself
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
Selection.setAssignedProperty('value', function getValue(val) {

	let new_val = this.getValue();

	if (new_val) {
		return new_val;
	}

	return val;
}, function setValue(val) {

	if (!val) {
		return;
	}

	if (val.leaf_id) {
		let leaf_options = this.getLeafOptions();

		if (leaf_options) {
			for (let i = 0; i < leaf_options.length; i++) {
				let leaf = leaf_options[i];

				if (leaf.id == val.leaf_id) {
					this.selected_leaf = leaf;
					break;
				}
			}
		}
	}

	if (val.value_id) {
		this.selected_value_id = val.value_id;
	}
});

/**
 * Get the current value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
Selection.setMethod(function getValue() {

	let result = {
		leaf_id  : this.selected_leaf?.id,
		value_id : this.selected_value_id,
		child    : null,
	};

	let children_wrapper = this.querySelector('.leaf-children');

	if (children_wrapper?.children?.length) {
		let child = children_wrapper.children[0];

		result.child = child.getValue();
	}

	return result;
});


/**
 * Get the root al-pathway element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @return   {AlPathway}
 */
Selection.setMethod(function getRootAlPathway() {
	return this.closest('al-pathway');
});

/**
 * Get the current selected value instance
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @return   {null|Promise}
 */
Selection.setMethod(function getSelectedValue() {

	if (!this.selected_value_id) {
		return null;
	}

	if (!this.selected_leaf) {
		return null;
	}

	let provider = this.selected_leaf.getProvider();

	if (!provider) {
		return;
	}

	return provider.getById(this.selected_value_id);
});

/**
 * Trigger a change
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
Selection.setMethod(function triggerChange() {

	this.updateButtonTitle();

	let root = this.getRootAlPathway();

	if (root) {
		root.triggerChange(this);
	}
});

/**
 * Update the button title
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
Selection.setMethod(async function updateButtonTitle() {

	let title = await this.getDisplayTitle();

	if (typeof title == 'object' && typeof title.toElement == 'function') {
		title = title.toElement();
	}

	let wrapper = this.querySelector('.select-button-title');

	if (wrapper) {
		Hawkejs.replaceChildren(wrapper, title);
	}
});

/**
 * Get the current title to display
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
Selection.setMethod(function getDisplayTitle() {

	let value_promise = this.getSelectedValue();

	if (value_promise) {
		let pledge = new Pledge();

		Pledge.done(value_promise, (err, res) => {

			if (err) {
				pledge.reject(err);
				return;
			}

			pledge.resolve(alchemy.getDisplayTitle(res));
		});

		return pledge;
	}

	if (this.selected_leaf) {
		return this.selected_leaf.getDisplayTitle();
	}

	return new Classes.Alchemy.Microcopy('pathway-leaf-click-to-select');
});

/**
 * The element is added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
Selection.setMethod(function introduced() {

	let select_button = this.querySelector('.leaf-info');

	let added_listener = false;

	select_button.addEventListener('click', (e) => {
		const that = this;

		e.preventDefault();
		e.stopPropagation();

		this.showLeafDropdown();

		if (added_listener) {
			return;
		}

		added_listener = true;

		document.body.addEventListener('click', function onceOnClick(e) {

			if (e.target.closest('.leaf-options')) {
				return;
			}

			if (e.target.closest('.' + LEAF_DROPDOWN)) {
				return;
			}

			if (that._current_element_under_us) {
				that.removeDropdown();
			}

			document.body.removeEventListener('click', onceOnClick);
			added_listener = false;
		});
	});

	if (!this.selected_leaf) {
		
	}

});

/**
 * Get all the leaves this can represent
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @return   {Leaf[]}
 */
Selection.setMethod(function getLeafOptions() {

	if (this.leaf_options) {
		return this.leaf_options;
	}

	if (this.selected_leaf) {
		return [this.selected_leaf];
	}

	return null;
});

/**
 * Show the leaf options
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
Selection.setMethod(async function showLeafDropdown() {

	let leaf_options = this.getLeafOptions();

	if (!leaf_options?.length) {
		return;
	}

	// Close all existing dropdowns
	this.removeDropdown();

	let div = this.createElement('div');
	div.classList.add(LEAF_DROPDOWN);

	if (leaf_options.length > 1) {
		await this.addLeafSelectionElement(leaf_options, div);
	} else {
		await this.addValuesOfLeafToElement(leaf_options[0], div);
	}

	this.positionElementUnderUs(div);
});

/**
 * Get a leaf option by id
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @param    {String}   id
 *
 * @return   {Leaf}
 */
Selection.setMethod(function getLeafOptionById(id) {

	let leaf_options = this.getLeafOptions();

	if (!leaf_options) {
		return null;
	}

	for (let leaf of leaf_options) {
		if (leaf.id == id) {
			return leaf;
		}
	}

	return null;
});

/**
 * Add the leaf options element to the given wrapper.
 * The user will select a leaf type from this element.
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @param    {Leaf[]}        options
 * @param    {HTMLElement}   target_wrapper
 */
Selection.setMethod(function addLeafSelectionElement(options, target_wrapper) {

	let div = this.createElement('div');
	div.classList.add(LEAF_TYPE_SELECT);

	let ul = this.createElement('ul');
	ul.classList.add(LEAF_TYPE_SELECT + '-ul');
	div.appendChild(ul);

	for (let leaf of options) {

		let li = this.createElement('li');
		li.classList.add(LEAF_TYPE_ITEM);

		li.dataset.value = leaf.id;

		let microcopy = this.createElement('micro-copy');
		microcopy.key = 'pathway-leaf-selection-item';
		microcopy.parameters = {leaf_id: leaf.id || leaf.name};

		li.append(microcopy);

		ul.append(li);
	}

	div.addEventListener('click', e => {

		let clicked_on = e.target;

		if (!clicked_on) {
			return;
		}

		let li = clicked_on.closest('li');

		if (!li) {
			return;
		}

		let leaf_id = li.dataset.value;

		let leaf = this.getLeafOptionById(leaf_id);

		this.setSelectedLeaf(leaf);
		this.addValuesOfLeafToElement(leaf, target_wrapper);
	});

	target_wrapper.appendChild(div);
});

/**
 * Add the values of the given leaf to the given element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @param    {Leaf}          leaf
 * @param    {HTMLElement}   target_wrapper
 */
Selection.setMethod(async function addValuesOfLeafToElement(leaf, target_wrapper) {

	let existing = target_wrapper.querySelector('.' + LEAF_VALUE_SELECT);

	if (existing) {
		existing.remove();
	}

	let values_element = await this.createLeafValuesElement(leaf);

	if (!values_element) {
		return;
	}

	target_wrapper.append(values_element);
});

/**
 * Select a leaf
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @param    {mixed}   leaf
 */
Selection.setMethod(function setSelectedLeaf(leaf) {
	this.selected_leaf = leaf;
	this.selected_value_id = null;
	this.triggerChange();
});

/**
 * Set out leaf type options
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @param    {Leaf[]}   leaves
 */
Selection.setMethod(function setLeafOptions(leaves) {

	if (!leaves?.length) {
		return;
	}

	this.leaf_options = leaves;
});

/**
 * Set the selected child
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @param    {mixed}   value_id
 */
Selection.setMethod(function setSelectedValue(value_id) {

	if (!this.selected_leaf && this.leaf_options?.length == 1) {
		this.setSelectedLeaf(this.leaf_options[0]);
	}

	this.selected_value_id = value_id;

	this.removeDropdown();

	let children = this.querySelector('.leaf-children');

	if (!children) {
		this.triggerChange();
		return;
	}

	Hawkejs.removeChildren(children);

	if (this.selected_leaf?.children?.length) {
		let child_selection = this.createElement('al-pathway-selection');
		child_selection.classList.add(LEAF_CHILD);
		child_selection.setLeafOptions(this.selected_leaf?.children);

		children.appendChild(child_selection);
	}

	this.triggerChange();
});


/**
 * Update the children
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
Selection.setMethod(function populateChildren(children) {

	if (this.selected_leaf?.children?.length) {

		if (!children) {
			children = this.querySelector('.leaf-children');
		}

		let child_selection = this.createElement('al-pathway-selection');
		child_selection.classList.add(LEAF_CHILD);
		child_selection.setLeafOptions(this.selected_leaf?.children);

		children.appendChild(child_selection);

		let value = this.assigned_data.value;

		if (value?.child) {
			child_selection.value = value.child;
		}
	}
});

/**
 * Show the leaf values
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @param    {Leaf}      leaf
 * @param    {Element}   values_element
 */
Selection.setMethod(async function createLeafValuesElement(leaf, values_element) {

	if (!values_element) {
		values_element = this.createElement('div');
	}

	values_element.classList.add(LEAF_VALUE_SELECT);

	let provider = leaf.getProvider();

	if (!provider) {
		return;
	}

	if (!provider.context) {
		provider.context = {};
	}

	let root = this.queryUp('.al-pathway-selection-root');
	provider.context.current_value = root.getValue();

	let page_values = await provider.getAll();

	if (!page_values) {
		return;
	}

	let ul = this.createElement('ul');

	for (let i = 0; i < page_values.length; i++) {
		let value = page_values[i];

		let option = this.createElement('li');
		option.classList.add(LEAF_VALUE_ITEM);
		option.setAttribute('data-value', value.$pk || value._id || value.id);
		option.textContent = alchemy.getDisplayTitle(value);

		ul.appendChild(option);
	}

	values_element.appendChild(ul);

	values_element.addEventListener('click', (e) => {

		let clicked_on = e.target;

		if (!clicked_on) {
			return;
		}

		let value_option = clicked_on.closest('.' + LEAF_VALUE_ITEM);

		if (!value_option) {
			return;
		}

		let value_id = value_option.dataset.value;

		this.setSelectedValue(value_id);
	});

	return values_element;
});

/**
 * Position the given element under us
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
Selection.setMethod(function positionElementUnderUs(element) {

	if (this._current_element_under_us) {
		this._current_element_under_us.remove();
		this._current_element_under_us = null;
		return;
	}

	document.body.append(element);

	let rect = this.getBoundingClientRect();

	let left = rect.x,
	    top = rect.y;

	top += rect.height + 5;

	element.style.left = left + 'px';
	element.style.top = top + 'px';
	element.style.position = 'absolute';

	this._current_element_under_us = element;
});

/**
 * Remove the current dropdown
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
Selection.setMethod(function removeDropdown() {

	let elements = document.querySelectorAll('.' + LEAF_DROPDOWN),
	    result = false;

	if (this._current_element_under_us) {
		this._current_element_under_us.remove();
		this._current_element_under_us = null;
		result = true;
	}

	for (let i = 0; i < elements.length; i++) {
		elements[i].remove();
		result = true;
	}

	return result;
});