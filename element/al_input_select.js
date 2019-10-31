/**
 * The base alchemy-input element
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var AlInputSelect = Function.inherits('Alchemy.Element.AlInput', function AlInputSelect() {

	AlInputSelect.super.call(this);
});

/**
 * The remote url attribute
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setAttribute('src');

/**
 * The hawkejs template to use
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setTemplateFile('form/elements/al_input_select');

/**
 * The stylesheet to load for this element
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setProperty('css_file', 'al_input_select');

/**
 * The sortable property
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setAssignedProperty('sortable');

/**
 * Does this element have focus?
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setProperty(function is_focused() {
	return document.activeElement === this.type_area;
});

/**
 * Is the dropdown open?
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setProperty(function is_open() {
	return this.classList.contains('open');
});

/**
 * The current option:
 * the last added item when a multiple input,
 * or the only item when only a single item is allowed
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setProperty(function current_option() {

	var entry,
	    i;

	if (!this._current_option) {

		for (i = this.wrapper.childNodes.length - 1; i >= 0; i--) {
			entry = this.wrapper.childNodes[i];

			if (!entry.dataset || !entry.dataset.value) {
				continue;
			}

			this._current_option = entry;
			break;
		}
	}

	return this._current_option;
}, function setCurrentOption(value) {
	this._current_option = value;
});

/**
 * Is the dropdown open?
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setProperty(function multiple() {
	return this.hasAttribute('multiple');
}, function setMultiple(val) {
	if (val) {
		this.setAttribute('multiple', 'multiple');

		if (!Array.isArray(this.value)) {
			this.value = Array.cast(this.value);
		}
	} else {
		this.removeAttribute('multiple');

		if (Array.isArray(this.value)) {
			this.value = this.value[0];
		}
	}
});

/**
 * The page we've loaded so far
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setProperty(function loaded_page() {
	return this._loaded_page || 1;
}, function setLoadedPage(page) {
	return this._loaded_page = page;
});

/**
 * Is the dropdown loading
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setProperty(function loading_dropdown() {
	return this._loading_dropdown;
}, function setLoadingDropdown(loading) {

	var change;

	if (loading != Boolean(this._loading_dropdown)) {
		change = true;
	}

	this._loading_dropdown = loading;

	// Add the pager live class again
	if (change && !loading) {
		this.dropdown_pager.classList.add('js-he-ais-pager');
	}

	return loading;
});

/**
 * The search value
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setProperty(function search_value() {
	var type_area = this.type_area;

	if (type_area) {
		return type_area.value;
	}
});

/**
 * Getter for the value-wrapper div
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.addElementGetter('wrapper', '.value-wrapper');

/**
 * Getter for the text input
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.addElementGetter('type_area', '.type-area');

/**
 * Getter for the dropdown wrapper
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.addElementGetter('dropdown', '.dropdown');

/**
 * Getter for the dropdown content
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.addElementGetter('dropdown_content', '.dropdown-content');

/**
 * Getter for the dropdown pager
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.addElementGetter('dropdown_pager', '.dropdown-pager');

/**
 * This element has been inserted in the DOM
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function introduced() {

	var that = this;

	this._initAttributes();

	if (this.sortable) {
		this.makeSortable();
	}

	if (!AlInputSelect.has_paginator_viewer) {
		AlInputSelect.has_paginator_viewer = true;

		hawkejs.scene.appears('js-he-ais-pager', {live: true, padding: 10, throttle: 200}, function onInfinity(el) {
			var ais = el.parentElement.parentElement;
			ais.loadOptions(++ais.loaded_page);
		});
	}

	// Give the type area focus when clicking on the wrapper
	this.wrapper.addEventListener('click', function onClick(e) {
		that.open();
		that.type_area.focus();
	});

	// Do NOT bubble the 'change' event coming from the type area
	this.type_area.addEventListener('change', function onChange(e) {
		e.stopPropagation();
	});

	// Listen to the keydown event on the type area
	this.type_area.addEventListener('keydown', function onKeydown(e) {
		var is_input = e.target === this;
		that.onTypeAreaKeydown(e, is_input);
		that.refitTypeArea(e);
	});

	this.type_area.addEventListener('keyup', function onKeyUp(e) {
		var is_input = e.target === this;
		that.onTypeAreKeyup(e, is_input);
		that.refitTypeArea();
	});

	that.refitTypeArea();

	// On clicking the dropdown content
	this.dropdown_content.addEventListener('click', function onClick(e) {

		var element,
		    found;

		element = e.target;

		while (!found) {
			if (element.getAttribute('role') == 'option') {
				found = true;
			} else {
				if (!element.parentElement) {
					return;
				}

				element = element.parentElement;
			}
		}

		if (element) {
			that.onClickOption(e, element);
		}
	});
});

/**
 * On options
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function onOptionsAssignment(options) {

	if (typeof options.multiple != 'undefined') {
		this.multiple = options.multiple;
	}

	if (typeof options.sortable != 'undefined') {
		this.sortable = options.sortable;
	}

	if (!this.form) {
		return;
	}

	// If it has a form, we'll make it sortable by default
	if (this.sortable == null) {
		this.sortable = true;
	}
});

/**
 * On original value
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function onOriginalValueAssignment(value, old_value) {

	if (this.multiple) {
		value = Array.cast(value);
	}

	// Sever all references by cloning the value
	value = JSON.clone(value);

	if (!this.value) {
		this.selectByValue(value);
	}
});

/**
 * On new value
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function onValueAssignment(value, old_value) {

	if (Object.alike(value, old_value)) {
		return;
	}

	if (this.multiple) {
		value = Array.cast(value);
	}

	this._selectByValue(value);

	return value;
});

/**
 * On sortable
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function onSortableAssignment(value, old_value) {

	if (value == old_value) {
		return;
	}

	if (value) {
		this.makeSortable();
	}
});

/**
 * Initialize certain attributes (once)
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function _initAttributes() {

	if (this.assigned_data.inited_attributes) {
		return;
	}

	this.assigned_data.inited_attributes = true;

	// This serves as an ARIA 1.1 combobox
	this.setAttribute('role', 'combobox');

	// Expanded is off by default
	this.setAttribute('aria-expanded', 'false');

	// This combobox has a listbox as a popup
	this.setAttribute('aria-haspopup', 'listbox');

	// Disable autocomplete on the type area
	this.type_area.setAttribute('autocomplete', 'off');

	// Set the initial order
	this.type_area.style.order = 0;

	// Set multiple if wanted
	if (this.options.multiple) {
		this.multiple = true;
	}
});

/**
 * Load remote content
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   page
 */
