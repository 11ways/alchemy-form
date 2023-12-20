const DOM_ELEMENT = Symbol('dom_element'),
      HAS_APPEARS_LISTENER = Symbol('has_appears_listener');

/**
 * The al-virtual-scroll element:
 * A scrollable container that only renders the visible elements.
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
const VirtualScroll = Function.inherits('Alchemy.Element.Form.WithDataprovider', 'VirtualScroll');

/**
 * The template to use to render an entry
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setAttribute('item-template');

/**
 * Which sides can be used for remote loading?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setAttribute('remote-load-sides', function getRemoteLoadSides(val) {

	if (val == null) {
		val = ['top', 'bottom'];
	} else {
		val = val.split(',');
	}

	return val;
});

/**
 * On what side are new items added?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setAttribute('insert-side', function getInsertSide(val) {

	if (!val) {
		val = 'bottom';
	}

	return val;
});

/**
 * How should the records be sorted?
 * This is only used to inform the remote host.
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setAttribute('sort', function getSort(val) {

	if (val == -1) {
		val = 'desc';
	} else if (val == 1) {
		val = 'asc';
	} else if (typeof val == 'string') {
		val = val.toLowerCase();
	}

	if (!val) {
		val = 'asc';
	}

	return val;
});

/**
 * The batch size
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setAttribute('batch-size', function getBatchSize(value) {

	if (!value || !isFinite(value)) {
		value = 10;
	}

	return value;

}, {type: 'number'});

/**
 * The amount of allowed-invisible-elements to remain in the dom
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setAttribute('allowed-invisible-elements', function getAllowedInvisibleElements(value) {

	if (!value || !isFinite(value) || value < 0) {
		value = this.batch_size;
	}

	if (!value || !isFinite(value)) {
		value = 10;
	}

	// Keep at least 5 elements at each side
	if (value < 5) {
		value = 5;
	}

	return value;

}, {type: 'number'});

/**
 * The expected height of an entry (in pixels)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setAttribute('expected-item-height', {type: 'number'});

/**
 * The expected width of an entry (in pixels)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setAttribute('expected-item-width', {type: 'number'});

/**
 * Getter for the top-trigger element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.addElementGetter('top_trigger', '.top-trigger');

/**
 * Getter for the bottom-trigger element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.addElementGetter('bottom_trigger', '.bottom-trigger');

/**
 * The bidrectional array
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setAssignedProperty('loaded_entries', function getLoadedEntries(val) {

	if (!val) {
		val = new Classes.Develry.BiDirectionalArray();
		this.loaded_entries = val;
	}

	return val;
});

/**
 * Get the expected item height in pixels
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setMethod(function getExpectedItemHeight() {
	return this.expected_item_height || 100;
});

/**
 * Construct the config object used to fetch data
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setMethod(function getRemoteFetchConfig(config) {

	if (!config) {
		config = {};
	}

	if (!config.direction) {
		config.initial_data = true;
	}

	config.insert_side = this.insert_side;
	config.sort = this.sort;
	config.batch_size = this.batch_size;

	this.ensureTriggerElements();

	if (this.page_size) {
		config.page_size = this.page_size;
		config.page = this.getWantedPage();
	}

	let lowest_index = this.loaded_entries.start_index,
	    highest_index = this.loaded_entries.end_index;

	let element;

	if (config.direction == 'top') {
		if (isFinite(lowest_index)) {
			config.before = this.loaded_entries.at(lowest_index)?.record;
		}
	} else if (config.direction == 'bottom') {
		if (isFinite(highest_index)) {
			config.after = this.loaded_entries.at(highest_index)?.record;
		}
	}

	return config;
});

/**
 * Make sure the elements that should trigger new elements
 * to render are added to the DOM
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setMethod(function ensureTriggerElements() {

	let top_trigger = this.top_trigger,
	    bottom_trigger = this.bottom_trigger;

	if (!top_trigger) {
		top_trigger = this.createElement('div');
		top_trigger.classList.add('top-trigger');
		this.prepend(top_trigger);
	}

	if (!bottom_trigger) {
		bottom_trigger = this.createElement('div');
		bottom_trigger.classList.add('bottom-trigger');
		this.append(bottom_trigger);
	}

	if (!Blast.isBrowser || this[HAS_APPEARS_LISTENER]) {
		return;
	}

	this[HAS_APPEARS_LISTENER] = true;

	this.addEventListener('scroll', e => {
		this.handleScrollEvent();
	});

	const onElementVisible = (element) => {

		if (element == top_trigger) {
			this.showEntries('top');
		} else if (element == bottom_trigger) {
			this.showEntries('bottom');
		}
	}

	const observer = new IntersectionObserver((entries, observer) => {
		for (let entry of entries) {
			if (entry.isIntersecting) {
				onElementVisible(entry.target);
			}
		}
	}, {
		threshold: 0,
		rootMargin: '50px 0px 50px 0px',
	});

	observer.observe(top_trigger);
	observer.observe(bottom_trigger);
});

/**
 * Apply the fetched data
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setMethod(function applyFetchedData(err, result, config) {

	if (err) {
		console.error(err);
		return;
	}

	if (!result) {
		return;
	}

	let records;

	if (Array.isArray(result)) {
		records = result;
	} else if (result.length) {
		// This way we keep `DocumentList` instances as they are!
		records = result;
	} else {
		records = result.records;
	}

	let append;

	if (config.initial_data || config.append) {
		append = true;
	} else if (config.append != null) {
		append = config.append;
	} else {
		append = config.direction == 'bottom';
	}

	if (append) {
		//records = Array.cast(records).reverse();
		for (let record of records) {
			let entry = {record};
			let index = this.loaded_entries.append(entry);
			entry.index = index;
		}
	} else {
		for (let record of records) {
			let entry = {record};
			let index = this.loaded_entries.prepend(entry);
			entry.index = index;
		}
	}

	this.addMissingElementsFromLoadedEntries();
});

/**
 * Get the highest index of a dom element that has been added
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setMethod(function getDomIndexRange() {

	let elements = this.querySelectorAll('[data-loaded-entry-index]'),
	    highest = -Infinity,
	    lowest = Infinity,
	    element;

	for (let i = 0; i < elements.length; i++) {
		element = elements[i];
		let index = Number(element.dataset.loadedEntryIndex);

		if (index > highest) {
			highest = index;
		}

		if (index < lowest) {
			lowest = index;
		}
	}

	return [lowest, highest];
});

/**
 * Handle the scroll event
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setMethod(function handleScrollEvent() {
	// @TODO
});

/**
 * Add missing elements from loaded entries
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setMethod(function showEntries(side) {

	let [lowest_dom_index, highest_dom_index] = this.getDomIndexRange();
	let id_to_check;

	if (side == 'bottom') {
		id_to_check = highest_dom_index + this.batch_size - 1;
	} else {
		id_to_check = lowest_dom_index - this.batch_size + 1;
	}

	this.addMissingElementsFromLoadedEntries();

	// If the id to check is already loaded, don't do anything
	if (this.loaded_entries.at(id_to_check)) {
		return;
	}

	if (this.remote_load_sides.includes(side)) {
		this.loadRemoteData({direction: side});
	}
});

/**
 * Insert a new record from somewhere
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setMethod(function insertRecord(record) {

	let entry = {record},
	    index;

	if (this.insert_side == 'bottom') {
		index = this.loaded_entries.append(entry);
	} else {
		index = this.loaded_entries.prepend(entry);
	}

	entry.index = index;

	let is_at_bottom = this.scrollTop + this.clientHeight >= this.scrollHeight;

	// Add possible new elements
	let add_count = this.addMissingElementsFromLoadedEntries();

	if (is_at_bottom && add_count > 0) {
		this.scrollTop = this.scrollHeight;
	}
});

/**
 * Add missing elements from loaded entries
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setMethod(function addMissingElementsFromLoadedEntries() {

	let [lowest_dom_index, highest_dom_index] = this.getDomIndexRange();

	let top_result,
	    bottom_result;

	if (highest_dom_index == -Infinity) {
		highest_dom_index = -1;
	}

	if (lowest_dom_index == Infinity) {
		lowest_dom_index = 0;
	}

	let add_to_bottom = 0,
	    add_to_top = 0;

	// We add even more padding to this isVisible check, just to make sure
	if (Blast.isNode) {
		add_to_top = 10;
	} else if (this.top_trigger?.isVisible?.(100)) {
		add_to_top = 10;
	}

	if (this.bottom_trigger?.isVisible?.(100)) {
		add_to_bottom = 10;
	}

	let added = [];

	let top_index = lowest_dom_index,
	    bottom_index = highest_dom_index,
	    add_count = 0;

	while (true) {

		if (add_to_top > 0) {
			add_to_top--;
			top_index--;
			top_result = this._addAdjacent(this.top_trigger, top_index);

			if (top_result) {
				added.push(top_index);
				add_count++;
			}
		} else {
			top_result = false;
		}

		if (add_to_bottom > 0) {
			add_to_bottom--;
			bottom_index++;
			bottom_result = this._addAdjacent(this.bottom_trigger, bottom_index);

			if (bottom_result) {
				added.push(bottom_index);
				add_count++;
			}
		} else {
			bottom_result = false;
		}

		if (!top_result && !bottom_result) {
			break;
		}
	}

	this.cullInvisibleElements(added);

	return add_count;
});

/**
 * Cull invisible elements from the DOM.
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setMethod(function cullInvisibleElements(added) {

	if (!Blast.isBrowser) {
		return;
	}

	if (!added) {
		added = [];
	}

	// Get the lowest and highest dom index
	let [lowest_dom_index, highest_dom_index] = this.getDomIndexRange();

	let lowest_element = this.querySelector('[data-loaded-entry-index="' + lowest_dom_index + '"]'),
	    highest_element = this.querySelector('[data-loaded-entry-index="' + highest_dom_index + '"]');

	let lowest_to_remove = [],
	    highest_to_remove = [];

	const isNear = (element) => {

		if (added.includes(element)) {
			return true;
		}

		if (element == this.top_trigger) {
			return true;
		}

		if (element == this.bottom_trigger) {
			return true;
		}

		if (element.isVisible()) {
			return true;
		}

		return false;
	};

	while (highest_element) {
		
		if (isNear(highest_element)) {
			break;
		}

		highest_to_remove.push(highest_element);
		highest_element = highest_element.previousElementSibling;
	}

	while (lowest_element) {

		if (isNear(lowest_element)) {
			break;
		}

		lowest_to_remove.push(lowest_element);
		lowest_element = lowest_element.nextElementSibling;
	}

	let allowed_invisible_elements = this.allowed_invisible_elements;

	if (highest_to_remove.length > allowed_invisible_elements) {
		highest_to_remove = highest_to_remove.slice(0, highest_to_remove.length - allowed_invisible_elements);

		for (let element of highest_to_remove) {
			this._hideElement(element, 'bottom');
		}
	}

	if (lowest_to_remove.length > allowed_invisible_elements) {
		lowest_to_remove = lowest_to_remove.slice(0, lowest_to_remove.length - allowed_invisible_elements);

		for (let element of lowest_to_remove) {
			this._hideElement(element, 'top');
		}
	}
});

/**
 * Hide the given element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setMethod(function _hideElement(element, removed_from_side) {
	this.increaseScrollPaddingBecauseRemoved(removed_from_side, element);
	element.remove();
});

/**
 * Get the scrollpadding for the given side
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setMethod(function getScrollPadding(side) {

	if (typeof side != 'string') {
		side = this.bottom_trigger == side ? 'bottom' : 'top';
	}

	let result = this[side + '_scroll_padding'];

	if (!result) {
		result = 0;
	}

	return result;
});

/**
 * Set the scrollpadding for the given side
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setMethod(function setScrollPadding(side, amount) {

	if (!amount || amount < 0) {
		amount = 0;
	}

	this[side + '_scroll_padding'] = amount;

	let trigger = this[side + '_trigger'];

	if (!trigger) {
		return;
	}

	let style = trigger.style;

	if (amount > 0) {
		style.height = amount + 'px';
	} else {
		style.height = '';
	}
});

/**
 * Increase the scroll padding of the given side with the given element height
 * because it has been removed from the given side
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 *
 * @param    {String}   side
 * @param    {Element}  element
 */
