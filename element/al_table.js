const OLD_ROWS = Symbol('old_rows');

/**
 * The al-table element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
const Table = Function.inherits('Alchemy.Element.Form.WithDataprovider', 'Table');

/**
 * The template code
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.setTemplate(`<header class="aft-header"></header>
<div class="aft-content">
	<table class="aft-table">
		<thead>
			<tr class="aft-column-names"></tr>
			<tr class="aft-column-filters" hidden></tr>
		</thead>
		<tbody></tbody>
		<tfoot></tfoot>
	</table>
</div>
<footer data-he-slot="footer" class="aft-footer"></footer>`, {plain_html: true, render_immediate: true});

/**
 * Getter for the header element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.addElementGetter('header', 'header.aft-header');

/**
 * Getter for the content element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.addElementGetter('content', 'div.aft-content');

/**
 * Getter for the footer element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.addElementGetter('footer', 'footer.aft-footer');

/**
 * Getter for the table element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.addElementGetter('table', 'table.aft-table');

/**
 * Getter for the table body element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.addElementGetter('table_body', 'table.aft-table tbody');

/**
 * Getter for the column names row
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.addElementGetter('column_names_row', 'tr.aft-column-names');

/**
 * Getter for the column filters row
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.addElementGetter('column_filters_row', 'tr.aft-column-filters');

/**
 * Should filters be shown?
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.setAttribute('show-filters', {boolean: true});

/**
 * Which optional view-type to use for field values
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.11
 * @version  0.1.11
 */
Table.setAttribute('view-type');

/**
 * Should existing rows be re-used when new data is loaded?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Table.setAttribute('update-existing-rows', {boolean: true});

/**
 * Look for changes to the show-filters attribute
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.addObservedAttribute('show-filters', function onSF(val) {

	let filters = this.column_filters_row;

	filters.hidden = !val;
});

/**
 * Does this table have actions?
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.setAttribute('has-actions', {boolean: true});

/**
 * Look for changes to the has-actions attribute
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.addObservedAttribute('has-actions', function onHA(val) {

	let cn_actions = this.querySelectorAll('.aft-actions');

	if (val) {
		if (!cn_actions || !cn_actions.length) {
			let col = this.createElement('th');
			col.classList.add('aft-actions');
			this.column_names_row.append(col);

			let rows = this.querySelectorAll('tbody tr'),
			    row,
			    i;

			for (i = 0; i < rows.length; i++) {
				row = rows[i];
				col = this.createElement('td');
				col.classList.add('aft-actions');
				row.append(col);
			}

		}
	} else if (cn_actions && cn_actions.length) {
		let i;

		for (i = 0; i < cn_actions.length; i++) {
			cn_actions[i].remove();
		}
	}
});

/**
 * The field that is being sorted on
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.setAttribute('sort-field');

/**
 * The sort direction (asc/desc)
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.setAttribute('sort-dir');

/**
 * The fieldset property
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.setAssignedProperty('fieldset');

/**
 * The records property
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.setAssignedProperty('records');

/**
 * The filters property
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.setAssignedProperty('filters');

/**
 * Clear all the elements
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.setMethod(function clearAll() {
	this.clearHeaders();
	this.clearBody();
});

/**
 * Clear the header elements
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.setMethod(function clearHeaders() {
	Hawkejs.removeChildren(this.column_names_row);
	Hawkejs.removeChildren(this.column_filters_row);
});

/**
 * Clear the body elements
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.setMethod(function clearBody() {
	Hawkejs.removeChildren(this.table_body);
});

/**
 * Get the current rows by their pk
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @return   {Object<string,HTMLTableRowElement>}
 */
Table.setMethod(function getTableRowsByPk() {

	let result = {},
	    rows = this.table_body.queryAllNotNested('tr[data-pk]'),
	    row,
	    pk,
	    i;

	for (i = 0; i < rows.length; i++) {
		row = rows[i];
		pk = row.dataset.pk;

		if (pk) {
			result[pk] = row;
		}
	}

	return result;
});

/**
 * Get the wanted page
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.11
 *
 * @return   {Number}
 */
