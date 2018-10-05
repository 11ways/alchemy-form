/**
 * The base class for all other alchemy-form elements
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
var AlFormBase = Function.inherits('Alchemy.Element', function AlFormBase() {
	AlFormBase.super.call(this);
});

/**
 * The form it belongs to
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlFormBase.setAssignedProperty('form');

/**
 * The optional field this input belongs to
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlFormBase.setAssignedProperty('field');

/**
 * The al-input
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlFormBase.setAssignedProperty('input');

/**
 * The options property (will be stored in assigned_data)
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlFormBase.setAssignedProperty('options', function get_options(options) {

	// Make sure "options" is an object
	if (!options) {
		options = {};
		this.assigned_data.options = options;
	}

	return options;
});

/**
 * The view
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlFormBase.setProperty(function view() {
	return (this.form && this.form.view) || (this.field && this.field.view) || this.hawkejs_view;
});

/**
 * Get the content for hawkejs
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlFormBase.setMethod(function getContent(callback) {

	var that = this;

	if (!callback) {
		callback = Function.thrower;
	}

	if (!this.get_content_pledge) {
		this.get_content_pledge = new Blast.Classes.Pledge();
	}

	this.makeContent(function madeContent(err) {

		if (err) {
			callback(err);
			that.get_content_pledge.reject(err);
			return;
		}

		callback(null);
		that.get_content_pledge.resolve();
	});

	if (this.waiting_for_pledge) {
		while (this.waiting_for_pledge.length) {
			this.get_content_pledge.handleCallback(this.waiting_for_pledge.pop());
		}
	}
});

/**
 * Make content placeholder
 *
 * @author   Jelle De Loecker <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
AlFormBase.setMethod(function makeContent(callback) {
	return callback(new Error('Element "' + this.constructor.name + '" has no makeContent method'));
});