AlInputSelect.setMethod(function loadRemote(page) {

	var that = this,
	    url;

	if (this.src) {
		url = this.src;
	} else if (this.options.url) {
		url = this.options.url;
	} else if (this.options.route) {
		url = hawkejs.scene.helpers.Router.routeUrl(this.options.route);
	}

	if (!url) {
		return;
	}

	this.loading_dropdown = true;

	let data = {
		search : this.search_value
	};

	// @TODO: add page & query stuff
	hawkejs.scene.fetch(url, {get: data}, function gotResponse(err, data, xhr) {

		var record,
		    item,
		    i;

		if (err) {
			that.loading_dropdown = false;
			throw err;
		}

		if (page == null) {
			Hawkejs.removeChildren(that.dropdown_content);
		}

		for (i = 0; i < data.records.length; i++) {
			record = data.records[i];

			item = that._makeOption(record._id || record.id, record);
			that.addToDropdown(item);
		}

		that.loading_dropdown = false;
	});
});

/**
 * Load options
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   page
 */
AlInputSelect.setMethod(function loadOptions(page) {

	var that = this,
	    model,
	    field;

	// If an URL is provided, use that
	if (this.options.url || this.options.route) {
		return this.loadRemote(page);
	}

	field = this.model_field;

	if (!field) {
		return;
	}

	this.loading_dropdown = true;

	model = this.form.getModel(field.modelName);

	model.find('all', {
		limit : 20,
		page  : page
	}, function gotResults(err, records) {

		if (err) {
			throw err;
		}

		records.forEach(function eachRecord(record) {
			var item = that._makeOption(record._id || record.id, record);
			that.addToDropdown(item);
		});

		that.loading_dropdown = false;
	});
});