Table.setMethod(function getWantedPage() {

	let page = this.page;

	if (page) {
		return page;
	}

	if (this.id) {
		let url = this.getCurrentUrl();

		if (url) {

			let data = url.param('aft');

			if (data && data[this.id]) {
				page = parseInt(data[this.id].page);
			}

			if (isFinite(page) && page > 0) {
				return page;
			}
		}
	}

	return 1;
});

/**
 * Get the wanted sort
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.11
 *
 * @return   {Number}
 */
Table.setMethod(function getWantedSort() {

	let field = this.sort_field,
	    dir = this.sort_dir;

	let result = {
		field : field,
		dir   : dir
	};

	if (field && dir) {
		return result;
	}

	let url_param = this.getBaseUrlParam() + '[sort]',
	    url = this.getCurrentUrl();

	if (!result.field && url) {
		result.field = url.param(url_param + '[field]');
	}

	if (!result.dir && url) {
		result.dir = url.param(url_param + '[dir]');
	}

	result.field = result.field || null;
	result.dir = result.dir || null;

	return result;
});

/**
 * Get the wanted filters
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.11
 *
 * @return   {Object}
 */
Table.setMethod(function getWantedFilters() {

	if (!this.filters) {

		let url = this.getCurrentUrl();

		if (!url) {
			return null;
		}

		let data = url.param('aft');
		let filters;

		if (data && data[this.id]) {
			filters = data[this.id].filters;
		}

		if (filters) {
			this.filters = filters;
		} else {
			return null;
		}
	}

	let result = {},
	    has_filters = false,
	    key,
	    val;

	for (key in this.filters) {
		val = this.filters[key];

		if (val !== '') {
			has_filters = true;
			result[key] = val;
		}
	}

	if (!has_filters) {
		return null;
	}

	return result;
});

/**
 * Get the url param identifier
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {String}
 */
Table.setMethod(function getBaseUrlParam() {
	return 'aft[' + (this.id || 'unknown')  + ']';
});

/**
 * Get the URL of the current state of this table
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.11
 *
 * @return   {RURL}
 */
Table.setMethod(function getCurrentStateUrl() {

	let url = this.getCurrentUrl();

	if (!url) {
		return null;
	}

	let url_param = this.getBaseUrlParam(),
	    page = this.getWantedPage();

	url.param(url_param + '[page]', page);

	let sort = this.getWantedSort();

	url.param(url_param + '[sort]', sort);

	let filters = this.getWantedFilters();
	url.param(url_param + '[filters]', filters);

	return url;
});

/**
 * On new records
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 *
 * @param    {Array}   records
 */
Table.setMethod(function setRecords(records) {

	this.assigned_data.records = records;

	if (this.update_existing_rows) {
		this[OLD_ROWS] = this.getTableRowsByPk();
	} else {
		this[OLD_ROWS] = null;
	}

	this.clearBody();

	let record;

	for (record of records) {
		this.addDataRow(record);
	}

	if (this.update_existing_rows) {
		this[OLD_ROWS] = null;
	}

	this.showPagination();
	this.attachContextMenus();
});

/**
 * Set a filter
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {string}  field
 * @param    {*}       value
 */
Table.setMethod(function setFilter(field, value) {

	if (!this.filters) {
		this.filters = {};
	} else if (this.filters[field] === value) {
		// Ignore same values
		return;
	} else if (this.filters[field] == null && value === '') {
		// Ignore filters when tabbing into them
		return;
	}

	this.filters[field] = value;

	this.loadRemoteData();
});

/**
 * Show the pagination
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Table.setMethod(function showPagination() {

	let records = this.assigned_data.records;

	if (!records || !records.page) {
		return;
	}

	let url = this.getCurrentUrl();

	if (!url) {
		return;
	}

	let pager = this.querySelector('al-pager');

	if (!pager) {
		pager = this.createElement('al-pager');
		this.footer.append(pager);
	}

	pager.src = url;
	pager.url_param = this.getBaseUrlParam();
	pager.page_size = records.page_size;

	pager.showPage(records.page, Math.ceil(records.available / records.page_size));
});

/**
 * Get a fieldset's preferred content view
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.8
 * @version  0.2.0
 *
 * @param    {FieldConfig}   field_config   The config on how to display the field
 * @param    {Object}        container      The container where the field should be in
 *
 * @return   
 */
