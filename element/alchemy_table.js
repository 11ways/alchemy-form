/**
 * The alchemy-table element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
const Table = Function.inherits('Alchemy.Element.Form.Base', 'Table');

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
<footer class="aft-footer"></footer>`, {plain_html: true, render_immediate: true});

/**
 * The stylesheet to load for this element
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.setStylesheetFile('form/alchemy_table');

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
 * The page attribute
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.setAttribute('page', {number: true});

/**
 * The page-size attribute
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.setAttribute('page-size', {number: true});

/**
 * Should filters be shown?
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.setAttribute('show-filters', {boolean: true});

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
 * The records property
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.setAssignedProperty('recordsource', null, function onRecordsource(value) {
	this.setRecordsource(value);
	return value;
});

/**
 * Look for a new src value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.enforceProperty(function src(new_value, old_value) {

	if (new_value == old_value) {
		return new_value;
	}

	this.setAttributeSilent('src', new_value);

	return new_value;
});

/**
 * Look for a new src value
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.addObservedAttribute('src', function onSource(src) {
	this.src = src;
});

/**
 * Clear the header elements
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {*}   config
 */
Table.setMethod(function setRecordsource(config) {

	let url;

	if (typeof config == 'object') {
		url = alchemy.routeUrl(config.route, config.parameters);
	} else {
		url = config;
	}

	if (url == '#') {
		url = ''+this.getCurrentUrl();
	}

	this.src = url;

	this.loadRemoteData();
});

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
 * Get the wanted page
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
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

		let data = url.param('aft');

		if (data && data[this.id]) {
			page = parseInt(data[this.id].page);
		}

		if (isFinite(page) && page > 0) {
			return page;
		}
	}

	return 1;
});

/**
 * Get the wanted sort
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
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

	if (!result.field) {
		result.field = url.param(url_param + '[field]');
	}

	if (!result.dir) {
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
 * @version  0.1.0
 *
 * @return   {Object}
 */
Table.setMethod(function getWantedFilters() {

	if (!this.filters) {

		let url = this.getCurrentUrl();
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
 * @version  0.1.0
 *
 * @return   {RURL}
 */
Table.setMethod(function getCurrentStateUrl() {

	let url_param = this.getBaseUrlParam(),
	    page = this.getWantedPage(),
	    url = this.getCurrentUrl();

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
 * @version  0.1.0
 *
 * @param    {Array}   records
 */
Table.setMethod(function setRecords(records) {

	this.assigned_data.records = records;

	this.clearBody();

	let record;

	for (record of records) {
		this.table_body.append(this.createDataRow(record));
	}

	this.showPagination();
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
 * @version  0.1.0
 */
Table.setMethod(function showPagination() {

	let records = this.assigned_data.records;

	if (!records || !records.page) {
		return;
	}

	let pager = this.querySelector('alchemy-pager');

	if (!pager) {
		pager = this.createElement('alchemy-pager');
		this.footer.append(pager);
	}

	pager.src = this.getCurrentUrl();
	pager.url_param = this.getBaseUrlParam();

	pager.showPage(records.page, Math.ceil(records.available / records.page_size));
});

/**
 * Create a datarow
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.1
 *
 * @param    {Object}   entry
 *
 * @return   <TR>
 */
Table.setMethod(function createDataRow(entry) {

	let field,
	    value,
	    tr = this.createElement('tr'),
	    td;

	for (field of this.fieldset) {
		td = this.createElement('td');

		value = field.getDisplayValueIn(entry);

		if (value != null) {
			td.textContent = value;
		}

		tr.append(td);
	}

	if (this.has_actions) {
		td = this.createElement('td');
		td.classList.add('aft-actions');
		tr.append(td);

		let actions;

		if (entry.$hold && entry.$hold.actions) {
			actions = entry.$hold.actions;
		} else {
			actions = entry.$actions;
		}

		if (actions && actions.length) {
			let action,
			    anchor;

			for (action of actions) {
				anchor = this.createElement('a');
				anchor.dataset.name = action.name;

				if (action.icon) {
					let alico = this.createElement('al-ico');
					alico.setAttribute('type', action.icon);
					anchor.append(alico);
				} else {
					anchor.textContent = action.title || action.name;
				}

				anchor.setAttribute('href', action.url);
				td.append(anchor);
			}
		}

		tr.append(td);
	}

	return tr;
});

/**
 * On new fieldset
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
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
			icon = this.createElement('al-ico');
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
 * @version  0.1.0
 *
 * @param    {String|RURL}   base_url
 */
Table.setMethod(function updateAnchors(base_url) {

	if (!base_url) {
		base_url = this.getCurrentStateUrl();
	} else {
		base_url = RURL.parse(base_url);
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

		ico = anchor.querySelector('al-ico');

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

	let pager = this.querySelector('alchemy-pager');

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
 * @version  0.1.0
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

	row.classList.add('aft-selected');
});

/**
 * Load the remote data
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.setMethod(function loadRemoteData() {

	let that = this,
	    src = this.src;

	let body = {
		fields : this.fieldset.toJSON(),
	};

	if (this.page_size) {
		body.page_size = this.page_size;
		body.page = this.getWantedPage();
	}

	body.sort = this.getWantedSort();
	body.filters = this.getWantedFilters();

	let options = {
		href : this.src,
		post : true,
		body : body
	};

	this.delayAssemble(async function() {

		let result = await that.getResource(options);

		if (!result) {
			return;
		}

		let records = result.records;

		that.records = records;

		that.updateAnchors();

		if (Blast.isBrowser) {
			let current_url = that.getCurrentStateUrl();
			history.pushState(null, document.title, current_url+'');
		}
	});
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

	console.log('Wanted sort:', sort);

	records.sortByPath(direction, sort.field);

	this.records = records;

	this.updateAnchors();

});

/**
 * Added to the DOM for the first time
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Table.setMethod(function introduced() {

	const that = this;

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

	let pager = this.querySelector('alchemy-pager');

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