VirtualScroll.setMethod(function increaseScrollPaddingBecauseRemoved(side, element) {
	element.dataset.removedFromSide = side;
	this.increaseScrollPadding(side, element);
});

/**
 * Increase the scroll padding of the given side with the given element height.
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setMethod(function increaseScrollPadding(side, element) {

	let amount = element.offsetHeight;

	let current = this.getScrollPadding(side);
	this.setScrollPadding(side, current + amount);
});

/**
 * Decrease the scroll padding of the given side
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 *
 * @param    {String}   side
 */
VirtualScroll.setMethod(function decreaseScrollPadding(side, element) {
	let amount = element.offsetHeight;
	let current = this.getScrollPadding(side);
	this.setScrollPadding(side, current - amount);
});

/**
 * Decrease the scroll padding of the given side
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 *
 * @param    {Element}   side_trigger
 * @param    {Element}   element
 */
VirtualScroll.setMethod(function decreaseScrollPaddingBecauseInserted(side_trigger, element) {

	let side = this.bottom_trigger == side_trigger ? 'bottom' : 'top';
	let previous_removed_from_side = element.dataset.removedFromSide;

	if (previous_removed_from_side) {
		this.decreaseScrollPadding(previous_removed_from_side, element);
	} else {
		this.decreaseScrollPadding(side, element);
	}

	element.removeAttribute('data-removed-from-side');
});