/**
 * Open the dropdown
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function open() {

	var that = this;

	this.loadOptions();

	this.setAttribute('aria-expanded', 'true');
	this.classList.add('open');
	this.emit('open');
	this.dropdown_content.scrollTop = 0;

	// Make the dropdown the same width
	this.dropdown.style.width = ~~this.clientWidth + 'px';

	if (this._listening_to_body_click) {
		return;
	}

	if (!this._closer) {
		this._closer = function onClick(e) {

			var element = e.target,
			    is_child = false;

			if (element == that) {
				return;
			}

			while (element) {
				if (element.parentElement == that) {
					is_child = true;
					break;
				} else {
					element = element.parentElement;
				}
			}

			if (!is_child) {
				that.close();
			}
		};
	}

	// Listen to click events on the entire window
	// (in case the body is too short)
	window.addEventListener('click', this._closer);
	this._listening_to_body_click = true;
});

/**
 * Close the dropdown
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function close() {
	this.setAttribute('aria-expanded', 'false');
	this.classList.remove('open');
	this.emit('close');

	if (this._closer && this._listening_to_body_click) {
		window.removeEventListener('click', this._closer);
		this._listening_to_body_click = false;
	}
});

/**
 * Create an option or selected value
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   type    "value" or "option"
 * @param    {Mixed}    value   The actual value of this item
 * @param    {Mixed}    data    String or object
 * @param    {Function} callback
 *
 * @return   {HTMLElement}
 */
AlInputSelect.setMethod(function _makeValueItem(type, value, data, callback) {

	var that = this,
	    placeholder,
	    variables,
	    view_name,
	    options,
	    result = Hawkejs.Hawkejs.createElement('div'),
	    pledge;

	// Set the value
	result.dataset.value = value;

	// Get the optional view name
	// eg: "view_option" or "view_value"
	view_name = this.options['view_' + type];

	if (!data && this.options.values && this.options.values[value]) {
		data = this.options.values[value];
	}

	if (!callback) {
		callback = Function.thrower;
	}

	pledge = Function.series(function getData(next) {

		var field,
		    model;

		// If we already have a data object,
		// or there is no form so we can't get one,
		// go to the next
		if (data || !that.form) {
			return next();
		}

		field = that.form.getModelField(that.options.name);

		if (!field) {
			return next();
		}

		// Get the model name
		model = that.form.getModel(field.modelName);

		model.find('first', {conditions: {_id: value}}, function gotResult(err, result) {

			if (err) {
				return next(err);
			}

			data = result;

			next();
		});
	}, function doView(next) {

		if (!view_name) {
			if (data != null) {
				result.textContent = data.title || data.name || data._id || data.id || data;
			} else {
				result.textContent = value;
			}

			return next();
		}

		options = {
			wrap  : false,
			print : false
		};

		variables = {
			value   : value,
			data    : data
		};

		placeholder = that.view.print_element(view_name, variables, options);

		placeholder.getContent(function gotResult(err, html) {

			if (err) {
				return next(err);
			}

			result.innerHTML = html;
			next();
		});

	}, function done(err) {
		callback(err);
	});

	// Delay getContent for this element
	this.delayGetContentFor(pledge);

	return result;
});

/**
 * Create an option
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {HTMLElement}
 */
AlInputSelect.setMethod(function _makeOption(value, data, callback) {

	var result = this._makeValueItem('option', value, data, callback);

	result.setAttribute('role', 'option');

	return result;
});

/**
 * Create a value element
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {HTMLElement}
 */
AlInputSelect.setMethod(function _makeValue(value, data, callback) {

	var result = this._makeValueItem('value', value, data, callback);

	result.classList.add('value');

	if (this.sortable) {
		this.makeValueDraggable(result);
	}

	return result;
});

/**
 * Add an item to the dropdown
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {HTMLElement}   item
 */
AlInputSelect.setMethod(function addToDropdown(item) {

	var entry,
	    i;

	for (i = 0; i < this.dropdown_content.children.length; i++) {
		entry = this.dropdown_content.children[i];

		if (!entry.dataset) {
			continue;
		}

		// Don't add something twice
		if (entry.dataset.value == item.dataset.value) {
			return;
		}
	}

	this.dropdown_content.appendChild(item);
});

