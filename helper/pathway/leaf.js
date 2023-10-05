/**
 * A Pathway tree
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @param    {Leaf}   parent   Optional parent leaf
 */
const Leaf = Function.inherits('Alchemy.Base', 'Alchemy.Form.Pathway', function Leaf(id, parent) {

	// The id of this leaf
	this.id = id;

	// The parent leaf
	this.parent = parent;

	// The children
	this.children = [];

	// The data provider
	this._provider = null;
});

/**
 * Undry
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @param    {Object}           obj
 * @param    {Boolean|String}   cloned
 *
 * @return   {Leaf}
 */
Leaf.setStatic(function unDry(obj) {

	let result = new this(obj.id);

	if (obj.children) {
		for (let child of obj.children) {
			child.parent = result;
		}

		result.children = obj.children;
	}

	result._provider = obj.provider;

	return result;
});

/**
 * Get the displaytitle of this leaf
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @return   {Microcopy}
 */
Leaf.setMethod(function getDisplayTitle() {

	let key = 'pathway-leaf-title',
	    params = {leaf_id: this.id};

	return new Classes.Alchemy.Microcopy(key, params);
});

/**
 * Add a new child
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @return   {Leaf}
 */
Leaf.setMethod(function addChild(id) {

	let leaf = new Leaf(id, this);

	this.children.push(leaf);

	return leaf;
});

/**
 * Set the data provider
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 */
Leaf.setMethod(function setProvider(provider) {
	this._provider = provider;
});

/**
 * Get the data provider
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @return   {DataProvider}
 */
Leaf.setMethod(function getProvider() {

	if (typeof this._provider == 'string') {
		let provider = new Classes.Alchemy.DataProvider.Remote();
		provider.source = alchemy.routeUrl(this._provider);

		provider.context = {
			leaf_id : this.id
		};

		return provider;
	}

});


/**
 * Get the given page
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @return   {DataProvider}
 */
Leaf.setMethod(async function getPage(page_nr) {

	let provider = this.getProvider();

	if (!provider) {
		return;
	}

	let records = await provider.getAll();

	return records;
});

/**
 * Return an object for json-drying this document
 *
 * @author   Jelle De Loecker <jelle@elevenways.be>
 * @since    0.2.6
 * @version  0.2.6
 *
 * @return   {Object}
 */
Leaf.setMethod(function toDry() {

	let result = {
		value : {
			id       : this.id,
			provider : this._provider,
			children : this.children,
		}
	};

	return result;
});
