/**
 * The base form element with dataproviders
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
const WithDataprovider = Function.inherits('Alchemy.Element.Form.Base', 'WithDataprovider');

/**
 * This is a static class (so it won't be registered)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
WithDataprovider.makeAbstractClass();

/**
 * The method to use for src requests
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
WithDataprovider.setAttribute('method');

/**
 * The page attribute
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
WithDataprovider.setAttribute('page', {number: true});

/**
 * The page-size attribute
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
WithDataprovider.setAttribute('page-size', {number: true});

/**
 * Keep track of the loadRemote calls
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
WithDataprovider.setProperty('load_remote_counter', 0);

/**
 * The dataprovider is an instance of something that will load
 * the remote data for this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
WithDataprovider.setAssignedProperty('dataprovider');

/**
 * The records property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
WithDataprovider.setAssignedProperty('recordsource', null, function onRecordsource(value) {
	this.setRecordsource(value);
	return value;
});

/**
 * Look for a new src value
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
WithDataprovider.enforceProperty(function src(new_value, old_value) {

	if (new_value == old_value) {
		return new_value;
	}

	this.setAttributeSilent('src', new_value);

	return new_value;
});

/**
 * Can we fetch remote data?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
WithDataprovider.setProperty(function can_fetch_remote_data() {
	return !!(this.src || this.dataprovider);
});

/**
 * Observe SRC attribute
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
WithDataprovider.addObservedAttribute('src', function onSource(src) {
	this.src = src;
});

/**
 * The method to construct the config object used for fetching data
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
WithDataprovider.setAbstractMethod('getRemoteFetchConfig');

/**
 * Apply the fetched data to this element
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 */
WithDataprovider.setAbstractMethod('applyFetchedData');

/**
 * Set the recordsource
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @param    {*}   config
 */
WithDataprovider.setMethod(function setRecordsource(config) {

	let url;

	if (typeof config == 'object') {
		let route_config = alchemy.routeConfig(config.route);

		if (route_config?.methods && !this.method) {
			if (route_config.methods.indexOf('post') > -1) {
				this.method = 'post';
			} else {
				this.method = route_config.methods[0];
			}
		}

		url = alchemy.routeUrl(config.route, config.parameters);
	} else {
		url = config;
	}

	if (url == '#') {
		let current_url = this.getCurrentUrl();

		if (current_url) {
			url = ''+current_url;
		}
	}

	this.src = url;

	this.loadRemoteData();
});

/**
 * Get the wanted page
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.0
 *
 * @return   {Number}
 */
WithDataprovider.setMethod(function getWantedPage() {

	let page = this.page;

	if (page) {
		return page;
	}

	return 1;
});

/**
 * Load the remote data and apply it
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.2.9
 *
 * @param    {Object}   fetch_config
 */
WithDataprovider.setMethod(function loadRemoteData(fetch_config) {

	let pledge = new Classes.Pledge();

	let config = this.getRemoteFetchConfig(fetch_config);

	if (fetch_config && fetch_config != config) {
		Object.assign(config, fetch_config);
	}

	if (!config) {
		pledge.resolve(false);
		return pledge;
	}

	let load_remote_id = ++this.load_remote_counter;

	this.delayAssemble(async () => {

		if (load_remote_id != this.load_remote_counter) {
			pledge.resolve(false);
			return;
		}

		let result,
		    error;

		try {
			result = await this.fetchRemoteData(config);
		} catch (err) {
			error = err;
		}

		if (load_remote_id != this.load_remote_counter) {
			pledge.resolve(false);
			return;
		}

		this.applyFetchedData(error, result, config);

		pledge.resolve(true);
	});

	return pledge;
});

/**
 * Actually fetch the remote data
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.0
 * @version  0.3.0
 *
 * @param    {Object}   config
 *
 * @return   {Pledge}
 */
WithDataprovider.setMethod(function fetchRemoteData(config) {

	let pledge;

	if (this.dataprovider) {
		pledge = Pledge.Swift.cast(this.dataprovider.loadData(config, this));
	} else {

		let method = (this.method || 'get').toLowerCase();

		let fetch_options = {
			href     : this.src,
			[method] : config,
		};

		pledge = this.hawkejs_helpers.Alchemy.getResource(fetch_options);
	}

	return pledge;
});