Table.setMethod(function getFieldConfigView(field_config, container) {

	if (typeof field_config == 'string') {
		field_config = this.fieldset.get(field_config);
	}

	let value = field_config.getValueIn(container),
	    field;
	
	try {
		field = field_config.getFieldDefinition();
	} catch (err) {
		console.error('Failed to get field definition:', err);
	}
	
	if (value == null && !field) {
		return null;
	}

	// Fallback to simple text view
	if (!field) {
		let text = field_config.getDisplayValueIn(container);

		return Hawkejs.createText(text);
	}

	let alchemy_field = this.createElement('al-field');
	alchemy_field.purpose = this.purpose || 'view';
	alchemy_field.mode = this.mode || 'inline';

	alchemy_field.applyOptions(field_config.options);

	//alchemy_field.view_type = this.view_type || 'view_inline';
	alchemy_field.field_name = field.name;
	alchemy_field.config = field;
	alchemy_field.original_value = value;

	return alchemy_field;
});

/**
 * Create and add a datarow
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.11
 * @version  0.1.11
 *
 * @param    {Object}   entry
 *
 * @return   <TR>
 */
Table.setMethod(function addDataRow(entry) {

	if (!entry) {
		entry = {};
	}

	let tr = this.createDataRow(entry);

	if (!tr) {
		return;
	}

	this.table_body.append(tr);

	return tr;
});

/**
 * Create a datarow
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 *
 * @param    {Object}   entry
 *
 * @return   <TR>
 */
Table.setMethod(function createDataRow(entry) {

	if (!entry) {
		throw new Error('Unable to create datarow without data');
	}

	let field_set_config,
	    is_existing_row,
	    tr,
	    id = entry.$pk || entry._id || entry.id;
	
	if (id && this[OLD_ROWS] && this[OLD_ROWS][id]) {
		tr = this[OLD_ROWS][id];
		is_existing_row = true;
	} else {
		tr = this.createElement('tr');
	}
	
	if (id) {
		tr.dataset.pk = id;
	}

	for (field_set_config of this.fieldset) {

		let create_new_contents = true,
		    td;

		if (is_existing_row && field_set_config.path) {
			td = tr.querySelector('td[data-path="' + field_set_config.path + '"]');

			if (td) {
				let checksum = Object.checksum(field_set_config.getValueIn(entry));

				if (td.dataset.checksum == checksum) {
					create_new_contents = false;
				} else {
					Hawkejs.removeChildren(td);
				}
			}
		}
		
		if (!td) {
			td = this.createElement('td');
			td.dataset.path = field_set_config.path;
		}

		if (create_new_contents) {
			let element = this.getFieldConfigView(field_set_config, entry);

			if (element) {
				if (this.update_existing_rows) {
					let checksum = Object.checksum(element.original_value);
					td.dataset.checksum = checksum;
				}

				td.append(element);
			}
		}

		if (!is_existing_row) {
			tr.append(td);
		}
	}

	if (this.has_actions) {

		let td;

		if (is_existing_row) {
			td = tr.querySelector('td.aft-actions');
			if (td) {
				Hawkejs.removeChildren(td);
			}
		}

		if (!td) {
			td = this.createElement('td');
			td.classList.add('aft-actions');
			tr.append(td);
		}

		let actions = this.getEntryActions(entry, 'row');

		if (actions && actions.length) {

			let action,
			    element;

			// Iterate over all the defined actions
			for (action of actions) {

				element = action.constructElement(this);

				if (!element) {
					continue;
				}

				td.append(element);
			}
		}

		tr.append(td);
	}

	return tr;
});

/**
 * Get a list of actions
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.6
 *
 * @param    {Object}   record
 * @param    {Stirng}   filter
 * 
 * @return   {Alchemy.Form.Action.Action[]}
 */