/**
 * Add an element adjacent to the given trigger
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setMethod(function _addAdjacent(trigger_element, dom_index) {

	let position = trigger_element == this.bottom_trigger ? 'beforebegin' : 'afterend';
	let is_top = trigger_element == this.top_trigger;

	let entry = this.loaded_entries.at(dom_index);

	if (!entry) {
		return false;
	}

	let element = this.getEntryElement(entry);

	if (!element) {
		return false;
	}

	let current_scroll = this.scrollTop,
	    first_element = this.top_trigger.nextElementSibling,
	    first_offset = first_element?.offsetTop;

	trigger_element.insertAdjacentElement(position, element);
	this.decreaseScrollPaddingBecauseInserted(trigger_element, element);

	if (is_top && first_offset != null) {
		let new_offset = first_element.offsetTop;
		let difference = new_offset - first_offset;
		let new_scroll = difference + current_scroll;
		this.scrollTop = new_scroll;
	}

	return true;
});

/**
 * Get the entry element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setMethod(function getEntryElement(entry) {

	if (!entry) {
		return;
	}

	let result = entry[DOM_ELEMENT];

	if (!result) {
		result = this.createElement('div');
		entry[DOM_ELEMENT] = result;
		result.textContent = entry.record.name;
		result.dataset.loadedEntryIndex = entry.index;

		if (typeof hawkejs !== 'undefined') {
			let placeholder = hawkejs.scene.general_renderer.partial(this.item_template, {
				record: entry.record
			});

			result.append(placeholder);
		}
	}

	return result;
});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.9
 * @version  0.2.9
 */
VirtualScroll.setMethod(function introduced() {
	this.ensureTriggerElements();
});