/**
 * Render the content:
 * method called by Hawkejs during render
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function getContent(callback) {

	var that = this,
	    tasks = [];

	this._initAttributes();

	// If options have been explictly defined, add them to the dropdown now
	if (this.options) {
		Object.each(this.options.values, function eachValue(value, key) {
			tasks.push(function makeOption(next) {
				var item = this._makeOption(key, value, next);
				that.addToDropdown(item);
			});
		});
	}

	if (this.delay_for_elements) {
		this.delay_for_elements.forEach(function eachPledge(pledge) {
			tasks.push(function waitForPledge(next) {
				pledge.handleCallback(next);
			});
		});
	}

	this.get_content_pledge = Function.parallel(tasks, callback);

	if (this.waiting_for_pledge) {
		while (this.waiting_for_pledge.length) {
			this.get_content_pledge.handleCallback(this.waiting_for_pledge.pop());
		}
	}
});

/**
 * Handle an arrow keydown
 *
 * @author   Jelle De Loecker   <jelle@kipdola.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function handleArrowKey(event) {

	var child_count,
	    direction,
	    element,
	    index,
	    i;

	if (!this.is_open) {
		this.open();
	}

	if (event.key == 'ArrowUp') {
		direction = -1;
	} else {
		// Down
		direction = 1;
	}

	index = this._selected_index;

	if (index == null) {
		index = -1;
	}

	index += direction;

	// How many children are there?
	child_count = this.dropdown_content.children.length;

	if (index < 0) {
		index = child_count - 1;
	}

	if (index > child_count - 1) {
		index = 0;
	}

	for (i = 0; i < this.dropdown_content.children.length; i++) {
		element = this.dropdown_content.children[i];

		if (i == index) {
			element.classList.add('selected');
			this._selected_entry = element._entry;
		} else {
			element.classList.remove('selected');
		}
	}

	this._selected_index = index;
});

/**
 * Get the selection of an input
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function _getSelection(input) {

	var sel_len,
	    result = {},
	    sel;

	if ('selectionStart' in input) {
		result.start = input.selectionStart;
		result.length = input.selectionEnd - result.start;
	} else if (document.selection) {
		input.focus();
		sel = document.selection.createRange();
		sel_len = document.selection.createRange().text.length;
		sel.moveStart('character', -input.value.length);
		result.start = sel.text.length - sel_len;
		result.length = sel_len;
	}

	return result;
});

/**
 * Move input field
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function advanceSelection(direction) {

	var cursor_at_edge,
	    value_length,
	    selection,
	    $tail,
	    tail,
	    idx;

	if (direction == 0) {
		return;
	}

	// Reverse direction for right-to-left inputs
	if (this.rtl) {
		direction *= -1;
	}

	tail = direction > 0 ? 'last' : 'first';

	selection = this._getSelection(this.type_area);

	console.log('Selection is now', selection, 'focus is', this.is_focused);

	if (this.is_focused) {
		value_length = this.type_area.value.length;

		if (selection) {
			if (direction < 0) {
				cursor_at_edge = selection.start === 0 && selection.length === 0;
			} else {
				cursor_at_edge = selection.start === value_length;
			}

			if (cursor_at_edge && !value_length) {
				this.advanceCaret(direction);
			}
		}
	} else {
		console.log('@TODO: Advance selection');
	}

});

/**
 * Move input field
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function advanceCaret(direction) {
	this.type_area.incrementIndexInParent(direction);
	this.type_area.focus();
});

/**
 * The user is typing
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function onTypeAreaKeydown(e, is_input) {

	switch (e.key) {
		case 'ArrowUp':
		case 'ArrowDown':
			this.handleArrowKey(e);
			return;

		case 'ArrowLeft':
			this.advanceSelection(-1);
			return;

		case 'ArrowRight':
			this.advanceSelection(1);
			return;

		case 'Backspace':
			if (this.type_area.value.length) {
				return;
			}

			this.removeItem(this.type_area.previousSibling);
			break;

		case 'Delete':
			if (this.type_area.value.length) {
				return;
			}

			this.removeItem(this.type_area.nextSibling);
			break;
	}

});

/**
 * The user is typing
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function onTypeAreKeyup(e, is_input) {

	console.log('Typearea up:', e.key, is_input, e);

	switch (e.key) {
		case 'ArrowUp':
		case 'ArrowDown':
		case 'ArrowLeft':
		case 'ArrowRight':
			return;
	}

	if (this.search_value && this.search_value.length > 2) {
		this.refreshRemote();
	}
});


/**
 * Refresh the remote
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod('refreshRemote', Fn.throttle(function refreshRemote() {
	this.loadRemote();
}, {
	minimum_wait  : 350,
	immediate     : false,
	reset_on_call : true
}));

/**
 * An option has been clicked
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function onClickOption(e, element) {

	// Element must exist
	if (!element) {
		return;
	}

	// Value must not be null
	if (element.dataset.value == null) {
		return;
	}

	this.selectByValue(element.dataset.value);
});

/**
 * Select an item by its value and add it to this element's value
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function selectByValue(value) {

	var i;

	if (this.multiple) {
		if (Array.isArray(value)) {
			for (i = 0; i < value.length; i++) {
				this.selectByValue(value[i]);
			}
			return;
		}
	}

	if (value != null) {
		value = String(value);
	}

	if (this.multiple) {

		// If it's already selected, just close the dropdown
		if (this.value.indexOf(value) > -1) {
			return this.close();
		}

		this.value.push(value);

		// Need to call _selectByValue manually,
		// since pushing to the current value won't trigger a change
		this._selectByValue(value);

		// Order the values
		this.syncValueOrderWithElements();
	} else {
		this.value = value;
	}
});

/**
 * Actually set the display values
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function _selectByValue(value) {

	var i;

	console.log('Multiple?', this.multiple, 'current option', this.current_option);

	if (!this.multiple) {
		// Remove the current option, since only 1 is allowed
		if (this.current_option) {
			this.current_option.setAttribute('removed', 'yup')
			this.current_option.remove();
		}
	}

	if (Array.isArray(value)) {
		if (!this.multiple) {
			value = value[0];
		} else {
			for (i = 0; i < value.length; i++) {
				this._selectByValue(value[i]);
			}
			return;
		}
	}

	if (value != null) {
		value = String(value);
	}

	this.current_option = this._makeValue(value);
	this.type_area.parentElement.insertBefore(this.current_option, this.type_area);
	this.close();
});

/**
 * Measure string length
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function measureString(str, element, event) {

	var test_element,
	    printable,
	    selection,
	    width,
	    code;

	// We need to know what effect the keydown event will have
	if (event && event.type && event.type.toLowerCase() == 'keydown' && !event.metaKey && !event.altKey) {
		code = event.keyCode;
		printable = (
			(code >= 97 && code <= 122) || // a-z
			(code >= 65 && code <= 90)  || // A-Z
			(code >= 48 && code <= 57)  || // 0-9
			code === 32 // space
		);

		if (event.key == 'Delete' || event.key == 'Backspace') {
			selection = this._getSelection(this.type_area);
			if (selection.length) {
				str = str.substring(0, selection.start) + str.substring(selection.start + selection.length);
			} else if (event.key == 'Backspace' && selection.start) {
				str = str.substring(0, selection.start - 1) + str.substring(selection.start);
			} else if (event.key == 'Delete' && typeof selection.start !== 'undefined') {
				str = str.substring(0, selection.start) + str.substring(selection.start + 1);
			}
		} else if (printable) {
			str += event.key;
		}
	}

	if (element._measured_string == str) {
		return element._measured_string_width;
	}

	if (!str) {
		return 0;
	}

	test_element = document.createElement('test');
	test_element.style.position = 'absolute';
	test_element.style.top = '-99999';
	test_element.style.left = '-99999';
	test_element.style.width = 'auto';
	test_element.style.padding = '0';
	test_element.style.whiteSpace = 'pre';
	test_element.textContent = str;
	document.body.appendChild(test_element);

	this.type_area.transferStylesTo(test_element, [
		'letterSpacing',
		'fontSize',
		'fontFamily',
		'fontWeight',
		'textTransform'
	]);

	width = test_element.clientWidth;
	test_element.remove();

	element._measured_string = str;
	element._measured_string_width = width;

	return width;
});

/**
 * Refit the type area
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function refitTypeArea(e) {
	var width = this.measureString(this.type_area.value, this.type_area, e);
	this.type_area.style.width = (4 + width) + 'px';
});

/**
 * Make it sortable
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function makeSortable() {

	var that = this,
	    touch_clone,
	    element,
	    root,
	    tap,
	    i;

	if (!Blast.isBrowser) {
		return;
	}

	if (this._has_sortable_events) {
		return;
	}

	this._has_sortable_events = true;

	// The wrapper is the root of the sortable elements
	root = this.wrapper;

	for (i = 0; i < this.wrapper.children.length; i++) {
		element = this.wrapper.children[i];

		if (element.hasAttribute('data-value')) {
			this.makeValueDraggable(element);
		}
	}

	element = null;

	function getDragDirection(event) {

		var direction,
		    target = event.target,
		    rect,
		    mid,
		    x;

		if (!target) {
			return null;
		}

		rect = target.getBoundingClientRect();
		mid = rect.width / 2;
		x = event.pageX - rect.x;

		if (x >= mid) {
			direction = 1;
		} else {
			direction = -1;
		}

		return direction;
	}

	function onDragOver(e) {

		var direction,
		    before;

		// We sometimes pass regular objects here,
		// these are only for simulating drags
		if (e.preventDefault) {
			e.preventDefault();
			e.dataTransfer.dropEffect = 'move';
		}

		if (e.target && e.target !== element) {

			if (e.target.parentElement != root) {
				return;
			}

			direction = getDragDirection(e);

			if (direction > 0) {
				before = e.target.nextSibling;
			} else {
				before = e.target;
			}

			root.insertBefore(element, before);
		}
	}

	function onDragEnd(e) {
		e.preventDefault();

		root.removeEventListener('dragover', onDragOver);
		root.removeEventListener('dragend', onDragEnd);

		window.removeEventListener('dragover', onDragElsewhere);
		window.removeEventListener('drop', onDragElsewhere);

		that.syncValueOrderWithElements();
	}

	function onDragElsewhere(e) {
		e.preventDefault();
	}

	this.addEventListener('dragstart', function onDragStart(e) {

		element = e.target;

		// Limit the movement type
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('Text', element.textContent);

		root.addEventListener('dragover', onDragOver, false);
		root.addEventListener('dragend', onDragEnd, false);

		window.addEventListener('dragover', onDragElsewhere);
		window.addEventListener('drop', onDragElsewhere);

		Blast.nextTick(function onNextTick() {
			if (element) {
				element.classList.add('ghost');
			}
		});
	}, false);

	this.addEventListener('touchstart', function onTouchStart(e) {

		var rect;

		tap = e.touches[0];

		// Make sure the touch started on a value element
		if (!tap.target.hasAttribute('data-value') || tap.target.parentElement != root) {
			tap = null;
			return;
		}

		// Remember the original target (the one we'll actually move)
		element = tap.target;

		// Get the bounding rectangle coordinates
		rect = tap.target.getBoundingClientRect();

		// Clone the entire node
		touch_clone = tap.target.cloneNode(true);

		// Transfer the stylings
		tap.target.transferStylesTo(touch_clone);
		touch_clone.style.position = 'absolute';
		touch_clone.style.left = rect.x + 'px';
		touch_clone.style.top = rect.y + 'px';
		touch_clone.style.opacity = 0.5;
		touch_clone.style.zIndex = 999999;

		// Add it to the body
		document.body.appendChild(touch_clone);
	});

	this.addEventListener('touchmove', function onTouchMove(e) {

		if (!tap || !touch_clone) {
			return;
		}

		var display,
		    target,
		    touch = e.touches[0],
		    dx    = touch.clientX - tap.clientX,
		    dy    = touch.clientY - tap.clientY;

		touch_clone.style.transform = 'translate3d(' + dx + 'px, ' + dy + 'px, 0)';

		display = touch_clone.style.display;
		touch_clone.style.display = 'none';

		// Get the element at the current touching position
		target = document.elementFromPoint(touch.clientX, touch.clientY);

		if (target) {
			// Simulate the drag over vent
			onDragOver({
				target  : target,
				clientX : touch.clientX,
				clientY : touch.clientY,
				pageX   : touch.pageX,
				pageY   : touch.pageY
			});
		}

		// Restore the original display setting
		touch_clone.style.display = display;
	});

	window.addEventListener('touchend', function onTouchEnd(e) {

		tap = null;
		element = null;

		if (touch_clone) {
			touch_clone.remove();
			that.syncValueOrderWithElements();
		}
	});
});

/**
 * Make a value draggable
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function makeValueDraggable(element) {

	if (element.draggable) {
		return;
	}

	element.draggable = true;
});

/**
 * Sync the value array with the elements
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function syncValueOrderWithElements() {

	var element,
	    current_index,
	    index = -1,
	    i;

	if (!this.multiple) {
		return;
	}

	for (i = 0; i < this.wrapper.children.length; i++) {
		element = this.wrapper.children[i];

		if (!element.hasAttribute('data-value')) {
			continue;
		}

		// This will be the index it needs to be in the array
		index++;

		// Get the current index of the value in the value array
		current_index = this.value.indexOf(element.getAttribute('data-value'));

		this.value.splice(index, 0, this.value.splice(current_index, 1)[0]);
	}

	console.log('New value is', this.value);
});

/**
 * Delete a value
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlInputSelect.setMethod(function removeItem(element) {

	var index;

	if (typeof element == 'number') {
		element = this.type_area.getSiblingByIndex(element);
	}

	if (!element) {
		return;
	}

	index = this.value.indexOf(element.dataset.value);

	if (index > -1) {
		this.value.splice(index, 1);
	}

	element.remove();
});