Table.setMethod(function getEntryActions(record, filter) {

	let result = [];

	if (!record) {
		return result;
	}

	let actions;

	if (record.$hold && record.$hold.actions) {
		actions = record.$hold.actions;
	} else {
		actions = record.$actions;
	}

	if(!actions || !actions.length) {
		return result;
	}

	for (let action of actions) {

		if (!action.type) {
			action.type = 'url';
		}

		// Make sure it's an action instance
		action = Classes.Alchemy.Form.Action.Action.cast(action);

		if (!action || (filter && !action.isAllowedIn(filter))) {
			continue;
		}

		result.push(action);
	}

	return result;
});

/**
 * Add context menus to rows
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.6
 * @version  0.1.8
 *
 * @param    {Object}   entry
 */
Table.setMethod(function attachContextMenus() {

	if (!Blast.isBrowser) {
		return;
	}

	if (!this.assigned_data.records || !this.assigned_data.records.length) {
		return;
	}

	for (let record of this.assigned_data.records) {

		let context_actions = this.getEntryActions(record, 'context');

		if (!context_actions || !context_actions.length) {
			continue;
		}

		let pk = record.$pk || record._id || record.id;

		if (!pk) {
			continue;
		}

		let tr = this.querySelector('[data-pk="' + pk + '"]');

		if (!tr) {
			continue;
		}

		tr.addEventListener('contextmenu', e => {

			// Ignore right clicks on certain elements
			if (e && e.target) {
				if (e.target.closest('a')) {
					return;
				}
			}

			this.selectRow(tr);

			let menu = this.createElement('he-context-menu');

			for (let action of context_actions) {
				action.addToContextMenu(menu);
			}

			menu.show(e);
		});
	}
});

/**
 * On new fieldset
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.12
 */
Table.setMethod(function onFieldsetAssignment(value, old_value) {

	let filter_row = this.column_filters_row,
	    names_row = this.column_names_row,
	    anchor,
	    input,
	    field,
	    span,
	    icon,
	    col;

	this.clearAll();

	if (!(value instanceof Classes.Alchemy.Criteria.FieldSet)) {
		if (Array.isArray(value)) {
			value = Classes.Alchemy.Criteria.FieldSet.fromArray(value);
		} else {
			value = Classes.Alchemy.Criteria.FieldSet.unDry(value);
		}
	}

	if (!this.filters) {
		this.getWantedFilters();
	}

	for (field of value) {
		col = this.createElement('td');
		span = this.createElement('span');
		span.textContent = field.title;

		if (field.options.sortable !== false) {
			col.classList.add('sortable');
			icon = this.createElement('al-icon');
			icon.setAttribute('type', 'sorting-arrow');

			// Wrap it in an anchor
			anchor = this.createElement('a');
			anchor.classList.add('sorting-anchor');
			anchor.dataset.field = field.path;
			anchor.dataset.sortDir = 'asc';
			anchor.append(span);
			anchor.append(icon);
			col.append(anchor);
		} else {
			// Only add the span
			col.append(span);
		}

		names_row.append(col);

		col = this.createElement('th');

		if (field.options.filter !== false) {
			input = this.createElement('input');
			input.dataset.field = field.path;
			input.classList.add('filter');
			input.setAttribute('type', 'search');
			input.setAttribute('aria-label', 'Filter ' + field.title);

			// If filters have been defined already, put it in the value
			if (this.filters && this.filters[field.path]) {
				input.setAttribute('value', this.filters[field.path]);
			}

			col.append(input);
		}

		filter_row.append(col);
	}

	if (this.has_actions) {
		col = this.createElement('td');
		names_row.append(col);

		col = this.createElement('td');
		filter_row.append(col);
	}

	this.updateAnchors();

	return value;
});

/**
 * Update the sort anchors
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 *
 * @param    {String|RURL}   base_url
 */
Table.setMethod(function updateAnchors(base_url) {

	if (!base_url) {
		base_url = this.getCurrentStateUrl();
	} else {
		base_url = RURL.parse(base_url);
	}

	if (!base_url) {
		return;
	}

	let anchors = this.querySelectorAll('a.sorting-anchor'),
	    anchor,
	    url,
	    i;

	let base_param = this.getBaseUrlParam(),
	    sort_param = base_param + '[sort]';

	let sort = this.getWantedSort(),
	    ico;

	for (i = 0; i < anchors.length; i++) {
		anchor = anchors[i];

		ico = anchor.querySelector('al-icon');

		ico.classList.remove('up');
		ico.classList.remove('down');

		if (anchor.dataset.field == sort.field) {
			if (sort.dir == 'asc') {
				ico.classList.add('up');
				anchor.dataset.sortDir = 'desc';
			} else {
				ico.classList.add('down');
				anchor.dataset.sortDir = 'asc';
			}
		}

		url = base_url.clone();
		url.param(sort_param + '[field]', anchor.dataset.field);
		url.param(sort_param + '[dir]', anchor.dataset.sortDir);
		anchor.setAttribute('href', url);
	}

	let pager = this.querySelector('al-pager');

	if (pager) {
		pager.src = base_url;
	}
});

/**
 * On new dataset
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.setMethod(function onRecordsAssignment(value, old_value) {
	this.setRecords(value);
});

/**
 * Select a row
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.11
 *
 * @param    <TR>
 */
Table.setMethod(function selectRow(row) {

	let child,
	    i;

	// Unselect all other rows
	for (i = 0; i < this.table_body.children.length; i++) {
		child = this.table_body.children[i];

		child.classList.remove('aft-selected');
	}

	if (row) {
		row.classList.add('aft-selected');
	}
});

/**
 * Construct the config object used to fetch data
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Table.setMethod(function getRemoteFetchConfig() {

	let config = {
		fields : this.fieldset.toJSON(),
	};

	if (this.page_size) {
		config.page_size = this.page_size;
		config.page = this.getWantedPage();
	}

	config.sort = this.getWantedSort();
	config.filters = this.getWantedFilters();

	return config;
});

/**
 * Apply the fetched data
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
Table.setMethod(function applyFetchedData(err, result, config) {

	if (err) {
		console.error(err);
		return;
	}

	let records;

	if (Array.isArray(result)) {
		records = result;
	} else {
		records = result.records;
	}

	this.records = records;
	this.updateAnchors();

	if (Blast.isBrowser) {
		let current_url = this.getCurrentStateUrl();
		history.pushState(null, document.title, current_url+'');
	}
});

/**
 * Sort the data
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.1
 * @version  0.1.1
 */
Table.setMethod(function sortData() {

	// If a datasource is set,
	// let that handle the sorting
	if (this.src) {
		return this.loadRemoteData();
	}

	let records = this.records,
	    sort = this.getWantedSort();

	let direction = sort.dir == 'asc' ? 1 : -1;

	records.sortByPath(direction, sort.field);

	this.records = records;

	this.updateAnchors();
});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.2.0
 */
Table.setMethod(function introduced() {

	const that = this;

	this.attachContextMenus();

	this.addEventListener('click', function onClick(e) {

		let target = e.target,
		    sorting_anchor = target.queryUp('a.sorting-anchor');

		if (sorting_anchor) {
			e.preventDefault();

			that.sort_field = sorting_anchor.dataset.field;
			that.sort_dir = sorting_anchor.dataset.sortDir;

			that.sortData();

			return;
		}

		if (that.table_body.contains(target)) {
			that.selectRow(target.queryParents('tr'));
			return;
		}
	});

	this.column_filters_row.addEventListener('change', e => {

		let input = e.target;

		if (input && input.dataset.field) {
			this.setFilter(input.dataset.field, input.value);
		}
	});

	this.column_filters_row.addEventListener('keyup', Function.throttle(e => {

		let input = e.target;

		if (!input) {
			return;
		}

		let value = input.value;

		if (value == null || (value.length == 1)) {
			return;
		}

		if (input && input.dataset.field) {
			this.setFilter(input.dataset.field, input.value);
		}
	}, 300, false, true));

	let pager = this.querySelector('al-pager');

	if (pager) {
		pager.addEventListener('pager-request', function requestPage(e) {

			if (e.detail.click_event) {
				e.detail.click_event.preventDefault();
			}

			// @TODO: I don't like using the attribute like this
			that.page = e.detail.page_nr;
			that.loadRemoteData();
		});
	}
});